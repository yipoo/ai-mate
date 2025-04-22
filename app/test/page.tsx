"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TestPage() {
  const [loading, setLoading] = useState(false);
  const [isCheckingApi, setIsCheckingApi] = useState(false);
  const [isDirectCheckingApi, setIsDirectCheckingApi] = useState(false);
  const [apiStatus, setApiStatus] = useState<{
    status: 'unknown' | 'success' | 'error';
    message: string;
    configured?: boolean;
    models?: number;
    key?: string;
    details?: any;
    error?: string;
    duration?: number;
  }>({
    status: 'unknown',
    message: '正在检查API配置...'
  });
  const [directApiStatus, setDirectApiStatus] = useState<{
    status: 'unknown' | 'success' | 'error';
    message: string;
    configured?: boolean;
    models?: number;
    key?: string;
    details?: any;
    error?: string;
    duration?: number;
    errorName?: string;
  }>({
    status: 'unknown',
    message: '直接API检查未执行'
  });
  const [requestPayload, setRequestPayload] = useState(JSON.stringify({
    product: "智能手表",
    platform: "小红书",
    scene: "日常种草",
    style: "专业"
  }, null, 2));
  const [response, setResponse] = useState("");
  const [error, setError] = useState<string | null>(null);

  // 检查API配置
  useEffect(() => {
    checkApiConfig();
  }, []);

  const checkApiConfig = async () => {
    setIsCheckingApi(true);
    setApiStatus(prev => ({
      ...prev,
      status: 'unknown',
      message: '正在检查API配置...'
    }));
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15秒超时
      
      const res = await fetch("/api/check", {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      const data = await res.json();
      
      console.log("API检查结果:", data);
      
      if (res.ok && data.status === 'success') {
        setApiStatus({
          status: 'success',
          message: data.message,
          configured: data.configured,
          models: data.models,
          key: data.key,
          details: data.details
        });
      } else {
        setApiStatus({
          status: 'error',
          message: data.message || '检查API配置失败',
          configured: data.configured,
          key: data.key,
          details: data.details,
          error: data.error
        });
      }
    } catch (err: any) {
      console.error("API检查失败:", err);
      setApiStatus({
        status: 'error',
        message: err.name === 'AbortError' 
          ? '检查API超时，请检查您的网络连接或API配置' 
          : `检查API失败: ${err.message}`,
        error: err.message
      });
    } finally {
      setIsCheckingApi(false);
    }
  };
  
  // 直接检查API配置
  const checkDirectApiConfig = async () => {
    setIsDirectCheckingApi(true);
    setDirectApiStatus(prev => ({
      ...prev,
      status: 'unknown',
      message: '正在直接检查API连接...'
    }));
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 35000); // 35秒超时
      
      const res = await fetch("/api/direct-check", {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      const data = await res.json();
      
      console.log("直接API检查结果:", data);
      
      if (res.ok && data.status === 'success') {
        setDirectApiStatus({
          status: 'success',
          message: data.message,
          configured: data.configured,
          models: data.models,
          key: data.key,
          duration: data.duration
        });
      } else {
        setDirectApiStatus({
          status: 'error',
          message: data.message || '直接API检查失败',
          configured: data.configured,
          key: data.key,
          error: data.error,
          errorName: data.errorName,
          duration: data.duration
        });
      }
    } catch (err: any) {
      console.error("直接API检查失败:", err);
      setDirectApiStatus({
        status: 'error',
        message: err.name === 'AbortError' 
          ? '直接API检查超时，请检查您的网络连接' 
          : `直接API检查失败: ${err.message}`,
        error: err.message,
        errorName: err.name
      });
    } finally {
      setIsDirectCheckingApi(false);
    }
  };
  
  const handleTest = async () => {
    setLoading(true);
    setError(null);
    setResponse("");
    
    try {
      // 解析用户输入的JSON
      const payload = JSON.parse(requestPayload);
      
      console.log("发送请求:", payload);
      
      const startTime = Date.now();
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const endTime = Date.now();
      
      const data = await res.json();
      console.log("API响应:", data);
      
      if (!res.ok) {
        throw new Error(data.error || data.message || "请求失败");
      }
      
      setResponse(JSON.stringify({
        status: res.status,
        statusText: res.statusText,
        timeMs: endTime - startTime,
        data
      }, null, 2));
      
    } catch (err: any) {
      console.error("测试失败:", err);
      setError(err.message || "未知错误");
    } finally {
      setLoading(false);
    }
  };

  // 生成环境变量设置指导
  const getEnvGuidance = () => {
    if (apiStatus.status !== 'error' && directApiStatus.status !== 'error') return null;
    
    const guidance = [
      "### 解决API密钥问题的步骤：",
      "",
      "1. 创建 `.env.local` 文件（如果不存在）",
      "2. 添加以下内容：",
      "```",
      "OPENAI_API_KEY=您的OpenAI密钥",
      "```",
      "3. 重启开发服务器",
      "4. 刷新此页面",
      "",
      "获取API密钥：[OpenAI API Keys](https://platform.openai.com/api-keys)"
    ].join("\n");
    
    return guidance;
  };
  
  // 获取诊断信息
  const getDiagnosticInfo = () => {
    if (directApiStatus.status !== 'error') return null;
    
    let diagnostic = "### 网络诊断信息\n\n";
    
    if (directApiStatus.errorName === 'AbortError') {
      diagnostic += "- ⚠️ 请求超时，可能是网络延迟或OpenAI服务器响应缓慢\n";
      diagnostic += "- 检查您的网络是否需要代理才能访问OpenAI API\n";
      diagnostic += "- 检查您的防火墙或网络安全设置是否阻止了连接\n";
    } else if (directApiStatus.error?.includes('ENOTFOUND')) {
      diagnostic += "- ❌ 无法解析API主机名，DNS查找失败\n";
      diagnostic += "- 检查您的网络连接和DNS设置\n";
      diagnostic += "- 可能需要配置代理服务器\n";
    } else if (directApiStatus.error?.includes('ETIMEDOUT')) {
      diagnostic += "- ❌ 连接超时，无法与API服务器建立连接\n";
      diagnostic += "- 检查您的网络连接是否稳定\n";
      diagnostic += "- 可能需要配置代理服务器\n";
    } else if (directApiStatus.error?.includes('certificate')) {
      diagnostic += "- ❌ SSL/TLS证书验证失败\n";
      diagnostic += "- 您的网络可能使用了中间人代理或SSL检查\n";
      diagnostic += "- 需要配置适当的证书或代理设置\n";
    }
    
    diagnostic += "\n### 可能的解决方案\n\n";
    diagnostic += "1. 检查您的网络连接是否可以访问 api.openai.com\n";
    diagnostic += "2. 如果您在有网络限制的环境中，可能需要配置代理\n";
    diagnostic += "3. 确认您的API密钥是有效的并且没有过期\n";
    
    return diagnostic;
  };
  
  return (
    <div className="flex min-h-screen flex-col p-6">
      <div className="absolute top-4 right-4 flex gap-2">
        <Link href="/logs">
          <Button variant="outline" size="icon" title="查看日志">
            📋
          </Button>
        </Link>
        <ThemeToggle />
      </div>
      
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 text-center">API 测试工具</h1>
        
        {/* API 状态信息 */}
        <Card className="mb-6">
          <CardHeader className="py-4">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">OpenAI API 状态</CardTitle>
              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  size="sm" 
                  onClick={checkDirectApiConfig}
                  disabled={isDirectCheckingApi || loading}
                >
                  {isDirectCheckingApi ? "直接检查中..." : "直接测试"}
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={checkApiConfig}
                  disabled={isCheckingApi || loading}
                >
                  {isCheckingApi ? "标准检查中..." : "标准测试"}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="standard">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="standard">标准API检查</TabsTrigger>
                <TabsTrigger value="direct">直接API检查</TabsTrigger>
              </TabsList>
              
              <TabsContent value="standard">
                <div className={`p-3 rounded-md ${
                  apiStatus.status === 'success' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                    : apiStatus.status === 'error'
                      ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-400'
                }`}>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">
                      {apiStatus.status === 'success' ? '✅' : apiStatus.status === 'error' ? '❌' : '⏳'}
                    </span>
                    <p>{apiStatus.message}</p>
                  </div>
                  
                  {apiStatus.configured && (
                    <div className="mt-2 text-sm">
                      {apiStatus.key && <p>API密钥: {apiStatus.key}</p>}
                      {apiStatus.models && (
                        <p>可用模型数量: {apiStatus.models}</p>
                      )}
                    </div>
                  )}
                  
                  {apiStatus.error && (
                    <div className="mt-2 p-2 bg-black/10 dark:bg-white/10 rounded text-xs font-mono overflow-auto">
                      错误详情: {apiStatus.error}
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="direct">
                <div className={`p-3 rounded-md ${
                  directApiStatus.status === 'success' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                    : directApiStatus.status === 'error'
                      ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-400'
                }`}>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">
                      {directApiStatus.status === 'success' ? '✅' : directApiStatus.status === 'error' ? '❌' : '⏳'}
                    </span>
                    <p>{directApiStatus.message}</p>
                  </div>
                  
                  {directApiStatus.configured && (
                    <div className="mt-2 text-sm">
                      {directApiStatus.key && <p>API密钥: {directApiStatus.key}</p>}
                      {directApiStatus.models && (
                        <p>可用模型数量: {directApiStatus.models}</p>
                      )}
                      {directApiStatus.duration && (
                        <p>请求耗时: {directApiStatus.duration}ms</p>
                      )}
                    </div>
                  )}
                  
                  {directApiStatus.error && (
                    <div className="mt-2 p-2 bg-black/10 dark:bg-white/10 rounded text-xs font-mono overflow-auto">
                      错误详情: {directApiStatus.error}
                      {directApiStatus.errorName && ` (${directApiStatus.errorName})`}
                    </div>
                  )}
                  
                  {directApiStatus.status === 'error' && getDiagnosticInfo() && (
                    <div className="mt-3 p-3 bg-black/5 dark:bg-white/5 rounded text-xs">
                      <pre className="whitespace-pre-wrap">{getDiagnosticInfo()}</pre>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
            
            {(apiStatus.status === 'error' || directApiStatus.status === 'error') && getEnvGuidance() && (
              <div className="mt-3 p-3 bg-black/5 dark:bg-white/5 rounded text-xs">
                <pre className="whitespace-pre-wrap">{getEnvGuidance()}</pre>
              </div>
            )}
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>请求</CardTitle>
              <CardDescription>输入JSON请求</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea 
                value={requestPayload}
                onChange={(e) => setRequestPayload(e.target.value)}
                className="font-mono min-h-[300px]"
                placeholder="输入请求JSON"
              />
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button 
                onClick={handleTest} 
                disabled={loading || (apiStatus.status !== 'success' && directApiStatus.status !== 'success')} 
                className="flex-1"
              >
                {loading ? "请求中..." : "发送请求"}
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => {
                  setRequestPayload(JSON.stringify({
                    product: "智能手表",
                    platform: "小红书",
                    scene: "日常种草",
                    style: "专业"
                  }, null, 2));
                }}
              >
                重置
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>响应</CardTitle>
              <CardDescription>API响应结果</CardDescription>
            </CardHeader>
            <CardContent>
              {error ? (
                <div className="p-4 bg-destructive/20 text-destructive rounded-md">
                  错误: {error}
                </div>
              ) : (
                <Textarea 
                  value={response}
                  readOnly 
                  className="font-mono min-h-[300px] bg-muted/50"
                  placeholder="API响应将显示在这里"
                />
              )}
            </CardContent>
            <CardFooter className="flex justify-between items-center text-sm text-muted-foreground">
              <span>
                {response && !error ? "请求成功" : "等待请求..."}
              </span>
              
              <Link href="/logs" className="text-sm hover:underline">
                查看详细日志
              </Link>
            </CardFooter>
          </Card>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            此测试工具直接调用 OpenAI API，可能会产生 API 费用。请根据需要使用。
          </p>
        </div>
      </div>
    </div>
  );
} 