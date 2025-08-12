"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X, Cookie, Settings, Check } from "lucide-react"
import Link from "next/link"
import { updateGAConsent } from "@/lib/analytics"
import { useAnalytics } from "@/hooks/use-analytics"

interface CookiePreferences {
  necessary: boolean
  analytics: boolean
  marketing: boolean
  preferences: boolean
}

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Always true, cannot be disabled
    analytics: false,
    marketing: false,
    preferences: false,
  })

  const { trackConsent } = useAnalytics()

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem("cookie-consent")
    if (!consent) {
      // Show banner after a short delay for better UX
      const timer = setTimeout(() => setShowBanner(true), 1000)
      return () => clearTimeout(timer)
    } else {
      // Load saved preferences
      try {
        const savedPreferences = JSON.parse(consent)
        setPreferences(savedPreferences)
        // Apply cookie preferences to Google Analytics
        updateGAConsent(savedPreferences)
      } catch (error) {
        console.error("Error parsing cookie preferences:", error)
      }
    }
  }, [])

  const applyCookiePreferences = (prefs: CookiePreferences) => {
    // Update Google Analytics consent
    updateGAConsent(prefs)

    // Apply other cookie preferences
    if (prefs.analytics) {
      console.log("Analytics cookies enabled")
    } else {
      console.log("Analytics cookies disabled")
    }

    if (prefs.marketing) {
      console.log("Marketing cookies enabled")
    } else {
      console.log("Marketing cookies disabled")
    }

    if (prefs.preferences) {
      console.log("Preference cookies enabled")
    } else {
      console.log("Preference cookies disabled")
    }
  }

  const acceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    }
    setPreferences(allAccepted)
    localStorage.setItem("cookie-consent", JSON.stringify(allAccepted))
    localStorage.setItem("cookie-consent-date", new Date().toISOString())
    applyCookiePreferences(allAccepted)

    // Track consent decision
    trackConsent("accept_all", allAccepted)

    setShowBanner(false)
    setShowSettings(false)
  }

  const acceptNecessaryOnly = () => {
    const necessaryOnly = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
    }
    setPreferences(necessaryOnly)
    localStorage.setItem("cookie-consent", JSON.stringify(necessaryOnly))
    localStorage.setItem("cookie-consent-date", new Date().toISOString())
    applyCookiePreferences(necessaryOnly)

    // Track consent decision
    trackConsent("necessary_only", necessaryOnly)

    setShowBanner(false)
    setShowSettings(false)
  }

  const saveCustomPreferences = () => {
    localStorage.setItem("cookie-consent", JSON.stringify(preferences))
    localStorage.setItem("cookie-consent-date", new Date().toISOString())
    applyCookiePreferences(preferences)

    // Track consent decision
    trackConsent("custom_preferences", preferences)

    setShowBanner(false)
    setShowSettings(false)
  }

  const updatePreference = (key: keyof CookiePreferences, value: boolean) => {
    if (key === "necessary") return // Cannot disable necessary cookies
    setPreferences((prev) => ({ ...prev, [key]: value }))
  }

  if (!showBanner) return null

  return (
    <>
      {/* Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
            <div className="flex items-start gap-3 flex-1">
              <Cookie className="w-6 h-6 text-orange-500 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 dark:text-white mb-2">We use cookies</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. By
                  clicking "Accept All", you consent to our use of cookies including Google Analytics.
                </p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <Link href="/privacy" className="text-blue-500 hover:underline">
                    Privacy Policy
                  </Link>
                  <span className="text-gray-400">•</span>
                  <Link href="/cookies" className="text-blue-500 hover:underline">
                    Cookie Policy
                  </Link>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
              <Button variant="outline" size="sm" onClick={() => setShowSettings(true)} className="w-full sm:w-auto">
                <Settings className="w-4 h-4 mr-2" />
                Customize
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={acceptNecessaryOnly}
                className="w-full sm:w-auto bg-transparent"
              >
                Necessary Only
              </Button>
              <Button onClick={acceptAll} size="sm" className="w-full sm:w-auto">
                Accept All
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Cookie Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Cookie Preferences</h2>
                <Button variant="ghost" size="icon" onClick={() => setShowSettings(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-6">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  We use different types of cookies to optimize your experience on our website. You can choose which
                  categories you want to allow. Please note that blocking some types of cookies may impact your
                  experience.
                </p>

                {/* Necessary Cookies */}
                <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-800 dark:text-white">Necessary Cookies</h3>
                      <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                        Always Active
                      </span>
                    </div>
                    <div className="w-12 h-6 bg-green-500 rounded-full flex items-center justify-end px-1">
                      <div className="w-4 h-4 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    These cookies are essential for the website to function properly. They enable basic features like
                    page navigation, access to secure areas, and remember your theme preferences.
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Examples: Session cookies, security cookies, theme preferences
                  </p>
                </div>

                {/* Analytics Cookies */}
                <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-800 dark:text-white">Analytics Cookies</h3>
                    <button
                      onClick={() => updatePreference("analytics", !preferences.analytics)}
                      className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${
                        preferences.analytics ? "bg-blue-500 justify-end" : "bg-gray-300 dark:bg-gray-600 justify-start"
                      }`}
                    >
                      <div className="w-4 h-4 bg-white rounded-full"></div>
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    These cookies help us understand how visitors interact with our website by collecting and reporting
                    information anonymously using Google Analytics 4. This helps us improve our website performance.
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Examples: Google Analytics (_ga, _ga_*), page views, user behavior tracking
                  </p>
                </div>

                {/* Marketing Cookies */}
                <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-800 dark:text-white">Marketing Cookies</h3>
                    <button
                      onClick={() => updatePreference("marketing", !preferences.marketing)}
                      className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${
                        preferences.marketing ? "bg-blue-500 justify-end" : "bg-gray-300 dark:bg-gray-600 justify-start"
                      }`}
                    >
                      <div className="w-4 h-4 bg-white rounded-full"></div>
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    These cookies are used to track visitors across websites to display relevant advertisements and
                    measure the effectiveness of marketing campaigns.
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Examples: Social media pixels, advertising networks, remarketing
                  </p>
                </div>

                {/* Preference Cookies */}
                <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-800 dark:text-white">Preference Cookies</h3>
                    <button
                      onClick={() => updatePreference("preferences", !preferences.preferences)}
                      className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${
                        preferences.preferences
                          ? "bg-blue-500 justify-end"
                          : "bg-gray-300 dark:bg-gray-600 justify-start"
                      }`}
                    >
                      <div className="w-4 h-4 bg-white rounded-full"></div>
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    These cookies allow the website to remember choices you make and provide enhanced, more personal
                    features based on your preferences.
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Examples: Language preferences, region settings, personalized content
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-8">
                <Button variant="outline" onClick={acceptNecessaryOnly} className="flex-1 bg-transparent">
                  Accept Necessary Only
                </Button>
                <Button onClick={saveCustomPreferences} className="flex-1">
                  <Check className="w-4 h-4 mr-2" />
                  Save Preferences
                </Button>
                <Button onClick={acceptAll} className="flex-1">
                  Accept All
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
