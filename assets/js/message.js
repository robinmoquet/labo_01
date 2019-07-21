import {sendMessage} from "./callApi";
import {createMessage, displayConversation} from "./displayHtml";
import {HUB_URL} from "./config";

require('./listenerMercure');

const form = document.getElementById("form-message");
const input = form.querySelector("input");
const conversation = document.getElementById("conversation");
const sideBar = document.getElementById("sidebar");
let activeUser = sideBar.querySelector(".active");
const users = sideBar.querySelectorAll(".user");

const init = () => {
    initEventListener();
    if(activeUser === null) {
        activeUser = sideBar.querySelector(".user");
        activeUser.classList.add("active");
    }
    displayConversation(activeUser);
};

const initEventListener = () => {
    form.addEventListener("submit", handleSubmit);
    input.addEventListener("keyup", handleKeyUp);
    users.forEach(user => user.addEventListener("click", handleClickUser));
};

const handleSubmit = event => {
    event.preventDefault();
    const emailReceiver = activeUser.dataset.email;
    const message = input.value;
    if(message === "") return;
    sendMessage(message, emailReceiver)
        .then(message => {
            input.value = "";
            createMessage(message);
        })
};

const handleKeyUp = event => {
    const value = event.target.value;
    if(value !== "") {
        let header = new Headers({"Authorization": "Bearer " + token.replace("mercureAuthorization=", ""), "Content-type": "application/x-www-form-urlencoded"});
        let request = new Request(HUB_URL, {
            method: "POST",
            //credentials: "include",
            headers: header,
            body: "topic=http://labo-01.com/message/writing&data=" + JSON.stringify({status: "writing"}) + "&target=http://localhost:3000/user/" + activeUser.dataset.email
        });
        fetch(request)
            .then(response => {

            });
    } else {
        let header = new Headers({"Authorization": "Bearer " + token.replace("mercureAuthorization=", ""), "Content-type": "application/x-www-form-urlencoded"});
        let request = new Request(HUB_URL, {
            method: "POST",
            //credentials: "include",
            headers: header,
            body: "topic=http://labo-01.com/message/writing&data=" + JSON.stringify({status: "no-writing"}) + "&target=http://localhost:3000/user/" + activeUser.dataset.email
        });
        fetch(request)
            .then(response => {

            });
    }
};

const handleClickUser = event => {
      activeUser.classList.remove("active");
      const newActiveUser = event.currentTarget;
      newActiveUser.classList.add("active");
      activeUser = newActiveUser;
      displayConversation(activeUser);
};


init();

