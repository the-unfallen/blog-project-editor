// import { initAuth, generateHeader, API_BASE } from "./auth.js";
import { initAuth, generateHeader, API_BASE } from "./auth2.js";
// import { formatDate } from "./myPosts.js";
import { formatDate } from "./utils.js";

const unpublishedPostsContainer = document.getElementById(
    "unpublished-posts-container",
);

async function getUnpublishedPosts() {
    const postsURL = `${API_BASE}/posts/unpublished`;
    const user = await initAuth();
    try {
        const response = await fetch(postsURL);
        const data = await response.json();
        console.log(data);

        for (const element of data) {
            const newDiv = document.createElement("div");
            newDiv.classList.add("post-item-box");

            const post_title = document.createElement("div");
            post_title.textContent = `Post title: ${element.title}`;
            post_title.classList.add("post-item-title");

            const post_content = document.createElement("div");
            post_content.textContent = `Post content: ${element.content}`;

            const post_author = document.createElement("div");
            post_author.textContent = `Post author: ${element.author.name}`;

            const post_createdAt = document.createElement("div");
            post_createdAt.textContent = `Created at: ${formatDate(element.createdAt)}`;

            const post_last_editedAt = document.createElement("div");
            if (element.createdAt !== element.updatedAt) {
                post_last_editedAt.textContent = `Last Updated at: ${formatDate(element.updatedAt)}`;
            }

            const commentDetails = document.createElement("div");
            commentDetails.classList.add("post-item-comments");

            const commentCounts = element.comments.length;

            let commentText = "";
            if (commentCounts === false) {
                commentText = "(Comments could not be fetched)";
            } else if (commentCounts === 1) {
                commentText = "(1 Comment)";
            } else {
                commentText = `(${commentCounts} Comments)`;
            }

            commentDetails.textContent = commentText;

            const viewPostDiv = document.createElement("div");
            viewPostDiv.classList.add("post-item-view");
            const viewPostLink = document.createElement("a");
            viewPostLink.href = `/posts/view/${element.id}`;
            viewPostLink.textContent = "View Post";
            viewPostDiv.appendChild(viewPostLink);

            const additionalInfo = document.createElement("div");

            if (user.id === element.authorId) {
                additionalInfo.classList.add("author-status");
                additionalInfo.textContent = "You authored this post.";
            }

            const publishStatusDiv = document.createElement("div");
            publishStatusDiv.classList.add("publish-status");

            if (element.published) {
                // Unpublish

                publishStatusDiv.textContent = `Publication Status: Published on ${formatDate(element.publishedAt)}`;
            } else {
                // Publish
                publishStatusDiv.textContent =
                    "Publication Status: Not Published Yet";
            }

            newDiv.append(
                post_title,
                post_content,
                post_author,
                post_createdAt,
                post_last_editedAt,
                commentDetails,
                viewPostDiv,
                additionalInfo,
                publishStatusDiv,
            );

            if (unpublishedPostsContainer)
                unpublishedPostsContainer.appendChild(newDiv);
        }
    } catch (error) {
        console.error("Error fetching blog posts: ", error);
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    await initAuth();
    await generateHeader();
    await getUnpublishedPosts();
});
