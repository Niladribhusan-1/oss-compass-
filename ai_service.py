import os
import json
import google.generativeai as genai

def get_model():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY not set in .env")
    genai.configure(api_key=api_key)
    return genai.GenerativeModel("gemini-1.5-flash")


async def analyze_developer_profile(
    username: str,
    repos: list,
    languages: dict,
    bio: str = "",
) -> dict:
    """Use AI to analyze a developer's skills and experience level."""
    model = get_model()

    repo_summaries = [
        f"- {r['name']}: {r.get('description', 'No description')} | ⭐{r.get('stargazers_count', 0)}"
        for r in repos[:15]
    ]

    prompt = f"""
You are an expert developer profile analyzer for an open source contribution platform.

Analyze this GitHub developer profile and return a JSON object ONLY — no markdown, no explanation.

Developer: {username}
Bio: {bio or 'Not provided'}
Top Languages: {json.dumps(languages)}
Recent Repositories:
{chr(10).join(repo_summaries)}

Return this exact JSON structure:
{{
  "skill_level": "beginner | intermediate | advanced",
  "top_skills": ["skill1", "skill2", "skill3", "skill4", "skill5"],
  "experience_areas": ["area1", "area2", "area3"],
  "recommended_contribution_types": ["type1", "type2", "type3"],
  "summary": "2 sentence summary of this developer's profile",
  "confidence_score": 0.0 to 1.0
}}
"""
    response = model.generate_content(prompt)
    text = response.text.strip()
    # Strip markdown code fences if present
    if text.startswith("```"):
        text = text.split("```")[1]
        if text.startswith("json"):
            text = text[4:]
    return json.loads(text.strip())


async def recommend_projects(
    skill_level: str,
    top_skills: list,
    experience_areas: list,
    languages: dict,
) -> list:
    """Generate project recommendations based on developer profile."""
    model = get_model()

    top_langs = list(languages.keys())[:5]

    prompt = f"""
You are an open source project recommender AI.

Based on this developer profile, recommend 6 open source projects they should contribute to.

Profile:
- Skill Level: {skill_level}
- Top Skills: {', '.join(top_skills)}
- Experience Areas: {', '.join(experience_areas)}
- Languages: {', '.join(top_langs)}

Return ONLY a JSON array, no markdown, no explanation:
[
  {{
    "repo_name": "owner/repo",
    "display_name": "Project Name",
    "description": "What this project does",
    "why_good_fit": "Why this matches the developer",
    "difficulty": "beginner | intermediate | advanced",
    "category": "web | cli | library | framework | data | devtools | other",
    "contribution_ideas": ["idea1", "idea2"],
    "github_url": "https://github.com/owner/repo",
    "language": "primary language"
  }}
]

Mix real, active, popular GitHub projects. Include at least 2 beginner-friendly ones.
"""
    response = model.generate_content(prompt)
    text = response.text.strip()
    if text.startswith("```"):
        text = text.split("```")[1]
        if text.startswith("json"):
            text = text[4:]
    return json.loads(text.strip())


async def explain_repository(
    owner: str,
    repo: str,
    readme: str,
    file_tree: list,
    skill_level: str = "intermediate",
) -> dict:
    """AI mentor: explain a repo structure to a developer."""
    model = get_model()

    tree_paths = [f["path"] for f in file_tree if f.get("type") == "blob"][:50]
    tree_str = "\n".join(tree_paths)

    prompt = f"""
You are a friendly and expert open source mentor helping a {skill_level} developer 
understand a GitHub repository so they can make their first contribution.

Repository: {owner}/{repo}

README (truncated):
{readme or 'No README found'}

File Tree:
{tree_str}

Return ONLY a JSON object, no markdown, no explanation:
{{
  "project_summary": "2-3 sentence plain English summary of what this project does",
  "tech_stack": ["tech1", "tech2", "tech3"],
  "folder_breakdown": [
    {{"folder": "/src", "purpose": "what this folder contains"}},
    {{"folder": "/tests", "purpose": "what this folder contains"}}
  ],
  "key_files": [
    {{"file": "filename.py", "purpose": "why this file is important"}},
    {{"file": "README.md", "purpose": "project documentation"}}
  ],
  "where_to_start": "Plain English advice on where a {skill_level} developer should start",
  "contribution_roadmap": [
    {{"step": 1, "action": "first thing to do", "difficulty": "easy"}},
    {{"step": 2, "action": "second thing to do", "difficulty": "medium"}},
    {{"step": 3, "action": "third thing to do", "difficulty": "medium"}}
  ],
  "first_pr_idea": "A specific, concrete idea for their very first pull request",
  "gotchas": ["common mistake 1", "common mistake 2"]
}}
"""
    response = model.generate_content(prompt)
    text = response.text.strip()
    if text.startswith("```"):
        text = text.split("```")[1]
        if text.startswith("json"):
            text = text[4:]
    return json.loads(text.strip())
