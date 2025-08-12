"use client"

// Google Analytics 4 configuration and consent management

declare global {
  interface Window {
    gtag: (...args: any[]) => void
    dataLayer: any[]
  }
}

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-XXXXXXXXXX"

// Initialize Google Analytics with consent mode
export const initializeGA = () => {
  // Create dataLayer if it doesn't exist
  window.dataLayer = window.dataLayer || []

  // Define gtag function
  window.gtag = function gtag() {
    window.dataLayer.push(arguments)
  }

  // Set default consent state (denied by default for GDPR compliance)
  window.gtag("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    functionality_storage: "denied",
    personalization_storage: "denied",
    security_storage: "granted", // Always granted for security
  })

  // Initialize GA4
  window.gtag("js", new Date())
  window.gtag("config", GA_MEASUREMENT_ID, {
    page_title: document.title,
    page_location: window.location.href,
  })
}

// Update consent based on user preferences
export const updateGAConsent = (preferences: {
  necessary: boolean
  analytics: boolean
  marketing: boolean
  preferences: boolean
}) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("consent", "update", {
      analytics_storage: preferences.analytics ? "granted" : "denied",
      ad_storage: preferences.marketing ? "granted" : "denied",
      ad_user_data: preferences.marketing ? "granted" : "denied",
      ad_personalization: preferences.marketing ? "granted" : "denied",
      functionality_storage: preferences.preferences ? "granted" : "denied",
      personalization_storage: preferences.preferences ? "granted" : "denied",
    })

    console.log("GA consent updated:", {
      analytics: preferences.analytics ? "granted" : "denied",
      marketing: preferences.marketing ? "granted" : "denied",
      preferences: preferences.preferences ? "granted" : "denied",
    })
  }
}

// Track page views
export const trackPageView = (url: string, title?: string) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("config", GA_MEASUREMENT_ID, {
      page_path: url,
      page_title: title || document.title,
    })
  }
}

// Track custom events
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// Specific tracking functions for Countries Explorer
export const trackCountryView = (countryName: string, countryCode: string) => {
  trackEvent("view_country", "country_interaction", `${countryName} (${countryCode})`)
}

export const trackCountrySearch = (searchQuery: string, resultsCount: number) => {
  trackEvent("search_country", "search", searchQuery, resultsCount)
}

export const trackThemeChange = (theme: string) => {
  trackEvent("change_theme", "user_preference", theme)
}

export const trackPageNavigation = (page: string) => {
  trackEvent("navigate_page", "navigation", page)
}

export const trackCookieConsent = (consentType: string, preferences: any) => {
  trackEvent("cookie_consent", "privacy", consentType, Object.values(preferences).filter(Boolean).length)
}

// Enhanced ecommerce events (if needed for future features)
export const trackUserEngagement = (engagementTime: number) => {
  trackEvent("user_engagement", "engagement", "time_on_site", engagementTime)
}

export const trackError = (errorMessage: string, errorLocation: string) => {
  trackEvent("exception", "error", `${errorLocation}: ${errorMessage}`)
}

// Privacy-friendly user identification (no PII)
export const setUserProperties = (properties: Record<string, any>) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("config", GA_MEASUREMENT_ID, {
      custom_map: properties,
    })
  }
}

// Debug function for development
export const debugGA = () => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("config", GA_MEASUREMENT_ID, {
      debug_mode: process.env.NODE_ENV === "development",
    })
  }
}
