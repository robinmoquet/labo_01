import {getAllMessages} from "./callApi";
import dayjs from "dayjs";

const blockConversation = document.getElementById("block-conversation");
const conversation = document.getElementById("conversation");
const containerMessage = conversation.querySelector(".container-message");

export const displayConversation = user => {
    containerMessage.innerHTML = "";
    const userName = user.querySelector(".name").innerText;
    blockConversation.querySelector(".user").innerText = userName;
    getAllMessages(user.dataset.email)
        .then(messages => _displayMessages(messages, user))
        .catch(console.log);
};

export const createMessage = (message, send = true) => {
    const htmlMessage = _getHtmlMessage(message, send);
    containerMessage.innerHTML += htmlMessage;
    setTimeout(() => {
        conversation.querySelector("*[data-id='" + message.id + "']").classList.remove("anim-display");
        conversation.scrollTop = conversation.scrollHeight - 50
    }, 100);
};

const _displayMessages = (messages, user) => {
    messages.forEach(message => {
        if(message.receiver.email === user.dataset.email) {
            createMessage(message)
        } else {
            createMessage(message, false)
        }
    });
};



const _getHtmlMessage = (message, send) => {
    let rounded, bg, pos, text, status;
    if(send) {
        rounded = "br";
        bg = "blue";
        pos = "end";
        text = "right";
        status = "<i class=\"material-icons text-sm align-middle mb-1\">check</i> " + message.status
    } else {
        rounded = "bl";
        bg = "gray";
        pos = "start";
        text = "left";
        status = dayjs(message.createAt.timestamp * 1000).format('DD / MM / YYYY')
    }

    return `
        <div class="block-message anim-display relative flex justify-${pos} mb-4" data-id="${message.id}">
            <div class="w-2/3">
                <div class="message bg-${bg}-400 rounded-lg rounded-${rounded}-none px-4 py-1">
                    <p class="text-white">${message.content}</p>
                </div>
                <p class="text-${text} text-gray-400 text-sm">${status}</p>
            </div>
        </div>
    `
};