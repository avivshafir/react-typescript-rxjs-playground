import * as React from "react";
import * as Rx from "rxjs/Rx";
import * as PouchDB from "pouchdb";

//declare function emit(key: any): void;

const txDb = new PouchDB('transactions');
const accountsDb = new PouchDB('accounts');

class Account {
    constructor(
        public _id: string,
        public name: string,
        public type: string,
        public balance: number) { }
}

class Transaction {
    constructor(
        public name: string,
        public type: string,
        public amount: number,
        public from: string,
        public to: string | null = null
    ) { }
}

export default class Transactions extends React.Component<any, any> {
    constructor(props) {
        super();
    }

    componentDidMount() {
        // first solution
        //-------------------------------------------

        // Rx.Observable.from(getTransactionsArray())
        //     .concatMap(writeTx$)
        //     .subscribe(
        //     rec => console.log(`New record created: ${rec.id}`),
        //     err => console.log('Error: ' + err),
        //     () => console.log('Database populated!')
        //     );

        // optimized bulk solution
        //-------------------------------------------
        // Rx.Observable.from(getTransactionsArray())
        //     .bufferCount(10)
        //     .timestamp()
        //     .map(obj => {
        //         return obj.value.map(tx => {
        //             return Object.assign({}, tx, {
        //                 date: obj.timestamp
        //             })
        //         })
        //     })
        //     .do(txs => console.log(`Processing ${txs.length} transactions`))
        //     .mergeMap(datedTxs =>
        //         Rx.Observable.fromPromise(txDb.bulkDocs(datedTxs)))
        //     .subscribe(
        //     rec => console.log('New record created'),
        //     err => console.log('Error: ' + err),
        //     () => console.log('Database populated!')
        //     );

        // pouchdb query example
        //-------------------------------------------
        // const count: any = {
        //     map: function (doc) {
        //         emit(doc.name);
        //     },
        //     reduce: '_count'
        // };

        // Rx.Observable.from(getTransactionsArray())
        //     .switchMap(writeTx$)
        //     .mergeMap(() => Rx.Observable.fromPromise(
        //         txDb.query(count, { reduce: true })))
        //     .subscribe(
        //     recs => console.log('Total: ' + recs.rows[0].value),
        //     error => console.log('Error: ' + error),
        //     () => console.log('Query completed!')
        //     )

        // withdraw from account example
        //-------------------------------------------
        Rx.Observable.from(accounts)
            .concatMap(writeAccount$)
            .subscribe(
            rec => console.log(`New record created: ${rec.id}`),
            err => console.log('Error: ' + err),
            () => console.log('Database populated!')
            );

        setTimeout(() => {
            withdraw$({
                name: 'Emmet Brown',
                accountId: '1',
                type: 'checking',
                amount: 1000
            })
                .subscribe(
                tx => console.log(`Transaction number: ${tx.id}`),
                error => console.log('Error: ' + error),
                () => console.log('Operation completed!!')
                );
        }, 3000);
    }

    render() {
        return (
            <div>
                <h1>Transactions</h1>
            </div>
        );
    }
}

const writeTx$ = tx => Rx.Observable.of(tx)
    .timestamp()
    .map(obj => ({ ...obj.value, date: obj.timestamp }))
    .do(tx => console.log(`Processing transaction for: ${tx.name}`))
    .mergeMap(datedTx => Rx.Observable.fromPromise(txDb.post(datedTx)));

const accounts = [
    new Account('1', 'Emmet Brown', 'savings', 1000),
    new Account('2', 'Emmet Brown', 'checking', 2000),
    new Account('3', 'Emmet Brown', 'CD', 20000),
];

const writeAccount$ = acc => Rx.Observable.of(acc)
    .timestamp()
    .map(obj => ({ ...obj.value, date: obj.timestamp }))
    .do(() => console.log(`Processing account for: ${acc.name}`))
    .mergeMap(datedAcc => Rx.Observable.fromPromise(accountsDb.put(datedAcc)))
    .do(console.log);

function withdraw$({ name, accountId, type, amount }) {
    return Rx.Observable.fromPromise(accountsDb.get(accountId))
        .do((doc: any) => console.log(
            doc.balance < amount ?
                'WARN: This operation will cause an overdraft!' :
                'Sufficient funds'
        ))
        .mergeMap(doc => Rx.Observable.fromPromise(
            accountsDb.put({
                _id: doc._id,
                _rev: doc._rev,
                balance: doc.balance - amount
            }))
        )
        .filter(response => response.ok)
        .do(() => console.log('Withdraw succeeded. Creating transaction document'))
        .concatMap(() => writeTx$(new Transaction(name, 'withdraw', amount, type)));
}

// function getTransactionsArray() {
//     return [
//         new Transaction('Brendan Eich', 'withdraw', 500, 'checking'),
//         new Transaction('George Lucas', 'deposit', 800, 'savings'),
//         new Transaction('Emmet Brown', 'transfer', 2000, 'checking', 'savings'),
//         new Transaction('Bjarne Stroustrup', 'transfer', 1000, 'savings', 'CD'),
//         new Transaction('Bjarne Stroustrup', 'transfer', 1000, 'savings', 'CD'),
//         new Transaction('Bjarne Stroustrup', 'transfer', 1000, 'savings', 'CD'),
//         new Transaction('Bjarne Stroustrup', 'transfer', 1000, 'savings', 'CD'),
//         new Transaction('Bjarne Stroustrup', 'transfer', 1000, 'savings', 'CD'),
//         new Transaction('Bjarne Stroustrup', 'transfer', 1000, 'savings', 'CD'),
//         new Transaction('Bjarne Stroustrup', 'transfer', 1000, 'savings', 'CD'),
//         new Transaction('Bjarne Stroustrup', 'transfer', 1000, 'savings', 'CD'),
//         new Transaction('Bjarne Stroustrup', 'transfer', 1000, 'savings', 'CD'),
//         new Transaction('Bjarne Stroustrup', 'transfer', 1000, 'savings', 'CD'),
//         new Transaction('Bjarne Stroustrup', 'transfer', 1000, 'savings', 'CD'),
//         new Transaction('Bjarne Stroustrup', 'transfer', 1000, 'savings', 'CD'),
//     ];
// }