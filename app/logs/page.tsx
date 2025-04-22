"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { LogLevel } from "@/lib/logger";

// 日志条目类型
interface LogEntry {
  timestamp: string;
  level: LogLevel;
  module?: string;
  message: string;
  data?: any;
}

export default function LogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<{
    level?: LogLevel;
    module?: string;
  }>({});
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [totalLogs, setTotalLogs] = useState(0);

  // 获取日志
  const fetchLogs = async () => {
    setLoading(true);
    try {
      // 构建查询参数
      const params = new URLSearchParams();
      if (filter.level) {
        params.append('level', filter.level);
      }
      if (filter.module) {
        params.append('module', filter.module);
      }

      const res = await fetch(`/api/logs?${params.toString()}`);
      const data = await res.json();
      
      setLogs(data.logs);
      setTotalLogs(data.total);
    } catch (error) {
      console.error("获取日志失败:", error);
    } finally {
      setLoading(false);
    }
  };

  // 清除所有日志
  const clearLogs = async () => {
    if (!confirm("确定要清除所有日志吗？")) {
      return;
    }
    
    setLoading(true);
    try {
      await fetch('/api/logs', { method: 'DELETE' });
      fetchLogs();
    } catch (error) {
      console.error("清除日志失败:", error);
    } finally {
      setLoading(false);
    }
  };

  // 启动时获取日志，并在过滤条件变化时重新获取
  useEffect(() => {
    fetchLogs();
  }, [filter, fetchLogs]);

  // 自动刷新
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      fetchLogs();
    }, 3000);
    
    return () => clearInterval(interval);
  }, [autoRefresh, filter, fetchLogs]);

  // 日志级别的颜色
  const levelColors = {
    debug: "text-blue-500 dark:text-blue-400",
    info: "text-green-500 dark:text-green-400",
    warn: "text-yellow-500 dark:text-yellow-400",
    error: "text-red-500 dark:text-red-400"
  };

  return (
    <div className="flex min-h-screen flex-col p-6">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="container mx-auto max-w-6xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">系统日志</h1>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={fetchLogs}
              disabled={loading}
            >
              刷新
            </Button>
            
            <Button
              variant={autoRefresh ? "default" : "outline"}
              size="sm"
              onClick={() => setAutoRefresh(!autoRefresh)}
            >
              {autoRefresh ? "停止自动刷新" : "自动刷新"}
            </Button>
            
            <Button 
              variant="destructive" 
              size="sm"
              onClick={clearLogs}
              disabled={loading}
            >
              清除日志
            </Button>
          </div>
        </div>
        
        <div className="mb-6 flex flex-wrap gap-2">
          <select 
            className="px-3 py-1 rounded-md border" 
            value={filter.level || ""}
            onChange={(e) => setFilter({...filter, level: e.target.value as LogLevel || undefined})}
          >
            <option value="">全部级别</option>
            <option value="debug">Debug</option>
            <option value="info">Info</option>
            <option value="warn">Warning</option>
            <option value="error">Error</option>
          </select>
          
          <input
            type="text"
            placeholder="模块名称过滤"
            className="px-3 py-1 rounded-md border"
            value={filter.module || ""}
            onChange={(e) => setFilter({...filter, module: e.target.value || undefined})}
          />
          
          <span className="ml-auto text-sm text-muted-foreground">
            共 {totalLogs} 条日志，显示 {logs.length} 条
          </span>
        </div>
        
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-lg">日志记录</CardTitle>
            <CardDescription>
              系统活动日志
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-auto max-h-[70vh]">
              <table className="w-full">
                <thead className="bg-muted/50 sticky top-0">
                  <tr>
                    <th className="p-2 text-left w-[180px]">时间</th>
                    <th className="p-2 text-left w-[80px]">级别</th>
                    <th className="p-2 text-left w-[120px]">模块</th>
                    <th className="p-2 text-left">消息</th>
                    <th className="p-2 text-left w-[100px]">数据</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {logs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-4 text-center text-muted-foreground">
                        {loading ? "加载中..." : "没有日志记录"}
                      </td>
                    </tr>
                  ) : (
                    logs.map((log, index) => (
                      <tr key={index} className="hover:bg-muted/30">
                        <td className="p-2 font-mono text-xs">
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                        <td className={`p-2 font-medium ${levelColors[log.level]}`}>
                          {log.level.toUpperCase()}
                        </td>
                        <td className="p-2 text-sm">
                          {log.module || "-"}
                        </td>
                        <td className="p-2 whitespace-pre-wrap">
                          {log.message}
                        </td>
                        <td className="p-2">
                          {log.data && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => console.log("日志数据:", log.data)}
                            >
                              查看
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 