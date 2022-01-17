document.addEventListener('DOMContentLoaded', function() {

    // Use buttons to toggle between views


    load_posts();
})


let request_user
fetch('get_user')
.then(response => response.json())
.then(data => {
    request_user = data['user_requesting']
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


function load_profile(username) {
    div_profile = document.createElement('div');
    div_profile.id = 'div_profile';
    document.querySelector('.body').append(div_profile);
    div_profile.innerHTML = `<h1 id="username-profile">${username.id}&nbsp;&nbsp;</h1>`
    
    fetch(`user_profile/${username.id}`)
        .then(response => response.json())
        .then(data => {
            let followers = document.createElement('p');
            followers.innerHTML = `Followers: ${data['followers']}`;
            function profile_post(array) {
                let post = document.createElement('div');
                post.innerHTML = `<p>${array['date']}</p><p>${array['text']}</p><br>`
                div_profile.append(post);
            }
            
            div_profile.append(followers);
            data['posts'].forEach(profile_post);

            if (username.id !== data['request_user']) {
                const follow_btn = document.createElement('button');
                follow_btn.id = 'follow-btn'
                follow_btn.className = "btn btn-primary btn-sm active"
                let username_p = document.querySelector('#username-profile');
                username_p.appendChild(follow_btn);
                console.log(data['following_status'])

                follow_btn.addEventListener('click', () => {
                    follow_btn.className = "btn btn-success btn-sm"
                    follow_btn.classList.add('disabled')

                    if (follow === true) {
                        follow_btn.textContent = 'unfollowed'
                    } else {
                        follow_btn.textContent = 'followed'
                    }

                    fetch(`follow/${username.id}`, {
                        method: 'POST',
                        body: JSON.stringify({
                            "follow": follow
                        })
                    })
                        .then(response => response.json())
                        .then(result => {
                            console.log(result)
                        })
                });

                let follow

                if (data['following_status'] == true) {
                    follow_btn.appendChild(document.createTextNode("unfollow"));
                    follow = true
                } else {
                    follow_btn.appendChild(document.createTextNode("follow"));
                    follow = false
                }

            }
        })
}


function following_page() {
    blank_page()

    function following_posts(data) {
        console.log(data)

        for (user in data) {
            for (post in data[user]) {
                let puser = user
                let pid = data[user][post].id
                let pdate = data[user][post].date
                let ptext = data[user][post].text
                let plikes = data[user][post].likes

                const div_post = document.createElement('div');
                div_post.className = 'post';
                div_post.id = pid;

                let likes = plikes	
                let date = new Date(pdate)
                let hour = date.getHours()
                let minutes = date.getMinutes()
                let day = date.getDate()

                const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
                ];

                let month = monthNames[date.getMonth()]
                let year = date.getFullYear()
                let post_date = `${hour}:${minutes} ${day} ${month} ${year}`;
                
                div_post.innerHTML = `<br><p id="${puser}"><a href="javascript:;" onclick="load_profile(${puser});"><strong class="username">${puser}</strong></a> @ ${post_date} posted:</p><p class="text">${ptext}</p><p class="likes">Likes: ${likes}</p>`;
                document.querySelector('#following-posts').style.display = 'block'
                document.querySelector('#following-posts').append(div_post);
            }
        }
    }

    fetch('following')
        .then(response => response.json())
        .then(following_data => {
            following_posts(following_data['post']);
        });
}

function blank_page() {
    let blank_body = document.querySelector('.body').children;
    for (let i = 0; i < blank_body.length; i++) {
        blank_body[i].style.display = "none";
    }
}