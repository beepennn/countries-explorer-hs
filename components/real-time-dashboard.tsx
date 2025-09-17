"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Activity, TrendingUp, Users, Globe, Clock, Zap, Eye, Search, RefreshCw, Wifi, WifiOff } from "lucide-react"
import { useAnalytics } from "@/hooks/use-analytics"
import type { Country } from "@/types/country"

interface RealTimeDashboardProps {
  countries: Country[]
}

interface LiveStats {
  totalVisitors: number
  activeUsers: number
  popularCountries: { country: string; views: number }[]
  searchQueries: { query: string; count: number }[]
  lastUpdated: Date
}

export function RealTimeDashboard({ countries }: RealTimeDashboardProps) {
  const [liveStats, setLiveStats] = useState<LiveStats>({
    totalVisitors: 0,
    activeUsers: 0,
    popularCountries: [],
    searchQueries: [],
    lastUpdated: new Date(),
  })
  const [isOnline, setIsOnline] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const { trackNavigation } = useAnalytics()

  // Simulate real-time data updates
  useEffect(() => {
    const generateMockData = (): LiveStats => {
      const popularCountryNames = [
        "United States",
        "China",
        "India",
        "Brazil",
        "Russia",
        "Japan",
        "Germany",
        "United Kingdom",
        "France",
        "Italy",
      ]

      const searchTerms = [
        "largest countries",
        "population",
        "europe",
        "asia",
        "islands",
        "capitals",
        "languages",
        "currencies",
      ]

      return {
        totalVisitors: Math.floor(Math.random() * 10000) + 50000,
        activeUsers: Math.floor(Math.random() * 500) + 100,
        popularCountries: popularCountryNames.slice(0, 5).map((country) => ({
          country,
          views: Math.floor(Math.random() * 1000) + 100,
        })),
        searchQueries: searchTerms.slice(0, 4).map((query) => ({
          query,
          count: Math.floor(Math.random() * 200) + 50,
        })),
        lastUpdated: new Date(),
      }
    }

    // Initial load
    setLiveStats(generateMockData())

    // Update every 30 seconds
    const interval = setInterval(() => {
      setLiveStats(generateMockData())
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const refreshData = async () => {
    setIsLoading(true)
    trackNavigation("dashboard_refresh")

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setLiveStats((prev) => ({
      ...prev,
      totalVisitors: prev.totalVisitors + Math.floor(Math.random() * 100),
      activeUsers: Math.floor(Math.random() * 500) + 100,
      lastUpdated: new Date(),
    }))

    setIsLoading(false)
  }

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
    if (seconds < 60) return `${seconds}s ago`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    return `${hours}h ago`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Real-Time Dashboard</h2>
          <p className="text-gray-600 dark:text-gray-400">Live statistics and user activity</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {isOnline ? <Wifi className="w-4 h-4 text-green-500" /> : <WifiOff className="w-4 h-4 text-red-500" />}
            <span className="text-sm text-gray-600 dark:text-gray-400">{isOnline ? "Online" : "Offline"}</span>
          </div>
          <Button variant="outline" size="sm" onClick={refreshData} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Live Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Visitors</p>
                <p className="text-3xl font-bold text-gray-800 dark:text-white">
                  {liveStats.totalVisitors.toLocaleString()}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-500">+12.5%</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Users</p>
                <p className="text-3xl font-bold text-gray-800 dark:text-white">{liveStats.activeUsers}</p>
                <div className="flex items-center gap-1 mt-2">
                  <Activity className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-500">Live</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <Activity className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Countries Explored</p>
                <p className="text-3xl font-bold text-gray-800 dark:text-white">{countries.length}</p>
                <div className="flex items-center gap-1 mt-2">
                  <Globe className="w-4 h-4 text-purple-500" />
                  <span className="text-sm text-purple-500">Complete</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                <Globe className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Response Time</p>
                <p className="text-3xl font-bold text-gray-800 dark:text-white">0.8s</p>
                <div className="flex items-center gap-1 mt-2">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-yellow-500">Fast</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                <Zap className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Popular Countries & Search Queries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Most Viewed Countries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {liveStats.popularCountries.map((item, index) => {
                const country = countries.find((c) => c.name.common === item.country)
                return (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-xs font-bold text-blue-600 dark:text-blue-400">
                        {index + 1}
                      </div>
                      {country && (
                        <img
                          src={country.flags?.svg || "/placeholder.svg"}
                          alt={`Flag of ${item.country}`}
                          className="w-6 h-4 object-cover rounded"
                        />
                      )}
                      <span className="font-medium">{item.country}</span>
                    </div>
                    <Badge variant="secondary">{item.views} views</Badge>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Popular Searches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {liveStats.searchQueries.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center text-xs font-bold text-green-600 dark:text-green-400">
                      {index + 1}
                    </div>
                    <span className="font-medium">"{item.query}"</span>
                  </div>
                  <Badge variant="outline">{item.count} searches</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Last Updated */}
      <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <Clock className="w-4 h-4" />
        <span>Last updated {formatTimeAgo(liveStats.lastUpdated)}</span>
      </div>
    </div>
  )
}
