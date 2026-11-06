import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Frogame Learning Companion",
  description: "Learn Java and Android by building a token-grid game.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
