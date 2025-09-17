"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Users, MapPin, Crown } from "lucide-react"
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
      <div className="space-y-3">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="glass rounded-2xl p-4 animate-pulse">
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-16 rounded-lg bg-white/20" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-3/4 bg-white/20" />
                <Skeleton className="h-4 w-1/2 bg-white/20" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {countries.map((country, index) => (
        <button
          key={country.cca3}
          onClick={() => onSelectCountry(country.cca3)}
          className={`w-full text-left group transition-all duration-300 hover-lift animate-fade-in ${
            selectedCountry === country.cca3
              ? "glass rounded-2xl border-2 border-white/30 shadow-beautiful-lg scale-105"
              : "glass rounded-2xl border border-white/10 hover:border-white/20"
          }`}
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div className="p-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-12 overflow-hidden rounded-xl shadow-beautiful flex-shrink-0 bg-white/10 group-hover:shadow-beautiful-lg transition-all duration-300">
                  <img
                    src={country.flags?.svg ?? country.flags?.png ?? "/placeholder.svg"}
                    alt={`Flag of ${country.name.common}`}
                    className={`w-full h-full transition-transform duration-300 group-hover:scale-110 ${
                      country.name.common === "Nepal" ? "object-contain" : "object-cover"
                    }`}
                  />
                </div>
                {selectedCountry === country.cca3 && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-accent rounded-full flex items-center justify-center animate-scale-in">
                    <Crown className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-bold text-white group-hover:text-white/90 truncate text-lg">
                    {country.name.common}
                  </h3>
                  {country.population > 100000000 && (
                    <Badge className="bg-gradient-secondary text-white text-xs px-2 py-1">100M+</Badge>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-white/70 group-hover:text-white/90 text-sm">
                    <MapPin className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{country.region}</span>
                    {country.subregion && (
                      <>
                        <span>•</span>
                        <span className="truncate">{country.subregion}</span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-white/60 group-hover:text-white/80 text-sm">
                    <Users className="w-3 h-3 flex-shrink-0" />
                    <span>{country.population.toLocaleString()} people</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <div
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    selectedCountry === country.cca3
                      ? "bg-gradient-accent animate-pulse"
                      : "bg-white/20 group-hover:bg-white/40"
                  }`}
                ></div>

                {country.capital && country.capital[0] && (
                  <div className="text-xs text-white/50 group-hover:text-white/70 text-right">
                    <div className="font-medium">{country.capital[0]}</div>
                    <div>Capital</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Hover effect border */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-primary opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
        </button>
      ))}
    </div>
  )
}
