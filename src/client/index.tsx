import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";

import createStore from "./store";
import "./fonts.css";
import "./utils/contextMenu";

import App from "./App";

const store = createStore();

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
