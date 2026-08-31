"use client"

import { useEffect, useMemo, useState } from "react"

import { useCountries } from "@/hooks/use-countries"
import { CountryList } from "@/components/country-list"
import { CountryDetail } from "@/components/country-detail"
import { EnhancedSearch } from "@/components/enhanced-search"
import { AdvancedFilters } from "@/components/advanced-filters"
import { CountryComparison } from "@/components/country-comparison"
import { FavoritesSystem } from "@/components/favorites-system"
import { Pagination } from "@/components/pagination"
import { ErrorMessage } from "@/components/error-message"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

import {
  ArrowRight,
  BarChart3,
  Compass,
  Filter,
  Globe2,
  Heart,
  Map,
  Search,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react"

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

const DEFAULT_FILTERS: FilterOptions = {
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
}

export default function CountryExplorer() {
  const { countries, isLoading, error } = useCountries()

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const [showComparison, setShowComparison] = useState(false)
  const [filters, setFilters] = useState<FilterOptions>(DEFAULT_FILTERS)

  /*
   * Load selected country from URL
   */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const country = params.get("country")

    if (country) {
      setSelectedCountry(country)
    }
  }, [])

  /*
   * Keep selected country in URL
   */
  useEffect(() => {
    const url = new URL(window.location.href)

    if (selectedCountry) {
      url.searchParams.set("country", selectedCountry)
    } else {
      url.searchParams.delete("country")
    }

    window.history.replaceState({}, "", url.toString())
  }, [selectedCountry])

  /*
   * Main country filtering + sorting
   */
  const filteredAndSortedCountries = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase()

    const filtered = countries.filter((country) => {
      if (normalizedQuery) {
        const matchesName =
          country.name.common.toLowerCase().includes(normalizedQuery) ||
          country.name.official.toLowerCase().includes(normalizedQuery)

        const matchesCode = country.cca3.toLowerCase().includes(normalizedQuery)

        const matchesCapital = country.capital?.some((capital) =>
          capital.toLowerCase().includes(normalizedQuery),
        )

        const matchesRegion =
          country.region.toLowerCase().includes(normalizedQuery) ||
          country.subregion?.toLowerCase().includes(normalizedQuery)

        const matchesLanguage =
          country.languages &&
          Object.values(country.languages).some((language) =>
            language.toLowerCase().includes(normalizedQuery),
          )

        const matchesCurrency =
          country.currencies &&
          Object.values(country.currencies).some(
            (currency) =>
              currency.name.toLowerCase().includes(normalizedQuery) ||
              currency.symbol?.toLowerCase().includes(normalizedQuery),
          )

        if (
          !matchesName &&
          !matchesCode &&
          !matchesCapital &&
          !matchesRegion &&
          !matchesLanguage &&
          !matchesCurrency
        ) {
          return false
        }
      }

      if (filters.region && country.region !== filters.region) {
        return false
      }

      if (filters.subregion && country.subregion !== filters.subregion) {
        return false
      }

      if (
        country.population < filters.populationMin ||
        country.population > filters.populationMax
      ) {
        return false
      }

      if (country.area < filters.areaMin || country.area > filters.areaMax) {
        return false
      }

      if (filters.language) {
        const hasLanguage =
          country.languages &&
          Object.values(country.languages).some((language) =>
            language.toLowerCase().includes(filters.language.toLowerCase()),
          )

        if (!hasLanguage) {
          return false
        }
      }

      if (filters.currency) {
        const hasCurrency =
          country.currencies &&
          Object.values(country.currencies).some((currency) =>
            currency.name
              .toLowerCase()
              .includes(filters.currency.toLowerCase()),
          )

        if (!hasCurrency) {
          return false
        }
      }

      return true
    })

    return [...filtered].sort((a, b) => {
      let aValue: string | number
      let bValue: string | number

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
        return filters.sortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      }

      const difference = Number(aValue) - Number(bValue)

      return filters.sortOrder === "asc" ? difference : -difference
    })
  }, [countries, searchQuery, filters])

  /*
   * Pagination
   */
  const totalPages = Math.max(
    1,
    Math.ceil(filteredAndSortedCountries.length / ITEMS_PER_PAGE),
  )

  const paginatedCountries = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE

    return filteredAndSortedCountries.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredAndSortedCountries, currentPage])

  /*
   * Global country statistics
   */
  const stats = useMemo(() => {
    const validRegions = countries
      .map((country) => country.region)
      .filter(Boolean)

    const totalPopulation = countries.reduce(
      (total, country) => total + country.population,
      0,
    )

    const totalArea = countries.reduce(
      (total, country) => total + country.area,
      0,
    )

    return {
      countries: countries.length,
      regions: new Set(validRegions).size,
      population: totalPopulation,
      area: totalArea,
    }
  }, [countries])

  /*
   * Count only meaningful active filters.
   * Sort settings don't count as filters.
   */
  const activeFilterCount = useMemo(() => {
    let count = 0

    if (filters.region) count++
    if (filters.subregion) count++
    if (filters.language) count++
    if (filters.currency) count++

    if (filters.populationMin !== DEFAULT_FILTERS.populationMin) count++
    if (filters.populationMax !== DEFAULT_FILTERS.populationMax) count++

    if (filters.areaMin !== DEFAULT_FILTERS.areaMin) count++
    if (filters.areaMax !== DEFAULT_FILTERS.areaMax) count++

    return count
  }, [filters])

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

    document.getElementById("countries")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }

  const scrollToExplorer = () => {
    document.getElementById("explore")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }

  if (error) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-16 dark:bg-slate-950">
        <div className="mx-auto max-w-4xl">
          <ErrorMessage message={error} />
        </div>
      </main>
    )
  }

  return (
    <div className="min-h-screen overflow-hidden bg-slate-50 text-slate-950 dark:bg-[#07101f] dark:text-white">
      {/* =========================================================
          HERO
      ========================================================== */}

      <section className="relative overflow-hidden border-b border-slate-200/70 dark:border-white/10">
        {/* Background */}

        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-100 dark:from-[#07101f] dark:via-[#0d1b3d] dark:to-[#17255e]" />

        <div className="absolute -left-24 top-10 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />

        <div className="absolute -right-32 top-24 h-96 w-96 rounded-full bg-violet-500/20 blur-3xl" />

        <div className="absolute bottom-0 left-1/2 h-64 w-[700px] -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-20 sm:px-6 lg:px-8 lg:pb-28 lg:pt-28">
          <div className="mx-auto max-w-4xl text-center">
            {/* Eyebrow */}

            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/70 px-4 py-2 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
              <Sparkles className="h-4 w-4 text-amber-500" />

              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Your interactive guide to the world
              </span>
            </div>

            {/* Heading */}

            <h1 className="text-balance text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl">
              The world,
              <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent dark:from-blue-400 dark:via-cyan-300 dark:to-violet-400">
                one country at a time.
              </span>
            </h1>

            <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300 sm:text-xl">
              Search countries, discover capitals and languages, explore
              population and geography, save favorites, and compare nations
              side by side.
            </p>

            {/* Hero CTAs */}

            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                size="lg"
                onClick={scrollToExplorer}
                className="h-12 rounded-xl bg-slate-950 px-7 text-white shadow-xl transition-all hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-2xl dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
              >
                <Compass className="mr-2 h-5 w-5" />
                Explore Countries
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                onClick={() => {
                  scrollToExplorer()
                  setShowComparison(true)
                }}
                className="h-12 rounded-xl border-slate-300 bg-white/70 px-7 backdrop-blur-xl dark:border-white/15 dark:bg-white/5"
              >
                <BarChart3 className="mr-2 h-5 w-5" />
                Compare Countries
              </Button>
            </div>

            {/* Mini features */}

            <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm text-slate-600 dark:text-slate-300">
              <span className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-500" />
                Fast search
              </span>

              <span className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-rose-500" />
                Favorites
              </span>

              <span className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-blue-500" />
                Comparisons
              </span>
            </div>
          </div>

          {/* =====================================================
              STATS
          ====================================================== */}

          <div className="mx-auto mt-16 grid max-w-5xl grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5">
            <Card className="border-white/60 bg-white/70 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06]">
              <CardContent className="p-5 sm:p-6">
                <Globe2 className="mb-4 h-7 w-7 text-blue-600 dark:text-blue-400" />

                <div className="text-2xl font-black sm:text-3xl">
                  {isLoading ? "—" : stats.countries.toLocaleString()}
                </div>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Countries & territories
                </p>
              </CardContent>
            </Card>

            <Card className="border-white/60 bg-white/70 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06]">
              <CardContent className="p-5 sm:p-6">
                <Map className="mb-4 h-7 w-7 text-emerald-600 dark:text-emerald-400" />

                <div className="text-2xl font-black sm:text-3xl">
                  {isLoading ? "—" : stats.regions}
                </div>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  World regions
                </p>
              </CardContent>
            </Card>

            <Card className="border-white/60 bg-white/70 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06]">
              <CardContent className="p-5 sm:p-6">
                <Users className="mb-4 h-7 w-7 text-violet-600 dark:text-violet-400" />

                <div className="text-2xl font-black sm:text-3xl">
                  {isLoading
                    ? "—"
                    : `${(stats.population / 1_000_000_000).toFixed(1)}B`}
                </div>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Combined population
                </p>
              </CardContent>
            </Card>

            <Card className="border-white/60 bg-white/70 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06]">
              <CardContent className="p-5 sm:p-6">
                <TrendingUp className="mb-4 h-7 w-7 text-orange-600 dark:text-orange-400" />

                <div className="text-2xl font-black sm:text-3xl">
                  {isLoading
                    ? "—"
                    : `${(stats.area / 1_000_000).toFixed(1)}M`}
                </div>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Million km² of area
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* =========================================================
          EXPLORER
      ========================================================== */}

      <main
        id="explore"
        className="mx-auto max-w-7xl scroll-mt-24 px-4 py-10 sm:px-6 lg:px-8 lg:py-14"
      >
        {/* Section Heading */}

        <div className="mb-7 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <Badge
              variant="outline"
              className="mb-3 border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-400/20 dark:bg-blue-400/10 dark:text-blue-300"
            >
              <Globe2 className="mr-1.5 h-3.5 w-3.5" />
              Country Explorer
            </Badge>

            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
              Find your next country to explore
            </h2>

            <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-400">
              Search by country, capital, region, language, currency, or
              three-letter country code.
            </p>
          </div>

          {!isLoading && (
            <div className="text-sm text-slate-500 dark:text-slate-400">
              <strong className="text-slate-900 dark:text-white">
                {filteredAndSortedCountries.length.toLocaleString()}
              </strong>{" "}
              results
            </div>
          )}
        </div>

        {/* =====================================================
            SEARCH CONTROL PANEL
        ====================================================== */}

        <div className="relative z-20 mb-8 rounded-3xl border border-slate-200 bg-white/90 p-4 shadow-xl shadow-slate-200/40 backdrop-blur-xl dark:border-white/10 dark:bg-[#0d172b]/90 dark:shadow-black/20 sm:p-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
            <div className="min-w-0 flex-1">
              <EnhancedSearch
                onSearch={handleSearch}
                onSelectCountry={handleSelectCountry}
                countries={countries}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant={showFilters ? "default" : "outline"}
                onClick={() => setShowFilters((value) => !value)}
                className="h-10 rounded-xl"
              >
                <Filter className="mr-2 h-4 w-4" />
                Filters

                {activeFilterCount > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-2 min-w-5 justify-center px-1.5"
                  >
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>

              <Button
                variant={showComparison ? "default" : "outline"}
                onClick={() => setShowComparison((value) => !value)}
                className="h-10 rounded-xl"
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                Compare
              </Button>
            </div>
          </div>

          {(searchQuery || activeFilterCount > 0) && (
            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-200 pt-4 dark:border-white/10">
              <span className="text-sm text-slate-500 dark:text-slate-400">
                Active:
              </span>

              {searchQuery && (
                <Badge variant="secondary" className="rounded-lg">
                  Search: “{searchQuery}”
                </Badge>
              )}

              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="rounded-lg">
                  {activeFilterCount}{" "}
                  {activeFilterCount === 1 ? "filter" : "filters"}
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* =====================================================
            OPTIONAL PANELS
        ====================================================== */}

        {showFilters && (
          <div className="mb-8">
            <AdvancedFilters
              countries={countries}
              onFiltersChange={handleFiltersChange}
              isOpen={showFilters}
              onToggle={() => setShowFilters(false)}
            />
          </div>
        )}

        {showComparison && (
          <div className="mb-8">
            <CountryComparison
              countries={countries}
              isOpen={showComparison}
              onToggle={() => setShowComparison(false)}
            />
          </div>
        )}

        {/* Favorites */}

        <div className="mb-8">
          <FavoritesSystem
            countries={countries}
            onSelectCountry={handleSelectCountry}
          />
        </div>

        {/* =====================================================
            COUNTRY WORKSPACE
        ====================================================== */}

        <section id="countries" className="scroll-mt-24">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Countries
              </h3>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {isLoading
                  ? "Loading country data..."
                  : `Showing ${paginatedCountries.length} of ${filteredAndSortedCountries.length} matching countries`}
              </p>
            </div>

            {searchQuery && (
              <Badge
                variant="outline"
                className="rounded-full border-slate-300 bg-white dark:border-white/10 dark:bg-white/5"
              >
                <Search className="mr-1.5 h-3.5 w-3.5" />
                {searchQuery}
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-1 gap-7 xl:grid-cols-[minmax(350px,0.9fr)_minmax(0,2fr)]">
            {/* Country list */}

            <div className="min-w-0">
              <CountryList
                countries={paginatedCountries}
                isLoading={isLoading}
                selectedCountry={selectedCountry}
                onSelectCountry={handleSelectCountry}
              />

              {totalPages > 1 && (
                <div className="mt-7">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </div>

            {/* Country detail */}

            <div className="min-w-0">
              {selectedCountry ? (
                <CountryDetail
                  countryCode={selectedCountry}
                  countries={countries}
                />
              ) : (
                <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-[#0d172b] sm:p-12">
                  <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />

                  <div className="absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl" />

                  <div className="relative mx-auto max-w-lg py-8 text-center">
                    <div className="mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-600 to-violet-600 shadow-xl shadow-blue-500/20">
                      <Globe2 className="h-10 w-10 text-white" />
                    </div>

                    <Badge
                      variant="secondary"
                      className="mb-4 rounded-full"
                    >
                      Start your journey
                    </Badge>

                    <h3 className="text-3xl font-black tracking-tight">
                      Pick a country
                    </h3>

                    <p className="mx-auto mt-4 max-w-md leading-7 text-slate-600 dark:text-slate-400">
                      Select a country from the list to discover its capital,
                      population, languages, currencies, geography, flag, and
                      more.
                    </p>

                    <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/[0.04]">
                        <Map className="mx-auto mb-2 h-5 w-5 text-blue-500" />

                        <span className="text-sm font-medium">
                          Geography
                        </span>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/[0.04]">
                        <Users className="mx-auto mb-2 h-5 w-5 text-violet-500" />

                        <span className="text-sm font-medium">
                          Population
                        </span>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/[0.04]">
                        <BarChart3 className="mx-auto mb-2 h-5 w-5 text-emerald-500" />

                        <span className="text-sm font-medium">
                          Statistics
                        </span>
                      </div>
                    </div>

                    <Button
                      className="mt-8 rounded-xl"
                      onClick={() =>
                        document
                          .getElementById("countries")
                          ?.scrollIntoView({
                            behavior: "smooth",
                          })
                      }
                    >
                      <Compass className="mr-2 h-4 w-4" />
                      Choose a Country
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}