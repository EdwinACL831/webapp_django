const backBtn = document.getElementById("back-btn");
const updateBtn = document.getElementById("update-btn");
const deleteBtn = document.getElementById("delete-btn");
const spinnerContainer = document.getElementById("spinner-container");
const postContainer = document.getElementById("post-container");
const titleInput = document.getElementById("id_title");
const contentInput = document.getElementById("id_content");

const url = window.location.href + "data/"

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

        const contentEl = document.createElement("p");
        contentEl.setAttribute("class", "mt-1");

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