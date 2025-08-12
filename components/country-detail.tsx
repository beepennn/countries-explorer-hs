"use client"

import { useState, useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"
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

  useEffect(() => {
    const fetchCountryDetails = async () => {
      // First check if we already have the country in our list
      const existingCountry = countries.find((c) => c.cca3 === countryCode)

      if (existingCountry) {
        setCountry(existingCountry)
        return
      }

      // If not, fetch it from the API with all fields
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

  if (error) {
    return <ErrorMessage message={error} />
  }

  if (isLoading || !country) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <Skeleton className="h-8 w-3/4 mb-4" />
        <Skeleton className="h-40 w-full mb-6" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
        </div>
      </div>
    )
  }

  // Format population with commas, handle undefined/null values
  const formattedPopulation = country.population ? new Intl.NumberFormat().format(country.population) : "Not available"

  // Format area with commas, handle undefined/null values
  const formattedArea = country.area ? new Intl.NumberFormat().format(country.area) : "Not available"

  // Get languages as an array, handle undefined/null values
  const languages = country.languages ? Object.values(country.languages) : []

  // Get currencies as an array, handle undefined/null values
  const currencies = country.currencies
    ? Object.values(country.currencies).map((c) => `${c.name} (${c.symbol || "No symbol"})`)
    : []

  // Get capital cities, handle undefined/null values
  const capitals = country.capital && country.capital.length > 0 ? country.capital.join(", ") : "Not available"

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
          <div className="w-full md:w-1/3 lg:w-1/4 aspect-video md:aspect-[3/2] overflow-hidden rounded-md shadow-md bg-white dark:bg-gray-100 flex items-center justify-center">
            <img
              src={country.flags.svg || "/placeholder.svg"}
              alt={country.flags.alt || `Flag of ${country.name.common}`}
              className={`${
                country.name.common === "Nepal" ? "max-w-full max-h-full object-contain" : "w-full h-full object-cover"
              }`}
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{country.name.common}</h2>
            <p className="text-gray-600 dark:text-gray-300">{country.name.official}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Capital</h3>
            <p className="text-gray-800 dark:text-white">{capitals}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Region</h3>
            <p className="text-gray-800 dark:text-white">
              {country.region} {country.subregion ? `(${country.subregion})` : ""}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Population</h3>
            <p className="text-gray-800 dark:text-white">{formattedPopulation}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Area</h3>
            <p className="text-gray-800 dark:text-white">{formattedArea} km²</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Languages</h3>
            <p className="text-gray-800 dark:text-white">
              {languages.length > 0 ? languages.join(", ") : "Not available"}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Currencies</h3>
            <p className="text-gray-800 dark:text-white">
              {currencies.length > 0 ? currencies.join(", ") : "Not available"}
            </p>
          </div>
        </div>

        {country.maps?.googleMaps && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Maps</h3>
            <a
              href={country.maps.googleMaps}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              View on Google Maps
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
