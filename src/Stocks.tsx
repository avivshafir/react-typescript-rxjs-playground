import * as React from "react";
import * as Rx from "rxjs/Rx";

export default class Stocks extends React.Component<any, any> {
    constructor(props) {
        super();
        this.state = {
            results: {}
        };
    }

    componentDidMount() {
        const csv = str => str.split(/,\s*/);
        const url = 'http://download.finance.yahoo.com/d/quotes.csv?s=$symbol &f=sa&e=.csv';

        const requestQuote$ = symbol =>
            Rx.Observable.fromPromise(ajax(url.replace(/\$symbol/, symbol)))
                .map((response: any) => response.replace(/"/g, '')) //removing symbol quotes
                .map(csv)

        const twoSecond$ = Rx.Observable.interval(2000);

        const fetchDataInterval$ = symbol =>
            twoSecond$.mergeMap(() => requestQuote$(symbol))
                .distinctUntilChanged(([symbol, price]) => price);

        const symbols$ = Rx.Observable.of('FB', 'CTXS', 'AAPL');
        const ticks$ = symbols$.mergeMap(fetchDataInterval$);

        ticks$.subscribe(
            ([symbol, price]) => {
                this.setState({ results: { ...this.state.results, [symbol]: price } })
            },
            error => console.log(error.message));
    }

    render() {
        return (
            <div>
                <h1>Stocks</h1>
                <ul>
                    {Object.keys(this.state.results).map((key, i) => {
                        return <li key={i}>{key} | {this.state.results[key]}</li>
                    })}
                </ul>
            </div>
        );
    }
}

const ajax = url => new Promise((resolve, reject) => {
    let req = new XMLHttpRequest();
    req.open('GET', url);
    req.onload = function () {
        if (req.status == 200) {
            let data = req.responseText;
            resolve(data);
        }
        else {
            reject(new Error(req.statusText));
        }
    };
    req.onerror = function () {
        reject(new Error('IO Error'));
    };
    req.send();
});
