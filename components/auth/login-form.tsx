"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PhoneIcon, KeyIcon, MessageSquare } from "lucide-react";
import { SocialLoginButtons } from "./social-login-buttons";
import { useUser } from "@/providers/user-provider";

// 创建通用的表单类型，包含所有可能的字段
type LoginFormValues = {
  phone: string;
  code?: string;
  password?: string;
};

type LoginFormProps = {
  onSuccess: () => void;
};

export function LoginForm({ onSuccess }: LoginFormProps) {
  const { login } = useUser();
  const [loginMethod, setLoginMethod] = useState<"code" | "password">("code");
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const form = useForm<LoginFormValues>({
    defaultValues: {
      phone: "",
      code: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginFormValues) {
    try {
      // 根据当前登录方式选择 API 端点
      const endpoint = loginMethod === "code" ? "/api/auth/login-with-code" : "/api/auth/login-with-password";
      
      // 构建请求数据
      const requestData = loginMethod === "code" 
        ? { phone: values.phone, code: values.code }
        : { phone: values.phone, password: values.password };
        
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error("登录失败，请检查输入信息");
      }

      // 获取用户数据并更新登录状态
      const userData = await response.json();
      login(userData);
      onSuccess();
    } catch (error) {
      console.error("登录错误:", error);
      // 可以添加错误处理逻辑，例如显示错误消息
    }
  }

  const handleSendCode = async () => {
    const phone = form.getValues("phone");
    if (!phone || phone.length < 11) {
      form.setError("phone", { message: "请输入正确的手机号" });
      return;
    }

    try {
      setIsSendingCode(true);
      // 发送验证码的API
      const response = await fetch("/api/auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      if (!response.ok) {
        throw new Error("发送验证码失败");
      }

      // 开始倒计时
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      console.error("发送验证码错误:", error);
    } finally {
      setIsSendingCode(false);
    }
  };

  return (
    <div className="space-y-4 py-2 pb-4">
      <div className="space-y-2">
        {/* <h2 className="text-2xl font-semibold text-center">欢迎回来</h2> */}
        <p className="text-sm text-muted-foreground text-center">
          登录您的账号继续使用AI文案助理
        </p>
      </div>
      <Tabs value={loginMethod} onValueChange={(v) => setLoginMethod(v as "code" | "password")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="code">验证码登录</TabsTrigger>
          <TabsTrigger value="password">密码登录</TabsTrigger>
        </TabsList>
        <TabsContent value="code">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    {/* <FormLabel>手机号</FormLabel> */}
                    <FormControl>
                      <div className="flex items-center mt-4">
                        <PhoneIcon className="mr-2 h-4 w-4 opacity-50" />
                        <Input placeholder="请输入手机号" {...field} className="h-10"/>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    {/* <FormLabel>验证码</FormLabel> */}
                    <FormControl>
                      <div className="flex gap-2 mt-4 mb-6">
                        <div className="flex items-center flex-1">
                          <MessageSquare className="mr-2 h-4 w-4 opacity-50" />
                          <Input placeholder="请输入验证码" {...field} className="h-10"/>
                        </div>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={handleSendCode}
                          disabled={isSendingCode || countdown > 0}
                          className="h-10"
                        >
                          {countdown > 0 ? `${countdown}秒` : "获取验证码"}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                登录
              </Button>
            </form>
          </Form>
        </TabsContent>
        <TabsContent value="password">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>手机号</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <PhoneIcon className="mr-2 h-4 w-4 opacity-50" />
                        <Input placeholder="请输入手机号" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>密码</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <KeyIcon className="mr-2 h-4 w-4 opacity-50" />
                        <Input type="password" placeholder="请输入密码" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                登录
              </Button>
            </form>
          </Form>
        </TabsContent>
      </Tabs>
      
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            或使用第三方账号登录
          </span>
        </div>
      </div>

      <SocialLoginButtons />
    </div>
  );
}