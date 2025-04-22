"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LoginForm } from "./login-form";
import { RegisterForm } from "./register-form";

interface AuthModalProps {
  children?: React.ReactNode;
  mode?: "login" | "register";
  showTrigger?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function AuthModal({ 
  children, 
  mode = "login", 
  showTrigger = true,
  defaultOpen = false,
  onOpenChange
}: AuthModalProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [activeMode, setActiveMode] = useState<"login" | "register">(mode);

  // 当外部defaultOpen属性变化时，更新内部状态
  useEffect(() => {
    setOpen(defaultOpen);
  }, [defaultOpen]);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (onOpenChange) {
      onOpenChange(newOpen);
    }
  };

  const switchMode = () => {
    setActiveMode(activeMode === "login" ? "register" : "login");
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {showTrigger && (
        <DialogTrigger asChild>
          {children || <Button variant="outline">登录</Button>}
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[425px]">
        <DialogTitle className="text-center text-2xl font-semibold">
          {activeMode === "login" ? "欢迎回来" : "创建新账号"}
        </DialogTitle>
        
        {activeMode === "login" ? (
          <>
            <LoginForm onSuccess={() => handleOpenChange(false)} />
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                没有账号？
                <Button 
                  variant="link" 
                  className="p-0 h-auto font-normal" 
                  onClick={switchMode}
                >
                  注册
                </Button>
              </p>
            </div>
          </>
        ) : (
          <>
            <RegisterForm onSuccess={() => setActiveMode("login")} />
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                已有账号？
                <Button 
                  variant="link" 
                  className="p-0 h-auto font-normal" 
                  onClick={switchMode}
                >
                  登录
                </Button>
              </p>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}