"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { X, Filter, RotateCcw } from "lucide-react"
import type { Country } from "@/types/country"

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

interface AdvancedFiltersProps {
  countries: Country[]
  onFiltersChange: (filters: FilterOptions) => void
  isOpen: boolean
  onToggle: () => void
}

export function AdvancedFilters({ countries, onFiltersChange, isOpen, onToggle }: AdvancedFiltersProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    region: "all",
    subregion: "all",
    populationMin: 0,
    populationMax: 1500000000,
    areaMin: 0,
    areaMax: 20000000,
    language: "all",
    currency: "all",
    sortBy: "name",
    sortOrder: "asc",
  })

  // Get unique values for dropdowns
  const regions = [...new Set(countries.map((c) => c.region))].filter(Boolean).sort()
  const subregions = [...new Set(countries.map((c) => c.subregion))].filter(Boolean).sort()
  const languages = [...new Set(countries.flatMap((c) => (c.languages ? Object.values(c.languages) : [])))]
    .filter(Boolean)
    .sort()
  const currencies = [
    ...new Set(countries.flatMap((c) => (c.currencies ? Object.values(c.currencies).map((curr) => curr.name) : []))),
  ]
    .filter(Boolean)
    .sort()

  const updateFilter = (key: keyof FilterOptions, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const resetFilters = () => {
    const defaultFilters: FilterOptions = {
      region: "all",
      subregion: "all",
      populationMin: 0,
      populationMax: 1500000000,
      areaMin: 0,
      areaMax: 20000000,
      language: "all",
      currency: "all",
      sortBy: "name",
      sortOrder: "asc",
    }
    setFilters(defaultFilters)
    onFiltersChange(defaultFilters)
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.region !== "all") count++
    if (filters.subregion !== "all") count++
    if (filters.populationMin > 0 || filters.populationMax < 1500000000) count++
    if (filters.areaMin > 0 || filters.areaMax < 20000000) count++
    if (filters.language !== "all") count++
    if (filters.currency !== "all") count++
    return count
  }

  const activeFiltersCount = getActiveFiltersCount()

  if (!isOpen) {
    return (
      <div className="flex items-center gap-2 mb-4">
        <Button variant="outline" onClick={onToggle} className="flex items-center gap-2 bg-transparent">
          <Filter className="w-4 h-4" />
          Filters & Sort
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>

        {/* Quick Sort Options */}
        <Select value={filters.sortBy} onValueChange={(value) => updateFilter("sortBy", value)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="population">Population</SelectItem>
            <SelectItem value="area">Area</SelectItem>
            <SelectItem value="region">Region</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => updateFilter("sortOrder", filters.sortOrder === "asc" ? "desc" : "asc")}
        >
          {filters.sortOrder === "asc" ? "↑" : "↓"}
        </Button>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Advanced Filters & Sorting
          {activeFiltersCount > 0 && <Badge variant="secondary">{activeFiltersCount} active</Badge>}
        </h3>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            <RotateCcw className="w-4 h-4 mr-1" />
            Reset
          </Button>
          <Button variant="ghost" size="sm" onClick={onToggle}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Geographic Filters */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300">Geographic</h4>

          <div>
            <Label htmlFor="region">Region</Label>
            <Select value={filters.region} onValueChange={(value) => updateFilter("region", value)}>
              <SelectTrigger>
                <SelectValue placeholder="All regions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All regions</SelectItem>
                {regions.map((region) => (
                  <SelectItem key={region} value={region}>
                    {region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="subregion">Subregion</Label>
            <Select value={filters.subregion} onValueChange={(value) => updateFilter("subregion", value)}>
              <SelectTrigger>
                <SelectValue placeholder="All subregions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All subregions</SelectItem>
                {subregions.map((subregion) => (
                  <SelectItem key={subregion} value={subregion}>
                    {subregion}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Population & Area Filters */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300">Size</h4>

          <div>
            <Label>
              Population: {filters.populationMin.toLocaleString()} - {filters.populationMax.toLocaleString()}
            </Label>
            <div className="mt-2">
              <Slider
                value={[filters.populationMin, filters.populationMax]}
                onValueChange={([min, max]) => {
                  updateFilter("populationMin", min)
                  updateFilter("populationMax", max)
                }}
                max={1500000000}
                min={0}
                step={1000000}
                className="w-full"
              />
            </div>
          </div>

          <div>
            <Label>
              Area (km²): {filters.areaMin.toLocaleString()} - {filters.areaMax.toLocaleString()}
            </Label>
            <div className="mt-2">
              <Slider
                value={[filters.areaMin, filters.areaMax]}
                onValueChange={([min, max]) => {
                  updateFilter("areaMin", min)
                  updateFilter("areaMax", max)
                }}
                max={20000000}
                min={0}
                step={10000}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Cultural & Economic Filters */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300">Cultural & Economic</h4>

          <div>
            <Label htmlFor="language">Language</Label>
            <Select value={filters.language} onValueChange={(value) => updateFilter("language", value)}>
              <SelectTrigger>
                <SelectValue placeholder="All languages" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All languages</SelectItem>
                {languages.slice(0, 50).map((language) => (
                  <SelectItem key={language} value={language}>
                    {language}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="currency">Currency</Label>
            <Select value={filters.currency} onValueChange={(value) => updateFilter("currency", value)}>
              <SelectTrigger>
                <SelectValue placeholder="All currencies" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All currencies</SelectItem>
                {currencies.slice(0, 50).map((currency) => (
                  <SelectItem key={currency} value={currency}>
                    {currency}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Sorting Options */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-4">Sorting</h4>
        <div className="flex items-center gap-4">
          <div>
            <Label htmlFor="sortBy">Sort by</Label>
            <Select value={filters.sortBy} onValueChange={(value) => updateFilter("sortBy", value)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="population">Population</SelectItem>
                <SelectItem value="area">Area</SelectItem>
                <SelectItem value="region">Region</SelectItem>
                <SelectItem value="capital">Capital</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="sortOrder">Order</Label>
            <Select
              value={filters.sortOrder}
              onValueChange={(value: "asc" | "desc") => updateFilter("sortOrder", value)}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Ascending</SelectItem>
                <SelectItem value="desc">Descending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  )
}
