import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Agent-Agent | Writers Edition",
  description: "Turn one piece of content into 30 LinkedIn posts. Automatically.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
