import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { phone, password } = data;
    
    // 在实际应用中需要验证手机号和密码
    // 这里为了演示直接通过
    if (!phone || !password) {
      return NextResponse.json(
        { error: "手机号和密码不能为空" },
        { status: 400 }
      );
    }
    
    // 模拟密码验证
    if (password !== "123456" && process.env.NODE_ENV !== "development") {
      return NextResponse.json(
        { error: "密码错误" },
        { status: 400 }
      );
    }
    
    // 生成会话ID并设置cookie
    const sessionId = `session_${Date.now()}`;
    (await cookies()).set({
      name: "session_id",
      value: sessionId,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    
    // 模拟用户数据
    // 在实际应用中应该从数据库获取
    const userData = {
      id: "user_1",
      username: "测试用户",
      phone,
      createdAt: new Date().toISOString(),
    };
    
    return NextResponse.json(userData);
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "登录失败，请稍后再试" },
      { status: 500 }
    );
  }
}