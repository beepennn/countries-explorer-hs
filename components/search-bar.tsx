"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import type { Country } from "@/types/country"

interface SearchBarProps {
  onSearch: (query: string) => void
  onSelectCountry?: (countryCode: string) => void
  countries: Country[]
}

export function SearchBar({ onSearch, onSelectCountry, countries }: SearchBarProps) {
  const [query, setQuery] = useState("")
  const [showDropdown, setShowDropdown] = useState(false)
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([])
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Filter countries based on first letter match
  useEffect(() => {
    if (query.trim()) {
      const filtered = countries.filter((country) => country.name.common.toLowerCase().startsWith(query.toLowerCase()))
      setFilteredCountries(filtered.slice(0, 10)) // Limit to 10 results
      setShowDropdown(filtered.length > 0)
    } else {
      setFilteredCountries([])
      setShowDropdown(false)
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(query)
    setShowDropdown(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    onSearch(value) // Update search results in real-time
  }

  const handleCountrySelect = (country: Country) => {
    setQuery(country.name.common)
    setShowDropdown(false)
    onSearch(country.name.common)
    if (onSelectCountry) {
      onSelectCountry(country.cca3)
    }
  }

  const handleInputFocus = () => {
    if (query.trim() && filteredCountries.length > 0) {
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
            placeholder="Search countries..."
            value={query}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            className="pl-10 w-full bg-white dark:bg-gray-800"
            autoComplete="off"
          />
        </div>
      </form>

      {/* Dropdown with filtered countries */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {filteredCountries.map((country) => (
            <button
              key={country.cca3}
              onClick={() => handleCountrySelect(country)}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-0"
            >
              <div className="flex items-center gap-3">
                <div className="w-6 h-4 overflow-hidden rounded shadow-sm flex-shrink-0 bg-white dark:bg-gray-100">
                  <img
                    src={country.flags?.svg ?? country.flags?.png ?? "/placeholder.svg"}
                    alt={`Flag of ${country.name.common}`}
                    className={`w-full h-full ${country.name.common === "Nepal" ? "object-contain" : "object-cover"}`}
                  />
                </div>
                <div>
                  <div className="font-medium text-gray-800 dark:text-white">{country.name.common}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{country.region}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
