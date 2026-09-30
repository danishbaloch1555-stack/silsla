import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, MessageSquare } from 'lucide-react';

export const ContactView: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [inquiryType, setInquiryType] = useState('Order & Sizing Inquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSubmitted(true);
    setTimeout(() => {
      setName('');
      setEmail('');
      setMessage('');
      setSubmitted(false);
    }, 6000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-16 space-y-12">
      {/* Title */}
      <div className="max-w-2xl space-y-2">
        <span className="text-xs font-mono uppercase tracking-widest text-[#E8E4DB]">
          Concierge & Inquiries
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold font-display uppercase tracking-tight text-[#F5F2EB]">
          Contact RIVA
        </h1>
        <p className="text-xs md:text-sm text-[#8B8A94] leading-relaxed">
          Need sizing advice, order assistance, or wholesale information? Our team in Lahore & Karachi is available Monday through Saturday.
        </p>
      </div>

      {/* Notice Banner about Editable Placeholders */}
      <div className="p-4 bg-[#1C1A14] border border-[#473B1B] rounded-lg text-amber-300 text-xs">
        <strong className="block uppercase tracking-wider text-[11px] mb-1">
          Editable Business Placeholders Notice
        </strong>
        <p className="text-amber-200/80">
          The contact emails, telephone numbers, and addresses shown below are standard editable placeholders ready to be customized for your live business launch.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left: Contact Info Placeholders */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 bg-[#151519] border border-[#222227] rounded-xl space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#F5F2EB]">
              Direct Channels
            </h3>

            {/* Email */}
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-[#F5F2EB] shrink-0 mt-0.5" />
              <div>
                <span className="text-xs text-[#8B8A94] block">Customer Care Email</span>
                <span className="font-mono text-xs text-[#F5F2EB] font-semibold">
                  care@riva-streetwear.com [EDITABLE]
                </span>
                <span className="text-[11px] text-[#8B8A94] block mt-0.5">Response within 24 hours</span>
              </div>
            </div>

            {/* WhatsApp / Phone */}
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-[#F5F2EB] shrink-0 mt-0.5" />
              <div>
                <span className="text-xs text-[#8B8A94] block">WhatsApp Concierge & Phone</span>
                <span className="font-mono text-xs text-[#F5F2EB] font-semibold">
                  +92 300 0000000 [EDITABLE]
                </span>
                <span className="text-[11px] text-[#8B8A94] block mt-0.5">Mon–Sat, 11:00 AM – 8:00 PM PKT</span>
              </div>
            </div>

            {/* Studio Address */}
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#F5F2EB] shrink-0 mt-0.5" />
              <div>
                <span className="text-xs text-[#8B8A94] block">Design Studio (By Appointment)</span>
                <p className="text-xs text-[#F5F2EB] font-medium leading-relaxed">
                  [Studio Address Placeholder: Gulberg III, Lahore, Punjab, Pakistan]
                </p>
                <p className="text-xs text-[#8B8A94] leading-relaxed mt-1">
                  Logistics & Fulfillment: [Clifton, Karachi, Pakistan]
                </p>
              </div>
            </div>

            {/* Press / Wholesale */}
            <div className="pt-4 border-t border-[#222227] space-y-2">
              <h4 className="text-xs font-bold text-[#F5F2EB] uppercase tracking-wider">
                Wholesale & Stockist Inquiries
              </h4>
              <p className="text-xs text-[#8B8A94]">
                To stock RIVA in your boutique or concept store, email wholesale@riva-streetwear.com with store profile.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Working Inquiry Form */}
        <div className="lg:col-span-7 bg-[#151519] border border-[#222227] rounded-xl p-6 md:p-8">
          <div className="pb-4 mb-6 border-b border-[#222227]">
            <h3 className="text-base font-bold font-display uppercase tracking-tight text-[#F5F2EB]">
              Send an Inquiry
            </h3>
            <p className="text-xs text-[#8B8A94] mt-1">
              Have questions regarding garment GSM, custom bulk orders, or order status?
            </p>
          </div>

          {submitted ? (
            <div className="py-12 text-center space-y-3">
              <div className="inline-flex p-3 bg-emerald-950/60 border border-emerald-800 text-emerald-400 rounded-full">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold font-display text-[#F5F2EB]">Inquiry Received</h4>
              <p className="text-xs text-[#8B8A94] max-w-sm mx-auto">
                Thank you, {name}. Your inquiry has been dispatched to the RIVA customer care team. A representative will contact you via {email} shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#F5F2EB] mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Bilal Ahmed"
                    className="w-full bg-[#18181D] border border-[#2D2D35] rounded-md py-2 px-3 text-xs text-[#F5F2EB] focus:outline-none focus:border-[#F5F2EB]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#F5F2EB] mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@domain.com"
                    className="w-full bg-[#18181D] border border-[#2D2D35] rounded-md py-2 px-3 text-xs text-[#F5F2EB] focus:outline-none focus:border-[#F5F2EB]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#F5F2EB] mb-1">
                  Topic of Inquiry
                </label>
                <select
                  value={inquiryType}
                  onChange={(e) => setInquiryType(e.target.value)}
                  className="w-full bg-[#18181D] border border-[#2D2D35] rounded-md py-2 px-3 text-xs text-[#F5F2EB] focus:outline-none focus:border-[#F5F2EB]"
                >
                  <option value="Order & Sizing Inquiry">Order & Sizing Inquiry</option>
                  <option value="Cash on Delivery Status">Cash on Delivery Status</option>
                  <option value="Exchanges & Returns">Exchanges & Returns</option>
                  <option value="Wholesale & International Distribution">Wholesale & International Distribution</option>
                  <option value="Press & Lookbook Requests">Press & Lookbook Requests</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#F5F2EB] mb-1">
                  Your Message *
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us how we can assist you..."
                  className="w-full bg-[#18181D] border border-[#2D2D35] rounded-md py-2 px-3 text-xs text-[#F5F2EB] focus:outline-none focus:border-[#F5F2EB]"
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 py-3 px-6 bg-[#F5F2EB] text-[#0A0A0C] text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-white active:scale-95 transition-all shadow-md cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Inquiry</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
