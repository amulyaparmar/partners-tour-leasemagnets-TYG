import type { Metadata } from "next";
import localFont from "next/font/local";

import "./globals.css";

const displayFont = localFont({
  src: [
    {
      path: "../public/fonts/Nohemi-Regular.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Nohemi-SemiBold.woff",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-heading",
});

const bodyFont = localFont({
  src: [
    {
      path: "../public/fonts/PlusJakartaSans-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/PlusJakartaSans-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-body",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://partners-tour.local"),
  title: {
    default: "Partners Tour LeaseMagnets",
    template: "%s | Partners Tour LeaseMagnets",
  },
  description:
    "A fresh Next.js starter for LeaseMagnets landing pages, client work, shared invoices, quotes, and future AI tooling.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${displayFont.variable} ${bodyFont.variable} bg-[var(--color-background)] text-[var(--color-foreground)] antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
