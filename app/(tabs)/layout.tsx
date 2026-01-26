'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, BookOpen, Calendar, FileText } from 'lucide-react'
import { ReactNode } from 'react'

const tabs = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/syllabus', label: 'Syllabus', icon: BookOpen },
  { href: '/timetable', label: 'Timetable', icon: Calendar },
  { href: '/notes', label: 'Notes', icon: FileText }
]

export default function TabsLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  
  return (
    <>
      {children}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-xl border-t border-gray-800 px-4 pb-4 pt-2 z-50">
        <div className="grid grid-cols-4 gap-2">
          {tabs.map(({ href, label, icon: Icon }) => {
            const active = pathname === href
            return (
              <Link key={href} href={href} className="group flex flex-col items-center p-2 rounded-2xl transition-all hover:bg-gray-800">
                <Icon className={`w-6 h-6 ${active ? 'text-indigo-400' : 'text-gray-500 group-hover:text-gray-400'}`} />
                <span className={`text-xs mt-1 ${active ? 'text-indigo-400 font-medium' : 'text-gray-500'}`}>
                  {label}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </>
  )
}
