console.log("Hello World");
const hello_world_box = document.getElementById("hello-word");

$.ajax({
    type: 'GET',
    url: '/hello-world/',
    success: (response) => { 
        console.log('seucces', response);
        hello_world_box.textContent = response.text;
    },
    error: (err) => { console.log('error', err); },
})