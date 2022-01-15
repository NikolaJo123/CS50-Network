document.addEventListener('DOMContentLoaded', function () {

    // Use buttons to toggle between views
    document.querySelector('#following').addEventListener('click', () => index_view());
    document.querySelector('#profile').addEventListener('click', () => profile_view());

    document.querySelector('#post-form').onsubmit = create_post;
    document.querySelector('#followers-view').style.display = 'none';
    document.querySelector('#profile-view').style.display = 'none';

    load_posts();
    //create_post();
});


function index_view() {
    document.querySelector('#posts-view').style.display = 'none';
    document.querySelector('#followers-view').style.display = 'block';
    document.querySelector('#profile-view').style.display = 'none';
}


function profile_view() {
    document.querySelector('#posts-view').style.display = 'none';
    document.querySelector('#followers-view').style.display = 'none';
    document.querySelector('#profile-view').style.display = 'block';
}


function load_posts(){
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


function create_post(){
    //console.log("Post created successfully!!!")
    const post_text = document.querySelector('#post-text').value;

    if (post_text.value === ""){
        console.log("Must enter text!")
    } else {

    //var json = JSON.stringify(post_text);

    //console.log(json)

        fetch('/create_post/', {
            method: 'POST',
            body: JSON.stringify({
                text: post_text
            })
        })
    }
    return false;
    //document.querySelector('#greeting').innerHTML = post_text;
}