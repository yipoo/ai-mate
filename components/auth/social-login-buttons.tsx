 "use client";

import { Button } from "@/components/ui/button";

type SocialLoginButtonsProps = {
  isRegister?: boolean;
};

export function SocialLoginButtons({ isRegister = false }: SocialLoginButtonsProps) {
  const action = isRegister ? "注册" : "登录";

  const handleWechatLogin = async () => {
    try {
      window.open("/api/auth/wechat", "_blank", "width=600,height=600");
    } catch (error) {
      console.error("微信登录错误:", error);
    }
  };

  const handleXiaohongshuLogin = async () => {
    alert("小红书登录功能即将上线");
    // 后期实现
  };

  const handleDouyinLogin = async () => {
    alert("抖音登录功能即将上线");
    // 后期实现
  };

  const handleWeiboLogin = async () => {
    alert("微博登录功能即将上线");
    // 后期实现
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      <Button 
        variant="outline" 
        className="flex items-center justify-center gap-2"
        onClick={handleWechatLogin}
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.5 8.5C9.5 7.4 10.4 6.5 11.5 6.5C12.6 6.5 13.5 7.4 13.5 8.5C13.5 9.6 12.6 10.5 11.5 10.5C10.4 10.5 9.5 9.6 9.5 8.5Z" fill="#07C160"/>
          <path d="M6.5 13C6.5 11.9 7.4 11 8.5 11C9.6 11 10.5 11.9 10.5 13C10.5 14.1 9.6 15 8.5 15C7.4 15 6.5 14.1 6.5 13Z" fill="#07C160"/>
          <path d="M13.5 13C13.5 11.9 14.4 11 15.5 11C16.6 11 17.5 11.9 17.5 13C17.5 14.1 16.6 15 15.5 15C14.4 15 13.5 14.1 13.5 13Z" fill="#07C160"/>
          <path d="M18.5 2H5.5C3.29086 2 1.5 3.79086 1.5 6V18C1.5 20.2091 3.29086 22 5.5 22H18.5C20.7091 22 22.5 20.2091 22.5 18V6C22.5 3.79086 20.7091 2 18.5 2Z" stroke="#07C160" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <span>微信{action}</span>
      </Button>
      <Button 
        variant="outline" 
        className="flex items-center justify-center gap-2"
        onClick={handleXiaohongshuLogin}
        disabled
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z" stroke="#FF2442" strokeWidth="2"/>
          <path d="M8 12L11 15L16 10" stroke="#FF2442" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span>小红书{action}</span>
      </Button>
      <Button 
        variant="outline" 
        className="flex items-center justify-center gap-2"
        onClick={handleDouyinLogin}
        disabled
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 8V16C21 19.3137 18.3137 22 15 22H9C5.68629 22 3 19.3137 3 16V8C3 4.68629 5.68629 2 9 2H15C18.3137 2 21 4.68629 21 8Z" stroke="#000000" strokeWidth="2"/>
          <path d="M12 7V17M7 12H17" stroke="#000000" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <span>抖音{action}</span>
      </Button>
      <Button 
        variant="outline" 
        className="flex items-center justify-center gap-2"
        onClick={handleWeiboLogin}
        disabled
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19.5 3H4.5C3.67157 3 3 3.67157 3 4.5V19.5C3 20.3284 3.67157 21 4.5 21H19.5C20.3284 21 21 20.3284 21 19.5V4.5C21 3.67157 20.3284 3 19.5 3Z" stroke="#E6162D" strokeWidth="2"/>
          <path d="M15 8.25C15.4142 8.25 15.75 7.91421 15.75 7.5C15.75 7.08579 15.4142 6.75 15 6.75C14.5858 6.75 14.25 7.08579 14.25 7.5C14.25 7.91421 14.5858 8.25 15 8.25Z" fill="#E6162D"/>
          <path d="M12 15C14.2091 15 16 13.2091 16 11C16 8.79086 14.2091 7 12 7C9.79086 7 8 8.79086 8 11C8 13.2091 9.79086 15 12 15Z" stroke="#E6162D" strokeWidth="2"/>
        </svg>
        <span>微博{action}</span>
      </Button>
    </div>
  );
}