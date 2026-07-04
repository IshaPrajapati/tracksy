'use client';
import { motion } from 'framer-motion';
import { Cog, Code, Megaphone, Briefcase, Rocket, Target } from 'lucide-react';

const STEPS = [
  { n: '01', title: 'Create Project', desc: 'Set up your workspace with goals, objectives, and milestones in minutes.' },
  { n: '02', title: 'Add Tasks', desc: 'Break work into clear, actionable tasks with priorities and descriptions.' },
  { n: '03', title: 'Assign Team Members', desc: 'Delegate responsibilities clearly so everyone knows what they own.' },
  { n: '04', title: 'Track Progress', desc: 'Watch work move through stages in real-time with live status updates.' },
  { n: '05', title: 'Analyze Results', desc: 'Use insights and reports to optimize execution and improve over time.' },
];

const SOLUTIONS = [
  { icon: Cog, title: 'Operations Teams', desc: 'Manage projects and cross-functional workflows with clarity and efficiency.' },
  { icon: Code, title: 'Product Teams', desc: 'Track sprints, features, and development progress from backlog to launch.' },
  { icon: Megaphone, title: 'Marketing Teams', desc: 'Coordinate campaigns, content calendars, and creative deadlines seamlessly.' },
  { icon: Briefcase, title: 'Agencies', desc: 'Manage multiple clients, projects, and deliverables from a single workspace.' },
  { icon: Rocket, title: 'Startups', desc: 'Move fast and stay organized. Scale your operations without the chaos.' },
  { icon: Target, title: 'Enterprise', desc: 'Standardize workflows, enforce accountability, and gain full visibility.' },
];

const WHY = [
  { title: 'Centralized Workspace', desc: 'All your projects, tasks, deadlines, and team communication in one single place. No more context switching.' },
  { title: 'Real-Time Visibility', desc: 'Always know the status of every project at a glance. Stakeholders stay informed without asking for updates.' },
  { title: 'Simple Yet Powerful', desc: 'Built to be intuitive from day one, yet powerful enough to scale with your growing team and complexity.' },
  { title: 'Modern User Experience', desc: 'A design built for productivity. Clean, fast, and delightful to use — every single day.' },
];

const REPLACES = ['Spreadsheets', 'Email threads', 'Slack updates', 'Notion docs', 'Jira tickets', 'Monday boards'];

export function HowItWorksSection() {
  return (
    <section className="py-24 lg:py-32 bg-[#0b1120]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="text-center mb-16">
          <span className="text-[11px] font-bold tracking-[0.2em] text-[#5ed29c] uppercase mb-4 block">How It Works</span>
          <h2 className="text-3xl lg:text-5xl font-black text-white mb-4">Simple Workflow.<br /><span className="text-[#5ed29c]">Powerful Results.</span></h2>
          <p className="text-white/55 text-lg max-w-xl mx-auto">Get your team up and running in minutes, not months.</p>
        </motion.div>

        <div className="relative">
          {/* Connector line */}
          <div className="hidden lg:block absolute left-[72px] top-10 bottom-10 w-px bg-gradient-to-b from-transparent via-[#5ed29c]/30 to-transparent" />

          <div className="space-y-8">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="flex items-start gap-8 group"
              >
                <div className="relative shrink-0">
                  <div className="w-14 h-14 rounded-2xl border border-[#5ed29c]/30 bg-[#5ed29c]/10 flex items-center justify-center font-black text-[#5ed29c] text-lg group-hover:bg-[#5ed29c]/20 transition-colors">
                    {step.n}
                  </div>
                </div>
                <div className="pt-3">
                  <h3 className="text-white font-bold text-xl mb-2">{step.title}</h3>
                  <p className="text-white/55 text-base leading-relaxed max-w-xl">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function SolutionsSection() {
  return (
    <section id="solutions" className="py-24 lg:py-32 bg-[#070b0a]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="text-center mb-16">
          <span className="text-[11px] font-bold tracking-[0.2em] text-[#5ed29c] uppercase mb-4 block">Solutions</span>
          <h2 className="text-3xl lg:text-5xl font-black text-white mb-4">Built For <span className="text-[#5ed29c]">Every Team</span></h2>
          <p className="text-white/55 text-lg max-w-xl mx-auto">No matter your team structure, Tracksy adapts to how you work.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SOLUTIONS.map((sol, i) => {
            const Icon = sol.icon;
            return (
              <motion.div
                key={sol.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(94,210,156,0.08)' }}
                className="group rounded-2xl border border-white/[0.08] bg-white/[0.03] p-8 cursor-default overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#5ed29c]/6 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                <div className="w-12 h-12 rounded-xl bg-[#5ed29c]/10 border border-[#5ed29c]/20 flex items-center justify-center mb-6 group-hover:bg-[#5ed29c]/20 transition-colors relative z-10">
                  <Icon className="w-6 h-6 text-[#5ed29c]" />
                </div>
                <h3 className="text-white font-bold text-xl mb-3 relative z-10">{sol.title}</h3>
                <p className="text-white/55 text-sm leading-relaxed relative z-10">{sol.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function WhyTracksySection() {
  return (
    <section className="py-24 lg:py-32 bg-[#0b1120]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="text-center mb-16">
          <span className="text-[11px] font-bold tracking-[0.2em] text-[#5ed29c] uppercase mb-4 block">Why Tracksy</span>
          <h2 className="text-3xl lg:text-5xl font-black text-white mb-4">Why Teams <span className="text-[#5ed29c]">Choose Tracksy</span></h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {WHY.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="group rounded-2xl border border-white/[0.08] bg-white/[0.03] p-8 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#5ed29c]/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="w-2 h-8 bg-[#5ed29c] rounded-full mb-6" />
              <h3 className="text-white font-bold text-xl mb-3">{item.title}</h3>
              <p className="text-white/55 text-base leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Replaces Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8 lg:p-12 text-center"
        >
          <h3 className="text-white font-black text-2xl mb-3">Tracksy replaces the tools slowing you down</h3>
          <p className="text-white/50 mb-8">One workspace instead of six disconnected tools.</p>
          <div className="flex flex-wrap justify-center gap-3">
            {REPLACES.map((tool) => (
              <span key={tool} className="px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.08] text-white/50 text-sm line-through">{tool}</span>
            ))}
          </div>
          <div className="mt-6 text-[#5ed29c] font-bold text-lg">→ Just Tracksy</div>
        </motion.div>
      </div>
    </section>
  );
}
