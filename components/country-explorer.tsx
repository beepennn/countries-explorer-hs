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
import { Globe, Sparkles, TrendingUp, Users, Search, Filter, Heart, BarChart3, ArrowRight, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

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

  // Calculate stats
  const stats = useMemo(() => {
    if (!countries) return { total: 0, regions: 0, totalPopulation: 0, totalArea: 0 }

    const regions = new Set(countries.map((c) => c.region)).size
    const totalPopulation = countries.reduce((sum, c) => sum + c.population, 0)
    const totalArea = countries.reduce((sum, c) => sum + c.area, 0)

    return {
      total: countries.length,
      regions,
      totalPopulation,
      totalArea,
    }
  }, [countries])

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage message={error} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      {/* Enhanced Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10 dark:from-blue-900/30 dark:via-purple-900/30 dark:to-pink-900/30" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 dark:bg-blue-400/30 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 dark:bg-purple-400/30 rounded-full blur-3xl animate-float" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-400/15 dark:bg-pink-400/20 rounded-full blur-3xl animate-pulse-slow" />
        </div>

        <div className="relative container mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-yellow-600 dark:text-yellow-500" />
            <span className="text-sm font-medium text-gray-800 dark:text-white">Discover the World</span>
            
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-slide-up">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              Explore
            </span>
            <br />
            <span className="text-gray-900 dark:text-white">Every Country</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in">
            Journey through {stats.total} countries, discover cultures, compare statistics, and explore the fascinating
            diversity of our world.
          </p>

          {/* Hero Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 max-w-4xl mx-auto">
            {[
              {
                icon: Globe,
                label: "Countries",
                value: stats.total.toLocaleString(),
                color: "text-blue-600 dark:text-blue-500",
              },
              {
                icon: Users,
                label: "Regions",
                value: stats.regions.toString(),
                color: "text-green-600 dark:text-green-500",
              },
              {
                icon: Users,
                label: "Population",
                value: `${(stats.totalPopulation / 1e9).toFixed(1)}B`,
                color: "text-purple-600 dark:text-purple-500",
              },
              {
                icon: TrendingUp,
                label: "Total Area",
                value: `${(stats.totalArea / 1e6).toFixed(1)}M km²`,
                color: "text-orange-600 dark:text-orange-500",
              },
            ].map((stat, index) => (
              <Card
                key={index}
                className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg hover:scale-105 transition-all duration-300 animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6 text-center">
                  <stat.icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Hero Actions - Removed Watch Demo button */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              onClick={() => document.getElementById("search-section")?.scrollIntoView({ behavior: "smooth" })}
            >
              <Search className="w-5 h-5 mr-2" />
              Start Exploring
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          {/* Feature Highlights */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { icon: Heart, title: "Save Favorites", desc: "Bookmark countries you love" },
              { icon: BarChart3, title: "Compare Data", desc: "Side-by-side comparisons" },
              { icon: Zap, title: "Real-time Search", desc: "Instant results as you type" },
            ].map((feature, index) => (
              <div
                key={index}
                className="text-center animate-fade-in"
                style={{ animationDelay: `${0.5 + index * 0.1}s` }}
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-blue-600 dark:text-blue-500" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-700 dark:text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8" id="search-section">
        {/* Search and Controls */}
        <div className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-gray-200/50 dark:border-gray-700/50 animate-slide-up">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between mb-6">
            <div className="flex-1 max-w-2xl">
              <EnhancedSearch onSearch={handleSearch} onSelectCountry={handleSelectCountry} countries={countries} />
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                variant={showFilters ? "default" : "outline"}
                onClick={() => setShowFilters(!showFilters)}
                className="bg-white/70 dark:bg-gray-700/50 backdrop-blur-sm border-gray-300 dark:border-gray-600/50 text-gray-800 dark:text-white hover:bg-white/90 dark:hover:bg-gray-600/50"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
                {Object.values(filters).some(
                  (v) => v !== "" && v !== null && (Array.isArray(v) ? v.length > 0 : true),
                ) && (
                  <Badge variant="destructive" className="ml-2 px-1.5 py-0.5 text-xs">
                    Active
                  </Badge>
                )}
              </Button>

              <Button
                variant={showComparison ? "default" : "outline"}
                onClick={() => setShowComparison(!showComparison)}
                className="bg-white/70 dark:bg-gray-700/50 backdrop-blur-sm border-gray-300 dark:border-gray-600/50 text-gray-800 dark:text-white hover:bg-white/90 dark:hover:bg-gray-600/50"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Compare
              </Button>
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-700 dark:text-gray-400">
            <span>
              Showing {paginatedCountries.length} of {filteredAndSortedCountries.length} countries
            </span>
            {searchQuery && (
              <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200">
                Search: "{searchQuery}"
              </Badge>
            )}
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mb-8 animate-slide-up">
            <AdvancedFilters
              countries={countries}
              onFiltersChange={handleFiltersChange}
              isOpen={showFilters}
              onToggle={() => setShowFilters(!showFilters)}
            />
          </div>
        )}

        {/* Country Comparison */}
        {showComparison && (
          <div className="mb-8 animate-slide-up">
            <CountryComparison
              countries={countries}
              isOpen={showComparison}
              onToggle={() => setShowComparison(!showComparison)}
            />
          </div>
        )}

        {/* Favorites System */}
        <div className="mb-8">
          <FavoritesSystem countries={countries} onSelectCountry={handleSelectCountry} />
        </div>

        {/* Results Summary */}
        {!isLoading && (
          <div className="mb-8 text-center">
            <div className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl px-6 py-4 inline-flex items-center gap-3 border border-gray-200/50 dark:border-gray-700/50">
              {searchQuery && (
                <span className="text-gray-700 dark:text-gray-300">
                  Search results for{" "}
                  <span className="font-semibold text-gray-900 dark:text-white">"{searchQuery}"</span>:
                </span>
              )}
              <span className="font-bold text-gray-900 dark:text-white text-lg">
                {filteredAndSortedCountries.length} countries found
              </span>
              {filteredAndSortedCountries.length !== countries.length && (
                <span className="text-gray-600 dark:text-gray-400">(filtered from {countries.length} total)</span>
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
              <div className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-12 text-center animate-fade-in border border-gray-200/50 dark:border-gray-700/50">
                <div className="text-gray-700 dark:text-gray-300">
                  <div className="relative w-24 h-24 mx-auto mb-6">
                    <div className="absolute inset-0 bg-blue-500/20 dark:bg-blue-400/20 rounded-full opacity-20 animate-pulse-slow"></div>
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500 rounded-full flex items-center justify-center animate-float">
                      <Globe className="w-12 h-12 text-white" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Select a Country to Explore</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-6 max-w-md mx-auto">
                    Choose any country from the list to discover fascinating details about its culture, geography,
                    population, and more.
                  </p>
                  <div className="flex flex-wrap justify-center gap-3">
                    <div className="bg-white/80 dark:bg-gray-700/60 backdrop-blur-sm rounded-xl px-4 py-2 text-sm text-gray-800 dark:text-gray-300 border border-gray-200/50 dark:border-gray-600/50">
                      <Sparkles className="w-4 h-4 inline mr-2" />
                      Rich Details
                    </div>
                    <div className="bg-white/80 dark:bg-gray-700/60 backdrop-blur-sm rounded-xl px-4 py-2 text-sm text-gray-800 dark:text-gray-300 border border-gray-200/50 dark:border-gray-600/50">
                      <TrendingUp className="w-4 h-4 inline mr-2" />
                      Live Data
                    </div>
                    <div className="bg-white/80 dark:bg-gray-700/60 backdrop-blur-sm rounded-xl px-4 py-2 text-sm text-gray-800 dark:text-gray-300 border border-gray-200/50 dark:border-gray-600/50">
                      <Users className="w-4 h-4 inline mr-2" />
                      Population Stats
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
