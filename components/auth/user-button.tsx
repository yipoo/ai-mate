"use client";

import { useUser } from "@/providers/user-provider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FolderIcon, LogOutIcon, UserIcon } from "lucide-react";

export function UserButton() {
  const { user, isAuthenticated, logout, showLoginModal } = useUser();

  if (!isAuthenticated) {
    return (
      <Button variant="outline" onClick={showLoginModal}>
        登录 / 注册
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.username}
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <div className="fixed h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground p-1">
              {user?.username?.charAt(0).toUpperCase() || "U"}
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>我的账号</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex items-center">
          <UserIcon className="mr-2 h-4 w-4" />
          <span>个人信息</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-center">
          <FolderIcon className="mr-2 h-4 w-4" />
          <span>我的文件夹</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="flex items-center text-destructive focus:text-destructive" 
          onClick={logout}
        >
          <LogOutIcon className="mr-2 h-4 w-4" />
          <span>退出登录</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}