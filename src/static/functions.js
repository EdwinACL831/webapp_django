const navbarBtnIds = ["home-link", "profile-link"];
const navbarHomeBtn = document.getElementById("home-link");
const navbarProfileBtn = document.getElementById("profile-link");

const handleAlerts = (type, message) => {
    alertContainer.innerHTML = `
        <div class="alert alert-${type}" role="alert">
            ${message}
        </div>
    `
};