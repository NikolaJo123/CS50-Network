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

    fetch(`show_post`)
        .then(response => response.json())
        .then(data => {
            let number_of_posts = data.length;
            let next = true;
            let page = 1;
            let i = 0;
            
            only_ten()

            function only_ten() {
                if (next == true && i < page * 10) {
                    if (i < number_of_posts) {
                        create_post(data[i])
                        i += 1

                        only_ten()
                }}
                next = false
            }
            // console.log(i)

            function fnext_button() {
                let next_button = document.createElement('button');
                next_button.className = "btn btn-primary btn-sm active";
                next_button.appendChild(document.createTextNode("next"))
                document.querySelector('#posts').appendChild(next_button);
                next_button.addEventListener("click", next_page)
            }

            function fprev_button() {
                let prev_button = document.createElement('button');
                prev_button.className = "btn btn-primary btn-sm active";
                prev_button.appendChild(document.createTextNode("prev"))
                document.querySelector('#posts').appendChild(prev_button);
                prev_button.addEventListener("click", prev_page)
            };


            // fnext_button()

            function next_page() {
                page += 1;
                next = true
                document.querySelector('#posts').innerHTML = "";
                
                only_ten()

                if (i > 10) {
                    fprev_button()
                }
                if (number_of_posts > i ) {
                    fnext_button()
                }
            }


            function prev_page() {
                page = page - 1
                console.log(`page ${page}`)
                
                if (i <= 10) {
                    i = 0
                } else {
                    i = (Math.floor((i - 11 )/10)) * 10
                }

                next = true
                document.querySelector('#posts').innerHTML = "";
                
                only_ten()

                if (i > 10) {
                    fprev_button()
                }
                if (number_of_posts > i ) {
                    fnext_button()
                }
            }


            fnext_button()
        });
}


function create_post(post) {

    const div_post = document.createElement('div');
    div_post.className = 'post';
    div_post.id = post.id;
    let likes = 0;

    if (post.likes.length > 0) {
        likes = post.likes.length;
    }

    let date = new Date(post.date)
    let hour = date.getHours()
    let minutes = date.getMinutes()
    let day = date.getDate()

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

    let month = monthNames[date.getMonth()]
    let year = date.getFullYear()
    let post_date = `${hour}:${minutes} ${day} ${month} ${year}`;


    div_post.innerHTML = `<br><p id="${post.user}"><a href="javascript:;" onclick="load_profile(${post.user});"><strong class="username">${post.user}</strong></a> @ ${post_date} posted:</p>
                            <p class="text">${post.text}</p>
                            <p class="likes" id="like-${post.id}">Likes: <a id="count-likes-${post.id}">${likes}</a> &nbsp;&nbsp;&nbsp;&nbsp;</p>`;

    if (post.user === request_user) {
        let edit_btn = document.createElement('a');
        // edit_btn.className = "btn btn-primary btn-sm active";
        edit_btn.className = "btn-edit";
        edit_btn.appendChild(document.createTextNode("Edit?"));
        edit_btn.innerText = 'Edit?';
        edit_btn.addEventListener("click", () => {
            edit_post(post.id, post.text)
        })
        div_post.appendChild(edit_btn);
    }
    document.querySelector('#posts').append(div_post);
}


function load_profile(username) {
    blank_page()

    div_profile = document.createElement('div');
    div_profile.id = 'div_profile';
    document.querySelector('.body').append(div_profile);
    div_profile.innerHTML = `<h1 id="username-profile">${username.id}&nbsp;&nbsp;</h1>`
    
    fetch(`user_profile/${username.id}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);

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
                // console.log(`${puser} @ ${date.getMinutes()} posted ${text} get ${likes} likes`)
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
                
                // console.log(date);
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


function like(post_id) {
    fetch('like', {
        method: 'POST',
        body: JSON.stringify({
            id: post_id
        })
    })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            // load()
            let liked = data['liked']
            console.log(liked)
            let likes = data['likes']

            let like_func = document.getElementById(`like-status-${post_id}`)
            // liked = data['liked'];
            if (liked === false) {
                like_func.innerText = 'like??'
            } else {
                like_func.innerText = 'liked!'
            }
            let like_count = document.getElementById(`count-likes-${post_id}`)
            like_count.innerText = likes
            // console.log(liked)count-likes-${post.id}
        })
}


function edit_post(post_id, post_text) {
    // console.log(post_id)
    // window.location=window.location;
    blank_page()
    let div_edit_post = document.createElement('div')
    div_edit_post.id = `${post_id}`
    div_edit_post.classList.add('edit-post')
    div_edit_post.innerHTML = `<br><h3>Edit Post</h3>
        <form>
        <textarea class="form-control" rows="5" name="edit_post_text" placeholder="Edit Post">${post_text}</textarea>
        <button class="btn btn-primary" onclick="">Save</button>
        </form>`;
    document.querySelector('.body').appendChild(div_edit_post)
}
