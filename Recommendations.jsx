import { useLocation, useNavigate } from 'react-router-dom'
import { ExternalLink, BookOpen, Star, ChevronRight, ArrowLeft } from 'lucide-react'
import { Card, Badge, DifficultyBadge, SkillPill, SectionTitle } from '../components/UI'

export default function Recommendations() {
  const { state } = useLocation()
  const navigate = useNavigate()

  if (!state?.recs) {
    return (
      <div className="min-h-screen pt-14 grid-bg flex items-center justify-center">
        <div className="text-center">
          <p className="text-text-muted font-mono text-sm mb-4">No recommendations loaded.</p>
          <button
            onClick={() => navigate('/')}
            className="text-accent font-mono text-sm underline"
          >
            ← Go back home
          </button>
        </div>
      </div>
    )
  }

  const { recs, analysis, username } = state
  const projects = recs.recommendations || []

  const categoryColors = {
    web:        'blue',
    cli:        'green',
    library:    'yellow',
    framework:  'red',
    data:       'blue',
    devtools:   'green',
    other:      'default',
  }

  return (
    <div className="min-h-screen pt-14 grid-bg">
      <div className="max-w-5xl mx-auto px-6 py-12">

        {/* Back */}
        <button
          onClick={() => navigate(`/profile/${username}`)}
          className="flex items-center gap-2 text-text-muted hover:text-text font-mono text-xs mb-8 transition-colors"
        >
          <ArrowLeft size={12} /> back to profile
        </button>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-10 animate-fade-up stagger-1">
          <div className="flex-1">
            <SectionTitle
              label="AI Recommendations"
              title={`${projects.length} Perfect Matches for @${username}`}
              subtitle="Sorted by fit score — projects where your skills align best"
            />
          </div>
          <SkillPill level={analysis?.skill_level} />
        </div>

        {/* Projects grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project, i) => (
            <Card
              key={i}
              hover
              className="animate-fade-up flex flex-col gap-3"
              style={{ animationDelay: `${0.2 + i * 0.08}s`, opacity: 0 }}
            >
              {/* Top row */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-bold text-text text-sm truncate">
                    {project.display_name}
                  </h3>
                  <p className="font-mono text-xs text-text-muted truncate">{project.repo_name}</p>
                </div>
                <DifficultyBadge difficulty={project.difficulty} />
              </div>

              {/* Description */}
              <p className="font-mono text-xs text-text-muted leading-relaxed line-clamp-2">
                {project.description}
              </p>

              {/* Why good fit */}
              <div className="bg-accent/5 border border-accent/15 rounded-lg px-3 py-2">
                <p className="font-mono text-xs text-accent/80">
                  ✓ {project.why_good_fit}
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                <Badge variant={categoryColors[project.category] || 'default'}>
                  {project.category}
                </Badge>
                <Badge>{project.language}</Badge>
              </div>

              {/* Contribution ideas */}
              {project.contribution_ideas?.length > 0 && (
                <div className="space-y-1">
                  <p className="font-mono text-xs text-text-muted">Ideas:</p>
                  {project.contribution_ideas.slice(0, 2).map((idea, j) => (
                    <p key={j} className="font-mono text-xs text-text-muted/70 flex gap-2">
                      <span className="text-accent/50">→</span> {idea}
                    </p>
                  ))}
                </div>
              )}

              {/* Good first issues */}
              {project.good_first_issues?.length > 0 && (
                <div className="border-t border-border pt-3 space-y-1">
                  <p className="font-mono text-xs text-text-muted mb-1">Open Issues:</p>
                  {project.good_first_issues.slice(0, 2).map((issue, j) => (
                    <a
                      key={j}
                      href={issue.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 text-xs font-mono text-accent/70 hover:text-accent transition-colors"
                    >
                      <span className="text-accent/40">#</span>
                      <span className="truncate">{issue.title}</span>
                      <ExternalLink size={10} className="shrink-0" />
                    </a>
                  ))}
                </div>
              )}

              {/* Bottom actions */}
              <div className="flex gap-2 pt-1 mt-auto">
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 bg-surface border border-border rounded-lg py-2 font-mono text-xs text-text-muted hover:border-accent/40 hover:text-accent transition-all"
                >
                  <Star size={11} /> View Repo
                </a>
                <button
                  onClick={() => {
                    const [owner, repo] = project.repo_name.split('/')
                    navigate('/mentor', {
                      state: {
                        owner,
                        repo,
                        skill_level: analysis?.skill_level || 'intermediate',
                      }
                    })
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-accent/10 border border-accent/25 rounded-lg py-2 font-mono text-xs text-accent hover:bg-accent/20 transition-all"
                >
                  <BookOpen size={11} /> AI Explain
                </button>
              </div>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 text-center animate-fade-up" style={{ animationDelay: '0.8s', opacity: 0 }}>
          <p className="font-mono text-xs text-text-muted mb-3">
            Found a repo you like? Let AI explain the codebase →
          </p>
          <button
            onClick={() => navigate('/mentor')}
            className="flex items-center gap-2 mx-auto bg-card border border-border px-5 py-2.5 rounded-xl font-mono text-sm text-text hover:border-accent/40 transition-all"
          >
            Open AI Code Mentor <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
