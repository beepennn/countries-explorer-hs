"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart3, TrendingUp, Users, MapPin, Globe, X } from "lucide-react"
import type { Country } from "@/types/country"

interface AdvancedCountryComparisonProps {
  countries: Country[]
  initialCountries?: string[]
}

export function AdvancedCountryComparison({ countries, initialCountries = [] }: AdvancedCountryComparisonProps) {
  const [selectedCountries, setSelectedCountries] = useState<string[]>(initialCountries.slice(0, 4))
  const [comparisonMetric, setComparisonMetric] = useState<"population" | "area" | "density">("population")

  const addCountry = (countryCode: string) => {
    if (selectedCountries.length < 4 && !selectedCountries.includes(countryCode)) {
      setSelectedCountries([...selectedCountries, countryCode])
    }
  }

  const removeCountry = (countryCode: string) => {
    setSelectedCountries(selectedCountries.filter((code) => code !== countryCode))
  }

  const getCountryData = (countryCode: string) => {
    return countries.find((c) => c.cca3 === countryCode)
  }

  const calculateDensity = (country: Country) => {
    if (!country.population || !country.area || country.area === 0) return 0
    return Math.round(country.population / country.area)
  }

  const getMetricValue = (country: Country, metric: string) => {
    switch (metric) {
      case "population":
        return country.population || 0
      case "area":
        return country.area || 0
      case "density":
        return calculateDensity(country)
      default:
        return 0
    }
  }

  const formatMetricValue = (value: number, metric: string) => {
    switch (metric) {
      case "population":
        return value >= 1000000 ? `${(value / 1000000).toFixed(1)}M` : value.toLocaleString()
      case "area":
        return `${value.toLocaleString()} km²`
      case "density":
        return `${value}/km²`
      default:
        return value.toString()
    }
  }

  const getMaxValue = () => {
    const values = selectedCountries.map((code) => {
      const country = getCountryData(code)
      return country ? getMetricValue(country, comparisonMetric) : 0
    })
    return Math.max(...values, 1)
  }

  const availableCountries = countries.filter((c) => !selectedCountries.includes(c.cca3))

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Advanced Country Comparison
        </CardTitle>
        <div className="flex flex-wrap gap-2">
          <Select value={comparisonMetric} onValueChange={(value: any) => setComparisonMetric(value)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="population">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Population
                </div>
              </SelectItem>
              <SelectItem value="area">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Area
                </div>
              </SelectItem>
              <SelectItem value="density">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Density
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          {selectedCountries.length < 4 && (
            <Select onValueChange={addCountry}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Add country to compare" />
              </SelectTrigger>
              <SelectContent>
                {availableCountries.slice(0, 50).map((country) => (
                  <SelectItem key={country.cca3} value={country.cca3}>
                    <div className="flex items-center gap-2">
                      <img
                        src={country.flags?.svg || "/placeholder.svg"}
                        alt={`Flag of ${country.name.common}`}
                        className="w-4 h-3 object-cover rounded"
                      />
                      {country.name.common}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {selectedCountries.length === 0 ? (
          <div className="text-center py-12">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">No Countries Selected</h3>
            <p className="text-gray-500 dark:text-gray-500 mb-4">Add countries to start comparing their statistics</p>
            <Select onValueChange={addCountry}>
              <SelectTrigger className="w-64 mx-auto">
                <SelectValue placeholder="Select your first country" />
              </SelectTrigger>
              <SelectContent>
                {countries.slice(0, 50).map((country) => (
                  <SelectItem key={country.cca3} value={country.cca3}>
                    <div className="flex items-center gap-2">
                      <img
                        src={country.flags?.svg || "/placeholder.svg"}
                        alt={`Flag of ${country.name.common}`}
                        className="w-4 h-3 object-cover rounded"
                      />
                      {country.name.common}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Comparison Chart */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">
                {comparisonMetric.charAt(0).toUpperCase() + comparisonMetric.slice(1)} Comparison
              </h3>

              {selectedCountries.map((countryCode) => {
                const country = getCountryData(countryCode)
                if (!country) return null

                const value = getMetricValue(country, comparisonMetric)
                const maxValue = getMaxValue()
                const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0

                return (
                  <div key={countryCode} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={country.flags?.svg || "/placeholder.svg"}
                          alt={`Flag of ${country.name.common}`}
                          className="w-8 h-6 object-cover rounded shadow-sm"
                        />
                        <span className="font-medium">{country.name.common}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCountry(countryCode)}
                          className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                      <span className="font-semibold text-sm">{formatMetricValue(value, comparisonMetric)}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Detailed Comparison Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-semibold">Country</th>
                    <th className="text-right p-3 font-semibold">Population</th>
                    <th className="text-right p-3 font-semibold">Area (km²)</th>
                    <th className="text-right p-3 font-semibold">Density</th>
                    <th className="text-left p-3 font-semibold">Region</th>
                    <th className="text-left p-3 font-semibold">Capital</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedCountries.map((countryCode) => {
                    const country = getCountryData(countryCode)
                    if (!country) return null

                    return (
                      <tr key={countryCode} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <img
                              src={country.flags?.svg || "/placeholder.svg"}
                              alt={`Flag of ${country.name.common}`}
                              className="w-6 h-4 object-cover rounded"
                            />
                            <span className="font-medium">{country.name.common}</span>
                          </div>
                        </td>
                        <td className="text-right p-3">{country.population?.toLocaleString() || "N/A"}</td>
                        <td className="text-right p-3">{country.area?.toLocaleString() || "N/A"}</td>
                        <td className="text-right p-3">{calculateDensity(country) || "N/A"}</td>
                        <td className="p-3">
                          <Badge variant="secondary">{country.region}</Badge>
                        </td>
                        <td className="p-3">{country.capital?.[0] || "N/A"}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-blue-500" />
                    <span className="font-semibold text-sm">Total Population</span>
                  </div>
                  <div className="text-2xl font-bold">
                    {selectedCountries
                      .reduce((sum, code) => {
                        const country = getCountryData(code)
                        return sum + (country?.population || 0)
                      }, 0)
                      .toLocaleString()}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-green-500" />
                    <span className="font-semibold text-sm">Total Area</span>
                  </div>
                  <div className="text-2xl font-bold">
                    {selectedCountries
                      .reduce((sum, code) => {
                        const country = getCountryData(code)
                        return sum + (country?.area || 0)
                      }, 0)
                      .toLocaleString()}{" "}
                    km²
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="w-4 h-4 text-purple-500" />
                    <span className="font-semibold text-sm">Countries</span>
                  </div>
                  <div className="text-2xl font-bold">{selectedCountries.length}</div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
