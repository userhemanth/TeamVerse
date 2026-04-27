import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import SkillBadge from '../components/SkillBadge';

const COMMON_SKILLS = ['Python', 'Django', 'React', 'Node.js', 'Java', 'Flutter', 'ML/AI', 'UI/UX', 'MongoDB', 'SQL', 'TypeScript', 'Docker'];

export default function Register() {
  const [form, setForm] = useState({ email: '', username: '', password: '', college: '', branch: '', year: '', skills: [] });
  const [skillInput, setSkillInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const addSkill = (skill) => {
    const trimmed = skill.trim();
    if (trimmed && !form.skills.includes(trimmed)) {
      setForm(f => ({ ...f, skills: [...f.skills, trimmed] }));
    }
    setSkillInput('');
  };

  const removeSkill = (skill) => setForm(f => ({ ...f, skills: f.skills.filter(s => s !== skill) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/register', { ...form, year: form.year ? parseInt(form.year) : null });
      login(res.data);
      navigate('/dashboard');
    } catch (err) {
      const data = err.response?.data;
      setError(data?.email?.[0] || data?.username?.[0] || data?.detail || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg animate-slide-up">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white">Join TeamVerse</h1>
          <p className="text-slate-400 mt-1">Create your profile and start finding teammates</p>
        </div>

        <div className="glass-card p-8">
          {error && <div className="bg-red-900/30 border border-red-700/40 text-red-400 text-sm px-4 py-3 rounded-xl mb-5">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Email *</label>
                <input id="reg-email" type="email" className="input-field" placeholder="you@college.edu" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
              </div>
              <div>
                <label className="label">Username *</label>
                <input id="reg-username" type="text" className="input-field" placeholder="coolhacker99" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} required />
              </div>
            </div>
            <div>
              <label className="label">Password *</label>
              <input id="reg-password" type="password" className="input-field" placeholder="Min 6 characters" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required minLength={6} />
            </div>
            <div>
              <label className="label">College</label>
              <input type="text" className="input-field" placeholder="MIT, IIT Delhi, Stanford..." value={form.college} onChange={e => setForm({ ...form, college: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Branch</label>
                <input type="text" className="input-field" placeholder="CS, ECE, ME..." value={form.branch} onChange={e => setForm({ ...form, branch: e.target.value })} />
              </div>
              <div>
                <label className="label">Year</label>
                <select className="input-field" value={form.year} onChange={e => setForm({ ...form, year: e.target.value })}>
                  <option value="">Select year</option>
                  {[1, 2, 3, 4].map(y => <option key={y} value={y}>{y}{['st','nd','rd','th'][y-1]} Year</option>)}
                </select>
              </div>
            </div>

            {/* Skills */}
            <div>
              <label className="label">Skills</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  className="input-field flex-1"
                  placeholder="Type a skill and press Enter"
                  value={skillInput}
                  onChange={e => setSkillInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(skillInput); } }}
                />
                <button type="button" onClick={() => addSkill(skillInput)} className="btn-secondary !px-4">Add</button>
              </div>
              {/* Quick-add chips */}
              <div className="flex flex-wrap gap-1.5 mb-2">
                {COMMON_SKILLS.filter(s => !form.skills.includes(s)).slice(0, 8).map(s => (
                  <button key={s} type="button" onClick={() => addSkill(s)} className="text-xs px-2.5 py-1 rounded-full bg-dark-600 border border-dark-400 text-slate-400 hover:border-primary-600 hover:text-primary-300 transition-colors">
                    + {s}
                  </button>
                ))}
              </div>
              {form.skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {form.skills.map(s => <SkillBadge key={s} skill={s} onRemove={removeSkill} />)}
                </div>
              )}
            </div>

            <button id="reg-submit" type="submit" disabled={loading} className="btn-primary w-full !py-3 mt-2 disabled:opacity-60">
              {loading ? 'Creating account...' : 'Create Account →'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
