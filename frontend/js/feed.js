async function loadPosts() {
  const listEl = document.getElementById('postsList');

  try {
    const res = await fetch(`${API_BASE}/posts`);
    const posts = await res.json();

    if (!posts.length) {
      listEl.innerHTML =  `<div class="empty-state">
        <h3>📝 No Posts Yet</h3>
        <p>Create your first blog post and start sharing ideas.</p>
      </div>`;
      return;
    }

    listEl.innerHTML = posts.map(post => `
  <div class="post-card" onclick="window.location.href='post.html?id=${post._id}'">

  ${
    post.image
    ? `
        <img
            src="${post.image}"
            class="post-image"
            alt="Post Image">
      `
    : ''
    }

    <h3>
      <a href="post.html?id=${post._id}">
        ${escapeHtml(post.title)}
      </a>
    </h3>

    <p class="post-meta">
      By ${post.author?.name || 'Unknown'}
    </p>

    <p>
      ${escapeHtml(post.content.slice(0,150))}
      ${post.content.length > 150 ? '...' : ''}
    </p>

    ${
      post.author?._id === getUserId()
      ? `
      <div class="post-actions">
          <button class="edit-btn" onclick="editPost('${post._id}')">
              Edit
          </button>

          <button class="delete-btn" onclick="deletePost('${post._id}')">
              Delete
          </button>
      </div>
        `
      : ''
    }

  </div>
`).join('');

  } catch (err) {
    listEl.innerHTML = '<p class="empty-state">Failed to load posts.</p>';
    console.error(err);
  }
}
async function deletePost(postId) {

    const confirmDelete =
        confirm('Delete this post?');

    if (!confirmDelete) return;

    try {

        const response = await fetch(
            `${API_BASE}/posts/${postId}`,
            {
                method: 'DELETE',

                headers: {
                    Authorization:
                        `Bearer ${getToken()}`
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            alert(data.message);
            return;
        }

        loadPosts();

    } catch (error) {

        alert('Failed to delete post');
    }
}
function editPost(postId) {

    window.location.href =
        `edit-post.html?id=${postId}`;
}
document.addEventListener('DOMContentLoaded', loadPosts);