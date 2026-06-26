const params = new URLSearchParams(window.location.search);
const postId = params.get('id');

document
  .getElementById('editForm')
  .addEventListener('submit', updatePost);

loadPost();

async function loadPost() {

    const response =
        await fetch(`${API_BASE}/posts/${postId}`);

    const post =
        await response.json();

    document.getElementById('title').value =
        post.title;

    document.getElementById('content').value =
        post.content;
}

async function updatePost(e) {

    e.preventDefault();

    const title =
        document.getElementById('title').value;

    const content =
        document.getElementById('content').value;

    const response = await fetch(
        `${API_BASE}/posts/${postId}`,
        {
            method: 'PUT',

            headers: {
                'Content-Type': 'application/json',
                Authorization:
                    `Bearer ${getToken()}`
            },

            body: JSON.stringify({
                title,
                content
            })
        }
    );

    const data =
        await response.json();

    if (!response.ok) {
        alert(data.message);
        return;
    }

    window.location.href = 'feed.html';
}