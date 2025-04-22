import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createLogger } from '@/lib/logger';

// 创建模块专用日志记录器
const logger = createLogger('api-check');

// 设置超时时间
const TIMEOUT_MS = 10000; // 10秒

// 包装超时逻辑
const withTimeout = <T>(promise: Promise<T>, timeoutMs: number): Promise<T> => {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      clearTimeout(timeoutId);
      reject(new Error(`请求超时，超过 ${timeoutMs}ms`));
    }, timeoutMs);

    promise
      .then((result) => {
        clearTimeout(timeoutId);
        resolve(result);
      })
      .catch((error) => {
        clearTimeout(timeoutId);
        reject(error);
      });
  });
};

export async function GET() {
  logger.info('检查API配置开始');
  
  try {
    // 检查API密钥是否存在
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      logger.error('API密钥未配置');
      return NextResponse.json({
        status: 'error',
        message: 'OpenAI API密钥未配置，请在.env.local文件中设置OPENAI_API_KEY',
        configured: false,
        env: Object.keys(process.env).includes('OPENAI_API_KEY') ? 'exists_but_empty' : 'missing'
      }, { status: 500 });
    }
    
    // 验证API密钥格式
    if (!apiKey.startsWith('sk-') || apiKey.length < 20) {
      logger.error('API密钥格式不正确', { keyStartsWith: apiKey.substring(0, 3) });
      return NextResponse.json({
        status: 'error',
        message: 'API密钥格式不正确，OpenAI API密钥应该以sk-开头',
        configured: false,
        keyFormat: 'invalid'
      }, { status: 400 });
    }

    // 提取API密钥的前4个字符和后4个字符，保护隐私
    const keyPrefix = apiKey.substring(0, 4);
    const keySuffix = apiKey.substring(apiKey.length - 4);
    const maskedKey = `${keyPrefix}...${keySuffix}`;
    
    logger.info('API密钥已配置', { maskedKey, length: apiKey.length });
    
    // 创建OpenAI客户端
    logger.info('创建OpenAI客户端');
    const openai = new OpenAI({
      apiKey: apiKey,
      timeout: TIMEOUT_MS,
      baseURL: 'https://api.openai.com/v1',
      maxRetries: 0 // 不重试，更快失败
    });
    
    try {
      // 尝试一个简单的API调用，使用超时包装
      logger.info('开始调用OpenAI Models API');
      const startTime = Date.now();
      // api url https://api.openai.com/v1/models
      
      const models = await withTimeout(openai.models.list(), TIMEOUT_MS);
      
      const endTime = Date.now();
      
      // 记录可用的模型数量
      logger.info('API连接成功', { 
        duration: endTime - startTime,
        models: models.data.length,
        firstModel: models.data[0]?.id
      });
      
      return NextResponse.json({
        status: 'success',
        message: 'API密钥配置正确，连接成功',
        configured: true,
        models: models.data.length,
        key: maskedKey,
        duration: endTime - startTime
      });
    } catch (apiError: any) {
      logger.error('API连接测试失败', {
        message: apiError.message,
        status: apiError.status,
        type: apiError.type
      });
      
      let errorMessage = 'API连接失败';
      let statusCode = 500;
      
      if (apiError.message?.includes('timeout')) {
        errorMessage = 'API请求超时，可能是网络问题或服务器响应慢';
        statusCode = 408;
      } else if (apiError.status === 401) {
        errorMessage = 'API密钥无效，请检查密钥是否正确';
        statusCode = 401;
      } else if (apiError.status === 429) {
        errorMessage = '超出API调用限制，请稍后再试';
        statusCode = 429;
      } else if (apiError.message?.includes('ENOTFOUND') || apiError.message?.includes('ETIMEDOUT')) {
        errorMessage = '网络连接问题，无法连接到OpenAI服务器';
        statusCode = 503;
      }
      
      return NextResponse.json({
        status: 'error',
        message: errorMessage,
        configured: true,
        error: apiError.message,
        key: maskedKey,
        details: {
          type: apiError.type,
          status: apiError.status
        }
      }, { status: statusCode });
    }
  } catch (error: any) {
    // 捕获整个检查过程中的所有其他错误
    logger.error('API检查过程发生意外错误', {
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