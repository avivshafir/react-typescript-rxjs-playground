import * as React from "react";
import { render } from "react-dom";
import * as Rx from "rxjs/Rx";

class App extends React.Component<any, any> {
  constructor(props) {
    super();
    this.state = {
      users: []
    };
  }

  sendRequest() {
    return Rx.Observable.fromPromise(
      fetch("http://jsonplaceholder.typicode.com/users").then(res => res.json())
    );
  }

  componentDidMount() {
    const inputText: any = document.querySelector("#inputText");
    Rx.Observable
      .fromEvent(inputText, "keyup")
      .pluck("target", "value")
      .debounceTime(1000)
      .do(query => console.log(`Querying for ${query}...`))
      .map(this.sendRequest)
      .switch()
      .subscribe(users => {
        this.setState({ users });
      });
  }

  render() {
    return (
      <div style={{ textAlign: "center" }}>
        <input id="inputText" />
        <ul style={{ listStyle: "none" }}>
          {this.state.users.map(x => (
            <li key={x.id}>
              {x.name}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

render(<App />, document.getElementById("root"));
