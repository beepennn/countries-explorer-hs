"use client"

import { useEffect, useState } from "react"

export type Country = {
  name: { common: string; official: string }
  cca3: string
  region: string
  subregion?: string
  capital?: string[]
  population: number
  area: number
  languages?: { [k: string]: string }
  currencies?: { [k: string]: { name: string; symbol: string } }
  flags?: { svg?: string; png?: string; alt?: string }
}

export const useCountries = () => {
  const [countries, setCountries] = useState<Country[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch("/api/countries", {
          cache: "force-cache",
        })
        if (!res.ok) {
          const text = await res.text() // helpful for debugging
          throw new Error(`HTTP error! Status: ${res.status} — ${text}`)
        }
        const data = await res.json()
        setCountries(data)
      } catch (err: any) {
        setError(err.message || "Unknown error")
      } finally {
        setIsLoading(false)
      }
    }

    fetchCountries()
  }, [])

  return { countries, isLoading, error }
}
