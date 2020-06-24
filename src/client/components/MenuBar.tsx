import * as React from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";

import { Search } from "./Search";
import { getSearchQuery } from "../selectors";
import { notesSearch } from "../notes";
import { getWritingFocusMode } from "../selectors";

const Root = styled.div<{ small: boolean }>`
  -webkit-app-region: drag;
  flex-basis: ${({ small }) => (small ? "3rem" : "4rem")};
  flex-grow: 0;
  flex-shrink: 0;
  position: relative;
  display: flex;
  justify-content: center;
  border-bottom: 1px solid
    ${({ theme, small }) => (small ? "transparent" : theme.background2)};
`;

export function MenuBar() {
  const dispatch = useDispatch();

  const writingFocusMode = useSelector(getWritingFocusMode);
  const query = useSelector(getSearchQuery);

  return (
    <Root small={writingFocusMode}>
      <Search
        value={query}
        onChange={(ev) => dispatch(notesSearch(ev.target.value))}
        placeholder="Search your notes"
      />
    </Root>
  );
}
