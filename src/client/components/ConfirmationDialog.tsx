import * as React from "react";
import { Modal } from "./Modal";
import styled from "styled-components";

import { textColorForBackground } from "../utils/color";

const Content = styled.div`
  display: grid;
  padding: 1rem;
  grid-template-columns: auto 1fr;
  grid-row-gap: 1rem;
  grid-column-gap: 1rem;
  justify-items: start;
`;

const Label = styled.div`
  grid-column: 1 / span 2;
`;

const Button = styled.button`
  background: none;
  border-radius: 4px;
  color: inherit;
  cursor: pointer;
  font-size: inherit;
  outline: none;
  padding: 0.5rem;
  text-decoration: none;
  border: 0;

  &:focus {
    background: ${({ theme }) => theme.accent1};
    color: ${({ theme }) => textColorForBackground(theme.accent1)};
  }
`;

export const ConfirmationDialog = ({
  onYes,
  onNo,
  label,
}: {
  onYes: () => any;
  onNo: () => any;
  label: string;
}) => {
  return (
    <Modal open={true} onClose={onNo}>
      <Content>
        <Label>{label}</Label>
        <Button autoFocus onClick={onYes}>
          Yes
        </Button>
        <Button onClick={onNo}>No</Button>
      </Content>
    </Modal>
  );
};
