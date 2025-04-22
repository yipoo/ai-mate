import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 在实际应用中，这里应该重定向到微信授权页面
    // 为了演示，返回一个HTML页面
    
    const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>微信登录</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
            padding: 20px;
            box-sizing: border-box;
            text-align: center;
          }
          
          .qr-code {
            width: 200px;
            height: 200px;
            background-color: #f0f0f0;
            margin: 20px auto;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            color: #666;
          }
          
          h1 {
            font-size: 24px;
            margin-bottom: 10px;
          }
          
          p {
            color: #666;
            margin-bottom: 20px;
          }
          
          button {
            background-color: #07C160;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <h1>微信扫码登录</h1>
        <p>请使用微信扫描下方二维码完成登录</p>
        <div class="qr-code">
          [模拟微信二维码]
        </div>
        <p>演示环境：点击下方按钮模拟扫码成功</p>
        <button onclick="simulateLogin()">模拟扫码登录</button>
        
        <script>
          function simulateLogin() {
            window.opener.postMessage({ type: 'wechat_login', success: true, user: {
              id: 'user_wx_1',
              username: '微信用户',
              phone: '',
              avatar: '',
              createdAt: new Date().toISOString()
            }}, '*');
            setTimeout(() => window.close(), 1000);
          }
        </script>
      </body>
    </html>
    `;
    
    return new Response(html, {
      headers: {
        "Content-Type": "text/html",
      },
    });
  } catch (error) {
    console.error("Wechat login error:", error);
    return NextResponse.json(
      { error: "微信登录失败，请稍后再试" },
      { status: 500 }
    );
  }
}