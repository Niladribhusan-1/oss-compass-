import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { ExternalLink, FolderOpen, FileCode, Lightbulb, AlertTriangle, GitPullRequest } from 'lucide-react'
import { explainRepo } from '../api/client'
import { Loader, ErrorBox, Card, Badge, DifficultyBadge, SectionTitle } from '../components/UI'

export default function Mentor() {
  const { state } = useLocation()

  const [owner, setOwner]           = useState(state?.owner || '')
  const [repo, setRepo]             = useState(state?.repo || '')
  const [skillLevel, setSkillLevel] = useState(state?.skill_level || 'intermediate')
  const [result, setResult]         = useState(null)
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState('')

  // Auto-run if navigated from recommendations
  useEffect(() => {
    if (state?.owner && state?.repo) {
      handleExplain(state.owner, state.repo, state.skill_level || 'intermediate')
    }
  }, [])

  const handleExplain = async (o = owner, r = repo, s = skillLevel) => {
    const trimO = o.trim(), trimR = r.trim()
    if (!trimO || !trimR) { setError('Enter both owner and repo name'); return }
    setError('')
    setLoading(true)
    setResult(null)
    try {
      const data = await explainRepo({ owner: trimO, repo: trimR, skill_level: s })
      setResult(data)
    } catch (e) {
      setError(e.response?.data?.detail || 'Failed to explain repo. Check the repo name.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    handleExplain()
  }

  const parseRepoUrl = (val) => {
    // Support pasting full github URL
    const match = val.match(/github\.com\/([^/]+)\/([^/]+)/)
    if (match) {
      setOwner(match[1])
      setRepo(match[2].replace('.git', ''))
    } else {
      setOwner(val)
    }
  }

  return (
    <div className="min-h-screen pt-14 grid-bg">
      <div className="max-w-4xl mx-auto px-6 py-12">

        <SectionTitle
          label="AI Code Mentor"
          title="Understand Any Repository"
          subtitle="Paste a GitHub repo → AI explains structure, key files, and your first PR"
        />

        {/* Input form */}
        <Card className="mb-8 animate-fade-up stagger-1">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-mono text-xs text-text-muted mb-1.5">
                  GitHub Owner / Org
                </label>
                <input
                  type="text"
                  placeholder="e.g. facebook"
                  value={owner}
                  onChange={(e) => parseRepoUrl(e.target.value)}
                  className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 font-mono text-sm text-text placeholder-muted focus:outline-none focus:border-accent/60 transition-all"
                />
              </div>
              <div>
                <label className="block font-mono text-xs text-text-muted mb-1.5">
                  Repository Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. react"
                  value={repo}
                  onChange={(e) => setRepo(e.target.value)}
                  className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 font-mono text-sm text-text placeholder-muted focus:outline-none focus:border-accent/60 transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="block font-mono text-xs text-text-muted mb-1.5">
                  Your Skill Level
                </label>
                <div className="flex gap-2">
                  {['beginner', 'intermediate', 'advanced'].map(lvl => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setSkillLevel(lvl)}
                      className={`flex-1 py-2 rounded-lg font-mono text-xs transition-all ${
                        skillLevel === lvl
                          ? 'bg-accent/15 border border-accent/40 text-accent'
                          : 'bg-surface border border-border text-text-muted hover:border-border/80'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {error && <ErrorBox message={error} />}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-accent text-bg font-display font-bold text-sm py-3 rounded-xl hover:bg-accent-dim transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-bg/30 border-t-bg rounded-full animate-spin" />
                    AI is reading the codebase...
                  </>
                ) : (
                  'Explain This Repo'
                )}
              </button>
            </div>

            <p className="font-mono text-xs text-text-muted">
              💡 Tip: You can also paste a full GitHub URL like{' '}
              <span className="text-accent/70">https://github.com/owner/repo</span>
            </p>
          </form>
        </Card>

        {/* Result */}
        {loading && <Loader text={`AI is analyzing ${owner}/${repo}...`} />}

        {result && (
          <div className="space-y-5 animate-fade-up">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="font-display font-bold text-xl text-text">{result.repo}</h2>
              <a
                href={result.github_url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-xs font-mono text-accent hover:underline"
              >
                View on GitHub <ExternalLink size={11} />
              </a>
            </div>

            {/* Summary */}
            <Card>
              <p className="text-accent text-xs font-mono tracking-widest uppercase mb-2">Project Summary</p>
              <p className="font-mono text-sm text-text leading-relaxed">
                {result.explanation.project_summary}
              </p>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {result.explanation.tech_stack?.map(t => (
                  <Badge key={t} variant="blue">{t}</Badge>
                ))}
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Folder breakdown */}
              <Card>
                <div className="flex items-center gap-2 mb-3">
                  <FolderOpen size={14} className="text-accent" />
                  <p className="text-accent text-xs font-mono tracking-widest uppercase">Folder Structure</p>
                </div>
                <div className="space-y-2.5">
                  {result.explanation.folder_breakdown?.map((f, i) => (
                    <div key={i}>
                      <p className="font-mono text-xs text-accent/80">{f.folder}</p>
                      <p className="font-mono text-xs text-text-muted">{f.purpose}</p>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Key files */}
              <Card>
                <div className="flex items-center gap-2 mb-3">
                  <FileCode size={14} className="text-accent" />
                  <p className="text-accent text-xs font-mono tracking-widest uppercase">Key Files</p>
                </div>
                <div className="space-y-2.5">
                  {result.explanation.key_files?.map((f, i) => (
                    <div key={i}>
                      <p className="font-mono text-xs text-accent/80">{f.file}</p>
                      <p className="font-mono text-xs text-text-muted">{f.purpose}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Where to start */}
            <Card>
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb size={14} className="text-accent" />
                <p className="text-accent text-xs font-mono tracking-widest uppercase">Where to Start</p>
              </div>
              <p className="font-mono text-sm text-text leading-relaxed">
                {result.explanation.where_to_start}
              </p>
            </Card>

            {/* Contribution roadmap */}
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <GitPullRequest size={14} className="text-accent" />
                <p className="text-accent text-xs font-mono tracking-widest uppercase">Contribution Roadmap</p>
              </div>
              <div className="space-y-3">
                {result.explanation.contribution_roadmap?.map((step, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <div className="w-6 h-6 rounded-md bg-accent/10 border border-accent/25 flex items-center justify-center shrink-0">
                      <span className="font-mono text-xs text-accent">{step.step}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-mono text-sm text-text">{step.action}</p>
                    </div>
                    <DifficultyBadge difficulty={step.difficulty} />
                  </div>
                ))}
              </div>
            </Card>

            {/* First PR */}
            <Card className="border-accent/20 bg-accent/5">
              <p className="text-accent text-xs font-mono tracking-widest uppercase mb-2">
                🎯 Your First PR Idea
              </p>
              <p className="font-mono text-sm text-text leading-relaxed">
                {result.explanation.first_pr_idea}
              </p>
            </Card>

            {/* Gotchas */}
            {result.explanation.gotchas?.length > 0 && (
              <Card>
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle size={14} className="text-yellow-400" />
                  <p className="text-yellow-400 text-xs font-mono tracking-widest uppercase">Watch Out For</p>
                </div>
                <div className="space-y-1.5">
                  {result.explanation.gotchas.map((g, i) => (
                    <p key={i} className="font-mono text-xs text-text-muted flex gap-2">
                      <span className="text-yellow-400/50">⚠</span> {g}
                    </p>
                  ))}
                </div>
              </Card>
            )}

            {/* Good first issues */}
            {result.good_first_issues?.length > 0 && (
              <Card>
                <p className="text-accent text-xs font-mono tracking-widest uppercase mb-3">
                  Open good-first-issues
                </p>
                <div className="space-y-2">
                  {result.good_first_issues.map((issue, i) => (
                    <a
                      key={i}
                      href={issue.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between gap-3 bg-surface border border-border rounded-lg px-3 py-2.5 hover:border-accent/30 transition-all group"
                    >
                      <span className="font-mono text-xs text-text group-hover:text-accent transition-colors truncate">
                        #{issue.number} {issue.title}
                      </span>
                      <ExternalLink size={11} className="text-text-muted shrink-0" />
                    </a>
                  ))}
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
