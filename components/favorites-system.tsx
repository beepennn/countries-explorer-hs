"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Trash2 } from "lucide-react"
import type { Country } from "@/types/country"

interface FavoritesSystemProps {
  countries: Country[]
  onSelectCountry: (countryCode: string) => void
}

export function FavoritesSystem({ countries, onSelectCountry }: FavoritesSystemProps) {
  const [favorites, setFavorites] = useState<string[]>([])
  const [showFavorites, setShowFavorites] = useState(false)

  // Load favorites from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem("country-favorites")
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites))
      } catch (error) {
        console.error("Error loading favorites:", error)
      }
    }
  }, [])

  // Save favorites to localStorage whenever favorites change
  useEffect(() => {
    localStorage.setItem("country-favorites", JSON.stringify(favorites))
  }, [favorites])

  const toggleFavorite = (countryCode: string) => {
    setFavorites((prev) =>
      prev.includes(countryCode) ? prev.filter((code) => code !== countryCode) : [...prev, countryCode],
    )
  }

  const isFavorite = (countryCode: string) => favorites.includes(countryCode)

  const clearAllFavorites = () => {
    setFavorites([])
  }

  const favoriteCountries = countries.filter((country) => favorites.includes(country.cca3))

  return (
    <div className="space-y-4">
      {/* Favorites Toggle Button */}
      <div className="flex items-center gap-2">
        <Button
          variant={showFavorites ? "default" : "outline"}
          onClick={() => setShowFavorites(!showFavorites)}
          className="flex items-center gap-2"
        >
          <Heart className={`w-4 h-4 ${showFavorites ? "fill-current" : ""}`} />
          My Favorites
          {favorites.length > 0 && <Badge variant="secondary">{favorites.length}</Badge>}
        </Button>

        {favorites.length > 0 && showFavorites && (
          <Button variant="ghost" size="sm" onClick={clearAllFavorites} className="text-red-500 hover:text-red-700">
            <Trash2 className="w-4 h-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      {/* Favorites List */}
      {showFavorites && (
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-md overflow-hidden border border-gray-200/50 dark:border-gray-700/50">
          {favoriteCountries.length > 0 ? (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {favoriteCountries.map((country) => (
                <div key={country.cca3} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => onSelectCountry(country.cca3)}
                      className="flex items-center gap-3 flex-1 text-left"
                    >
                      <div className="w-8 h-6 overflow-hidden rounded shadow-sm flex-shrink-0 bg-white dark:bg-gray-100">
                        <img
                          src={country.flags?.svg ?? country.flags?.png ?? "/placeholder.svg"}
                          alt={`Flag of ${country.name.common}`}
                          className={`w-full h-full ${country.name.common === "Nepal" ? "object-contain" : "object-cover"}`}
                        />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{country.name.common}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {country.region} • {country.population.toLocaleString()} people
                        </div>
                      </div>
                    </button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleFavorite(country.cca3)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Heart className="w-4 h-4 fill-current" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-600 dark:text-gray-400">
              <Heart className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2 text-gray-800 dark:text-white">No favorites yet</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Click the heart icon on any country to add it to your favorites
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Favorite Button Component for individual countries
export function FavoriteButton({ countryCode }: { countryCode: string }) {
  const [favorites, setFavorites] = useState<string[]>([])

  useEffect(() => {
    const savedFavorites = localStorage.getItem("country-favorites")
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites))
      } catch (error) {
        console.error("Error loading favorites:", error)
      }
    }
  }, [])

  const toggleFavorite = () => {
    const newFavorites = favorites.includes(countryCode)
      ? favorites.filter((code) => code !== countryCode)
      : [...favorites, countryCode]

    setFavorites(newFavorites)
    localStorage.setItem("country-favorites", JSON.stringify(newFavorites))
  }

  const isFavorite = favorites.includes(countryCode)

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleFavorite}
      className={`${isFavorite ? "text-red-500 hover:text-red-700" : "text-gray-500 dark:text-gray-400 hover:text-red-500"}`}
    >
      <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
    </Button>
  )
}
