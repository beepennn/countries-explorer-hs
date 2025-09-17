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
import { Globe, Sparkles, TrendingUp, Users } from "lucide-react"

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
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="relative">
                <Globe className="h-12 w-12 text-white animate-float" />
                <div className="absolute inset-0 bg-gradient-accent rounded-full opacity-30 animate-pulse-slow"></div>
              </div>
              <Sparkles className="h-8 w-8 text-yellow-300 animate-pulse" />
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4 gradient-text">Explore the World</h1>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Discover amazing facts about {countries.length}+ countries around the globe. Search, compare, and learn
              about different cultures, languages, and more.
            </p>

            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <div className="glass rounded-2xl px-6 py-3 flex items-center gap-2">
                <Globe className="h-5 w-5 text-white/70" />
                <span className="text-white font-semibold">{countries.length}+ Countries</span>
              </div>
              <div className="glass rounded-2xl px-6 py-3 flex items-center gap-2">
                <Users className="h-5 w-5 text-white/70" />
                <span className="text-white font-semibold">8B+ People</span>
              </div>
              <div className="glass rounded-2xl px-6 py-3 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-white/70" />
                <span className="text-white font-semibold">Live Data</span>
              </div>
            </div>
          </div>

          {/* Search Section */}
          <div className="mb-8 space-y-6">
            <EnhancedSearch onSearch={handleSearch} onSelectCountry={handleSelectCountry} countries={countries} />

            <div className="flex flex-wrap items-center gap-4 justify-center lg:justify-start">
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
            <div className="mb-8 text-center">
              <div className="glass rounded-2xl px-6 py-4 inline-flex items-center gap-3">
                {searchQuery && (
                  <span className="text-white/90">
                    Search results for <span className="font-semibold text-white">"{searchQuery}"</span>:
                  </span>
                )}
                <span className="font-bold text-white text-lg">
                  {filteredAndSortedCountries.length} countries found
                </span>
                {filteredAndSortedCountries.length !== countries.length && (
                  <span className="text-white/70">(filtered from {countries.length} total)</span>
                )}
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Countries List */}
            <div className="xl:col-span-1">
              <CountryList
                countries={paginatedCountries}
                isLoading={isLoading}
                selectedCountry={selectedCountry}
                onSelectCountry={handleSelectCountry}
              />

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8">
                  <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                </div>
              )}
            </div>

            {/* Country Details */}
            <div className="xl:col-span-2">
              {selectedCountry ? (
                <CountryDetail countryCode={selectedCountry} countries={countries} />
              ) : (
                <div className="glass rounded-3xl p-12 text-center animate-fade-in">
                  <div className="text-white/70">
                    <div className="relative w-24 h-24 mx-auto mb-6">
                      <div className="absolute inset-0 bg-gradient-primary rounded-full opacity-20 animate-pulse-slow"></div>
                      <div className="w-24 h-24 bg-gradient-accent rounded-full flex items-center justify-center animate-float">
                        <Globe className="w-12 h-12 text-white" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">Select a Country to Explore</h3>
                    <p className="text-white/80 mb-6 max-w-md mx-auto">
                      Choose any country from the list to discover fascinating details about its culture, geography,
                      population, and more.
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                      <div className="glass rounded-xl px-4 py-2 text-sm text-white/90">
                        <Sparkles className="w-4 h-4 inline mr-2" />
                        Rich Details
                      </div>
                      <div className="glass rounded-xl px-4 py-2 text-sm text-white/90">
                        <TrendingUp className="w-4 h-4 inline mr-2" />
                        Live Data
                      </div>
                      <div className="glass rounded-xl px-4 py-2 text-sm text-white/90">
                        <Users className="w-4 h-4 inline mr-2" />
                        Population Stats
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
