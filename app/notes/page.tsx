'use client'
import { useEffect, useState } from 'react'
import { Plus, Folder, FileText, X, ArrowLeft, Trash2, Home, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'

function getFolderName(notes, id) {
    if (!id) return 'Root';
    const found = notes.find(n => n._id === id);
    return found ? found.folder : '';
}

export default function Notes() {
    const router = useRouter();
    const [notes, setNotes] = useState<any[]>([])
    const [isAdmin, setIsAdmin] = useState(false)
    const [showAddFolder, setShowAddFolder] = useState(false)
    const [showAddLink, setShowAddLink] = useState(false)
    const [folderName, setFolderName] = useState("")
    const [linkUrl, setLinkUrl] = useState("")
    const [linkText, setLinkText] = useState("")
    const [loading, setLoading] = useState(false)
    const [currentFolderId, setCurrentFolderId] = useState(null)
    const [breadcrumb, setBreadcrumb] = useState<any[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [searchResults, setSearchResults] = useState<any[]>([])
    const [isSearching, setIsSearching] = useState(false)

    useEffect(() => {
        fetch('/api/notes')
            .then(r => r.json())
            .then(data => setNotes(Array.isArray(data) ? data : []));
    }, [loading]);

    useEffect(() => {
        setIsAdmin(typeof window !== 'undefined' && localStorage.getItem('isAdmin') === 'true');
    }, []);

    // Breadcrumb logic
    useEffect(() => {
        if (!currentFolderId) {
            setBreadcrumb([])
        } else {
            // Build breadcrumb up to root
            const path: { id: string; name: string }[] = []
            let id = currentFolderId
            let safety = 0
            while (id && safety < 10) {
                const node = notes.find(n => n._id === id)
                if (!node) break
                path.unshift({ id: node._id, name: node.folder })
                id = node.parentId
                safety++
            }
            setBreadcrumb(path)
        }
    }, [currentFolderId, notes])

    // Search functionality
    useEffect(() => {
        if (searchQuery.trim() === "") {
            setSearchResults([])
            setIsSearching(false)
            return
        }

        setIsSearching(true)
        fetch(`/api/notes?search=${encodeURIComponent(searchQuery)}`)
            .then(r => r.json())
            .then(data => {
                setSearchResults(Array.isArray(data) ? data : [])
            })
    }, [searchQuery])

    function handleAddFolder(e) {
        e.preventDefault();
        setLoading(true);
        fetch('/api/notes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: currentFolderId ? 'subfolder' : 'folder', folder: folderName, parentId: currentFolderId })
        }).then(() => {
            setShowAddFolder(false); setFolderName(""); setLoading(false);
        })
    }
    function handleAddLink(e) {
        e.preventDefault();
        setLoading(true);
        fetch('/api/notes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'link', link: linkUrl, linkText, parentId: currentFolderId })
        }).then(() => {
            setShowAddLink(false); setLinkUrl(""); setLinkText(""); setLoading(false);
        })
    }

    // Show only items in current folder
    const currentItems = notes.filter(n => (n.parentId || null) === (currentFolderId || null))

    // Delete note/folder/link
    async function handleDelete(id) {
        if (!window.confirm('Delete this item?')) return;
        setLoading(true);
        await fetch('/api/notes', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });
        setLoading(false);
    }

    // Clear search
    function clearSearch() {
        setSearchQuery("")
        setSearchResults([])
        setIsSearching(false)
    }

    // Display items (either search results or current folder items)
    const displayItems = isSearching ? searchResults : currentItems

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900/20 to-purple-900/20 p-4 md:p-6 lg:p-8 space-y-4 pb-24 sm:pb-20">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <h1 className="text-3xl sm:text-4xl font-bold mb-6 bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
                    Notes
                </h1>

                {/* Search Bar */}
                <div className="w-full mb-6">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search notes, folders, and links..."
                            className="w-full pl-12 pr-12 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition shadow-lg"
                        />
                        {searchQuery && (
                            <button
                                onClick={clearSearch}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                aria-label="Clear search"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                    {isSearching && (
                        <div className="mt-3 text-sm text-gray-300 px-2">
                            Found <span className="font-semibold text-indigo-300">{searchResults.length}</span> result{searchResults.length !== 1 ? 's' : ''}
                        </div>
                    )}
                </div>

                {/* Breadcrumbs - Hide when searching */}
                {!isSearching && (
                    <nav className="w-full flex flex-wrap items-center gap-2 text-sm sm:text-base mb-6 bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-lg">
                        <button
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all ${!currentFolderId ? 'bg-indigo-500/50 text-white font-semibold' : 'text-indigo-300 hover:bg-white/10'}`}
                            onClick={() => setCurrentFolderId(null)}
                        >
                            <Home className="w-4 h-4" /> Root
                        </button>
                        {breadcrumb.map((b, i) => (
                            <div key={b.id} className="flex items-center gap-2">
                                <span className="text-gray-500">/</span>
                                <button
                                    className={`px-3 py-1.5 rounded-lg transition-all ${i === breadcrumb.length - 1 ? 'bg-indigo-500/50 text-white font-semibold' : 'text-indigo-300 hover:bg-white/10'}`}
                                    onClick={() => setCurrentFolderId(b.id)}
                                >
                                    {b.name}
                                </button>
                            </div>
                        ))}
                    </nav>
                )}

                {/* Items Grid */}
                <div className="flex flex-col gap-4 w-full">
                    {displayItems.length === 0 ? (
                        <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg rounded-2xl p-12 text-center">
                            <div className="text-gray-300 text-lg">
                                {isSearching ? '🔍 No results found.' : '📁 No items in this folder.'}
                            </div>
                        </div>
                    ) : (
                        displayItems.map(item => (
                            item.type === 'folder' || item.type === 'subfolder' ? (
                                <div
                                    key={item._id}
                                    className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg rounded-2xl p-5 flex flex-row items-center relative group cursor-pointer hover:bg-white/15 transition-all w-full min-h-[80px]"
                                >
                                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                                        {isAdmin && (
                                            <button
                                                title="Delete"
                                                onClick={() => handleDelete(item._id)}
                                                className="p-2 bg-red-500/20 backdrop-blur-md hover:bg-red-500/40 text-red-300 rounded-lg transition-all border border-red-400/30"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                    <div
                                        onClick={() => { setCurrentFolderId(item._id); clearSearch(); }}
                                        className="flex flex-row items-center gap-4 w-full pr-12"
                                    >
                                        <div className="bg-indigo-500/20 backdrop-blur-sm p-3 rounded-xl border border-indigo-400/30">
                                            <Folder className="w-7 h-7 text-indigo-300" />
                                        </div>
                                        <div className="flex flex-col flex-1">
                                            <span className="font-semibold text-white text-lg text-left break-words">{item.folder}</span>
                                            {isSearching && item.parentId && (
                                                <span className="text-xs text-gray-400 mt-1">📂 in {getFolderName(notes, item.parentId)}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div
                                    key={item._id}
                                    className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg rounded-2xl p-5 flex flex-row items-center relative group hover:bg-white/15 transition-all w-full min-h-[80px]"
                                >
                                    {isAdmin && (
                                        <button
                                            title="Delete"
                                            onClick={() => handleDelete(item._id)}
                                            className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-red-500/20 backdrop-blur-md hover:bg-red-500/40 text-red-300 rounded-lg border border-red-400/30"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                    <a
                                        href={item.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex flex-row items-center gap-4 w-full pr-12"
                                    >
                                        <div className="bg-blue-500/20 backdrop-blur-sm p-3 rounded-xl border border-blue-400/30">
                                            <FileText className="w-7 h-7 text-blue-300" />
                                        </div>
                                        <div className="flex flex-col flex-1">
                                            <span className="font-semibold text-white text-lg break-all text-left">
                                                {item.linkText ? item.linkText : item.link}
                                            </span>
                                            {isSearching && item.parentId && (
                                                <span className="text-xs text-gray-400 mt-1">📂 in {getFolderName(notes, item.parentId)}</span>
                                            )}
                                        </div>
                                    </a>
                                </div>
                            )
                        ))
                    )}
                </div>

                {/* Add Buttons */}
                {isAdmin && !isSearching && (
                    <div className="flex flex-col sm:flex-row gap-4 mt-8">
                        <button
                            className="flex-1 bg-white/10 backdrop-blur-xl hover:bg-white/15 text-white rounded-2xl p-4 font-semibold border border-white/20 shadow-lg transition-all flex items-center justify-center gap-2 group"
                            onClick={() => setShowAddFolder(true)}
                        >
                            <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            Add Folder
                        </button>
                        <button
                            className="flex-1 bg-white/10 backdrop-blur-xl hover:bg-white/15 text-white rounded-2xl p-4 font-semibold border border-white/20 shadow-lg transition-all flex items-center justify-center gap-2 group"
                            onClick={() => setShowAddLink(true)}
                        >
                            <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            Add Drive Link
                        </button>
                    </div>
                )}
            </div>

            {/* Add Folder Modal */}
            {showAddFolder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 w-full max-w-md p-6 relative animate-fade-in">
                        <button
                            className="absolute top-3 right-3 text-gray-300 hover:text-white text-2xl font-bold transition-colors"
                            onClick={() => setShowAddFolder(false)}
                            aria-label="Close"
                        >
                            <X className="w-6 h-6" />
                        </button>
                        <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
                            Add Folder
                        </h2>
                        <div className="flex flex-col gap-4">
                            <input
                                value={folderName}
                                onChange={e => setFolderName(e.target.value)}
                                placeholder="Folder name"
                                className="p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                                required
                            />
                            <button
                                onClick={handleAddFolder}
                                className="bg-gradient-to-r from-indigo-500 to-purple-600 backdrop-blur-sm hover:opacity-90 text-white rounded-xl p-3 font-semibold transition-all shadow-lg border border-white/20"
                            >
                                Add Folder
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Link Modal */}
            {showAddLink && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 w-full max-w-md p-6 relative animate-fade-in">
                        <button
                            className="absolute top-3 right-3 text-gray-300 hover:text-white text-2xl font-bold transition-colors"
                            onClick={() => setShowAddLink(false)}
                            aria-label="Close"
                        >
                            <X className="w-6 h-6" />
                        </button>
                        <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
                            Add Drive Link
                        </h2>
                        <div className="flex flex-col gap-4">
                            <input
                                value={linkText}
                                onChange={e => setLinkText(e.target.value)}
                                placeholder="Display text (e.g. Unit 1 Notes)"
                                className="p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                                required
                            />
                            <input
                                value={linkUrl}
                                onChange={e => setLinkUrl(e.target.value)}
                                placeholder="Drive link URL"
                                className="p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                                required
                            />
                            <button
                                onClick={handleAddLink}
                                className="bg-gradient-to-r from-blue-500 to-cyan-600 backdrop-blur-sm hover:opacity-90 text-white rounded-xl p-3 font-semibold transition-all shadow-lg border border-white/20"
                            >
                                Add Link
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Bottom Navigation for Mobile and Desktop */}
            <div className="fixed bottom-0 left-0 w-full z-40 bg-white/10 backdrop-blur-xl border-t border-white/20 flex justify-around items-center py-3 shadow-2xl">
                <button
                    onClick={() => window.location.href = '/'}
                    className="flex flex-col items-center gap-1 text-indigo-300 hover:text-indigo-200 transition-colors p-2 rounded-xl hover:bg-white/10"
                >
                    <Home className="w-6 h-6" />
                    <span className="text-xs font-medium">Main Home</span>
                </button>
                <button
                    onClick={() => { setCurrentFolderId(null); clearSearch(); }}
                    className={`flex flex-col items-center gap-1 transition-colors p-2 rounded-xl hover:bg-white/10 ${!currentFolderId ? 'text-white font-bold' : 'text-indigo-300 hover:text-indigo-200'}`}
                >
                    <Folder className="w-6 h-6" />
                    <span className="text-xs font-medium">Notes Root</span>
                </button>
                {currentFolderId && !isSearching && (
                    <button
                        onClick={() => setCurrentFolderId(breadcrumb.length > 1 ? breadcrumb[breadcrumb.length - 2]?.id : null)}
                        className="flex flex-col items-center gap-1 text-indigo-300 hover:text-indigo-200 transition-colors p-2 rounded-xl hover:bg-white/10"
                    >
                        <ArrowLeft className="w-6 h-6" />
                        <span className="text-xs font-medium">Up</span>
                    </button>
                )}
            </div>
        </div>
    )
}
