document.addEventListener('DOMContentLoaded', function() {

    // Use buttons to toggle between views


    load_posts();
})


function load_posts() {

    fetch(`/show_post`)
    .then(response => response.json())
    .then(posts => {
        console.log(posts)
        for (let i of Object.keys(posts)) {
            const post = document.createElement('div');
            post.classList.add('post')

            post.innerHTML = `
                <div>${posts[i].user_id}</div>
                <div>Text: ${posts[i].text}</div>
                <div>Date: ${posts[i].date}</div>
                <div>likes: ${posts[i].likes}</div>
            `;

            document.querySelector('#posts-view').append(post);
        };
    })
}


function create_post(post) {
    //console.log("Post created successfully!!!")
    const post_text = document.querySelector('#post-text').value;

    if (post_text.value === ""){
        console.log("Must enter text!")
    } else {

    var json = JSON.stringify(post_text);
    console.log(json)

        fetch('/create_post/', {
            method: 'POST',
            body: JSON.stringify({
                text: post_text
            })
        })
    }
    //document.querySelector('#greeting').innerHTML = post_text;
    document.querySelector('#post-text').value = '';
    location.reload();
    return false;
}
