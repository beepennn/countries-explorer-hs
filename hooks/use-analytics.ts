"use client"

import { useCallback, useEffect } from "react"
import {
  trackCountryView,
  trackCountrySearch,
  trackThemeChange,
  trackPageNavigation,
  trackCookieConsent,
  trackUserEngagement,
  trackError,
} from "@/lib/analytics"

export function useAnalytics() {
  // Track user engagement time
  useEffect(() => {
    const startTime = Date.now()

    const handleBeforeUnload = () => {
      const engagementTime = Math.round((Date.now() - startTime) / 1000)
      if (engagementTime > 10) {
        // Only track if user stayed more than 10 seconds
        trackUserEngagement(engagementTime)
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [])

  const trackCountry = useCallback((countryName: string, countryCode: string) => {
    trackCountryView(countryName, countryCode)
  }, [])

  const trackSearch = useCallback((query: string, resultsCount: number) => {
    trackCountrySearch(query, resultsCount)
  }, [])

  const trackTheme = useCallback((theme: string) => {
    trackThemeChange(theme)
  }, [])

  const trackNavigation = useCallback((page: string) => {
    trackPageNavigation(page)
  }, [])

  const trackConsent = useCallback((consentType: string, preferences: any) => {
    trackCookieConsent(consentType, preferences)
  }, [])

  const trackAppError = useCallback((error: string, location: string) => {
    trackError(error, location)
  }, [])

  return {
    trackCountry,
    trackSearch,
    trackTheme,
    trackNavigation,
    trackConsent,
    trackAppError,
  }
}
