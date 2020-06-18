import { ThemeColors } from "../theme";

declare module "styled-components" {
  export interface DefaultTheme extends ThemeColors {}
}
