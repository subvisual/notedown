import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import { getSavedQueries } from "selectors";
import styled from "styled-components";
import { notesSearch } from "notes";
import { Title } from "./Title";

const Root = styled.div`
  padding: 1rem 0 0.8rem 3.5rem;
  overflow-y: scroll;
  overflow-x: hidden;
  height: 100%;
  width: 100%;

  ol {
    list-style-position: inside;
  }
`;

const Button = styled.button`
  background: transparent;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  color: inherit;
  border: 0;
  outline: none;
`;

export const SavedQueryes = () => {
  const queries = useSelector(getSavedQueries);
  const dispatch = useDispatch();

  return (
    <Root>
      <Title>Saved Searches</Title>
      {queries.length === 0 ? (
        <div>
          There are no saved queries.
          <br /> Search for something and press <em>Cmd+Enter</em> to save the
          search.
        </div>
      ) : null}
      <ol>
        {queries.map((query: string, index: number) => (
          <li key={query + index.toString()}>
            <Button onClick={() => dispatch(notesSearch(query))}>
              {query}
            </Button>
          </li>
        ))}
      </ol>
    </Root>
  );
};
