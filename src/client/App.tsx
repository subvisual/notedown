import * as React from "react";
import { createGlobalStyle } from "styled-components";
import * as Modal from "react-modal";

Modal.setAppElement("#root");

import { CustomThemeProvider } from "./components/CustomThemeProvider";
import { HomePage } from "./components/HomePage";
import { ColorPicker } from "./components/ColorPicker";
import { DatabaseProvider } from "./components/DatabaseProvider";
import { isDark } from "./utils/color";
import { useMenu } from "./utils/useMenu";

const Global = createGlobalStyle`
  ::-webkit-scrollbar {
    width: 0px;
    background: transparent;
  }

  html, body, #root {
    background-color: ${({ theme }) => theme.background1};
    color: ${({ theme }) => (isDark(theme.background1) ? "#FFFFFF" : "#333")};
    display: flex;
    flex-direction: column;
    flex: 1;
    font-family: Montserrat;
    font-size: 16px;
    height: 100%;
    line-height: 1.4;
    max-height: 100%;
    max-width: 100%;
    overflow: hidden;
    width: 100%;
  }

  h1, h2, h3, h4 {
    line-height: 1.4;
    font-weight: 600;
  }

  input, label {
    color: inherit;
    font-size: inherit;
  }

  a {
    color: inherit;
    text-decoration: underline;
    line-height: inherit;
  }

  * {
    -webkit-font-smoothing: antialiased;
    box-sizing: border-box;
    margin: 0;
    min-width: 0;
    padding: 0;
  }
`;

export default function App() {
  useMenu();

  return (
    <CustomThemeProvider>
      <>
        <DatabaseProvider>
          <ColorPicker />
          <Global />
          <HomePage />
        </DatabaseProvider>
      </>
    </CustomThemeProvider>
  );
}
