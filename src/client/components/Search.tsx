import styled from "styled-components";
import * as React from "react";
import { useSelector, useDispatch } from "react-redux";

import { textColorForBackground, shadeColor } from "../utils/color";
import { getMode } from "../selectors";
import { modeClose } from "../mode";

const Root = styled.div<{ active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: calc(1200px - 2rem);
  margin: 0 5rem;
  width: 100%;

  svg {
    path {
      fill: ${({ theme, active }) =>
        active
          ? textColorForBackground(theme.background1)
          : shadeColor(textColorForBackground(theme.background1), 50)};
    }
  }
`;

const Icon = () => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M13.0526 13.0525C13.1687 12.9363 13.3066 12.8441 13.4583 12.7812C13.6101 12.7183 13.7727 12.6859 13.937 12.6859C14.1013 12.6859 14.2639 12.7183 14.4157 12.7812C14.5674 12.8441 14.7053 12.9363 14.8214 13.0525L19.6339 17.865C19.8684 18.0994 20.0002 18.4173 20.0004 18.7489C20.0005 19.0805 19.8689 19.3986 19.6345 19.6331C19.4001 19.8677 19.0821 19.9995 18.7506 19.9996C18.419 19.9997 18.1009 19.8681 17.8664 19.6337L13.0539 14.8212C12.9376 14.7051 12.8454 14.5673 12.7825 14.4155C12.7196 14.2638 12.6873 14.1011 12.6873 13.9369C12.6873 13.7726 12.7196 13.6099 12.7825 13.4582C12.8454 13.3064 12.9376 13.1686 13.0539 13.0525H13.0526Z"
          fill="#3A3A3A"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M8.125 15C9.02784 15 9.92184 14.8222 10.7559 14.4767C11.5901 14.1312 12.348 13.6248 12.9864 12.9864C13.6248 12.348 14.1312 11.5901 14.4767 10.7559C14.8222 9.92184 15 9.02784 15 8.125C15 7.22216 14.8222 6.32817 14.4767 5.49405C14.1312 4.65994 13.6248 3.90204 12.9864 3.26364C12.348 2.62524 11.5901 2.11883 10.7559 1.77333C9.92184 1.42783 9.02784 1.25 8.125 1.25C6.30164 1.25 4.55295 1.97433 3.26364 3.26364C1.97433 4.55295 1.25 6.30164 1.25 8.125C1.25 9.94836 1.97433 11.697 3.26364 12.9864C4.55295 14.2757 6.30164 15 8.125 15ZM16.25 8.125C16.25 10.2799 15.394 12.3465 13.8702 13.8702C12.3465 15.394 10.2799 16.25 8.125 16.25C5.97012 16.25 3.90349 15.394 2.37976 13.8702C0.856024 12.3465 0 10.2799 0 8.125C0 5.97012 0.856024 3.90349 2.37976 2.37976C3.90349 0.856024 5.97012 0 8.125 0C10.2799 0 12.3465 0.856024 13.8702 2.37976C15.394 3.90349 16.25 5.97012 16.25 8.125Z"
          fill="#3A3A3A"
        />
      </g>
      <defs>
        <clipPath id="clip0">
          <rect width="20" height="20" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

const Input = styled.input`
  width: 100%;
  max-width: calc(1200px - 2rem);

  align-items: center;
  background: transparent;
  //background: ${({ theme }) => theme.background2};
  //border-radius: 0.8rem;
  border: none;
  color: ${({ theme }) =>
    shadeColor(textColorForBackground(theme.background1), 30)};
  display: flex;
  font-size: 1rem;
  //height: 26px;
  height: 100%;
  justify-content: flex-start;
  line-height: 1;
  outline: none;
  padding: 0 1rem;
  text-align: left;
  transition: all 0.2s linear;

  &::placeholder {
    color: currentColor;
  }

  //&:focus {
    //background: ${({ theme }) => theme.accent1};
    //color: ${({ theme }) => textColorForBackground(theme.accent1)};
  //}
`;

export const Search = (props: React.InputHTMLAttributes<HTMLInputElement>) => {
  const ref = React.useRef(null);
  const inputRef = React.useRef(null);

  const [focus, setFocus] = React.useState(false);

  const currentMode = useSelector(getMode);
  const dispatch = useDispatch();

  React.useLayoutEffect(() => {
    if (!focus) dispatch(modeClose());

    const handler = (ev: KeyboardEvent) => {
      if (focus) ev.stopPropagation();
      if (focus && ev.key === "Escape") inputRef.current.blur();
      if (focus && ev.key === "Enter") inputRef.current.blur();
    };

    ref.current.addEventListener("keydown", handler);

    return () => ref.current.removeEventListener("keydown", handler);
  }, [ref, inputRef, focus]);

  React.useLayoutEffect(() => {
    if (currentMode !== "search") {
      return inputRef.current.blur();
    }

    setImmediate(() => inputRef.current.focus());
  }, [inputRef, currentMode]);

  return (
    <Root active={focus} ref={ref}>
      <Icon />
      <Input
        {...props}
        ref={inputRef}
        onBlur={() => setFocus(false)}
        onFocus={() => setFocus(true)}
      />
    </Root>
  );
};
