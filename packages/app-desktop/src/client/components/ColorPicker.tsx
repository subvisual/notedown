import * as React from "react";
import { ChromePicker } from "react-color";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import * as ReactModal from "react-modal";
import { findKey, map, pick, keys } from "lodash";

import { ThemeColors } from "@notedown/lib/types";
import { getTheme, getMode } from "../selectors";
import { themeColors } from "../settings";
import { textColorForBackground } from "../utils/color";
import { modeClose } from "../mode";
import { ThemeItem } from "./ThemeItem";

const PICKER_WIDTH = 225;

const customStyles = {
  overlay: {
    zIndex: 2,
    backgroundColor: "transparent",
  },
  content: {
    backgroundColor: "transparent",
    border: 0,
    bottom: "auto",
    left: "auto",
    margin: 0,
    padding: 0,
    right: "1rem",
    top: "calc(4rem + 1rem)",
  },
};

const staticThemes = {
  default: {
    background1: "#2a2438",
    background2: "#352f44",
    accent1: "#411e8f",
  },
  subvisual: {
    background1: "#FFFFFF",
    background2: "#F1F6FF",
    accent1: "#045CFC",
  },
  light: {
    background1: "#FFFFFF",
    background2: "#E9E7EA",
    accent1: "#411e8f",
  },
  dark: {
    background1: "#202020",
    background2: "#272727",
    accent1: "#045cfc",
  },
};

const colors: (keyof ThemeColors)[] = ["background1", "background2", "accent1"];

const colorLabel: ThemeColors = {
  accent1: "Highlight",
  background1: "Background 1",
  background2: "Background 2",
};

const Root = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const ThemePicker = styled.div`
  background: ${({ theme }) => theme.background2};
  padding: 2rem;
  border-radius: 0.5rem;
`;

const CustomPicker = styled.div`
  padding: 2rem;
  background: ${({ theme }) => theme.background2};
  display: grid;
  grid-template-columns: auto ${PICKER_WIDTH}px;
  grid-column-gap: 2rem;
  border-radius: 0.5rem;
  min-height: 290px;
  margin-top: 1rem;
  min-width: 340px;
`;

const ColorGroup = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  grid-row-gap: 1rem;
  grid-column-gap: 0.5rem;
  align-items: center;
  align-content: start;
`;

const ThemeGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-row-gap: 1rem;
  align-items: center;
  align-content: start;
`;

const Label = styled.label`
  color: ${({ theme }) => textColorForBackground(theme.background2)};
  font-size: 0.75rem;
  cursor: pointer;
`;

export const ColorPicker = () => {
  const [themeName, setThemeName] = React.useState<
    keyof typeof staticThemes | "custom"
  >(null);
  const [color, setColor] = React.useState<keyof ThemeColors>("accent1");
  const currentMode = useSelector(getMode);
  const dispatch = useDispatch();
  const ref = React.useRef(null);
  const theme = useSelector(getTheme);

  React.useEffect(() => {
    const name = findKey(
      staticThemes,
      pick(theme.colors, ["accent1", "background1", "background2"])
    );

    if (name) setThemeName(name as keyof typeof staticThemes);
    else setThemeName("custom");
  }, [theme, setThemeName]);

  React.useLayoutEffect(() => {
    if (!ref.current) return;

    const keydownHandler = (e: KeyboardEvent) => {
      e.stopPropagation();
    };

    ref.current.addEventListener("keydown", keydownHandler, { passive: true });

    return () => {
      ref.current && ref.current.removeEventListener("keydown", keydownHandler);
    };
  }, [ref.current, currentMode]);

  return (
    <>
      <ReactModal
        isOpen={currentMode === "colorPicker"}
        onRequestClose={() => dispatch(modeClose())}
        style={customStyles}
        contentLabel={"Theme Editor"}
      >
        <Root>
          <ThemePicker ref={ref}>
            <ThemeGroup>
              {map(staticThemes, (value, key) => (
                <ThemeItem
                  checked={themeName === key}
                  key={key}
                  name={key}
                  onChange={() => dispatch(themeColors(value))}
                  theme={value}
                />
              ))}
              <ThemeItem
                checked={themeName === "custom"}
                name="custom"
                onChange={() => setThemeName("custom")}
                theme={theme.colors}
              />
            </ThemeGroup>
          </ThemePicker>
          {themeName === "custom" && (
            <CustomPicker ref={ref}>
              <ColorGroup>
                {colors.map((colorName) => (
                  <>
                    <input
                      onChange={() => setColor(colorName)}
                      type="radio"
                      id={colorName}
                      name="color"
                      value={colorName}
                      checked={color == colorName}
                    />
                    <Label htmlFor={colorName}>{colorLabel[colorName]}</Label>
                  </>
                ))}
              </ColorGroup>
              <ChromePicker
                disableAlpha
                onChange={({ hex }) =>
                  dispatch(themeColors({ ...theme.colors, [color]: hex }))
                }
                color={theme.colors[color]}
              />
            </CustomPicker>
          )}
        </Root>
      </ReactModal>
    </>
  );
};
