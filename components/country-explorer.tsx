"use client"

import { useState, useEffect } from "react"
import { CountryList } from "@/components/country-list"
import { CountryDetail } from "@/components/country-detail"
import { SearchBar } from "@/components/search-bar"
import { Pagination } from "@/components/pagination"
import { ErrorMessage } from "@/components/error-message"
import { useCountries } from "@/hooks/use-countries"
import { useAnalytics } from "@/hooks/use-analytics"

export default function CountryExplorer() {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
  const itemsPerPage = 10

  const { countries, isLoading, error } = useCountries()
  const { trackCountry, trackSearch, trackAppError } = useAnalytics()

  // Check URL for selected country on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const countryParam = urlParams.get("country")
    if (countryParam) {
      setSelectedCountry(countryParam)
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
    window.history.pushState({ countryCode }, "", `?country=${countryCode}`)
  }

  if (error) {
    return <ErrorMessage message="Failed to load countries. Please try again later." />
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <SearchBar onSearch={handleSearch} onSelectCountry={handleCountrySelect} countries={countries} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
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
              No countries found starting with "{searchQuery}"
            </p>
          )}
        </div>

        <div className="lg:col-span-2">
          {selectedCountry && <CountryDetail countryCode={selectedCountry} countries={countries} />}

          {!selectedCountry && !isLoading && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 h-full flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Welcome to Countries Explorer</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  Select a country from the list or search by typing the first letter of a country name to view detailed
                  information including capital, population, languages, and more.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
