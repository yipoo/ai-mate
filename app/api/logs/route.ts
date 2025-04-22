import { NextRequest } from 'next/server';
import { getLogs, clearLogs, logStorage, LogLevel } from '@/lib/logger';
import { logger } from '@/lib/logger';

// 获取日志的API
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const levelParam = searchParams.get('level');
  const level = levelParam as LogLevel | undefined;
  const module = searchParams.get('module') || undefined;
  const limitParam = searchParams.get('limit');
  const limit = limitParam ? parseInt(limitParam) : undefined;
  
  logger.info('获取日志', { level, module, limit });
  
  const logs = getLogs({
    level,
    module,
    limit
  });
  
  return Response.json({ 
    total: logStorage.length,
    filtered: logs.length,
    logs 
  });
}

// 清除日志的API
export async function DELETE() {
  logger.info('清除所有日志');
  clearLogs();
  return Response.json({ success: true, message: '日志已清除' });
} 