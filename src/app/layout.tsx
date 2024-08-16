import { StoreProvider } from "@/store/StoreProvider";
import { Toaster } from "@/components/ui/toaster";
import Providers from "@/components/Providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ngoding Seru - Tantangan Seru Coding Harianmu",
  description:
    "Selesaikan tantangan harian dan latih kemampuan coding-mu dengan soal-soal yang menarik disini!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon-ngoding-seru.png" />
      </head>
      <body className="font-cofo-regular antialiased">
        <StoreProvider>
          <Providers>
            <Header />
            <main className="container min-h-screen pt-24">{children}</main>
            <Footer />
            <Toaster />
          </Providers>
        </StoreProvider>
      </body>
    </html>
  );
}
