"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Cookie, Check, X } from "lucide-react"
import { updateGAConsent } from "@/lib/analytics"
import { useAnalytics } from "@/hooks/use-analytics"

interface CookiePreferences {
  necessary: boolean
  analytics: boolean
  marketing: boolean
  preferences: boolean
}

export function CookieSettings() {
  const [showSettings, setShowSettings] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
    preferences: false,
  })
  const [hasConsent, setHasConsent] = useState(false)

  const { trackConsent } = useAnalytics()

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent")
    if (consent) {
      setHasConsent(true)
      try {
        const savedPreferences = JSON.parse(consent)
        setPreferences(savedPreferences)
      } catch (error) {
        console.error("Error parsing cookie preferences:", error)
      }
    }
  }, [])

  const updatePreference = (key: keyof CookiePreferences, value: boolean) => {
    if (key === "necessary") return
    setPreferences((prev) => ({ ...prev, [key]: value }))
  }

  const savePreferences = () => {
    localStorage.setItem("cookie-consent", JSON.stringify(preferences))
    localStorage.setItem("cookie-consent-date", new Date().toISOString())

    // Update Google Analytics consent
    updateGAConsent(preferences)

    // Track the settings change
    trackConsent("settings_updated", preferences)

    setShowSettings(false)
    // Reload page to apply new cookie settings
    window.location.reload()
  }

  const clearAllCookies = () => {
    const necessaryOnly = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
    }
    setPreferences(necessaryOnly)
    localStorage.setItem("cookie-consent", JSON.stringify(necessaryOnly))
    localStorage.setItem("cookie-consent-date", new Date().toISOString())

    // Update Google Analytics consent
    updateGAConsent(necessaryOnly)

    // Clear all non-necessary cookies
    const cookies = document.cookie.split(";")
    cookies.forEach((cookie) => {
      const eqPos = cookie.indexOf("=")
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim()
      if (!["cookie-consent", "theme"].includes(name)) {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
      }
    })

    // Track the clear action
    trackConsent("cookies_cleared", necessaryOnly)

    setShowSettings(false)
    window.location.reload()
  }

  if (!hasConsent) return null

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowSettings(true)}
        className="fixed bottom-4 right-4 z-40 bg-white dark:bg-gray-800 shadow-lg"
      >
        <Cookie className="w-4 h-4 mr-2" />
        Cookie Settings
      </Button>

      {showSettings && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Cookie Settings</h2>
                <Button variant="ghost" size="icon" onClick={() => setShowSettings(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-6">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Manage your cookie preferences. Changes will take effect after saving and may require a page reload.
                </p>

                {/* Current Status */}
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Current Settings</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${preferences.necessary ? "bg-green-500" : "bg-gray-400"}`}
                      ></div>
                      <span className="text-gray-600 dark:text-gray-300">Necessary: Always On</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${preferences.analytics ? "bg-green-500" : "bg-gray-400"}`}
                      ></div>
                      <span className="text-gray-600 dark:text-gray-300">
                        Analytics: {preferences.analytics ? "On" : "Off"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${preferences.marketing ? "bg-green-500" : "bg-gray-400"}`}
                      ></div>
                      <span className="text-gray-600 dark:text-gray-300">
                        Marketing: {preferences.marketing ? "On" : "Off"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${preferences.preferences ? "bg-green-500" : "bg-gray-400"}`}
                      ></div>
                      <span className="text-gray-600 dark:text-gray-300">
                        Preferences: {preferences.preferences ? "On" : "Off"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Google Analytics Notice */}
                {preferences.analytics && (
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Google Analytics Active</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Google Analytics is currently tracking your usage to help us improve the website. All data is
                      collected anonymously and in compliance with privacy regulations.
                    </p>
                  </div>
                )}

                {/* Cookie Categories */}
                <div className="space-y-4">
                  {/* Necessary */}
                  <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-800 dark:text-white">Necessary Cookies</h3>
                      <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                        Always Active
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Essential for website functionality and security.
                    </p>
                  </div>

                  {/* Analytics */}
                  <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-800 dark:text-white">
                        Analytics Cookies (Google Analytics)
                      </h3>
                      <button
                        onClick={() => updatePreference("analytics", !preferences.analytics)}
                        className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${
                          preferences.analytics
                            ? "bg-blue-500 justify-end"
                            : "bg-gray-300 dark:bg-gray-600 justify-start"
                        }`}
                      >
                        <div className="w-4 h-4 bg-white rounded-full"></div>
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Help us understand website usage and improve performance using Google Analytics 4.
                    </p>
                  </div>

                  {/* Marketing */}
                  <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-800 dark:text-white">Marketing Cookies</h3>
                      <button
                        onClick={() => updatePreference("marketing", !preferences.marketing)}
                        className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${
                          preferences.marketing
                            ? "bg-blue-500 justify-end"
                            : "bg-gray-300 dark:bg-gray-600 justify-start"
                        }`}
                      >
                        <div className="w-4 h-4 bg-white rounded-full"></div>
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Used for advertising and measuring campaign effectiveness.
                    </p>
                  </div>

                  {/* Preferences */}
                  <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
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
                      Remember your choices and provide personalized features.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-8">
                <Button variant="destructive" onClick={clearAllCookies} className="flex-1">
                  Clear All Cookies
                </Button>
                <Button variant="outline" onClick={() => setShowSettings(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={savePreferences} className="flex-1">
                  <Check className="w-4 h-4 mr-2" />
                  Save Settings
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
