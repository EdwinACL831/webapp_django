const backBtn = document.getElementById("back-btn");
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
    },
    error: (err) => {
        console.log(err);
    }
})