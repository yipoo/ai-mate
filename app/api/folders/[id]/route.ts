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

export async function GET(
  request: NextRequest,
  // context: { params: { id: string } }
) {
  // 获取请求参数
  const { id } = await request.json();
  // 检查用户是否已登录
  const sessionId = (await cookies()).get("session_id")?.value;
  
  if (!sessionId) {
    return NextResponse.json(null, { status: 401 });
  }
  
  // 获取指定ID的文件夹
  const folder = folders.find(f => f.id === id);
  
  if (!folder) {
    return NextResponse.json(
      { error: "文件夹不存在" },
      { status: 404 }
    );
  }
  
  return NextResponse.json(folder);
}

export async function PUT(
  request: NextRequest,
    // context: { params: { id: string } }
) {
  // 获取请求参数
  const { id } = await request.json();
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
    
    // 获取指定ID的文件夹
    const folderIndex = folders.findIndex(f => f.id === id);
    
    if (folderIndex === -1) {
      return NextResponse.json(
        { error: "文件夹不存在" },
        { status: 404 }
      );
    }
    
    // 更新文件夹
    folders[folderIndex] = {
      ...folders[folderIndex],
      name,
    };
    
    return NextResponse.json(folders[folderIndex]);
  } catch (error) {
    console.error("Update folder error:", error);
    return NextResponse.json(
      { error: "更新文件夹失败，请稍后再试" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  // context: { params: { id: string } }
) {
  // 获取请求参数
  const { id } = await request.json();
  // 检查用户是否已登录
  const sessionId = (await cookies()).get("session_id")?.value;
  
  if (!sessionId) {
    return NextResponse.json(null, { status: 401 });
  }
  
  // 获取指定ID的文件夹
  const folderIndex = folders.findIndex(f => f.id === id);
  
  if (folderIndex === -1) {
    return NextResponse.json(
      { error: "文件夹不存在" },
      { status: 404 }
    );
  }
  
  // 删除文件夹
  folders.splice(folderIndex, 1);
  
  return NextResponse.json({ success: true });
}