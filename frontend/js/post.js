const params = new URLSearchParams(window.location.search);
const postId = params.get('id');

async function loadPost() {

    try {

        const response = await fetch(
            `${API_BASE}/posts/${postId}`
        );

        const post = await response.json();

        document.getElementById('postTitle')
            .textContent = post.title;

        document.getElementById('postMeta')
            .textContent =
            `By ${post.author?.name || 'Unknown'}`;

        document.getElementById('postContent')
            .textContent =
            post.content;

    } catch (error) {

        document.getElementById('postTitle')
            .textContent =
            'Failed to load post';
    }
}

async function loadComments() {

    try {

        const response = await fetch(
            `${API_BASE}/comments/post/${postId}`
        );

        const comments = await response.json();

        const container =
            document.getElementById('commentsContainer');

        if (!comments.length) {

            container.innerHTML = `
                <div class="empty-state">
                    <h3>💬 No comments yet</h3>
                    <p>Be the first person to comment.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = comments.map(comment => `
            <div class="comment-card">
                <strong class="comment-author">
                    ${escapeHtml(comment.author?.name || 'Unknown')}
                </strong>

                <p>
                    ${escapeHtml(comment.text)}
                </p>

                    ${
                comment.author?._id === getUserId()
                ? `
                    <button onclick="deleteComment('${comment._id}')">
                        Delete
                    </button>
                `
                : ''
            }
                <hr>
            </div>
        `).join('');

    } catch (error) {

        document.getElementById('commentsContainer')
            .innerHTML =
            '<p>Failed to load comments.</p>';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadPost();
    loadComments();
});
document
    .getElementById('commentForm')
    .addEventListener('submit', createComment);

async function createComment(e) {

    e.preventDefault();

    const text =
        document.getElementById('commentText').value;

    try {

        const response = await fetch(
            `${API_BASE}/comments/post/${postId}`,
            {
                method: 'POST',

                headers: {
                    'Content-Type': 'application/json',
                    'Authorization':
                        `Bearer ${getToken()}`
                },

                body: JSON.stringify({ text })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            alert(data.message);
            return;
        }

        document.getElementById('commentText').value = '';

        loadComments();

    } catch (error) {

        alert('Failed to add comment');
    }
}
async function deleteComment(commentId) {

    const confirmDelete =
        confirm('Delete this comment?');

    if (!confirmDelete) return;

    try {

        const response = await fetch(
            `${API_BASE}/comments/${commentId}`,
            {
                method: 'DELETE',

                headers: {
                    Authorization:
                        `Bearer ${getToken()}`
                }
            }
        );

        const data =
            await response.json();

        if (!response.ok) {
            alert(data.message);
            return;
        }

        loadComments();

    } catch (error) {

        alert('Failed to delete comment');
    }
}