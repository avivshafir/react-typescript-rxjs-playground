import * as React from "react";
import { render } from "react-dom";
import * as Rx from "rxjs/Rx";
import * as R from "ramda";

class App extends React.Component<any, any> {
  constructor(props) {
    super();
    this.state = {
      results: []
    };
  }

  componentDidMount() {
    const searchBox: any = document.querySelector('#search');
    const URL = 'https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&utf8=1&srsearch=';
    Rx.Observable
      .fromEvent(searchBox, 'keyup')
      .pluck('target', 'value')
      .debounceTime(500)
      .filter(val => val && val.toString().length > 0)
      .do(term => console.log(`Searching with term ${term}`))
      .map(query => URL + query)
      .mergeMap(query => Rx.Observable.ajax(query)
        .pluck('response', 'query', 'search')
        .defaultIfEmpty([]))
      .do(console.log)
      .mergeMap(R.map(R.prop('title')))
      .do(console.log)
      .subscribe(results => {
        console.log("setting state: ", [...this.state.results, results])
        this.setState({ results: [...this.state.results, results] })
      });
  }

  render() {
    return (
      <div style={{ textAlign: "center" }}>
        <input id="search" />
        <ul style={{ listStyle: "none" }}>
          {this.state.results.map((title, id) => (
            <li key={id}>
              {title}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

render(<App />, document.getElementById("root"));
