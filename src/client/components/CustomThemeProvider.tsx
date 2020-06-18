import * as React from "react";
import { ThemeProvider } from "styled-components";

import { useSelector } from "react-redux";
import { getTheme } from "../selectors";

export const CustomThemeProvider = ({ children }: { children: any }) => {
  const currentTheme = useSelector(getTheme);

  return <ThemeProvider theme={currentTheme.colors}>{children}</ThemeProvider>;
};
