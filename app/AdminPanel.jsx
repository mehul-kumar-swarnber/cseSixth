import { useState, useEffect } from 'react'

export default function AdminPanel({ onClose, onRefresh }) {
  const [tab, setTab] = useState('announcements')
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 mb-2">
        <button onClick={() => setTab('announcements')} className={`px-3 py-1 rounded ${tab==='announcements' ? 'bg-indigo-500 text-white' : 'bg-gray-700 text-gray-200'}`}>Announcements</button>
        <button onClick={() => setTab('notes')} className={`px-3 py-1 rounded ${tab==='notes' ? 'bg-indigo-500 text-white' : 'bg-gray-700 text-gray-200'}`}>Notes</button>
      </div>
      {tab === 'announcements' ? <AnnouncementsAdmin onRefresh={onRefresh} /> : <NotesAdmin onRefresh={onRefresh} />}
      <button onClick={onClose} className="mt-4 bg-gray-700 hover:bg-gray-600 text-white rounded p-2 font-semibold">Close Panel</button>
    </div>
  )
}


function AnnouncementsAdmin({ onRefresh }) {
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ title: '', body: '', allotmentDate: '', dueDate: '', priority: 'Medium' })
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/announcements').then(r => r.json()).then(setAnnouncements).finally(() => setLoading(false))
  }, [])

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleAdd = async e => {
    e.preventDefault()
    setError('')
    if (!form.title || !form.body || !form.allotmentDate || !form.dueDate || !form.priority) {
      setError('All fields required')
      return
    }
    const res = await fetch('/api/announcements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    if (res.ok) {
      const newAnn = await res.json()
      setAnnouncements(a => [...a, { ...form, _id: newAnn.insertedId }])
      setForm({ title: '', body: '', allotmentDate: '', dueDate: '', priority: 'Medium' })
    } else {
      setError('Failed to add announcement')
    }
  }

  const handleDelete = async id => {
    await fetch('/api/announcements', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
    setAnnouncements(a => a.filter(x => x._id !== id))
  }

  return (
    <div>
      <h3 className="text-lg font-bold mb-2 text-indigo-300">Add Announcement</h3>
      <form onSubmit={handleAdd} className="flex flex-col gap-2 mb-6">
        <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="p-2 rounded bg-gray-800 border border-gray-700 text-white" />
        <textarea name="body" value={form.body} onChange={handleChange} placeholder="Body" className="p-2 rounded bg-gray-800 border border-gray-700 text-white" />
        <div className="flex gap-2">
          <input name="allotmentDate" value={form.allotmentDate} onChange={handleChange} type="date" className="p-2 rounded bg-gray-800 border border-gray-700 text-white flex-1" />
          <input name="dueDate" value={form.dueDate} onChange={handleChange} type="date" className="p-2 rounded bg-gray-800 border border-gray-700 text-white flex-1" />
        </div>
        <select name="priority" value={form.priority} onChange={handleChange} className="p-2 rounded bg-gray-800 border border-gray-700 text-white">
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        {error && <div className="text-red-400 text-sm">{error}</div>}
        <button type="submit" className="bg-indigo-500 hover:bg-indigo-600 text-white rounded p-2 font-semibold">Add</button>
      </form>
      <h3 className="text-lg font-bold mb-2 text-indigo-300">All Announcements</h3>
      {loading ? <div className="text-gray-400">Loading...</div> : (
        <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
          {announcements.map(a => (
            <div key={a._id} className="bg-gray-800 rounded-xl p-3 border border-gray-700 flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-indigo-200">{a.title}</span>
                <button onClick={() => handleDelete(a._id)} className="text-red-400 hover:text-red-200 text-xs">Delete</button>
              </div>
              <div className="text-gray-200 text-sm">{a.body}</div>
              <div className="flex flex-wrap gap-4 text-xs text-gray-400">
                <span>Allotment: <span className="text-gray-300">{a.allotmentDate}</span></span>
                <span>Due: <span className="text-gray-300">{a.dueDate}</span></span>
                <span>Priority: <span className={
                  a.priority === 'High' ? 'text-red-400' :
                  a.priority === 'Medium' ? 'text-yellow-400' :
                  'text-gray-400'
                }>{a.priority}</span></span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function NotesAdmin({ onRefresh }) {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ folder: '', link: '' })
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/notes').then(r => r.json()).then(setNotes).finally(() => setLoading(false))
  }, [])

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleAdd = async e => {
    e.preventDefault()
    setError('')
    if (!form.folder || !form.link) {
      setError('All fields required')
      return
    }
    const res = await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    if (res.ok) {
      const newNote = await res.json()
      setNotes(n => [...n, { ...form, _id: newNote.insertedId }])
      setForm({ folder: '', link: '' })
    } else {
      setError('Failed to add note')
    }
  }

  const handleDelete = async id => {
    await fetch('/api/notes', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
    setNotes(n => n.filter(x => x._id !== id))
  }

  return (
    <div>
      <h3 className="text-lg font-bold mb-2 text-indigo-300">Add Note/Folder</h3>
      <form onSubmit={handleAdd} className="flex flex-col gap-2 mb-6">
        <input name="folder" value={form.folder} onChange={handleChange} placeholder="Folder Name" className="p-2 rounded bg-gray-800 border border-gray-700 text-white" />
        <input name="link" value={form.link} onChange={handleChange} placeholder="Drive Link" className="p-2 rounded bg-gray-800 border border-gray-700 text-white" />
        {error && <div className="text-red-400 text-sm">{error}</div>}
        <button type="submit" className="bg-indigo-500 hover:bg-indigo-600 text-white rounded p-2 font-semibold">Add</button>
      </form>
      <h3 className="text-lg font-bold mb-2 text-indigo-300">All Notes/Folders</h3>
      {loading ? <div className="text-gray-400">Loading...</div> : (
        <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
          {notes.map(n => (
            <div key={n._id} className="bg-gray-800 rounded-xl p-3 border border-gray-700 flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-indigo-200">{n.folder}</span>
                <button onClick={() => handleDelete(n._id)} className="text-red-400 hover:text-red-200 text-xs">Delete</button>
              </div>
              <a href={n.link} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline text-sm break-all">{n.link}</a>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
