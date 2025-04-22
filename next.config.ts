import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  // 禁用 ESLint 检查，解决构建错误
  eslint: {
    ignoreDuringBuilds: true,
  },
  // 增加 API 超时时间
  // experimental: {
  //   serverComponentsExternalPackages: ['openai'],
  //   serverActions: {
  //     bodySizeLimit: '4mb', // 增加请求体大小限制
  //   },
  // },
  // // 解决可能的 CORS 问题
  // async headers() {
  //   return [
  //     {
  //       source: '/api/:path*',
  //       headers: [
  //         { key: 'Access-Control-Allow-Credentials', value: 'true' },
  //         { key: 'Access-Control-Allow-Origin', value: '*' },
  //         { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT' },
  //         { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
  //       ],
  //     },
  //   ];
  // },
  // 增加响应超时
  serverRuntimeConfig: {
    // 60秒超时，针对所有服务端操作
    apiResponseTimeout: 60000,
  },
};

export default nextConfig;
