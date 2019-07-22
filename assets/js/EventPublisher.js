import {HUB_URL} from "./config";

class EventPublisher {
    static publish(event) {

        let header = new Headers({"Authorization": "Bearer " + token.replace("mercureAuthorization=", ""), "Content-type": "application/x-www-form-urlencoded"});

        let body = "";
        if(event.target === null) {
            body = "topic=" + event.topic + "&data=" + event.data
        } else {
            body = "topic=" + event.topic + "&data=" + event.data + "&target=" + event.target
        }

        let request = new Request(HUB_URL, {
            method: "POST",
            headers: header,
            body: body
        });
        fetch(request)
            .then(response => {

            });

    }
}

export default EventPublisher;