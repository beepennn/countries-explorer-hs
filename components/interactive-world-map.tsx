"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Globe, ZoomIn, ZoomOut, RotateCcw, Maximize2 } from "lucide-react"
import type { Country } from "@/types/country"

interface InteractiveWorldMapProps {
  countries: Country[]
  selectedCountry?: string
  onSelectCountry: (countryCode: string) => void
}

export function InteractiveWorldMap({ countries, selectedCountry, onSelectCountry }: InteractiveWorldMapProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [mapMode, setMapMode] = useState<"political" | "satellite" | "terrain">("political")
  const [zoom, setZoom] = useState(2)
  const mapRef = useRef<HTMLDivElement>(null)

  // SVG World Map with clickable countries (simplified version)
  const worldMapSVG = `
    <svg viewBox="0 0 1000 500" className="w-full h-full">
      <!-- Simplified world map with major countries -->
      <!-- This would be replaced with a proper world map SVG -->
      <rect width="1000" height="500" fill="#4A90E2" opacity="0.1"/>
      
      <!-- Continents as simplified shapes -->
      <g id="north-america">
        <path d="M50 100 L200 80 L250 150 L200 200 L100 180 Z" fill="#10B981" opacity="0.7" className="continent"/>
        <text x="125" y="140" fill="white" fontSize="12" textAnchor="middle">North America</text>
      </g>
      
      <g id="south-america">
        <path d="M150 250 L200 240 L220 350 L180 380 L140 320 Z" fill="#10B981" opacity="0.7" className="continent"/>
        <text x="180" y="310" fill="white" fontSize="12" textAnchor="middle">South America</text>
      </g>
      
      <g id="europe">
        <path d="M400 80 L500 70 L520 120 L480 140 L420 130 Z" fill="#10B981" opacity="0.7" className="continent"/>
        <text x="460" y="105" fill="white" fontSize="10" textAnchor="middle">Europe</text>
      </g>
      
      <g id="africa">
        <path d="M420 150 L520 140 L540 280 L500 320 L440 300 L400 200 Z" fill="#10B981" opacity="0.7" className="continent"/>
        <text x="470" y="230" fill="white" fontSize="12" textAnchor="middle">Africa</text>
      </g>
      
      <g id="asia">
        <path d="M550 60 L800 50 L850 200 L750 220 L600 180 L520 120 Z" fill="#10B981" opacity="0.7" className="continent"/>
        <text x="675" y="135" fill="white" fontSize="14" textAnchor="middle">Asia</text>
      </g>
      
      <g id="oceania">
        <path d="M700 300 L800 290 L820 350 L780 370 L720 360 Z" fill="#10B981" opacity="0.7" className="continent"/>
        <text x="760" y="330" fill="white" fontSize="10" textAnchor="middle">Oceania</text>
      </g>
      
      <!-- Country markers -->
      ${countries
        .slice(0, 50)
        .map((country, index) => {
          const x = 100 + (index % 20) * 40
          const y = 100 + Math.floor(index / 20) * 60
          return `
          <circle 
            cx="${x}" 
            cy="${y}" 
            r="3" 
            fill="${selectedCountry === country.cca3 ? "#EF4444" : "#3B82F6"}"
            className="country-marker cursor-pointer hover:r-5 transition-all"
            data-country="${country.cca3}"
            data-name="${country.name.common}"
          />
          <text 
            x="${x}" 
            y="${y - 8}" 
            fontSize="8" 
            fill="#374151" 
            textAnchor="middle"
            className="pointer-events-none"
          >
            ${country.name.common.length > 10 ? country.name.common.substring(0, 10) + "..." : country.name.common}
          </text>
        `
        })
        .join("")}
    </svg>
  `

  const handleMapClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as SVGElement
    if (target.classList.contains("country-marker")) {
      const countryCode = target.getAttribute("data-country")
      if (countryCode) {
        onSelectCountry(countryCode)
      }
    }
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      mapRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange)
  }, [])

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Interactive World Map
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border">
              <Button
                variant={mapMode === "political" ? "default" : "ghost"}
                size="sm"
                onClick={() => setMapMode("political")}
                className="rounded-r-none"
              >
                Political
              </Button>
              <Button
                variant={mapMode === "satellite" ? "default" : "ghost"}
                size="sm"
                onClick={() => setMapMode("satellite")}
                className="rounded-none"
              >
                Satellite
              </Button>
              <Button
                variant={mapMode === "terrain" ? "default" : "ghost"}
                size="sm"
                onClick={() => setMapMode("terrain")}
                className="rounded-l-none"
              >
                Terrain
              </Button>
            </div>
            <Button variant="outline" size="icon" onClick={() => setZoom(Math.max(1, zoom - 0.5))}>
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => setZoom(Math.min(5, zoom + 0.5))}>
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => setZoom(2)}>
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={toggleFullscreen}>
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div
          ref={mapRef}
          className={`relative bg-gradient-to-b from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-lg overflow-hidden ${
            isFullscreen ? "h-screen" : "h-96"
          }`}
          style={{ transform: `scale(${zoom})`, transformOrigin: "center" }}
          onClick={handleMapClick}
        >
          {/* Map Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 opacity-20"></div>

          {/* Interactive Map */}
          <div className="w-full h-full cursor-pointer" dangerouslySetInnerHTML={{ __html: worldMapSVG }} />

          {/* Map Legend */}
          <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 rounded-lg p-3 shadow-lg">
            <h4 className="font-semibold text-sm mb-2">Legend</h4>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Countries</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>Selected</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full opacity-70"></div>
                <span>Continents</span>
              </div>
            </div>
          </div>

          {/* Map Stats */}
          <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 rounded-lg p-3 shadow-lg">
            <div className="text-xs space-y-1">
              <div>
                Total Countries: <span className="font-semibold">{countries.length}</span>
              </div>
              <div>
                Zoom Level: <span className="font-semibold">{zoom}x</span>
              </div>
              <div>
                Mode: <span className="font-semibold capitalize">{mapMode}</span>
              </div>
            </div>
          </div>

          {/* Selected Country Info */}
          {selectedCountry && (
            <div className="absolute bottom-4 right-4 bg-white dark:bg-gray-800 rounded-lg p-3 shadow-lg max-w-xs">
              {(() => {
                const country = countries.find((c) => c.cca3 === selectedCountry)
                if (!country) return null

                return (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <img
                        src={country.flags?.svg || "/placeholder.svg"}
                        alt={`Flag of ${country.name.common}`}
                        className="w-6 h-4 object-cover rounded"
                      />
                      <h4 className="font-semibold text-sm">{country.name.common}</h4>
                    </div>
                    <div className="text-xs space-y-1">
                      <div>
                        Population: <span className="font-semibold">{country.population?.toLocaleString()}</span>
                      </div>
                      <div>
                        Area: <span className="font-semibold">{country.area?.toLocaleString()} km²</span>
                      </div>
                      <div>
                        Region: <span className="font-semibold">{country.region}</span>
                      </div>
                    </div>
                  </div>
                )
              })()}
            </div>
          )}
        </div>

        {/* Map Instructions */}
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400 text-center">
          🖱️ Click on country markers to explore • 🔍 Use zoom controls • 📱 Try fullscreen mode
        </div>
      </CardContent>
    </Card>
  )
}
