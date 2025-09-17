"use client"

import { useState, useEffect, useMemo } from "react"
import { useCountries } from "@/hooks/use-countries"
import { CountryList } from "@/components/country-list"
import { CountryDetail } from "@/components/country-detail"
import { EnhancedSearch } from "@/components/enhanced-search"
import { AdvancedFilters } from "@/components/advanced-filters"
import { CountryComparison } from "@/components/country-comparison"
import { FavoritesSystem } from "@/components/favorites-system"
import { Pagination } from "@/components/pagination"
import { ErrorMessage } from "@/components/error-message"

interface FilterOptions {
  region: string
  subregion: string
  populationMin: number
  populationMax: number
  areaMin: number
  areaMax: number
  language: string
  currency: string
  sortBy: string
  sortOrder: "asc" | "desc"
}

const ITEMS_PER_PAGE = 20

export default function CountryExplorer() {
  const { countries, isLoading, error } = useCountries()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const [showComparison, setShowComparison] = useState(false)
  const [filters, setFilters] = useState<FilterOptions>({
    region: "",
    subregion: "",
    populationMin: 0,
    populationMax: 1500000000,
    areaMin: 0,
    areaMax: 20000000,
    language: "",
    currency: "",
    sortBy: "name",
    sortOrder: "asc",
  })

  // Load selected country from URL on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const countryParam = urlParams.get("country")
    if (countryParam) {
      setSelectedCountry(countryParam)
    }
  }, [])

  // Update URL when country is selected
  useEffect(() => {
    const url = new URL(window.location.href)
    if (selectedCountry) {
      url.searchParams.set("country", selectedCountry)
    } else {
      url.searchParams.delete("country")
    }
    window.history.replaceState({}, "", url.toString())
  }, [selectedCountry])

  // Filter and sort countries
  const filteredAndSortedCountries = useMemo(() => {
    const filtered = countries.filter((country) => {
      // Search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesName = country.name.common.toLowerCase().includes(query)
        const matchesCapital = country.capital?.some((cap) => cap.toLowerCase().includes(query))
        const matchesRegion = country.region.toLowerCase().includes(query)
        const matchesLanguage =
          country.languages && Object.values(country.languages).some((lang) => lang.toLowerCase().includes(query))
        const matchesCurrency =
          country.currencies &&
          Object.values(country.currencies).some((curr) => curr.name.toLowerCase().includes(query))

        if (!matchesName && !matchesCapital && !matchesRegion && !matchesLanguage && !matchesCurrency) {
          return false
        }
      }

      // Advanced filters
      if (filters.region && country.region !== filters.region) return false
      if (filters.subregion && country.subregion !== filters.subregion) return false
      if (country.population < filters.populationMin || country.population > filters.populationMax) return false
      if (country.area < filters.areaMin || country.area > filters.areaMax) return false

      if (filters.language && country.languages) {
        const hasLanguage = Object.values(country.languages).some((lang) =>
          lang.toLowerCase().includes(filters.language.toLowerCase()),
        )
        if (!hasLanguage) return false
      }

      if (filters.currency && country.currencies) {
        const hasCurrency = Object.values(country.currencies).some((curr) =>
          curr.name.toLowerCase().includes(filters.currency.toLowerCase()),
        )
        if (!hasCurrency) return false
      }

      return true
    })

    // Sort countries
    filtered.sort((a, b) => {
      let aValue: any, bValue: any

      switch (filters.sortBy) {
        case "population":
          aValue = a.population
          bValue = b.population
          break
        case "area":
          aValue = a.area
          bValue = b.area
          break
        case "region":
          aValue = a.region
          bValue = b.region
          break
        case "capital":
          aValue = a.capital?.[0] || ""
          bValue = b.capital?.[0] || ""
          break
        default:
          aValue = a.name.common
          bValue = b.name.common
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return filters.sortOrder === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      } else {
        return filters.sortOrder === "asc" ? aValue - bValue : bValue - aValue
      }
    })

    return filtered
  }, [countries, searchQuery, filters])

  // Paginated countries
  const paginatedCountries = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredAndSortedCountries.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  }, [filteredAndSortedCountries, currentPage])

  const totalPages = Math.ceil(filteredAndSortedCountries.length / ITEMS_PER_PAGE)

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }

  const handleSelectCountry = (countryCode: string) => {
    setSelectedCountry(countryCode)
  }

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage message={error} />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Search and Controls */}
        <div className="mb-8 space-y-4">
          <EnhancedSearch onSearch={handleSearch} onSelectCountry={handleSelectCountry} countries={countries} />

          <div className="flex flex-wrap items-center gap-4">
            <AdvancedFilters
              countries={countries}
              onFiltersChange={handleFiltersChange}
              isOpen={showFilters}
              onToggle={() => setShowFilters(!showFilters)}
            />

            <CountryComparison
              countries={countries}
              isOpen={showComparison}
              onToggle={() => setShowComparison(!showComparison)}
            />
          </div>

          <FavoritesSystem countries={countries} onSelectCountry={handleSelectCountry} />
        </div>

        {/* Results Summary */}
        {!isLoading && (
          <div className="mb-6 text-sm text-gray-600 dark:text-gray-400">
            {searchQuery && <span>Search results for "{searchQuery}": </span>}
            <span className="font-medium">{filteredAndSortedCountries.length} countries found</span>
            {filteredAndSortedCountries.length !== countries.length && (
              <span> (filtered from {countries.length} total)</span>
            )}
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Countries List */}
          <div className="lg:col-span-1">
            <CountryList
              countries={paginatedCountries}
              isLoading={isLoading}
              selectedCountry={selectedCountry}
              onSelectCountry={handleSelectCountry}
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6">
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
              </div>
            )}
          </div>

          {/* Country Details */}
          <div className="lg:col-span-2">
            {selectedCountry ? (
              <CountryDetail countryCode={selectedCountry} countries={countries} />
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
                <div className="text-gray-500 dark:text-gray-400">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium mb-2">Select a Country</h3>
                  <p className="text-sm">
                    Choose a country from the list to view detailed information, or use the search to find a specific
                    country.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
