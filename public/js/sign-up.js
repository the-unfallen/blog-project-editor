// import { initAuth, API_BASE } from "./auth.js";
import { initAuth, API_BASE } from "./auth2.js";

document.addEventListener("DOMContentLoaded", async () => {
    await initAuth();
});

const signUpForm = document.getElementById("sign-up-form");

if (signUpForm)
    signUpForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const signUpName = document.getElementById("sign-up-name").value;
        const signUpEmail = document.getElementById("sign-up-email").value;
        const signUpPassword =
            document.getElementById("sign-up-password").value;

        if (!signUpName || !signUpEmail || !signUpPassword) {
            alert("Please fill in all fields");
            return;
        }

        const CREATE_USER_URL = `${API_BASE}/users/create`;

        try {
            const response = await fetch(CREATE_USER_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: signUpName,
                    email: signUpEmail,
                    password: signUpPassword,
                }),
            });

            if (!response.ok) throw new Error("Invalid request");
            if (response.ok) {
                window.location.href = "/auth/login";
                alert("User created successfully");
            }
        } catch (error) {
            console.error("Can not create a new user", error);
        }
    });
