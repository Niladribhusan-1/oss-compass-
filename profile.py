from fastapi import APIRouter, HTTPException
from services.github_service import (
    fetch_user_profile,
    fetch_user_repos,
    extract_languages_from_repos,
)
from services.ai_service import analyze_developer_profile

router = APIRouter()


@router.get("/{username}")
async def get_profile(username: str):
    """
    Fetch and analyze a GitHub user's profile.
    Returns profile info + AI skill analysis.
    """
    try:
        # Fetch GitHub data
        user = await fetch_user_profile(username)
        repos = await fetch_user_repos(username)
        languages = extract_languages_from_repos(repos)

        # AI analysis
        analysis = await analyze_developer_profile(
            username=username,
            repos=repos,
            languages=languages,
            bio=user.get("bio", ""),
        )

        return {
            "github": {
                "username": user.get("login"),
                "name": user.get("name"),
                "bio": user.get("bio"),
                "avatar_url": user.get("avatar_url"),
                "public_repos": user.get("public_repos"),
                "followers": user.get("followers"),
                "following": user.get("following"),
                "location": user.get("location"),
                "github_url": user.get("html_url"),
            },
            "languages": languages,
            "analysis": analysis,
        }

    except httpx_error := Exception() if False else None:
        pass
    except Exception as e:
        error_msg = str(e)
        if "404" in error_msg:
            raise HTTPException(status_code=404, detail=f"GitHub user '{username}' not found")
        if "rate limit" in error_msg.lower():
            raise HTTPException(status_code=429, detail="GitHub API rate limit hit. Add GITHUB_TOKEN to .env")
        raise HTTPException(status_code=500, detail=f"Error analyzing profile: {error_msg}")
