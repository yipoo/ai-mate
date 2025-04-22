/**
 * 通用日志系统
 * 提供简单版和高级版两种模式
 */

// 日志等级定义
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

// 日志条目接口
export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  module?: string;
  message: string;
  data?: any;
}

// 日志存储，所有日志都会保存在这里
const MAX_LOGS = 100;
export const logStorage: LogEntry[] = [];

// 是否使用高级日志模式（默认为简单模式）
let useAdvancedMode = false;

// 日志过滤级别（低于此级别的日志不会被记录）
let minimumLogLevel: LogLevel = 'info';

/**
 * 配置日志系统
 */
export function configureLogger(options: {
  advanced?: boolean;
  minimumLevel?: LogLevel;
  maxLogs?: number;
}) {
  if (options.advanced !== undefined) {
    useAdvancedMode = options.advanced;
  }
  
  if (options.minimumLevel) {
    minimumLogLevel = options.minimumLevel;
  }
  
  if (options.maxLogs && options.maxLogs > 0) {
    // 不允许直接修改 MAX_LOGS
  }
}

/**
 * 内部日志记录函数
 */
function logInternal(level: LogLevel, message: string, moduleOrData?: string | any, data?: any) {
  // 判断日志级别是否应该被记录
  const levelPriority = { debug: 0, info: 1, warn: 2, error: 3 };
  if (levelPriority[level] < levelPriority[minimumLogLevel]) {
    return;
  }

  const timestamp = new Date().toISOString();
  let module: string | undefined;
  let logData: any | undefined;
  
  // 解析参数
  if (typeof moduleOrData === 'string') {
    module = moduleOrData;
    logData = data;
  } else {
    logData = moduleOrData;
  }
  
  // 限制日志数量
  if (logStorage.length >= MAX_LOGS) {
    logStorage.shift();
  }
  
  // 创建日志条目
  const logEntry: LogEntry = {
    timestamp,
    level,
    message,
    ...(module && { module }),
    ...(logData !== undefined && { data: logData }),
  };
  
  // 保存到日志存储
  logStorage.push(logEntry);
  
  // 输出到控制台
  const prefix = module 
    ? `[${level.toUpperCase()}][${module}]` 
    : `[${level.toUpperCase()}]`;
    
  if (level === 'error') {
    console.error(`${prefix} ${timestamp} - ${message}`, logData !== undefined ? logData : '');
  } else if (level === 'warn') {
    console.warn(`${prefix} ${timestamp} - ${message}`, logData !== undefined ? logData : '');
  } else {
    console.log(`${prefix} ${timestamp} - ${message}`, logData !== undefined ? logData : '');
  }
  
  return logEntry;
}

// 简单版日志接口
export const logger = {
  debug: (message: string, data?: any) => logInternal('debug', message, data),
  info: (message: string, data?: any) => logInternal('info', message, data),
  warn: (message: string, data?: any) => logInternal('warn', message, data),
  error: (message: string, data?: any) => logInternal('error', message, data),
};

/**
 * 创建模块专用日志记录器（高级模式）
 */
export function createLogger(moduleName: string) {
  return {
    debug: (message: string, data?: any) => logInternal('debug', message, moduleName, data),
    info: (message: string, data?: any) => logInternal('info', message, moduleName, data),
    warn: (message: string, data?: any) => logInternal('warn', message, moduleName, data),
    error: (message: string, data?: any) => logInternal('error', message, moduleName, data),
  };
}

/**
 * 获取所有记录的日志
 */
export function getLogs(options?: {
  level?: LogLevel;
  module?: string;
  limit?: number;
}) {
  let filteredLogs = [...logStorage];
  
  if (options?.level) {
    filteredLogs = filteredLogs.filter(log => log.level === options.level);
  }
  
  if (options?.module) {
    filteredLogs = filteredLogs.filter(log => log.module === options.module);
  }
  
  if (options?.limit && options.limit > 0) {
    filteredLogs = filteredLogs.slice(-options.limit);
  }
  
  return filteredLogs;
}

/**
 * 清除日志
 */
export function clearLogs() {
  logStorage.length = 0;
}

// 默认导出简单版日志接口
export default logger; 