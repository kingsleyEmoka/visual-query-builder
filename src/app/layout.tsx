import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Visual Query Builder",
  description: "A schema-driven recursive query builder",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}