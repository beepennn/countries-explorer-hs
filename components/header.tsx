"use client"

import { Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

export function Header() {
  const handleHomeClick = () => {
    // Clear URL parameters and reload to reset state
    window.history.pushState({}, "", window.location.pathname)
    window.location.reload()
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleHomeClick} className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">Home</span>
          </Button>
          <h1 className="text-lg font-semibold">Countries Explorer</h1>
        </div>

        <ThemeToggle />
      </div>
    </header>
  )
}
