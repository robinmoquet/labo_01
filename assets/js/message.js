import {sendMessage} from "./callApi";
import {createMessage, displayConversation} from "./displayHtml";
import Event from "./Event";
import EventPublisher from "./EventPublisher";

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
            createMessage(message, true, "Envoyé");
        })
};

const handleKeyUp = e => {
    const value = e.target.value;
    let event = new Event();
    event.topic = "http://labo-01.com/message/writing";
    event.target = "http://localhost:3000/user/" + activeUser.dataset.email;
    if(value !== "") {
        event.data = {status: "writing", sender: currentUserEmail};
    } else {
        event.data = {status: "no-writing", sender: currentUserEmail};
    }
    EventPublisher.publish(event);
};

const handleClickUser = event => {
      activeUser.classList.remove("active");
      const newActiveUser = event.currentTarget;
      newActiveUser.classList.add("active");
      activeUser = newActiveUser;
      displayConversation(activeUser);
};


init();

