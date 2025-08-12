"use client"

import { ArrowLeft, ExternalLink, Code, Database } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ApiInfoPage() {
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
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">API Information</h1>

          <div className="prose dark:prose-invert max-w-none">
            <section className="mb-8">
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                Countries Explorer is powered by the REST Countries API, a free and reliable source for country
                information. Learn more about the API and how to use it in your own projects.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">About REST Countries API</h2>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <Database className="w-5 h-5 text-blue-500" />
                  <h3 className="font-semibold text-gray-800 dark:text-white">REST Countries</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-3">
                  A free API providing detailed information about countries worldwide. No authentication required,
                  making it perfect for educational projects and applications.
                </p>
                <a
                  href="https://restcountries.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-500 hover:underline"
                >
                  Visit REST Countries API <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">API Endpoints Used</h2>
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Code className="w-4 h-4 text-green-500" />
                    <span className="font-mono text-sm bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">GET</span>
                  </div>
                  <code className="text-sm text-gray-800 dark:text-gray-200 block mb-2">
                    https://restcountries.com/v3.1/all?fields=name,cca3,region,subregion,capital,population,area,languages,currencies,flags
                  </code>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Fetches all countries with specific fields for the main country list.
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Code className="w-4 h-4 text-green-500" />
                    <span className="font-mono text-sm bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">GET</span>
                  </div>
                  <code className="text-sm text-gray-800 dark:text-gray-200 block mb-2">
                    https://restcountries.com/v3.1/alpha/{"{code}"}
                    ?fields=name,cca3,capital,region,subregion,population,area,languages,currencies,flags,maps
                  </code>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Fetches detailed information for a specific country by its 3-letter code.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Data Fields</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-800 dark:text-white">Basic Information</h3>
                  <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                    <li>
                      • <strong>name:</strong> Common and official names
                    </li>
                    <li>
                      • <strong>cca3:</strong> 3-letter country code
                    </li>
                    <li>
                      • <strong>capital:</strong> Capital city/cities
                    </li>
                    <li>
                      • <strong>region:</strong> Geographic region
                    </li>
                    <li>
                      • <strong>subregion:</strong> Geographic subregion
                    </li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-800 dark:text-white">Detailed Data</h3>
                  <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                    <li>
                      • <strong>population:</strong> Current population
                    </li>
                    <li>
                      • <strong>area:</strong> Total area in km²
                    </li>
                    <li>
                      • <strong>languages:</strong> Official languages
                    </li>
                    <li>
                      • <strong>currencies:</strong> Used currencies
                    </li>
                    <li>
                      • <strong>flags:</strong> Flag images (SVG/PNG)
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Example Response</h2>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                <pre className="text-sm">
                  {`{
  "name": {
    "common": "Nepal",
    "official": "Federal Democratic Republic of Nepal"
  },
  "cca3": "NPL",
  "capital": ["Kathmandu"],
  "region": "Asia",
  "subregion": "Southern Asia",
  "population": 29136808,
  "area": 147181,
  "languages": {
    "nep": "Nepali"
  },
  "currencies": {
    "NPR": {
      "name": "Nepalese rupee",
      "symbol": "₨"
    }
  },
  "flags": {
    "png": "https://flagcdn.com/w320/np.png",
    "svg": "https://flagcdn.com/np.svg",
    "alt": "The flag of Nepal is..."
  }
}`}
                </pre>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Rate Limits & Usage</h2>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Fair Usage Policy</h3>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• No authentication required</li>
                  <li>• Free for personal and commercial use</li>
                  <li>• Please don't abuse the service</li>
                  <li>• Consider caching responses for better performance</li>
                  <li>• No official rate limits, but be respectful</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
                Using the API in Your Projects
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-2">JavaScript/Fetch Example</h3>
                  <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                    <pre className="text-sm">
                      {`// Fetch all countries
const response = await fetch('https://restcountries.com/v3.1/all');
const countries = await response.json();

// Fetch specific country
const country = await fetch('https://restcountries.com/v3.1/alpha/NPL');
const nepal = await country.json();`}
                    </pre>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-2">React Hook Example</h3>
                  <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                    <pre className="text-sm">
                      {`const useCountries = () => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://restcountries.com/v3.1/all')
      .then(res => res.json())
      .then(data => {
        setCountries(data);
        setLoading(false);
      });
  }, []);

  return { countries, loading };
};`}
                    </pre>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Alternative APIs</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-gray-200 dark:border-gray-600 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-2">World Bank API</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    Economic and development data for countries.
                  </p>
                  <a
                    href="https://datahelpdesk.worldbank.org/knowledgebase/articles/889392"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline text-sm"
                  >
                    Learn more →
                  </a>
                </div>
                <div className="border border-gray-200 dark:border-gray-600 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Country.io</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    Simple API for country codes and basic information.
                  </p>
                  <a
                    href="http://country.io/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline text-sm"
                  >
                    Learn more →
                  </a>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Support the API</h2>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <p className="text-gray-600 dark:text-gray-300 mb-3">
                  REST Countries API is a free service maintained by volunteers. Consider supporting them:
                </p>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Star their GitHub repository</li>
                  <li>• Share the API with other developers</li>
                  <li>• Report issues and contribute improvements</li>
                  <li>• Consider donating to support hosting costs</li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
