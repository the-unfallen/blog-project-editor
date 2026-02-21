import { initAuth, generateHeader, API_BASE, setAccessToken } from "./auth2.js";

const loginForm = document.getElementById("login-form");

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include", // IMPORTANT for refresh cookie
        body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
        alert(data.message || "Login failed");
        return;
    }

    // Store access token in memory only
    setAccessToken(data.accessToken);

    alert("Login successful");

    window.location.href = "/";
});

document.addEventListener("DOMContentLoaded", async () => {
    await initAuth();
    await generateHeader();
});
