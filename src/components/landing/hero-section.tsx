'use client';
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Hls from 'hls.js';
import { ArrowRight, Star } from 'lucide-react';
import Link from 'next/link';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: (i: number = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.7, delay: i * 0.15, ease: 'easeOut' } }),
};

export function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current) return;
    if (Hls.isSupported()) {
      const hls = new Hls({ enableWorker: false });
      hls.loadSource('https://stream.mux.com/tLkHO1qZoaaQOUeVWo8hEBeGQfySP02EPS02BmnNFyXys.m3u8');
      hls.attachMedia(videoRef.current);
    } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
      videoRef.current.src = 'https://stream.mux.com/tLkHO1qZoaaQOUeVWo8hEBeGQfySP02EPS02BmnNFyXys.m3u8';
    }
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#070b0a]">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video ref={videoRef} autoPlay muted loop playsInline className="w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#070b0a] via-[#070b0a]/70 to-[#070b0a]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070b0a] via-transparent to-[#070b0a]/50" />
      </div>

      {/* Grid Lines */}
      <div className="hidden lg:block absolute inset-0 z-0 pointer-events-none">
        {['25%','50%','75%'].map(p => (
          <div key={p} className="absolute top-0 bottom-0 w-px bg-white/5" style={{ left: p }} />
        ))}
      </div>

      {/* SVG Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-0 pointer-events-none w-full max-w-4xl h-[600px] opacity-50">
        <svg viewBox="0 0 800 600" className="w-full h-full">
          <defs>
            <filter id="hero-glow"><feGaussianBlur stdDeviation="40" /></filter>
            <radialGradient id="hero-grad" cx="50%" cy="40%" r="50%">
              <stop offset="0%" stopColor="#5ed29c" stopOpacity="0.6" />
              <stop offset="60%" stopColor="#00ffcc" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#070b0a" stopOpacity="0" />
            </radialGradient>
          </defs>
          <ellipse cx="400" cy="240" rx="350" ry="180" fill="url(#hero-grad)" filter="url(#hero-glow)" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-12 pt-28 pb-20 text-center">
        {/* Eyebrow */}
        <motion.div custom={0} variants={fadeUp} initial="hidden" animate="show">
          <span className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] text-[#5ed29c] uppercase mb-6 border border-[#5ed29c]/30 px-4 py-2 rounded-full bg-[#5ed29c]/5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#5ed29c] animate-pulse" />
            Work Smarter. Ship Faster.
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1 custom={1} variants={fadeUp} initial="hidden" animate="show"
          className="text-[40px] sm:text-[56px] lg:text-[72px] font-black leading-[1.05] tracking-tight text-white mb-6"
        >
          Everything Your Team Needs<br />
          To Plan,{' '}
          <span className="text-[#5ed29c] relative">
            Track
            <svg className="absolute -bottom-1 left-0 w-full" height="4" viewBox="0 0 200 4">
              <path d="M0 2 Q100 0 200 2" stroke="#5ed29c" strokeWidth="2" fill="none" strokeLinecap="round" />
            </svg>
          </span>
          {' '}and{' '}
          <span className="text-[#5ed29c]">Deliver.</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p custom={2} variants={fadeUp} initial="hidden" animate="show"
          className="text-[16px] text-white/65 max-w-2xl mx-auto leading-relaxed mb-10"
        >
          Tracksy brings projects, tasks, deadlines, collaboration, analytics, and workflows together in one powerful workspace designed for modern teams.
        </motion.p>

        {/* CTAs */}
        <motion.div custom={3} variants={fadeUp} initial="hidden" animate="show" className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <Link href="/register">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(94,210,156,0.35)' }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 bg-[#5ed29c] text-[#070b0a] font-bold text-base px-8 py-4 rounded-full group"
            >
              Start Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </Link>
          <motion.button
            whileHover={{ backgroundColor: 'rgba(255,255,255,0.06)' }}
            onClick={() => document.getElementById('product')?.scrollIntoView({ behavior: 'smooth' })}
            className="flex items-center gap-2 border border-white/15 text-white font-medium text-base px-8 py-4 rounded-full backdrop-blur-sm transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-[#5ed29c] animate-pulse" />
            Watch Demo
          </motion.button>
        </motion.div>

        {/* Social Proof */}
        <motion.div custom={4} variants={fadeUp} initial="hidden" animate="show" className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-1">
            {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 text-[#5ed29c] fill-[#5ed29c]" />)}
          </div>
          <p className="text-white/45 text-sm">Trusted by growing teams, startups, and organizations worldwide.</p>
        </motion.div>

        {/* Hero Visual — Dashboard Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.7, ease: 'easeOut' }}
          className="mt-20 relative mx-auto max-w-5xl"
        >
          {/* Glow behind mockup */}
          <div className="absolute inset-0 bg-[#5ed29c]/10 blur-3xl rounded-3xl scale-95" />
          
          {/* Mockup Container */}
          <div className="relative rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm overflow-hidden shadow-2xl shadow-black/50">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/[0.02]">
              <div className="w-3 h-3 rounded-full bg-red-400/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-400/60" />
              <div className="w-3 h-3 rounded-full bg-green-400/60" />
              <div className="flex-1 mx-4 bg-white/5 rounded-full h-6 flex items-center px-4">
                <span className="text-white/30 text-xs">app.tracksy.io/dashboard</span>
              </div>
            </div>
            {/* Dashboard Preview */}
            <div className="p-6 grid grid-cols-12 gap-4 min-h-[360px] bg-[#0b1120]/80">
              {/* Sidebar */}
              <div className="col-span-2 space-y-3">
                {['Dashboard', 'Projects', 'Tasks', 'Analytics', 'Team'].map((item, i) => (
                  <div key={item} className={`text-xs py-2 px-3 rounded-lg ${i === 0 ? 'bg-[#5ed29c]/15 text-[#5ed29c] font-medium' : 'text-white/40'}`}>{item}</div>
                ))}
              </div>
              {/* Main Content */}
              <div className="col-span-10 space-y-4">
                {/* Stats row */}
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { label: 'Active Projects', val: '24', delta: '+3' },
                    { label: 'Tasks Today', val: '147', delta: '+12' },
                    { label: 'Completed', val: '89%', delta: '+4%' },
                    { label: 'Team Members', val: '18', delta: '' },
                  ].map(({ label, val, delta }) => (
                    <div key={label} className="bg-white/[0.04] border border-white/[0.06] rounded-xl p-3">
                      <div className="text-white/40 text-[10px] mb-1">{label}</div>
                      <div className="text-white font-bold text-lg">{val}</div>
                      {delta && <div className="text-[#5ed29c] text-[10px]">{delta} this week</div>}
                    </div>
                  ))}
                </div>
                {/* Kanban preview */}
                <div className="grid grid-cols-3 gap-3">
                  {['To Do', 'In Progress', 'Done'].map((col, ci) => (
                    <div key={col} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3 space-y-2">
                      <div className="text-white/50 text-[10px] font-semibold tracking-wider uppercase">{col}</div>
                      {[1,2].map(j => (
                        <div key={j} className={`bg-white/[0.05] rounded-lg p-2.5 border border-white/[0.05] ${ci === 1 && j === 1 ? 'border-[#5ed29c]/30' : ''}`}>
                          <div className={`h-1.5 rounded-full mb-2 ${ci === 0 ? 'bg-white/20 w-3/4' : ci === 1 ? 'bg-[#5ed29c]/60 w-1/2' : 'bg-[#5ed29c] w-full'}`} />
                          <div className="h-1 rounded bg-white/10 w-2/3" />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Floating cards */}
          <motion.div
            animate={{ y: [-6, 6, -6] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -left-8 top-1/3 bg-[#0b1120] border border-white/10 rounded-xl p-4 shadow-2xl backdrop-blur-md hidden lg:block"
          >
            <div className="text-[10px] text-white/40 mb-1">Sprint Progress</div>
            <div className="text-white font-bold text-lg">87%</div>
            <div className="w-32 h-1.5 bg-white/10 rounded-full mt-2">
              <div className="h-full bg-[#5ed29c] rounded-full w-[87%]" />
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [6, -6, 6] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -right-8 top-1/4 bg-[#0b1120] border border-white/10 rounded-xl p-4 shadow-2xl backdrop-blur-md hidden lg:block"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-[#5ed29c] animate-pulse" />
              <div className="text-[10px] text-white/40">Task Completed</div>
            </div>
            <div className="text-white text-sm font-medium">Design Review ✓</div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
