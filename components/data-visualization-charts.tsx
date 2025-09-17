"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
} from "recharts"
import { BarChart3, PieChartIcon, Users, MapPin, Globe, Activity, Target } from "lucide-react"
import type { Country } from "@/types/country"

interface DataVisualizationChartsProps {
  countries: Country[]
  isOpen: boolean
  onToggle: () => void
}

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7300",
  "#00ff00",
  "#ff00ff",
  "#00ffff",
  "#ff0000",
  "#0000ff",
  "#ffff00",
]

const REGION_COLORS = {
  Africa: "#ff6b6b",
  Americas: "#4ecdc4",
  Asia: "#45b7d1",
  Europe: "#96ceb4",
  Oceania: "#feca57",
  Antarctic: "#a55eea",
}

export function DataVisualizationCharts({ countries, isOpen, onToggle }: DataVisualizationChartsProps) {
  const [selectedChart, setSelectedChart] = useState<string>("population-bar")
  const [selectedRegion, setSelectedRegion] = useState<string>("all")

  const filteredCountries = useMemo(() => {
    if (selectedRegion === "all") return countries
    return countries.filter((country) => country.region === selectedRegion)
  }, [countries, selectedRegion])

  const topCountriesByPopulation = useMemo(() => {
    return filteredCountries
      .sort((a, b) => b.population - a.population)
      .slice(0, 15)
      .map((country) => ({
        name: country.name.common.length > 12 ? country.name.common.slice(0, 12) + "..." : country.name.common,
        fullName: country.name.common,
        population: country.population,
        area: country.area,
        density: Math.round(country.population / country.area),
        flag: country.flags.svg || country.flags.png,
      }))
  }, [filteredCountries])

  const topCountriesByArea = useMemo(() => {
    return filteredCountries
      .sort((a, b) => b.area - a.area)
      .slice(0, 15)
      .map((country) => ({
        name: country.name.common.length > 12 ? country.name.common.slice(0, 12) + "..." : country.name.common,
        fullName: country.name.common,
        population: country.population,
        area: country.area,
        density: Math.round(country.population / country.area),
        flag: country.flags.svg || country.flags.png,
      }))
  }, [filteredCountries])

  const regionDistribution = useMemo(() => {
    const regionCounts = filteredCountries.reduce(
      (acc, country) => {
        acc[country.region] = (acc[country.region] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return Object.entries(regionCounts).map(([region, count]) => ({
      region,
      count,
      color: REGION_COLORS[region as keyof typeof REGION_COLORS] || "#8884d8",
    }))
  }, [filteredCountries])

  const populationVsArea = useMemo(() => {
    return filteredCountries
      .filter((country) => country.population > 1000000 && country.area > 1000)
      .slice(0, 50)
      .map((country) => ({
        name: country.name.common,
        population: country.population,
        area: country.area,
        density: Math.round(country.population / country.area),
        region: country.region,
      }))
  }, [filteredCountries])

  const populationGrowthData = useMemo(() => {
    const ranges = [
      { range: "0-1M", min: 0, max: 1000000, color: "#8884d8" },
      { range: "1M-10M", min: 1000000, max: 10000000, color: "#82ca9d" },
      { range: "10M-50M", min: 10000000, max: 50000000, color: "#ffc658" },
      { range: "50M-100M", min: 50000000, max: 100000000, color: "#ff7300" },
      { range: "100M+", min: 100000000, max: Number.POSITIVE_INFINITY, color: "#ff0000" },
    ]

    return ranges.map((range) => {
      const count = filteredCountries.filter(
        (country) => country.population >= range.min && country.population < range.max,
      ).length
      return {
        range: range.range,
        count,
        color: range.color,
      }
    })
  }, [filteredCountries])

  const densityData = useMemo(() => {
    return filteredCountries
      .filter((country) => country.area > 0)
      .sort((a, b) => b.population / b.area - a.population / a.area)
      .slice(0, 15)
      .map((country) => ({
        name: country.name.common.length > 10 ? country.name.common.slice(0, 10) + "..." : country.name.common,
        fullName: country.name.common,
        density: Math.round(country.population / country.area),
        population: country.population,
        area: country.area,
      }))
  }, [filteredCountries])

  const languageDistribution = useMemo(() => {
    const languageCounts = filteredCountries.reduce(
      (acc, country) => {
        if (country.languages) {
          Object.values(country.languages).forEach((language) => {
            acc[language] = (acc[language] || 0) + 1
          })
        }
        return acc
      },
      {} as Record<string, number>,
    )

    return Object.entries(languageCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([language, count]) => ({
        language,
        count,
      }))
  }, [filteredCountries])

  const regions = useMemo(() => {
    return Array.from(new Set(countries.map((country) => country.region))).sort()
  }, [countries])

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        onClick={onToggle}
        className="flex items-center gap-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700"
      >
        <BarChart3 className="w-4 h-4" />
        Data Visualization
      </Button>
    )
  }

  const chartConfig = {
    population: {
      label: "Population",
      color: "hsl(var(--chart-1))",
    },
    area: {
      label: "Area (km²)",
      color: "hsl(var(--chart-2))",
    },
    density: {
      label: "Density (per km²)",
      color: "hsl(var(--chart-3))",
    },
    count: {
      label: "Count",
      color: "hsl(var(--chart-4))",
    },
  }

  return (
    <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6 border border-gray-200/50 dark:border-gray-700/50">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Data Visualization</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Interactive charts and analytics</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              {regions.map((region) => (
                <SelectItem key={region} value={region}>
                  {region}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="ghost" size="sm" onClick={onToggle} className="text-gray-600 dark:text-gray-400">
            ×
          </Button>
        </div>
      </div>

      {/* Chart Type Selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { id: "population-bar", label: "Population", icon: Users },
          { id: "area-bar", label: "Area", icon: MapPin },
          { id: "region-pie", label: "Regions", icon: PieChartIcon },
          { id: "density-bar", label: "Density", icon: Target },
          { id: "population-vs-area", label: "Pop vs Area", icon: Activity },
          { id: "population-ranges", label: "Pop Ranges", icon: BarChart3 },
          { id: "languages", label: "Languages", icon: Globe },
        ].map(({ id, label, icon: Icon }) => (
          <Button
            key={id}
            variant={selectedChart === id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedChart(id)}
            className={`flex items-center gap-2 ${
              selectedChart === id
                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                : "bg-white/80 dark:bg-gray-700/80 text-gray-700 dark:text-gray-300"
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </Button>
        ))}
      </div>

      {/* Charts */}
      <div className="space-y-6">
        {selectedChart === "population-bar" && (
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <Users className="w-5 h-5 text-blue-500" />
                Top Countries by Population
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Most populous countries in {selectedRegion === "all" ? "the world" : selectedRegion}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topCountriesByPopulation} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 12, fill: "currentColor" }}
                      className="text-gray-600 dark:text-gray-400"
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: "currentColor" }}
                      className="text-gray-600 dark:text-gray-400"
                      tickFormatter={(value) => {
                        if (value >= 1000000000) return `${(value / 1000000000).toFixed(1)}B`
                        if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
                        if (value >= 1000) return `${(value / 1000).toFixed(1)}K`
                        return value.toString()
                      }}
                    />
                    <ChartTooltip
                      content={<ChartTooltipContent />}
                      formatter={(value: any, name: string, props: any) => [
                        typeof value === "number" ? value.toLocaleString() : value,
                        name === "population" ? "Population" : name,
                      ]}
                      labelFormatter={(label: string, payload: any) => {
                        const data = payload?.[0]?.payload
                        return data ? data.fullName : label
                      }}
                    />
                    <Bar dataKey="population" fill="var(--color-population)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        )}

        {selectedChart === "area-bar" && (
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <MapPin className="w-5 h-5 text-green-500" />
                Top Countries by Area
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Largest countries by land area in {selectedRegion === "all" ? "the world" : selectedRegion}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topCountriesByArea} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 12, fill: "currentColor" }}
                      className="text-gray-600 dark:text-gray-400"
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: "currentColor" }}
                      className="text-gray-600 dark:text-gray-400"
                      tickFormatter={(value) => {
                        if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
                        if (value >= 1000) return `${(value / 1000).toFixed(1)}K`
                        return value.toString()
                      }}
                    />
                    <ChartTooltip
                      content={<ChartTooltipContent />}
                      formatter={(value: any, name: string, props: any) => [
                        typeof value === "number" ? `${value.toLocaleString()} km²` : value,
                        name === "area" ? "Area" : name,
                      ]}
                      labelFormatter={(label: string, payload: any) => {
                        const data = payload?.[0]?.payload
                        return data ? data.fullName : label
                      }}
                    />
                    <Bar dataKey="area" fill="var(--color-area)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        )}

        {selectedChart === "region-pie" && (
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <PieChartIcon className="w-5 h-5 text-purple-500" />
                Countries by Region
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Distribution of countries across different regions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={regionDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ region, count, percent }) => `${region}: ${count} (${(percent * 100).toFixed(1)}%)`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {regionDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload
                          return (
                            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                              <p className="text-gray-900 dark:text-white font-medium">{data.region}</p>
                              <p className="text-gray-600 dark:text-gray-400">
                                {data.count} countries ({((data.count / filteredCountries.length) * 100).toFixed(1)}%)
                              </p>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        )}

        {selectedChart === "density-bar" && (
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <Target className="w-5 h-5 text-orange-500" />
                Population Density
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Most densely populated countries (people per km²)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={densityData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 12, fill: "currentColor" }}
                      className="text-gray-600 dark:text-gray-400"
                    />
                    <YAxis tick={{ fontSize: 12, fill: "currentColor" }} className="text-gray-600 dark:text-gray-400" />
                    <ChartTooltip
                      content={<ChartTooltipContent />}
                      formatter={(value: any, name: string) => [
                        `${value} people/km²`,
                        name === "density" ? "Population Density" : name,
                      ]}
                      labelFormatter={(label: string, payload: any) => {
                        const data = payload?.[0]?.payload
                        return data ? data.fullName : label
                      }}
                    />
                    <Bar dataKey="density" fill="var(--color-density)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        )}

        {selectedChart === "population-vs-area" && (
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <Activity className="w-5 h-5 text-red-500" />
                Population vs Area Correlation
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Relationship between country size and population
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart data={populationVsArea} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis
                      type="number"
                      dataKey="area"
                      name="Area"
                      tick={{ fontSize: 12, fill: "currentColor" }}
                      className="text-gray-600 dark:text-gray-400"
                      tickFormatter={(value) => {
                        if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
                        if (value >= 1000) return `${(value / 1000).toFixed(1)}K`
                        return value.toString()
                      }}
                    />
                    <YAxis
                      type="number"
                      dataKey="population"
                      name="Population"
                      tick={{ fontSize: 12, fill: "currentColor" }}
                      className="text-gray-600 dark:text-gray-400"
                      tickFormatter={(value) => {
                        if (value >= 1000000000) return `${(value / 1000000000).toFixed(1)}B`
                        if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
                        if (value >= 1000) return `${(value / 1000).toFixed(1)}K`
                        return value.toString()
                      }}
                    />
                    <ChartTooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload
                          return (
                            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                              <p className="text-gray-900 dark:text-white font-medium">{data.name}</p>
                              <p className="text-gray-600 dark:text-gray-400">
                                Population: {data.population.toLocaleString()}
                              </p>
                              <p className="text-gray-600 dark:text-gray-400">Area: {data.area.toLocaleString()} km²</p>
                              <p className="text-gray-600 dark:text-gray-400">Density: {data.density} people/km²</p>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Scatter dataKey="population" fill="var(--color-population)" />
                  </ScatterChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        )}

        {selectedChart === "population-ranges" && (
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <BarChart3 className="w-5 h-5 text-indigo-500" />
                Population Distribution
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Number of countries in different population ranges
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={populationGrowthData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis
                      dataKey="range"
                      tick={{ fontSize: 12, fill: "currentColor" }}
                      className="text-gray-600 dark:text-gray-400"
                    />
                    <YAxis tick={{ fontSize: 12, fill: "currentColor" }} className="text-gray-600 dark:text-gray-400" />
                    <ChartTooltip
                      content={<ChartTooltipContent />}
                      formatter={(value: any, name: string) => [
                        `${value} countries`,
                        name === "count" ? "Number of Countries" : name,
                      ]}
                    />
                    <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        )}

        {selectedChart === "languages" && (
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <Globe className="w-5 h-5 text-teal-500" />
                Most Common Languages
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Languages spoken across multiple countries
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={languageDistribution} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis
                      dataKey="language"
                      tick={{ fontSize: 12, fill: "currentColor" }}
                      className="text-gray-600 dark:text-gray-400"
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis tick={{ fontSize: 12, fill: "currentColor" }} className="text-gray-600 dark:text-gray-400" />
                    <ChartTooltip
                      content={<ChartTooltipContent />}
                      formatter={(value: any, name: string) => [
                        `${value} countries`,
                        name === "count" ? "Number of Countries" : name,
                      ]}
                    />
                    <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Statistics Summary */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white">
          <div className="text-2xl font-bold">{filteredCountries.length}</div>
          <div className="text-sm opacity-90">Countries</div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white">
          <div className="text-2xl font-bold">
            {(filteredCountries.reduce((sum, c) => sum + c.population, 0) / 1000000000).toFixed(1)}B
          </div>
          <div className="text-sm opacity-90">Total Population</div>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-4 text-white">
          <div className="text-2xl font-bold">
            {(filteredCountries.reduce((sum, c) => sum + c.area, 0) / 1000000).toFixed(1)}M
          </div>
          <div className="text-sm opacity-90">Total Area (km²)</div>
        </div>
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-4 text-white">
          <div className="text-2xl font-bold">
            {Math.round(
              filteredCountries.reduce((sum, c) => sum + c.population / c.area, 0) / filteredCountries.length,
            )}
          </div>
          <div className="text-sm opacity-90">Avg Density</div>
        </div>
      </div>
    </div>
  )
}
