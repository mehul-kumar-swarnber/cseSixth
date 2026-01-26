'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'
const AdminLogin = dynamic(() => import('./AdminLogin'), { ssr: false })
const AdminPanel = dynamic(() => import('./AdminPanel'), { ssr: false })
import { Bell, Search, Calendar, BookOpen, FileText, User } from 'lucide-react'
import { FaCogs, FaProjectDiagram, FaRobot, FaGlobe, FaCloud, FaComments, FaUtensils, FaBook, FaAndroid } from 'react-icons/fa'
import clsx from 'clsx'

// Timetable with time slots, subject, icon, and room number
const timetable = {
  Monday: {
    "10:30-11:30": { subject: "CD", room: "C-305" },
    "11:30-12:30": { subject: "SEPM", room: "C-305" },
    "12:30-1:30": { subject: "CC", room: "C-305" },
    "1:30-2:00": { subject: "LUNCH", room: "C-305" },
    "2:00-3:00": { subject: "ANDROID LAB (B1)/WT LAB (B2)", room: "Lab 1/2" },
    "3:00-4:00": { subject: "ANDROID LAB (B1)/WT LAB (B2)", room: "Lab 1/2" },
    "4:00-5:00": { subject: "TCSS", room: "C-305" },
  },
  Tuesday: {
    "10:30-11:30": { subject: "AI", room: "C-305" },
    "11:30-12:30": { subject: "CC", room: "C-305" },
    "12:30-1:30": { subject: "SEPM(T)/AI(T)", room: "202/205" },
    "1:30-2:00": { subject: "LUNCH", room: "C-305" },
    "2:00-3:00": { subject: "WT", room: "C-305" },
    "3:00-4:00": { subject: "CC", room: "C-305" },
    "4:00-5:00": { subject: "LIBRARY", room: "Library" },
  },
  Wednesday: {
    "10:30-11:30": { subject: "AI", room: "C-305" },
    "11:30-12:30": { subject: "AI LAB (B1)/SEPM LAB (B2)", room: "Lab 3/4" },
    "12:30-1:30": { subject: "AI LAB (B1)/SEPM LAB (B2)", room: "Lab 3/4" },
    "1:30-2:00": { subject: "LUNCH", room: "C-305" },
    "2:00-3:00": { subject: "WT(T)/CD(T)", room: "206/201" },
    "3:00-4:00": { subject: "AI(T)/SEPM(T)", room: "205/202" },
    "4:00-5:00": { subject: "TCSS", room: "C-305" },
  },
  Thursday: {
    "10:30-11:30": { subject: "CC", room: "C-305" },
    "11:30-12:30": { subject: "WT LAB (B1)/ANDROID LAB (B2)", room: "Lab 2/1" },
    "12:30-1:30": { subject: "WT LAB (B1)/ANDROID LAB (B2)", room: "Lab 2/1" },
    "1:30-2:00": { subject: "LUNCH", room: "Cafeteria" },
    "2:00-3:00": { subject: "CD(T)/WT(T)", room: "201/206" },
    "3:00-4:00": { subject: "CD", room: "C-305" },
    "4:00-5:00": { subject: "WT", room: "C-305" },
  },
  Friday: {
    "10:30-11:30": { subject: "WT", room: "C-305" },
    "11:30-12:30": { subject: "CC", room: "C-305" },
    "12:30-1:30": { subject: "CD", room: "C-305" },
    "1:30-2:00": { subject: "LUNCH", room: "C-305" },
    "2:00-3:00": { subject: "SEPM LAB (B1)/AI LAB (B2)", room: "Lab 4/3" },
    "3:00-4:00": { subject: "SEPM LAB (B1)/AI LAB (B2)", room: "Lab 4/3" },
    "4:00-5:00": { subject: "CD", room: "C-305" },
  },
  Saturday: {
    "10:30-11:30": { subject: "SEPM", room: "C-305" },
    "11:30-12:30": { subject: "SEPM", room: "C-305" },
    "12:30-1:30": { subject: "AI", room: "C-305" },
    "1:30-2:00": { subject: "CD", room: "C-305" },
  },
};

// Subject icon mapping (actual components)
const subjectIcons = {
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

function getToday() {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return days[new Date().getDay()];
}

export default function Home() {
  const [announcements, setAnnouncements] = useState([])
  const [notes, setNotes] = useState([])
  const [currentAnnounce, setCurrentAnnounce] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [showAdmin, setShowAdmin] = useState(false)
  const [adminPanel, setAdminPanel] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [now, setNow] = useState(new Date())
  const [isAdmin, setIsAdmin] = useState(false)
  const [showAddAnnouncement, setShowAddAnnouncement] = useState(false)
  const [newAnnForm, setNewAnnForm] = useState({ title: '', body: '', allotmentDate: '', dueDate: '', priority: 'Medium' })
  const [showFileInfo, setShowFileInfo] = useState(false)
  const [showWeeklyTT, setShowWeeklyTT] = useState(false)

  // Check admin login state on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('isAdmin') === 'true') {
      setAdminPanel(true)
      setIsAdmin(true)
    } else {
      setIsAdmin(false)
    }
  }, [])

  // Fetch announcements from API
  useEffect(() => {
    fetch('/api/announcements')
      .then(r => r.json())
      .then(data => {
        setAnnouncements(Array.isArray(data) ? data : [])
      })
  }, [])

  // Fetch notes from API
  useEffect(() => {
    fetch('/api/notes')
      .then(r => r.json())
      .then(data => {
        setNotes(Array.isArray(data) ? data : [])
      })
  }, [])

  // Announcements carousel auto-advance
  useEffect(() => {
    if (announcements.length === 0) return;
    setMounted(true)
    const interval = setInterval(() => {
      setCurrentAnnounce((prev) => (prev + 1) % announcements.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [announcements.length])

  // Time state
  useEffect(() => {
    if (!mounted) return
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [mounted])

  const today = getToday();
  const todayTable = timetable[today] || {};
  const periodEntries = Object.entries(todayTable);

  // Helper to get current slot
  function getCurrentSlot() {
    const now = new Date();
    const pad = n => n.toString().padStart(2, '0');
    const current = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
    for (const [slot] of periodEntries) {
      const [start, end] = slot.split('-');
      if (!end) continue;
      if (current >= start && current < end) return slot;
    }
    return null;
  }
  const currentSlot = getCurrentSlot();
  
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900/20 to-purple-900/20 p-2 sm:p-4 md:p-6 lg:p-8 space-y-8">
        {/* Top Bar */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="flex items-center justify-between max-w-7xl mx-auto"
        >
          <div className="flex items-center space-x-3">
            <button onClick={() => setShowAdmin(true)} aria-label="Admin Login" className="focus:outline-none">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-white to-indigo-300 bg-clip-text text-transparent cursor-pointer">
                CSE 6th Sem
              </h1>
            </button>
          </div>
          
          {/* Admin Login Modal */}
          {showAdmin && !adminPanel && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 w-full max-w-sm p-6 relative animate-fade-in">
                <button
                  className="absolute top-3 right-3 text-gray-300 hover:text-white text-2xl font-bold transition-colors"
                  onClick={() => setShowAdmin(false)}
                  aria-label="Close"
                >
                  &times;
                </button>
                <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent text-center">
                  Admin Login
                </h2>
                <AdminLogin onSuccess={() => { setShowAdmin(false); setIsAdmin(true); }} />
              </div>
            </div>
          )}
          
          {/* Admin Panel Modal */}
          {adminPanel && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 w-full max-w-2xl p-6 relative animate-fade-in max-h-[90vh] overflow-y-auto">
                <div className="flex justify-end mb-2">
                  <button
                    className="text-gray-300 hover:text-white text-sm font-semibold bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-2 transition-all hover:bg-white/20"
                    onClick={() => {
                      localStorage.removeItem('isAdmin');
                      setAdminPanel(false);
                    }}
                    aria-label="Logout"
                  >
                    Logout
                  </button>
                </div>
                <AdminPanel onClose={() => setAdminPanel(false)} onRefresh={() => {}} />
              </div>
            </div>
          )}
          
          <div className="flex items-center space-x-3 relative">
            <button
              aria-label="Show Announcements"
              onClick={() => setShowModal(true)}
              className="relative focus:outline-none bg-white/10 backdrop-blur-md p-2.5 rounded-xl border border-white/20 hover:bg-white/20 transition-all shadow-lg"
            >
              <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-300" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full shadow-lg"></span>
            </button>
            {isAdmin ? (
              <button
                onClick={() => {
                  localStorage.removeItem('isAdmin');
                  setAdminPanel(false);
                  setIsAdmin(false);
                }}
                className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-2xl shadow-indigo-500/25 text-white text-sm font-semibold hover:opacity-90 transition-all backdrop-blur-sm border border-white/20"
                aria-label="Logout"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => setShowAdmin(true)}
                className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-2xl shadow-indigo-500/25 text-white font-bold hover:opacity-90 transition-all backdrop-blur-sm border border-white/20"
                aria-label="Admin Login"
              >
                <User className="w-5 h-5" />
              </button>
            )}
          </div>
          
          {/* Announcements Modal */}
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 w-full max-w-2xl p-6 relative animate-fade-in max-h-[90vh] overflow-hidden flex flex-col">
                <button
                  className="absolute top-3 right-3 text-gray-300 hover:text-white text-2xl font-bold transition-colors z-10"
                  onClick={() => setShowModal(false)}
                  aria-label="Close"
                >
                  &times;
                </button>
                <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
                  Announcements
                </h2>
                {isAdmin && (
                  <button 
                    onClick={() => setShowAddAnnouncement(true)} 
                    className="mb-4 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white rounded-xl p-3 font-semibold w-full border border-white/20 transition-all shadow-lg"
                  >
                    + Add Announcement
                  </button>
                )}
                <div className="space-y-4 overflow-y-auto pr-2 flex-1">
                  {announcements.length === 0 ? (
                    <div className="text-gray-300 text-center py-8">No announcements.</div>
                  ) : (
                    announcements.map(a => (
                      <div 
                        key={a._id || a.id} 
                        className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 shadow-lg hover:bg-white/15 transition-all"
                      >
                        <div className="flex items-start justify-between mb-2 gap-2 flex-wrap">
                          <span className="font-semibold text-indigo-300 text-lg">{a.title}</span>
                          <div className="flex items-center gap-2">
                            <span className={clsx(
                              "text-sm font-semibold px-3 py-1 rounded-full",
                              a.priority === 'High' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                              a.priority === 'Medium' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                              'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                            )}>
                              {a.priority}
                            </span>
                            {isAdmin && (
                              <button
                                className="px-3 py-1 bg-red-500/80 backdrop-blur-sm hover:bg-red-600 text-white rounded-lg text-xs font-bold transition-all border border-red-400/30 shadow-lg"
                                onClick={async () => {
                                  const id = a._id || a.id;
                                  const res = await fetch(`/api/announcements?id=${id}`, { method: 'DELETE' });
                                  const data = await res.json();
                                  if (data.success) {
                                    setAnnouncements(anns => anns.filter(x => (x._id || x.id) !== id));
                                  } else {
                                    alert('Failed to delete announcement.');
                                  }
                                }}
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="text-gray-200 mb-3 leading-relaxed">{a.body}</div>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-300">
                          <span className="bg-white/10 px-3 py-1 rounded-lg">
                            Allotment: <span className="font-semibold">{a.allotmentDate}</span>
                          </span>
                          <span className="bg-white/10 px-3 py-1 rounded-lg">
                            Due: <span className="font-semibold">{a.dueDate}</span>
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Add Announcement Form Modal */}
          {showAddAnnouncement && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 w-full max-w-md p-6 relative animate-fade-in">
                <button
                  className="absolute top-3 right-3 text-gray-300 hover:text-white text-2xl font-bold transition-colors"
                  onClick={() => setShowAddAnnouncement(false)}
                  aria-label="Close"
                >
                  &times;
                </button>
                <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
                  Add Announcement
                </h2>
                <form onSubmit={(e) => {
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
                }} className="flex flex-col gap-3">
                  <input 
                    name="title" 
                    value={newAnnForm.title} 
                    onChange={(e) => setNewAnnForm({...newAnnForm, title: e.target.value})} 
                    placeholder="Title" 
                    className="p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400" 
                    required 
                  />
                  <textarea 
                    name="body" 
                    value={newAnnForm.body} 
                    onChange={(e) => setNewAnnForm({...newAnnForm, body: e.target.value})} 
                    placeholder="Body" 
                    className="p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 min-h-[100px]" 
                    required 
                  />
                  <input 
                    name="allotmentDate" 
                    type="date" 
                    value={newAnnForm.allotmentDate} 
                    onChange={(e) => setNewAnnForm({...newAnnForm, allotmentDate: e.target.value})} 
                    className="p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400" 
                    required 
                  />
                  <input 
                    name="dueDate" 
                    type="date" 
                    value={newAnnForm.dueDate} 
                    onChange={(e) => setNewAnnForm({...newAnnForm, dueDate: e.target.value})} 
                    className="p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400" 
                    required 
                  />
                  <select 
                    name="priority" 
                    value={newAnnForm.priority} 
                    onChange={(e) => setNewAnnForm({...newAnnForm, priority: e.target.value})} 
                    className="p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  >
                    <option value="High" className="bg-gray-800">High Priority</option>
                    <option value="Medium" className="bg-gray-800">Medium Priority</option>
                    <option value="Low" className="bg-gray-800">Low Priority</option>
                  </select>
                  <button 
                    type="submit" 
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 backdrop-blur-sm hover:opacity-90 text-white rounded-xl p-3 font-semibold transition-all shadow-lg border border-white/20"
                  >
                    Add Announcement
                  </button>
                </form>
              </div>
            </div>
          )}
        </motion.div>

        {/* Announcements Carousel */}
        <div className="relative min-h-[200px] sm:min-h-[180px] flex items-center justify-center max-w-7xl mx-auto mt-4 mb-6 sm:mb-8">
          {announcements.length > 0 && (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentAnnounce}
                initial={{ opacity: 0, x: 20, position: 'absolute', width: '100%' }}
                animate={{ opacity: 1, x: 0, position: 'absolute', width: '100%' }}
                exit={{ opacity: 0, x: -20, position: 'absolute', width: '100%' }}
                transition={{ duration: 0.5 }}
                className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/20 overflow-hidden left-0 top-0"
                style={{ minHeight: 180 }}
              >
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">{announcements[currentAnnounce].title}</h2>
                <p className="text-gray-200 mb-4 leading-relaxed">{announcements[currentAnnounce].body}</p>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-3 text-sm text-gray-300">
                    <span className="bg-white/10 px-3 py-1 rounded-lg">
                      Allotment: <span className="font-semibold">{announcements[currentAnnounce].allotmentDate}</span>
                    </span>
                    <span className="bg-white/10 px-3 py-1 rounded-lg">
                      Due: <span className="font-semibold">{announcements[currentAnnounce].dueDate}</span>
                    </span>
                  </div>
                  <span className={clsx(
                    "text-sm font-semibold px-3 py-1 rounded-full",
                    announcements[currentAnnounce].priority === 'High' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                    announcements[currentAnnounce].priority === 'Medium' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                    'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                  )}>
                    {announcements[currentAnnounce].priority} Priority
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
          <div className="absolute left-1/2 transform -translate-x-1/2 flex space-x-2 z-10" style={{ bottom: '-95px' }}>
            {announcements.map((_, i) => (
              <div
                key={i}
                className={clsx(
                  'w-2 h-2 rounded-full transition-all duration-300',
                  i === currentAnnounce ? 'bg-indigo-400 scale-125 shadow-lg' : 'bg-white/30 backdrop-blur-sm'
                )}
              />
            ))}
          </div>
        </div>

        {/* Time + Timetable + Syllabus Section */}
        <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 my-8 mt-30 items-stretch z-10 relative">
          {/* Time Section */}
          <div className="w-full lg:w-1/3 flex flex-col items-center justify-center bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6">
            <h2 className="text-lg font-semibold text-indigo-300 mb-3 tracking-wide">Current Time</h2>
            <div className="text-3xl sm:text-4xl font-bold text-white mb-2">
              {mounted ? now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '--:--:--'}
            </div>
            <div className="text-sm sm:text-base text-gray-300 text-center">
              {mounted ? now.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : ''}
            </div>
            

            {/* Today's Timetable (Mobile/Stacked) */}
            <div className="block lg:hidden w-full mt-6">
              <button
                className="mb-4 ml-auto block bg-white/10 hover:bg-white/20 text-indigo-300 font-semibold px-4 py-2 rounded-xl border border-white/20 shadow transition-all"
                onClick={() => setShowWeeklyTT(true)}
              >
                Weekly View
              </button>
              <div className="w-full bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 divide-y divide-white/10">
                <h2 className="text-xl font-bold text-center py-4 bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
                  Today's Timetable
                </h2>
                {periodEntries.length === 0 ? (
                  <div className="p-6 text-center text-gray-300">No classes today!</div>
                ) : (
                  periodEntries.map(([slot, { subject, room }], i) => {
                    let iconKey = subject.split(' ')[0].replace(/[^A-Z]/g, '');
                    if (iconKey === 'LUNCH') iconKey = 'LUNCH';
                    if (iconKey === 'LIBRARY') iconKey = 'LIBRARY';
                    if (iconKey === 'ANDROID') iconKey = 'ANDROID';
                    const Icon = subjectIcons[iconKey] || FaBook;
                    const isActive = slot === currentSlot;
                    return (
                      <div
                        key={i}
                        className={
                          `flex items-center justify-between p-4 gap-2 transition-all rounded-xl ${isActive ? 'bg-indigo-500/30 border-2 border-indigo-400 shadow-lg scale-[1.03]' : 'hover:bg-white/5'}`
                        }
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-6 h-6 text-indigo-300" />
                          <div className="flex flex-col">
                            <span className="text-base font-semibold text-indigo-300">{subject}</span>
                            <span className="text-xs text-gray-400">Room: {room}</span>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-gray-200 bg-white/10 px-3 py-1 rounded-lg border border-white/20">{slot}</span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
          
          {/* Syllabus PDF Section + Timetable (Desktop) */}
          <div className="w-full lg:w-2/3 flex flex-col bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-4 sm:p-6">
            {/* Timetable for Desktop */}
            <div className="hidden lg:block w-full mb-6">
              <div className="flex justify-end mb-2">
                <button
                  className="bg-white/10 hover:bg-white/20 text-indigo-300 font-semibold px-4 py-2 rounded-xl border border-white/20 shadow transition-all"
                  onClick={() => setShowWeeklyTT(true)}
                >
                  Weekly View
                </button>
              </div>
                    {/* Weekly Timetable Modal (global, for both mobile and desktop) */}
                    {showWeeklyTT && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                        <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl w-full max-w-2xl p-6 relative animate-fade-in max-h-[90vh] overflow-y-auto flex flex-col items-center">
                          <button
                            className="absolute top-3 right-3 text-gray-300 hover:text-white text-2xl font-bold transition-colors"
                            onClick={() => setShowWeeklyTT(false)}
                            aria-label="Close"
                          >
                            &times;
                          </button>
                          <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent text-center">Weekly Timetable</h2>
                          <img src="/assets/tt/weekly.jpeg" alt="Weekly Timetable" className="rounded-xl border border-white/20 shadow-lg max-w-full max-h-[70vh] object-contain" />
                        </div>
                      </div>
                    )}
              <div className="w-full bg-white/10 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 divide-y divide-white/10 overflow-hidden">
                <h2 className="text-xl font-bold text-center py-4 bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
                  Today's Timetable
                </h2>
                {periodEntries.length === 0 ? (
                  <div className="p-6 text-center text-gray-300">No classes today!</div>
                ) : (
                  periodEntries.map(([slot, { subject, room }], i) => {
                    let iconKey = subject.split(' ')[0].replace(/[^A-Z]/g, '');
                    if (iconKey === 'LUNCH') iconKey = 'LUNCH';
                    if (iconKey === 'LIBRARY') iconKey = 'LIBRARY';
                    if (iconKey === 'ANDROID') iconKey = 'ANDROID';
                    const Icon = subjectIcons[iconKey] || FaBook;
                    const isActive = slot === currentSlot;
                    return (
                      <div
                        key={i}
                        className={
                          `flex items-center justify-between p-4 gap-2 transition-all rounded-xl ${isActive ? 'bg-indigo-500/30 border-2 border-indigo-400 shadow-lg scale-[1.03]' : 'hover:bg-white/5'}`
                        }
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-6 h-6 text-indigo-300" />
                          <div className="flex flex-col">
                            <span className="text-lg font-semibold text-indigo-300">{subject}</span>
                            <span className="text-xs text-gray-400">Room: {room}</span>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-gray-200 bg-white/10 px-3 py-1 rounded-lg border border-white/20">{slot}</span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
            
            {/* Syllabus PDF */}
            <h2 className="text-xl sm:text-2xl font-bold text-center mb-4 bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
              Syllabus PDF
            </h2>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden shadow-inner">
              <iframe
                src="/assets/syllabus/syllabus.pdf"
                title="CSE 6th Sem Syllabus"
                className="w-full min-h-[50vh] sm:min-h-[60vh] lg:min-h-[70vh]"
                style={{ border: 'none' }}
                allowFullScreen
              />
            </div>
          </div>
        </div>

        {/* Notes and File Info Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center my-8 gap-4 w-full max-w-2xl mx-auto px-4">
          <button
            onClick={() => window.location.href = '/notes'}
            className="w-full sm:w-auto bg-white/10 backdrop-blur-xl hover:bg-white/20 text-white rounded-2xl px-8 py-4 text-lg font-bold shadow-2xl transition-all duration-200 border border-white/20 flex items-center justify-center gap-2 group"
          >
            <BookOpen className="w-6 h-6 group-hover:scale-110 transition-transform" />
            Notes
          </button>
          <button
            onClick={() => setShowFileInfo(true)}
            className="w-full sm:w-auto bg-white/10 backdrop-blur-xl hover:bg-white/20 text-white rounded-2xl px-8 py-4 text-lg font-bold shadow-2xl transition-all duration-200 border border-white/20 flex items-center justify-center gap-2 group"
          >
            <FileText className="w-6 h-6 group-hover:scale-110 transition-transform" />
            File Information
          </button>
        </div>

        {/* File Information Modal */}
        {typeof window !== 'undefined' && showFileInfo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl w-full max-w-3xl p-6 relative animate-fade-in max-h-[90vh] overflow-y-auto">
              <button
                className="absolute top-3 right-3 text-gray-300 hover:text-white text-2xl font-bold transition-colors"
                onClick={() => setShowFileInfo(false)}
                aria-label="Close"
              >
                &times;
              </button>
              <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
                File Information by Subject
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 hover:bg-white/15 transition-all shadow-lg">
                  <h3 className="font-bold text-lg text-indigo-300 mb-3 flex items-center gap-2">
                    <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                    Data Structures
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-200">
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-400">•</span>
                      <span><span className="font-semibold">File Type:</span> Practical File</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-400">•</span>
                      <span><span className="font-semibold">File Color:</span> Red</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-400">•</span>
                      <span><span className="font-semibold">Left Page:</span> Algorithm/Code</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-400">•</span>
                      <span><span className="font-semibold">Right Page:</span> Output/Explanation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-400">•</span>
                      <span><span className="font-semibold">Page Type:</span> Ruled</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 hover:bg-white/15 transition-all shadow-lg">
                  <h3 className="font-bold text-lg text-indigo-300 mb-3 flex items-center gap-2">
                    <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                    DBMS
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-200">
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-400">•</span>
                      <span><span className="font-semibold">File Type:</span> Practical File</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-400">•</span>
                      <span><span className="font-semibold">File Color:</span> Blue</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-400">•</span>
                      <span><span className="font-semibold">Left Page:</span> SQL Query</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-400">•</span>
                      <span><span className="font-semibold">Right Page:</span> Output/Explanation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-400">•</span>
                      <span><span className="font-semibold">Page Type:</span> Ruled</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 hover:bg-white/15 transition-all shadow-lg">
                  <h3 className="font-bold text-lg text-indigo-300 mb-3 flex items-center gap-2">
                    <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                    Operating Systems
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-200">
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-400">•</span>
                      <span><span className="font-semibold">File Type:</span> Assignment File</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-400">•</span>
                      <span><span className="font-semibold">File Color:</span> Green</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-400">•</span>
                      <span><span className="font-semibold">Left Page:</span> Theory/Notes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-400">•</span>
                      <span><span className="font-semibold">Right Page:</span> Diagrams/Examples</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-400">•</span>
                      <span><span className="font-semibold">Page Type:</span> Ruled</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 hover:bg-white/15 transition-all shadow-lg">
                  <h3 className="font-bold text-lg text-indigo-300 mb-3 flex items-center gap-2">
                    <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                    Networks
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-200">
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-400">•</span>
                      <span><span className="font-semibold">File Type:</span> Assignment File</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-400">•</span>
                      <span><span className="font-semibold">File Color:</span> Yellow</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-400">•</span>
                      <span><span className="font-semibold">Left Page:</span> Theory/Notes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-400">•</span>
                      <span><span className="font-semibold">Right Page:</span> Diagrams/Examples</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-400">•</span>
                      <span><span className="font-semibold">Page Type:</span> Ruled</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 hover:bg-white/15 transition-all shadow-lg md:col-span-2">
                  <h3 className="font-bold text-lg text-indigo-300 mb-3 flex items-center gap-2">
                    <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
                    Maths
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-200">
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-400">•</span>
                      <span><span className="font-semibold">File Type:</span> Assignment File</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-400">•</span>
                      <span><span className="font-semibold">File Color:</span> Orange</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-400">•</span>
                      <span><span className="font-semibold">Left Page:</span> Questions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-400">•</span>
                      <span><span className="font-semibold">Right Page:</span> Solutions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-400">•</span>
                      <span><span className="font-semibold">Page Type:</span> Ruled</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Weekly Timetable Modal (global, for both mobile and desktop) */}
      {showWeeklyTT && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl w-full max-w-2xl p-6 relative animate-fade-in max-h-[90vh] overflow-y-auto flex flex-col items-center">
            <button
              className="absolute top-3 right-3 text-gray-300 hover:text-white text-2xl font-bold transition-colors"
              onClick={() => setShowWeeklyTT(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent text-center">Weekly Timetable</h2>
            <img src="/assets/tt/weekly.jpeg" alt="Weekly Timetable" className="rounded-xl border border-white/20 shadow-lg max-w-full max-h-[70vh] object-contain" />
          </div>
        </div>
      )}
      <footer className="w-full text-center text-gray-400 text-xs py-6 select-none">
        &copy; Meer 2026
      </footer>
    </>
  )
}