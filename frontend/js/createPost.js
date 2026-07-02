document
  .getElementById('createPostForm')
  .addEventListener('submit', createPost);

async function createPost(e) {

    e.preventDefault();

    const title =
        document.getElementById('title').value;

    const content =
        document.getElementById('content').value;

    const image =
        document.getElementById('image').files[0];

    const pdf =
    document.getElementById('pdf').files[0];

    const formData = new FormData();

        formData.append('title', title);
        formData.append('content', content);

        if (image) {
            formData.append('image', image);
        }

        if (pdf) {
            formData.append('pdf', pdf);
        }

    try {

        const response = await fetch(
            `${API_BASE}/posts`,
            {
                method: 'POST',

                headers: {
                    'Authorization':
                        `Bearer ${getToken()}`
                },

                body: formData
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