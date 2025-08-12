"use client"

import type React from "react"

import { useEffect } from "react"
import Script from "next/script"
import { usePathname } from "next/navigation"
import { initializeGA, trackPageView, updateGAConsent, GA_MEASUREMENT_ID } from "@/lib/analytics"

interface AnalyticsProviderProps {
  children: React.ReactNode
}

export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  const pathname = usePathname()

  useEffect(() => {
    // Track page views on route changes
    if (pathname) {
      trackPageView(pathname)
    }
  }, [pathname])

  useEffect(() => {
    // Check for existing consent and update GA accordingly
    const consent = localStorage.getItem("cookie-consent")
    if (consent) {
      try {
        const preferences = JSON.parse(consent)
        updateGAConsent(preferences)
      } catch (error) {
        console.error("Error parsing cookie consent for GA:", error)
      }
    }
  }, [])

  const handleGALoad = () => {
    initializeGA()

    // Apply existing consent if available
    const consent = localStorage.getItem("cookie-consent")
    if (consent) {
      try {
        const preferences = JSON.parse(consent)
        updateGAConsent(preferences)
      } catch (error) {
        console.error("Error applying consent to GA:", error)
      }
    }
  }

  return (
    <>
      {/* Google Analytics Scripts */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
        onLoad={handleGALoad}
      />

      {children}
    </>
  )
}
