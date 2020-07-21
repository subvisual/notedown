import * as React from "react";
import { format } from "date-fns";
import styled, { keyframes, css } from "styled-components";
import { useDispatch } from "react-redux";

import { Note } from "models/types";
import { notesEdit, notesSelect, notesUpdate, notesDelete } from "notes";
import { textColorForBackground } from "utils/color";
import { convertMdToHTML } from "utils/markdownConverter";

const NoteDate = styled.div`
  color: currentColor;
  font-size: 0.75rem;
  font-style: italic;
  height: 1rem;
  line-height: 1rem;
`;

const NoteHeader = styled.div`
  display: flex;
  align-items: center;
  padding-left: 1.5rem;
  margin-bottom: 0.5rem;

  @media (max-width: 900px) {
    padding-left: 1rem;
  }
`;

const Root = styled.div<{ selected: boolean }>`
  background: ${({ theme, selected }) =>
    selected ? theme.accent1 : theme.background1};
  color: ${({ theme, selected }) =>
    textColorForBackground(selected ? theme.accent1 : theme.background2)};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  font-size: 1rem;
  outline: none;
  padding: 1.5rem;
  text-align: left;
  transition: all 0.1s ease-in-out;
  width: 100%;
  margin-bottom: 2rem;
  border-radius: 4px;

  @media (max-width: 900px) {
    padding: 1rem;
  }

  audio {
    width: 100%;
    margin-bottom: 1rem;
  }

  .youtube {
    position: relative;
    padding-bottom: 56.25%;
    margin-bottom: 1rem;

    iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }

  img {
    max-width: 100%;
    max-height: 200px;
    border-radius: 4px;
    vertical-align: text-top;
  }

  ul,
  ol {
    list-style-position: outside;
    margin: 1rem 0;
    padding-left: 1rem;
  }

  li {
    margin-bottom: 0.5rem;
  }

  li > p:first-child {
    margin-top: 0;
  }

  li > p:last-child {
    margin: 0;
  }

  p {
    word-break: break-word;
    margin: 0.5rem 0 1rem;
  }

  h1,
  h2,
  h3,
  h4 {
    margin-top: 1rem;
    margin-bottom: 0.5rem;
  }

  h1 {
    font-size: 1.4rem;
  }

  h2 {
    font-size: 1.3rem;
  }

  h3 {
    font-size: 1.2rem;
  }

  h4 {
    font-size: 1.1rem;
  }

  input[type="checkbox"] {
    margin-left: 0 !important;
    margin-bottom: 8px !important;
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`;

const NoteActions = styled.div<{ selected: boolean }>`
  display: inline-flex;
  margin-left: 1rem;
  opacity: 0;

  ${({ selected }) =>
    selected &&
    css`
      animation-fill-mode: forwards;
      animation-name: ${fadeIn};
      animation-duration: 0.2s;
      animation-delay: 0.1s;
      animation-iteration-count: 1;
      animation-timing-function: linear;
    `}

  button {
    background: transparent;
    font-size: 0.75rem;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 0.5rem;
    border: 0;
    cursor: pointer;
    color: inherit;
    opacity: 0.9;

    &:hover {
      opacity: 1;
    }
  }
`;

const Content = styled.div<{ selected: boolean }>`
  display: flex;
  flex-direction: column;
  cursor: initial;
  grid-column: 1 / span 2;

  pre {
    overflow: auto;
    margin: 1rem 0;
    color: ${({ theme }) => textColorForBackground(theme.background2)};
    background: ${({ theme }) => theme.background2};
    padding: 0.8rem;
    border-radius: 4px;
  }

  > *:first-child {
    margin-top: 0;
  }

  > *:last-child {
    margin-bottom: 0;
  }
`;

function NoteContent({
  children,
  selected,
}: {
  children: string;
  selected: boolean;
}) {
  const [html, setHtml] = React.useState("");

  React.useEffect(() => {
    setHtml(convertMdToHTML(children));
  }, [children]);

  return (
    <Content selected={selected} dangerouslySetInnerHTML={{ __html: html }} />
  );
}

interface Props {
  selected?: boolean;
  note: Note;
  focus?: boolean;
}

export const NotePreview = ({ selected, note, focus }: Props) => {
  const ref = React.createRef<HTMLDivElement>();
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (!focus || !ref.current) return;
    //@ts-ignore
    ref.current.scrollIntoViewIfNeeded();
  }, [focus, ref.current]);

  React.useLayoutEffect(() => {
    if (!ref.current) return;

    const handler = (e: MouseEvent) => {
      if (e.target instanceof Element && e.target.nodeName === "IMG") {
        window.open(e.target.getAttribute("src"), "_blank");
      }
    };

    ref.current.addEventListener("click", handler, { passive: true });

    return () =>
      ref.current && ref.current.removeEventListener("click", handler);
  }, [ref.current]);

  return (
    <>
      <NoteHeader>
        <NoteDate>{format(new Date(note.createdAt), "MM/dd/yyyy")}</NoteDate>
        <NoteActions selected={selected}>
          {selected && (
            <>
              <button onClick={() => dispatch(notesEdit(note))}>edit</button>
              <button
                onClick={() =>
                  dispatch(notesUpdate({ ...note, archived: !note.archived }))
                }
              >
                {note.archived ? `un` : null}archive
              </button>
              <button onClick={() => dispatch(notesDelete(note.id))}>
                remove
              </button>
            </>
          )}
        </NoteActions>
      </NoteHeader>
      <Root
        ref={ref}
        key={note.id}
        onClick={() => dispatch(notesSelect(note))}
        selected={selected}
      >
        <NoteContent selected={selected}>{note.content}</NoteContent>
      </Root>
    </>
  );
};
