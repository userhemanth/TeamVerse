import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import SkillBadge from '../components/SkillBadge';
import UserCard from '../components/UserCard';

const COMMON_SKILLS = ['Python', 'Django', 'React', 'Node.js', 'Java', 'Flutter', 'ML/AI', 'UI/UX', 'MongoDB', 'SQL', 'TypeScript', 'Docker', 'Figma', 'Go', 'Rust'];

function NewProjectForm({ onSave }) {
  const [form, setForm] = useState({ title: '', description: '', project_type: 'SIDE_PROJECT', required_skills: [], team_size: 4, status: 'OPEN', college: '' });
  const [skillInput, setSkillInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const addSkill = (skill) => {
    const t = skill.trim();
    if (t && !form.required_skills.includes(t)) setForm(f => ({ ...f, required_skills: [...f.required_skills, t] }));
    setSkillInput('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/projects', form);
      onSave(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create project.');
    } finally { setLoading(false); }
  };

  return (
    <div className="page-container max-w-2xl">
      <h1 className="section-title mb-6">Post a New Project</h1>
      <div className="glass-card p-8">
        {error && <div className="bg-red-900/30 border border-red-700/40 text-red-400 text-sm px-4 py-3 rounded-xl mb-5">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="label">Title *</label><input type="text" className="input-field" placeholder="My Awesome Project" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required /></div>
          <div><label className="label">Description *</label><textarea className="input-field min-h-28 resize-y" placeholder="Describe your project..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Type</label>
              <select className="input-field" value={form.project_type} onChange={e => setForm({ ...form, project_type: e.target.value })}>
                {['HACKATHON', 'SIDE_PROJECT', 'RESEARCH', 'STARTUP'].map(t => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
              </select>
            </div>
            <div><label className="label">Team Size</label><input type="number" min="2" max="20" className="input-field" value={form.team_size} onChange={e => setForm({ ...form, team_size: parseInt(e.target.value) })} /></div>
          </div>
          <div><label className="label">College (optional)</label><input type="text" className="input-field" placeholder="Auto-filled from your profile" value={form.college} onChange={e => setForm({ ...form, college: e.target.value })} /></div>
          <div>
            <label className="label">Required Skills</label>
            <div className="flex gap-2 mb-2">
              <input type="text" className="input-field flex-1" placeholder="Add a required skill" value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(skillInput); } }} />
              <button type="button" onClick={() => addSkill(skillInput)} className="btn-secondary !px-4">Add</button>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {COMMON_SKILLS.filter(s => !form.required_skills.includes(s)).slice(0, 8).map(s => (
                <button key={s} type="button" onClick={() => addSkill(s)} className="text-xs px-2.5 py-1 rounded-full bg-dark-600 border border-dark-400 text-slate-400 hover:border-primary-600 hover:text-primary-300 transition-colors">+ {s}</button>
              ))}
            </div>
            {form.required_skills.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {form.required_skills.map(s => <SkillBadge key={s} skill={s} onRemove={skill => setForm(f => ({ ...f, required_skills: f.required_skills.filter(x => x !== skill) }))} />)}
              </div>
            )}
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full !py-3">{loading ? 'Posting...' : 'Post Project'}</button>
        </form>
      </div>
    </div>
  );
}

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requestMsg, setRequestMsg] = useState('');
  const [requestSent, setRequestSent] = useState(false);
  const [requestError, setRequestError] = useState('');

  // New project mode
  if (id === 'new') {
    return <NewProjectForm onSave={(p) => navigate(`/projects/${p.id}`)} />;
  }

  useEffect(() => {
    api.get(`/projects/${id}`).then(res => setProject(res.data)).finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this project?')) return;
    await api.delete(`/projects/${id}`);
    navigate('/projects');
  };

  const handleJoinRequest = async () => {
    setRequestError('');
    try {
      await api.post('/requests', { project: parseInt(id), message: requestMsg });
      setRequestSent(true);
    } catch (err) {
      setRequestError(err.response?.data?.detail || 'Failed to send request.');
    }
  };

  if (loading) return <div className="page-container flex items-center justify-center min-h-[60vh]"><div className="text-slate-400 animate-pulse">Loading project...</div></div>;
  if (!project) return <div className="page-container text-center text-slate-400 py-20">Project not found.</div>;

  const isOwner = user?.id === project.owner?.id;
  const isMember = project.members?.some(m => m.id === user?.id);

  return (
    <div className="page-container max-w-4xl">
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className={project.status === 'OPEN' ? 'badge-open' : 'badge-closed'}>{project.status}</span>
            <span className="badge bg-dark-600 border border-dark-400 text-slate-400 text-xs">{project.project_type?.replace('_', ' ')}</span>
          </div>
          <h1 className="text-3xl font-bold text-white">{project.title}</h1>
          <p className="text-slate-400 mt-1">by {project.owner?.username}{project.college && ` · ${project.college}`}</p>
        </div>
        {isOwner && (
          <div className="flex gap-2">
            <button onClick={handleDelete} className="btn-danger text-sm">Delete</button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="glass-card p-6">
            <h2 className="font-semibold text-white mb-3">About this Project</h2>
            <p className="text-slate-300 leading-relaxed whitespace-pre-line">{project.description}</p>
          </div>

          {project.required_skills?.length > 0 && (
            <div className="glass-card p-6">
              <h2 className="font-semibold text-white mb-3">Required Skills</h2>
              <div className="flex flex-wrap gap-2">
                {project.required_skills.map(s => <SkillBadge key={s} skill={s} />)}
              </div>
            </div>
          )}

          {project.members?.length > 0 && (
            <div className="glass-card p-6">
              <h2 className="font-semibold text-white mb-4">Team Members</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {project.members.map(m => <UserCard key={m.id} user={m} />)}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {/* Meta */}
          <div className="glass-card p-5">
            <h2 className="font-semibold text-white mb-3 text-sm">Project Info</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-slate-500">Team Size</span><span className="text-white">{project.team_size}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Members</span><span className="text-white">{(project.member_count ?? 0) + 1}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Status</span><span className={project.status === 'OPEN' ? 'text-emerald-400' : 'text-red-400'}>{project.status}</span></div>
            </div>
          </div>

          {/* Join Request */}
          {!isOwner && !isMember && project.status === 'OPEN' && (
            <div className="glass-card p-5">
              <h2 className="font-semibold text-white mb-3 text-sm">Join this Project</h2>
              {requestSent ? (
                <div className="bg-emerald-900/30 border border-emerald-700/40 text-emerald-400 text-sm px-3 py-2 rounded-xl">✓ Request sent!</div>
              ) : (
                <>
                  {requestError && <div className="bg-red-900/30 border border-red-700/40 text-red-400 text-xs px-3 py-2 rounded-lg mb-3">{requestError}</div>}
                  <textarea className="input-field min-h-20 text-sm mb-3 resize-none" placeholder="Why do you want to join? (optional)" value={requestMsg} onChange={e => setRequestMsg(e.target.value)} />
                  <button onClick={handleJoinRequest} className="btn-primary w-full text-sm !py-2.5">Send Join Request</button>
                </>
              )}
            </div>
          )}

          {isOwner && (
            <div className="glass-card p-5">
              <p className="text-xs text-slate-500 text-center">You own this project</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
