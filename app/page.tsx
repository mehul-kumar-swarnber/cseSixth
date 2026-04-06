'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'
const AdminLogin = dynamic(() => import('./AdminLogin'), { ssr: false })
const AdminPanel = dynamic(() => import('./AdminPanel'), { ssr: false })
import { Bell, BookOpen, FileText, User, X, ChevronLeft, ChevronRight, Clock, Calendar, LogOut, Plus, Trash2, Menu } from 'lucide-react'
import { FaCogs, FaProjectDiagram, FaRobot, FaGlobe, FaCloud, FaComments, FaUtensils, FaBook, FaAndroid } from 'react-icons/fa'
import { IconType } from 'react-icons'
import clsx from 'clsx'

type TimetableSlot = {
  subject: string;
  room: string;
}
type DaySchedule = {
  [timeSlot: string]: TimetableSlot;
}
type Announcement = {
  _id?: string;
  id?: string;
  title: string;
  body: string;
  allotmentDate: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
}

const timetable: Record<string, DaySchedule> = {
  Monday: {
    "10:30-11:30": { subject: "CD", room: "C-305" },
    "11:30-12:30": { subject: "CC", room: "C-305" },
    "12:30-1:30": { subject: "CC", room: "C-305" },
    "1:30-2:00": { subject: "LUNCH", room: "C-305" },
    "2:00-3:00": { subject: "ANDROID LAB (B1)/WT LAB (B2)", room: "Lab 312/311" },
    "3:00-4:00": { subject: "ANDROID LAB (B1)/WT LAB (B2)", room: "Lab 312/311" },
    "4:00-5:00": { subject: "Library", room: "A block" },
  },
  Tuesday: {
    "10:30-11:30": { subject: "AI", room: "C-305" },
    "11:30-12:30": { subject: "CD", room: "C-305" },
    "12:30-1:30": { subject: "SEPM(T)/AI(T)", room: "C-305" },
    "1:30-2:00": { subject: "LUNCH", room: "C-305" },
    "2:00-3:00": { subject: "WT", room: "C-305" },
    "3:00-4:00": { subject: "CC", room: "C-305" },
    "4:00-5:00": { subject: "CD", room: "C-305" },
  },
  Wednesday: {
    "10:30-11:30": { subject: "CC", room: "C-305" },
    "11:30-12:30": { subject: "AI LAB (B1)/SEPM LAB (B2)", room: "Lab 212/311" },
    "12:30-1:30": { subject: "AI LAB (B1)/SEPM LAB (B2)", room: "Lab 212/311" },
    "1:30-2:00": { subject: "LUNCH", room: "C-305" },
    "2:00-3:00": { subject: "WT(T)/CD(T)", room: "C-305" },
    "3:00-4:00": { subject: "WT", room: "C-305" },
    "4:00-5:00": { subject: "TCSS", room: "C-305" },
  },
  Thursday: {
    "10:30-11:30": { subject: "CC", room: "C-305" },
    "11:30-12:30": { subject: "WT LAB (B1)/ANDROID LAB (B2)", room: "Lab 311/312" },
    "12:30-1:30": { subject: "WT LAB (B1)/ANDROID LAB (B2)", room: "Lab 311/312" },
    "1:30-2:00": { subject: "LUNCH", room: "Cafeteria" },
    "2:00-3:00": { subject: "CD(T)/WT(T)", room: "C-305" },
    "3:00-4:00": { subject: "AI(T)/SEPM(T)", room: "C-305" },
    "4:00-5:00": { subject: "CD", room: "C-305" },
  },
  Friday: {
    "10:30-11:30": { subject: "WT", room: "C-305" },
    "11:30-12:30": { subject: "AI", room: "C-305" },
    "12:30-1:30": { subject: "SEPM", room: "C-305" },
    "1:30-2:00": { subject: "LUNCH", room: "C-305" },
    "2:00-3:00": { subject: "SEPM LAB (B1)/AI LAB (B2)", room: "Lab 311/212" },
    "3:00-4:00": { subject: "SEPM LAB (B1)/AI LAB (B2)", room: "Lab 311/212" },
    "4:00-5:00": { subject: "TCSS", room: "C-305" },
  },
  Saturday: {
    "10:30-11:30": { subject: "SEPM", room: "C-305" },
    "11:30-12:30": { subject: "SEPM", room: "C-305" },
    "12:30-1:30": { subject: "AI", room: "C-305" },
    "1:30-2:00": { subject: "AI", room: "C-305" },
  },
};

const subjectIcons: Record<string, IconType> = {
  CD: FaCogs,
  SEPM: FaProjectDiagram,
  AI: FaRobot,
  WT: FaGlobe,
  CC: FaCloud,
  TCSS: FaComments,
  LUNCH: FaUtensils,
  LIBRARY: FaBook,
  ANDROID: FaAndroid,
};

const subjectColors: Record<string, string> = {
  CD: 'from-violet-500/20 to-purple-500/10 border-violet-500/30 text-violet-300',
  SEPM: 'from-blue-500/20 to-cyan-500/10 border-blue-500/30 text-blue-300',
  AI: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-300',
  WT: 'from-sky-500/20 to-blue-500/10 border-sky-500/30 text-sky-300',
  CC: 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-300',
  TCSS: 'from-pink-500/20 to-rose-500/10 border-pink-500/30 text-pink-300',
  LUNCH: 'from-orange-500/20 to-yellow-500/10 border-orange-500/30 text-orange-300',
  LIBRARY: 'from-indigo-500/20 to-blue-500/10 border-indigo-500/30 text-indigo-300',
  ANDROID: 'from-green-500/20 to-emerald-500/10 border-green-500/30 text-green-300',
};

function getToday() {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return days[new Date().getDay()];
}

function Modal({ open, onClose, children, title, maxWidth = 'max-w-2xl' }: {
  open: boolean; onClose: () => void; children: React.ReactNode; title?: string; maxWidth?: string;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backdropFilter: 'blur(16px)', background: 'rgba(0,0,0,0.7)' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className={clsx('relative w-full rounded-2xl flex flex-col', maxWidth)}
        style={{
          background: 'linear-gradient(145deg, rgba(15,15,30,0.98) 0%, rgba(20,20,45,0.98) 100%)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 25px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)',
          maxHeight: '90vh',
        }}
      >
        {title && (
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
            <h2 className="text-lg font-semibold text-white tracking-tight">{title}</h2>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        {!title && (
          <button onClick={onClose} className="absolute top-4 right-4 z-10 p-1.5 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        )}
        <div className="overflow-y-auto flex-1">
          {children}
        </div>
      </motion.div>
    </div>
  );
}

const priorityConfig = {
  High: { dot: 'bg-red-400', badge: 'bg-red-500/10 text-red-400 border-red-500/20', label: 'High' },
  Medium: { dot: 'bg-amber-400', badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20', label: 'Medium' },
  Low: { dot: 'bg-emerald-400', badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', label: 'Low' },
};

export default function Home() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [notes, setNotes] = useState<any[]>([])
  const [currentAnnounce, setCurrentAnnounce] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [showAdmin, setShowAdmin] = useState(false)
  const [adminPanel, setAdminPanel] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [now, setNow] = useState(new Date())
  const [isAdmin, setIsAdmin] = useState(false)
  const [showAddAnnouncement, setShowAddAnnouncement] = useState(false)
  const [newAnnForm, setNewAnnForm] = useState({ title: '', body: '', allotmentDate: '', dueDate: '', priority: 'Medium' as 'High' | 'Medium' | 'Low' })
  const [showFileInfo, setShowFileInfo] = useState(false)
  const [showWeeklyTT, setShowWeeklyTT] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('isAdmin') === 'true') {
      setAdminPanel(true)
      setIsAdmin(true)
    } else {
      setIsAdmin(false)
    }
  }, [])

  useEffect(() => {
    fetch('/api/announcements')
      .then(r => r.json())
      .then(data => { setAnnouncements(Array.isArray(data) ? data : []) })
  }, [])

  useEffect(() => {
    fetch('/api/notes')
      .then(r => r.json())
      .then(data => { setNotes(Array.isArray(data) ? data : []) })
  }, [])

  useEffect(() => {
    if (announcements.length === 0) return;
    if (!mounted) setMounted(true);
    const interval = setInterval(() => {
      setCurrentAnnounce((prev) => (prev + 1) % announcements.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [announcements.length, mounted])

  useEffect(() => {
    setMounted(true)
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const today = getToday();
  const todayTable = timetable[today] || {};
  const periodEntries = Object.entries(todayTable);

  function toMins(t: string) {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
  }
  function getCurrentSlot() {
  const n = new Date();
  const current = n.getHours() * 60 + n.getMinutes();
  for (const [slot] of periodEntries) {
    const [start, end] = slot.split('-');
    if (!end) continue;
    if (current >= toMins(start) && current < toMins(end)) return slot;
  }
  return null;
  }
  const currentSlot = getCurrentSlot();

  function getIconKey(subject: string) {
    let key = subject.split(' ')[0].replace(/[^A-Z]/g, '');
    if (key === 'LUNCH') return 'LUNCH';
    if (key === 'LIBRARY') return 'LIBRARY';
    if (key === 'ANDROID') return 'ANDROID';
    return key;
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        * { font-family: 'Sora', sans-serif; }
        code, .mono { font-family: 'JetBrains Mono', monospace; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }

        .noise-bg::before {
          content: '';
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          opacity: 0.03;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          background-repeat: repeat;
          background-size: 128px;
        }

        .glow-orb-1 {
          position: fixed; top: -20%; left: -10%; width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%);
          border-radius: 50%; pointer-events: none; z-index: 0;
        }
        .glow-orb-2 {
          position: fixed; bottom: -20%; right: -10%; width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(168,85,247,0.10) 0%, transparent 70%);
          border-radius: 50%; pointer-events: none; z-index: 0;
        }
        .glow-orb-3 {
          position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
          width: 800px; height: 800px;
          background: radial-gradient(circle, rgba(14,165,233,0.04) 0%, transparent 65%);
          border-radius: 50%; pointer-events: none; z-index: 0;
        }

        .card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          backdrop-filter: blur(20px);
        }
        .card-hover { transition: all 0.2s ease; }
        .card-hover:hover {
          background: rgba(255,255,255,0.05);
          border-color: rgba(255,255,255,0.12);
          transform: translateY(-1px);
        }

        .active-slot {
          background: linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(139,92,246,0.15) 100%);
          border-color: rgba(99,102,241,0.5) !important;
          box-shadow: 0 0 20px rgba(99,102,241,0.15), inset 0 1px 0 rgba(255,255,255,0.08);
        }

        .badge {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 2px 8px; border-radius: 6px; font-size: 11px;
          font-weight: 500; border: 1px solid; letter-spacing: 0.01em;
        }

        .shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent);
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        .time-display {
          font-family: 'JetBrains Mono', monospace;
          font-variant-numeric: tabular-nums;
          letter-spacing: -0.02em;
        }

        input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.5); cursor: pointer; }
      `}</style>

      <div className="noise-bg min-h-screen relative" style={{ background: 'linear-gradient(160deg, #080810 0%, #0d0d1f 40%, #0a0a18 100%)' }}>
        <div className="glow-orb-1" />
        <div className="glow-orb-2" />
        <div className="glow-orb-3" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">

          {/* ── NAVBAR ── */}
          <motion.nav
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="flex items-center justify-between py-6"
          >
            <div className="flex items-center gap-3">
              <button onClick={() => setShowAdmin(true)} className="focus:outline-none group">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                    <span className="text-white text-xs font-bold">CS</span>
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm leading-none group-hover:text-indigo-300 transition-colors">CSE 6th Sem</div>
                    <div className="text-gray-500 text-[11px] mt-0.5 mono">GEC Raipur · CSVTU</div>
                  </div>
                </div>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowModal(true)}
                className="relative p-2 rounded-xl transition-all hover:bg-white/[0.06]"
                style={{ border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <Bell className="w-4 h-4 text-gray-400" />
                {announcements.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-400 rounded-full" />
                )}
              </button>

              {isAdmin ? (
                <button
                  onClick={() => { localStorage.removeItem('isAdmin'); setAdminPanel(false); setIsAdmin(false); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-gray-400 hover:text-white transition-all hover:bg-white/[0.06]"
                  style={{ border: '1px solid rgba(255,255,255,0.07)' }}
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Logout
                </button>
              ) : (
                <button
                  onClick={() => setShowAdmin(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-gray-400 hover:text-white transition-all hover:bg-white/[0.06]"
                  style={{ border: '1px solid rgba(255,255,255,0.07)' }}
                >
                  <User className="w-3.5 h-3.5" />
                  Admin
                </button>
              )}
            </div>
          </motion.nav>

          {/* ── ANNOUNCEMENT HERO ── */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8"
          >
            {announcements.length > 0 ? (
              <div className="relative overflow-hidden rounded-2xl" style={{
                background: 'linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(139,92,246,0.08) 50%, rgba(14,165,233,0.06) 100%)',
                border: '1px solid rgba(99,102,241,0.2)',
                boxShadow: '0 0 60px rgba(99,102,241,0.08)'
              }}>
                <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.6), transparent)' }} />

                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentAnnounce}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className="p-6 sm:p-8"
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] mono text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded-md border border-indigo-500/20">ANNOUNCEMENT</span>
                        <span className={clsx('badge', priorityConfig[announcements[currentAnnounce].priority].badge)}>
                          <span className={clsx('w-1.5 h-1.5 rounded-full', priorityConfig[announcements[currentAnnounce].priority].dot)} />
                          {announcements[currentAnnounce].priority}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button onClick={() => setCurrentAnnounce((currentAnnounce - 1 + announcements.length) % announcements.length)}
                          className="p-1.5 rounded-lg hover:bg-white/10 text-gray-500 hover:text-white transition-all">
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="text-xs text-gray-500 mono">{currentAnnounce + 1}/{announcements.length}</span>
                        <button onClick={() => setCurrentAnnounce((currentAnnounce + 1) % announcements.length)}
                          className="p-1.5 rounded-lg hover:bg-white/10 text-gray-500 hover:text-white transition-all">
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-semibold text-white mb-2 leading-snug">
                      {announcements[currentAnnounce].title}
                    </h2>
                    <p className="text-gray-400 text-sm leading-relaxed mb-5">
                      {announcements[currentAnnounce].body}
                    </p>

                    <div className="flex flex-wrap gap-3">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        <span>Allotted <span className="text-gray-300 font-medium">{announcements[currentAnnounce].allotmentDate}</span></span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>Due <span className="text-gray-300 font-medium">{announcements[currentAnnounce].dueDate}</span></span>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Progress dots */}
                <div className="flex items-center gap-1.5 px-8 pb-5">
                  {announcements.map((_, i) => (
                    <button key={i} onClick={() => setCurrentAnnounce(i)}
                      className={clsx('transition-all rounded-full', i === currentAnnounce ? 'w-5 h-1.5 bg-indigo-400' : 'w-1.5 h-1.5 bg-white/20 hover:bg-white/40')}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="card p-8 text-center">
                <Bell className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No announcements yet</p>
              </div>
            )}
          </motion.section>

          {/* ── MAIN GRID ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">

            {/* Clock Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="card p-6 flex flex-col items-center justify-center text-center"
            >
              <div className="text-[11px] mono text-gray-500 uppercase tracking-widest mb-4">Live Clock</div>
              <div className="time-display text-4xl sm:text-5xl font-light text-white mb-2" style={{ letterSpacing: '-0.03em' }}>
                {mounted ? now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '--:--:--'}
              </div>
              <div className="text-gray-500 text-sm mt-1">
                {mounted ? now.toLocaleDateString(undefined, { weekday: 'long' }) : ''}
                {mounted && <span className="mx-1.5 text-gray-700">·</span>}
                {mounted ? now.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
              </div>

              {currentSlot && (
                <div className="mt-5 w-full p-3 rounded-xl" style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
                  <div className="text-[10px] mono text-indigo-400 mb-1">NOW IN CLASS</div>
                  <div className="text-white font-medium text-sm">{todayTable[currentSlot]?.subject}</div>
                  <div className="text-gray-500 text-xs mono">{currentSlot} · {todayTable[currentSlot]?.room}</div>
                </div>
              )}

              {/* Quick action buttons below clock */}
              <div className="flex gap-2 mt-5 w-full">
                <button
                  onClick={() => window.location.href = '/notes'}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:text-white transition-all card-hover"
                  style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)' }}
                >
                  <BookOpen className="w-4 h-4" />
                  Notes
                </button>
                <button
                  onClick={() => setShowFileInfo(true)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:text-white transition-all card-hover"
                  style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)' }}
                >
                  <FileText className="w-4 h-4" />
                  Files
                </button>
              </div>
            </motion.div>

            {/* Today's Timetable */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-2 card overflow-hidden"
            >
              <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div>
                  <div className="text-[10px] mono text-gray-500 uppercase tracking-widest mb-0.5">Schedule</div>
                  <div className="text-white font-semibold">{today}'s Timetable</div>
                </div>
                <button
                  onClick={() => setShowWeeklyTT(true)}
                  className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors px-3 py-1.5 rounded-lg hover:bg-indigo-500/10 border border-transparent hover:border-indigo-500/20"
                >
                  Weekly View →
                </button>
              </div>

              <div className="p-3 space-y-1 max-h-80 overflow-y-auto">
                {periodEntries.length === 0 ? (
                  <div className="py-10 text-center text-gray-500 text-sm">No classes today — enjoy your day!</div>
                ) : (
                  periodEntries.map(([slot, { subject, room }], i) => {
                    const iconKey = getIconKey(subject);
                    const Icon = subjectIcons[iconKey] || FaBook;
                    const isActive = slot === currentSlot;
                    const colorClass = subjectColors[iconKey] || subjectColors['LIBRARY'];

                    return (
                      <div
                        key={i}
                        className={clsx(
                          'flex items-center justify-between px-4 py-3 rounded-xl border transition-all',
                          isActive
                            ? 'active-slot border-indigo-500/40'
                            : 'border-transparent hover:bg-white/[0.03] hover:border-white/[0.06]'
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className={clsx('w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br shrink-0', colorClass.split(' ').slice(0,2).join(' '))}>
                            <Icon className={clsx('w-3.5 h-3.5', colorClass.split(' ')[3])} />
                          </div>
                          <div>
                            <div className={clsx('font-medium text-sm', isActive ? 'text-white' : 'text-gray-200')}>{subject}</div>
                            <div className="text-gray-500 text-xs">{room}</div>
                          </div>
                        </div>
                        <div className={clsx('mono text-xs px-2.5 py-1 rounded-lg', isActive ? 'text-indigo-300 bg-indigo-500/20' : 'text-gray-500 bg-white/[0.04]')}>
                          {slot}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </motion.div>
          </div>

          {/* ── SYLLABUS ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="card overflow-hidden"
          >
            <div className="px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="text-[10px] mono text-gray-500 uppercase tracking-widest mb-0.5">Reference</div>
              <div className="text-white font-semibold">Syllabus PDF</div>
            </div>
            <div className="p-4">
              <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                <iframe
                  src="/assets/syllabus/syllabus.pdf"
                  title="CSE 6th Sem Syllabus"
                  className="w-full"
                  style={{ height: '65vh', border: 'none', display: 'block' }}
                  allowFullScreen
                />
              </div>
            </div>
          </motion.div>

        </div>

        {/* ── FOOTER ── */}
        <footer className="relative z-10 text-center py-6">
          <span className="text-gray-600 text-xs mono">© Meer 2026</span>
        </footer>
      </div>

      {/* ── ANNOUNCEMENTS MODAL ── */}
      <AnimatePresence>
        {showModal && (
          <Modal open={showModal} onClose={() => setShowModal(false)} title="Announcements" maxWidth="max-w-xl">
            <div className="p-5 space-y-3">
              {isAdmin && (
                <button
                  onClick={() => { setShowAddAnnouncement(true); setShowModal(false); }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-indigo-400 hover:text-white transition-all"
                  style={{ border: '1px dashed rgba(99,102,241,0.4)', background: 'rgba(99,102,241,0.05)' }}
                >
                  <Plus className="w-4 h-4" />
                  Add Announcement
                </button>
              )}

              {announcements.length === 0 ? (
                <div className="py-10 text-center">
                  <Bell className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No announcements</p>
                </div>
              ) : (
                announcements.map(a => (
                  <div
                    key={a._id || a.id}
                    className="p-4 rounded-xl transition-all"
                    style={{ border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-white font-medium text-sm">{a.title}</span>
                        <span className={clsx('badge', priorityConfig[a.priority].badge)}>
                          <span className={clsx('w-1.5 h-1.5 rounded-full', priorityConfig[a.priority].dot)} />
                          {a.priority}
                        </span>
                      </div>
                      {isAdmin && (
                        <button
                          onClick={async () => {
                            const id = a._id || a.id;
                            const res = await fetch(`/api/announcements?id=${id}`, { method: 'DELETE' });
                            const data = await res.json();
                            if (data.success) {
                              setAnnouncements(anns => anns.filter(x => (x._id || x.id) !== id));
                            } else { alert('Failed to delete.'); }
                          }}
                          className="p-1.5 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-all shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed mb-3">{a.body}</p>
                    <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {a.allotmentDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Due {a.dueDate}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* ── ADD ANNOUNCEMENT MODAL ── */}
      <AnimatePresence>
        {showAddAnnouncement && (
          <Modal open={showAddAnnouncement} onClose={() => setShowAddAnnouncement(false)} title="New Announcement" maxWidth="max-w-md">
            <div className="p-5">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  fetch('/api/announcements', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newAnnForm)
                  }).then(r => r.json()).then(data => {
                    setAnnouncements([...announcements, { ...newAnnForm, _id: data.insertedId }])
                    setNewAnnForm({ title: '', body: '', allotmentDate: '', dueDate: '', priority: 'Medium' })
                    setShowAddAnnouncement(false)
                  })
                }}
                className="space-y-3"
              >
                {[
                  { name: 'title', placeholder: 'Announcement title', type: 'text' },
                ].map(f => (
                  <input
                    key={f.name}
                    type={f.type}
                    placeholder={f.placeholder}
                    value={(newAnnForm as any)[f.name]}
                    onChange={e => setNewAnnForm({ ...newAnnForm, [f.name]: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-gray-600 outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                  />
                ))}
                <textarea
                  placeholder="Description"
                  value={newAnnForm.body}
                  onChange={e => setNewAnnForm({ ...newAnnForm, body: e.target.value })}
                  required
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-gray-600 outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all resize-none"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                />
                <div className="grid grid-cols-2 gap-3">
                  {['allotmentDate', 'dueDate'].map(field => (
                    <div key={field}>
                      <div className="text-[10px] mono text-gray-500 mb-1.5 ml-1">{field === 'allotmentDate' ? 'Allotment Date' : 'Due Date'}</div>
                      <input
                        type="date"
                        value={(newAnnForm as any)[field]}
                        onChange={e => setNewAnnForm({ ...newAnnForm, [field]: e.target.value })}
                        required
                        className="w-full px-3 py-2.5 rounded-xl text-sm text-white outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all"
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  {(['High', 'Medium', 'Low'] as const).map(p => (
                    <button
                      key={p} type="button"
                      onClick={() => setNewAnnForm({ ...newAnnForm, priority: p })}
                      className={clsx(
                        'flex-1 py-2 rounded-xl text-xs font-medium border transition-all',
                        newAnnForm.priority === p
                          ? clsx(priorityConfig[p].badge)
                          : 'text-gray-500 border-white/[0.07] hover:border-white/20 hover:text-gray-300'
                      )}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
                >
                  Post Announcement
                </button>
              </form>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* ── ADMIN LOGIN MODAL ── */}
      <AnimatePresence>
        {showAdmin && !adminPanel && (
          <Modal open={showAdmin} onClose={() => setShowAdmin(false)} title="Admin Access" maxWidth="max-w-sm">
            <div className="p-5">
              <AdminLogin onSuccess={() => { setShowAdmin(false); setIsAdmin(true); }} />
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* ── ADMIN PANEL MODAL ── */}
      <AnimatePresence>
        {adminPanel && (
          <Modal open={adminPanel} onClose={() => setAdminPanel(false)} title="Admin Panel" maxWidth="max-w-2xl">
            <div className="p-5">
              <AdminPanel onClose={() => setAdminPanel(false)} onRefresh={() => {}} />
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* ── WEEKLY TIMETABLE MODAL ── */}
      {/* <AnimatePresence>
        {showWeeklyTT && (
          <Modal open={showWeeklyTT} onClose={() => setShowWeeklyTT(false)} title="Weekly Timetable" maxWidth="max-w-3xl">
            <div className="p-5">
              <img
                src="/assets/tt/weekly.jpeg"
                alt="Weekly Timetable"
                className="w-full rounded-xl"
                style={{ border: '1px solid rgba(255,255,255,0.07)' }}
              />
            </div>
          </Modal>
        )}
      </AnimatePresence> */}
      {/* ── WEEKLY TIMETABLE MODAL ── */}
<AnimatePresence>
  {showWeeklyTT && (
    <Modal open={showWeeklyTT} onClose={() => setShowWeeklyTT(false)} title="Weekly Timetable" maxWidth="max-w-5xl">
      <div className="p-5 overflow-x-auto">
        {(() => {
          const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
          const allSlots = Array.from(
            new Set(days.flatMap(d => Object.keys(timetable[d] || {})))
          ).sort((a, b) => {
  const toM = (t: string) => {
    const [h, m] = t.trim().split(':').map(Number);
    const adjusted = (h < 9) ? h + 12 : h;
    return adjusted * 60 + (m || 0);
  };
  return toM(a.split('-')[0]) - toM(b.split('-')[0]);
});

          const getColorStyle = (subject: string) => {
            const key = subject.split(' ')[0].replace(/[^A-Z]/g, '');
            const map: Record<string, { bg: string; border: string; text: string }> = {
              CD:      { bg: 'rgba(139,92,246,0.12)',  border: 'rgba(139,92,246,0.3)',  text: '#a78bfa' },
              SEPM:    { bg: 'rgba(59,130,246,0.12)',  border: 'rgba(59,130,246,0.3)',  text: '#93c5fd' },
              AI:      { bg: 'rgba(16,185,129,0.12)',  border: 'rgba(16,185,129,0.3)',  text: '#6ee7b7' },
              WT:      { bg: 'rgba(14,165,233,0.12)',  border: 'rgba(14,165,233,0.3)',  text: '#7dd3fc' },
              CC:      { bg: 'rgba(245,158,11,0.12)',  border: 'rgba(245,158,11,0.3)',  text: '#fcd34d' },
              TCSS:    { bg: 'rgba(236,72,153,0.12)',  border: 'rgba(236,72,153,0.3)',  text: '#f9a8d4' },
              LUNCH:   { bg: 'rgba(249,115,22,0.10)',  border: 'rgba(249,115,22,0.25)', text: '#fdba74' },
              LIBRARY: { bg: 'rgba(99,102,241,0.10)',  border: 'rgba(99,102,241,0.25)', text: '#a5b4fc' },
              ANDROID: { bg: 'rgba(34,197,94,0.12)',   border: 'rgba(34,197,94,0.3)',   text: '#86efac' },
            };
            return map[key] || { bg: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.1)', text: '#9ca3af' };
          };

          const todayName = getToday();

          return (
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0', minWidth: '640px' }}>
              <thead>
                <tr>
                  <th style={{
                    padding: '10px 14px', textAlign: 'left', fontSize: '11px',
                    fontFamily: "'JetBrains Mono', monospace", color: 'rgba(255,255,255,0.3)',
                    fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase',
                    borderBottom: '1px solid rgba(255,255,255,0.07)', whiteSpace: 'nowrap',
                    width: '110px'
                  }}>
                    Time
                  </th>
                  {days.map(day => (
                    <th key={day} style={{
                      padding: '10px 10px', textAlign: 'center', fontSize: '12px',
                      fontWeight: 500, letterSpacing: '0.02em',
                      color: day === todayName ? '#818cf8' : 'rgba(255,255,255,0.5)',
                      borderBottom: '1px solid rgba(255,255,255,0.07)',
                      background: day === todayName ? 'rgba(99,102,241,0.06)' : 'transparent',
                      borderRadius: day === todayName ? '8px 8px 0 0' : '0',
                      minWidth: '120px'
                    }}>
                      {day === todayName ? (
                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#818cf8', display: 'inline-block', flexShrink: 0 }} />
                          {day}
                        </span>
                      ) : day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allSlots.map((slot, si) => {
                  const isLast = si === allSlots.length - 1;
                  return (
                    <tr key={slot}>
                      <td style={{
                        padding: '8px 14px', fontSize: '11px',
                        fontFamily: "'JetBrains Mono', monospace",
                        color: 'rgba(255,255,255,0.3)', whiteSpace: 'nowrap',
                        borderBottom: isLast ? 'none' : '1px solid rgba(255,255,255,0.04)',
                        verticalAlign: 'middle'
                      }}>
                        {slot}
                      </td>
                      {days.map(day => {
                        const cell = timetable[day]?.[slot];
                        const isToday = day === todayName;
                        const isActive = isToday && slot === currentSlot;
                        const style = cell ? getColorStyle(cell.subject) : null;

                        return (
                          <td key={day} style={{
                            padding: '5px 6px',
                            borderBottom: isLast ? 'none' : '1px solid rgba(255,255,255,0.04)',
                            background: isToday ? 'rgba(99,102,241,0.04)' : 'transparent',
                            verticalAlign: 'middle'
                          }}>
                            {cell ? (
                              <div style={{
                                padding: '7px 10px', borderRadius: '9px',
                                background: isActive ? 'rgba(99,102,241,0.25)' : style!.bg,
                                border: `1px solid ${isActive ? 'rgba(99,102,241,0.55)' : style!.border}`,
                                boxShadow: isActive ? '0 0 12px rgba(99,102,241,0.15)' : 'none',
                                transition: 'all 0.2s',
                              }}>
                                <div style={{
                                  fontSize: '11px', fontWeight: 600, color: isActive ? '#c7d2fe' : style!.text,
                                  lineHeight: 1.3, marginBottom: '2px'
                                }}>
                                  {cell.subject}
                                </div>
                                <div style={{
                                  fontSize: '10px', color: 'rgba(255,255,255,0.3)',
                                  fontFamily: "'JetBrains Mono', monospace"
                                }}>
                                  {cell.room}
                                </div>
                              </div>
                            ) : (
                              <div style={{ padding: '7px 10px', color: 'rgba(255,255,255,0.08)', fontSize: '18px', textAlign: 'center' }}>—</div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          );
        })()}

        {/* Legend */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {[
            { key: 'CD', label: 'CD', color: '#a78bfa' },
            { key: 'SEPM', label: 'SEPM', color: '#93c5fd' },
            { key: 'AI', label: 'AI', color: '#6ee7b7' },
            { key: 'WT', label: 'WT', color: '#7dd3fc' },
            { key: 'CC', label: 'CC', color: '#fcd34d' },
            { key: 'TCSS', label: 'TCSS', color: '#f9a8d4' },
            { key: 'LUNCH', label: 'Lunch', color: '#fdba74' },
          ].map(({ key, label, color }) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: color, display: 'inline-block', opacity: 0.8 }} />
              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', fontFamily: "'JetBrains Mono', monospace" }}>{label}</span>
            </div>
          ))}
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginLeft: 'auto' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#818cf8', display: 'inline-block' }} />
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', fontFamily: "'JetBrains Mono', monospace" }}>Today</span>
          </div>
        </div>
      </div>
    </Modal>
  )}
      </AnimatePresence>

      {/* ── FILE INFORMATION MODAL ── */}
      <AnimatePresence>
        {showFileInfo && (
          <Modal open={showFileInfo} onClose={() => setShowFileInfo(false)} title="File Information" maxWidth="max-w-2xl">
            <div className="p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { subject: 'Android', color: 'bg-red-400', fileType: 'Cobra File', fileColor: 'Any color', left: 'Code/Output', right: 'Code/Output', pageType: 'Blank A4' },
                  { subject: 'AI', color: 'bg-blue-400', fileType: 'Office File', fileColor: 'Transparent', left: 'Output', right: 'Code', pageType: 'Blank A4' },
                  { subject: 'WT', color: 'bg-emerald-400', fileType: 'Cobra File', fileColor: 'Any color', left: 'Code/Output', right: 'Code/Output', pageType: 'Blank A4' },
                  // { subject: 'Networks', color: 'bg-amber-400', fileType: 'Assignment File', fileColor: 'Yellow', left: 'Theory/Notes', right: 'Diagrams/Examples', pageType: 'Ruled' },
                  // { subject: 'Maths', color: 'bg-orange-400', fileType: 'Assignment File', fileColor: 'Orange', left: 'Questions', right: 'Solutions', pageType: 'Ruled', full: true },
                ].map(({ subject, color, fileType, fileColor, left, right, pageType, full }) => (
                  <div
                    key={subject}
                    className={clsx('p-4 rounded-xl card-hover', full && 'sm:col-span-2')}
                    style={{ border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className={clsx('w-2.5 h-2.5 rounded-full', color)} />
                      <span className="text-white font-medium text-sm">{subject}</span>
                    </div>
                    <div className="space-y-1.5">
                      {[
                        ['Type', fileType],
                        ['Color', fileColor],
                        ['Left Page', left],
                        ['Right Page', right],
                        ['Pages', pageType],
                      ].map(([k, v]) => (
                        <div key={k} className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">{k}</span>
                          <span className="text-gray-300 font-medium">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </>
  )
}
