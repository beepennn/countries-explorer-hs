import { ArrowLeft, Globe, Users, Search, Smartphone } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AboutPage() {
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
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">About Countries Explorer</h1>

          <div className="prose dark:prose-invert max-w-none">
            <section className="mb-8">
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                Countries Explorer is a modern web application designed to help you discover and learn about countries
                around the world. Built with cutting-edge technology, it provides comprehensive information about all
                nations in an intuitive and user-friendly interface.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <Globe className="w-6 h-6 text-blue-500 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white">Comprehensive Data</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Access detailed information about 250+ countries including population, area, languages,
                      currencies, and more.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Search className="w-6 h-6 text-green-500 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white">Smart Search</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Find countries quickly with our intelligent search and autocomplete functionality.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Smartphone className="w-6 h-6 text-purple-500 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white">Responsive Design</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Optimized for all devices - desktop, tablet, and mobile with dark/light mode support.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="w-6 h-6 text-orange-500 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white">User Friendly</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Intuitive interface with pagination, filtering, and direct country linking.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Technology Stack</h2>
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="font-semibold text-gray-800 dark:text-white">Frontend</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Next.js 14, React, TypeScript</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-gray-800 dark:text-white">Styling</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Tailwind CSS, shadcn/ui</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-gray-800 dark:text-white">Data Source</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">REST Countries API</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-gray-800 dark:text-white">Icons</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Lucide React</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-gray-800 dark:text-white">Themes</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">next-themes</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-gray-800 dark:text-white">Deployment</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Vercel</div>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Data Source</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Countries Explorer uses the{" "}
                <a
                  href="https://restcountries.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  REST Countries API
                </a>
                , a reliable and comprehensive source for country information. This API provides up-to-date data about
                countries worldwide, including:
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-4 space-y-1">
                <li>Official and common country names</li>
                <li>Capital cities and regions</li>
                <li>Population and area statistics</li>
                <li>Languages and currencies</li>
                <li>Country flags and maps</li>
                <li>Geographic and political information</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Open Source</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Countries Explorer is an open-source project built as a demonstration of modern web development
                practices. The source code is available on GitHub, and contributions are welcome from the developer
                community.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Contact & Support</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Have questions, suggestions, or found a bug? We'd love to hear from you!
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <p className="text-gray-600 dark:text-gray-300">
                  <strong>Email:</strong> notesbybipin@gmail.com
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
