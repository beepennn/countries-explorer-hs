"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Search, Clock, Mic, X, Sparkles, TrendingUp } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Country } from "@/types/country"

interface EnhancedSearchProps {
  onSearch: (query: string) => void
  onSelectCountry?: (countryCode: string) => void
  countries: Country[]
}

export function EnhancedSearch({ onSearch, onSelectCountry, countries }: EnhancedSearchProps) {
  const [query, setQuery] = useState("")
  const [showDropdown, setShowDropdown] = useState(false)
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [isListening, setIsListening] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const recognition = useRef<any>(null)

  // Popular searches for suggestions
  const popularSearches = ["United States", "Japan", "France", "Brazil", "India", "Germany", "Australia", "Canada"]

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("recent-searches")
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved))
      } catch (error) {
        console.error("Error loading recent searches:", error)
      }
    }
  }, [])

  // Initialize speech recognition
  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      recognition.current = new SpeechRecognition()
      recognition.current.continuous = false
      recognition.current.interimResults = false
      recognition.current.lang = "en-US"

      recognition.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setQuery(transcript)
        onSearch(transcript)
        addToRecentSearches(transcript)
        setIsListening(false)
      }

      recognition.current.onerror = () => {
        setIsListening(false)
      }

      recognition.current.onend = () => {
        setIsListening(false)
      }
    }
  }, [onSearch])

  // Enhanced search with fuzzy matching
  useEffect(() => {
    if (query.trim()) {
      const searchTerm = query.toLowerCase()
      const filtered = countries.filter((country) => {
        if (country.name.common.toLowerCase().includes(searchTerm)) return true
        if (country.capital?.some((cap) => cap.toLowerCase().includes(searchTerm))) return true
        if (country.region.toLowerCase().includes(searchTerm)) return true
        if (
          country.languages &&
          Object.values(country.languages).some((lang) => lang.toLowerCase().includes(searchTerm))
        )
          return true
        if (
          country.currencies &&
          Object.values(country.currencies).some((curr) => curr.name.toLowerCase().includes(searchTerm))
        )
          return true

        const similarity = calculateSimilarity(country.name.common.toLowerCase(), searchTerm)
        return similarity > 0.6
      })

      setFilteredCountries(filtered.slice(0, 8))
      setShowDropdown(filtered.length > 0)
      setSelectedIndex(-1)
    } else {
      setFilteredCountries([])
      setShowDropdown(false)
      setSelectedIndex(-1)
    }
  }, [query, countries])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const calculateSimilarity = (str1: string, str2: string): number => {
    const longer = str1.length > str2.length ? str1 : str2
    const shorter = str1.length > str2.length ? str2 : str1
    if (longer.length === 0) return 1.0
    const editDistance = levenshteinDistance(longer, shorter)
    return (longer.length - editDistance) / longer.length
  }

  const levenshteinDistance = (str1: string, str2: string): number => {
    const matrix = []
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i]
    }
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j
    }
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1]
        } else {
          matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
        }
      }
    }
    return matrix[str2.length][str1.length]
  }

  const addToRecentSearches = (searchTerm: string) => {
    if (!searchTerm.trim()) return
    const newRecent = [searchTerm, ...recentSearches.filter((s) => s !== searchTerm)].slice(0, 5)
    setRecentSearches(newRecent)
    localStorage.setItem("recent-searches", JSON.stringify(newRecent))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(query)
    addToRecentSearches(query)
    setShowDropdown(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    onSearch(value)
  }

  const handleCountrySelect = (country: Country) => {
    setQuery(country.name.common)
    setShowDropdown(false)
    onSearch(country.name.common)
    addToRecentSearches(country.name.common)
    if (onSelectCountry) {
      onSelectCountry(country.cca3)
    }
  }

  const handleRecentSearch = (searchTerm: string) => {
    setQuery(searchTerm)
    onSearch(searchTerm)
    setShowDropdown(false)
  }

  const startVoiceSearch = () => {
    if (recognition.current && !isListening) {
      setIsListening(true)
      recognition.current.start()
    }
  }

  const handleInputFocus = () => {
    setIsFocused(true)
    if (query.trim() && filteredCountries.length > 0) {
      setShowDropdown(true)
    } else if (!query.trim() && (recentSearches.length > 0 || popularSearches.length > 0)) {
      setShowDropdown(true)
    }
  }

  const handleInputBlur = () => {
    setIsFocused(false)
  }

  return (
    <div className="relative animate-fade-in" ref={dropdownRef}>
      <form onSubmit={handleSubmit} className="relative">
        <div className={`relative transition-all duration-300 ${isFocused ? "scale-105" : ""}`}>
          <div className="absolute inset-0 bg-gradient-primary rounded-2xl blur-xl opacity-20 animate-pulse-slow"></div>
          <div className="relative glass rounded-2xl border border-gray-200/50 dark:border-white/20 overflow-hidden">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-white/70">
              <Search
                className={`h-5 w-5 transition-all duration-300 ${isFocused ? "text-gray-700 dark:text-white scale-110" : ""}`}
              />
            </div>

            <Input
              ref={inputRef}
              type="text"
              placeholder="Search countries, capitals, languages..."
              value={query}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              className="pl-12 pr-20 h-14 bg-transparent border-0 text-gray-800 dark:text-white placeholder:text-gray-500 dark:placeholder:text-white/50 text-lg font-medium focus:ring-0 focus:outline-none"
              autoComplete="off"
            />

            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
              {query && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setQuery("")
                    onSearch("")
                    setShowDropdown(false)
                  }}
                  className="h-8 w-8 p-0 text-gray-500 dark:text-white/70 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100/50 dark:hover:bg-white/10 rounded-full"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}

              {recognition.current && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={startVoiceSearch}
                  disabled={isListening}
                  className={`h-8 w-8 p-0 rounded-full transition-all duration-300 ${
                    isListening
                      ? "text-red-500 bg-red-100 dark:bg-red-400/20 animate-pulse"
                      : "text-gray-500 dark:text-white/70 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100/50 dark:hover:bg-white/10"
                  }`}
                  title="Voice search"
                >
                  <Mic className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </form>

      {/* Enhanced Dropdown */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 z-50 mt-3 animate-slide-up">
          <div className="glass rounded-2xl border border-gray-200/50 dark:border-white/20 shadow-beautiful-xl overflow-hidden">
            {/* Recent Searches */}
            {!query.trim() && recentSearches.length > 0 && (
              <div className="p-4 border-b border-gray-200/50 dark:border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500 dark:text-white/70" />
                    <span className="text-sm font-medium text-gray-700 dark:text-white/90">Recent Searches</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setRecentSearches([])
                      localStorage.removeItem("recent-searches")
                    }}
                    className="h-6 text-xs text-gray-500 dark:text-white/50 hover:text-gray-700 dark:hover:text-white/80 hover:bg-gray-100/50 dark:hover:bg-white/10"
                  >
                    Clear
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((search, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="cursor-pointer bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-white/90 hover:bg-gray-200 dark:hover:bg-white/20 border-gray-200 dark:border-white/20 transition-all duration-200 hover:scale-105"
                      onClick={() => handleRecentSearch(search)}
                    >
                      {search}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Popular Searches */}
            {!query.trim() && recentSearches.length === 0 && (
              <div className="p-4 border-b border-gray-200/50 dark:border-white/10">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="h-4 w-4 text-gray-500 dark:text-white/70" />
                  <span className="text-sm font-medium text-gray-700 dark:text-white/90">Popular Searches</span>
                  <Sparkles className="h-3 w-3 text-yellow-500 dark:text-yellow-400 animate-pulse" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((search, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="cursor-pointer bg-gradient-accent/20 text-gray-700 dark:text-white/90 hover:bg-gradient-accent/30 border-gray-200 dark:border-white/20 transition-all duration-200 hover:scale-105"
                      onClick={() => handleRecentSearch(search)}
                    >
                      {search}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Search Results */}
            {filteredCountries.length > 0 && (
              <div className="max-h-80 overflow-y-auto">
                {filteredCountries.map((country, index) => (
                  <button
                    key={country.cca3}
                    onClick={() => handleCountrySelect(country)}
                    className={`w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-white/10 transition-all duration-200 border-b border-gray-100 dark:border-white/5 last:border-0 group ${
                      selectedIndex === index ? "bg-gray-50 dark:bg-white/10" : ""
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-10 h-7 overflow-hidden rounded-lg shadow-beautiful flex-shrink-0 bg-gray-100 dark:bg-white/10">
                          <img
                            src={country.flags?.svg ?? country.flags?.png ?? "/placeholder.svg"}
                            alt={`Flag of ${country.name.common}`}
                            className={`w-full h-full transition-transform duration-200 group-hover:scale-110 ${
                              country.name.common === "Nepal" ? "object-contain" : "object-cover"
                            }`}
                          />
                        </div>
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-800 dark:text-white group-hover:text-gray-900 dark:group-hover:text-white/90 truncate text-lg">
                          {country.name.common}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-white/60 group-hover:text-gray-700 dark:group-hover:text-white/80 truncate">
                          {country.capital?.[0] && (
                            <>
                              <span className="font-medium">{country.capital[0]}</span>
                              <span className="mx-2">•</span>
                            </>
                          )}
                          <span>{country.region}</span>
                          {country.population && (
                            <>
                              <span className="mx-2">•</span>
                              <span>{country.population.toLocaleString()} people</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <div className="w-2 h-2 bg-gradient-accent rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* No Results */}
            {query.trim() && filteredCountries.length === 0 && (
              <div className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-white/10 rounded-full flex items-center justify-center">
                  <Search className="w-8 h-8 text-gray-400 dark:text-white/50" />
                </div>
                <p className="text-gray-700 dark:text-white/90 font-medium mb-1">No countries found</p>
                <p className="text-gray-500 dark:text-white/60 text-sm">
                  Try searching by country name, capital, or region
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
