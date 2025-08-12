import { ArrowLeft, Shield, Eye, Target, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function CookiePolicyPage() {
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
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Cookie Policy</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Last updated: January 2025</p>

          <div className="prose dark:prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">What are cookies?</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Cookies are small text files that are placed on your computer or mobile device when you visit a website.
                They are widely used to make websites work more efficiently and provide information to website owners.
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Countries Explorer uses cookies to enhance your browsing experience, analyze site usage, and provide
                personalized content. This Cookie Policy explains what cookies we use and why.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Types of cookies we use</h2>

              <div className="space-y-6">
                <div className="border-l-4 border-green-500 pl-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="w-5 h-5 text-green-500" />
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Necessary Cookies</h3>
                    <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                      Always Active
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-3">
                    These cookies are essential for the website to function properly. They cannot be disabled as they
                    are necessary for basic website functionality.
                  </p>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-800 dark:text-white mb-2">What they do:</h4>
                    <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                      <li>• Enable page navigation and access to secure areas</li>
                      <li>• Remember your theme preference (dark/light mode)</li>
                      <li>• Maintain your session and security settings</li>
                      <li>• Store your cookie consent preferences</li>
                    </ul>
                    <h4 className="font-medium text-gray-800 dark:text-white mb-2 mt-3">Examples:</h4>
                    <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                      <li>
                        • <code>theme-preference</code> - Stores your dark/light mode choice
                      </li>
                      <li>
                        • <code>cookie-consent</code> - Remembers your cookie preferences
                      </li>
                      <li>
                        • <code>session-id</code> - Maintains your browsing session
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="border-l-4 border-blue-500 pl-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Eye className="w-5 h-5 text-blue-500" />
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Analytics Cookies</h3>
                    <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                      Optional
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-3">
                    These cookies help us understand how visitors interact with our website by collecting and reporting
                    information anonymously.
                  </p>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-800 dark:text-white mb-2">What they do:</h4>
                    <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                      <li>• Count website visits and traffic sources</li>
                      <li>• Measure how users navigate through the site</li>
                      <li>• Identify popular content and features</li>
                      <li>• Help us improve website performance</li>
                    </ul>
                    <h4 className="font-medium text-gray-800 dark:text-white mb-2 mt-3">Examples:</h4>
                    <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                      <li>
                        • <code>_ga</code> - Google Analytics visitor identification
                      </li>
                      <li>
                        • <code>_gid</code> - Google Analytics session identification
                      </li>
                      <li>
                        • <code>_gat</code> - Google Analytics throttling
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="border-l-4 border-purple-500 pl-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="w-5 h-5 text-purple-500" />
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Marketing Cookies</h3>
                    <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded">
                      Optional
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-3">
                    These cookies are used to track visitors across websites to display relevant advertisements and
                    measure marketing campaign effectiveness.
                  </p>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-800 dark:text-white mb-2">What they do:</h4>
                    <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                      <li>• Track your interests for personalized ads</li>
                      <li>• Measure advertising campaign performance</li>
                      <li>• Enable social media sharing features</li>
                      <li>• Prevent showing the same ad repeatedly</li>
                    </ul>
                    <h4 className="font-medium text-gray-800 dark:text-white mb-2 mt-3">Examples:</h4>
                    <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                      <li>
                        • <code>fb_pixel</code> - Facebook advertising pixel
                      </li>
                      <li>
                        • <code>google_ads</code> - Google Ads conversion tracking
                      </li>
                      <li>
                        • <code>linkedin_insight</code> - LinkedIn marketing analytics
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="border-l-4 border-orange-500 pl-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Settings className="w-5 h-5 text-orange-500" />
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Preference Cookies</h3>
                    <span className="text-xs bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 px-2 py-1 rounded">
                      Optional
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-3">
                    These cookies allow the website to remember choices you make and provide enhanced, personalized
                    features.
                  </p>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-800 dark:text-white mb-2">What they do:</h4>
                    <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                      <li>• Remember your language and region preferences</li>
                      <li>• Store your search history and favorites</li>
                      <li>• Customize content based on your interests</li>
                      <li>• Remember your display preferences</li>
                    </ul>
                    <h4 className="font-medium text-gray-800 dark:text-white mb-2 mt-3">Examples:</h4>
                    <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                      <li>
                        • <code>user-language</code> - Your preferred language
                      </li>
                      <li>
                        • <code>search-history</code> - Recent country searches
                      </li>
                      <li>
                        • <code>display-preferences</code> - Layout and view settings
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Third-party cookies</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Some cookies on our website are set by third-party services. We use these services to enhance
                functionality and analyze website performance:
              </p>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Third-party services we use:</h3>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                  <li>
                    • <strong>Google Analytics:</strong> Website analytics and performance monitoring
                  </li>
                  <li>
                    • <strong>Vercel Analytics:</strong> Hosting platform analytics and performance metrics
                  </li>
                  <li>
                    • <strong>Social Media Platforms:</strong> Social sharing and engagement features
                  </li>
                </ul>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                  These third-party services have their own privacy policies and cookie practices. We recommend
                  reviewing their policies for more information.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                Managing your cookie preferences
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                You have several options for managing cookies on Countries Explorer:
              </p>

              <div className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Cookie Consent Banner</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    When you first visit our website, you'll see a cookie consent banner. You can choose to accept all
                    cookies, accept only necessary cookies, or customize your preferences.
                  </p>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Browser Settings</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    You can control cookies through your browser settings:
                  </p>
                  <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                    <li>• Block all cookies</li>
                    <li>• Block third-party cookies only</li>
                    <li>• Delete existing cookies</li>
                    <li>• Set cookies to expire when you close your browser</li>
                  </ul>
                </div>

                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Opt-out Links</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    You can opt out of specific tracking services:
                  </p>
                  <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                    <li>
                      •{" "}
                      <a
                        href="https://tools.google.com/dlpage/gaoptout"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        Google Analytics Opt-out
                      </a>
                    </li>
                    <li>
                      •{" "}
                      <a
                        href="https://www.facebook.com/help/568137493302217"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        Facebook Pixel Opt-out
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Cookie retention</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Different cookies have different retention periods:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-200 dark:border-gray-600">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700">
                      <th className="border border-gray-200 dark:border-gray-600 px-4 py-2 text-left">Cookie Type</th>
                      <th className="border border-gray-200 dark:border-gray-600 px-4 py-2 text-left">
                        Retention Period
                      </th>
                      <th className="border border-gray-200 dark:border-gray-600 px-4 py-2 text-left">Purpose</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-200 dark:border-gray-600 px-4 py-2">Session Cookies</td>
                      <td className="border border-gray-200 dark:border-gray-600 px-4 py-2">Until browser closes</td>
                      <td className="border border-gray-200 dark:border-gray-600 px-4 py-2">Maintain session state</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 dark:border-gray-600 px-4 py-2">Preference Cookies</td>
                      <td className="border border-gray-200 dark:border-gray-600 px-4 py-2">1 year</td>
                      <td className="border border-gray-200 dark:border-gray-600 px-4 py-2">
                        Remember user preferences
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 dark:border-gray-600 px-4 py-2">Analytics Cookies</td>
                      <td className="border border-gray-200 dark:border-gray-600 px-4 py-2">2 years</td>
                      <td className="border border-gray-200 dark:border-gray-600 px-4 py-2">Website analytics</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 dark:border-gray-600 px-4 py-2">Marketing Cookies</td>
                      <td className="border border-gray-200 dark:border-gray-600 px-4 py-2">30-90 days</td>
                      <td className="border border-gray-200 dark:border-gray-600 px-4 py-2">
                        Advertising and marketing
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Impact of disabling cookies</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Disabling certain cookies may affect your experience on Countries Explorer:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
                    If you disable necessary cookies:
                  </h3>
                  <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                    <li>• Website may not function properly</li>
                    <li>• Theme preferences won't be saved</li>
                    <li>• Security features may be compromised</li>
                  </ul>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-2">If you disable optional cookies:</h3>
                  <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                    <li>• Less personalized experience</li>
                    <li>• No usage analytics for improvements</li>
                    <li>• Generic advertising (if any)</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Updates to this policy</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                We may update this Cookie Policy from time to time to reflect changes in our practices or for legal
                reasons. When we make changes, we will update the "Last updated" date at the top of this policy.
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                We encourage you to review this policy periodically to stay informed about how we use cookies.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Contact us</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                If you have any questions about our use of cookies or this Cookie Policy, please contact us:
              </p>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <p className="text-gray-600 dark:text-gray-300">
                  <strong>Email:</strong> notesbybipin@gmail.com
                </p>
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
                  We will respond to your inquiry within 48 hours.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
