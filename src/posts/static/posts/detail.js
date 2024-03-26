const backBtn = document.getElementById("back-btn");
const updateBtn = document.getElementById("update-btn");
const deleteBtn = document.getElementById("delete-btn");
const spinnerContainer = document.getElementById("spinner-container");

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
    },
    error: (err) => {
        console.log(err);
    }
})