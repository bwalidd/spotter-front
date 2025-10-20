import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const geist = Geist({ subsets: ["latin"] })
const geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ELD Log Generator",
  description: "Professional Electronic Logging Device (ELD) generator for FMCSA Hours of Service compliance",
  keywords: "ELD, Electronic Logging Device, FMCSA, Hours of Service, HOS, Truck Driver, Compliance",
 
  icons: {
    icon: '/placeholder-logo.svg',
    apple: '/placeholder-logo.svg'
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geist.className} antialiased`}>{children}</body>
    </html>
  )
}
