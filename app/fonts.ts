import localFont from 'next/font/local';

// 定义本地 Geist Sans 字体
export const geistSans = localFont({
  src: [
    {
      path: '../public/fonts/gyByhwUxId8gMEwcGFWNOITd.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/gyByhwUxId8gMEwSGFWNOITddY4.woff2',
      weight: '500',
      style: 'normal',
    },
  ],
  variable: '--font-geist-sans',
  display: 'swap',
});

// 定义本地 Geist Mono 字体
export const geistMono = localFont({
  src: [
    {
      path: '../public/fonts/geist-mono-regular.ttf',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-geist-mono',
  display: 'swap',
}); 