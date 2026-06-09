import type { Metadata } from "next";
import "@/index.css";

export const metadata: Metadata = {
  title: "Techvaa Admin",
  description: "Techvaa admin panel",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  // Admin must never be indexed.
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
