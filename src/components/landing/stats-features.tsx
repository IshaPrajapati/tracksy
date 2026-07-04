'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useEffect, useState } from 'react';
import { BarChart3, Layers, CheckSquare, Clock, Users, TrendingUp } from 'lucide-react';

function useCountUp(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      setCount(Math.floor(current));
      if (current >= target) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [start, target, duration]);
  return count;
}

const STATS = [
  { label: 'Projects Managed', value: 2400, suffix: '+', icon: Layers, desc: 'Across all teams' },
  { label: 'Tasks Tracked', value: 98000, suffix: '+', icon: CheckSquare, desc: 'Completed on time' },
  { label: 'Deadlines Met', value: 94, suffix: '%', icon: Clock, desc: 'Average success rate' },
  { label: 'Team Productivity', value: 3, suffix: 'x', icon: TrendingUp, desc: 'Increase reported' },
];

const FEATURES = [
  { icon: BarChart3, title: 'Project Dashboard', desc: 'Get complete visibility into every project with real-time status updates, progress tracking, and health indicators at a glance.' },
  { icon: Layers, title: 'Kanban Boards', desc: 'Visualize your entire workflow with drag-and-drop Kanban boards. Move tasks between stages and manage priorities effortlessly.' },
  { icon: CheckSquare, title: 'Task Management', desc: 'Assign, prioritize, and track tasks with due dates, labels, attachments, and comments — all in one organized view.' },
  { icon: Clock, title: 'Deadline Tracking', desc: 'Never miss important milestones. Set deadlines, receive alerts, and view upcoming tasks on an integrated calendar.' },
  { icon: Users, title: 'Team Collaboration', desc: 'Keep communication organized and transparent. Tag teammates, leave comments, and stay aligned without switching tools.' },
  { icon: TrendingUp, title: 'Analytics & Reporting', desc: 'Make better decisions using real-time insights. Track velocity, identify bottlenecks, and measure team performance.' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: (i: number = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1, ease: 'easeOut' } }),
};

function StatCard({ stat, started }: { stat: typeof STATS[0], started: boolean }) {
  const count = useCountUp(stat.value, 2200, started);
  const Icon = stat.icon;
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(94,210,156,0.08)' }}
      className="relative rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm p-8 group overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#5ed29c]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
      <Icon className="w-6 h-6 text-[#5ed29c] mb-4 group-hover:scale-110 transition-transform" />
      <div className="text-4xl lg:text-5xl font-black text-white mb-1">
        {count.toLocaleString()}{stat.suffix}
      </div>
      <div className="text-white font-semibold mb-1">{stat.label}</div>
      <div className="text-white/45 text-sm">{stat.desc}</div>
    </motion.div>
  );
}

export function StatsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-24 lg:py-32 bg-[#070b0a] border-t border-white/[0.05]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-black text-white mb-4">Built For Teams That Need <span className="text-[#5ed29c]">Visibility.</span></h2>
          <p className="text-white/55 text-lg max-w-xl mx-auto">Real numbers from teams using Tracksy every day.</p>
        </motion.div>

        <motion.div
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {STATS.map((stat) => <StatCard key={stat.label} stat={stat} started={inView} />)}
        </motion.div>
      </div>
    </section>
  );
}

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 lg:py-32 bg-[#0b1120]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="text-center mb-16">
          <span className="text-[11px] font-bold tracking-[0.2em] text-[#5ed29c] uppercase mb-4 block">Platform Features</span>
          <h2 className="text-3xl lg:text-5xl font-black text-white mb-4">
            One Platform.<br /><span className="text-[#5ed29c]">Complete Control.</span>
          </h2>
          <p className="text-white/55 text-lg max-w-xl mx-auto">Everything needed to manage work efficiently, from first idea to final delivery.</p>
        </motion.div>

        <motion.div
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {FEATURES.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.title}
                custom={i}
                variants={fadeUp}
                whileHover={{ y: -6, boxShadow: '0 24px 48px rgba(94,210,156,0.1)' }}
                className="group relative rounded-2xl border border-white/[0.08] bg-white/[0.03] p-8 overflow-hidden cursor-default"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#5ed29c]/8 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none" />
                <div className="w-12 h-12 rounded-xl bg-[#5ed29c]/10 border border-[#5ed29c]/20 flex items-center justify-center mb-6 group-hover:bg-[#5ed29c]/20 transition-colors">
                  <Icon className="w-6 h-6 text-[#5ed29c] group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="text-white font-bold text-xl mb-3">{feat.title}</h3>
                <p className="text-white/55 text-sm leading-relaxed">{feat.desc}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
