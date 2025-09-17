"use client"

import { Home, Globe, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

export function Header() {
  const handleHomeClick = () => {
    window.history.pushState({}, "", window.location.pathname)
    window.location.reload()
  }

  return (
    <header className="sticky top-0 z-50 w-full glass border-b border-white/20 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleHomeClick}
            className="flex items-center gap-2 hover:bg-white/10 text-white hover:text-white transition-all duration-300 hover:scale-105"
          >
            <div className="relative">
              <Home className="h-5 w-5" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-accent rounded-full animate-pulse"></div>
            </div>
            <span className="hidden sm:inline font-medium">Home</span>
          </Button>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Globe className="h-8 w-8 text-white animate-float" />
              <div className="absolute inset-0 bg-gradient-accent rounded-full opacity-20 animate-pulse-slow"></div>
            </div>
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-white flex items-center gap-2">
                Countries Explorer
                <Sparkles className="h-5 w-5 text-yellow-300 animate-pulse" />
              </h1>
              <p className="text-xs text-white/70 hidden sm:block">Discover the world's beauty</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 text-white/80 text-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Live Data</span>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* Animated border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
    </header>
  )
}
