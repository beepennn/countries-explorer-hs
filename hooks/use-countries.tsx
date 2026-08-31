"use client"

import { useEffect, useState } from "react"
import type { Country } from "@/types/country"

export const useCountries = () => {
  const [countries, setCountries] = useState<Country[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    const fetchCountries = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch("/api/countries", {
          signal: controller.signal,
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(
            data?.error ||
              `Failed to load countries. Status: ${response.status}`,
          )
        }

        if (!Array.isArray(data)) {
          throw new Error("Invalid response from countries API")
        }

        setCountries(data as Country[])
      } catch (error) {
        if (
          error instanceof DOMException &&
          error.name === "AbortError"
        ) {
          return
        }

        console.error("Failed to fetch countries:", error)

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load countries",
        )
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    fetchCountries()

    return () => {
      controller.abort()
    }
  }, [])

  return {
    countries,
    isLoading,
    error,
  }
}