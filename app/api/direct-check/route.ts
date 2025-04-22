import { NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';

// 创建模块专用日志记录器
const logger = createLogger('api-direct-check');

// 直接使用fetch而不是OpenAI客户端
export async function GET() {
  logger.info('开始直接检查API配置');
  
  try {
    // 检查API密钥是否存在
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      logger.error('API密钥未配置');
      return NextResponse.json({
        status: 'error',
        message: 'OpenAI API密钥未配置',
        configured: false
      }, { status: 500 });
    }
    
    // 提取API密钥的前4个字符和后4个字符
    const keyPrefix = apiKey.substring(0, 4);
    const keySuffix = apiKey.substring(apiKey.length - 4);
    const maskedKey = `${keyPrefix}...${keySuffix}`;
    
    logger.info('API密钥已配置', { maskedKey, length: apiKey.length });
    
    // 使用原生fetch直接调用OpenAI API
    logger.info('开始直接调用OpenAI API');
    const startTime = Date.now();
    
    try {
      // 设置30秒超时
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);
      
      const response = await fetch('https://api.openai.com/v1/models', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      const endTime = Date.now();
      
      if (!response.ok) {
        const errorText = await response.text();
        logger.error('API返回错误', { 
          status: response.status, 
          statusText: response.statusText,
          body: errorText
        });
        
        return NextResponse.json({
          status: 'error',
          message: `API返回错误: ${response.status} ${response.statusText}`,
          configured: true,
          key: maskedKey,
          error: errorText,
          responseInfo: {
            status: response.status,
            statusText: response.statusText
          }
        }, { status: response.status });
      }
      
      const data = await response.json();
      const models = data.data || [];
      
      logger.info('API直接连接成功', { 
        duration: endTime - startTime,
        models: models.length,
        firstModel: models[0]?.id
      });
      
      return NextResponse.json({
        status: 'success',
        message: '直接API连接成功',
        configured: true,
        models: models.length,
        key: maskedKey,
        duration: endTime - startTime,
        responseStatus: response.status
      });
    } catch (apiError: any) {
      logger.error('直接API连接失败', {
        name: apiError.name,
        message: apiError.message
      });
      
      let errorMessage = '直接API连接失败';
      let statusCode = 500;
      
      if (apiError.name === 'AbortError') {
        errorMessage = '请求超时，30秒内未收到响应';
        statusCode = 408;
      } else if (apiError.message?.includes('ENOTFOUND') || apiError.message?.includes('ETIMEDOUT')) {
        errorMessage = '网络连接问题，无法连接到OpenAI服务器';
        statusCode = 503;
      } else if (apiError.message?.includes('certificate')) {
        errorMessage = 'SSL/TLS证书问题，可能需要配置代理';
        statusCode = 495;
      }
      
      return NextResponse.json({
        status: 'error',
        message: errorMessage,
        configured: true,
        key: maskedKey,
        error: apiError.message,
        errorName: apiError.name
      }, { status: statusCode });
    }
  } catch (error: any) {
    logger.error('直接API检查过程发生意外错误', {
      message: error.message,
      stack: error.stack
    });
    
    return NextResponse.json({
      status: 'error',
      message: '检查API配置时发生错误: ' + error.message,
      configured: false,
      error: error.message
    }, { status: 500 });
  }
} 