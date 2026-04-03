import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CookieConsent } from "@/components/cookie-consent"
import { CookieSettings } from "@/components/cookie-settings"
import { AnalyticsProvider } from "@/components/analytics-provider"
import { Suspense } from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Countries Explorer",
  description: "Explore countries around the world with detailed information",
  icons: {
    icon: [
      { url: "/favicon.ico" },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} flex min-h-screen flex-col`}>
        <AnalyticsProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Suspense fallback={null}>
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
              <CookieConsent />
              <CookieSettings />
            </Suspense>
          </ThemeProvider>
        </AnalyticsProvider>
      </body>
    </html>
  )
}