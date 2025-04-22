 "use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PhoneIcon, KeyIcon, MessageSquare, User } from "lucide-react";
import { SocialLoginButtons } from "./social-login-buttons";

const registerSchema = z.object({
  username: z.string().min(2, { message: "用户名至少2个字符" }),
  phone: z.string().min(11, { message: "手机号格式不正确" }),
  code: z.string().min(4, { message: "验证码格式不正确" }),
  password: z.string().min(6, { message: "密码至少6位" }),
  confirmPassword: z.string().min(6, { message: "密码至少6位" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "两次输入的密码不一致",
  path: ["confirmPassword"],
});

type RegisterFormProps = {
  onSuccess: () => void;
};

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      phone: "",
      code: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("注册失败，请检查输入信息");
      }

      onSuccess();
    } catch (error) {
      console.error("注册错误:", error);
      // 处理错误
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
        {/* <h2 className="text-2xl font-semibold text-center">创建新账号</h2> */}
        <p className="text-sm text-muted-foreground text-center">
          请填写以下信息完成注册
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>用户名</FormLabel>
                <FormControl>
                  <div className="flex items-center">
                    <User className="mr-2 h-4 w-4 opacity-50" />
                    <Input placeholder="请输入用户名" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>验证码</FormLabel>
                <FormControl>
                  <div className="flex gap-2">
                    <div className="flex items-center flex-1">
                      <MessageSquare className="mr-2 h-4 w-4 opacity-50" />
                      <Input placeholder="请输入验证码" {...field} />
                    </div>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleSendCode}
                      disabled={isSendingCode || countdown > 0}
                    >
                      {countdown > 0 ? `${countdown}秒` : "获取验证码"}
                    </Button>
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
                    <Input type="password" placeholder="请设置密码" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>确认密码</FormLabel>
                <FormControl>
                  <div className="flex items-center">
                    <KeyIcon className="mr-2 h-4 w-4 opacity-50" />
                    <Input type="password" placeholder="请再次输入密码" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            注册
          </Button>
        </form>
      </Form>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            或使用第三方账号注册
          </span>
        </div>
      </div>

      <SocialLoginButtons isRegister />
    </div>
  );
}