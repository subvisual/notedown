import * as React from "react";
import styled from "styled-components";

import { ThemeColors } from "../settings";
import { visuallyHidden } from "../utils/visuallyHidden";
import { textColorForBackground } from "../utils/color";

const Root = styled.button`
  display: grid;
  grid-template-columns: auto 1fr;
  grid-column-gap: 0.5rem;
  align-items: center;
  border: 0;
  background: none;
  outline: none;
  cursor: pointer;
`;

const Label = styled.label`
  color: ${({ theme }) => textColorForBackground(theme.background2)};
  cursor: pointer;
  text-align: left;
  font-size: 0.75rem;
`;

const CustomRadio = ({
  colors,
  checked,
}: {
  colors: ThemeColors;
  checked: boolean;
}) => {
  return (
    <svg style={{ width: "2rem", height: "2rem" }} viewBox="0 0 100 100">
      <polygon
        points="10,90 90,10 90,90"
        style={
          {
            fill: colors.accent1,
          } as React.CSSProperties
        }
      />
      <polygon
        points="90,10 10,10 10,90"
        style={
          {
            fill: colors.background2,
          } as React.CSSProperties
        }
      />
      <rect
        width="100"
        height="100"
        style={
          {
            fill: "transparent",
            strokeWidth: "22",
            stroke: checked
              ? textColorForBackground(colors.background2)
              : "transparent",
          } as React.CSSProperties
        }
      />
    </svg>
  );
};

export const ThemeItem = ({
  theme,
  name,
  checked,
  onChange,
}: {
  theme: ThemeColors;
  name: string;
  checked: boolean;
  onChange: (theme: ThemeColors) => any;
}) => {
  return (
    <Root onClick={() => onChange(theme)}>
      <input
        style={visuallyHidden}
        onChange={() => onChange(theme)}
        type="radio"
        id={name}
        name="theme"
        value={name}
        checked={checked}
      />
      <CustomRadio checked={checked} colors={theme} />
      <Label htmlFor={name}>{name}</Label>
    </Root>
  );
};
