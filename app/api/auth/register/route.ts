import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { username, phone, code, password } = data;
    
    // 在实际应用中需要验证手机号、验证码和密码
    // 这里为了演示直接通过
    if (!username || !phone || !code || !password) {
      return NextResponse.json(
        { error: "所有字段都不能为空" },
        { status: 400 }
      );
    }
    
    // 模拟验证码验证
    if (code !== "1234" && process.env.NODE_ENV !== "development") {
      return NextResponse.json(
        { error: "验证码错误" },
        { status: 400 }
      );
    }
    
    // 检查手机号是否已注册
    // 在实际应用中，这里需要查询数据库
    // 为了演示，直接通过
    
    // 创建用户
    // 在实际应用中，这里需要将用户信息保存到数据库
    // 为了演示，直接通过
    
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
    const userData = {
      id: "user_1",
      username,
      phone,
      createdAt: new Date().toISOString(),
    };
    
    return NextResponse.json(userData);
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "注册失败，请稍后再试" },
      { status: 500 }
    );
  }
}