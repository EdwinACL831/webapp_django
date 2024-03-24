console.log("Hello World");
const hello_world_box = document.getElementById("hello-word");
const post_container = document.getElementById("post-container");

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
        data.forEach(element => {
            post_container.innerHTML += `
                ${element.title} - <b>${element.content}</b> <br>
            `
        });

    },
    error: (err) => { console.log('error', err); },
})