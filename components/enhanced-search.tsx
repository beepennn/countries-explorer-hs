"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Search, Clock, Mic, X } from "lucide-react"
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

  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const recognition = useRef<any>(null)

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
        // Exact match
        if (country.name.common.toLowerCase().includes(searchTerm)) return true

        // Capital match
        if (country.capital?.some((cap) => cap.toLowerCase().includes(searchTerm))) return true

        // Region match
        if (country.region.toLowerCase().includes(searchTerm)) return true

        // Language match
        if (
          country.languages &&
          Object.values(country.languages).some((lang) => lang.toLowerCase().includes(searchTerm))
        )
          return true

        // Currency match
        if (
          country.currencies &&
          Object.values(country.currencies).some((curr) => curr.name.toLowerCase().includes(searchTerm))
        )
          return true

        // Fuzzy match for typos
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

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown) return

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setSelectedIndex((prev) => (prev < filteredCountries.length - 1 ? prev + 1 : prev))
        break
      case "ArrowUp":
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
        break
      case "Enter":
        e.preventDefault()
        if (selectedIndex >= 0 && selectedIndex < filteredCountries.length) {
          handleCountrySelect(filteredCountries[selectedIndex])
        } else {
          handleSubmit(e as any)
        }
        break
      case "Escape":
        setShowDropdown(false)
        setSelectedIndex(-1)
        break
    }
  }

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

  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem("recent-searches")
  }

  const startVoiceSearch = () => {
    if (recognition.current && !isListening) {
      setIsListening(true)
      recognition.current.start()
    }
  }

  const handleInputFocus = () => {
    if (query.trim() && filteredCountries.length > 0) {
      setShowDropdown(true)
    } else if (!query.trim() && recentSearches.length > 0) {
      setShowDropdown(true)
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search countries, capitals, languages..."
            value={query}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onKeyDown={handleKeyDown}
            className="pl-10 pr-20 w-full bg-white dark:bg-gray-800"
            autoComplete="off"
            aria-label="Search countries"
            aria-expanded={showDropdown}
            aria-haspopup="listbox"
          />

          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
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
                className="h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            )}

            {recognition.current && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={startVoiceSearch}
                disabled={isListening}
                className={`h-6 w-6 p-0 ${isListening ? "text-red-500" : "text-gray-400"}`}
                title="Voice search"
              >
                <Mic className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </form>

      {/* Enhanced Dropdown */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-96 overflow-y-auto">
          {/* Recent Searches */}
          {!query.trim() && recentSearches.length > 0 && (
            <div className="p-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Recent Searches
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearRecentSearches}
                  className="h-6 text-xs text-gray-400 hover:text-gray-600"
                >
                  Clear
                </Button>
              </div>
              <div className="flex flex-wrap gap-1">
                {recentSearches.map((search, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                    onClick={() => handleRecentSearch(search)}
                  >
                    <Clock className="w-3 h-3 mr-1" />
                    {search}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Search Results */}
          {filteredCountries.length > 0 && (
            <div role="listbox">
              {filteredCountries.map((country, index) => (
                <button
                  key={country.cca3}
                  onClick={() => handleCountrySelect(country)}
                  className={`w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-0 ${
                    selectedIndex === index ? "bg-gray-50 dark:bg-gray-700" : ""
                  }`}
                  role="option"
                  aria-selected={selectedIndex === index}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-4 overflow-hidden rounded shadow-sm flex-shrink-0 bg-white dark:bg-gray-100">
                      <img
                        src={country.flags?.svg ?? country.flags?.png ?? "/placeholder.svg"}
                        alt={`Flag of ${country.name.common}`}
                        className={`w-full h-full ${country.name.common === "Nepal" ? "object-contain" : "object-cover"}`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-800 dark:text-white truncate">{country.name.common}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {country.capital?.[0] && `${country.capital[0]} • `}
                        {country.region}
                        {country.population && ` • ${country.population.toLocaleString()} people`}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* No Results */}
          {query.trim() && filteredCountries.length === 0 && (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No countries found for "{query}"</p>
              <p className="text-xs mt-1">Try searching by country name, capital, or region</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
