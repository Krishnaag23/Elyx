import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { Sidebar } from "./components/layout/sidebar";
import { Header } from "./components/layout/header";
import { ThemeProvider } from "./components/themeProvider";

export const metadata: Metadata = {
  title: "Elyx Member Cockpit",
  description: "A comprehensive journey visualization and analytics platform.",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex h-screen overflow-hidden bg-background text-foreground">
            {/* Sidebar is a direct child of the main flex container */}
            <Sidebar />

            {/* This div will contain the header and the main page content */}
            <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
              {/* Header sits inside the scrollable content area */}
              <Header memberName="Rohan Patel" />

              {/* The `main` tag is where your page content will be rendered */}
              <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
