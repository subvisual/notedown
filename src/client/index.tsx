import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";

import createStore from "./store";
import "./fonts.css";
import "./utils/contextMenu";

import App from "./App";
import { themeLoad } from "./theme";
import * as Sync from "../models/sync";

Sync.run();

const store = createStore();

store.dispatch(themeLoad());

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
