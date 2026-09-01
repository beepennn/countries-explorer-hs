"use client"

import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  Globe,
  Info,
  HelpCircle,
  Github,
  Twitter,
  Shield,
  Zap,
  Heart,
  Star,
  Award,
  Users,
  TrendingUp,
  BookOpen,
  Smartphone,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export function Footer() {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    { icon: Facebook, href: "https://www.facebook.com/beepennn", label: "Facebook", color: "hover:text-blue-600" },
    { icon: Instagram, href: "https://www.instagram.com/beepennn", label: "Instagram", color: "hover:text-pink-600" },
    { icon: Twitter, href: "https://twitter.com/beepennn", label: "Twitter", color: "hover:text-blue-400" },
    {
      icon: Linkedin,
      href: "https://www.linkedin.com/in/bipin-lamsal-3a8718315/",
      label: "LinkedIn",
      color: "hover:text-blue-700",
    },
    {
      icon: Github,
      href: "https://github.com/beepennn",
      label: "GitHub",
      color: "hover:text-gray-800 dark:hover:text-gray-400",
    },
  ]

  const navigationLinks = [
    { label: "About Us", href: "/about", icon: Info, desc: "Learn about our mission" },
    { label: "Help Center", href: "/help", icon: HelpCircle, desc: "Get support and answers" },
    { label: "API Documentation", href: "/api-info", icon: Globe, desc: "Developer resources" },
    { label: "Privacy Policy", href: "/privacy", icon: Shield, desc: "Your data protection" },
    { label: "Terms of Service", href: "/terms", icon: BookOpen, desc: "Usage guidelines" },
  ]

  const features = [
    { icon: Zap, title: "Lightning Fast", desc: "Instant search results" },
    { icon: Heart, title: "User Friendly", desc: "Intuitive interface" },
    { icon: Shield, title: "Privacy First", desc: "Your data is secure" },
    { icon: Smartphone, title: "Mobile Ready", desc: "Perfect on any device" },
  ]

  const stats = [
    { icon: Globe, label: "Countries", value: "195+", color: "text-blue-500" },
    { icon: Users, label: "Monthly Users", value: "1K+", color: "text-green-500" },
    { icon: Star, label: "User Rating", value: "4.58/5", color: "text-yellow-500" },
  ]

  return (
    <footer className="relative mt-auto bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative container mx-auto px-4 py-16">
        {/* Top Section - Brand Only */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Countries Explorer</h2>
              <p className="text-gray-300 text-sm">Discover the World</p>
            </div>
          </div>

          <p className="text-gray-200 text-lg mb-8 max-w-2xl mx-auto">
            Explore amazing facts about countries worldwide and discover the fascinating diversity of our world.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-white/10 border-white/10 hover-lift backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <stat.icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-300">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-12">
          {/* Navigation Links */}
          <div className="lg:col-span-1">
            <h3 className="text-white font-semibold mb-6 text-lg">Quick Links</h3>
            <div className="space-y-3">
              {navigationLinks.map((link, index) => (
                <div key={index}>
                  <Link
                    href={link.href}
                    className="group flex items-start gap-3 text-gray-200 hover:text-white transition-colors"
                  >
                    <link.icon className="w-4 h-4 mt-0.5 text-blue-400 group-hover:text-blue-300 flex-shrink-0" />
                    <div>
                      <div className="text-sm font-medium">{link.label}</div>
                      <div className="text-xs text-gray-400">{link.desc}</div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="lg:col-span-1">
            <h3 className="text-white font-semibold mb-6 text-lg">Why Choose Us</h3>
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-white text-sm font-medium">{feature.title}</h4>
                    <p className="text-gray-300 text-xs">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Social Links */}
          <div className="lg:col-span-1">
            <h3 className="text-white font-semibold mb-6 text-lg">Connect With Us</h3>

            {/* Social Links - Removed YouTube */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className={`w-12 h-12 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center text-white transition-all duration-300 hover:scale-110 ${social.color}`}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>

            <p className="text-gray-300 text-sm">
              Follow us on social media for the latest updates, country facts, and community discussions.
            </p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <p className="text-gray-300 text-sm">© {currentYear} Countries Explorer. All rights reserved.</p>
              <div className="flex items-center gap-4">
                <Badge variant="secondary" className="bg-white/10 border-white/20 text-white">
                  <Heart className="w-3 h-3 mr-1 text-red-400" />
                  Made with Love
                </Badge>
                <Badge variant="secondary" className="bg-white/10 border-white/20 text-white">
                  <TrendingUp className="w-3 h-3 mr-1 text-green-400" />
                  Always Improving
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-300 hover:text-white"
                onClick={() => window.open("mailto:contact@countriesexplorer.com", "_blank")}
              >
                <Mail className="w-4 h-4 mr-2" />
                Contact Us
              </Button>

              <div className="flex items-center gap-2 text-gray-300 text-sm">
                <Globe className="w-4 h-4" />
                <span>Global Service</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
