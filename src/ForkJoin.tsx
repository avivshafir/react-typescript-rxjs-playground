import * as React from "react";
import * as Rx from "rxjs/Rx";

export default class ForkJoin extends React.Component<any, any> {
    constructor(props) {
        super();
    }

    componentDidMount() {
        const csv = str => str.split(/,\s*/);
        const url = 'http://download.finance.yahoo.com/d/quotes.csv?s=$symbol &f=sa&e=.csv';

        const requestQuote$ = symbol =>
            Rx.Observable.fromPromise(ajax(url.replace(/\$symbol/, symbol)))
                .do(console.log)
                .map((response: any) => response.replace(/"/g, '')) //removing symbol quotes
                .map(csv)

        const symbols = ['FB', 'AAPL', 'CTXS'];

        const add = (x, y) => x + y;

        Rx.Observable.forkJoin(symbols.map(requestQuote$))
            .do(console.log)
            .map(data => data.map(arr => parseInt(arr[1])))
            .subscribe(allPrices => {
                console.log('Total Portfolio Value: ' +
                    new USDMoney(allPrices.reduce(add).toLocaleString()));
            });
    }

    render() {
        return (
            <div>
                <h1>ForkJoin Stocks</h1>
            </div>
        );
    }
}

const Money = function (val, currency) {
    return {
        value: function () {
            return val;
        },
        currency: function () {
            return currency;
        },
        toString: function () {
            return `${currency} ${val}`;
        }
    };
};

const USDMoney = Money.bind(null, 'USD');

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
