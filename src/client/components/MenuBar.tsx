import * as React from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";

import { Search } from "./Search";
import { getSearchQuery } from "../selectors";
import { notesSearch } from "../notes";

const Root = styled.div`
  -webkit-app-region: drag;
  flex-basis: 4rem;
  flex-grow: 0;
  flex-shrink: 0;
  position: relative;
  display: flex;
  justify-content: center;
  border-bottom: 1px solid ${({ theme }) => theme.background2};
`;

export function MenuBar() {
  const dispatch = useDispatch();

  const query = useSelector(getSearchQuery);

  return (
    <Root>
      <Search
        value={query}
        onChange={(ev) => dispatch(notesSearch(ev.target.value))}
        placeholder="Search your notes"
      />
    </Root>
  );
}
