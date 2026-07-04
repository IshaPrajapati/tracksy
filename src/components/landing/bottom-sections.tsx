'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronDown, Star, ArrowRight } from 'lucide-react';

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/>
    </svg>
  );
}
function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}
function GithubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
    </svg>
  );
}
import Link from 'next/link';

// ─── PRICING ──────────────────────────────────────────────────────────────────
const PLANS = [
  {
    name: 'Starter', price: 'Free', period: '', desc: 'Perfect for individuals and small projects.',
    features: ['Unlimited projects', 'Unlimited tasks', 'Advanced analytics', 'Priority support', 'Up to 25 members', 'Custom workflows', 'Deadline reminders', 'File attachments'],
    cta: 'Start Free', href: '/register', highlight: false,
  },
  {
    name: 'Professional', price: '$10', period: '/mo', desc: 'For growing teams that need more power.',
    features: ['Everything in Free', 'AI-Powered Insights', 'Custom integrations', 'Admin controls', 'Audit logs', 'Dedicated support', 'Custom branding'],
    cta: 'Start Free Trial', href: '/register', highlight: true,
  },
  {
    name: 'Enterprise', price: 'Custom', period: '', desc: 'For large organizations with complex needs.',
    features: ['Everything in Pro', 'Unlimited members', 'SSO & SAML', 'SLA guarantee', 'Dedicated Success Manager', 'On-premise deployment'],
    cta: 'Contact Sales', href: '#contact', highlight: false,
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 lg:py-32 bg-[#070b0a]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="text-center mb-16">
          <span className="text-[11px] font-bold tracking-[0.2em] text-[#5ed29c] uppercase mb-4 block">Pricing</span>
          <h2 className="text-3xl lg:text-5xl font-black text-white mb-4">Simple <span className="text-[#5ed29c]">Pricing</span></h2>
          <p className="text-white/55 text-lg max-w-xl mx-auto">No hidden fees. No surprises. Start free and scale as you grow.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              whileHover={{ y: -4 }}
              className={`relative h-full rounded-2xl border p-8 flex flex-col ${
                plan.highlight
                  ? 'border-[#5ed29c]/50 bg-[#5ed29c]/[0.04] shadow-2xl shadow-[#5ed29c]/10'
                  : 'border-white/[0.08] bg-white/[0.03]'
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-[#5ed29c] text-[#070b0a] text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider">Most Popular</span>
                </div>
              )}
              <div className="mb-6">
                <div className="text-white/60 text-sm font-semibold mb-1 uppercase tracking-wider">{plan.name}</div>
                <div className="flex items-end gap-1 mb-3">
                  <span className="text-4xl font-black text-white">{plan.price}</span>
                  <span className="text-white/40 mb-1">{plan.period}</span>
                </div>
                <p className="text-white/50 text-sm">{plan.desc}</p>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-white/70">
                    <Check className="w-4 h-4 text-[#5ed29c] shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link href={plan.href}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-3 rounded-full font-bold text-sm transition-all ${
                    plan.highlight
                      ? 'bg-[#5ed29c] text-[#070b0a] hover:bg-[#4bc28a] shadow-lg shadow-[#5ed29c]/20'
                      : 'border border-white/20 text-white hover:bg-white/5'
                  }`}
                >
                  {plan.cta}
                </motion.button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── TESTIMONIALS ─────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  { name: 'Sarah Chen', role: 'Head of Product', company: 'NovaTech', review: "Tracksy completely transformed how our product team operates. We went from missed deadlines and chaotic Slack threads to a fully structured, visible workflow. It's the best investment we made this year.", rating: 5 },
  { name: 'James Okafor', role: 'Founder & CEO', company: 'Launchpad Labs', review: "We tried Asana, Monday, and Jira. None of them felt right for a fast-moving startup. Tracksy is exactly what we needed — simple, powerful, and it actually gets used by the whole team.", rating: 5 },
  { name: 'Priya Mehta', role: 'Operations Lead', company: 'ScaleForce', review: "The visibility Tracksy gives us across 30+ concurrent projects is unmatched. Our leadership team actually looks forward to project reviews now because everything is in one clean place.", rating: 5 },
  { name: 'Daniel Russo', role: 'Engineering Manager', company: 'Veloce Digital', review: "Setting up sprints, tracking blockers, and managing team capacity is effortless with Tracksy. The analytics dashboard alone has saved us hours every week in status meetings.", rating: 5 },
];

export function TestimonialsSection() {
  const [current, setCurrent] = useState(0);

  return (
    <section id="testimonials" className="py-24 lg:py-32 bg-[#0b1120]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="text-center mb-16">
          <span className="text-[11px] font-bold tracking-[0.2em] text-[#5ed29c] uppercase mb-4 block">Testimonials</span>
          <h2 className="text-3xl lg:text-5xl font-black text-white mb-4">Loved By <span className="text-[#5ed29c]">Productive Teams</span></h2>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4 }}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-10 text-center mb-8"
            >
              <div className="flex justify-center gap-1 mb-6">
                {[...Array(TESTIMONIALS[current].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-[#5ed29c] fill-[#5ed29c]" />
                ))}
              </div>
              <p className="text-white/80 text-lg leading-relaxed mb-8 italic">"{TESTIMONIALS[current].review}"</p>
              <div>
                <div className="text-white font-bold text-lg">{TESTIMONIALS[current].name}</div>
                <div className="text-white/45 text-sm">{TESTIMONIALS[current].role} · {TESTIMONIALS[current].company}</div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center gap-3">
            {TESTIMONIALS.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)}
                className={`rounded-full transition-all duration-300 ${i === current ? 'bg-[#5ed29c] w-8 h-2' : 'bg-white/20 w-2 h-2 hover:bg-white/40'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────
const FAQS = [
  { q: 'What is Tracksy?', a: 'Tracksy is a modern workspace platform that combines project management, task tracking, team collaboration, Kanban boards, deadline tracking, workflow management, and productivity analytics in one powerful tool.' },
  { q: 'How does Tracksy help teams?', a: 'Tracksy gives your team complete visibility across all work. Everyone knows what to do, what\'s done, and what\'s blocked — without endless status meetings or scattered spreadsheets.' },
  { q: 'Can I manage multiple projects?', a: 'Yes. Tracksy is built for teams managing multiple projects simultaneously. You can view all projects from one dashboard and drill into any project for detailed tracking.' },
  { q: 'Does Tracksy support team collaboration?', a: 'Absolutely. You can assign tasks to team members, leave comments, attach files, and get notified of updates in real time — all without leaving Tracksy.' },
  { q: 'Can I track deadlines with Tracksy?', a: 'Yes. Every task and project supports due dates, reminders, and milestone tracking. The deadline view helps you visualize what\'s coming and what\'s at risk.' },
  { q: 'Is Tracksy suitable for startups?', a: 'Tracksy was designed with startups in mind. It\'s fast to set up, intuitive for small teams, and powerful enough to scale as your company grows.' },
];

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-24 lg:py-32 bg-[#070b0a]">
      <div className="max-w-3xl mx-auto px-6 lg:px-12">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="text-center mb-16">
          <span className="text-[11px] font-bold tracking-[0.2em] text-[#5ed29c] uppercase mb-4 block">FAQ</span>
          <h2 className="text-3xl lg:text-5xl font-black text-white mb-4">Common <span className="text-[#5ed29c]">Questions</span></h2>
        </motion.div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.03] overflow-hidden"
            >
              <button
                className="w-full flex items-center justify-between p-6 text-left group"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="text-white font-semibold text-base pr-4 group-hover:text-[#5ed29c] transition-colors">{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-white/40 shrink-0 transition-transform duration-300 ${open === i ? 'rotate-180 text-[#5ed29c]' : ''}`} />
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-6 text-white/55 text-base leading-relaxed border-t border-white/[0.06] pt-4">{faq.a}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA ──────────────────────────────────────────────────────────────────────
export function CTASection() {
  return (
    <section className="py-24 lg:py-32 bg-[#0b1120] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#5ed29c]/10 blur-3xl rounded-full" />
      </div>
      <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-12 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
          <h2 className="text-4xl lg:text-6xl font-black text-white mb-6 leading-tight">
            Ready To Organize<br /><span className="text-[#5ed29c]">Work Better?</span>
          </h2>
          <p className="text-white/60 text-lg mb-10 max-w-xl mx-auto">
            Bring projects, tasks, workflows, and teams together inside one modern workspace. Start free today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <motion.button whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(94,210,156,0.3)' }} whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 bg-[#5ed29c] text-[#070b0a] font-bold text-base px-8 py-4 rounded-full group"
              >
                Start Free <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
            <button
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="border border-white/20 text-white font-medium text-base px-8 py-4 rounded-full hover:bg-white/5 transition-colors"
            >
              Book Demo
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── CONTACT ──────────────────────────────────────────────────────────────────
export function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', company: '', message: '' });
  const [sent, setSent] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Lazy load to avoid putting it at the very top of client component
    const { submitContactMessage } = await import('@/actions/contact');
    
    const res = await submitContactMessage(form);
    setLoading(false);
    if (res.success) {
      setSent(true);
    } else {
      alert(res.error);
    }
  };

  return (
    <section id="contact" className="py-24 lg:py-32 bg-[#070b0a]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="text-center mb-16">
          <span className="text-[11px] font-bold tracking-[0.2em] text-[#5ed29c] uppercase mb-4 block">Contact</span>
          <h2 className="text-3xl lg:text-5xl font-black text-white mb-4">Get In <span className="text-[#5ed29c]">Touch</span></h2>
          <p className="text-white/55 text-lg max-w-xl mx-auto">Have questions? Our team is here to help.</p>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          {/* Form */}
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            {sent ? (
              <div className="flex flex-col items-center justify-center h-full gap-4 py-16">
                <div className="w-16 h-16 bg-[#5ed29c]/15 rounded-full flex items-center justify-center">
                  <Check className="w-8 h-8 text-[#5ed29c]" />
                </div>
                <h3 className="text-white font-bold text-xl">Message Sent!</h3>
                <p className="text-white/50 text-center">We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {[
                  { label: 'Full Name', key: 'name', type: 'text', placeholder: 'Your name' },
                  { label: 'Email', key: 'email', type: 'email', placeholder: 'you@company.com' },
                  { label: 'Company', key: 'company', type: 'text', placeholder: 'Your company' },
                ].map(({ label, key, type, placeholder }) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-white/70 mb-2">{label}</label>
                    <input type={type} placeholder={placeholder} required
                      value={form[key as keyof typeof form]}
                      onChange={e => setForm({ ...form, [key]: e.target.value })}
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-white/25 text-sm outline-none focus:border-[#5ed29c]/50 focus:ring-1 focus:ring-[#5ed29c]/30 transition-all"
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Message</label>
                  <textarea placeholder="Tell us how we can help..." required rows={4}
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-white/25 text-sm outline-none focus:border-[#5ed29c]/50 focus:ring-1 focus:ring-[#5ed29c]/30 transition-all resize-none"
                  />
                </div>
                <button type="submit" disabled={loading} className="w-full bg-[#5ed29c] text-[#070b0a] font-bold py-4 rounded-full hover:bg-[#4bc28a] transition-colors text-sm disabled:opacity-70 disabled:cursor-not-allowed">
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </motion.div>


        </div>
      </div>
    </section>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
export function Footer() {
  return (
    <footer className="bg-[#070b0a] border-t border-white/[0.06] py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-12 mb-16">
          <div className="col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#5ed29c] flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="#070b0a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
                </svg>
              </div>
              <span className="text-white font-black tracking-widest uppercase text-sm">Tracksy</span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs mb-6">
              The modern workspace for teams that need to plan, track, and deliver better work.
            </p>
            {/* Newsletter */}
            <div className="flex gap-2">
              <input type="email" placeholder="Your email" className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-full px-4 py-2 text-sm text-white placeholder-white/25 outline-none focus:border-[#5ed29c]/40 transition-colors" />
              <button className="bg-[#5ed29c] text-[#070b0a] font-bold text-sm px-4 py-2 rounded-full hover:bg-[#4bc28a] transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>

          {[
            { title: 'Product', links: ['Features', 'Pricing', 'Roadmap', 'Changelog'] },
            { title: 'Company', links: ['About', 'Contact', 'Careers', 'Blog'] },
            { title: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'Security'] },
          ].map(({ title, links }) => (
            <div key={title}>
              <div className="text-white font-semibold text-sm mb-4">{title}</div>
              <ul className="space-y-3">
                {links.map(l => (
                  <li key={l}><a href="#" className="text-white/40 text-sm hover:text-[#5ed29c] transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/[0.06] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-sm">© {new Date().getFullYear()} Tracksy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
