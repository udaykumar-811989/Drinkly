import Link from 'next/link'
import Image from 'next/image'
import {
  Search,
  ChevronRight,
  Shield,
  Clock,
  CreditCard,
  MapPin,
  Phone,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
} from 'lucide-react'

const categories = [
  { id: 1, name: 'Beer', image: '/categories/beer.jpg', productCount: 120 },
  { id: 2, name: 'Wine', image: '/categories/wine.jpg', productCount: 85 },
  { id: 3, name: 'Spirits', image: '/categories/spirits.jpg', productCount: 95 },
  { id: 4, name: 'Whiskey', image: '/categories/whiskey.jpg', productCount: 60 },
  { id: 5, name: 'Vodka', image: '/categories/vodka.jpg', productCount: 40 },
  { id: 6, name: 'Rum', image: '/categories/rum.jpg', productCount: 35 },
  { id: 7, name: 'Gin', image: '/categories/gin.jpg', productCount: 30 },
  { id: 8, name: 'Ready to Drink', image: '/categories/rtd.jpg', productCount: 55 },
]

const featuredStores = [
  {
    id: 1,
    name: 'Premium Liquors',
    image: '/stores/premium.jpg',
    rating: 4.8,
    deliveryTime: '30-45 min',
    licenseNumber: 'LIC-2024-001',
  },
  {
    id: 2,
    name: 'City Wine Shop',
    image: '/stores/citywine.jpg',
    rating: 4.6,
    deliveryTime: '25-40 min',
    licenseNumber: 'LIC-2024-002',
  },
  {
    id: 3,
    name: 'The Beer Hub',
    image: '/stores/beerhub.jpg',
    rating: 4.7,
    deliveryTime: '20-35 min',
    licenseNumber: 'LIC-2024-003',
  },
]

const faqs = [
  {
    question: 'What is Drinkly?',
    answer:
      'Drinkly is a platform that connects you with licensed alcohol retailers in your area. We facilitate the ordering process while ensuring all transactions comply with local alcohol delivery laws.',
  },
  {
    question: 'How does age verification work?',
    answer:
      'All users must verify their age during registration. Delivery agents will verify your government-issued ID upon delivery. We take age verification seriously to ensure responsible service.',
  },
  {
    question: 'What are the delivery hours?',
    answer:
      'Delivery hours depend on local regulations and store operating hours. Typically, alcohol delivery is available between 10:00 AM and 10:00 PM, subject to local laws.',
  },
  {
    question: 'Can I return alcohol?',
    answer:
      'Due to the nature of the product, returns are generally not accepted unless the product is defective or incorrect. Please contact support for any issues with your order.',
  },
  {
    question: 'What payment methods are accepted?',
    answer:
      'We accept credit/debit cards, UPI, net banking, and select digital wallets. All payments are processed through secure, PCI-compliant payment gateways.',
  },
]

const howItWorks = [
  {
    step: 1,
    title: 'Browse',
    description:
      'Explore products from licensed retailers in your area. Filter by category, brand, or price.',
    icon: Search,
  },
  {
    step: 2,
    title: 'Order',
    description:
      'Add items to your cart, choose delivery time, and complete secure checkout.',
    icon: CreditCard,
  },
  {
    step: 3,
    title: 'Track',
    description:
      'Track your order in real-time. Our delivery agent will verify your ID upon delivery.',
    icon: MapPin,
  },
]

const whyDrinkly = [
  {
    icon: Shield,
    title: 'Licensed Retailers',
    description: 'All our partner stores are fully licensed and verified.',
  },
  {
    icon: CheckCircle2,
    title: 'Safe & Responsible Ordering',
    description: 'We promote responsible drinking and comply with all regulations.',
  },
  {
    icon: Clock,
    title: 'Age Verification',
    description: 'Mandatory age verification at registration and delivery.',
  },
  {
    icon: CreditCard,
    title: 'Secure Payments',
    description: 'PCI-compliant payment processing for your safety.',
  },
  {
    icon: MapPin,
    title: 'Delivery Tracking',
    description: 'Real-time tracking from store to your doorstep.',
  },
]

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/hero-pattern.svg')] opacity-10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight mb-6">
              Your drinks. Your choice.{' '}
              <span className="text-blue-300">Delivered responsibly.</span>
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl">
              Order from licensed retailers with age-verified delivery. Because
              responsible drinking starts with responsible ordering.
            </p>
            <Link
              href="/home"
              className="inline-flex items-center gap-2 bg-white text-blue-900 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-colors shadow-lg"
            >
              Check Availability
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white dark:from-neutral-950" />
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24 bg-white dark:bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              Three simple steps to get your favorite drinks delivered to your
              doorstep.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((item) => (
              <div
                key={item.step}
                className="relative p-8 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-6">
                  <item.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="absolute top-6 right-6 text-6xl font-bold text-neutral-100 dark:text-neutral-800">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-neutral-600 dark:text-neutral-400">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 md:py-24 bg-neutral-50 dark:bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">
                Featured Categories
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400">
                Explore our wide selection
              </p>
            </div>
            <Link
              href="/categories"
              className="text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1 hover:underline"
            >
              View All
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/search?category=${category.name.toLowerCase()}`}
                className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-200 dark:bg-neutral-800"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                  <h3 className="text-white font-semibold text-lg">
                    {category.name}
                  </h3>
                  <p className="text-white/70 text-sm">
                    {category.productCount} products
                  </p>
                </div>
                <div className="w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 group-hover:scale-105 transition-transform duration-300" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Stores */}
      <section className="py-16 md:py-24 bg-white dark:bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Featured Stores
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              Shop from our verified and licensed retail partners
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {featuredStores.map((store) => (
              <Link
                key={store.id}
                href={`/store/${store.id}`}
                className="group p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-full h-48 rounded-xl bg-neutral-100 dark:bg-neutral-800 mb-4 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="flex items-center gap-1 text-sm text-amber-600">
                    ★ {store.rating}
                  </span>
                  <span className="text-neutral-300 dark:text-neutral-600">•</span>
                  <span className="text-sm text-neutral-500">
                    {store.deliveryTime}
                  </span>
                </div>
                <h3 className="text-lg font-semibold mb-1">{store.name}</h3>
                <p className="text-sm text-neutral-500">
                  License: {store.licenseNumber}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Drinkly */}
      <section className="py-16 md:py-24 bg-neutral-50 dark:bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Drinkly?
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              We are committed to responsible alcohol delivery with full legal
              compliance.
            </p>
          </div>
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
            {whyDrinkly.map((item) => (
              <div
                key={item.title}
                className="text-center p-6 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700"
              >
                <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24 bg-white dark:bg-neutral-950">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details
                key={index}
                className="group p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800"
              >
                <summary className="flex items-center justify-between cursor-pointer font-semibold text-lg list-none">
                  {faq.question}
                  <ChevronDown className="w-5 h-5 text-neutral-500 group-open:rotate-180 transition-transform" />
                </summary>
                <p className="mt-4 text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Legal/Compliance */}
      <section className="py-16 md:py-24 bg-neutral-50 dark:bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <Shield className="w-16 h-16 text-blue-600 dark:text-blue-400 mx-auto mb-6" />
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Legal & Compliance
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-8 leading-relaxed">
              Drinkly operates in strict compliance with all applicable alcohol
              delivery regulations. All our partner retailers hold valid liquor
              licenses. Age verification is mandatory for all users. We do not
              promote or encourage excessive drinking.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-neutral-500">
              <Link href="/terms" className="hover:text-blue-600 underline">
                Terms of Service
              </Link>
              <Link href="/privacy" className="hover:text-blue-600 underline">
                Privacy Policy
              </Link>
              <Link
                href="/age-policy"
                className="hover:text-blue-600 underline"
              >
                Age Verification Policy
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Drink Responsibly */}
      <section className="py-12 bg-blue-900 dark:bg-blue-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Phone className="w-6 h-6" />
            <span className="text-lg font-semibold">Drink Responsibly</span>
          </div>
          <p className="text-blue-100 max-w-2xl mx-auto text-sm md:text-base">
            Alcohol delivery is a privilege, not a right. Please drink
            responsibly. If you or someone you know has a drinking problem,
            please call the national helpline. You must be of legal drinking age
            to use this service.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-neutral-900 dark:bg-neutral-950 text-neutral-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white font-bold text-xl mb-4">Drinkly</h3>
              <p className="text-sm">
                Order responsibly. Delivered legally.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/about" className="hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-white">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-white">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/help" className="hover:text-white">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/help" className="hover:text-white">
                    Report an Issue
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/terms" className="hover:text-white">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/age-policy" className="hover:text-white">
                    Age Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-neutral-800 pt-8 text-center text-sm">
            <p>
              &copy; {new Date().getFullYear()} Drinkly. All rights reserved.
              Drink responsibly. Must be 18+ to use this service.
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}
