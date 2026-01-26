'use client'
import { useState } from 'react'
import { ArrowLeft, Download, ZoomIn, ZoomOut, Maximize2, Home, FileText } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function Syllabus() {
  const router = useRouter()
  const [zoom, setZoom] = useState(100)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const handleZoomIn = () => {
    if (zoom < 200) setZoom(zoom + 10)
  }

  const handleZoomOut = () => {
    if (zoom > 50) setZoom(zoom - 10)
  }

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = '/assets/syllabus/syllabus.pdf'
    link.download = 'CSE_6th_Sem_Syllabus.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const toggleFullscreen = () => {
    const iframe = document.getElementById('syllabus-iframe')
    if (!document.fullscreenElement) {
      iframe.requestFullscreen().then(() => setIsFullscreen(true))
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false))
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-indigo-900/10 px-2 sm:px-6 py-4 sm:py-6 pb-20">
      {/* Header */}
      <div className="w-full max-w-6xl mx-auto mb-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm sm:text-base font-semibold">Back to Home</span>
          </button>
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-indigo-400" />
          </div>
        </div>
        
        <h1 className="text-2xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent text-center">
          CSE 6th Semester Syllabus
        </h1>
        <p className="text-center text-gray-400 text-sm sm:text-base mb-4">
          Complete course syllabus for the semester
        </p>

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mb-4">
          <div className="flex items-center gap-2 bg-gray-800/80 rounded-xl px-3 py-2 border border-gray-700">
            <button
              onClick={handleZoomOut}
              className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              aria-label="Zoom Out"
              disabled={zoom <= 50}
            >
              <ZoomOut className="w-4 h-4 text-white" />
            </button>
            <span className="text-white font-semibold text-sm min-w-[60px] text-center">
              {zoom}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              aria-label="Zoom In"
              disabled={zoom >= 200}
            >
              <ZoomIn className="w-4 h-4 text-white" />
            </button>
          </div>

          <button
            onClick={handleDownload}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-semibold transition-colors shadow-lg"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Download PDF</span>
            <span className="sm:hidden">Download</span>
          </button>

          <button
            onClick={toggleFullscreen}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl font-semibold transition-colors shadow-lg"
          >
            <Maximize2 className="w-4 h-4" />
            <span className="hidden sm:inline">Fullscreen</span>
          </button>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="w-full max-w-6xl mx-auto flex-1 rounded-2xl overflow-hidden shadow-2xl border border-gray-800 bg-gray-800/80">
        <iframe
          id="syllabus-iframe"
          src="/assets/syllabus/syllabus.pdf"
          title="CSE 6th Sem Syllabus"
          className="w-full h-full bg-gray-900 transition-transform duration-300"
          style={{ 
            border: 'none',
            minHeight: '70vh',
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top center'
          }}
          allowFullScreen
        />
      </div>

      {/* Quick Info Card */}
      <div className="w-full max-w-6xl mx-auto mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gray-800/60 backdrop-blur-md border border-gray-700 rounded-xl p-4">
          <h3 className="text-indigo-400 font-semibold mb-2">Subjects</h3>
          <p className="text-gray-300 text-sm">Data Structures, OS, DBMS, Networks, Maths</p>
        </div>
        <div className="bg-gray-800/60 backdrop-blur-md border border-gray-700 rounded-xl p-4">
          <h3 className="text-indigo-400 font-semibold mb-2">Semester</h3>
          <p className="text-gray-300 text-sm">6th Semester - Computer Science</p>
        </div>
        <div className="bg-gray-800/60 backdrop-blur-md border border-gray-700 rounded-xl p-4">
          <h3 className="text-indigo-400 font-semibold mb-2">Format</h3>
          <p className="text-gray-300 text-sm">PDF Document - Downloadable</p>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 w-full z-40 bg-gray-900 border-t border-gray-800 flex justify-around items-center py-3">
        <button 
          onClick={() => router.push('/')} 
          className="flex flex-col items-center text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          <Home className="w-6 h-6" />
          <span className="text-xs mt-1">Home</span>
        </button>
        <button 
          onClick={() => router.push('/notes')} 
          className="flex flex-col items-center text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          <FileText className="w-6 h-6" />
          <span className="text-xs mt-1">Notes</span>
        </button>
        <button 
          onClick={handleDownload} 
          className="flex flex-col items-center text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          <Download className="w-6 h-6" />
          <span className="text-xs mt-1">Download</span>
        </button>
      </div>
    </div>
  )
}