import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

// ── Profile ──────────────────────────────────────────
export const fetchProfile = async (username) => {
  const res = await api.get(`/profile/${username}`)
  return res.data
}

// ── Recommendations ───────────────────────────────────
export const fetchRecommendations = async ({ skill_level, top_skills, experience_areas, languages }) => {
  const res = await api.post('/recommend/', {
    skill_level,
    top_skills,
    experience_areas,
    languages,
  })
  return res.data
}

// ── Mentor ────────────────────────────────────────────
export const explainRepo = async ({ owner, repo, skill_level }) => {
  const res = await api.post('/mentor/explain', { owner, repo, skill_level })
  return res.data
}

export const fetchIssues = async (owner, repo) => {
  const res = await api.get(`/mentor/issues/${owner}/${repo}`)
  return res.data
}
