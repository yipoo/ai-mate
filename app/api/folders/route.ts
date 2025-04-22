import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

// 模拟数据库中的文件夹
const folders = [
  {
    id: "folder_1",
    name: "抖音文案",
    userId: "user_1",
    createdAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "folder_2",
    name: "小红书文案",
    userId: "user_1",
    createdAt: "2024-01-02T00:00:00.000Z",
  },
];

export async function GET() {
  // 检查用户是否已登录
  const sessionId = (await cookies()).get("session_id")?.value;
  
  if (!sessionId) {
    return NextResponse.json(null, { status: 401 });
  }
  
  // 在实际应用中，应该根据用户ID获取其文件夹
  // 这里为了演示，直接返回所有文件夹
  return NextResponse.json(folders);
}

export async function POST(request: NextRequest) {
  // 检查用户是否已登录
  const sessionId = (await cookies()).get("session_id")?.value;
  
  if (!sessionId) {
    return NextResponse.json(null, { status: 401 });
  }
  
  try {
    const data = await request.json();
    const { name } = data;
    
    if (!name) {
      return NextResponse.json(
        { error: "文件夹名称不能为空" },
        { status: 400 }
      );
    }
    
    // 创建新文件夹
    const newFolder = {
      id: `folder_${Date.now()}`,
      name,
      userId: "user_1", // 在实际应用中，这应该是实际用户的ID
      createdAt: new Date().toISOString(),
    };
    
    // 在实际应用中，这里应该将文件夹保存到数据库
    // 这里为了演示，添加到内存中的数组
    folders.push(newFolder);
    
    return NextResponse.json(newFolder);
  } catch (error) {
    console.error("Create folder error:", error);
    return NextResponse.json(
      { error: "创建文件夹失败，请稍后再试" },
      { status: 500 }
    );
  }
}