"use client"

import { Facebook, Instagram, MessageCircle, Linkedin, Mail, Globe, Info, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function Footer() {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    { icon: Facebook, href: "https://www.facebook.com/beepennn", label: "Facebook" },
    { icon: Instagram, href: "https://www.instagram.com/beepennn", label: "Instagram" },
    { icon: MessageCircle, href: "https://api.whatsapp.com/send/?phone=9845405099", label: "WhatsApp" },
    { icon: Linkedin, href: "https://www.linkedin.com/in/bipin-lamsal-3a8718315/", label: "LinkedIn" },
  ]

  const navigationLinks = [
    { label: "About", href: "/about", icon: Info },
    { label: "Help", href: "/help", icon: HelpCircle },
    { label: "API", href: "/api-info", icon: Globe },
  ]

  return (
    <footer className="mt-auto bg-slate-800 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Social Media Section */}
          <div className="lg:col-span-1">
            <h3 className="text-white font-semibold mb-4">Follow Us</h3>
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-10 h-10 bg-slate-700 dark:bg-slate-800 rounded-full flex items-center justify-center text-white hover:bg-slate-600 dark:hover:bg-slate-700 transition-colors"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Section */}
          <div className="lg:col-span-1">
            <h3 className="text-white font-semibold mb-4">Navigation</h3>
            <div className="space-y-2">
              {navigationLinks.map((link, index) => (
                <div key={index}>
                  <Link
                    href={link.href}
                    className="text-slate-300 hover:text-white transition-colors text-sm flex items-center gap-2"
                  >
                    <link.icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Section */}
          <div className="lg:col-span-1">
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <Button
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => window.open("mailto:contact@countriesexplorer.com", "_blank")}
            >
              <Mail className="w-4 h-4 mr-2" />
              Contact Us
            </Button>
          </div>

          {/* Legal Section */}
          <div className="lg:col-span-1">
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <div className="space-y-2">
              <div>
                <Link href="/terms" className="text-slate-300 hover:text-white transition-colors text-sm">
                  Terms & Conditions
                </Link>
              </div>
              <div>
                <Link href="/privacy" className="text-slate-300 hover:text-white transition-colors text-sm">
                  Privacy Policy
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom - Copyright */}
        <div className="border-t border-slate-700 pt-6">
          <div className="text-center text-slate-400 text-sm">
            © {currentYear} Countries Explorer. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}
