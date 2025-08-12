import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function TermsPage() {
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
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Terms & Conditions</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Last updated: January 2025</p>

          <div className="prose dark:prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                By accessing and using Countries Explorer ("the Service"), you accept and agree to be bound by the terms
                and provision of this agreement. If you do not agree to abide by the above, please do not use this
                service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">2. Description of Service</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Countries Explorer is a web application that provides information about countries around the world. The
                service fetches data from the REST Countries API and presents it in a user-friendly interface.
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-4 space-y-2">
                <li>Browse and search country information</li>
                <li>View detailed country data including population, area, languages, and currencies</li>
                <li>Access country flags and maps</li>
                <li>Use pagination and filtering features</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">3. User Responsibilities</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Users of Countries Explorer agree to:</p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-4 space-y-2">
                <li>Use the service for lawful purposes only</li>
                <li>Not attempt to disrupt or interfere with the service</li>
                <li>Not use automated tools to access the service excessively</li>
                <li>Respect the intellectual property rights of the service and third parties</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">4. Data Sources and Accuracy</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                The information provided by Countries Explorer is sourced from the REST Countries API and other public
                data sources. While we strive to provide accurate and up-to-date information:
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-4 space-y-2">
                <li>We do not guarantee the accuracy, completeness, or timeliness of the information</li>
                <li>Country data may change over time and updates may not be immediate</li>
                <li>Users should verify critical information from official sources</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">5. Intellectual Property</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                The Countries Explorer application, including its design, code, and user interface, is protected by
                copyright and other intellectual property laws. Country data and flags are sourced from public APIs and
                databases.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">6. Limitation of Liability</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Countries Explorer and its operators shall not be liable for any direct, indirect, incidental, special,
                or consequential damages resulting from the use or inability to use the service, even if we have been
                advised of the possibility of such damages.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">7. Service Availability</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                We strive to maintain the service's availability but do not guarantee uninterrupted access. The service
                may be temporarily unavailable due to maintenance, updates, or technical issues.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">8. Changes to Terms</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                We reserve the right to modify these terms at any time. Changes will be effective immediately upon
                posting. Your continued use of the service after changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">9. Contact Information</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                If you have any questions about these Terms & Conditions, please contact us at:
              </p>
              <p className="text-gray-600 dark:text-gray-300">Email: notesbybipin@gmail.com</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
