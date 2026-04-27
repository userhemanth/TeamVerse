import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import ProjectCard from '../components/ProjectCard';
import SkillBadge from '../components/SkillBadge';

export default function Dashboard() {
  const { user } = useAuth();
  const [myProjects, setMyProjects] = useState([]);
  const [matches, setMatches] = useState([]);
  const [requests, setRequests] = useState({ received: [], sent: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/projects?status=OPEN'),
      api.get('/match/users/me'),
      api.get('/requests/received'),
      api.get('/requests/sent'),
    ]).then(([projRes, matchRes, recvRes, sentRes]) => {
      setMyProjects(projRes.data.filter(p => p.owner?.id === user?.id));
      setMatches(matchRes.data.slice(0, 3));
      setRequests({ received: recvRes.data.slice(0, 3), sent: sentRes.data.slice(0, 3) });
    }).finally(() => setLoading(false));
  }, [user]);

  if (loading) return (
    <div className="page-container flex items-center justify-center min-h-[60vh]">
      <div className="text-slate-400 animate-pulse">Loading dashboard...</div>
    </div>
  );

  const pendingReceived = requests.received.filter(r => r.status === 'PENDING');

  return (
    <div className="page-container">
      {/* Welcome header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Welcome back, <span className="text-primary-400">{user?.username}</span> 👋
          </h1>
          <p className="text-slate-400 mt-1">{user?.college || 'Update your profile to get better matches'}</p>
        </div>
        <Link to="/projects/new" className="btn-primary hidden md:inline-flex">+ New Project</Link>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Your Projects', value: myProjects.length, icon: '📁', color: 'text-primary-400' },
          { label: 'Skill Matches', value: matches.length, icon: '✨', color: 'text-cyan-400' },
          { label: 'Pending Requests', value: pendingReceived.length, icon: '📨', color: 'text-amber-400' },
          { label: 'Skills', value: user?.skills?.length || 0, icon: '🛠', color: 'text-emerald-400' },
        ].map(stat => (
          <div key={stat.label} className="glass-card p-5">
            <div className="text-2xl mb-1">{stat.icon}</div>
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile summary */}
        <div className="glass-card p-6">
          <h2 className="section-title text-lg mb-4">Your Profile</h2>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-accent flex items-center justify-center text-white font-bold text-xl">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="font-semibold text-white">{user?.username}</div>
              <div className="text-xs text-slate-400">{user?.email}</div>
            </div>
          </div>
          {user?.skills?.length > 0 && (
            <div>
              <p className="text-xs text-slate-500 mb-2">Your Skills</p>
              <div className="flex flex-wrap gap-1.5">
                {user.skills.map(s => <SkillBadge key={s} skill={s} />)}
              </div>
            </div>
          )}
          <Link to="/profile" className="btn-secondary w-full text-center text-sm mt-4 block !py-2">Edit Profile</Link>
        </div>

        {/* Top matches */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title text-lg">Top Matches</h2>
            <Link to="/match" className="text-xs text-primary-400 hover:text-primary-300">See all →</Link>
          </div>
          {matches.length === 0 ? (
            <div className="glass-card p-6 text-center text-slate-500 text-sm">No matches yet. Add skills to get matched!</div>
          ) : (
            <div className="space-y-3">
              {matches.map(m => (
                <div key={m.project.id} className="glass-card p-4 hover:border-primary-700/40 transition-colors">
                  <div className="flex justify-between items-start">
                    <Link to={`/projects/${m.project.id}`} className="font-medium text-white hover:text-primary-300 text-sm transition-colors">
                      {m.project.title}
                    </Link>
                    <span className="text-xs font-bold text-emerald-400 ml-2">{m.score}%</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{m.project.owner?.username} · {m.project.project_type}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending requests */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title text-lg">Join Requests</h2>
            {pendingReceived.length > 0 && <span className="badge bg-amber-900/40 text-amber-400 border border-amber-700/40">{pendingReceived.length} pending</span>}
          </div>
          {pendingReceived.length === 0 ? (
            <div className="glass-card p-6 text-center text-slate-500 text-sm">No pending requests</div>
          ) : (
            <div className="space-y-3">
              {pendingReceived.map(req => (
                <div key={req.id} className="glass-card p-4">
                  <div className="font-medium text-white text-sm">{req.sender?.username}</div>
                  <div className="text-xs text-slate-400 mt-0.5">wants to join "{req.project?.title}"</div>
                  <div className="flex gap-2 mt-3">
                    <button onClick={async () => {
                      await api.put(`/requests/${req.id}/accept`);
                      setRequests(r => ({ ...r, received: r.received.filter(x => x.id !== req.id) }));
                    }} className="text-xs px-3 py-1.5 rounded-lg bg-emerald-900/40 border border-emerald-700/40 text-emerald-400 hover:bg-emerald-900/60 transition-colors">
                      Accept
                    </button>
                    <button onClick={async () => {
                      await api.put(`/requests/${req.id}/reject`);
                      setRequests(r => ({ ...r, received: r.received.filter(x => x.id !== req.id) }));
                    }} className="text-xs px-3 py-1.5 rounded-lg bg-red-900/30 border border-red-700/30 text-red-400 hover:bg-red-900/50 transition-colors">
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
