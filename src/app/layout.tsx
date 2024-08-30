import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tạo ảnh AI cùng Flux",
  description: "Tạo ảnh AI cùng Flux by Code Dạo (Powered by runware.ai)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
      <script
        defer
        data-domain="ai.codedao.cc"
        src="https://analytics.codedao.cc/js/script.js"
      ></script>
    </html>
  );
}
