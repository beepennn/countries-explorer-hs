"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, BarChart3, Users, MapPin, Globe } from "lucide-react"
import type { Country } from "@/types/country"

interface CountryComparisonProps {
  countries: Country[]
  isOpen: boolean
  onToggle: () => void
}

export function CountryComparison({ countries, isOpen, onToggle }: CountryComparisonProps) {
  const [selectedCountries, setSelectedCountries] = useState<Country[]>([])

  const addCountry = (countryCode: string) => {
    const country = countries.find((c) => c.cca3 === countryCode)
    if (country && selectedCountries.length < 4 && !selectedCountries.find((c) => c.cca3 === countryCode)) {
      setSelectedCountries([...selectedCountries, country])
    }
  }

  const removeCountry = (countryCode: string) => {
    setSelectedCountries(selectedCountries.filter((c) => c.cca3 !== countryCode))
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)}B`
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const getPopulationColor = (population: number) => {
    if (population > 100000000) return "bg-red-500"
    if (population > 50000000) return "bg-orange-500"
    if (population > 10000000) return "bg-yellow-500"
    if (population > 1000000) return "bg-green-500"
    return "bg-blue-500"
  }

  const getAreaColor = (area: number) => {
    if (area > 10000000) return "bg-purple-500"
    if (area > 1000000) return "bg-indigo-500"
    if (area > 100000) return "bg-blue-500"
    if (area > 10000) return "bg-green-500"
    return "bg-yellow-500"
  }

  if (!isOpen) {
    return (
      <Button variant="outline" onClick={onToggle} className="flex items-center gap-2 bg-transparent">
        <BarChart3 className="w-4 h-4" />
        Compare Countries
        {selectedCountries.length > 0 && <Badge variant="secondary">{selectedCountries.length}</Badge>}
      </Button>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Country Comparison
          {selectedCountries.length > 0 && <Badge variant="secondary">{selectedCountries.length}/4 countries</Badge>}
        </h3>
        <Button variant="ghost" size="sm" onClick={onToggle}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Country Selection */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Select onValueChange={addCountry}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Add country to compare" />
            </SelectTrigger>
            <SelectContent>
              {countries
                .filter((c) => !selectedCountries.find((sc) => sc.cca3 === c.cca3))
                .sort((a, b) => a.name.common.localeCompare(b.name.common))
                .map((country) => (
                  <SelectItem key={country.cca3} value={country.cca3}>
                    <div className="flex items-center gap-2">
                      <img
                        src={country.flags?.svg || country.flags?.png || "/placeholder.svg"}
                        alt={`Flag of ${country.name.common}`}
                        className="w-4 h-3 object-cover rounded"
                      />
                      {country.name.common}
                    </div>
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          {selectedCountries.length < 4 && (
            <div className="text-sm text-gray-500 dark:text-gray-400">Add up to 4 countries to compare</div>
          )}
        </div>

        {/* Selected Countries */}
        <div className="flex flex-wrap gap-2">
          {selectedCountries.map((country) => (
            <Badge key={country.cca3} variant="secondary" className="flex items-center gap-2 px-3 py-1">
              <img
                src={country.flags?.svg || country.flags?.png || "/placeholder.svg"}
                alt={`Flag of ${country.name.common}`}
                className="w-4 h-3 object-cover rounded"
              />
              {country.name.common}
              <button onClick={() => removeCountry(country.cca3)} className="ml-1 hover:text-red-500">
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      {/* Comparison Table */}
      {selectedCountries.length > 0 && (
        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-4">Country</th>
                      <th className="text-left py-2 px-4">Capital</th>
                      <th className="text-left py-2 px-4">Region</th>
                      <th className="text-left py-2 px-4">Languages</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedCountries.map((country) => (
                      <tr key={country.cca3} className="border-b">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={country.flags?.svg || country.flags?.png || "/placeholder.svg"}
                              alt={`Flag of ${country.name.common}`}
                              className="w-8 h-6 object-cover rounded shadow-sm"
                            />
                            <div>
                              <div className="font-medium">{country.name.common}</div>
                              <div className="text-sm text-gray-500">{country.name.official}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">{country.capital?.join(", ") || "N/A"}</td>
                        <td className="py-3 px-4">
                          <div>
                            <div>{country.region}</div>
                            {country.subregion && <div className="text-sm text-gray-500">{country.subregion}</div>}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {country.languages ? Object.values(country.languages).slice(0, 3).join(", ") : "N/A"}
                          {country.languages && Object.values(country.languages).length > 3 && "..."}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Population Comparison */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Population Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {selectedCountries
                  .sort((a, b) => b.population - a.population)
                  .map((country, index) => {
                    const maxPopulation = Math.max(...selectedCountries.map((c) => c.population))
                    const percentage = (country.population / maxPopulation) * 100

                    return (
                      <div key={country.cca3} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">#{index + 1}</span>
                            <img
                              src={country.flags?.svg || country.flags?.png || "/placeholder.svg"}
                              alt={`Flag of ${country.name.common}`}
                              className="w-5 h-4 object-cover rounded"
                            />
                            <span className="font-medium">{country.name.common}</span>
                          </div>
                          <span className="font-mono text-sm">{country.population.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${getPopulationColor(country.population)}`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
              </div>
            </CardContent>
          </Card>

          {/* Area Comparison */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Area Comparison (km²)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {selectedCountries
                  .sort((a, b) => b.area - a.area)
                  .map((country, index) => {
                    const maxArea = Math.max(...selectedCountries.map((c) => c.area))
                    const percentage = (country.area / maxArea) * 100

                    return (
                      <div key={country.cca3} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">#{index + 1}</span>
                            <img
                              src={country.flags?.svg || country.flags?.png || "/placeholder.svg"}
                              alt={`Flag of ${country.name.common}`}
                              className="w-5 h-4 object-cover rounded"
                            />
                            <span className="font-medium">{country.name.common}</span>
                          </div>
                          <span className="font-mono text-sm">{country.area.toLocaleString()} km²</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${getAreaColor(country.area)}`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{selectedCountries.length}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Countries</div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {formatNumber(selectedCountries.reduce((sum, c) => sum + c.population, 0))}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Population</div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {formatNumber(selectedCountries.reduce((sum, c) => sum + c.area, 0))}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Area (km²)</div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {new Set(selectedCountries.map((c) => c.region)).size}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Regions</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {selectedCountries.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Select countries above to start comparing</p>
        </div>
      )}
    </div>
  )
}
