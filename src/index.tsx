import * as React from "react";
import { render } from "react-dom";

import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'
import Stocks from "./Stocks";
import Wikipedia from "./Wikipedia";

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
      </ul>

      <hr />

      <Route exact path="/" component={Home} />
      <Route path="/wikipedia" component={Wikipedia} />
      <Route path="/stocks" component={Stocks} />
    </div>
  </Router>
)

render(<App />, document.getElementById("root"));
