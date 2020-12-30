import { CSSProperties } from "react";

export const visuallyHidden: CSSProperties = {
  position: "absolute",
  height: "1px",
  width: "1px",
  overflow: "hidden",
  clip: "rect(1px, 1px, 1px, 1px)",
  whiteSpace: "nowrap",
};
