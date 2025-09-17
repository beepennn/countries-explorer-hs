"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Sparkles, Send, Bot, User, Loader2, Mic, MicOff } from "lucide-react"
import { useAnalytics } from "@/hooks/use-analytics"
import type { Country } from "@/types/country"

interface Message {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
  countries?: Country[]
}

interface AISearchAssistantProps {
  countries: Country[]
  onSelectCountry: (countryCode: string) => void
}

export function AISearchAssistant({ countries, onSelectCountry }: AISearchAssistantProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "ai",
      content:
        "👋 Hi! I'm your AI Country Assistant. Ask me anything about countries - like 'Show me countries with over 100 million people' or 'Which countries speak French?' I can help you discover amazing places!",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { trackSearch } = useAnalytics()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Voice recognition setup
  const startVoiceRecognition = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Voice recognition is not supported in your browser")
      return
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const recognition = new SpeechRecognition()

    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = "en-US"

    recognition.onstart = () => {
      setIsListening(true)
    }

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setInput(transcript)
      setIsListening(false)
    }

    recognition.onerror = () => {
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.start()
  }

  const processAIQuery = async (query: string): Promise<{ response: string; matchedCountries: Country[] }> => {
    const lowerQuery = query.toLowerCase()
    let matchedCountries: Country[] = []
    let response = ""

    // Population queries
    if (lowerQuery.includes("population") || lowerQuery.includes("people")) {
      if (lowerQuery.includes("most") || lowerQuery.includes("largest") || lowerQuery.includes("biggest")) {
        matchedCountries = countries
          .filter((c) => c.population > 0)
          .sort((a, b) => b.population - a.population)
          .slice(0, 10)
        response =
          "🌍 Here are the 10 most populous countries in the world! China and India lead with over 1 billion people each."
      } else if (lowerQuery.includes("least") || lowerQuery.includes("smallest")) {
        matchedCountries = countries
          .filter((c) => c.population > 0)
          .sort((a, b) => a.population - b.population)
          .slice(0, 10)
        response = "🏝️ Here are the 10 least populous countries. Many are small island nations with unique cultures!"
      } else if (lowerQuery.includes("million")) {
        const millionMatch = lowerQuery.match(/(\d+)\s*million/)
        const threshold = millionMatch ? Number.parseInt(millionMatch[1]) * 1000000 : 100000000
        matchedCountries = countries.filter((c) => c.population > threshold).sort((a, b) => b.population - a.population)
        response = `📊 Found ${matchedCountries.length} countries with over ${threshold.toLocaleString()} people!`
      }
    }

    // Area queries
    else if (lowerQuery.includes("area") || lowerQuery.includes("size") || lowerQuery.includes("large")) {
      if (lowerQuery.includes("largest") || lowerQuery.includes("biggest")) {
        matchedCountries = countries
          .filter((c) => c.area > 0)
          .sort((a, b) => b.area - a.area)
          .slice(0, 10)
        response =
          "🗺️ Here are the world's largest countries by area! Russia is absolutely massive - it's almost twice the size of Canada!"
      } else if (lowerQuery.includes("smallest")) {
        matchedCountries = countries
          .filter((c) => c.area > 0)
          .sort((a, b) => a.area - b.area)
          .slice(0, 10)
        response = "🏛️ Here are the smallest countries by area. Vatican City could fit into Monaco 5 times!"
      }
    }

    // Language queries
    else if (lowerQuery.includes("language") || lowerQuery.includes("speak")) {
      const languages = [
        "english",
        "spanish",
        "french",
        "arabic",
        "portuguese",
        "russian",
        "chinese",
        "german",
        "italian",
        "japanese",
      ]
      const foundLang = languages.find((lang) => lowerQuery.includes(lang))

      if (foundLang) {
        matchedCountries = countries.filter((c) => {
          if (!c.languages) return false
          const countryLangs = Object.values(c.languages).join(" ").toLowerCase()
          return countryLangs.includes(foundLang)
        })
        response = `🗣️ Found ${matchedCountries.length} countries where ${foundLang.charAt(0).toUpperCase() + foundLang.slice(1)} is spoken! Language connects cultures across continents.`
      }
    }

    // Region queries
    else if (
      lowerQuery.includes("africa") ||
      lowerQuery.includes("asia") ||
      lowerQuery.includes("europe") ||
      lowerQuery.includes("america") ||
      lowerQuery.includes("oceania")
    ) {
      const regions = ["africa", "asia", "europe", "americas", "oceania"]
      const foundRegion = regions.find((region) => lowerQuery.includes(region))

      if (foundRegion) {
        matchedCountries = countries.filter(
          (c) =>
            c.region.toLowerCase().includes(foundRegion) ||
            (foundRegion === "america" && c.region.toLowerCase().includes("americas")),
        )
        response = `🌍 Showing all countries in ${foundRegion.charAt(0).toUpperCase() + foundRegion.slice(1)}! Each region has its own unique character and diversity.`
      }
    }

    // Currency queries
    else if (lowerQuery.includes("currency") || lowerQuery.includes("dollar") || lowerQuery.includes("euro")) {
      const currencies = ["dollar", "euro", "pound", "yen", "yuan", "rupee"]
      const foundCurrency = currencies.find((curr) => lowerQuery.includes(curr))

      if (foundCurrency) {
        matchedCountries = countries.filter((c) => {
          if (!c.currencies) return false
          const currencyNames = Object.values(c.currencies)
            .map((curr) => curr.name.toLowerCase())
            .join(" ")
          return currencyNames.includes(foundCurrency)
        })
        response = `💰 Countries using currencies related to "${foundCurrency}". Money tells the story of trade and history!`
      }
    }

    // Capital queries
    else if (lowerQuery.includes("capital")) {
      if (lowerQuery.includes("largest") || lowerQuery.includes("biggest")) {
        matchedCountries = countries
          .filter((c) => c.capital && c.capital.length > 0)
          .sort((a, b) => b.population - a.population)
          .slice(0, 15)
        response =
          "🏙️ Countries with major capital cities! These capitals are centers of culture, politics, and innovation."
      }
    }

    // Island nations
    else if (lowerQuery.includes("island")) {
      const islandKeywords = ["island", "islands", "archipelago"]
      matchedCountries = countries.filter((c) =>
        islandKeywords.some(
          (keyword) =>
            c.name.common.toLowerCase().includes(keyword) ||
            (c.subregion && c.subregion.toLowerCase().includes(keyword)),
        ),
      )
      response = "🏝️ Beautiful island nations! These countries offer unique cultures shaped by their maritime heritage."
    }

    // Landlocked countries
    else if (lowerQuery.includes("landlocked")) {
      // This is a simplified check - in a real app, you'd have this data
      const landlocked = [
        "Afghanistan",
        "Austria",
        "Belarus",
        "Bolivia",
        "Botswana",
        "Burkina Faso",
        "Burundi",
        "Central African Republic",
        "Chad",
        "Czech Republic",
        "Ethiopia",
        "Hungary",
        "Kazakhstan",
        "Kyrgyzstan",
        "Laos",
        "Luxembourg",
        "Mali",
        "Moldova",
        "Mongolia",
        "Nepal",
        "Niger",
        "Paraguay",
        "Rwanda",
        "Serbia",
        "Slovakia",
        "South Sudan",
        "Switzerland",
        "Tajikistan",
        "Turkmenistan",
        "Uganda",
        "Uzbekistan",
        "Zambia",
        "Zimbabwe",
      ]
      matchedCountries = countries.filter((c) => landlocked.includes(c.name.common))
      response = "🏔️ Landlocked countries - no direct access to the ocean, but rich in land-based resources and culture!"
    }

    // Default search
    else {
      matchedCountries = countries.filter(
        (c) =>
          c.name.common.toLowerCase().includes(lowerQuery) ||
          c.name.official.toLowerCase().includes(lowerQuery) ||
          (c.capital && c.capital.some((cap) => cap.toLowerCase().includes(lowerQuery))) ||
          c.region.toLowerCase().includes(lowerQuery) ||
          (c.subregion && c.subregion.toLowerCase().includes(lowerQuery)),
      )

      if (matchedCountries.length > 0) {
        response = `🔍 Found ${matchedCountries.length} countries matching "${query}". Click on any country to explore more!`
      } else {
        response = `🤔 I couldn't find countries matching "${query}". Try asking about population, area, languages, regions, or specific country names. For example: "Show me European countries" or "Countries with over 50 million people"`
      }
    }

    return { response, matchedCountries }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    // Track the AI search
    trackSearch(input.trim(), 0)

    try {
      const { response, matchedCountries } = await processAIQuery(input.trim())

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: response,
        timestamp: new Date(),
        countries: matchedCountries,
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: "🚫 Sorry, I encountered an error processing your request. Please try again!",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    }

    setInput("")
    setIsLoading(false)
  }

  const suggestedQueries = [
    "Show me the most populous countries",
    "Which countries speak Spanish?",
    "Largest countries by area",
    "Countries in Europe",
    "Island nations",
    "Countries using Euro currency",
  ]

  return (
    <>
      {/* AI Assistant Toggle Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-4 z-40 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-full w-14 h-14"
        size="icon"
      >
        <Sparkles className="w-6 h-6" />
      </Button>

      {/* AI Assistant Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-4">
          <Card className="w-full max-w-4xl h-[80vh] sm:h-[600px] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white">AI Country Assistant</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Powered by advanced AI</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                ✕
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex gap-3 ${message.type === "user" ? "justify-end" : ""}`}>
                  {message.type === "ai" && (
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}

                  <div className={`max-w-[80%] ${message.type === "user" ? "order-first" : ""}`}>
                    <div
                      className={`p-3 rounded-lg ${
                        message.type === "user"
                          ? "bg-blue-500 text-white ml-auto"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white"
                      }`}
                    >
                      {message.content}
                    </div>

                    {/* Country Results */}
                    {message.countries && message.countries.length > 0 && (
                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {message.countries.slice(0, 8).map((country) => (
                          <button
                            key={country.cca3}
                            onClick={() => {
                              onSelectCountry(country.cca3)
                              setIsOpen(false)
                            }}
                            className="flex items-center gap-2 p-2 bg-white dark:bg-gray-800 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                          >
                            <img
                              src={country.flags?.svg || "/placeholder.svg"}
                              alt={`Flag of ${country.name.common}`}
                              className="w-6 h-4 object-cover rounded"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm text-gray-800 dark:text-white truncate">
                                {country.name.common}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {country.population
                                  ? `${(country.population / 1000000).toFixed(1)}M people`
                                  : country.region}
                              </div>
                            </div>
                          </button>
                        ))}
                        {message.countries.length > 8 && (
                          <div className="col-span-full text-center text-sm text-gray-500 dark:text-gray-400 py-2">
                            +{message.countries.length - 8} more countries
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {message.type === "user" && (
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Queries */}
            {messages.length === 1 && (
              <div className="p-4 border-t bg-gray-50 dark:bg-gray-800">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Try asking:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedQueries.map((query, index) => (
                    <button
                      key={index}
                      onClick={() => setInput(query)}
                      className="text-xs bg-white dark:bg-gray-700 border rounded-full px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    >
                      {query}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything about countries..."
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={startVoiceRecognition}
                  disabled={isLoading}
                  className={isListening ? "bg-red-100 border-red-300" : ""}
                >
                  {isListening ? <MicOff className="w-4 h-4 text-red-600" /> : <Mic className="w-4 h-4" />}
                </Button>
                <Button type="submit" disabled={isLoading || !input.trim()}>
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </>
  )
}
