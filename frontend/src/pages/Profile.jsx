import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import SkillBadge from '../components/SkillBadge';

const COMMON_SKILLS = ['Python', 'Django', 'React', 'Node.js', 'Java', 'Flutter', 'ML/AI', 'UI/UX', 'MongoDB', 'SQL', 'TypeScript', 'Docker', 'Figma', 'Go', 'C++'];

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState(null);
  const [skillInput, setSkillInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) setForm({ username: user.username, first_name: user.first_name || '', last_name: user.last_name || '', bio: user.bio || '', college: user.college || '', branch: user.branch || '', year: user.year || '', skills: user.skills || [], github_url: user.github_url || '', linkedin_url: user.linkedin_url || '', portfolio_url: user.portfolio_url || '', is_available: user.is_available ?? true });
  }, [user]);

  const addSkill = (skill) => {
    const t = skill.trim();
    if (t && !form.skills.includes(t)) setForm(f => ({ ...f, skills: [...f.skills, t] }));
    setSkillInput('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);
    try {
      const res = await api.put('/users/me', { ...form, year: form.year ? parseInt(form.year) : null });
      updateUser({ ...user, ...res.data });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save profile.');
    } finally { setSaving(false); }
  };

  if (!form) return <div className="page-container text-center text-slate-400">Loading...</div>;

  return (
    <div className="page-container max-w-3xl">
      <h1 className="section-title mb-6">Edit Profile</h1>

      {success && <div className="bg-emerald-900/30 border border-emerald-700/40 text-emerald-400 text-sm px-4 py-3 rounded-xl mb-5">✓ Profile saved successfully!</div>}
      {error && <div className="bg-red-900/30 border border-red-700/40 text-red-400 text-sm px-4 py-3 rounded-xl mb-5">{error}</div>}

      {/* Avatar preview */}
      <div className="glass-card p-6 mb-5 flex items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-accent flex items-center justify-center text-white font-bold text-2xl">
          {user?.username?.charAt(0).toUpperCase()}
        </div>
        <div>
          <div className="font-bold text-white text-lg">{user?.username}</div>
          <div className="text-slate-400 text-sm">{user?.email}</div>
          <div className="flex items-center gap-2 mt-1">
            <div className={`w-2 h-2 rounded-full ${form.is_available ? 'bg-emerald-400' : 'bg-slate-500'}`} />
            <span className="text-xs text-slate-400">{form.is_available ? 'Available for projects' : 'Not available'}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        <div className="glass-card p-6">
          <h2 className="font-semibold text-white mb-4 text-sm">Basic Info</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="label">Username</label><input type="text" className="input-field" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} /></div>
            <div><label className="label">Bio</label><input type="text" className="input-field" placeholder="Brief intro about yourself" value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} /></div>
            <div><label className="label">First Name</label><input type="text" className="input-field" value={form.first_name} onChange={e => setForm({ ...form, first_name: e.target.value })} /></div>
            <div><label className="label">Last Name</label><input type="text" className="input-field" value={form.last_name} onChange={e => setForm({ ...form, last_name: e.target.value })} /></div>
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="font-semibold text-white mb-4 text-sm">Academic Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2"><label className="label">College</label><input type="text" className="input-field" placeholder="Your college name" value={form.college} onChange={e => setForm({ ...form, college: e.target.value })} /></div>
            <div><label className="label">Branch</label><input type="text" className="input-field" placeholder="CS, ECE..." value={form.branch} onChange={e => setForm({ ...form, branch: e.target.value })} /></div>
            <div>
              <label className="label">Year</label>
              <select className="input-field" value={form.year} onChange={e => setForm({ ...form, year: e.target.value })}>
                <option value="">Select year</option>
                {[1, 2, 3, 4].map(y => <option key={y} value={y}>{y}{['st','nd','rd','th'][y-1]} Year</option>)}
              </select>
            </div>
            <div className="flex items-center gap-3 pt-6">
              <input id="available-toggle" type="checkbox" className="w-4 h-4 accent-primary-500" checked={form.is_available} onChange={e => setForm({ ...form, is_available: e.target.checked })} />
              <label htmlFor="available-toggle" className="text-sm text-slate-300 cursor-pointer">Available for projects</label>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="font-semibold text-white mb-4 text-sm">Skills</h2>
          <div className="flex gap-2 mb-2">
            <input type="text" className="input-field flex-1" placeholder="Add skill and press Enter" value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(skillInput); } }} />
            <button type="button" onClick={() => addSkill(skillInput)} className="btn-secondary !px-4">Add</button>
          </div>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {COMMON_SKILLS.filter(s => !form.skills.includes(s)).slice(0, 10).map(s => (
              <button key={s} type="button" onClick={() => addSkill(s)} className="text-xs px-2.5 py-1 rounded-full bg-dark-600 border border-dark-400 text-slate-400 hover:border-primary-600 hover:text-primary-300 transition-colors">+ {s}</button>
            ))}
          </div>
          {form.skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {form.skills.map(s => <SkillBadge key={s} skill={s} onRemove={sk => setForm(f => ({ ...f, skills: f.skills.filter(x => x !== sk) }))} />)}
            </div>
          )}
        </div>

        <div className="glass-card p-6">
          <h2 className="font-semibold text-white mb-4 text-sm">Social Links</h2>
          <div className="space-y-3">
            <div><label className="label">GitHub URL</label><input type="url" className="input-field" placeholder="https://github.com/username" value={form.github_url} onChange={e => setForm({ ...form, github_url: e.target.value })} /></div>
            <div><label className="label">LinkedIn URL</label><input type="url" className="input-field" placeholder="https://linkedin.com/in/username" value={form.linkedin_url} onChange={e => setForm({ ...form, linkedin_url: e.target.value })} /></div>
            <div><label className="label">Portfolio URL</label><input type="url" className="input-field" placeholder="https://yourportfolio.com" value={form.portfolio_url} onChange={e => setForm({ ...form, portfolio_url: e.target.value })} /></div>
          </div>
        </div>

        <button type="submit" disabled={saving} className="btn-primary w-full !py-3">
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
}
