const socket = io("http://192.168.204.230:9999/");

socket.on("connect", () => {
  console.log("your id is " + socket.id);
});

socket.on("message", function (message) {
  addMessage(message);
});

socket.on("updateOnlineUsers", function (users) {
  const userArr = Object.keys(users).map((id) => users[id]);

  updateUsers(userArr);
});

let _username;
let avatarId = Math.round(Math.random() * 1800);

while (true) {
  _username = prompt("Your username: ");

  if (_username.trim().length > 4) break;

  alert("Wrong username");
}

_username = HtmlEncode(_username);

socket.emit("user", {
  username: _username,
  avatarId,
});

const messageContainer = document.getElementById("messages"),
  inputForm = document.getElementById("inputForm"),
  submitButton = document.getElementById("submitBtn");

function HtmlEncode(s) {
  const el = document.createElement("div");
  el.innerText = el.textContent = s;
  s = el.innerHTML;
  return s;
}

function formatTime(date) {
  const m = date.getMinutes(),
    h = date.getHours();

  let mm = m < 10 ? "0" + m : m,
    hh = h < 10 ? "0" + h : h;

  return `${hh}:${mm}`;
}

function addMessage(message) {
  let parsed = HtmlEncode(message.text);

  let structure = `
<div class="message">
  <div class="avatar">
    <img
      src="https://www.xat.com/web_gear/chat/av/${message.avatarId}.png"
      alt="avatar"
    />
  </div>
  <div class="info">
    <div class="user">
      <div class="name">${message.username}</div>
      <div class="date">${formatTime(new Date(message.date))}</div>
    </div>
    <div class="text">
        ${parsed}
    </div>
  </div>
</div>
`;
  const messageBodyEl = document.querySelector(".body_container");

  messageContainer.innerHTML += structure;

  setTimeout(() => {
    messageBodyEl.scrollTop = messageBodyEl.scrollHeight;
  }, 0);
}

function updateUsers(users) {
  const container = document.getElementById("online");
  let structures = "";

  for (let i = 0; i < users.length; i++) {
    structures += `
  <div class="message" style="margin: 8px 0 0 0 ">
  <div class="avatar">
    <img
      src="https://www.xat.com/web_gear/chat/av/${users[i].avatarId}.png"
      alt="avatar"
    />
  </div>
  <div class="info">
    <div class="name" style="padding-top: 6px">${users[i].username}</div>
  </div>
</div>`;
  }

  container.innerHTML = structures;
}

submitButton.onclick = function (e) {
  handleSubmit(inputForm.value);
};

window.onkeydown = function (e) {
  if (e.keyCode === 13) {
    handleSubmit(inputForm.value);
  }
};

async function handleSubmit(value) {
  if (value.trim() === "") {
    return;
  }

  socket.emit("message", {
    username: _username,
    text: value,
    avatarId,
  });

  inputForm.value = "";
}
