import type { Metadata } from "next";
import { Outfit, Noto_Sans_Thai } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const notoSansThai = Noto_Sans_Thai({
  subsets: ["thai"],
  variable: "--font-noto-sans-thai",
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Valorant Guess Who?",
  description: "A 2-player character guessing game for Valorant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${notoSansThai.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#0f141c] text-neutral-50">{children}</body>
    </html>
  );
}
