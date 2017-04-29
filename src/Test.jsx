import React from "react";
import { render } from "react-dom";
import Hello from "./Hello";

const styles = {
  fontFamily: "sans-serif",
  textAlign: "center"
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      events: "",
      people: ""
    };
  }
  componentWillMount() {
    fetch("http://example.org/").then(response => response.json()).then(json =>
      this.setState({
        title: json.title,
        events: json.events,
        people: json.people
      })
    );
  }

  render() {
    return (
      <div>
        <Child url={this.state.events} />
        <Child url={this.state.people} />
      </div>
    );
  }
}

class Child extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collection: []
    };
  }
  componentWillMount() {
    fetch(this.props.url, {
      method: "GET",
      headers: {
        Accept: "application/json"
      }
    }).then(response => {
      if (response.ok) {
        response.json().then(json =>
          this.setState({
            collection: json[Object.keys(json)[0]]
          })
        );
      }
    });
  }

  render() {
    return <div>Test</div>;
  }
}

render(<App />, document.getElementById("root"));
