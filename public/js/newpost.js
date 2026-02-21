// import { initAuth, getTokens, API_BASE } from "./auth.js";
import { initAuth, authFetch, API_BASE } from "./auth2.js";

const newPostForm = document.getElementById("new-post-form");

if (newPostForm)
    newPostForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        // create a new post
        const titleValue = document.getElementById("post-title").value;
        const contentValue = document.getElementById("post-content").value;
        const createPostURL = `${API_BASE}/posts/create`;
        // const { accessToken } = getTokens();
        // if (!accessToken) return null;
        try {
            const response = await authFetch(createPostURL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: titleValue,
                    content: contentValue,
                }),
            });

            if (!response.ok) throw new Error("Invalid request");
            if (response.ok) {
                window.location.href = "/posts";
                alert("Post created successfully");
            }
        } catch (error) {
            console.error("Error during post creation", error);
        }
    });

document.addEventListener("DOMContentLoaded", async () => {
    const user = initAuth();
});
