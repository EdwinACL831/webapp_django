console.log("Hello My Profile");
const avatarContainer = document.getElementById("avatar-container");
const profileForm = document.getElementById("profile-form");
const alertContainer = document.getElementById("alert-container");
const bioInput = document.getElementById("id_bio");
const avatarInput = document.getElementById("id_avatar");

const csrf = document.getElementsByName("csrfmiddlewaretoken");

profileForm.addEventListener("submit", e => {
    e.preventDefault();

    const formData = new FormData()
    formData.append("csrfmiddlewaretoken", csrf[0].value);
    formData.append("bio", bioInput.value);
    formData.append("avatar", avatarInput.files[0]);

    $.ajax({
        type: "POST",
        url: "",
        enctype: "multipart/form-data",
        data: formData,
        success: (response) => {
            console.log(response);
            avatarContainer.innerHTML = `
                <img src="${response.avatar}" class="rounded" height="200px" width="auto" alt="${response.user}">
            `
            bioInput.value = response.bio;
            handleAlerts("success", "Your profile has been updated!");
        },
        error: err => {
            console.log(err);
        },
        processData: false,
        contentType: false,
        cache: false,
    })
})