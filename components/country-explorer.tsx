"use client"

import { useState, useEffect } from "react"
import { CountryList } from "@/components/country-list"
import { CountryDetail } from "@/components/country-detail"
import { SearchBar } from "@/components/search-bar"
import { Pagination } from "@/components/pagination"
import { ErrorMessage } from "@/components/error-message"
import { AISearchAssistant } from "@/components/ai-search-assistant"
import { InteractiveWorldMap } from "@/components/interactive-world-map"
import { AdvancedCountryComparison } from "@/components/advanced-country-comparison"
import { RealTimeDashboard } from "@/components/real-time-dashboard"
import { useCountries } from "@/hooks/use-countries"
import { useAnalytics } from "@/hooks/use-analytics"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LayoutDashboard, Map, BarChart3, List, Sparkles, TrendingUp } from "lucide-react"

export default function CountryExplorer() {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("explorer")
  const itemsPerPage = 10

  const { countries, isLoading, error } = useCountries()
  const { trackCountry, trackSearch, trackAppError, trackNavigation } = useAnalytics()

  // Check URL for selected country on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const countryParam = urlParams.get("country")
    const tabParam = urlParams.get("tab")

    if (countryParam) {
      setSelectedCountry(countryParam)
    }
    if (tabParam) {
      setActiveTab(tabParam)
    }
  }, [])

  // Track errors
  useEffect(() => {
    if (error) {
      trackAppError(error, "country-explorer")
    }
  }, [error, trackAppError])

  // Filter countries based on search query
  const filteredCountries = countries.filter((country) =>
    country.name.common.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Calculate pagination
  const totalPages = Math.ceil(filteredCountries.length / itemsPerPage)
  const paginatedCountries = filteredCountries.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1) // Reset to first page on new search

    // Track search analytics
    if (query.trim()) {
      const resultsCount = countries.filter((country) =>
        country.name.common.toLowerCase().includes(query.toLowerCase()),
      ).length
      trackSearch(query, resultsCount)
    }

    if (!query) {
      setSelectedCountry(null) // Clear selected country only if search is empty
      // Clear URL parameters
      window.history.pushState({}, "", window.location.pathname)
    }
  }

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Handle country selection
  const handleCountrySelect = (countryCode: string) => {
    setSelectedCountry(countryCode)

    // Find country details for analytics
    const country = countries.find((c) => c.cca3 === countryCode)
    if (country) {
      trackCountry(country.name.common, countryCode)
    }

    // Update URL without page reload
    const params = new URLSearchParams(window.location.search)
    params.set("country", countryCode)
    if (activeTab !== "explorer") {
      params.set("tab", activeTab)
    }
    window.history.pushState({ countryCode }, "", `?${params.toString()}`)
  }

  // Handle tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    trackNavigation(`tab_${tab}`)

    // Update URL
    const params = new URLSearchParams(window.location.search)
    if (tab !== "explorer") {
      params.set("tab", tab)
    } else {
      params.delete("tab")
    }

    const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname
    window.history.pushState({}, "", newUrl)
  }

  if (error) {
    return <ErrorMessage message="Failed to load countries. Please try again later." />
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Enhanced Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          🌍 World's Best Countries Explorer
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Discover, explore, and compare countries with AI-powered insights, interactive maps, and real-time data
        </p>
      </div>

      {/* Advanced Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-8">
          <TabsTrigger value="explorer" className="flex items-center gap-2">
            <List className="w-4 h-4" />
            Explorer
          </TabsTrigger>
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="map" className="flex items-center gap-2">
            <Map className="w-4 h-4" />
            World Map
          </TabsTrigger>
          <TabsTrigger value="compare" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Compare
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Insights
          </TabsTrigger>
        </TabsList>

        {/* Country Explorer Tab */}
        <TabsContent value="explorer" className="space-y-8">
          <SearchBar onSearch={handleSearch} onSelectCountry={handleCountrySelect} countries={countries} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <CountryList
                countries={paginatedCountries}
                isLoading={isLoading}
                selectedCountry={selectedCountry}
                onSelectCountry={handleCountrySelect}
              />

              {!isLoading && filteredCountries.length > 0 && (
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
              )}

              {!isLoading && filteredCountries.length === 0 && searchQuery && (
                <p className="text-center mt-8 text-gray-600 dark:text-gray-400">
                  No countries found matching "{searchQuery}"
                </p>
              )}
            </div>

            <div className="lg:col-span-2">
              {selectedCountry && <CountryDetail countryCode={selectedCountry} countries={countries} />}

              {!selectedCountry && !isLoading && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 h-full flex items-center justify-center">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                      🌟 Welcome to the World's Best Countries Explorer
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                      Select a country from the list, use our AI assistant, or explore the interactive map to discover
                      amazing places around the world!
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                      <Button onClick={() => handleTabChange("map")} variant="outline">
                        <Map className="w-4 h-4 mr-2" />
                        Explore Map
                      </Button>
                      <Button onClick={() => handleTabChange("compare")} variant="outline">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Compare Countries
                      </Button>
                      <Button onClick={() => handleTabChange("dashboard")} variant="outline">
                        <LayoutDashboard className="w-4 h-4 mr-2" />
                        View Dashboard
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Real-Time Dashboard Tab */}
        <TabsContent value="dashboard">
          <RealTimeDashboard countries={countries} />
        </TabsContent>

        {/* Interactive World Map Tab */}
        <TabsContent value="map">
          <InteractiveWorldMap
            countries={countries}
            selectedCountry={selectedCountry || undefined}
            onSelectCountry={handleCountrySelect}
          />
        </TabsContent>

        {/* Advanced Country Comparison Tab */}
        <TabsContent value="compare">
          <AdvancedCountryComparison
            countries={countries}
            initialCountries={selectedCountry ? [selectedCountry] : []}
          />
        </TabsContent>

        {/* AI Insights Tab */}
        <TabsContent value="insights">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  AI-Powered Insights
                </h3>
                <p className="mb-4">
                  Our advanced AI analyzes global data to provide you with fascinating insights about countries,
                  populations, and world trends.
                </p>
                <Button variant="secondary" onClick={() => handleTabChange("explorer")}>
                  Try AI Assistant
                </Button>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h4 className="font-semibold mb-4">🔥 Trending Discoveries</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
                    <span>Most searched: European countries</span>
                    <span className="text-sm text-green-600">+25%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
                    <span>Popular query: "Island nations"</span>
                    <span className="text-sm text-blue-600">+18%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
                    <span>Rising interest: Population data</span>
                    <span className="text-sm text-purple-600">+32%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h4 className="font-semibold mb-4">📊 Global Statistics</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded">
                    <div className="text-2xl font-bold text-blue-600">{countries.length}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Countries</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded">
                    <div className="text-2xl font-bold text-green-600">7.9B</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">World Population</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded">
                    <div className="text-2xl font-bold text-purple-600">6,500+</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Languages</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded">
                    <div className="text-2xl font-bold text-orange-600">180+</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Currencies</div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h4 className="font-semibold mb-4">🌟 Did You Know?</h4>
                <div className="space-y-3 text-sm">
                  <p className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                    💡 Russia is so large it spans 11 time zones!
                  </p>
                  <p className="p-3 bg-green-50 dark:bg-green-900/20 rounded">
                    🏝️ There are over 17,000 islands in Indonesia
                  </p>
                  <p className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
                    🗣️ Papua New Guinea has over 800 languages
                  </p>
                  <p className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded">
                    🏔️ Nepal's flag is the only non-rectangular national flag
                  </p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* AI Search Assistant - Available on all tabs */}
      <AISearchAssistant countries={countries} onSelectCountry={handleCountrySelect} />
    </div>
  )
}
