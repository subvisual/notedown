import styled from "styled-components";

import {
  textColorForBackground,
  shadeColor,
  smallContrast,
} from "../utils/color";

export default styled.div<{ center: boolean }>`
  position: relative;
  background: ${({ theme }) => theme.background1};
  border-radius: 0.5rem;
  flex: 1;
  overflow: scroll;
  padding: 1rem 0 0.8rem ${({ center }) => (center ? "0" : "3rem")};
  cursor: text;
  color: ${({ theme }) => textColorForBackground(theme.background1)};

  @media (max-width: 900px) {
    padding: 1rem 2rem;
  }

  img {
    max-height: 200px;
    max-width: 100%;
    border-radius: 0.5rem;
  }

  .CodeMirror {
    font-family: Montserrat;
    height: 100%;
  }

  .cm-s-notes.CodeMirror {
    background: ${({ theme }) => theme.background1};
    color: currentColor;
  }

  .cm-s-notes .CodeMirror-placeholder {
    margin-left: 0.5rem;
    color: ${({ theme }) =>
      shadeColor(textColorForBackground(theme.background1), 30)};
  }

  .cm-s-notes div.CodeMirror-selected {
    background: ${({ theme }) => smallContrast(theme.background1)};
  }

  .cm-s-notes .CodeMirror-gutters {
    background: currentColor;
    border-right: 0px;
  }

  .cm-s-notes .CodeMirror-guttermarker {
    color: currentColor;
  }

  .cm-s-notes .CodeMirror-guttermarker-subtle {
    color: currentColor;
  }

  .cm-s-notes .CodeMirror-linenumber {
    color: currentColor;
  }

  .cm-s-notes .CodeMirror-cursor {
    border-left: 1px solid currentColor;
  }

  .cm-s-notes span.cm-comment {
    color: currentColor;
    font-family: "RobotoMono";
  }

  .cm-s-notes span.cm-atom {
    color: currentColor;
  }

  .cm-s-notes span.cm-number {
    color: currentColor;
  }

  .cm-s-notes span.cm-comment.cm-attribute {
    color: currentColor;
  }

  .cm-s-notes span.cm-comment.cm-def {
    color: currentColor;
  }

  .cm-s-notes span.cm-comment.cm-tag {
    color: currentColor;
    font-weight: bold;
  }

  .cm-s-notes span.cm-comment.cm-type {
    color: currentColor;
  }

  .cm-s-notes span.cm-property,
  .cm-s-notes span.cm-attribute {
    color: currentColor;
  }

  .cm-s-notes span.cm-keyword {
    color: currentColor;
  }

  .cm-s-notes span.cm-builtin {
    color: currentColor;
  }

  .cm-s-notes span.cm-string {
    color: currentColor;
    font-weight: bold;
  }

  .cm-s-notes span.cm-variable {
    color: currentColor;
  }

  .cm-s-notes span.cm-variable-2 {
    color: currentColor;
  }

  .cm-s-notes span.cm-variable-3,
  .cm-s-notes span.cm-type {
    color: currentColor;
  }

  .cm-s-notes span.cm-def {
    color: currentColor;
  }

  .cm-s-notes span.cm-bracket {
    color: currentColor;
  }

  .cm-s-notes span.cm-tag {
    color: currentColor;
    font-weight: bold;
  }

  .cm-s-notes span.cm-header {
    color: currentColor;
  }

  .cm-s-notes span.cm-header-1 {
    font-size: 1.3rem;
  }

  .cm-s-notes span.cm-header-2 {
    font-size: 1.2rem;
  }

  .cm-s-notes span.cm-header-3 {
    font-size: 1.1rem;
  }

  .cm-s-notes span.cm-link {
    color: currentColor;
  }

  .cm-s-notes span.cm-error {
    background: ${({ theme }) => theme.accent1};
    color: ${({ theme }) => textColorForBackground(theme.accent1)};
  }

  .cm-s-notes .CodeMirror-activeline-background {
    background: currentColor;
  }

  .cm-s-notes .CodeMirror-matchingbracket {
    text-decoration: underline;
    color: currentColor !important;
  }

  .cm-s-notes .cm-formatting.cm-formatting-header {
    font-weight: normal;
  }

  .cm-s-notes .cm-formatting.cm-formatting-strong {
    font-weight: normal;
  }

  .cm-s-notes .cm-formatting.cm-formatting-em {
    font-style: normal;
  }

  .cm-s-notes .cm-formatting.cm-formatting-task {
    font-weight: bold;
  }
`;
