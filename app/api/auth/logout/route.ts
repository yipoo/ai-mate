import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  // 创建 cookie 存储实例
  const cookieStore = await cookies();
  
  // 清除会话cookie
  cookieStore.delete("session_id");
  
  return NextResponse.json({ success: true });
}