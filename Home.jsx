import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Github, Zap, BookOpen, Compass } from 'lucide-react'

export default function Home() {
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = username.trim()
    if (!trimmed) { setError('Enter a GitHub username'); return }
    setError('')
    navigate(`/profile/${trimmed}`)
  }

  const features = [
    { icon: Github,   title: 'Profile Analysis',    desc: 'AI reads your GitHub repos and detects your real skill level' },
    { icon: Zap,      title: 'Smart Matching',       desc: 'ML matches you to projects where your skills fit perfectly' },
    { icon: BookOpen, title: 'AI Code Mentor',       desc: 'Paste any repo — AI explains structure and your first PR' },
  ]

  const exampleUsers = ['torvalds', 'gaearon', 'sindresorhus', 'nicolo-ribaudo']

  return (
    <div className="min-h-screen grid-bg pt-14">

      {/* Hero */}
      <section className="relative max-w-4xl mx-auto px-6 pt-24 pb-16 text-center">

        {/* Decorative orb */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

        {/* Tag */}
        <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/25 rounded-full px-4 py-1.5 mb-8 animate-fade-up stagger-1">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-slow" />
          <span className="text-accent text-xs font-mono tracking-wide">Open Source Hackathon Project</span>
        </div>

        {/* Headline */}
        <h1 className="font-display font-extrabold text-5xl sm:text-6xl text-text leading-tight mb-4 animate-fade-up stagger-2">
          Find Your First<br />
          <span className="text-accent glow-text">OSS Contribution</span>
        </h1>

        <p className="text-text-muted font-mono text-sm sm:text-base max-w-xl mx-auto mb-10 animate-fade-up stagger-3">
          Enter your GitHub username → AI analyzes your skills → 
          Get matched to perfect open source projects → AI explains the codebase
        </p>

        {/* Input */}
        <form onSubmit={handleSubmit} className="animate-fade-up stagger-4 max-w-lg mx-auto">
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
              <Github size={16} />
            </div>
            <input
              type="text"
              placeholder="your-github-username"
              value={username}
              onChange={(e) => { setUsername(e.target.value); setError('') }}
              className="w-full bg-surface border border-border rounded-xl pl-10 pr-36 py-4 font-mono text-sm text-text placeholder-muted focus:outline-none focus:border-accent/60 focus:bg-card transition-all glow-green"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-accent text-bg font-mono font-bold text-xs px-4 py-2 rounded-lg hover:bg-accent-dim transition-colors flex items-center gap-2"
            >
              <Search size={12} />
              Analyze
            </button>
          </div>

          {error && (
            <p className="text-red-400 font-mono text-xs mt-2 text-left">{error}</p>
          )}

          {/* Quick examples */}
          <div className="flex items-center gap-2 mt-3 justify-center flex-wrap">
            <span className="text-text-muted font-mono text-xs">try:</span>
            {exampleUsers.map(u => (
              <button
                key={u}
                type="button"
                onClick={() => setUsername(u)}
                className="text-accent/70 hover:text-accent font-mono text-xs underline underline-offset-2 transition-colors"
              >
                {u}
              </button>
            ))}
          </div>
        </form>
      </section>

      {/* Features */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {features.map(({ icon: Icon, title, desc }, i) => (
            <div
              key={title}
              className="bg-card border border-border rounded-xl p-5 hover:border-accent/30 transition-all group animate-fade-up"
              style={{ animationDelay: `${0.5 + i * 0.1}s`, opacity: 0 }}
            >
              <div className="w-8 h-8 bg-accent/10 border border-accent/20 rounded-lg flex items-center justify-center mb-3 group-hover:border-accent/50 transition-colors">
                <Icon size={14} className="text-accent" />
              </div>
              <h3 className="font-display font-bold text-sm text-text mb-1">{title}</h3>
              <p className="font-mono text-xs text-text-muted leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* Terminal decoration */}
        <div className="mt-8 bg-card border border-border rounded-xl overflow-hidden animate-fade-up stagger-5">
          <div className="border-b border-border px-4 py-2 flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-accent/70" />
            <span className="text-text-muted font-mono text-xs ml-2">oss-compass — terminal</span>
          </div>
          <div className="p-4 font-mono text-xs text-text-muted space-y-1">
            <p><span className="text-accent">$</span> oss-compass analyze torvalds</p>
            <p className="text-text-muted/60">→ Fetching GitHub profile...</p>
            <p className="text-text-muted/60">→ Analyzing 1,234 repositories...</p>
            <p className="text-text-muted/60">→ Detecting skill profile...</p>
            <p className="text-accent">✓ Skill level: Advanced | Top: C, Shell, Python</p>
            <p className="text-accent">✓ 6 perfect contributions found!</p>
            <p><span className="text-text-muted">$ </span><span className="animate-blink">_</span></p>
          </div>
        </div>
      </section>
    </div>
  )
}
