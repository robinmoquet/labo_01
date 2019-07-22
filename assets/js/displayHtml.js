import {getAllMessages} from "./callApi";
import dayjs from "dayjs";

const blockConversation = document.getElementById("block-conversation");
const conversation = document.getElementById("conversation");
const containerMessage = conversation.querySelector(".container-message");

export const displayConversation = user => {
    toggleBlockWriting(null);
    containerMessage.innerHTML = "";
    const userName = user.querySelector(".name").innerText;
    blockConversation.querySelector(".user").innerText = userName;
    getAllMessages(user.dataset.email)
        .then(messages => _displayMessages(messages, user))
        .catch(console.log);
};

export const createMessage = (message, send = true, status = false) => {
    const htmlMessage = _getHtmlMessage(message, send, status);
    containerMessage.innerHTML += htmlMessage;
    setTimeout(() => {
        conversation.querySelector("*[data-id='" + message.id + "']").classList.remove("anim-display");
        conversation.scrollTop = conversation.scrollHeight - 50
    }, 100);
};

export const toggleBlockWriting = (sender, show = true) => {
    const blockWriting = blockConversation.querySelector(".block-writing");
    const sideBar = document.getElementById("sidebar");
    let activeUser = sideBar.querySelector(".active");
    if(activeUser === null) return;

    if (show && sender === activeUser.dataset.email) {
        blockWriting.classList.remove("anim-display");
    } else {
        blockWriting.classList.add("anim-display");
    }
};

export const changeStatusMessage = data => {
    const sideBar = document.getElementById("sidebar");
    let activeUser = sideBar.querySelector(".active");
    if(activeUser === null) return;

    if (data.sender === activeUser.dataset.email) {
        const message = document.querySelector(".block-message[data-id='" + data.idMessage + "']");
        console.log(".block-message[data-id='" + data.idMessage + "']");
        console.log(message);
        if(message === null) return;
        message.querySelector(".status").innerText = data.status;
    }
};


const _displayMessages = (messages, user) => {
    messages.forEach(message => {
        if (message.receiver.email === user.dataset.email) {
            createMessage(message)
        } else {
            createMessage(message, false)
        }
    });
};

const _getHtmlMessage = (message, send, status = false) => {
    let rounded, bg, pos, text, displayStatus;
    if (send) {
        rounded = "br";
        bg = "blue";
        pos = "end";
        text = "right";
        if(status) {
            displayStatus = "<i class=\"material-icons text-sm align-middle mb-1\">check</i><span class='status'>" + status + "</span>";
        } else {
            displayStatus = "<span>" + dayjs(message.createAt.timestamp * 1000).format('DD / MM / YYYY') + "</span>";
        }
    } else {
        rounded = "bl";
        bg = "gray";
        pos = "start";
        text = "left";
        displayStatus = "<span>" + dayjs(message.createAt.timestamp * 1000).format('DD / MM / YYYY') + "</span>";
    }

    return `
        <div class="block-message anim-display relative flex justify-${pos} mb-4" data-id="${message.id}">
            <div class="w-2/3">
                <div class="message bg-${bg}-400 rounded-lg rounded-${rounded}-none px-4 py-1">
                    <p class="text-white">${message.content}</p>
                </div>
                <p class="text-${text} text-gray-400 text-sm">${displayStatus}</p>
            </div>
        </div>
    `
};