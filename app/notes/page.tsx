'use client'
import { useEffect, useState } from 'react'
import { Plus, Folder, FileText, X, ArrowLeft, Trash2, Home, Search, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import clsx from 'clsx'

function getFolderName(notes: any[], id: string | null) {
    if (!id) return 'Root';
    const found = notes.find(n => n._id === id);
    return found ? found.folder : '';
}

function Modal({ open, onClose, children, title }: {
    open: boolean; onClose: () => void; children: React.ReactNode; title?: string;
}) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backdropFilter: 'blur(16px)', background: 'rgba(0,0,0,0.7)' }}>
            <div
                className="relative w-full max-w-md rounded-2xl flex flex-col"
                style={{
                    background: 'linear-gradient(145deg, rgba(15,15,30,0.98) 0%, rgba(20,20,45,0.98) 100%)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    boxShadow: '0 25px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)',
                    maxHeight: '90vh',
                }}
            >
                {title && (
                    <div className="flex items-center justify-between px-6 py-5"
                        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                        <h2 className="text-base font-semibold text-white tracking-tight">{title}</h2>
                        <button onClick={onClose}
                            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}
                <div className="overflow-y-auto flex-1 p-5">{children}</div>
            </div>
        </div>
    );
}

export default function Notes() {
    const [notes, setNotes] = useState<any[]>([])
    const [isAdmin, setIsAdmin] = useState(false)
    const [showAddFolder, setShowAddFolder] = useState(false)
    const [showAddLink, setShowAddLink] = useState(false)
    const [folderName, setFolderName] = useState("")
    const [linkUrl, setLinkUrl] = useState("")
    const [linkText, setLinkText] = useState("")
    const [loading, setLoading] = useState(false)
    const [currentFolderId, setCurrentFolderId] = useState<string | null>(null)
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

    useEffect(() => {
        if (!currentFolderId) {
            setBreadcrumb([])
        } else {
            const path: { id: string; name: string }[] = []
            let id: string | null = currentFolderId
            let safety = 0
            while (id && safety < 10) {
                const node = notes.find(n => n._id === id)
                if (!node) break
                path.unshift({ id: node._id, name: node.folder })
                id = node.parentId || null
                safety++
            }
            setBreadcrumb(path)
        }
    }, [currentFolderId, notes])

    useEffect(() => {
        if (searchQuery.trim() === "") {
            setSearchResults([])
            setIsSearching(false)
            return
        }
        setIsSearching(true)
        fetch(`/api/notes?search=${encodeURIComponent(searchQuery)}`)
            .then(r => r.json())
            .then(data => setSearchResults(Array.isArray(data) ? data : []))
    }, [searchQuery])

    function handleAddFolder(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        fetch('/api/notes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: currentFolderId ? 'subfolder' : 'folder', folder: folderName, parentId: currentFolderId })
        }).then(() => { setShowAddFolder(false); setFolderName(""); setLoading(false); })
    }

    function handleAddLink(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        fetch('/api/notes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'link', link: linkUrl, linkText, parentId: currentFolderId })
        }).then(() => { setShowAddLink(false); setLinkUrl(""); setLinkText(""); setLoading(false); })
    }

    async function handleDelete(id: string) {
        if (!window.confirm('Delete this item?')) return;
        setLoading(true);
        await fetch('/api/notes', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });
        setLoading(false);
    }

    function clearSearch() {
        setSearchQuery("")
        setSearchResults([])
        setIsSearching(false)
    }

    const currentItems = notes.filter(n => (n.parentId || null) === (currentFolderId || null))
    const displayItems = isSearching ? searchResults : currentItems

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
                * { font-family: 'Sora', sans-serif; }
                code, .mono { font-family: 'JetBrains Mono', monospace; }
                ::-webkit-scrollbar { width: 4px; height: 4px; }
                ::-webkit-scrollbar-track { background: transparent; }
                ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }

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
                .card {
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.07);
                    border-radius: 16px;
                    backdrop-filter: blur(20px);
                }
                .card-hover { transition: all 0.2s ease; }
                .card-hover:hover {
                    background: rgba(255,255,255,0.05) !important;
                    border-color: rgba(255,255,255,0.12) !important;
                    transform: translateY(-1px);
                }
                .item-row {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 14px 16px;
                    border-radius: 12px;
                    border: 1px solid transparent;
                    transition: all 0.15s ease;
                    gap: 12px;
                }
                .item-row:hover {
                    background: rgba(255,255,255,0.03);
                    border-color: rgba(255,255,255,0.06);
                }
                input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.5); cursor: pointer; }
            `}</style>

            <div className="noise-bg min-h-screen relative pb-24"
                style={{ background: 'linear-gradient(160deg, #080810 0%, #0d0d1f 40%, #0a0a18 100%)' }}>
                <div className="glow-orb-1" />
                <div className="glow-orb-2" />

                <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* ── NAVBAR ── */}
                    <nav className="flex items-center justify-between py-6">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                                style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                                <span className="text-white text-xs font-bold">CS</span>
                            </div>
                            <div>
                                <div className="text-white font-semibold text-sm leading-none">Notes</div>
                                <div className="text-gray-500 text-[11px] mt-0.5 mono">CSE 6th Sem · GEC Raipur</div>
                            </div>
                        </div>
                        <button
                            onClick={() => window.location.href = '/'}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-gray-400 hover:text-white transition-all hover:bg-white/[0.06]"
                            style={{ border: '1px solid rgba(255,255,255,0.07)' }}
                        >
                            <Home className="w-3.5 h-3.5" />
                            Home
                        </button>
                    </nav>

                    {/* ── SEARCH ── */}
                    <div className="mb-6">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder="Search notes, folders, links…"
                                className="w-full pl-11 pr-10 py-3 rounded-xl text-sm text-white placeholder-gray-600 outline-none transition-all"
                                style={{
                                    background: 'rgba(255,255,255,0.04)',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                }}
                                onFocus={e => { e.currentTarget.style.border = '1px solid rgba(99,102,241,0.4)'; e.currentTarget.style.background = 'rgba(99,102,241,0.06)'; }}
                                onBlur={e => { e.currentTarget.style.border = '1px solid rgba(255,255,255,0.08)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                            />
                            {searchQuery && (
                                <button onClick={clearSearch}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-all">
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>
                        {isSearching && (
                            <div className="mt-2 px-1 text-xs text-gray-500 mono">
                                {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "{searchQuery}"
                            </div>
                        )}
                    </div>

                    {/* ── BREADCRUMB ── */}
                    {!isSearching && (
                        <div className="card flex items-center gap-1 px-4 py-3 mb-5 overflow-x-auto flex-wrap">
                            <button
                                onClick={() => setCurrentFolderId(null)}
                                className={clsx(
                                    'flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all',
                                    !currentFolderId
                                        ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                                        : 'text-gray-500 hover:text-gray-300 hover:bg-white/[0.05]'
                                )}
                            >
                                <Home className="w-3 h-3" />
                                Root
                            </button>
                            {breadcrumb.map((b, i) => (
                                <div key={b.id} className="flex items-center gap-1">
                                    <ChevronRight className="w-3 h-3 text-gray-700" />
                                    <button
                                        onClick={() => setCurrentFolderId(b.id)}
                                        className={clsx(
                                            'px-2.5 py-1 rounded-lg text-xs font-medium transition-all',
                                            i === breadcrumb.length - 1
                                                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                                                : 'text-gray-500 hover:text-gray-300 hover:bg-white/[0.05]'
                                        )}
                                    >
                                        {b.name}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ── ITEMS ── */}
                    <div className="card overflow-hidden">
                        {/* Header */}
                        <div className="flex items-center justify-between px-5 py-4"
                            style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                            <div>
                                <div className="text-[10px] mono text-gray-500 uppercase tracking-widest mb-0.5">
                                    {isSearching ? 'Search Results' : 'Contents'}
                                </div>
                                <div className="text-white font-semibold text-sm">
                                    {isSearching
                                        ? `"${searchQuery}"`
                                        : breadcrumb.length > 0
                                            ? breadcrumb[breadcrumb.length - 1].name
                                            : 'All Notes'
                                    }
                                </div>
                            </div>
                            {isAdmin && !isSearching && (
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setShowAddFolder(true)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-indigo-400 hover:text-white transition-all hover:bg-indigo-500/10"
                                        style={{ border: '1px solid rgba(99,102,241,0.25)' }}
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                        Folder
                                    </button>
                                    <button
                                        onClick={() => setShowAddLink(true)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-sky-400 hover:text-white transition-all hover:bg-sky-500/10"
                                        style={{ border: '1px solid rgba(14,165,233,0.25)' }}
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                        Link
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* List */}
                        <div className="p-2">
                            {displayItems.length === 0 ? (
                                <div className="py-16 text-center">
                                    <div className="w-12 h-12 rounded-2xl mx-auto mb-3 flex items-center justify-center"
                                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                                        {isSearching
                                            ? <Search className="w-5 h-5 text-gray-600" />
                                            : <Folder className="w-5 h-5 text-gray-600" />
                                        }
                                    </div>
                                    <p className="text-gray-500 text-sm">
                                        {isSearching ? 'No results found' : 'No items in this folder'}
                                    </p>
                                </div>
                            ) : (
                                displayItems.map(item => (
                                    item.type === 'folder' || item.type === 'subfolder' ? (
                                        <div key={item._id} className="item-row group">
                                            <button
                                                onClick={() => { setCurrentFolderId(item._id); clearSearch(); }}
                                                className="flex items-center gap-3 flex-1 min-w-0"
                                            >
                                                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                                                    style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)' }}>
                                                    <Folder className="w-4 h-4 text-indigo-400" />
                                                </div>
                                                <div className="text-left min-w-0">
                                                    <div className="text-white text-sm font-medium truncate">{item.folder}</div>
                                                    {isSearching && item.parentId && (
                                                        <div className="text-xs text-gray-500 mono mt-0.5">
                                                            in {getFolderName(notes, item.parentId)}
                                                        </div>
                                                    )}
                                                </div>
                                            </button>
                                            <div className="flex items-center gap-2 shrink-0">
                                                <ChevronRight className="w-4 h-4 text-gray-700 group-hover:text-gray-500 transition-colors" />
                                                {isAdmin && (
                                                    <button
                                                        onClick={e => { e.stopPropagation(); handleDelete(item._id); }}
                                                        className="p-1.5 rounded-lg text-gray-700 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div key={item._id} className="item-row group">
                                            <a
                                                href={item.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-3 flex-1 min-w-0"
                                            >
                                                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                                                    style={{ background: 'rgba(14,165,233,0.12)', border: '1px solid rgba(14,165,233,0.2)' }}>
                                                    <FileText className="w-4 h-4 text-sky-400" />
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="text-white text-sm font-medium truncate">
                                                        {item.linkText || item.link}
                                                    </div>
                                                    {isSearching && item.parentId && (
                                                        <div className="text-xs text-gray-500 mono mt-0.5">
                                                            in {getFolderName(notes, item.parentId)}
                                                        </div>
                                                    )}
                                                    {!isSearching && (
                                                        <div className="text-xs text-gray-600 mono mt-0.5 truncate">{item.link}</div>
                                                    )}
                                                </div>
                                            </a>
                                            {isAdmin && (
                                                <button
                                                    onClick={() => handleDelete(item._id)}
                                                    className="p-1.5 rounded-lg text-gray-700 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100 shrink-0"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            )}
                                        </div>
                                    )
                                ))
                            )}
                        </div>
                    </div>

                </div>
            </div>

            {/* ── ADD FOLDER MODAL ── */}
            <Modal open={showAddFolder} onClose={() => setShowAddFolder(false)} title="New Folder">
                <form onSubmit={handleAddFolder} className="space-y-3">
                    <input
                        value={folderName}
                        onChange={e => setFolderName(e.target.value)}
                        placeholder="Folder name"
                        required
                        className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-gray-600 outline-none transition-all"
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                        onFocus={e => e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)'}
                        onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
                    />
                    <button
                        type="submit"
                        className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                        style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
                    >
                        Create Folder
                    </button>
                </form>
            </Modal>

            {/* ── ADD LINK MODAL ── */}
            <Modal open={showAddLink} onClose={() => setShowAddLink(false)} title="Add Drive Link">
                <form onSubmit={handleAddLink} className="space-y-3">
                    <input
                        value={linkText}
                        onChange={e => setLinkText(e.target.value)}
                        placeholder="Display name (e.g. Unit 1 Notes)"
                        required
                        className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-gray-600 outline-none transition-all"
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                        onFocus={e => e.currentTarget.style.borderColor = 'rgba(14,165,233,0.4)'}
                        onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
                    />
                    <input
                        value={linkUrl}
                        onChange={e => setLinkUrl(e.target.value)}
                        placeholder="Google Drive URL"
                        required
                        className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-gray-600 outline-none transition-all"
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                        onFocus={e => e.currentTarget.style.borderColor = 'rgba(14,165,233,0.4)'}
                        onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
                    />
                    <button
                        type="submit"
                        className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                        style={{ background: 'linear-gradient(135deg, #0ea5e9, #6366f1)' }}
                    >
                        Add Link
                    </button>
                </form>
            </Modal>

            {/* ── FOOTER ── */}
            <footer className="relative z-10 text-center py-6">
                <span className="text-gray-600 text-xs mono">© Meer 2026</span>
            </footer>
        </>
    )
}
