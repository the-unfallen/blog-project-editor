// public/js/auth.js

// Change these URLs to match your API
export const API_BASE =
    window.location.hostname === "localhost"
        ? "http://localhost:3000"
        : "https://yourdomain.com";

const REFRESH_URL = `${API_BASE}/auth/refresh`;
const ME_URL = `${API_BASE}/users/me`;

export function getTokens() {
    return {
        accessToken: localStorage.getItem("accessToken"),
        refreshToken: localStorage.getItem("refreshToken"),
    };
}

/**
 * Set tokens
 */
function setTokens({ accessToken, refreshToken }) {
    if (accessToken) localStorage.setItem("accessToken", accessToken);
    if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
}

/**
 * Clear tokens (logout)
 */
function clearTokens() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
}

async function verifyAccessToken() {
    const { accessToken } = getTokens();
    if (!accessToken) return null;

    try {
        const res = await fetch(ME_URL, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!res.ok) throw new Error("Invalid token");

        const user = await res.json();
        return user;
    } catch (err) {
        console.log("Access token invalid or expired:", err);
        return null;
    }
}

/**
 * Refresh access token using refresh token
 */
async function refreshAccessToken() {
    const { refreshToken } = getTokens();
    if (!refreshToken) return null;

    try {
        const res = await fetch(REFRESH_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken }),
        });

        if (!res.ok) throw new Error("Refresh failed");

        const data = await res.json();
        setTokens(data); // expect { accessToken, refreshToken }
        return data.accessToken;
    } catch (err) {
        console.log("Refresh token invalid:", err);
        clearTokens();
        return null;
    }
}

/**
 * Initialize login state on page load
 */
export async function initAuth() {
    let user = await verifyAccessToken();
    if (!user) {
        // Try refreshing token if access token invalid
        const newAccessToken = await refreshAccessToken();
        if (newAccessToken) user = await verifyAccessToken();
    }
    console.log(user);
    return user;
}

export async function generateHeader() {
    const headerSection = document.getElementById("header-section");
    const user = await initAuth();
    if (user) {
        headerSection.innerHTML = `
            <nav>
                <h1> Blog Editor </h1>
                <a href="/">Home</a>
                <a href="/posts">All Posts</a>
                <a href="/newpost">Create Post</a>
                <a href="/posts/published"> Published Posts</a>
                <a href="/posts/unpublished"> Unpublished Posts</a>
                <span>Welcome, ${user.name}!</span>
                <button id="logout-btn">Logout</button>
            </nav>
        `;

        document
            .getElementById("logout-btn")
            .addEventListener("click", async () => {
                const { accessToken, refreshToken } = getTokens();
                console.log(accessToken);
                if (!accessToken) return null;

                const response = await fetch(`${API_BASE}/auth/logout`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify({
                        refreshToken: refreshToken,
                    }),
                });
                console.log({ response });

                if (!response.ok) {
                    console.log("Something wrong with Logout");
                    throw new Error("Something wrong with Logout");
                }

                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");

                window.location.href = "/auth/login";

                alert("Logged out");
            });
    } else {
        headerSection.innerHTML = `
            <nav>
                <h1> Blog Editor </h1>
                <a href="/">Home</a>
                <span>Welcome Visitor!</span>
                <a href="/auth/login">Log in</a>
                <a href="/signup">Sign up</a>
            </nav>
        `;
    }
}

// Run on page load
document.addEventListener("DOMContentLoaded", async () => {
    await initAuth();
    await generateHeader();
});
