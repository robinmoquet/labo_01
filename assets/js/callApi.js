import {URL_API} from "./config";

export const sendMessage = (message, emailReceiver) => {
    return new Promise((resolve, reject) => {
        fetch(URL_API + "message/send/" + emailReceiver, {
            method: "POST",
            body: message
        })
            .then(res => {
                return res.json()
            })
            .then(data => {
                if(data.status === "success") {
                    resolve(data.message);
                } else reject()
            })
            .catch(err => reject())
    });
};

export const getAllMessages = email => {
    return new Promise((resolve, reject) => {
        fetch(URL_API + 'messages/' + email)
            .then(res => res.json())
            .then(data => resolve(data))
            .catch(err => reject(err));
    })
};