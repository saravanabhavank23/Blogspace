document
  .getElementById('createPostForm')
  .addEventListener('submit', createPost);

async function createPost(e) {

    e.preventDefault();

    const title =
        document.getElementById('title').value;

    const content =
        document.getElementById('content').value;

    try {

        const response = await fetch(
            `${API_BASE}/posts`,
            {
                method: 'POST',

                headers: {
                    'Content-Type': 'application/json',
                    'Authorization':
                        `Bearer ${getToken()}`
                },

                body: JSON.stringify({
                    title,
                    content
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            document.getElementById('message')
                .textContent = data.message;
            return;
        }

        window.location.href = 'feed.html';

    } catch (error) {

        document.getElementById('message')
            .textContent =
            'Failed to create post';
    }
}