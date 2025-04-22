import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { phone } = data;
    
    if (!phone) {
      return NextResponse.json(
        { error: "手机号不能为空" },
        { status: 400 }
      );
    }
    
    // 验证手机号格式
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      return NextResponse.json(
        { error: "手机号格式不正确" },
        { status: 400 }
      );
    }
    
    // 在实际应用中，这里应该发送真实的短信验证码
    // 为了演示，模拟发送成功
    console.log(`[DEV] 向 ${phone} 发送验证码: 1234`);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Send code error:", error);
    return NextResponse.json(
      { error: "发送验证码失败，请稍后再试" },
      { status: 500 }
    );
  }
}