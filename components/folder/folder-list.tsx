"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/providers/user-provider";
import { FolderIcon, FolderPlusIcon, PenIcon, TrashIcon, EyeIcon, EyeOffIcon, MoreVerticalIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

type Folder = {
  id: string;
  name: string;
  createdAt: string;
  hidden?: boolean;
};

export function FolderList() {
  const router = useRouter();
  const { isAuthenticated, showLoginModal } = useUser();
  const [folders, setFolders] = useState<Folder[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showHidden, setShowHidden] = useState(false);
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [editingFolderName, setEditingFolderName] = useState("");

  // 模拟初始数据
  useEffect(() => {
    if (isAuthenticated && folders.length === 0) {
      // 创建一些示例文案收藏夹
      const demoFolders: Folder[] = [
        {
          id: "1",
          name: "小红书文案",
          createdAt: new Date().toISOString(),
        },
        {
          id: "2",
          name: "抖音推广",
          createdAt: new Date(Date.now() - 86400000).toISOString(), // 昨天
        },
        {
          id: "3",
          name: "测试收藏夹",
          createdAt: new Date(Date.now() - 172800000).toISOString(), // 前天
          hidden: true,
        }
      ];
      setFolders(demoFolders);
    }
  }, [isAuthenticated, folders.length]);

  const createFolderWithDefaultName = () => {
    // 从本地存储获取最近使用的产品和平台
    const lastFormData = localStorage.getItem("copyrightFormData");
    let defaultName = "新建文案收藏夹";
    
    if (lastFormData) {
      try {
        const parsedData = JSON.parse(lastFormData);
        if (parsedData.product && parsedData.platform) {
          defaultName = `${parsedData.product}-${parsedData.platform}`;
        }
      } catch (e) {
        console.error("解析存储数据失败:", e);
      }
    }
    
    return defaultName;
  };

  const handleCreateFolder = async () => {
    if (!isAuthenticated) {
      showLoginModal();
      return;
    }

    const finalFolderName = folderName || createFolderWithDefaultName();

    try {
      setIsLoading(true);
      // 模拟API请求
      const newFolder: Folder = {
        id: `folder_${Date.now()}`,
        name: finalFolderName,
        createdAt: new Date().toISOString(),
      };
      
      setFolders([...folders, newFolder]);
      setFolderName("");
      setIsCreating(false);
    } catch (error) {
      console.error("创建文案收藏夹错误:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteFolder = (folderId: string) => {
    setFolders(folders.filter(folder => folder.id !== folderId));
  };

  const handleToggleHiddenFolder = (folderId: string) => {
    setFolders(folders.map(folder => 
      folder.id === folderId 
        ? { ...folder, hidden: !folder.hidden } 
        : folder
    ));
  };

  const startEditingFolderName = (folder: Folder) => {
    setEditingFolderId(folder.id);
    setEditingFolderName(folder.name);
  };

  const saveEditedFolderName = () => {
    if (!editingFolderId || !editingFolderName.trim()) {
      setEditingFolderId(null);
      return;
    }

    setFolders(folders.map(folder => 
      folder.id === editingFolderId 
        ? { ...folder, name: editingFolderName.trim() } 
        : folder
    ));
    
    setEditingFolderId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      saveEditedFolderName();
    } else if (e.key === 'Escape') {
      setEditingFolderId(null);
    }
  };

  const handleFolderClick = (folderId: string) => {
    router.push(`/folder/${folderId}`);
  };

  // 按照创建时间分组文案收藏夹
  const groupFoldersByDate = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);

    const lastMonth = new Date(today);
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    // 仅显示未隐藏的文案收藏夹，除非显示隐藏文案收藏夹选项被启用
    const visibleFolders = folders.filter(folder => showHidden || !folder.hidden);

    return {
      today: visibleFolders.filter(folder => {
        const date = new Date(folder.createdAt);
        return date >= today;
      }),
      yesterday: visibleFolders.filter(folder => {
        const date = new Date(folder.createdAt);
        return date >= yesterday && date < today;
      }),
      thisWeek: visibleFolders.filter(folder => {
        const date = new Date(folder.createdAt);
        return date >= lastWeek && date < yesterday;
      }),
      earlier: visibleFolders.filter(folder => {
        const date = new Date(folder.createdAt);
        return date < lastWeek;
      }),
    };
  };

  const groupedFolders = groupFoldersByDate();

  if (!isAuthenticated) {
    return (
      <div className="p-4 border rounded-lg mt-4">
        <p className="text-center mb-2">登录后可管理您的文案收藏夹</p>
        <Button onClick={showLoginModal} className="w-full">
          立即登录
        </Button>
      </div>
    );
  }

  const renderFolderGroup = (title: string, folderList: Folder[]) => {
    if (folderList.length === 0) return null;
    
    return (
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {folderList.map((folder) => (
            <div
              key={folder.id}
              className={`p-3 border rounded-lg flex flex-col hover:border-primary transition-colors ${folder.hidden ? 'opacity-60' : ''} cursor-pointer`}
              onClick={() => handleFolderClick(folder.id)}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center">
                  <FolderIcon className="h-5 w-5 mr-2 text-primary flex-shrink-0" />
                  {editingFolderId === folder.id ? (
                    <Input
                      value={editingFolderName}
                      onChange={(e) => setEditingFolderName(e.target.value)}
                      onBlur={saveEditedFolderName}
                      onKeyDown={handleKeyDown}
                      autoFocus
                      className="h-7 py-1 w-full"
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <span 
                      className="font-medium truncate"
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        startEditingFolderName(folder);
                      }}
                    >
                      {folder.name}
                    </span>
                  )}
                  {folder.hidden && <EyeOffIcon className="h-3.5 w-3.5 ml-1 text-muted-foreground" />}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVerticalIcon className="h-3.5 w-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem 
                      onClick={(e) => {
                        e.stopPropagation();
                        startEditingFolderName(folder);
                      }}
                      className="flex items-center gap-2"
                    >
                      <PenIcon className="h-4 w-4" />
                      <span>重命名</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleHiddenFolder(folder.id);
                      }}
                      className="flex items-center gap-2"
                    >
                      {folder.hidden ? (
                        <>
                          <EyeIcon className="h-4 w-4" />
                          <span>显示</span>
                        </>
                      ) : (
                        <>
                          <EyeOffIcon className="h-4 w-4" />
                          <span>隐藏</span>
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteFolder(folder.id);
                      }}
                      className="flex items-center gap-2 text-destructive focus:text-destructive"
                    >
                      <TrashIcon className="h-4 w-4" />
                      <span>删除</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <p className="text-xs text-muted-foreground mt-auto">
                创建于 {new Date(folder.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4 mt-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">我的文案收藏夹</h2>
        <div className="space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowHidden(!showHidden)}
            className="flex items-center gap-1"
          >
            {showHidden ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
            <span className="hidden sm:inline">{showHidden ? "隐藏" : "显示"}已隐藏</span>
          </Button>
          <Dialog open={isCreating} onOpenChange={setIsCreating}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <FolderPlusIcon className="h-4 w-4" />
                <span>新建文案收藏夹</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>创建新文案收藏夹</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <Label htmlFor="folderName">收藏夹名称</Label>
                <Input
                  id="folderName"
                  value={folderName}
                  onChange={(e) => setFolderName(e.target.value)}
                  placeholder="输入收藏夹名称"
                  className="mt-2"
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreating(false)}>
                  取消
                </Button>
                <Button onClick={handleCreateFolder} disabled={isLoading}>
                  {isLoading ? "创建中..." : "创建"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="space-y-6">
        {folders.length === 0 ? (
          <div className="p-8 border rounded-lg text-center">
            <FolderIcon className="mx-auto h-8 w-8 opacity-50 mb-2" />
            <p className="text-muted-foreground">暂无文案收藏夹，点击&quot;新建文案收藏夹&quot;创建</p>
          </div>
        ) : (
          <>
            {renderFolderGroup("今天", groupedFolders.today)}
            {renderFolderGroup("昨天", groupedFolders.yesterday)}
            {renderFolderGroup("本周", groupedFolders.thisWeek)}
            {renderFolderGroup("更早", groupedFolders.earlier)}
          </>
        )}
      </div>
    </div>
  );
}