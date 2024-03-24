console.log("Hello World");
const postContainer = document.getElementById("post-container");
const spinnerContainer = document.getElementById("spinner-container");
const loadBtn = document.getElementById("load-btn");
const endContainer = document.getElementById("end-container");

let numbOfPosts = 3;

const getData = () => {
    $.ajax({
        type: 'GET',
        url: `/data/${numbOfPosts}`,
        success: (response) => {
            console.log('success', response);
            const data = response.data;
            spinnerContainer.classList.add("not-visible");
            data.forEach(element => {
                postContainer.innerHTML += `
                <div class="card mb-2">
                    <div class="card-body">
                        <h5 class="card-title">${element.title}</h5>
                        <p class="card-text">${element.content}</p>
                    </div>
                    <div class="card-footer">
                        <div class="row">
                            <div class="col-1">
                                <a href="#" class="btn btn-primary">Details</a>                    
                            </div>
                            <div class="col-1">
                                <a href="#" class="btn btn-primary">Like</a>                    
                            </div>
                        </div>
                    </div>
                </div>
                `
            });

            console.log('size', response.size);
            console.log({numbOfPosts});
            if(response.size === 0) {
                endContainer.textContent = "No posts added yet...";
            } else if(response.size <= numbOfPosts) {
                loadBtn.classList.add("not-visible");
                endContainer.textContent = "No more posts to load...";
            }
    
        },
        error: (err) => { console.log('error', err); },
    })
}

loadBtn.addEventListener("click", () => {
    spinnerContainer.classList.remove("not-visible");
    numbOfPosts += 3;
    getData();
});

getData();
