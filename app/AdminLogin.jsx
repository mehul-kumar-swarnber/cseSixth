import { useState } from 'react'

export default function AdminLogin({ onSuccess }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    const res = await fetch('/api/admin-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (res.ok) {
      localStorage.setItem('isAdmin', 'true');
      onSuccess();
    } else {
      setError('Invalid credentials');
    }
  }

  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder={process.env.NEXT_PUBLIC_ADMIN_USERNAME ? `Username` : "Username"}
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="p-2 rounded bg-gray-800 border border-gray-700 text-white focus:outline-none"
          autoFocus
        />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="p-2 rounded bg-gray-800 border border-gray-700 text-white focus:outline-none"
      />
      {error && <div className="text-red-400 text-sm">{error}</div>}
      <button type="submit" className="bg-indigo-500 hover:bg-indigo-600 text-white rounded p-2 font-semibold">Login</button>
    </form>
  )
}
