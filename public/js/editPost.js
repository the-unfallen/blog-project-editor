// import { initAuth, getTokens, API_BASE } from "./auth.js";
import { initAuth, API_BASE, authFetch } from "./auth2.js";

document.addEventListener("DOMContentLoaded", async () => {
    const user = await initAuth();
    await loadFormValues();
});

function getParamFromPath(index) {
    return window.location.pathname.split("/")[index];
}

const postId = getParamFromPath(2); // Assuming URL structure: /editpost/:postId
console.log(postId);

async function loadFormValues() {
    const user = await initAuth();
    const getPostURL = `${API_BASE}/posts/post/${postId}`;
    try {
        const response = await fetch(getPostURL);
        const data = await response.json();
        if (user.id === data.authorId) {
            document.getElementById("edit-post-title").value = data.title;
            document.getElementById("edit-post-author").textContent =
                `Author: ${data.author.name}`;
            document.getElementById("edit-post-content").value = data.content;
        } else {
            document.getElementById("edit-post-title").style.display = "none";
            document.getElementById("edit-post-content").style.display = "none";
            document.getElementById("edit-post-author").style.display = "none";
        }
    } catch (error) {
        console.error("Problem loading form values", error);
    }
}

const editPostForm = document.getElementById("edit-post-form");

if (editPostForm)
    editPostForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        // Edit post
        const user = await initAuth();
        const titleValue = document.getElementById("edit-post-title").value;
        const contentValue = document.getElementById("edit-post-content").value;
        const editPostURL = `${API_BASE}/posts/edit/${postId}`;
        // const { accessToken } = getTokens();
        // if (!accessToken) return null;
        console.log({ editPostURL });
        console.log({ user });
        // console.log({ accessToken });
        try {
            const response = await authFetch(editPostURL, {
                method: "PUT",
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
                window.location.href = `/posts/view/${postId}`;
                alert("Post edited successfully");
            }
        } catch (error) {
            console.error("Error during post editing", error);
        }
    });
