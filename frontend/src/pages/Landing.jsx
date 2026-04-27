import { Link } from 'react-router-dom';

const features = [
  { icon: '🎯', title: 'Smart Matching', desc: 'AI-powered skill-based algorithm finds your ideal teammates with 30%+ compatibility.' },
  { icon: '🚀', title: 'Project Board', desc: 'Browse and post projects — hackathons, side projects, research, and startups.' },
  { icon: '💬', title: 'Real-time Chat', desc: 'WebSocket-powered messaging to collaborate with your team instantly.' },
  { icon: '🏆', title: 'Hackathon Board', desc: 'Discover upcoming hackathons and find teammates before the deadline.' },
  { icon: '🔐', title: 'Secure Auth', desc: 'JWT-based authentication with 24-hour token lifetime.' },
  { icon: '📊', title: 'Team Requests', desc: 'Send, receive, and manage join requests with one click.' },
];

export default function Landing() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-600/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl" />
        </div>

        <div className="page-container relative text-center py-24">
          <div className="inline-flex items-center gap-2 bg-primary-900/40 border border-primary-700/40 rounded-full px-4 py-1.5 text-primary-300 text-sm font-medium mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-primary-400 animate-pulse-slow" />
            Now in Beta — College Project Finder
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 animate-slide-up leading-tight">
            Find Your{' '}
            <span className="bg-gradient-to-r from-primary-400 via-purple-400 to-accent bg-clip-text text-transparent">
              Dream Team
            </span>
          </h1>

          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 animate-fade-in">
            TeamVerse connects college students with the right project partners. 
            Post your idea, get matched by skills, and build something amazing together.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
            <Link to="/register" className="btn-primary text-base !px-8 !py-3">
              Get Started Free →
            </Link>
            <Link to="/projects" className="btn-secondary text-base !px-8 !py-3">
              Browse Projects
            </Link>
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-12 mt-16 animate-fade-in">
            {[['Smart Match', 'Algorithm'], ['Real-time', 'Messaging'], ['6 App', 'Modules']].map(([top, bottom]) => (
              <div key={top} className="text-center">
                <div className="text-2xl font-bold text-white">{top}</div>
                <div className="text-sm text-slate-500">{bottom}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="page-container py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-3">Everything You Need</h2>
          <p className="text-slate-400">Built for college students, by developers who understand the hackathon grind.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(f => (
            <div key={f.title} className="glass-card p-6 hover:border-primary-700/40 transition-all duration-200 group">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="text-white font-semibold mb-2 group-hover:text-primary-300 transition-colors">{f.title}</h3>
              <p className="text-sm text-slate-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="page-container py-16 text-center">
        <div className="glass-card p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900/20 to-transparent pointer-events-none" />
          <h2 className="text-3xl font-bold text-white mb-4 relative">Ready to Build Something?</h2>
          <p className="text-slate-400 mb-8 relative">Join TeamVerse and find teammates who match your vision.</p>
          <Link to="/register" className="btn-primary text-base !px-10 !py-3 relative">
            Start Building →
          </Link>
        </div>
      </section>
    </div>
  );
}
