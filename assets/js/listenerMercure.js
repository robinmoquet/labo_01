import {changeStatusMessage, createMessage, toggleBlockWriting} from "./displayHtml";
import Event from "./Event";
import EventPublisher from "./EventPublisher";

const urlMessage = new URL("http://localhost:3000/hub");
urlMessage.searchParams.append("topic", "http://labo-01.com/message/send");

const eventMessage = new EventSource(urlMessage, {withCredentials: true});

eventMessage.onmessage = e => {
    const data = JSON.parse(e.data);
    createMessage(data, false);
    toggleBlockWriting(false);

    const sideBar = document.getElementById("sidebar");
    let activeUser = sideBar.querySelector(".active");
    if(activeUser === null) return;

    let event = new Event();
    event.topic = "http://labo-01.com/message/status";
    event.target = "http://localhost:3000/user/" + activeUser.dataset.email;
    event.data = {status: "Distribué", idMessage: data.id, sender: currentUserEmail};

    EventPublisher.publish(event);
};


const urlWriting = new URL("http://localhost:3000/hub");
urlWriting.searchParams.append("topic", "http://labo-01.com/message/writing");

const eventWriting = new EventSource(urlWriting, {withCredentials: true});

eventWriting.onmessage = event => {
    const data = JSON.parse(event.data);
    if(data.status === "writing") toggleBlockWriting(data.sender, true);
    else toggleBlockWriting(data.sender, false);
};

const urlStatus = new URL("http://localhost:3000/hub");
urlStatus.searchParams.append("topic", "http://labo-01.com/message/status");

const eventStatus = new EventSource(urlStatus, {withCredentials: true});

eventStatus.onmessage = event => {
    const data = JSON.parse(event.data);
    console.log(data);
    setTimeout(() => {
        changeStatusMessage(data);
    }, 500)
};