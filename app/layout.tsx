import "./globals.css"
import { Inter } from "next/font/google"
import type React from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
    title: "Program Analyst",
    description: "A comprehensive program management tool",
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" suppressHydrationWarning>
        <head />
        <body className={`${inter.className} min-h-screen bg-background antialiased`}>{children}</body>
        </html>
    )
}

