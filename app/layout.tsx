import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "EgyMedya | Connect with us", description: "A direct line to the EgyMedya team." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }