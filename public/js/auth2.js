// public/js/auth2.js

// export const API_BASE =
//     window.location.hostname === "localhost"
//         ? "http://localhost:3000"
//         : window.location.origin;

export const API_BASE = "https://blog-editor-rfk6.onrender.com";

const REFRESH_URL = `${API_BASE}/auth/refresh`;
const ME_URL = `${API_BASE}/users/me`;
const LOGOUT_URL = `${API_BASE}/auth/logout`;

/**
 * Access token stored ONLY in memory
 */
let accessToken = null;

/**
 * Set access token in memory
 */
export function setAccessToken(token) {
    accessToken = token;
}

/**
 * Clear access token
 */
function clearAccessToken() {
    accessToken = null;
}

/**
 * Helper: authenticated fetch
 */
export async function authFetch(url, options = {}) {
    if (!accessToken) {
        await refreshAccessToken();
    }

    const headers = {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
    };

    const response = await fetch(url, {
        ...options,
        headers,
        credentials: "include", // important for refresh cookies
    });

    // If token expired mid-request
    if (response.status === 401) {
        const refreshed = await refreshAccessToken();
        if (!refreshed) {
            clearAccessToken();
            return response;
        }

        // Retry once
        return fetch(url, {
            ...options,
            headers: {
                ...options.headers,
                Authorization: `Bearer ${accessToken}`,
            },
            credentials: "include",
        });
    }

    return response;
}

/**
 * Verify access token
 */
async function verifyAccessToken() {
    if (!accessToken) return null;

    try {
        const res = await fetch(ME_URL, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            credentials: "include",
        });

        if (!res.ok) throw new Error("Invalid token");

        return await res.json();
    } catch {
        return null;
    }
}

/**
 * Refresh access token using HttpOnly cookie
 */
async function refreshAccessToken() {
    try {
        const res = await fetch(REFRESH_URL, {
            method: "POST",
            credentials: "include", // sends HttpOnly cookie
        });

        if (!res.ok) throw new Error("Refresh failed");

        const data = await res.json();
        setAccessToken(data.accessToken);

        return true;
    } catch {
        clearAccessToken();
        return false;
    }
}

/**
 * Initialize authentication
 */
export async function initAuth() {
    let user = await verifyAccessToken();

    if (!user) {
        const refreshed = await refreshAccessToken();
        if (refreshed) {
            user = await verifyAccessToken();
        }
    }

    return user;
}

/**
 * Logout
 */
export async function logout() {
    try {
        await authFetch(LOGOUT_URL, {
            method: "POST",
            credentials: "include",
        });
    } catch (err) {
        console.error("Logout failed", err);
    }

    clearAccessToken();
    window.location.href = "/auth/login";
}

/**
 * Generate Header UI
 */
export async function generateHeader() {
    const headerSection = document.getElementById("header-section");
    const user = await initAuth();

    if (user) {
        headerSection.innerHTML = `
      <nav>
        <h1>Blog Editor</h1>
        <a href="/">Home</a>
        <a href="/posts">All Posts</a>
        <a href="/newpost">Create Post</a>
        <a href="/posts/published">Published Posts</a>
        <a href="/posts/unpublished">Unpublished Posts</a>
        <span>Welcome, ${user.name}!</span>
        <button id="logout-btn">Logout</button>
      </nav>
    `;

        document.getElementById("logout-btn").addEventListener("click", logout);
    } else {
        headerSection.innerHTML = `
      <nav>
        <h1>Blog Editor</h1>
        <a href="/">Home</a>
        <span>Welcome Visitor!</span>
        <a href="/auth/login">Log in</a>
        <a href="/signup">Sign up</a>
      </nav>
    `;
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    await initAuth();
    await generateHeader();
});
