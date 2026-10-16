import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Muhammad Rafii - Portfolio",
  description: "IT Developer & Data Analyst Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Sembunyikan splash sebelum paint untuk pengunjung yang sudah pernah masuk (lihat WelcomeSplash). */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem("portfolio-welcomed")==="1")document.documentElement.dataset.welcomed="1"}catch(e){}`,
          }}
        />
        <noscript>
          <style>{`.welcome-splash{display:none!important}`}</style>
        </noscript>
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
