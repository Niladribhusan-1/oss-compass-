from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.ai_service import recommend_projects
from services.github_service import fetch_good_first_issues

router = APIRouter()


class RecommendRequest(BaseModel):
    skill_level: str           # beginner | intermediate | advanced
    top_skills: list[str]
    experience_areas: list[str]
    languages: dict            # {"Python": 5, "JavaScript": 3}


@router.post("/")
async def get_recommendations(body: RecommendRequest):
    """
    AI-powered project recommendations based on developer skill profile.
    Returns 6 matched projects with contribution ideas.
    """
    try:
        projects = await recommend_projects(
            skill_level=body.skill_level,
            top_skills=body.top_skills,
            experience_areas=body.experience_areas,
            languages=body.languages,
        )

        # Try to enrich with real good-first-issues from GitHub
        enriched = []
        for project in projects:
            repo_full = project.get("repo_name", "")
            if "/" in repo_full:
                owner, repo = repo_full.split("/", 1)
                try:
                    issues = await fetch_good_first_issues(owner, repo)
                    project["good_first_issues"] = [
                        {
                            "title": i.get("title"),
                            "url": i.get("html_url"),
                            "number": i.get("number"),
                        }
                        for i in issues[:3]
                    ]
                except Exception:
                    project["good_first_issues"] = []
            enriched.append(project)

        return {
            "count": len(enriched),
            "recommendations": enriched,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Recommendation error: {str(e)}")


@router.get("/quick/{username}/{language}")
async def quick_recommend(username: str, language: str):
    """Quick recommendation by language — no AI analysis needed."""
    try:
        projects = await recommend_projects(
            skill_level="beginner",
            top_skills=[language],
            experience_areas=["web development"],
            languages={language: 5},
        )
        return {"recommendations": projects}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
