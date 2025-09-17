"use client"

import { useState, useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Users,
  MapPin,
  Globe,
  Crown,
  Coins,
  MessageSquare,
  ExternalLink,
  Heart,
  Share2,
  Info,
  Award,
} from "lucide-react"
import type { Country } from "@/types/country"
import { ErrorMessage } from "@/components/error-message"

interface CountryDetailProps {
  countryCode: string
  countries: Country[]
}

export function CountryDetail({ countryCode, countries }: CountryDetailProps) {
  const [country, setCountry] = useState<Country | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    const fetchCountryDetails = async () => {
      const existingCountry = countries.find((c) => c.cca3 === countryCode)

      if (existingCountry) {
        setCountry(existingCountry)
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(
          `https://restcountries.com/v3.1/alpha/${countryCode}?fields=name,cca3,capital,region,subregion,population,area,languages,currencies,flags,maps`,
        )

        if (!response.ok) {
          throw new Error("Failed to fetch country details")
        }

        const data = await response.json()
        setCountry(data[0])
      } catch (err) {
        setError("Failed to load country details. Please try again.")
        console.error("Error fetching country details:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCountryDetails()
  }, [countryCode, countries])

  // Check if country is in favorites
  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("country-favorites") || "[]")
    setIsFavorite(favorites.includes(countryCode))
  }, [countryCode])

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem("country-favorites") || "[]")
    const newFavorites = isFavorite
      ? favorites.filter((code: string) => code !== countryCode)
      : [...favorites, countryCode]

    localStorage.setItem("country-favorites", JSON.stringify(newFavorites))
    setIsFavorite(!isFavorite)
  }

  const shareCountry = async () => {
    if (navigator.share && country) {
      try {
        await navigator.share({
          title: `${country.name.common} - Countries Explorer`,
          text: `Check out ${country.name.common} on Countries Explorer!`,
          url: window.location.href,
        })
      } catch (err) {
        console.log("Error sharing:", err)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  if (error) {
    return <ErrorMessage message={error} />
  }

  if (isLoading || !country) {
    return (
      <div className="glass rounded-3xl p-8 animate-pulse">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/3">
            <Skeleton className="h-48 w-full rounded-2xl bg-gray-200 dark:bg-white/20" />
          </div>
          <div className="lg:w-2/3 space-y-6">
            <div className="space-y-3">
              <Skeleton className="h-8 w-3/4 bg-gray-200 dark:bg-white/20" />
              <Skeleton className="h-6 w-1/2 bg-gray-200 dark:bg-white/20" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-20 rounded-xl bg-gray-200 dark:bg-white/20" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const formattedPopulation = country.population ? new Intl.NumberFormat().format(country.population) : "Not available"
  const formattedArea = country.area ? new Intl.NumberFormat().format(country.area) : "Not available"
  const languages = country.languages ? Object.values(country.languages) : []
  const currencies = country.currencies
    ? Object.values(country.currencies).map((c) => `${c.name} (${c.symbol || "No symbol"})`)
    : []
  const capitals = country.capital && country.capital.length > 0 ? country.capital.join(", ") : "Not available"

  // Calculate population rank (approximate)
  const getPopulationRank = (population: number) => {
    if (population > 1000000000) return "Top 3"
    if (population > 100000000) return "Top 15"
    if (population > 50000000) return "Top 30"
    if (population > 10000000) return "Top 80"
    return "Small"
  }

  const getAreaRank = (area: number) => {
    if (area > 10000000) return "Massive"
    if (area > 1000000) return "Large"
    if (area > 100000) return "Medium"
    return "Small"
  }

  return (
    <div className="glass rounded-3xl overflow-hidden shadow-beautiful-xl animate-fade-in">
      {/* Header Section */}
      <div className="relative p-8 bg-gradient-primary">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
            <div className="relative group">
              <div className="w-32 h-24 lg:w-40 lg:h-30 overflow-hidden rounded-2xl shadow-beautiful-lg bg-white/10 group-hover:shadow-beautiful-xl transition-all duration-300">
                <img
                  src={country.flags.svg || "/placeholder.svg"}
                  alt={country.flags.alt || `Flag of ${country.name.common}`}
                  className={`w-full h-full transition-transform duration-300 group-hover:scale-110 ${
                    country.name.common === "Nepal" ? "object-contain" : "object-cover"
                  }`}
                />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-accent rounded-full flex items-center justify-center animate-float">
                <Crown className="w-4 h-4 text-white" />
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2 flex items-center gap-3">
                    {country.name.common}
                    {country.population > 100000000 && (
                      <Badge className="bg-gradient-secondary text-white">
                        <Award className="w-3 h-3 mr-1" />
                        100M+
                      </Badge>
                    )}
                  </h1>
                  <p className="text-white/80 text-lg font-medium">{country.name.official}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className="bg-white/20 text-white border-white/30">{country.region}</Badge>
                    {country.subregion && (
                      <Badge className="bg-white/10 text-white/90 border-white/20">{country.subregion}</Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleFavorite}
                    className={`text-white hover:bg-white/20 transition-all duration-300 ${
                      isFavorite ? "text-red-400 hover:text-red-300" : ""
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={shareCountry} className="text-white hover:bg-white/20">
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Population */}
          <div className="glass rounded-2xl p-6 hover-lift group border border-gray-200/50 dark:border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-accent rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Users className="w-6 h-6 text-white" />
              </div>
              <Badge className="bg-gradient-secondary text-white">{getPopulationRank(country.population)}</Badge>
            </div>
            <div className="text-2xl font-bold text-gray-800 dark:text-white mb-1">{formattedPopulation}</div>
            <div className="text-gray-600 dark:text-white/70 text-sm">Population</div>
          </div>

          {/* Area */}
          <div className="glass rounded-2xl p-6 hover-lift group border border-gray-200/50 dark:border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <Badge className="bg-gradient-accent text-white">{getAreaRank(country.area)}</Badge>
            </div>
            <div className="text-2xl font-bold text-gray-800 dark:text-white mb-1">{formattedArea}</div>
            <div className="text-gray-600 dark:text-white/70 text-sm">Area (km²)</div>
          </div>

          {/* Capital */}
          <div className="glass rounded-2xl p-6 hover-lift group border border-gray-200/50 dark:border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-warning rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <Info className="w-4 h-4 text-gray-500 dark:text-white/50" />
            </div>
            <div className="text-xl font-bold text-gray-800 dark:text-white mb-1 truncate">{capitals}</div>
            <div className="text-gray-600 dark:text-white/70 text-sm">Capital City</div>
          </div>
        </div>

        {/* Detailed Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Languages */}
          <div className="glass rounded-2xl p-6 border border-gray-200/50 dark:border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-accent rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">Languages</h3>
            </div>
            <div className="space-y-2">
              {languages.length > 0 ? (
                languages.map((language, index) => (
                  <Badge
                    key={index}
                    className="bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-white border-gray-200 dark:border-white/20 mr-2 mb-2"
                  >
                    {language}
                  </Badge>
                ))
              ) : (
                <span className="text-gray-600 dark:text-white/70">Not available</span>
              )}
            </div>
          </div>

          {/* Currencies */}
          <div className="glass rounded-2xl p-6 border border-gray-200/50 dark:border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-secondary rounded-lg flex items-center justify-center">
                <Coins className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">Currencies</h3>
            </div>
            <div className="space-y-2">
              {currencies.length > 0 ? (
                currencies.map((currency, index) => (
                  <div
                    key={index}
                    className="text-gray-700 dark:text-white/90 bg-gray-50 dark:bg-white/5 rounded-lg p-2"
                  >
                    {currency}
                  </div>
                ))
              ) : (
                <span className="text-gray-600 dark:text-white/70">Not available</span>
              )}
            </div>
          </div>
        </div>

        {/* Maps Link */}
        {country.maps?.googleMaps && (
          <div className="mt-8">
            <Button
              onClick={() => window.open(country.maps!.googleMaps, "_blank")}
              className="w-full bg-gradient-primary hover:opacity-90 text-white font-semibold py-4 rounded-2xl transition-all duration-300 hover:scale-105 shadow-beautiful"
            >
              <Globe className="w-5 h-5 mr-2" />
              View on Google Maps
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
