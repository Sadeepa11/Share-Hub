import type { Metadata } from "next";
import { Outfit, DM_Serif_Display } from "next/font/google";
import { Toaster } from "react-hot-toast";
import ConditionalNavbar from "./components/ConditionalNavbar";
import Navbar from "./components/Navbar";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const dmSerif = DM_Serif_Display({
  variable: "--font-dm-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "ShareHub - Donation Platform",
  description: "A platform for sharing and requesting donations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} ${dmSerif.variable} antialiased min-h-screen flex flex-col bg-app-cream`}
      >
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "#1b3022",
              color: "#faf7f2",
              borderRadius: "12px",
              border: "1px solid #2d4a35",
              padding: "14px 20px",
              fontSize: "14px",
              fontWeight: "500",
              boxShadow: "0 10px 25px -5px rgba(27, 48, 34, 0.25)",
            },
            success: {
              iconTheme: {
                primary: "#f97316",
                secondary: "#faf7f2",
              },
            },
            error: {
              style: {
                background: "#fff",
                color: "#ef4444",
                border: "1px solid #fecaca",
              },
              iconTheme: {
                primary: "#ef4444",
                secondary: "#fff",
              },
            },
          }}
        />
        <ConditionalNavbar>
          <Navbar />
        </ConditionalNavbar>
        {children}
      </body>
    </html>
  );
}
