import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "akademi.biz.tr — Akademi Klonuyla LGS & YKS",
  description: "Canlı ders + öğretmeninin sesiyle ve tarzıyla 7/24 Akademi Klonu özel ders. LGS ve YKS için kesintisiz online akademi.",
  metadataBase: new URL("https://akademi.biz.tr"),
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/logo.png", type: "image/png" },
    ],
    apple: [{ url: "/logo.png" }],
  },
  openGraph: {
    title: "akademi.biz.tr",
    description: "Akademi Klonuyla LGS & YKS",
    url: "https://akademi.biz.tr",
    siteName: "akademi.biz.tr",
    locale: "tr_TR",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#030712] text-white">{children}</body>
    </html>
  );
}
