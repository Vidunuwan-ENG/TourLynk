import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, AlertCircle, HelpCircle, ChevronDown } from 'lucide-react';
import { contactService } from '../../services/contact/contactService';

const FAQS = [
  {
    q: 'What do I need to rent a vehicle with TourLynk in Sri Lanka?',
    a: 'You need a valid driver’s license (from your home country plus an International Driving Permit or local endorsement from the Department of Motor Traffic in Colombo), a valid passport or National Identity Card, and a credit or debit card for the reservation deposit.'
  },
  {
    q: 'Can I pick up in Colombo and drop off in another district?',
    a: 'Yes, we offer cross-district pickup and dropoff points across major hubs including Colombo, Negombo (Bandaranaike International Airport), Kandy, Galle, and Hambantota. Contact our team to coordinate custom logistics.'
  },
  {
    q: 'What is your fuel policy?',
    a: 'We operate on a transparent same-to-same fuel policy. The vehicle will be handed over with a noted fuel level (usually full) and should be returned with the equivalent level.'
  },
  {
    q: 'Is roadside assistance included in my rental?',
    a: 'Yes, all TourLynk rentals include complimentary 24/7 island-wide breakdown assistance covering all 25 districts of Sri Lanka.'
  }
];

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      await contactService.submitContact(formData);
      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send your message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      {/* Header Banner */}
      <div className="bg-[#0B252C] text-white py-14 px-4 sm:px-6 lg:px-8 border-b border-teal-900/40">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-800/40 text-amber-300 text-xs font-semibold tracking-wider uppercase mb-3">
            <Mail className="w-3.5 h-3.5" />
            Get in Touch
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            Contact <span className="text-[#F5B041]">TourLynk</span>
          </h1>
          <p className="mt-3 text-slate-300 max-w-2xl mx-auto text-base">
            Have questions about vehicle rentals, custom itineraries, or airport pickup? Our Sri Lanka operations team is here to assist you 24/7.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Details Card */}
          <div className="bg-[#0B3B3C] text-white rounded-3xl p-6 sm:p-8 shadow-lg space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white mb-2">TourLynk Operations HQ</h2>
              <p className="text-xs text-teal-100/80 leading-relaxed">
                Serving travelers across all 25 districts from our Colombo central operations base.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#F5B041] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Main Office</span>
                  <span className="text-teal-100">No. 45 Galle Road, Kollupitiya, Colombo 03, Sri Lanka</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#F5B041] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Phone / WhatsApp Support</span>
                  <span className="text-teal-100">+94 11 234 5678 / +94 77 987 6543</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#F5B041] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Email Inquiries</span>
                  <span className="text-teal-100">info@tourlynk.com</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#F5B041] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Working Hours</span>
                  <span className="text-teal-100">Daily 7:00 AM – 10:00 PM (Roadside Dispatch 24/7)</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-teal-700/50">
              <span className="text-[11px] text-teal-200 block mb-1">Airport Desk:</span>
              <p className="text-xs text-white font-medium">
                Bandaranaike International Airport (CMB) Arrival Terminal counter open 24 Hours for pre-booked vehicle handovers.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80">
            <h2 className="text-xl font-bold text-slate-900 mb-2">Send us a Message</h2>
            <p className="text-xs text-slate-500 mb-6">
              Fill in your details below and our team will get back to you within 2 hours.
            </p>

            {success && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm rounded-2xl flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                Thank you! Your message has been received by our operations team. We will be in touch shortly.
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm rounded-2xl flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Your Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Liam Smith"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B3B3C]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. liam@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B3B3C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vehicle rental inquiry for 10-day round trip"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B3B3C]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Your Message</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tell us about your rental dates, preferred vehicle category, or questions..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full p-4 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B3B3C]"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#0B3B3C] hover:bg-[#0E4D52] text-white font-bold rounded-xl text-xs sm:text-sm transition shadow-sm disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {submitting ? 'Sending Message...' : 'Send Message'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-2 text-[#0B3B3C] mb-2">
            <HelpCircle className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Frequently Asked Questions</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-6">
            Everything you need to know about renting with TourLynk
          </h2>

          <div className="divide-y divide-slate-100">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="py-4">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between text-left text-sm font-bold text-slate-800 hover:text-[#0B3B3C] transition"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {isOpen && (
                    <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed pl-1">
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
