from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.github_service import (
    fetch_repo_readme,
    fetch_repo_tree,
    fetch_good_first_issues,
)
from services.ai_service import explain_repository

router = APIRouter()


class MentorRequest(BaseModel):
    owner: str
    repo: str
    skill_level: str = "intermediate"   # beginner | intermediate | advanced


@router.post("/explain")
async def explain_repo(body: MentorRequest):
    """
    AI mentor: explains a GitHub repo structure to a developer.
    Returns folder breakdown, key files, where to start, and first PR idea.
    """
    try:
        # Fetch repo data in parallel-ish
        readme = await fetch_repo_readme(body.owner, body.repo)
        file_tree = await fetch_repo_tree(body.owner, body.repo)
        issues = await fetch_good_first_issues(body.owner, body.repo)

        # AI explanation
        explanation = await explain_repository(
            owner=body.owner,
            repo=body.repo,
            readme=readme or "",
            file_tree=file_tree,
            skill_level=body.skill_level,
        )

        return {
            "repo": f"{body.owner}/{body.repo}",
            "github_url": f"https://github.com/{body.owner}/{body.repo}",
            "explanation": explanation,
            "good_first_issues": [
                {
                    "title": i.get("title"),
                    "url": i.get("html_url"),
                    "number": i.get("number"),
                    "labels": [l.get("name") for l in i.get("labels", [])],
                }
                for i in issues[:5]
            ],
        }

    except Exception as e:
        error_msg = str(e)
        if "404" in error_msg:
            raise HTTPException(
                status_code=404,
                detail=f"Repository '{body.owner}/{body.repo}' not found",
            )
        raise HTTPException(status_code=500, detail=f"Mentor error: {error_msg}")


@router.get("/issues/{owner}/{repo}")
async def get_issues(owner: str, repo: str):
    """Fetch good-first-issues for a specific repo."""
    try:
        issues = await fetch_good_first_issues(owner, repo)
        return {
            "repo": f"{owner}/{repo}",
            "issues": [
                {
                    "title": i.get("title"),
                    "url": i.get("html_url"),
                    "number": i.get("number"),
                    "created_at": i.get("created_at"),
                    "labels": [l.get("name") for l in i.get("labels", [])],
                }
                for i in issues
            ],
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
