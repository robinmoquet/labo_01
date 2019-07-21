import {createMessage} from "./displayHtml";

const urlMessage = new URL("http://localhost:3000/hub");
urlMessage.searchParams.append("topic", "http://labo-01.com/message/send");

const eventMessage = new EventSource(urlMessage, {withCredentials: true});

eventMessage.onmessage = event => {
    createMessage(JSON.parse(event.data), false);
};


const urlWriting = new URL("http://localhost:3000/hub");
urlWriting.searchParams.append("topic", "http://labo-01.com/message/writing");

const eventWriting = new EventSource(urlWriting, {withCredentials: true});

eventWriting.onmessage = event => {
    console.log(JSON.parse(event.data));
    //createMessage(JSON.parse(event.data), false);
};