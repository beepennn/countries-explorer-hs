import { ArrowLeft, Search, Globe, Smartphone, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Help & FAQ</h1>

          <div className="prose dark:prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Getting Started</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Countries Explorer is designed to be intuitive and easy to use. Here's how to get the most out of the
                application:
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Frequently Asked Questions</h2>

              <div className="space-y-6">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                    How do I search for a country?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Use the search bar at the top of the page. Start typing the first letter of a country name, and
                    you'll see a dropdown with matching countries. You can click on any country from the dropdown or
                    continue typing to filter results.
                  </p>
                </div>

                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                    How do I view detailed information about a country?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Click on any country name from the list on the left side of the screen. The detailed information
                    will appear on the right side, showing the country's flag, capital, population, area, languages,
                    currencies, and more.
                  </p>
                </div>

                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                    Can I share a link to a specific country?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Yes! When you select a country, the URL automatically updates to include that country. You can copy
                    and share this URL, and it will take others directly to that country's information.
                  </p>
                </div>

                <div className="border-l-4 border-orange-500 pl-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                    How do I switch between dark and light mode?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Click the theme toggle button in the top-right corner of the header. You can choose between Light,
                    Dark, or System (which follows your device's theme preference).
                  </p>
                </div>

                <div className="border-l-4 border-red-500 pl-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                    Why does Nepal's flag look different?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Nepal has the world's only non-rectangular national flag - it's triangular! Our application
                    specially handles Nepal's flag to display its unique shape properly, unlike other countries which
                    have rectangular flags.
                  </p>
                </div>

                <div className="border-l-4 border-teal-500 pl-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                    How many countries are included?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Countries Explorer includes information about all 195 sovereign countries recognized by the United
                    Nations, plus some territories and dependencies, totaling around 250 entries.
                  </p>
                </div>

                <div className="border-l-4 border-pink-500 pl-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                    Is the country information up to date?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    We use the REST Countries API, which is regularly updated. However, country information can change
                    over time. For the most critical or recent information, we recommend verifying with official
                    government sources.
                  </p>
                </div>

                <div className="border-l-4 border-indigo-500 pl-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                    Can I use this application offline?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Currently, Countries Explorer requires an internet connection to fetch country data from the API.
                    Offline functionality may be added in future updates.
                  </p>
                </div>

                <div className="border-l-4 border-yellow-500 pl-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                    Is Countries Explorer free to use?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Yes! Countries Explorer is completely free to use. There are no subscriptions, premium features, or
                    hidden costs.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Features Guide</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Search className="w-5 h-5 text-blue-500" />
                    <h3 className="font-semibold text-gray-800 dark:text-white">Smart Search</h3>
                  </div>
                  <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                    <li>• Type first letters to see matching countries</li>
                    <li>• Click dropdown suggestions for quick selection</li>
                    <li>• Real-time filtering as you type</li>
                  </ul>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Globe className="w-5 h-5 text-green-500" />
                    <h3 className="font-semibold text-gray-800 dark:text-white">Country Details</h3>
                  </div>
                  <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                    <li>• View flag, capital, and basic info</li>
                    <li>• See population and area statistics</li>
                    <li>• Explore languages and currencies</li>
                    <li>• Access Google Maps links</li>
                  </ul>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Smartphone className="w-5 h-5 text-purple-500" />
                    <h3 className="font-semibold text-gray-800 dark:text-white">Navigation</h3>
                  </div>
                  <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                    <li>• Use pagination to browse countries</li>
                    <li>• Click Home button to reset view</li>
                    <li>• Share direct links to countries</li>
                  </ul>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <HelpCircle className="w-5 h-5 text-orange-500" />
                    <h3 className="font-semibold text-gray-800 dark:text-white">Customization</h3>
                  </div>
                  <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                    <li>• Switch between light/dark themes</li>
                    <li>• Responsive design for all devices</li>
                    <li>• Automatic theme based on system</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Troubleshooting</h2>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Countries not loading?</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Check your internet connection and try refreshing the page. If the problem persists, the API might
                    be temporarily unavailable.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Search not working?</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Make sure you're typing the first letters of the country name. Try clearing the search and starting
                    over.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Page looks broken?</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Try clearing your browser cache and cookies, or try using a different browser. Make sure JavaScript
                    is enabled.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Still Need Help?</h2>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  If you couldn't find the answer to your question, feel free to contact us:
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  <strong>Email:</strong> notesbybipin@gmail.com
                </p>
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
                  We typically respond within 24-48 hours.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
