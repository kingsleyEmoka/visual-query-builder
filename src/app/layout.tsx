"use client"

import "./globals.css";
import { useQueryStore } from "@/store/queryStore"
import { useEffect } from "react"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const theme = useQueryStore((state) => state.theme)

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark")
  }, [theme])

  return (
    <html lang="en">
      <body className="bg-white dark:bg-gray-900 dark:text-white transition-colors">
        {children}
      </body>
    </html>
  );
}