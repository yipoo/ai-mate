import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createLogger } from '@/lib/logger';

// 创建模块专用日志记录器
const logger = createLogger('openai-api');

// 创建 OpenAI 客户端
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // 从环境变量获取API密钥
});

// 超时设置（毫秒）
const API_TIMEOUT = 30000;

// 以Promise方式包装setTimeout，用于实现请求超时
const timeout = (ms: number) => new Promise((_, reject) => 
  setTimeout(() => reject(new Error(`请求超时(${ms}ms)`)), ms)
);

// API调用函数，添加超时和更完整的错误处理
async function callOpenAI(prompt: string, maxTokens: number = 1000) {
  logger.info('开始调用OpenAI API');
  
  // 检查API密钥
  if (!process.env.OPENAI_API_KEY) {
    logger.error('API密钥未设置', '缺少环境变量OPENAI_API_KEY');
    throw new Error('OpenAI API密钥未配置');
  }

  // 记录当前网络状态，如果可能的话
  try {
    const online = typeof navigator !== 'undefined' && navigator.onLine;
    logger.info('网络状态', { online });
  } catch {
    // 服务器环境可能没有navigator
  }

  const startTime = Date.now();
  
  try {
    // 使用Promise.race来实现超时
    const result = await Promise.race([
      openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "你是一位专业的社交媒体营销专家，擅长为各种产品撰写简短有吸引力的社交媒体文案。"
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: maxTokens,
      }),
      timeout(API_TIMEOUT)
    ]) as OpenAI.Chat.Completions.ChatCompletion;
    
    const endTime = Date.now();
    logger.info(`API调用成功，耗时 ${endTime - startTime}ms`, { 
      model: result.model,
      usage: result.usage
    });
    
    return result;
  } catch (error: any) {
    const endTime = Date.now();
    
    // 详细记录错误信息
    if (error.message?.includes('timeout')) {
      logger.error(`API调用超时，已经等待 ${endTime - startTime}ms`, error);
      throw new Error(`OpenAI API调用超时(${API_TIMEOUT}ms)`);
    }
    
    // 处理常见的OpenAI API错误
    let errorMessage = '未知错误';
    let errorDetails = {};
    
    if (error.status === 401) {
      errorMessage = 'API密钥无效';
      errorDetails = { type: 'auth_error' };
    } else if (error.status === 429) {
      errorMessage = '超出API调用限制';
      errorDetails = { type: 'rate_limit' };
    } else if (error.status >= 500) {
      errorMessage = 'OpenAI服务器错误';
      errorDetails = { type: 'server_error', status: error.status };
    }
    
    // 记录错误的详细信息
    logger.error(`API调用失败: ${errorMessage}`, {
      error: error.message,
      stack: error.stack,
      details: errorDetails,
      duration: endTime - startTime
    });
    
    throw new Error(`OpenAI API调用失败: ${errorMessage}`);
  }
}

export async function POST(request: NextRequest) {
  logger.info('收到文案生成请求');
  
  try {
    const body = await request.json();
    logger.info('请求参数', body);
    
    const { product, platform, scene, style, wordCount = 100, description = '' } = body;

    // 验证所需字段
    if (!product || !platform || !scene || !style) {
      logger.error('参数缺失', { product, platform, scene, style });
      return NextResponse.json(
        { error: '缺少必要参数' },
        { status: 400 }
      );
    }

    // 验证字数范围
    const validatedWordCount = Math.min(Math.max(Number(wordCount) || 100, 50), 500);

    // 检查 API 密钥是否配置
    if (!process.env.OPENAI_API_KEY) {
      logger.error('OpenAI API 密钥未配置', '');
      return NextResponse.json(
        { error: 'API 配置错误，请联系管理员' },
        { status: 500 }
      );
    }

    // 构建Prompt模板
    const prompt = `
      你是一位擅长写社交平台文案的运营专家。
      请根据以下要求生成5条吸引人的文案：

      产品名称：${product}
      产品描述：${description || '无'}
      平台：${platform}
      类型：${scene}
      风格：${style}
      字数限制：每条文案必须严格控制在${validatedWordCount}字左右

      请突出用户痛点与产品卖点，加入适当 emoji，适合在${platform}上发布。
      请确保每条文案风格独特，文案之间用###分隔。
      
      重要提示：
      1. 请严格控制每条文案的长度为${validatedWordCount}字左右
      2. 内容要紧扣产品和主题
      3. 风格与所选平台和目标受众匹配
    `;

    logger.info('准备调用 OpenAI API', { 
      model: "gpt-3.5-turbo", 
      promptLength: prompt.length,
      targetWordCount: validatedWordCount
    });

    // 根据目标字数适当调整max_tokens
    // 中文大约每个字对应1.5-2个token
    const estimatedMaxTokens = validatedWordCount * 5 * 2 + 200; // 5篇文案 + 额外空间

    try {
      // 使用改进的调用函数
      const completion = await callOpenAI(prompt, estimatedMaxTokens);

      // 提取生成的文案
      const generatedText = completion.choices[0].message.content || "";
      logger.info('生成的原始文本', { textLength: generatedText.length, text: generatedText });
      
      // 将文本按###分隔符拆分为多条文案（更加可靠的分隔方式）
      const rawCopywritings = generatedText
        .split('###')
        .map((text: string) => text.trim())
        .filter((text: string) => text !== '');
      
      // 限制只返回至多5条文案
      const copywritings = rawCopywritings.slice(0, 5);
      logger.info('处理后的文案', { count: copywritings.length, copywritings });

      return NextResponse.json({ copywritings });
    } catch (apiError: any) {
      logger.error('OpenAI API 调用失败', apiError);
      return NextResponse.json(
        { error: '生成文案失败，请重试', details: apiError?.message || '未知错误' },
        { status: 500 }
      );
    }
  } catch (error) {
    logger.error('处理请求时发生错误', error);
    return NextResponse.json(
      { error: '服务器错误，请稍后再试' },
      { status: 500 }
    );
  }
} 