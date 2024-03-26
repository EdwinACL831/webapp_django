console.log("Hello World");
const postContainer = document.getElementById("post-container");
const spinnerContainer = document.getElementById("spinner-container");
const loadBtn = document.getElementById("load-btn");
const endContainer = document.getElementById("end-container");
const postForm = document.getElementById("post-form");
const title = document.getElementById("id_title");
const content = document.getElementById("id_content");
const alertContainer = document.getElementById("alert-container");

const csrfCreatePostToken = document.getElementsByName("csrfmiddlewaretoken");
const url = window.location.href;

const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
const csrftoken = getCookie('csrftoken');

const likeUnlikePosts = () => {
    const likeUnlikeForms = [...document.getElementsByClassName("like-unlike-form")];
    likeUnlikeForms.forEach(form => form.addEventListener("submit", e => {
        e.preventDefault();
        const formId = e.target.getAttribute("data-form-id");
        const likeUnlikeBtn = document.getElementById(`like-unlike-${formId}`);

        $.ajax({
            type: "POST",
            url: "/like-unlike/",
            headers: {'X-Requested-With': 'XMLHttpRequest'}, // this header is necessary because is how we know it comes from AJAX
            data: {
                "csrfmiddlewaretoken": csrftoken,
                "pk": formId,
            },
            success: (response) => { 
                console.log(response);
                likeUnlikeBtn.textContent = response.liked ? `Unlike (${response.count})` : `Like (${response.count})`
            },
            error: (err) => { console.log(err); }
        })
    }))
}

let numbOfPosts = 3;

const getData = () => {
    $.ajax({
        type: 'GET',
        url: `/data/${numbOfPosts}`,
        success: (response) => {
            console.log('success', response);
            const data = response.data;
            spinnerContainer.classList.add("not-visible");
            data.forEach(element => {
                postContainer.innerHTML += `
                <div class="card mb-2">
                    <div class="card-body">
                        <h5 class="card-title">${element.title}</h5>
                        <p class="card-text">${element.content}</p>
                    </div>
                    <div class="card-footer">
                        <div class="row">
                            <div class="col-2">
                                <a href="${url}${element.id}" class="btn btn-primary">Details</a>                    
                            </div>
                            <div class="col-2">
                                <form class="like-unlike-form" data-form-id="${element.id}">
                                    <button href="#" class="btn btn-primary" id="like-unlike-${element.id}">${element.liked ? `Unlike (${element.count})` : `Like (${element.count})`}</button>                    
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                `
            });

            likeUnlikePosts();
            console.log('size', response.size);
            console.log({numbOfPosts});
            if(response.size === 0) {
                endContainer.textContent = "No posts added yet...";
            } else if(response.size <= numbOfPosts) {
                loadBtn.classList.add("not-visible");
                endContainer.textContent = "No more posts to load...";
            }
    
        },
        error: (err) => { console.log('error', err); },
    })
}

loadBtn.addEventListener("click", () => {
    spinnerContainer.classList.remove("not-visible");
    numbOfPosts += 3;
    getData();
});

postForm.addEventListener("submit", e => {
    e.preventDefault();
    $.ajax({
        type: "POST",
        url: "",
        data: {
            "csrfmiddlewaretoken": csrfCreatePostToken[0].value,
            "title": title.value,
            "content": content.value,
        },
        success: (response) => {
            console.log(response);
            postContainer.insertAdjacentHTML("afterbegin", `
                <div class="card mb-2">
                    <div class="card-body">
                        <h5 class="card-title">${response.title}</h5>
                        <p class="card-text">${response.content}</p>
                    </div>
                    <div class="card-footer">
                        <div class="row">
                            <div class="col-2">
                                <a href="#" class="btn btn-primary">Details</a>                    
                            </div>
                            <div class="col-2">
                                <form class="like-unlike-form" data-form-id="${response.id}">
                                    <button href="#" class="btn btn-primary" id="like-unlike-${response.id}">Like (0)</button>                    
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            `);
            likeUnlikePosts();
            $("#addPostModal").modal("hide");
            handleAlerts("success", "New post added");
            postForm.reset();
        },
        error: (err) => {
            console.log(err);
            handleAlerts("danger", "oops... something went wrong");
        }
    })
});

getData();
