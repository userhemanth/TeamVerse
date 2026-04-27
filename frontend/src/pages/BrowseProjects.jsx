import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import ProjectCard from '../components/ProjectCard';

const TYPES = ['', 'HACKATHON', 'SIDE_PROJECT', 'RESEARCH', 'STARTUP'];
const TYPE_LABELS = { '': 'All Types', HACKATHON: 'Hackathon', SIDE_PROJECT: 'Side Project', RESEARCH: 'Research', STARTUP: 'Startup' };

export default function BrowseProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ q: '', type: '', status: 'OPEN', skill: '' });

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.q) params.set('q', filters.q);
    if (filters.type) params.set('type', filters.type);
    if (filters.status) params.set('status', filters.status);
    if (filters.skill) params.set('skill', filters.skill);
    api.get(`/projects?${params}`).then(res => setProjects(res.data)).finally(() => setLoading(false));
  }, [filters]);

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="section-title">Browse Projects</h1>
          <p className="section-subtitle">Find the perfect project to join</p>
        </div>
        <Link to="/projects/new" className="btn-primary">+ Post Project</Link>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 mb-6 flex flex-wrap gap-3">
        <input
          type="text"
          className="input-field flex-1 min-w-48 !py-2"
          placeholder="🔍 Search projects..."
          value={filters.q}
          onChange={e => setFilters(f => ({ ...f, q: e.target.value }))}
        />
        <input
          type="text"
          className="input-field w-40 !py-2"
          placeholder="Filter by skill"
          value={filters.skill}
          onChange={e => setFilters(f => ({ ...f, skill: e.target.value }))}
        />
        <select className="input-field w-44 !py-2" value={filters.type} onChange={e => setFilters(f => ({ ...f, type: e.target.value }))}>
          {TYPES.map(t => <option key={t} value={t}>{TYPE_LABELS[t]}</option>)}
        </select>
        <select className="input-field w-36 !py-2" value={filters.status} onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}>
          <option value="">All Status</option>
          <option value="OPEN">Open</option>
          <option value="CLOSED">Closed</option>
        </select>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => <div key={i} className="glass-card h-52 animate-pulse" />)}
        </div>
      ) : projects.length === 0 ? (
        <div className="glass-card p-16 text-center">
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-slate-400">No projects found. Try adjusting your filters.</p>
          <Link to="/projects/new" className="btn-primary mt-4 inline-block">Be the first to post!</Link>
        </div>
      ) : (
        <>
          <p className="text-sm text-slate-500 mb-4">{projects.length} project{projects.length !== 1 ? 's' : ''} found</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map(p => <ProjectCard key={p.id} project={p} />)}
          </div>
        </>
      )}
    </div>
  );
}
