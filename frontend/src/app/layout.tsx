import type { Metadata } from "next";
import { Patrick_Hand, Quicksand } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const patrickHand = Patrick_Hand({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-patrick",
});

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
});

export const metadata: Metadata = {
  title: "MA6 Debt - Quản lý tài chính cá nhân",
  description: "Công cụ đơn giản giúp bạn theo dõi thu chi, quản lý nợ và xây dựng thói quen tài chính vững chắc.",
  icons: {
    icon: "/MA6.png",
    shortcut: "/MA6.png",
    apple: "/MA6.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${patrickHand.variable} ${quicksand.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
