"""Backend regression tests for Energeide:
- Blog posts CRUD (GET/POST/DELETE /api/posts) with X-Admin-Token auth
- Admin login (/api/admin/login)
- Projects regression (/api/projects)
"""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://file-picker-1.preview.emergentagent.com").rstrip("/")
ADMIN_TOKEN = "-sQWRaxBoGuPTOVctnDMW5BFGak7Y7pf"
WRONG_TOKEN = "wrong-token-123"


@pytest.fixture(scope="module")
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="module")
def created_post_ids():
    ids = []
    yield ids
    # teardown: cleanup any leftover posts
    for pid in ids:
        try:
            requests.delete(
                f"{BASE_URL}/api/posts/{pid}",
                headers={"X-Admin-Token": ADMIN_TOKEN},
                timeout=10,
            )
        except Exception:
            pass


# ---------- Admin login ----------
class TestAdminLogin:
    def test_login_wrong_token(self, client):
        r = client.post(f"{BASE_URL}/api/admin/login", json={"token": WRONG_TOKEN}, timeout=10)
        assert r.status_code == 401

    def test_login_correct_token(self, client):
        r = client.post(f"{BASE_URL}/api/admin/login", json={"token": ADMIN_TOKEN}, timeout=10)
        assert r.status_code == 200
        data = r.json()
        assert data.get("ok") is True


# ---------- Blog posts ----------
class TestBlogPosts:
    def test_list_posts_public(self, client):
        r = client.get(f"{BASE_URL}/api/posts", timeout=10)
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)

    def test_create_post_no_token(self, client):
        r = client.post(
            f"{BASE_URL}/api/posts",
            json={"title": "TEST_no_token", "content": "x"},
            timeout=10,
        )
        assert r.status_code == 401

    def test_create_post_wrong_token(self, client):
        r = requests.post(
            f"{BASE_URL}/api/posts",
            json={"title": "TEST_wrong_token", "content": "x"},
            headers={"Content-Type": "application/json", "X-Admin-Token": WRONG_TOKEN},
            timeout=10,
        )
        assert r.status_code == 401

    def test_create_post_with_token(self, client, created_post_ids):
        payload = {
            "title": "TEST_post title",
            "content": "TEST contenuto del post di prova",
            "image_url": "https://example.com/img.jpg",
            "facebook_url": "https://facebook.com/energeide/posts/123",
        }
        r = requests.post(
            f"{BASE_URL}/api/posts",
            json=payload,
            headers={"Content-Type": "application/json", "X-Admin-Token": ADMIN_TOKEN},
            timeout=15,
        )
        assert r.status_code == 200, r.text
        data = r.json()
        assert "id" in data and isinstance(data["id"], str) and len(data["id"]) > 0
        assert data["title"] == payload["title"]
        assert data["content"] == payload["content"]
        assert data["image_url"] == payload["image_url"]
        assert data["facebook_url"] == payload["facebook_url"]
        assert "published_at" in data
        created_post_ids.append(data["id"])

    def test_post_appears_in_list(self, client, created_post_ids):
        assert created_post_ids, "No post created in previous test"
        pid = created_post_ids[0]
        r = client.get(f"{BASE_URL}/api/posts", timeout=10)
        assert r.status_code == 200
        ids = [p.get("id") for p in r.json()]
        assert pid in ids

    def test_delete_post_no_token(self, client, created_post_ids):
        assert created_post_ids
        pid = created_post_ids[0]
        r = requests.delete(f"{BASE_URL}/api/posts/{pid}", timeout=10)
        assert r.status_code == 401

    def test_delete_post_with_token(self, client, created_post_ids):
        assert created_post_ids
        pid = created_post_ids[0]
        r = requests.delete(
            f"{BASE_URL}/api/posts/{pid}",
            headers={"X-Admin-Token": ADMIN_TOKEN},
            timeout=10,
        )
        assert r.status_code == 200
        assert r.json().get("ok") is True
        # verify gone
        r2 = client.get(f"{BASE_URL}/api/posts", timeout=10)
        ids = [p.get("id") for p in r2.json()]
        assert pid not in ids
        created_post_ids.remove(pid)

    def test_delete_nonexistent(self, client):
        r = requests.delete(
            f"{BASE_URL}/api/posts/non-existent-id-zzzz",
            headers={"X-Admin-Token": ADMIN_TOKEN},
            timeout=10,
        )
        assert r.status_code == 404


# ---------- Projects regression ----------
class TestProjects:
    def test_projects_endpoint(self, client):
        r = client.get(f"{BASE_URL}/api/projects", timeout=20)
        assert r.status_code == 200
        data = r.json()
        assert "count" in data
        assert "data" in data
        assert isinstance(data["data"], list)
