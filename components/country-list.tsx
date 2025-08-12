"use client"

import { Skeleton } from "@/components/ui/skeleton"
import type { Country } from "@/types/country"

interface CountryListProps {
  countries: Country[]
  isLoading: boolean
  selectedCountry: string | null
  onSelectCountry: (countryCode: string) => void
}

export function CountryList({ countries, isLoading, selectedCountry, onSelectCountry }: CountryListProps) {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="p-4 border-b border-gray-200 dark:border-gray-700">
            <Skeleton className="h-6 w-full" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      {countries.map((country) => (
        <button
          key={country.cca3}
          onClick={() => onSelectCountry(country.cca3)}
          className={`w-full text-left p-4 border-b border-gray-200 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
            selectedCountry === country.cca3 ? "bg-gray-100 dark:bg-gray-700" : ""
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-6 overflow-hidden rounded shadow-sm flex-shrink-0 bg-white dark:bg-gray-100">
              <img
                src={country.flags?.svg ?? country.flags?.png ?? "/placeholder.svg"}
                alt={`Flag of ${country.name.common}`}
                className={`w-full h-full ${country.name.common === "Nepal" ? "object-contain" : "object-cover"}`}
              />
            </div>
            <span className="font-medium text-gray-800 dark:text-white">{country.name.common}</span>
          </div>
        </button>
      ))}
    </div>
  )
}
