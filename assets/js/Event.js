class Event {

    constructor(topic, data, target = null) {
        this._topic = topic;
        this._data = data;
        this._target = target;
    }

    get target() {
        return this._target;
    }

    set target(value) {
        this._target = value;
    }
    get data() {
        return JSON.stringify(this._data);
    }

    set data(value) {
        this._data = value;
    }
    get topic() {
        return this._topic;
    }

    set topic(value) {
        this._topic = value;
    }

}

export default Event;