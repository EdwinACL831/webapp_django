console.log("Hello world detail");
const backBtn = document.getElementById("back-btn");

backBtn.addEventListener("click", () => {
    history.back();
})