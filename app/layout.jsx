import "./globals.css";

export const metadata = {
  title: "Adventure Park | AI Transformation Demo",
  description: "リストバンドをAIで変身させる背景動画デモサイト",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
