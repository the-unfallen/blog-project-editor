// import { initAuth, generateHeader, API_BASE } from "./auth.js";
import { initAuth, generateHeader, API_BASE } from "./auth2.js";

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
        body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    console.log(data);

    if (!res.ok) {
        alert(data.message || "Login failed");
        return;
    }

    // Example: store token (dev only)
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);

    alert("Login successful");
    window.location.href = "/";
});

document.addEventListener("DOMContentLoaded", async () => {
    await initAuth();
    await generateHeader();
});
