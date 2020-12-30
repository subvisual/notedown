import { ThemeColors } from "../settings";

declare module "styled-components" {
  export interface DefaultTheme extends ThemeColors {}
}
