import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  // 在实际应用中，这里应该从数据库获取用户信息
  // 这里为了演示使用了简单的 cookie 验证
  const sessionId = (await cookies()).get("session_id")?.value;
  
  if (!sessionId) {
    return NextResponse.json(null, { status: 401 });
  }
  
  // 模拟从数据库获取用户信息
  // 在实际应用中应该使用真实的数据库查询
  const userData = {
    id: "user_1",
    username: "测试用户",
    phone: "13800138000",
    createdAt: new Date().toISOString(),
  };
  
  return NextResponse.json(userData);
}