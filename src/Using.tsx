import * as React from "react";
import * as Rx from "rxjs/Rx";
import * as moment from "moment";
import "./style.css";

class SessionDisposable {
    private token;
    private disposed;
    constructor(sessionToken) {
        this.token = sessionToken;
        this.disposed = false;
        let expiration = moment().add(1, 'days').toDate();
        document.cookie = `session_token=${sessionToken};expires=${expiration.toUTCString()}`;
        console.log('Session created: ' + this.token);
    }
    getToken() {
        return this.token;
    }
    unsubscribe() {
        if (!this.disposed) {
            this.disposed = true;
            this.token = null;
            document.cookie = 'session_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
            console.log('Ended session! This object has been disposed.');
        }
    }
}

export default class Using extends React.Component<any, any> {
    constructor(props) {
        super();
    }

    componentDidMount() {
        function generateSessionToken() {
            return 'xyxyxyxy'.replace(/[xy]/g, c => {
                return Math.floor(Math.random() * 10).toString();
            });
        }
        const $countDownSession = Rx.Observable.using(
            () => new SessionDisposable(generateSessionToken()),
            () => Rx.Observable.interval(1000)
                .startWith(10)
                .scan(val => val - 1)
                .take(10)
        );
        $countDownSession.subscribe(console.log);
    }

    render() {
        return (
            <div>
                <div id="using" />
            </div>
        );
    }
}