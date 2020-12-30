import * as React from "react";

import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";

import { ConfirmationDialog } from "./ConfirmationDialog";
import { NotePreview } from "./NotePreview";

import { getFocusedNoteId, getDeletingNote } from "selectors";
import { notesRemove, notesDelete } from "../notes";
import { Note } from "@notedown/lib/types";

const Root = styled.div`
  position: relative;
  overflow-y: scroll;
  overflow-x: hidden;
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-right: 3rem;
  padding-left: 1rem;

  @media (max-width: 900px) {
    padding-right: 1rem;
  }
`;

const Inside = styled.div`
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
`;

export function NotesList({
  notes,
  selected,
}: {
  notes: Note[];
  selected: Note;
}) {
  const focusNoteId = useSelector(getFocusedNoteId);
  const deleting = useSelector(getDeletingNote);
  const dispatch = useDispatch();

  return (
    <Root>
      <Inside>
        {notes.map((note) => (
          <NotePreview
            key={note.id}
            selected={selected && selected.id === note.id}
            focus={focusNoteId === note.id}
            note={note}
          />
        ))}
      </Inside>
      {deleting && (
        <ConfirmationDialog
          label="Are you sure you want to delete this note?"
          onYes={() => dispatch(notesRemove(deleting.id))}
          onNo={() => dispatch(notesDelete(null))}
        />
      )}
    </Root>
  );
}
