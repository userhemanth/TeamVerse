import { Link } from 'react-router-dom';
import SkillBadge from './SkillBadge';

const TYPE_LABELS = {
  HACKATHON: { label: 'Hackathon', color: 'bg-cyan-900/40 text-cyan-400 border-cyan-700/40' },
  SIDE_PROJECT: { label: 'Side Project', color: 'bg-purple-900/40 text-purple-400 border-purple-700/40' },
  RESEARCH: { label: 'Research', color: 'bg-blue-900/40 text-blue-400 border-blue-700/40' },
  STARTUP: { label: 'Startup', color: 'bg-orange-900/40 text-orange-400 border-orange-700/40' },
};

export default function ProjectCard({ project, matchScore }) {
  const typeInfo = TYPE_LABELS[project.project_type] || { label: project.project_type, color: 'bg-dark-500 text-slate-400 border-dark-400' };

  return (
    <div className="glass-card p-5 hover:border-primary-700/50 transition-all duration-200 hover:shadow-lg hover:shadow-primary-900/20 animate-fade-in group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className={`badge border ${typeInfo.color} text-xs`}>{typeInfo.label}</span>
            <span className={project.status === 'OPEN' ? 'badge-open' : 'badge-closed'}>
              {project.status}
            </span>
          </div>
          <h3 className="text-base font-bold text-white group-hover:text-primary-300 transition-colors truncate">
            {project.title}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            by <span className="text-slate-300">{project.owner?.username}</span>
            {project.college && <> · {project.college}</>}
          </p>
        </div>
      </div>

      <p className="text-sm text-slate-400 line-clamp-2 mb-3">{project.description}</p>

      {project.required_skills?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {project.required_skills.slice(0, 4).map(skill => (
            <SkillBadge key={skill} skill={skill} />
          ))}
          {project.required_skills.length > 4 && (
            <span className="badge bg-dark-600 text-slate-500 border border-dark-400 text-xs">
              +{project.required_skills.length - 4} more
            </span>
          )}
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-dark-500">
        <span className="text-xs text-slate-500">
          👥 {(project.member_count ?? 0) + 1} / {project.team_size} members
        </span>
        <Link
          to={`/projects/${project.id}`}
          className="text-xs font-medium text-primary-400 hover:text-primary-300 transition-colors"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
}
