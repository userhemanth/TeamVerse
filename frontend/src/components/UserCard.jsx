import { Link } from 'react-router-dom';
import SkillBadge from './SkillBadge';

export default function UserCard({ user, matchScore, actionSlot }) {
  return (
    <div className="glass-card p-5 hover:border-primary-700/50 transition-all duration-200 hover:shadow-lg hover:shadow-primary-900/20 animate-fade-in">
      <div className="flex items-start gap-3 mb-3">
        {/* Avatar */}
        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary-500 to-accent flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
          {user.username?.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <Link to={`/users/${user.id}`} className="font-semibold text-white hover:text-primary-300 transition-colors block truncate">
            {user.username}
          </Link>
          <p className="text-xs text-slate-400 truncate">
            {[user.branch, user.year ? `Year ${user.year}` : null, user.college].filter(Boolean).join(' · ')}
          </p>
        </div>
        <div className={`flex-shrink-0 w-2.5 h-2.5 rounded-full mt-1 ${user.is_available ? 'bg-emerald-400' : 'bg-slate-500'}`} title={user.is_available ? 'Available' : 'Unavailable'} />
      </div>

      {user.bio && <p className="text-sm text-slate-400 line-clamp-2 mb-3">{user.bio}</p>}

      {user.skills?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {user.skills.slice(0, 4).map(skill => <SkillBadge key={skill} skill={skill} />)}
          {user.skills.length > 4 && (
            <span className="badge bg-dark-600 text-slate-500 border border-dark-400 text-xs">+{user.skills.length - 4}</span>
          )}
        </div>
      )}

      {user.github_url && (
        <a href={user.github_url} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-500 hover:text-primary-400 transition-colors">
          🔗 GitHub
        </a>
      )}

      {actionSlot && <div className="mt-3 pt-3 border-t border-dark-500">{actionSlot}</div>}
    </div>
  );
}
