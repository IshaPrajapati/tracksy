'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, Layers, CheckSquare, TrendingUp } from 'lucide-react';

const TABS = [
  {
    id: 'dashboard', label: 'Dashboard', icon: BarChart3,
    headline: 'Monitor Project Health At a Glance',
    desc: 'See every project\'s status, progress, and team activity in one unified view. Make faster decisions with real-time data.',
    preview: {
      title: 'Project Overview',
      items: [
        { name: 'Mobile App Redesign', progress: 78, status: 'On Track', color: '#5ed29c' },
        { name: 'Backend API v2', progress: 45, status: 'In Progress', color: '#60a5fa' },
        { name: 'Marketing Campaign', progress: 92, status: 'Near Done', color: '#a78bfa' },
        { name: 'Q3 Analytics Report', progress: 20, status: 'Starting', color: '#f472b6' },
      ]
    }
  },
  {
    id: 'projects', label: 'Projects', icon: Layers,
    headline: 'Organize Work With Visual Boards',
    desc: 'Create projects, set milestones, and assign team members. Visualize the full scope of work with boards and timelines.',
    preview: {
      title: 'Kanban Board',
      columns: ['Backlog', 'In Progress', 'Review', 'Done'],
    }
  },
  {
    id: 'analytics', label: 'Analytics', icon: TrendingUp,
    headline: 'Track Team Performance & Productivity',
    desc: 'Understand where time is spent, which projects are on track, and how to improve team throughput with powerful reports.',
    preview: {
      title: 'Performance Analytics',
      bars: [65, 80, 55, 90, 70, 85, 95],
    }
  },
  {
    id: 'tasks', label: 'Tasks', icon: CheckSquare,
    headline: 'Manage Priorities, Assignments & Deadlines',
    desc: 'Break down work into actionable tasks. Assign owners, set due dates, add labels, and never miss a deadline again.',
    preview: {
      title: 'Task List',
      tasks: [
        { name: 'Finalize design system', due: 'Today', priority: 'High', done: true },
        { name: 'API integration testing', due: 'Tomorrow', priority: 'High', done: false },
        { name: 'Write release notes', due: 'Jun 25', priority: 'Medium', done: false },
        { name: 'Team sync meeting', due: 'Jun 26', priority: 'Low', done: false },
      ]
    }
  },
];

function TabPreview({ tab }: { tab: typeof TABS[0] }) {
  if (tab.id === 'dashboard') {
    return (
      <div className="space-y-3">
        <div className="text-white/50 text-xs font-semibold tracking-wider uppercase mb-4">{tab.preview.title}</div>
        {tab.preview.items?.map((item) => (
          <div key={item.name} className="flex items-center gap-4 bg-white/[0.04] rounded-xl p-4 border border-white/[0.06]">
            <div className="flex-1 min-w-0">
              <div className="text-white text-sm font-medium truncate mb-2">{item.name}</div>
              <div className="w-full h-1.5 bg-white/10 rounded-full">
                <div className="h-full rounded-full transition-all" style={{ width: `${item.progress}%`, backgroundColor: item.color }} />
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-white font-bold text-sm">{item.progress}%</div>
              <div className="text-[10px] text-white/40">{item.status}</div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  if (tab.id === 'projects') {
    return (
      <div>
        <div className="text-white/50 text-xs font-semibold tracking-wider uppercase mb-4">{tab.preview.title}</div>
        <div className="grid grid-cols-4 gap-3">
          {tab.preview.columns?.map((col, ci) => (
            <div key={col} className="bg-white/[0.03] rounded-xl border border-white/[0.06] p-3 space-y-2">
              <div className="text-white/50 text-[10px] font-semibold uppercase tracking-wider">{col}</div>
              {[1, 2, ci < 2 ? 3 : 0].filter(Boolean).map((j) => (
                <div key={j} className={`bg-white/[0.05] rounded-lg p-2.5 border ${ci === 1 && j === 1 ? 'border-[#5ed29c]/30' : 'border-white/[0.06]'}`}>
                  <div className={`h-1.5 rounded-full mb-2 ${ci === 3 ? 'bg-[#5ed29c]' : ci === 1 ? 'bg-[#5ed29c]/60' : 'bg-white/20'}`} style={{ width: ci === 3 ? '100%' : ci === 1 ? '60%' : '80%' }} />
                  <div className="h-1 rounded bg-white/10 w-2/3" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (tab.id === 'analytics') {
    return (
      <div>
        <div className="text-white/50 text-xs font-semibold tracking-wider uppercase mb-4">{tab.preview.title}</div>
        <div className="flex items-end gap-3 h-40">
          {tab.preview.bars?.map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full rounded-t-lg bg-gradient-to-t from-[#5ed29c]/60 to-[#5ed29c] relative" style={{ height: `${h}%` }}>
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] text-[#5ed29c] font-bold">{h}%</div>
              </div>
              <div className="text-white/30 text-[10px]">W{i + 1}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (tab.id === 'tasks') {
    return (
      <div>
        <div className="text-white/50 text-xs font-semibold tracking-wider uppercase mb-4">{tab.preview.title}</div>
        <div className="space-y-2">
          {tab.preview.tasks?.map((task) => (
            <div key={task.name} className={`flex items-center gap-3 p-3 rounded-xl border ${task.done ? 'bg-[#5ed29c]/5 border-[#5ed29c]/20' : 'bg-white/[0.03] border-white/[0.06]'}`}>
              <div className={`w-4 h-4 rounded flex items-center justify-center border ${task.done ? 'bg-[#5ed29c] border-[#5ed29c]' : 'border-white/20'}`}>
                {task.done && <svg viewBox="0 0 10 8" className="w-2.5 h-2.5"><path d="M1 4l3 3 5-6" stroke="#070b0a" strokeWidth="1.5" fill="none" strokeLinecap="round" /></svg>}
              </div>
              <span className={`flex-1 text-sm ${task.done ? 'line-through text-white/30' : 'text-white'}`}>{task.name}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${task.priority === 'High' ? 'bg-red-500/15 text-red-400' : task.priority === 'Medium' ? 'bg-yellow-500/15 text-yellow-400' : 'bg-white/5 text-white/40'}`}>{task.priority}</span>
              <span className="text-[10px] text-white/35">{task.due}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
}

export function ProductSection() {
  const [active, setActive] = useState('dashboard');
  const tab = TABS.find(t => t.id === active)!;

  return (
    <section id="product" className="py-24 lg:py-32 bg-[#070b0a]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="text-center mb-16">
          <span className="text-[11px] font-bold tracking-[0.2em] text-[#5ed29c] uppercase mb-4 block">Product Showcase</span>
          <h2 className="text-3xl lg:text-5xl font-black text-white mb-4">See Tracksy <span className="text-[#5ed29c]">In Action</span></h2>
          <p className="text-white/55 text-lg max-w-xl mx-auto">Explore every powerful feature built for high-performing teams.</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {TABS.map(t => {
            const Icon = t.icon;
            const isActive = active === t.id;
            return (
              <button key={t.id} onClick={() => setActive(t.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${isActive ? 'bg-[#5ed29c] text-[#070b0a] shadow-lg shadow-[#5ed29c]/25' : 'bg-white/[0.05] text-white/60 hover:text-white border border-white/[0.08] hover:border-white/20'}`}
              >
                <Icon className="w-4 h-4" />{t.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.4 }}
            className="grid lg:grid-cols-2 gap-12 items-center"
          >
            {/* Left: Text */}
            <div>
              <h3 className="text-2xl lg:text-3xl font-black text-white mb-4">{tab.headline}</h3>
              <p className="text-white/60 text-lg leading-relaxed mb-8">{tab.desc}</p>
              <a href="/register" className="inline-flex items-center gap-2 bg-[#5ed29c] text-[#070b0a] font-bold px-6 py-3 rounded-full text-sm hover:bg-[#4bc28a] transition-colors">
                Try {tab.label} Free →
              </a>
            </div>
            {/* Right: Preview */}
            <div className="relative rounded-2xl border border-white/[0.08] bg-[#0b1120]/80 p-6 backdrop-blur-sm shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-[#5ed29c]/5 to-transparent rounded-2xl pointer-events-none" />
              <TabPreview tab={tab} />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
