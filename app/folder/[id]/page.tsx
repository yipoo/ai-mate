"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { useToast } from "@/components/ui/toast";
import { 
  FolderIcon, 
  PenIcon, 
  TrashIcon, 
  ChevronLeft,
  ClipboardCopy,
  FilterIcon,
  XIcon,
  Save,
  CheckIcon
} from "lucide-react";

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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

type Folder = {
  id: string;
  name: string;
  createdAt: string;
};

type Copywriting = {
  id: string;
  content: string;
  folderName: string;
  createdAt: string;
  platform: string;
  product: string;
  scene: string;
  style: string;
};

const STORAGE_KEY_PREFIX = 'folder_content_';

export default function FolderPage() {
  const params = useParams();
  const folderId = params.id as string;
  const router = useRouter();
  const { Toast, showToast } = useToast();
  const [folder, setFolder] = useState<Folder | null>(null);
  const [copywritings, setCopywritings] = useState<Copywriting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingCopyId, setEditingCopyId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingCopyId, setDeletingCopyId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedScene, setSelectedScene] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [deletedToastPosition, setDeletedToastPosition] = useState({ x: 0, y: 0 });
  const textareaRefs = useRef<Record<string, HTMLTextAreaElement | null>>({});

  useEffect(() => {
    fetchFolderData(folderId);
    fetchCopywritings(folderId);
  }, [folderId]);

  // 模拟获取文件夹数据
  const fetchFolderData = (folderId: string) => {
    // 实际项目中，这里应该从API获取数据
    const folders = [
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
        name: "测试文件夹",
        createdAt: new Date(Date.now() - 172800000).toISOString(),
      }
    ];
    
    const foundFolder = folders.find(f => f.id === folderId);
    setFolder(foundFolder || null);
  };

  // 模拟获取文案数据
  const fetchCopywritings = (folderId: string) => {
    setIsLoading(true);
    
    // 从localStorage尝试获取已保存的数据
    const savedCopywritings = localStorage.getItem(`${STORAGE_KEY_PREFIX}${folderId}`);
    
    // 模拟API调用延迟
    setTimeout(() => {
      // 如果有保存的数据，使用保存的数据
      if (savedCopywritings) {
        try {
          const parsedData = JSON.parse(savedCopywritings);
          setCopywritings(parsedData);
          setIsLoading(false);
          return;
        } catch (e) {
          console.error('解析保存的文案数据失败:', e);
          // 如果解析失败，继续使用模拟数据
        }
      }
      
      // 实际项目中，这里应该从API获取数据
      const mockCopywritings: Copywriting[] = [];

      // 为演示创建一些模拟数据
      for(let i = 1; i <= 5; i++) {
        const date = new Date();
        date.setHours(date.getHours() - i * 2); // 每篇文案间隔2小时
        
        mockCopywritings.push({
          id: `copy_${i}_${folderId}`,
          content: `这是文件夹 ${folderId} 中的第 ${i} 篇文案。这里是文案内容，描述了产品的特点和优势。这是一个示例文本，实际使用时会替换为真实的AI生成内容。这段文本只是为了演示界面效果。`,
          folderName: folderId === "1" ? "小红书文案" : folderId === "2" ? "抖音推广" : "测试文件夹",
          createdAt: date.toISOString(),
          platform: folderId === "1" ? "小红书" : folderId === "2" ? "抖音" : "微博",
          product: "示例产品" + i,
          scene: i % 2 === 0 ? "日常种草" : "活动推广",
          style: i % 3 === 0 ? "专业" : i % 3 === 1 ? "轻松" : "搞笑"
        });
      }
      
      // 添加更多样例数据用于筛选展示
      mockCopywritings.push({
        id: `copy_6_${folderId}`,
        content: `这是一篇用户评价文案。内容描述了用户对产品的评价和使用体验。`,
        folderName: folderId === "1" ? "小红书文案" : folderId === "2" ? "抖音推广" : "测试文件夹",
        createdAt: new Date().toISOString(),
        platform: folderId === "1" ? "小红书" : folderId === "2" ? "抖音" : "微博",
        product: "示例产品6",
        scene: "用户评价",
        style: "轻松"
      });
      
      mockCopywritings.push({
        id: `copy_7_${folderId}`,
        content: `这是一篇日常种草文案，采用了搞笑风格。内容幽默诙谐，能够引起读者共鸣。`,
        folderName: folderId === "1" ? "小红书文案" : folderId === "2" ? "抖音推广" : "测试文件夹",
        createdAt: new Date().toISOString(),
        platform: folderId === "1" ? "小红书" : folderId === "2" ? "抖音" : "微博",
        product: "示例产品7",
        scene: "日常种草",
        style: "搞笑"
      });
      
      // 按创建时间降序排序
      mockCopywritings.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      setCopywritings(mockCopywritings);
      
      // 将初始数据保存到localStorage
      localStorage.setItem(`${STORAGE_KEY_PREFIX}${folderId}`, JSON.stringify(mockCopywritings));
      
      setIsLoading(false);
    }, 800);
  };

  // 保存文案数据到本地存储
  const saveCopywritingsToStorage = (updatedCopywritings: Copywriting[]) => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${folderId}`, JSON.stringify(updatedCopywritings));
    console.log(`已保存文件夹 ${folderId} 的文案数据到本地存储`);
  };

  // 计算筛选后的文案列表
  const filteredCopywritings = useMemo(() => {
    return copywritings.filter(copy => {
      if (selectedScene && copy.scene !== selectedScene) {
        return false;
      }
      if (selectedStyle && copy.style !== selectedStyle) {
        return false;
      }
      return true;
    });
  }, [copywritings, selectedScene, selectedStyle]);

  // 获取文案类型和数量统计
  const sceneStats = useMemo(() => {
    const stats: Record<string, number> = {};
    copywritings.forEach(copy => {
      stats[copy.scene] = (stats[copy.scene] || 0) + 1;
    });
    return stats;
  }, [copywritings]);
  
  // 获取语气风格和数量统计
  const styleStats = useMemo(() => {
    const stats: Record<string, number> = {};
    copywritings.forEach(copy => {
      stats[copy.style] = (stats[copy.style] || 0) + 1;
    });
    return stats;
  }, [copywritings]);

  const handleBack = () => {
    router.push("/");
  };

  const handleEdit = (copywriting: Copywriting) => {
    if (editingCopyId === copywriting.id) {
      // 保存编辑
      handleSaveInlineEdit(copywriting.id);
    } else {
      // 开始编辑
      setEditingCopyId(copywriting.id);
      setEditingContent(copywriting.content);
      
      // 等待DOM更新后聚焦文本区域
      setTimeout(() => {
        const textarea = textareaRefs.current[copywriting.id];
        if (textarea) {
          textarea.focus();
        }
      }, 50);
    }
  };

  const handleSaveInlineEdit = (copyId: string) => {
    if (!editingContent.trim()) {
      return;
    }

    // 更新文案内容
    const updatedCopywritings = copywritings.map(copy => 
      copy.id === copyId 
        ? { ...copy, content: editingContent.trim() } 
        : copy
    );
    
    setCopywritings(updatedCopywritings);
    
    // 保存更新后的数据到本地存储
    saveCopywritingsToStorage(updatedCopywritings);

    showToast("修改成功", "success");
    setEditingCopyId(null);
  };

  const handleCancelEdit = () => {
    setEditingCopyId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent, copyId: string) => {
    if (e.key === 'Escape') {
      handleCancelEdit();
    } else if (e.ctrlKey && e.key === 'Enter') {
      handleSaveInlineEdit(copyId);
    }
  };

  const handleDeleteWithPosition = (copyId: string, event: React.MouseEvent) => {
    // 记录点击位置，用于在附近显示toast
    setDeletedToastPosition({
      x: event.clientX,
      y: event.clientY
    });
    
    // 从状态中删除文案
    const updatedCopywritings = copywritings.filter(copy => copy.id !== copyId);
    setCopywritings(updatedCopywritings);
    
    // 保存更新后的数据到本地存储
    saveCopywritingsToStorage(updatedCopywritings);
    
    // 在删除位置附近显示toast
    showToast("文案已删除", "success");
  };

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content)
      .then(() => {
        setCopiedId(id);
        showToast("已复制到剪贴板", "success");
        setTimeout(() => setCopiedId(null), 2000);
      })
      .catch(err => {
        console.error("复制失败:", err);
        showToast("复制失败，请重试", "error");
      });
  };

  const toggleSceneFilter = (scene: string) => {
    if (selectedScene === scene) {
      setSelectedScene(null);
    } else {
      setSelectedScene(scene);
    }
  };

  const toggleStyleFilter = (style: string) => {
    if (selectedStyle === style) {
      setSelectedStyle(null);
    } else {
      setSelectedStyle(style);
    }
  };

  const clearFilters = () => {
    setSelectedScene(null);
    setSelectedStyle(null);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto py-8 px-4 md:px-8">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Button variant="outline" size="icon" onClick={handleBack}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center">
              <FolderIcon className="h-5 w-5 mr-2 text-primary" />
              <h1 className="text-2xl font-bold">
                {folder ? folder.name : "加载中..."}
              </h1>
            </div>
          </div>
          
          <div className="bg-muted/30 rounded-lg p-4">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <FilterIcon className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">筛选：</span>
              
              {(selectedScene || selectedStyle) && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs flex items-center gap-1 ml-auto"
                  onClick={clearFilters}
                >
                  <XIcon className="h-3 w-3" />
                  清除筛选
                </Button>
              )}
            </div>
            
            <Tabs defaultValue="scene" className="w-full">
              <TabsList className="mb-2">
                <TabsTrigger value="scene">文案类型</TabsTrigger>
                <TabsTrigger value="style">语气风格</TabsTrigger>
              </TabsList>
              
              <TabsContent value="scene" className="mt-0">
                <div className="flex flex-wrap gap-2">
                  {Object.entries(sceneStats).map(([scene, count]) => (
                    <Badge 
                      key={scene}
                      variant={selectedScene === scene ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleSceneFilter(scene)}
                    >
                      {scene} ({count})
                    </Badge>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="style" className="mt-0">
                <div className="flex flex-wrap gap-2">
                  {Object.entries(styleStats).map(([style, count]) => (
                    <Badge 
                      key={style}
                      variant={selectedStyle === style ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleStyleFilter(style)}
                    >
                      {style}风格 ({count})
                    </Badge>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : filteredCopywritings.length > 0 ? (
          <>
            {(selectedScene || selectedStyle) && (
              <div className="mb-4 text-sm text-muted-foreground">
                显示 {filteredCopywritings.length} 个结果
                {selectedScene && <span>，文案类型: {selectedScene}</span>}
                {selectedStyle && <span>，语气风格: {selectedStyle}</span>}
              </div>
            )}
            <div className="space-y-6">
              {filteredCopywritings.map((copy) => (
                <Card key={copy.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{copy.product}</CardTitle>
                        <CardDescription>
                          <div className="flex flex-wrap gap-2 mt-1">
                            <span className="px-2 py-0.5 bg-secondary text-secondary-foreground rounded-md text-xs">
                              {copy.platform}
                            </span>
                            <span className="px-2 py-0.5 bg-secondary text-secondary-foreground rounded-md text-xs">
                              {copy.scene}
                            </span>
                            <span className="px-2 py-0.5 bg-secondary text-secondary-foreground rounded-md text-xs">
                              {copy.style}风格
                            </span>
                          </div>
                        </CardDescription>
                      </div>
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleEdit(copy)}
                          title={editingCopyId === copy.id ? "保存" : "编辑"}
                        >
                          {editingCopyId === copy.id ? (
                            <Save className="h-4 w-4 text-primary" />
                          ) : (
                            <PenIcon className="h-4 w-4" />
                          )}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-8 w-8 hover:text-destructive"
                          onClick={(e) => handleDeleteWithPosition(copy.id, e)}
                          title="删除"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {editingCopyId === copy.id ? (
                      <div className="relative">
                        <Textarea
                          ref={(el) => {
                            textareaRefs.current[copy.id] = el;
                          }}
                          value={editingContent}
                          onChange={(e) => setEditingContent(e.target.value)}
                          onKeyDown={(e) => handleKeyDown(e, copy.id)}
                          className="min-h-[150px] pr-8"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 h-6 w-6"
                          onClick={handleCancelEdit}
                          title="取消"
                        >
                          <XIcon className="h-4 w-4" />
                        </Button>
                        <p className="text-xs text-muted-foreground mt-2">
                          按 Ctrl+Enter 保存，Esc 取消
                        </p>
                      </div>
                    ) : (
                      <div className="whitespace-pre-wrap">{copy.content}</div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <small className="text-muted-foreground">
                      创建于 {new Date(copy.createdAt).toLocaleString()}
                    </small>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-1"
                      onClick={() => handleCopy(copy.content, copy.id)}
                    >
                      <ClipboardCopy className="h-3.5 w-3.5" />
                      {copiedId === copy.id ? "已复制" : "复制文案"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-center bg-muted/20 rounded-lg p-6">
            {copywritings.length > 0 ? (
              <>
                <FilterIcon className="h-16 w-16 text-muted mb-4" />
                <h2 className="text-xl font-medium mb-2">无匹配结果</h2>
                <p className="text-muted-foreground">
                  没有找到符合当前筛选条件的文案
                </p>
                <Button 
                  className="mt-4"
                  onClick={clearFilters}
                >
                  清除所有筛选
                </Button>
              </>
            ) : (
              <>
                <FolderIcon className="h-16 w-16 text-muted mb-4" />
                <h2 className="text-xl font-medium mb-2">文件夹为空</h2>
                <p className="text-muted-foreground">
                  该文件夹暂无内容，请先创建文案
                </p>
                <Button 
                  className="mt-4"
                  onClick={handleBack}
                >
                  返回并创建文案
                </Button>
              </>
            )}
          </div>
        )}
      </main>
      
      {Toast}
    </div>
  );
} 