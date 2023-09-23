let username;
let socket = io();

const profileBox = document.getElementById("profile-box");

// disconnect socket
socket.on('disconnect', () => {
  console.log('disconnect')
})

do {
  username = prompt("Enter your name ");

  //  user connected
  socket.emit("new connection", {
    username,
    message: "new user connected",
  });
  profileBox.innerHTML = `
  <h1 class="user-name">${username}</h1>
  `;
} while (!username);

const textarea = document.getElementById("textarea");
const submitBtn = document.getElementById("submit-btn");
const commentBox = document.querySelector(".comment-box");
const users_container = document.querySelector(".users_container");

// new connection
socket.on("new connection", (data) => {
  const user = document.createElement("p");
  user.classList.add("user");
  user.textContent = `${data.username}`;
  console.log(user, data, "thsi new connection");
  const div = document.createElement("div");
  const markup = `
  <a
                  href="#"
                  class="list-group-item list-group-item-action border-0"
                  >
                  <div class="badge bg-success float-right">5</div>
                  <div class="d-flex align-items-start">
                    <img
                      src="https://bootdey.com/img/Content/avatar/avatar5.png"
                      class="rounded-circle mr-1" 
                      style = "margin-right:0.5rem;"
                      alt="Vanessa Tucker"
                      width="40"
                      height="40"
                    />
                    <div class="flex-grow-1 ml-3">
                    ${data.username}
                      <div class="small">
                        <span class="fas fa-circle chat-online"></span> Online
                      </div>
                    </div>
                  </div>
                  </a>
                  `;
  div.innerHTML = markup;
  users_container.append(div);
});

const send = (e) => {
  e.preventDefault();
  let comment = textarea.value;
  if (!comment) {
    return;
  } else {
    postComment(comment);
  }
};

submitBtn.addEventListener("click", (e) => {
  e.preventDefault();
  let comment = textarea.value;
  if (!comment) {
    return;
  } else {
    postComment(comment);
  }
});

function postComment(comment) {
  // apend to dom
  let data = {
    username: username,
    comment: comment,
  };
  appendToDom(data);
  textarea.value = "";

  // Broadcast with Mongodb
  broadcastComment(data);

  // Sync with mongo db
  syncWithDb(data);
}

function appendToDom(data) {
  let li = document.createElement("li");
  li.classList.add("comment", "mb-3");
  // let markup = `
  //                       <div class="card border-light mb-3" >
  //                           <div class="card-body">
  //                               <h6 class="">${data.username}</h6>
  //                               <p>${data.comment}</p>
  //                               <div>
  //                                   <small>${moment(data.time).format('LT')}</small>
  //                               </div>
  //                           </div>
  //                       </div>

  // `;
  let markup = `
    <div class="${
      data.username == username ? "chat-message-right" : "chat-message-left"
    } pb-4">
    <div
    style = "${data.username == username ? "margin-left:0.8rem" : "margin-right:0.8rem"}"
    >
      <img
        src="https://bootdey.com/img/Content/avatar/avatar1.png"
        class="rounded-circle" 
        alt="Chris Wood"
        width="40"
        height="40"
      />
      <div class="text-muted small text-nowrap mt-2">
      ${moment(data.time).format("LT")}
      </div>
    </div>
    <div class="flex-shrink-1 bg-light rounded py-2 px-3 mr-3" style = "margin-left:.8rem;">
      <div class="font-weight-bold mb-1">${
        data.username == username ? "You" : data.username
      }</div>
      ${data.comment}
    </div>
  </div>`;
  li.innerHTML = markup;
  commentBox.append(li);
}

function broadcastComment(data) {
  // socket
  socket.emit("comment", data);
}
socket.on("com", (data) => {
  appendToDom(data);
});

let timerId = null;

function debounce(fun, timer) {
  setTimeout(() => {
    fun();
  }, timer);
}

let typeDiv = document.querySelector(".typing");
socket.on("typing", (data) => {
  typeDiv.innerText = `${data.username} is typing ....`;
  debounce(function () {
    typeDiv.innerText = "";
  }, 2000);
});

// event listener on test area
textarea.addEventListener("keyup", (e) => {
  socket.emit("typing", { username });
});

//  SYNC WITH DB || API CALLS

const headers = { "Content-Type": "application/json" };
function syncWithDb(data) {
  fetch("/api/comments", {
    method: "POST",
    body: JSON.stringify(data),
    headers,
  })
    .then((response) => response.json())
    .then((result) => {
      // only at a time one data store and responce mai bhi one hi data aayega
      console.log(result);
    });
}

function fetchCommentDb() {
  // by default fetch comment has get method
  fetch("/api/comments")
    .then((res) => res.json())
    .then((result) => {
      result.forEach((element) => {
        element.time = element.createdAt;
        appendToDom(element);
        console.log(element);
      });
    });
}

window.onload = fetchCommentDb();
