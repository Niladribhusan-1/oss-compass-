# oss-compass-
AI-powered open source project recommender &amp; code mentor
# 🧭 OSS Compass

> **AI-powered open source project recommender & code mentor** — From zero to first contribution in minutes.

![License](https://img.shields.io/badge/license-MIT-green.svg)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)
![Made With Love](https://img.shields.io/badge/Made%20With-❤️-red.svg)
![Open Source](https://img.shields.io/badge/Open-Source-blue.svg)
![Hackathon](https://img.shields.io/badge/OSS%20Forge-Hackathon-orange.svg)

---

## 📌 Table of Contents

- [About](#-about)
- [Problem Statement](#-problem-statement)
- [Features](#-features)
- [Demo](#-demo)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Contributing](#-contributing)
- [Roadmap](#-roadmap)
- [License](#-license)

---

## 📖 About

**OSS Compass** is an AI-powered web application that helps developers — especially beginners — find the perfect open source project to contribute to, and then understand it deeply enough to actually make their first pull request.

Millions of developers want to contribute to open source but don't know where to start. OSS Compass solves both problems in one seamless flow:

1. **Analyze** your GitHub profile with AI → detect your real skill level and tech stack
2. **Recommend** 6 perfectly matched open source projects using ML
3. **Explain** any repository's structure in plain English with an AI code mentor

> *"The best contribution is the one you actually make."*

---

## 🎯 Problem Statement

Open source contribution is one of the most valuable activities a developer can do — yet the barrier to entry remains extremely high.

**Who experiences the problem?**
Millions of developers globally — especially students, self-taught programmers, and junior developers — who want to contribute to open source but face two major blockers:

1. **Discovery Problem:** With 300M+ repositories on GitHub, finding a project that matches your skill level, interests, and tech stack is overwhelming.
2. **Onboarding Problem:** Even after finding a repo, understanding an unfamiliar codebase — folder structure, key files, where to even begin — takes hours or days.

**Scale of the problem:**
- GitHub has 100M+ registered developers
- Less than 5% actively contribute to open source
- 72% of beginners cite "not knowing where to start" as their #1 blocker
- Most `good-first-issue` labels go unresolved for months due to poor onboarding

**What success looks like:**
A developer with zero OSS contributions can go from "I want to contribute" to "I understand this repo and know exactly what my first PR will be" — in under 10 minutes.

---

## ✨ Features

### 🔍 AI Profile Analyzer
- Paste your GitHub username → AI fetches and reads your repos
- Detects your real skill level (beginner / intermediate / advanced)
- Identifies your top languages, frameworks, and contribution styles
- Generates a confidence-scored developer profile summary

### 🤖 Smart Project Recommender
- ML-powered matching based on your skill profile
- Returns 6 perfectly matched open source repositories
- Each recommendation includes: why it fits you, difficulty rating, contribution ideas
- Pulls real live `good-first-issue` tickets directly from GitHub API

### 📚 AI Code Mentor
- Paste any GitHub repo URL → AI reads and explains the entire codebase
- Plain English breakdown of folder structure and key files
- Step-by-step contribution roadmap tailored to your skill level
- Suggests a specific, concrete idea for your very first pull request
- Highlights common gotchas and things to watch out for

---

## 🎥 Demo

> 📸 Screenshots / GIF coming soon

**Live Demo:**https://asset-organizer--niladribhusan1.replit.app/

**User Flow:**
```
🏠 Home → Enter GitHub Username
    ↓
👤 Profile → See AI skill analysis
    ↓
🎯 Recommendations → Pick a matched project
    ↓
📚 Mentor → Understand the repo + get first PR idea
    ↓
🎉 Make your first open source contribution!
```

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 18 + Vite | UI and routing |
| **Styling** | TailwindCSS | Dark theme design system |
| **Backend** | FastAPI (Python) | REST API server |
| **AI / LLM** | Google Gemini API | Profile analysis + repo explanation |
| **Data** | GitHub REST API | Profile, repos, issues fetching |
| **Deploy (FE)** | Vercel | Frontend hosting |
| **Deploy (BE)** | Render | Backend hosting |

---

## 🚀 Getting Started

### Prerequisites

```bash
node >= 18.0.0
python >= 3.10
git
```

You'll also need:
- **Gemini API Key** → [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey) (free)

---

### 1. Clone the Repository

```bash
git clone https://github.com/Niladribhusan-1/oss-compass-.git
cd oss-compass-
```

### 2. Setup the Backend

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Setup environment variables
cp .env.example .env
```

Open `.env` and fill in your keys:
```env
GEMINI_API_KEY=your_gemini_api_key_here
GITHUB_TOKEN=your_github_token_here
```

Start the backend:
```bash
uvicorn main:app --reload
```

Backend runs at → `http://localhost:8000`
Swagger docs at → `http://localhost:8000/docs`

---

### 3. Setup the Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

Frontend runs at → `http://localhost:5173`

> ✅ Vite automatically proxies all `/api` calls to the backend — no extra config needed!

---

## 📁 Project Structure

```
oss-compass-/
│
├── 📁 backend/
│   ├── main.py                    ← FastAPI app entry point
│   ├── requirements.txt           ← Python dependencies
│   ├── .env.example               ← Environment variables template
│   ├── routes/
│   │   ├── profile.py             ← GET /api/profile/{username}
│   │   ├── recommend.py           ← POST /api/recommend/
│   │   └── mentor.py              ← POST /api/mentor/explain
│   └── services/
│       ├── github_service.py      ← GitHub API integration
│       └── ai_service.py          ← Gemini AI prompts & parsing
│
├── 📁 frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js             ← API proxy config
│   ├── tailwind.config.js
│   └── src/
│       ├── main.jsx               ← React router setup
│       ├── index.css              ← Global styles
│       ├── api/client.js          ← All backend API calls
│       ├── components/
│       │   ├── Navbar.jsx
│       │   └── UI.jsx             ← Reusable components
│       └── pages/
│           ├── Home.jsx           ← Landing + username input
│           ├── Profile.jsx        ← GitHub analysis + skills
│           ├── Recommendations.jsx ← Matched projects grid
│           └── Mentor.jsx         ← AI repo explainer
│
├── 📁 docs/                       ← Extended documentation
├── 📁 tests/                      ← Unit & integration tests
├── 📁 examples/                   ← Usage examples
├── 📁 .github/
│   ├── workflows/ci.yml           ← GitHub Actions CI
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   └── feature_request.md
│   └── PULL_REQUEST_TEMPLATE.md
│
├── README.md
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
├── CHANGELOG.md
├── ROADMAP.md
└── LICENSE
```

---

## 📡 API Documentation

Full Swagger UI available at `http://localhost:8000/docs`

### `GET /api/profile/{username}`
Fetches and AI-analyzes a GitHub user profile.

**Response:**
```json
{
  "github": { "username": "...", "avatar_url": "...", "public_repos": 42 },
  "languages": { "Python": 12, "JavaScript": 8 },
  "analysis": {
    "skill_level": "intermediate",
    "top_skills": ["Python", "FastAPI", "React"],
    "summary": "...",
    "confidence_score": 0.87
  }
}
```

---

### `POST /api/recommend/`
Returns AI-matched open source project recommendations.

**Request:**
```json
{
  "skill_level": "intermediate",
  "top_skills": ["Python", "FastAPI"],
  "experience_areas": ["web development"],
  "languages": { "Python": 12 }
}
```

---

### `POST /api/mentor/explain`
AI explains a repository's structure and suggests first contribution.

**Request:**
```json
{
  "owner": "facebook",
  "repo": "react",
  "skill_level": "intermediate"
}
```

---

## 🤝 Contributing

We love contributions! OSS Compass is itself an open source project — so contribute to the tool that helps people contribute! 🎉

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for full guidelines.

**Quick start:**
```bash
# Fork the repo, then:
git checkout -b feature/your-feature-name
git commit -m "feat: add your feature"
git push origin feature/your-feature-name
# Open a Pull Request!
```

**Good first issues for new contributors:**
- 🎨 Add a new UI theme or dark/light mode toggle
- 🌍 Add support for GitLab repositories
- 🧪 Write unit tests for backend routes
- 📖 Improve documentation or add translations
- 🐛 Fix any open bug issues

Look for [`good-first-issue`](https://github.com/Niladribhusan-1/oss-compass-/labels/good-first-issue) labels!

---

## 🗺️ Roadmap

### ✅ v1.0 — Hackathon Release (Current)
- GitHub profile AI analysis
- Smart project recommendations (6 matches)
- AI code mentor for any repository
- Good-first-issue fetching from GitHub API
- Full documentation

### 🔜 v1.1 — Community Polish
- [ ] Dark / Light mode toggle
- [ ] Save and bookmark favorite repos
- [ ] Better error handling & loading states
- [ ] Mobile responsive improvements
- [ ] Unit test coverage > 60%

### 🚀 v2.0 — Feature Expansion
- [ ] GitLab and Bitbucket support
- [ ] User authentication & profiles
- [ ] Contribution history tracker
- [ ] Browser extension version
- [ ] CLI tool (`npm install -g oss-compass`)
- [ ] Multi-language UI support

See full [ROADMAP.md](./ROADMAP.md) for details.

---

## 👥 Team

Built with ❤️ at **OSS Forge Hackathon** by:

- **Niladribhusan** — [@Niladribhusan-1](https://github.com/Niladribhusan-1)

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for details.

You are free to use, copy, modify, and distribute this project. Attribution appreciated! 🙏

---

## 🙌 Acknowledgements

- [Google Gemini API](https://aistudio.google.com/) — AI backbone
- [GitHub REST API](https://docs.github.com/en/rest) — Data source
- [Contributor Covenant](https://www.contributor-covenant.org/) — Code of Conduct template
- [Choose a License](https://choosealicense.com/) — License guidance
- [OSS Forge Hackathon](https://github.com) — For the inspiration 🔥

---

<div align="center">
  <strong>⭐ Star this repo if OSS Compass helped you find your first contribution!</strong><br/>
  <sub>Made with ❤️ for the open source community</sub>
</div>
