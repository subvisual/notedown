import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { ipcRenderer } from "electron";

import { notesAdd } from "notes";
import createStore from "./store";
import "./fonts.css";
import "./utils/contextMenu";

import App from "./App";

const store = createStore();

ipcRenderer.on("open-url", (_event, data) => {
  const url = new URL(data);
  const action = url.pathname.replace("//", "");
  const content = url.searchParams.get("content");

  if (action === "add") store.dispatch(notesAdd({ content }));
});

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
