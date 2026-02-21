// import { initAuth, API_BASE } from "./auth.js";
import { initAuth, API_BASE, authFetch } from "./auth2.js";

function getParamFromPath(index) {
    return window.location.pathname.split("/")[index];
}

const postId = getParamFromPath(3); // Assuming URL structure: /posts/view/:postId
console.log(postId);
// const user = await initAuth();

async function getPostDetails() {
    const postURL = `${API_BASE}/posts/post/${postId}`;
    try {
        const response = await fetch(postURL);
        const data = await response.json();
        // console.log(data);
        const user = await initAuth();
        // console.log(user);
        // console.log(user.id === data.authorId);
        const postComments = data.comments;
        console.log(postComments);
        const commentsDiv = document.createElement("div");
        commentsDiv.classList.add("unit-post-comment-block");

        if (postComments === false) {
            commentsDiv.textContent = "Comments could not be fetched.";
        } else if (postComments.length === 0) {
            commentsDiv.textContent = "No comments yet.";
        } else {
            const commentsHeader = document.createElement("h3");
            commentsHeader.textContent = "Comments:";
            commentsDiv.appendChild(commentsHeader);

            postComments.forEach((comment) => {
                const commentDiv = document.createElement("div");
                commentDiv.classList.add("comment-item");
                const commenterName = document.createElement("div");
                if (!comment.user) {
                    if (comment.authorEmail || comment.authorName) {
                        commenterName.textContent = `Commenter: ${comment.authorName || comment.authorEmail}`;
                    } else {
                        commenterName.textContent = `Commenter: Anonymous`;
                    }
                } else {
                    commenterName.textContent = `Commenter: ${comment.user.name || comment.user.email}`;
                }

                const commentContent = document.createElement("div");
                commentContent.textContent = `Comment: ${comment.content}`;
                const commentCreatedAt = document.createElement("div");
                commentCreatedAt.textContent = `Posted At: ${formatDate(comment.createdAt)}`;
                const deleteCommentDiv = document.createElement("div");
                console.log({ comment });
                console.log({ user });
                const isCommentAuthor = comment.userId === user.id;
                const isPostAuthor = data.authorId === user.id;
                const isAdmin = user.role === "ADMIN";
                if (isAdmin || isPostAuthor || isCommentAuthor) {
                    deleteCommentDiv.innerHTML = `
                    <form class ="delete-comment-form" id="id_${comment.id}">
                        <div><input value=${comment.id} hidden></div>
                        <div><button type="submit">Delete Comment</button></div>
                    </form>
                    
                    `;
                }
                commentDiv.append(
                    commenterName,
                    commentContent,
                    commentCreatedAt,
                    deleteCommentDiv,
                );
                commentsDiv.appendChild(commentDiv);
            });
        }

        const postContainer = document.getElementById("view-post-container");
        console.log(data);
        postContainer.innerHTML = `
            <div class="unit-post-title">
                <h2>Post Title: ${data.title}</h2>
            </div >
            <div class="unit-post-content">
                <div class="unit-post-content-header">Post Content:</div>
                <div class="unit-post-content-body">${data.content}</div>
            </div>
            <div class="unit-post-author">
                <p>Author: ${data.author.name}</p>
            </div>
            <div class="unit-post-createdAt">
                <p>Created At: ${formatDate(data.createdAt)}</p>
            </div>
        `;
        const isAdmin = user.role === "ADMIN";

        if ((user && user.id && user.id === data.authorId) || isAdmin) {
            const actionBlocks = document.createElement("div");
            actionBlocks.classList.add("unit-post-action-blocks");

            const publishContainer = await publishUnpublishBox(data);
            actionBlocks.appendChild(publishContainer);

            const editOptionDiv = document.createElement("div");
            editOptionDiv.innerHTML = `<a href="/editpost/${data.id}">Edit this Post</a>`;
            editOptionDiv.classList.add("unit-post-edit");

            const deleteOptionDiv = document.createElement("div");
            deleteOptionDiv.innerHTML = `
            <form id="delete-this-post-form">
                <button type="submit">Delete Post</button>
            </form>
            `;
            deleteOptionDiv.classList.add("unit-post-delete");

            actionBlocks.appendChild(editOptionDiv);
            actionBlocks.appendChild(deleteOptionDiv);
            postContainer.appendChild(actionBlocks);

            const deleteThisPostForm = document.getElementById(
                "delete-this-post-form",
            );

            if (deleteThisPostForm)
                deleteThisPostForm.addEventListener("submit", async (e) => {
                    e.preventDefault();
                    console.log("Delete this post  clicked");
                    try {
                        // const accessToken = localStorage.getItem("accessToken");
                        // if (!accessToken) return null;
                        const DELETE_POST_URL = `${API_BASE}/posts/delete/${postId}`;
                        const response = await authFetch(DELETE_POST_URL, {
                            method: "DELETE",
                            headers: {
                                "Content-Type": "application/json",
                                // Authorization: `Bearer ${accessToken}`,
                            },
                        });
                        if (!response.ok)
                            throw new Error("Invalid DELETE request");
                        if (response.ok) {
                            window.location.href = "/posts";
                            alert("Post deleted successfully");
                        }
                    } catch (error) {
                        console.error("Error during deleting of post", error);
                    }
                });
        }

        // new comment form
        const newCommentDiv = document.createElement("div");
        newCommentDiv.classList.add("unit-post-new-comment-div");
        const newCommentForm = document.createElement("form");
        newCommentForm.id = "new-comment-form";
        newCommentForm.innerHTML = `
            <div>
                <h3>Add a Comment:</h3>
                <textarea id="new-comment-content" rows="4" cols="50" required></textarea>
            </div>
            <div>
                <button type="submit">Submit Comment</button>
            </div>
        `;

        newCommentDiv.appendChild(newCommentForm);
        postContainer.appendChild(newCommentDiv);
        postContainer.appendChild(commentsDiv);

        const addNewCommentForm = document.getElementById("new-comment-form");
        if (addNewCommentForm)
            addNewCommentForm.addEventListener("submit", async (event) => {
                event.preventDefault();
                const commentContent = document
                    .getElementById("new-comment-content")
                    .value.trim();
                if (!commentContent) {
                    alert("Comment content cannot be empty.");
                    return;
                }
                // const accessToken = localStorage.getItem("accessToken");
                // if (!accessToken) return null;
                const NEW_COMMENT_URL = `${API_BASE}/comments/create/${postId}`;
                try {
                    const response = await authFetch(NEW_COMMENT_URL, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            // Authorization: `Bearer ${accessToken}`,
                        },
                        body: JSON.stringify({
                            content: commentContent,
                        }),
                    });
                    if (!response.ok) throw new Error("Invalid request");
                    if (response.ok) {
                        window.location.href = `/posts/view/${postId}`;
                        alert("Comment created successfully");
                    }
                } catch (error) {
                    console.error("Error creating comment:", error);
                }
            });

        // const deleteCommentForm = document.getElementById(
        //     "delete-comment-form",
        // );

        const deleteCommentForms = document.querySelectorAll(
            ".delete-comment-form",
        );

        if (deleteCommentForms)
            deleteCommentForms.forEach((deleteCommentForm) => {
                deleteCommentForm.addEventListener("submit", async (e) => {
                    e.preventDefault();
                    const commentId = deleteCommentForm.id.split("_")[1];
                    // const accessToken = localStorage.getItem("accessToken");
                    // if (!accessToken) return null;

                    const DELETE_COMMENT_URL = `${API_BASE}/comments/delete/${commentId}`;
                    console.log(DELETE_COMMENT_URL);
                    alert("Delete comment button clicked!!!");
                    try {
                        const response = await authFetch(DELETE_COMMENT_URL, {
                            method: "DELETE",
                            headers: {
                                "Content-Type": "application/json",
                                // Authorization: `Bearer ${accessToken}`,
                            },
                        });
                        if (!response.ok)
                            throw new Error("Invalid DELETE request");
                        if (response.ok) {
                            window.location.href = `/posts/view/${postId}`;
                            alert("Comment deleted successfully");
                        }
                    } catch (error) {
                        console.error("Error Deleting comment...", error);
                    }
                });
            });
    } catch (error) {
        console.error("Error getting this post: ", error);
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    const user = await initAuth();
    await getPostDetails();
});

async function publishUnpublishBox(post_object) {
    const box = document.createElement("div");
    box.classList.add("unit-post-publish-status");

    const user = await initAuth();
    if (!user) return box;

    const isAdmin = user.role === "ADMIN";
    const isPostAuthor = user.id === post_object.authorId;

    if (!isAdmin && !isPostAuthor) return box;

    let published = post_object.published;

    const render = () => {
        box.innerHTML = `
            <form id="publish-unpublish-form">
                <button type="submit">
                    ${published ? "Unpublish" : "Publish"}
                </button>
            </form>
        `;

        const form = box.querySelector("#publish-unpublish-form");

        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            // const accessToken = localStorage.getItem("accessToken");
            // if (!accessToken) return;

            const action = published ? "unpublish" : "publish";
            const url = `${API_BASE}/posts/action/${action}/${post_object.id}`;

            try {
                const res = await authFetch(url, {
                    method: "PUT",
                    // headers: {
                    //     Authorization: `Bearer ${accessToken}`,
                    // },
                });

                if (!res.ok) throw new Error("Request failed");

                published = !published; // update state
                render(); // re-render UI
            } catch (err) {
                console.error(err);
            }
        });
    };

    render();
    return box;
}

const formatDate = (dateString) =>
    new Date(dateString).toLocaleString("en-GB", {
        dateStyle: "medium",
        timeStyle: "short",
    });
