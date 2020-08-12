import * as React from "react";
import * as ReactModal from "react-modal";

import { textColorForBackground } from "../utils/color";
import { useSelector } from "react-redux";
import { getTheme } from "../selectors";

export const Modal = ({
  children,
  contentLabel,
  open,
  onClose,
  style,
}: {
  children: any;
  contentLabel?: string;
  open: boolean;
  onClose: () => any;
  style?: React.CSSProperties;
}) => {
  const theme = useSelector(getTheme);

  return (
    <ReactModal
      isOpen={open}
      onRequestClose={onClose}
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.2)",
          zIndex: 4,
        },
        content: {
          backgroundColor: theme.colors.background1,
          border: 0,
          borderRadius: "0.5rem",
          bottom: "auto",
          color: textColorForBackground(theme.colors.background1),
          left: "50%",
          margin: 0,
          minWidth: 600,
          overflow: "initial",
          padding: 0,
          right: "auto",
          top: "50%",
          transform: "translate(-50%, -50%)",
          ...style,
        },
      }}
      contentLabel={contentLabel}
    >
      {children}
    </ReactModal>
  );
};
