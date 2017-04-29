import * as React from "react";
import { render } from "react-dom";

import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'
import Stocks from "./Stocks";
import Wikipedia from "./Wikipedia";
import DragDrop from "./DragDrop";
import Using from "./Using";
import CombineLatest from "./CombineLatest";

const Home = () => (
  <h1>React Redux RxJS Examples</h1>
)

const App = () => (
  <Router>
    <div>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/wikipedia">Wikipedia</Link></li>
        <li><Link to="/stocks">Stocks</Link></li>
        <li><Link to="/dragdrop">DragDrop</Link></li>
        <li><Link to="/using">Using</Link></li>
        <li><Link to="/combineLatest">CombineLatest</Link></li>
      </ul>

      <hr />

      <Route exact path="/" component={Home} />
      <Route path="/wikipedia" component={Wikipedia} />
      <Route path="/stocks" component={Stocks} />
      <Route path="/dragdrop" component={DragDrop} />
      <Route path="/using" component={Using} />
      <Route path="/combineLatest" component={CombineLatest} />
    </div>
  </Router>
)

render(<App />, document.getElementById("root"));


class Foo {
  delete(): Promise<void> {
    // do delete
    return Promise.resolve();
  }
  deleteMany(list: Foo[]): Promise<void[]> {
    return Promise.all(list.map((x) => x.delete()));
  }
}
