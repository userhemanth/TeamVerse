import { useEffect, useState } from 'react';
import api from '../api/axios';
import ProjectCard from '../components/ProjectCard';
import MatchScoreBar from '../components/MatchScoreBar';

export default function SmartMatch() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/match/users/me').then(res => setMatches(res.data)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-container">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-primary-900/40 border border-primary-700/40 rounded-full px-4 py-1.5 text-primary-300 text-sm font-medium mb-4">
          ✨ AI-Powered Matching
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3">
          Your Perfect{' '}
          <span className="bg-gradient-to-r from-primary-400 to-accent bg-clip-text text-transparent">
            Project Matches
          </span>
        </h1>
        <p className="text-slate-400 max-w-xl mx-auto">
          Our algorithm matches you to open projects based on your skills, college, and year.
          Minimum 30% skill match required. College & year bonuses applied.
        </p>
      </div>

      {/* How it works */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {[
          { icon: '🧠', title: 'Skill Analysis', desc: 'Compares your skills to required skills per project.' },
          { icon: '🎓', title: 'College Bonus', desc: '+10 points if you\'re from the same college as the owner.' },
          { icon: '📅', title: 'Year Bonus', desc: '+5 points if you\'re in the same year of study.' },
        ].map(item => (
          <div key={item.title} className="glass-card p-4 flex items-start gap-3">
            <span className="text-2xl">{item.icon}</span>
            <div><div className="font-medium text-white text-sm">{item.title}</div><div className="text-xs text-slate-400 mt-0.5">{item.desc}</div></div>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[...Array(4)].map((_, i) => <div key={i} className="glass-card h-52 animate-pulse" />)}
        </div>
      ) : matches.length === 0 ? (
        <div className="glass-card p-16 text-center">
          <div className="text-5xl mb-4">🤔</div>
          <h3 className="text-white font-semibold mb-2">No matches found</h3>
          <p className="text-slate-400 text-sm">Add more skills to your profile to get matched with open projects.</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-slate-500 mb-4">{matches.length} project{matches.length !== 1 ? 's' : ''} matched</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {matches.map(({ project, score }) => (
              <div key={project.id} className="glass-card p-5 hover:border-primary-700/50 transition-all duration-200 animate-fade-in">
                <div className="mb-4">
                  <MatchScoreBar score={score} />
                </div>
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
