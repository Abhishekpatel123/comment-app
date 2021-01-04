
let username;
let socket = io();

do{
    username = prompt("Enter your name ");
}while(!username);


const textarea = document.getElementById('textarea');
const submitBtn = document.getElementById("submit-btn");
const commentBox = document.querySelector('.comment-box')


submitBtn.addEventListener('click',(e)=>{
    e.preventDefault();
    let comment = textarea.value;
    if (!comment) {
        return
    }
    else{
        postComment(comment);
    }
});

function postComment(comment){
    // apend to dom
    let data = {
        username : username,
        comment : comment
    }
    appendToDom(data);
    textarea.value = "";

    // Broadcast with Mongodb
    broadcastComment(data);
    
    // Sync with mongo db
    syncWithDb(data);

}

function appendToDom(data){
    let li = document.createElement('li');
    li.classList.add('comment','mb-3');
    let markup = `
                          <div class="card border-light mb-3" >
                              <div class="card-body">
                                  <h6 class="">${data.username}</h6>
                                  <p>${data.comment}</p>
                                  <div>
                                      <small>${moment(data.time).format('LT')}</small>
                                  </div>
                              </div>
                          </div>
                
    `;
    li.innerHTML = markup;
    commentBox.prepend(li);

}

function broadcastComment(data) {
    // socket 
    socket.emit('comment', data);

    
}
socket.on('com',(data)=>{
    appendToDom(data);
});



let timerId = null;

function debounce(fun , timer){
    setTimeout(()=>{
        fun();
    },timer);
}


let typeDiv = document.querySelector('.typing');
socket.on('typing',(data)=>{
    typeDiv.innerText = `${data.username} is typing ....`;
    debounce(function(){
    typeDiv.innerText = '';
    },1000);
});



// event listener on test area 
textarea.addEventListener('keyup',(e)=>{
    socket.emit('typing',{username});
});


//  SYNC WITH DB || API CALLS 

const headers = {'Content-Type' : 'application/json'};
function syncWithDb(data){
    fetch("/api/comments",{method:'POST', body : JSON.stringify(data) , headers})
    .then(response => response.json()).then(result=>{
        // only at a time one data store and responce mai bhi one hi data aayega
        console.log(result);
    })
}

function fetchCommentDb(){
    // by default fetch comment has get method 
    fetch('/api/comments').then(res=> res.json()).then(result=>{
        result.forEach(element => {
            element.time =element.createdAt;
            appendToDom(element);
            console.log(element)
        });
    })
}


window.onload = fetchCommentDb();













































