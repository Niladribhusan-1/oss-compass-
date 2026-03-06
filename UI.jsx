// ─── Loader ─────────────────────────────────────────────────────────
export function Loader({ text = 'Analyzing...' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-2 border-accent/20" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-accent animate-spin" />
      </div>
      <p className="text-text-muted font-mono text-sm">{text}</p>
    </div>
  )
}

// ─── Badge ──────────────────────────────────────────────────────────
export function Badge({ children, variant = 'default' }) {
  const styles = {
    default: 'bg-surface border-border text-text-muted',
    green:   'bg-accent/10 border-accent/30 text-accent',
    yellow:  'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
    blue:    'bg-blue-500/10 border-blue-500/30 text-blue-400',
    red:     'bg-red-500/10 border-red-500/30 text-red-400',
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded border text-xs font-mono ${styles[variant]}`}>
      {children}
    </span>
  )
}

// ─── Card ────────────────────────────────────────────────────────────
export function Card({ children, className = '', hover = false }) {
  return (
    <div className={`
      bg-card border border-border rounded-xl p-5
      ${hover ? 'hover:border-accent/30 hover:bg-card/80 transition-all cursor-pointer' : ''}
      ${className}
    `}>
      {children}
    </div>
  )
}

// ─── Section Title ────────────────────────────────────────────────────
export function SectionTitle({ label, title, subtitle }) {
  return (
    <div className="mb-8">
      {label && (
        <p className="text-accent text-xs font-mono tracking-widest uppercase mb-2">{label}</p>
      )}
      <h2 className="font-display font-bold text-2xl text-text">{title}</h2>
      {subtitle && <p className="text-text-muted font-mono text-sm mt-1">{subtitle}</p>}
    </div>
  )
}

// ─── Error Box ────────────────────────────────────────────────────────
export function ErrorBox({ message }) {
  return (
    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 font-mono text-sm">
      ⚠ {message}
    </div>
  )
}

// ─── Skill Level Pill ─────────────────────────────────────────────────
export function SkillPill({ level }) {
  const map = {
    beginner:     { color: 'green',  label: '● Beginner' },
    intermediate: { color: 'yellow', label: '●● Intermediate' },
    advanced:     { color: 'red',    label: '●●● Advanced' },
  }
  const { color, label } = map[level] || map['beginner']
  return <Badge variant={color}>{label}</Badge>
}

// ─── Difficulty Badge ─────────────────────────────────────────────────
export function DifficultyBadge({ difficulty }) {
  const map = {
    beginner:     'green',
    intermediate: 'yellow',
    advanced:     'red',
  }
  return <Badge variant={map[difficulty] || 'default'}>{difficulty}</Badge>
}
