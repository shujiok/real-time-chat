import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Real-time Chat",
  description: "Monorepo scaffold frontend for real-time chat",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}
