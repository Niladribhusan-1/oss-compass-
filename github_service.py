import os
import httpx
from typing import Optional

GITHUB_API = "https://api.github.com"


def get_headers():
    token = os.getenv("GITHUB_TOKEN")
    headers = {"Accept": "application/vnd.github+json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    return headers


async def fetch_user_profile(username: str) -> dict:
    """Fetch GitHub user profile info."""
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"{GITHUB_API}/users/{username}",
            headers=get_headers(),
        )
        resp.raise_for_status()
        return resp.json()


async def fetch_user_repos(username: str, max_repos: int = 20) -> list:
    """Fetch user's public repositories."""
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"{GITHUB_API}/users/{username}/repos",
            headers=get_headers(),
            params={"sort": "updated", "per_page": max_repos},
        )
        resp.raise_for_status()
        return resp.json()


async def fetch_repo_languages(username: str, repo_name: str) -> dict:
    """Fetch languages used in a specific repo."""
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"{GITHUB_API}/repos/{username}/{repo_name}/languages",
            headers=get_headers(),
        )
        resp.raise_for_status()
        return resp.json()


async def fetch_repo_tree(owner: str, repo: str) -> list:
    """Fetch repository file tree (top-level)."""
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"{GITHUB_API}/repos/{owner}/{repo}/git/trees/HEAD",
            headers=get_headers(),
            params={"recursive": "1"},
        )
        resp.raise_for_status()
        data = resp.json()
        # Return only top 60 files to keep prompt size manageable
        return data.get("tree", [])[:60]


async def fetch_repo_readme(owner: str, repo: str) -> Optional[str]:
    """Fetch README content of a repository."""
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"{GITHUB_API}/repos/{owner}/{repo}/readme",
            headers={**get_headers(), "Accept": "application/vnd.github.raw"},
        )
        if resp.status_code == 404:
            return None
        resp.raise_for_status()
        # Trim to first 3000 chars to stay within token limits
        return resp.text[:3000]


async def fetch_good_first_issues(owner: str, repo: str) -> list:
    """Fetch good-first-issue labeled issues from a repo."""
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"{GITHUB_API}/repos/{owner}/{repo}/issues",
            headers=get_headers(),
            params={"labels": "good-first-issue", "state": "open", "per_page": 5},
        )
        if resp.status_code != 200:
            return []
        return resp.json()


async def search_beginner_repos(language: str, topic: str = "") -> list:
    """Search for beginner-friendly repos by language and topic."""
    query = f"language:{language} label:good-first-issue stars:>100"
    if topic:
        query += f" topic:{topic}"

    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"{GITHUB_API}/search/repositories",
            headers=get_headers(),
            params={"q": query, "sort": "updated", "per_page": 10},
        )
        resp.raise_for_status()
        return resp.json().get("items", [])


def extract_languages_from_repos(repos: list) -> dict:
    """Aggregate language usage across all repos."""
    lang_count: dict = {}
    for repo in repos:
        lang = repo.get("language")
        if lang:
            lang_count[lang] = lang_count.get(lang, 0) + 1
    return dict(sorted(lang_count.items(), key=lambda x: x[1], reverse=True))
