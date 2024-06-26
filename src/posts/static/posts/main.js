console.log("Hello World");
const HIDE_OPERATION = "hide";
const LOAD_OPERATION = "load";

const postContainer = document.getElementById("post-container");
const spinnerContainer = document.getElementById("spinner-container");
const loadBtn = document.getElementById("load-btn");
const hideBtn = document.getElementById("hide-btn");
const endContainer = document.getElementById("end-container");
const postForm = document.getElementById("post-form");
const title = document.getElementById("id_title");
const content = document.getElementById("id_content");
const alertContainer = document.getElementById("alert-container");
const addBtn = document.getElementById("add-btn");
const dropzone = document.getElementById("my-dropzone");
const closeBtns = [...document.getElementsByClassName("add-modal-close")];

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
const deleted = localStorage.getItem("title");
if(deleted) {
    handleAlerts("danger", `deleted "${deleted}"`);
    localStorage.clear();
}

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
let previousPostHTMLs = [];
hideBtn.disabled = true;

const getData = (operation) => {
    $.ajax({
        type: 'GET',
        url: `/data/${numbOfPosts}`,
        success: (response) => {
            const data = response.data;
            spinnerContainer.classList.add("not-visible");
            if(operation === HIDE_OPERATION) {
                postContainer.innerHTML = previousPostHTMLs.pop();
            } else {
                previousPostHTMLs.push(postContainer.innerHTML)
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
                                        <button class="btn btn-primary" id="like-unlike-${element.id}">${element.liked ? `Unlike (${element.count})` : `Like (${element.count})`}</button>                    
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    `
                });

                likeUnlikePosts();
                if(response.size === 0) {
                    endContainer.textContent = "No posts added yet...";
                } else if(response.size <= numbOfPosts) {
                    loadBtn.classList.add("not-visible");
                    endContainer.textContent = "No more posts to load...";
                }
            }

            if(previousPostHTMLs.length <= 1) {
                hideBtn.disabled = true;
            } else {
                hideBtn.disabled = false;   
            }
            console.log({previousPostHTMLs});
        },
        error: (err) => { console.log('error', err); },
    });
}

loadBtn.addEventListener("click", () => {
    spinnerContainer.classList.remove("not-visible");
    numbOfPosts += 3;
    getData(LOAD_OPERATION);
});

hideBtn.addEventListener("click", () => {
    if(previousPostHTMLs.length > 1) {
        numbOfPosts -= 3;
        getData(HIDE_OPERATION);
    } else {
        hideBtn.disabled = true;
        console.log("cannot hide more");
    }
})


let newPostId = null;
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
            newPostId = response.id;
            postContainer.insertAdjacentHTML("afterbegin", `
                <div class="card mb-2">
                    <div class="card-body">
                        <h5 class="card-title">${response.title}</h5>
                        <p class="card-text">${response.content}</p>
                    </div>
                    <div class="card-footer">
                        <div class="row">
                            <div class="col-2">
                                <a href="${url}${response.id}" class="btn btn-primary">Details</a>                    
                            </div>
                            <div class="col-2">
                                <form class="like-unlike-form" data-form-id="${response.id}">
                                    <button class="btn btn-primary" id="like-unlike-${response.id}">Like (0)</button>                    
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            `);
            likeUnlikePosts();
            // $("#addPostModal").modal("hide");
            handleAlerts("success", "New post added");
            // postForm.reset();
        },
        error: (err) => {
            console.log(err);
            handleAlerts("danger", "oops... something went wrong");
        }
    })
});

addBtn.addEventListener("click", () => {
    dropzone.classList.remove("not-visible");
});

closeBtns.forEach(btn => btn.addEventListener("click", () => {
    postForm.reset();
    if(!dropzone.classList.contains("not-visible")) {
        dropzone.classList.add("not-visible");
    }

    const myDropzone = Dropzone.forElement("#my-dropzone");
    myDropzone.removeAllFiles(true);
}))

Dropzone.autoDiscover = false;
const myDropzone = new Dropzone("#my-dropzone", {
    url: "upload/",
    init: function() {
        this.on("sending", (file, xhr, formData) => {
            formData.append("csrfmiddlewaretoken", csrftoken);
            formData.append("new_post_id", newPostId);
        })
    },
    maxFiles: 5,
    maxFilesSize: 4,
    acceptedFiles: ".png, .jpg, .jpeg"
})

getData(LOAD_OPERATION);

const onClickHandler = (event) => {
    const btnId = event ? event.target.id : "home-link";
    navbarBtnIds.forEach(id => {
        const btn = document.getElementById(id);
        if(id === btnId) {
            btn.classList.add("option-clicked");
        } else {
            btn.classList.remove("option-clicked");
        }
    })
}

navbarHomeBtn.addEventListener("click", onClickHandler);
onClickHandler(null);
