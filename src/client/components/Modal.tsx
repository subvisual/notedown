import * as React from "react";
import styled from "styled-components";
import * as ReactModal from "react-modal";

import { textColorForBackground } from "../utils/color";

const customStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -50%)",
    backgroundColor: "transparent",
    overflow: "initial",
    padding: 0,
    margin: 0,
    border: 0,
  },
};

const Content = styled.div`
  background: ${({ theme }) => theme.background1};
  color: ${({ theme }) => textColorForBackground(theme.background1)};
  min-width: 600px;
  border-radius: 0.5rem;
`;

export const Modal = ({
  children,
  contentLabel,
  open,
  onClose,
}: {
  children: any;
  contentLabel?: string;
  open: boolean;
  onClose: () => any;
}) => {
  return (
    <ReactModal
      isOpen={open}
      onRequestClose={onClose}
      style={customStyles}
      contentLabel={contentLabel}
    >
      <Content>{children}</Content>
    </ReactModal>
  );
};
