import './styles.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '玩转温哥华岛',
  description: '温哥华岛华人社区：户外、手作、宠物与本地发现'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
