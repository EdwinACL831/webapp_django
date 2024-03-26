const backBtn = document.getElementById("back-btn");
const updateBtn = document.getElementById("update-btn");
const deleteBtn = document.getElementById("delete-btn");
const spinnerContainer = document.getElementById("spinner-container");
const postContainer = document.getElementById("post-container");
const titleInput = document.getElementById("id_title");
const contentInput = document.getElementById("id_content");
const updateForm = document.getElementById("update-form");
const deleteForm = document.getElementById("delete-form");
const alertContainer = document.getElementById("alert-container");

const csrfToken = document.getElementsByName("csrfmiddlewaretoken");

const url = window.location.href + "data/"
const updateUrl = window.location.href + "update/"
const deleteUrl = window.location.href + "delete/"

backBtn.addEventListener("click", () => {
    history.back();
})

$.ajax({
    type: "GET",
    url: url,
    success: (response) => {
        console.log(response);
        spinnerContainer.classList.add("not-visible");
        const data = response.data;

        if(data.logged_in !== data.author) {
            console.log("different");
        } else {
            console.log("the same");
            updateBtn.classList.remove("not-visible");
            deleteBtn.classList.remove("not-visible");
        }

        const titleEl = document.createElement("h3");
        titleEl.setAttribute("class", "mt-3");
        titleEl.setAttribute("id", "title");

        const contentEl = document.createElement("p");
        contentEl.setAttribute("class", "mt-1");
        contentEl.setAttribute("id", "content");

        titleEl.textContent = data.title;
        contentEl.textContent = data.content;

        postContainer.appendChild(titleEl);
        postContainer.appendChild(contentEl);
        
        titleInput.value = data.title;
        contentInput.value = data.content;
    },
    error: (err) => {
        console.log(err);
    }
})

updateForm.addEventListener("submit", e =>{
    e.preventDefault();
    const title = document.getElementById("title");
    const content = document.getElementById("content");

    $.ajax({
        type: "POST",
        url: updateUrl,
        data: {
            "csrfmiddlewaretoken": csrfToken[0].value,
            "title": titleInput.value,
            "content": contentInput.value,
        },
        success: (response) => {
            console.log(response);
            handleAlerts("success", "Post has been updated!");
            title.textContent = response.title;
            content.textContent = response.content;
        },
        error: err => {
            console.log(err);
        }
    })
})
