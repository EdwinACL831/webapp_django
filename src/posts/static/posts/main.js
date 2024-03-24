console.log("Hello World");
const hello_world_box = document.getElementById("hello-word");
const postContainer = document.getElementById("post-container");
const spinnerContainer = document.getElementById("spinner-container");

$.ajax({
    type: 'GET',
    url: '/hello-world/',
    success: (response) => { 
        console.log('seucces', response);
        hello_world_box.textContent = response.text;
    },
    error: (err) => { console.log('error', err); },
});

$.ajax({
    type: 'GET',
    url: '/data/',
    success: (response) => { 
        // data = JSON.parse(response);
        console.log('success', response);
        const data = response.data;
        spinnerContainer.classList.add("not-visible");
        data.forEach(element => {
            postContainer.innerHTML += `
                ${element.title} - <b>${element.content}</b> <br>
            `
        });

    },
    error: (err) => { console.log('error', err); },
})