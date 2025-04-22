"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";
import { ThemeToggle } from "@/components/theme-toggle";
import { FolderIcon, FolderPlusIcon, Folder, CheckCircle } from "lucide-react";
import { useUser } from "@/providers/user-provider";

// 导入 shadcn/ui 组件
import { Button } from "@/components/ui/button";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Folder = {
  id: string;
  name: string;
  createdAt: string;
  hidden?: boolean;
};

const STORAGE_KEY_PREFIX = "copywritingFolder_";

export default function ResultPage() {
  const router = useRouter();
  const { Toast, showToast } = useToast();
  const { isAuthenticated, showLoginModal } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copywritings, setCopywritings] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    product: "",
    platform: "",
    scene: "",
    style: "",
    wordCount: 100,
    description: ""
  });
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState<string>("");
  const [newFolderName, setNewFolderName] = useState("");
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [savingCopyIndex, setSavingCopyIndex] = useState<number | null>(null);
  const [isSaved, setIsSaved] = useState<number[]>([]);
  const [isSavingAll, setIsSavingAll] = useState(false);

  // 使用useCallback包装fetchFolders函数
  const fetchFolders = useCallback(() => {
    if (!isAuthenticated) return;
    
    // 模拟API请求获取文案收藏夹列表
    // 实际项目中应该从API获取数据
    const mockFolders: Folder[] = [
      {
        id: "1",
        name: "小红书文案",
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        name: "抖音推广",
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: "3",
        name: "测试收藏夹",
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        hidden: true,
      }
    ];
    
    setFolders(mockFolders);
  }, [isAuthenticated]);

  useEffect(() => {
    // 从本地存储获取表单数据
    const storedData = localStorage.getItem("copyrightFormData");
    
    if (!storedData) {
      router.push("/");
      return;
    }

    try {
      const parsedData = JSON.parse(storedData);
      setFormData(parsedData);
      
      // 始终生成新的文案，不再依赖localStorage缓存的文案
      generateCopywriting(parsedData);
    } catch (err) {
      console.error("表单数据解析失败:", err);
      setError("表单数据无效，请返回重试");
      setIsLoading(false);
    }

    // 获取文件夹列表
    fetchFolders();
  }, [router, fetchFolders]);

  const generateCopywriting = async (data: any) => {
    setIsLoading(true);
    setError(null);
    
    // 最大重试次数
    const maxRetries = 2;
    let retryCount = 0;
    let success = false;
    
    while (retryCount <= maxRetries && !success) {
      try {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        
        if (!response.ok) {
          const errorText = await response.text().catch(() => "");
          console.error("API响应错误:", response.status, errorText);
          throw new Error(`生成文案失败: ${response.status}`);
        }

        const result = await response.json();
        
        if (!result.copywritings || result.copywritings.length === 0) {
          throw new Error("API返回的文案为空");
        }
        
        setCopywritings(result.copywritings);
        localStorage.setItem("generatedCopywritings", JSON.stringify(result.copywritings));
        
        success = true;
      } catch (err) {
        console.error(`获取文案失败 (尝试 ${retryCount + 1}/${maxRetries + 1}):`, err);
        retryCount++;
        
        if (retryCount > maxRetries) {
          setError("生成文案失败，请返回重试");
        } else {
          // 重试前等待一段时间
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }
    
    setIsLoading(false);
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopiedIndex(index);
        showToast("复制成功！", "success");
        setTimeout(() => setCopiedIndex(null), 2000);
      })
      .catch(err => {
        console.error("复制失败:", err);
        showToast("复制失败，请重试", "error");
      });
  };

  const handleOpenSaveDialog = (index: number) => {
    if (!isAuthenticated) {
      showLoginModal();
      return;
    }
    
    setSavingCopyIndex(index);
    setIsSaveDialogOpen(true);
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    
    setIsCreatingFolder(true);
    
    try {
      // 模拟API请求创建文案收藏夹
      const newFolder: Folder = {
        id: `folder_${Date.now()}`,
        name: newFolderName.trim(),
        createdAt: new Date().toISOString(),
      };
      
      // 添加到文案收藏夹列表
      setFolders([...folders, newFolder]);
      
      // 自动选择新创建的文案收藏夹
      setSelectedFolderId(newFolder.id);
      setNewFolderName("");
      setIsCreatingFolder(false);
    } catch (error) {
      console.error("创建文案收藏夹失败:", error);
      showToast("创建文案收藏夹失败", "error");
      setIsCreatingFolder(false);
    }
  };

  const handleSaveCopywriting = async () => {
    if ((savingCopyIndex === null && !isSavingAll) || !selectedFolderId) {
      setIsSaveDialogOpen(false);
      return;
    }
    
    try {
      // 模拟API请求保存文案
      // 实际项目中应该发送API请求保存到服务器
      
      // 获取选中的文案收藏夹名称
      const selectedFolder = folders.find(f => f.id === selectedFolderId);
      if (!selectedFolder) {
        throw new Error("未找到选中的文案收藏夹");
      }
      
      // 从本地存储获取当前文案收藏夹内容
      let folderContent: any[] = [];
      const savedContent = localStorage.getItem(`${STORAGE_KEY_PREFIX}${selectedFolderId}`);
      if (savedContent) {
        try {
          folderContent = JSON.parse(savedContent);
        } catch (e) {
          console.error('解析保存的文案收藏夹内容失败:', e);
          folderContent = [];
        }
      }
      
      // 准备要保存的文案
      const now = new Date().toISOString();
      const savingIndices = isSavingAll 
        ? Array.from({ length: copywritings.length }, (_, i) => i)
        : [savingCopyIndex].filter(i => i !== null) as number[];
        
      // 创建新的文案对象并添加到文案收藏夹内容
      const newCopywritings = savingIndices.map(index => {
        // 检查是否已经保存过这条文案，避免重复
        const content = copywritings[index as number];
        const copyId = `copy_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        
        return {
          id: copyId,
          content: content,
          folderName: selectedFolder.name,
          createdAt: now,
          platform: formData.platform,
          product: formData.product,
          scene: formData.scene,
          style: formData.style
        };
      });
      
      // 将新文案添加到文案收藏夹内容
      const updatedContent = [...folderContent, ...newCopywritings];
      
      // 按创建时间降序排序
      updatedContent.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      // 保存到本地存储
      localStorage.setItem(`${STORAGE_KEY_PREFIX}${selectedFolderId}`, JSON.stringify(updatedContent));
      
      // 模拟网络延迟
      if (isSavingAll) {
        const saveAllPromise = new Promise(resolve => setTimeout(resolve, 800));
        await saveAllPromise;
        
        // 标记所有文案为已保存
        const allIndices = Array.from({ length: copywritings.length }, (_, i) => i);
        setIsSaved(allIndices);
        
        showToast("所有文案已保存到文案收藏夹", "success");
      } else {
        // 模拟保存单条文案
        const savePromise = new Promise(resolve => setTimeout(resolve, 500));
        await savePromise;
        
        // 标记为已保存
        if (savingCopyIndex !== null && !isSaved.includes(savingCopyIndex)) {
          setIsSaved([...isSaved, savingCopyIndex]);
        }
        
        showToast("文案已保存到文案收藏夹", "success");
      }
      
      setIsSaveDialogOpen(false);
      setIsSavingAll(false);
    } catch (error) {
      console.error("保存文案失败:", error);
      showToast("保存失败，请重试", "error");
    }
  };

  const handleSaveAllCopywritings = () => {
    if (!isAuthenticated) {
      showLoginModal();
      return;
    }
    
    if (copywritings.length === 0) {
      showToast("没有可保存的文案", "error");
      return;
    }
    
    setIsSavingAll(true);
    setSavingCopyIndex(null);
    setIsSaveDialogOpen(true);
  };

  return (
    <div className="flex min-h-screen flex-col p-6">
      <div className="absolute top-4 right-4 flex gap-2">
        <Button variant="outline" onClick={() => router.push("/")}>
          返回主页
        </Button>
        <ThemeToggle />
      </div>
      
      <Card className="container mx-auto max-w-4xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">AI文案生成结果</CardTitle>
          <CardDescription className="text-center">
            <div className="mt-2 flex flex-wrap justify-center gap-2">
              <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-sm">
                {formData.platform}
              </span>
              <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-sm">
                {formData.scene}
              </span>
              <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-sm">
                {formData.style}风格
              </span>
              <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-sm">
                约{formData.wordCount}字
              </span>
            </div>
            <div className="mt-2">
              <p>产品：{formData.product}</p>
              {formData.description && (
                <p className="mt-1 text-sm text-muted-foreground">描述：{formData.description}</p>
              )}
            </div>
          </CardDescription>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent" role="status">
                <span className="sr-only">加载中...</span>
              </div>
              <p className="mt-4">AI正在为您生成文案...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-destructive">{error}</p>
              <Button className="mt-4" onClick={() => router.push("/")}>
                返回重试
              </Button>
            </div>
          ) : (
            <>
              {copywritings.length > 0 && (
                <div className="flex justify-end mb-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-1"
                    onClick={handleSaveAllCopywritings}
                  >
                    <FolderIcon className="h-4 w-4" />
                    全部保存到文案收藏夹
                  </Button>
                </div>
              )}
              <div className="space-y-6">
                {copywritings.map((text, index) => (
                  <Card key={index} className="overflow-hidden">
                    <CardContent className="p-4">
                      <p className="whitespace-pre-wrap mb-3">{text}</p>
                    </CardContent>
                    <CardFooter className="bg-muted/50 px-4 py-2 flex justify-between">
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleCopy(text, index)}
                          variant={copiedIndex === index ? "outline" : "default"}
                          size="sm"
                        >
                          {copiedIndex === index ? "已复制 ✓" : "复制文案"}
                        </Button>
                        <Button
                          onClick={() => handleOpenSaveDialog(index)}
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1"
                        >
                          {isSaved.includes(index) ? (
                            <>
                              <CheckCircle className="h-4 w-4" />
                              <span>已保存</span>
                            </>
                          ) : (
                            <>
                              <FolderIcon className="h-4 w-4" />
                              <span>保存到文案收藏夹</span>
                            </>
                          )}
                        </Button>
                      </div>
                      <span className="text-xs text-muted-foreground">文案 {index + 1}</span>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </>
          )}
        </CardContent>

        <CardFooter className="flex justify-center p-6">
          <Button 
            variant="outline" 
            onClick={() => router.push("/")}
          >
            返回修改
          </Button>
        </CardFooter>
      </Card>
      
      {/* 保存文案对话框 */}
      <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isSavingAll ? "保存所有文案到文案收藏夹" : "保存文案到文案收藏夹"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {isCreatingFolder ? (
              <div className="space-y-2">
                <Label htmlFor="folderName">收藏夹名称</Label>
                <div className="flex gap-2">
                  <Input
                    id="folderName"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    placeholder="输入收藏夹名称"
                  />
                  <Button onClick={handleCreateFolder}>
                    创建
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label>选择文案收藏夹</Label>
                  <Select value={selectedFolderId} onValueChange={setSelectedFolderId}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择一个文案收藏夹" />
                    </SelectTrigger>
                    <SelectContent>
                      {folders.map((folder) => (
                        <SelectItem key={folder.id} value={folder.id}>
                          {folder.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-center gap-1"
                    onClick={() => setIsCreatingFolder(true)}
                  >
                    <FolderPlusIcon className="h-4 w-4" />
                    <span>创建新文案收藏夹</span>
                  </Button>
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsSaveDialogOpen(false);
              setIsCreatingFolder(false);
              setIsSavingAll(false);
            }}>
              取消
            </Button>
            <Button 
              onClick={handleSaveCopywriting} 
              disabled={!selectedFolderId}
            >
              {isSavingAll ? "保存所有文案" : "保存"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {Toast}
    </div>
  );
} 