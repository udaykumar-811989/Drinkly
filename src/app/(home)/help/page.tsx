'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  HelpCircle,
  MessageCircle,
  Phone,
  Mail,
  ChevronDown,
  Send,
  Loader2,
  CheckCircle,
  Clock,
  AlertCircle,
} from 'lucide-react'

const faqs = [
  {
    category: 'Ordering',
    items: [
      {
        question: 'How do I place an order?',
        answer:
          'Browse products from licensed stores, add items to your cart, and proceed to checkout. You will need to verify your age during the process.',
      },
      {
        question: 'What is the minimum order amount?',
        answer:
          'The minimum order amount varies by store, but is typically ₹500. This will be displayed during checkout.',
      },
      {
        question: 'Can I modify my order after placing it?',
        answer:
          'You can modify or cancel your order within 15 minutes of placing it. After that, the order is processed for delivery.',
      },
    ],
  },
  {
    category: 'Delivery',
    items: [
      {
        question: 'What are the delivery hours?',
        answer:
          'Delivery is available between 10:00 AM and 10:00 PM, subject to local regulations and store operating hours.',
      },
      {
        question: 'How long does delivery take?',
        answer:
          'Delivery typically takes 30-45 minutes, depending on your location and the store.',
      },
      {
        question: 'Do I need to show ID at delivery?',
        answer:
          'Yes, the delivery agent will verify your government-issued ID to confirm you are of legal drinking age.',
      },
    ],
  },
  {
    category: 'Account',
    items: [
      {
        question: 'How do I verify my age?',
        answer:
          'You can verify your age during registration by providing your date of birth or uploading a government ID. Additional verification may be required at delivery.',
      },
      {
        question: 'How do I update my profile?',
        answer:
          'Go to Profile > Edit Profile to update your personal information. Some changes may require re-verification.',
      },
    ],
  },
]

const previousTickets = [
  {
    id: 1,
    subject: 'Order not delivered',
    status: 'resolved',
    date: '2024-01-14',
  },
  {
    id: 2,
    subject: 'Wrong item received',
    status: 'open',
    date: '2024-01-15',
  },
]

export default function HelpPage() {
  const [activeTab, setActiveTab] = useState<'faq' | 'contact' | 'tickets'>(
    'faq'
  )
  const [openFaq, setOpenFaq] = useState<string | null>(null)
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    category: '',
    message: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setSubmitting(false)
    setSubmitted(true)
    setTicketForm({ subject: '', category: '', message: '' })
  }

  return (
    <div className="pb-20 md:pb-0">
      <h1 className="text-2xl font-bold mb-6">Help & Support</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide">
        {[
          { id: 'faq' as const, label: 'FAQ', icon: HelpCircle },
          { id: 'contact' as const, label: 'Contact Us', icon: Phone },
          { id: 'tickets' as const, label: 'My Tickets', icon: MessageCircle },
        ].map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* FAQ Tab */}
      {activeTab === 'faq' && (
        <div className="space-y-6">
          {faqs.map((section) => (
            <div key={section.category}>
              <h2 className="font-semibold mb-3">{section.category}</h2>
              <div className="space-y-2">
                {section.items.map((faq) => {
                  const isOpen = openFaq === faq.question
                  return (
                    <div
                      key={faq.question}
                      className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden"
                    >
                      <button
                        onClick={() =>
                          setOpenFaq(isOpen ? null : faq.question)
                        }
                        className="w-full flex items-center justify-between p-4 text-left"
                      >
                        <span className="font-medium text-sm">
                          {faq.question}
                        </span>
                        <ChevronDown
                          className={`w-5 h-5 text-neutral-400 transition-transform ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4 text-sm text-neutral-500">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Contact Tab */}
      {activeTab === 'contact' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="tel:+911800123456"
              className="flex items-center gap-4 p-4 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 hover:shadow-md transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Phone className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">Call Us</p>
                <p className="text-sm text-neutral-500">
                  1800-123-456 (Toll Free)
                </p>
              </div>
            </a>
            <a
              href="mailto:support@drinkly.com"
              className="flex items-center gap-4 p-4 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 hover:shadow-md transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Mail className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="font-medium">Email Us</p>
                <p className="text-sm text-neutral-500">
                  support@drinkly.com
                </p>
              </div>
            </a>
          </div>

          {/* Create Ticket Form */}
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6">
            <h2 className="font-semibold mb-4">Create Support Ticket</h2>

            {submitted ? (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Ticket Submitted!</h3>
                <p className="text-sm text-neutral-500 mb-4">
                  We&apos;ll get back to you within 24 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Submit another ticket
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitTicket} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={ticketForm.subject}
                    onChange={(e) =>
                      setTicketForm((prev) => ({
                        ...prev,
                        subject: e.target.value,
                      }))
                    }
                    placeholder="Brief description of your issue"
                    className="w-full px-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Category
                  </label>
                  <select
                    value={ticketForm.category}
                    onChange={(e) =>
                      setTicketForm((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="order">Order Issue</option>
                    <option value="delivery">Delivery Problem</option>
                    <option value="payment">Payment Issue</option>
                    <option value="account">Account Problem</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Message
                  </label>
                  <textarea
                    value={ticketForm.message}
                    onChange={(e) =>
                      setTicketForm((prev) => ({
                        ...prev,
                        message: e.target.value,
                      }))
                    }
                    placeholder="Describe your issue in detail"
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium transition-colors flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Submit Ticket
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Tickets Tab */}
      {activeTab === 'tickets' && (
        <div>
          {previousTickets.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">No tickets yet</h3>
              <p className="text-sm text-neutral-500">
                Your support tickets will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {previousTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="p-4 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{ticket.subject}</h3>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        ticket.status === 'open'
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                          : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      }`}
                    >
                      {ticket.status === 'open' ? 'Open' : 'Resolved'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-neutral-500">
                    <Clock className="w-4 h-4" />
                    {new Date(ticket.date).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
