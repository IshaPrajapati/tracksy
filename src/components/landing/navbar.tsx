'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';

const NAV_ITEMS = [
  { label: 'Features', href: '#features' },
  { label: 'Product', href: '#product' },
  { label: 'Solutions', href: '#solutions' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Contact', href: '#contact' },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('');

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 30);
      const sections = NAV_ITEMS.map(n => n.href.slice(1));
      for (const id of [...sections].reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 120) { setActive(id); break; }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (href: string) => {
    setOpen(false);
    const el = document.getElementById(href.slice(1));
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-[#070b0a]/80 backdrop-blur-xl border-b border-white/5 shadow-2xl' : ''
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-[#5ed29c] flex items-center justify-center shadow-lg shadow-[#5ed29c]/30 group-hover:shadow-[#5ed29c]/50 transition-shadow">
              <svg viewBox="0 0 24 24" fill="none" stroke="#070b0a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4.5 h-4.5">
                <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
              </svg>
            </div>
            <span className="text-white font-black tracking-widest text-sm uppercase">Tracksy</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map(({ label, href }) => {
              const isActive = active === href.slice(1);
              return (
                <button
                  key={label}
                  onClick={() => scrollTo(href)}
                  className="relative px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors group"
                >
                  {label}
                  <span className={`absolute bottom-0 left-4 right-4 h-[1px] bg-[#5ed29c] transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`} />
                </button>
              );
            })}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-white/70 hover:text-white transition-colors px-4 py-2">
              Sign In
            </Link>
            <Link href="/register" className="bg-[#5ed29c] text-[#070b0a] text-sm font-bold px-5 py-2.5 rounded-full hover:bg-[#4bc28a] transition-all hover:shadow-lg hover:shadow-[#5ed29c]/25">
              Start Free
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button className="lg:hidden text-white p-1" onClick={() => setOpen(!open)}>
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </motion.header>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-[#070b0a]/98 backdrop-blur-xl flex flex-col items-center justify-center gap-6"
          >
            {NAV_ITEMS.map(({ label, href }, i) => (
              <motion.button
                key={label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                onClick={() => scrollTo(href)}
                className="text-2xl font-bold text-white/80 hover:text-[#5ed29c] transition-colors"
              >
                {label}
              </motion.button>
            ))}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="flex flex-col gap-4 mt-4 w-64">
              <Link href="/login" onClick={() => setOpen(false)} className="text-center py-3 rounded-full border border-white/20 text-white font-medium">Sign In</Link>
              <Link href="/register" onClick={() => setOpen(false)} className="text-center py-3 rounded-full bg-[#5ed29c] text-[#070b0a] font-bold">Start Free</Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
