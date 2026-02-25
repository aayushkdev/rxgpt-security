"use client";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["600", "700"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Inter is applied to the body; headings use Jakarta via the style below */}
        <style jsx global>{`\
          h1, h2, h3, h4, h5, h6 {\
            font-family: ${jakarta.style.fontFamily};\
          }\
        `}</style>

        {children}
      </body>
    </html>
  );
}