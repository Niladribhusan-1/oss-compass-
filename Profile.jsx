import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Github, MapPin, Users, BookMarked, ChevronRight } from 'lucide-react'
import { fetchProfile, fetchRecommendations } from '../api/client'
import { Loader, ErrorBox, SkillPill, Badge, Card } from '../components/UI'

export default function Profile() {
  const { username } = useParams()
  const navigate = useNavigate()

  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [fetching, setFetching] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        const data = await fetchProfile(username)
        setProfile(data)
      } catch (e) {
        setError(e.response?.data?.detail || 'Failed to fetch profile. Check the username.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [username])

  const handleFindProjects = async () => {
    if (!profile) return
    setFetching(true)
    try {
      const { analysis, languages } = profile
      const recs = await fetchRecommendations({
        skill_level: analysis.skill_level,
        top_skills: analysis.top_skills,
        experience_areas: analysis.experience_areas,
        languages,
      })
      navigate('/recommendations', { state: { recs, analysis, username } })
    } catch (e) {
      setError('Failed to get recommendations. Try again.')
    } finally {
      setFetching(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen pt-14 grid-bg">
      <Loader text={`Analyzing @${username}...`} />
    </div>
  )

  if (error) return (
    <div className="min-h-screen pt-14 grid-bg max-w-xl mx-auto px-6 pt-20">
      <ErrorBox message={error} />
    </div>
  )

  const { github, languages, analysis } = profile
  const topLangs = Object.entries(languages || {}).slice(0, 6)

  return (
    <div className="min-h-screen pt-14 grid-bg">
      <div className="max-w-4xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-6 items-start mb-8 animate-fade-up stagger-1">
          <img
            src={github.avatar_url}
            alt={github.username}
            className="w-20 h-20 rounded-xl border-2 border-border"
          />
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap mb-2">
              <h1 className="font-display font-bold text-2xl text-text">
                {github.name || github.username}
              </h1>
              <SkillPill level={analysis.skill_level} />
            </div>
            <p className="font-mono text-xs text-text-muted mb-2">@{github.username}</p>
            {github.bio && (
              <p className="font-mono text-sm text-text-muted max-w-xl">{github.bio}</p>
            )}
            <div className="flex items-center gap-4 mt-3 flex-wrap">
              {github.location && (
                <span className="flex items-center gap-1 text-xs font-mono text-text-muted">
                  <MapPin size={11} /> {github.location}
                </span>
              )}
              <span className="flex items-center gap-1 text-xs font-mono text-text-muted">
                <Users size={11} /> {github.followers} followers
              </span>
              <span className="flex items-center gap-1 text-xs font-mono text-text-muted">
                <BookMarked size={11} /> {github.public_repos} repos
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

          {/* AI Summary */}
          <Card className="animate-fade-up stagger-2">
            <p className="text-accent text-xs font-mono tracking-widest uppercase mb-3">AI Analysis</p>
            <p className="font-mono text-sm text-text leading-relaxed">{analysis.summary}</p>
            <div className="mt-3 flex items-center gap-2">
              <div className="flex-1 bg-surface rounded-full h-1.5">
                <div
                  className="bg-accent h-1.5 rounded-full transition-all"
                  style={{ width: `${(analysis.confidence_score || 0.8) * 100}%` }}
                />
              </div>
              <span className="text-xs font-mono text-text-muted">
                {Math.round((analysis.confidence_score || 0.8) * 100)}% confidence
              </span>
            </div>
          </Card>

          {/* Languages */}
          <Card className="animate-fade-up stagger-3">
            <p className="text-accent text-xs font-mono tracking-widest uppercase mb-3">Languages</p>
            <div className="space-y-2">
              {topLangs.map(([lang, count], i) => {
                const max = topLangs[0]?.[1] || 1
                return (
                  <div key={lang} className="flex items-center gap-3">
                    <span className="font-mono text-xs text-text-muted w-24 truncate">{lang}</span>
                    <div className="flex-1 bg-surface rounded-full h-1">
                      <div
                        className="bg-accent/70 h-1 rounded-full"
                        style={{ width: `${(count / max) * 100}%` }}
                      />
                    </div>
                    <span className="font-mono text-xs text-text-muted">{count}</span>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">

          {/* Skills */}
          <Card className="animate-fade-up stagger-4">
            <p className="text-accent text-xs font-mono tracking-widest uppercase mb-3">Top Skills</p>
            <div className="flex flex-wrap gap-2">
              {analysis.top_skills?.map(skill => (
                <Badge key={skill} variant="green">{skill}</Badge>
              ))}
            </div>
          </Card>

          {/* Contribution Types */}
          <Card className="animate-fade-up stagger-5">
            <p className="text-accent text-xs font-mono tracking-widest uppercase mb-3">Best Contribution Types</p>
            <div className="flex flex-wrap gap-2">
              {analysis.recommended_contribution_types?.map(type => (
                <Badge key={type}>{type}</Badge>
              ))}
            </div>
          </Card>
        </div>

        {/* CTA */}
        <div className="text-center animate-fade-up" style={{ animationDelay: '0.6s', opacity: 0 }}>
          <button
            onClick={handleFindProjects}
            disabled={fetching}
            className="bg-accent text-bg font-display font-bold text-sm px-8 py-4 rounded-xl hover:bg-accent-dim transition-all flex items-center gap-3 mx-auto disabled:opacity-60"
          >
            {fetching ? (
              <>
                <div className="w-4 h-4 border-2 border-bg/30 border-t-bg rounded-full animate-spin" />
                Finding perfect projects...
              </>
            ) : (
              <>
                Find My Perfect Projects
                <ChevronRight size={16} />
              </>
            )}
          </button>
          <p className="text-text-muted font-mono text-xs mt-3">
            AI will match you to 6 open source projects based on your profile
          </p>
        </div>
      </div>
    </div>
  )
}
