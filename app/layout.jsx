import "./globals.css";

export const metadata = {
  title: "Adventure Park | AI Background Generator",
  description: "AIエージェントが言葉から背景画像を生成するデモサイト",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
