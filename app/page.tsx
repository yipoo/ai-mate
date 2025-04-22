"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";
import { Navbar } from "@/components/navbar";
import { FolderList } from "@/components/folder/folder-list";
import { useUser } from "@/providers/user-provider";

// 导入 shadcn/ui 组件
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// 定义表单验证模式
const formSchema = z.object({
  product: z.string().min(1, { message: "请输入产品名称" }),
  description: z.string().optional(),
  platform: z.string(),
  scene: z.string(),
  style: z.string(),
  wordCount: z.number().min(50).max(500),
});

export default function Home() {
  const router = useRouter();
  const { Toast, showToast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const { isAuthenticated, user } = useUser();
  
  // 使用 react-hook-form 和 zod 验证
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      product: "",
      description: "",
      platform: "小红书",
      scene: "日常种草",
      style: "专业",
      wordCount: 100
    },
  });
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsGenerating(true);
    
    try {
      // 只存储表单数据到本地存储，在结果页使用
      localStorage.setItem("copyrightFormData", JSON.stringify(values));

      // 清除可能存在的旧文案数据
      localStorage.removeItem("generatedCopywritings");
      
      // 重置生成状态
      setIsGenerating(false);
      
      // 直接跳转到结果页面，让结果页面负责生成文案
      router.push("/result");
    } catch (error) {
      console.error("保存表单失败:", error);
      showToast("操作失败，请重试", "error");
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto py-8 px-4 md:px-8">
        {isAuthenticated && (
          <div className="mb-6 p-4 bg-primary-foreground rounded-lg">
            <h2 className="text-lg font-medium">👋 欢迎回来，{user?.username || "用户"}！</h2>
            <p className="text-muted-foreground">现在您可以生成文案并保存到您的文件夹中。</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-bold">AI文案助手</CardTitle>
                <CardDescription>一键生成多平台营销文案</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="product"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>产品名称 *</FormLabel>
                          <FormControl>
                            <Input placeholder="请输入产品名称" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>产品描述</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="请输入产品描述" 
                              {...field} 
                              className="min-h-[100px]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="platform"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>选择平台</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="选择平台" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="小红书">小红书</SelectItem>
                              <SelectItem value="抖音">抖音</SelectItem>
                              <SelectItem value="微博">微博</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="scene"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>文案类型</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="选择文案类型" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="日常种草">日常种草</SelectItem>
                              <SelectItem value="活动推广">活动推广</SelectItem>
                              <SelectItem value="用户评价">用户评价</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="style"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>语气风格</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="选择语气风格" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="专业">专业</SelectItem>
                              <SelectItem value="轻松">轻松</SelectItem>
                              <SelectItem value="搞笑">搞笑</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="wordCount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>文案字数: {field.value}</FormLabel>
                          <FormControl>
                            <Slider
                              min={50}
                              max={500}
                              step={10}
                              defaultValue={[field.value]}
                              onValueChange={(vals) => field.onChange(vals[0])}
                            />
                          </FormControl>
                          <FormDescription className="text-xs text-right">
                            {field.value}字
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isGenerating}
                    >
                      {isGenerating ? "生成中..." : "生成文案"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <FolderList />
          </div>
        </div>
      </main>
      
      <footer className="border-t py-6 md:py-0">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} AI文案助手 版权所有
          </p>
        </div>
      </footer>
      
      {Toast}
    </div>
  );
}