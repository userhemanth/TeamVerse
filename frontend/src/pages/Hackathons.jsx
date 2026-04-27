import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

function HackathonCard({ hackathon }) {
  const now = new Date();
  const start = new Date(hackathon.start_date);
  const end = new Date(hackathon.end_date);
  const isUpcoming = start > now;
  const isOngoing = start <= now && end >= now;

  return (
    <div className="glass-card p-5 hover:border-primary-700/50 transition-all duration-200 animate-fade-in group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className={`badge border text-xs ${isOngoing ? 'bg-emerald-900/40 text-emerald-400 border-emerald-700/40' : isUpcoming ? 'bg-primary-900/40 text-primary-400 border-primary-700/40' : 'bg-dark-600 text-slate-400 border-dark-400'}`}>
              {isOngoing ? '🔴 Live' : isUpcoming ? '⏰ Upcoming' : 'Ended'}
            </span>
            <span className="badge bg-dark-600 border border-dark-400 text-slate-400 text-xs">
              {hackathon.is_online ? '🌐 Online' : '📍 ' + (hackathon.location || 'In-person')}
            </span>
          </div>
          <h3 className="font-bold text-white group-hover:text-primary-300 transition-colors">{hackathon.title}</h3>
          <p className="text-xs text-slate-400 mt-0.5">by {hackathon.posted_by?.username}</p>
        </div>
        {hackathon.prize_pool && (
          <div className="ml-3 text-right">
            <div className="text-xs text-slate-500">Prize</div>
            <div className="font-bold text-amber-400 text-sm">{hackathon.prize_pool}</div>
          </div>
        )}
      </div>

      <p className="text-sm text-slate-400 line-clamp-2 mb-3">{hackathon.description}</p>

      <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-500 mb-4">
        <span>📅 {hackathon.start_date} → {hackathon.end_date}</span>
        <span>👥 Max {hackathon.max_team_size} per team</span>
      </div>

      <a href={hackathon.registration_link} target="_blank" rel="noopener noreferrer" className="btn-primary text-sm !py-2 inline-block">
        Register →
      </a>
    </div>
  );
}

export default function Hackathons() {
  const { user } = useAuth();
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', start_date: '', end_date: '', registration_link: '', max_team_size: 4, prize_pool: '', location: '', is_online: true });
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    api.get('/hackathons').then(res => setHackathons(res.data)).finally(() => setLoading(false));
  }, []);

  const handlePost = async (e) => {
    e.preventDefault();
    setPosting(true);
    try {
      const res = await api.post('/hackathons', form);
      setHackathons(prev => [res.data, ...prev]);
      setShowForm(false);
      setForm({ title: '', description: '', start_date: '', end_date: '', registration_link: '', max_team_size: 4, prize_pool: '', location: '', is_online: true });
    } finally { setPosting(false); }
  };

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="section-title">Hackathon Board</h1>
          <p className="section-subtitle">Discover upcoming hackathons and find teammates</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? '✕ Cancel' : '+ Post Hackathon'}
        </button>
      </div>

      {/* Post form */}
      {showForm && (
        <div className="glass-card p-6 mb-6 animate-slide-up">
          <h2 className="font-semibold text-white mb-4">Post a Hackathon</h2>
          <form onSubmit={handlePost} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="label">Title *</label><input type="text" className="input-field" placeholder="Hackathon name" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required /></div>
              <div><label className="label">Registration Link *</label><input type="url" className="input-field" placeholder="https://devpost.com/..." value={form.registration_link} onChange={e => setForm({ ...form, registration_link: e.target.value })} required /></div>
              <div><label className="label">Start Date *</label><input type="date" className="input-field" value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })} required /></div>
              <div><label className="label">End Date *</label><input type="date" className="input-field" value={form.end_date} onChange={e => setForm({ ...form, end_date: e.target.value })} required /></div>
              <div><label className="label">Prize Pool</label><input type="text" className="input-field" placeholder="$10,000 in prizes" value={form.prize_pool} onChange={e => setForm({ ...form, prize_pool: e.target.value })} /></div>
              <div><label className="label">Max Team Size</label><input type="number" min="1" max="20" className="input-field" value={form.max_team_size} onChange={e => setForm({ ...form, max_team_size: parseInt(e.target.value) })} /></div>
            </div>
            <div><label className="label">Description *</label><textarea className="input-field min-h-20 resize-y" placeholder="Tell teams what this hackathon is about..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required /></div>
            <div className="flex items-center gap-3">
              <input id="online-toggle" type="checkbox" className="w-4 h-4 accent-primary-500" checked={form.is_online} onChange={e => setForm({ ...form, is_online: e.target.checked })} />
              <label htmlFor="online-toggle" className="text-sm text-slate-300 cursor-pointer">Online Hackathon</label>
              {!form.is_online && <input type="text" className="input-field flex-1" placeholder="Location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />}
            </div>
            <button type="submit" disabled={posting} className="btn-primary">{posting ? 'Posting...' : 'Post Hackathon'}</button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">{[...Array(4)].map((_, i) => <div key={i} className="glass-card h-48 animate-pulse" />)}</div>
      ) : hackathons.length === 0 ? (
        <div className="glass-card p-16 text-center">
          <div className="text-5xl mb-4">🏆</div>
          <h3 className="text-white font-semibold mb-2">No hackathons posted yet</h3>
          <p className="text-slate-400 text-sm">Be the first to post an upcoming hackathon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {hackathons.map(h => <HackathonCard key={h.id} hackathon={h} />)}
        </div>
      )}
    </div>
  );
}
