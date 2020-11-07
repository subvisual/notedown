import * as React from "react";
import { remote } from "electron";
import * as ReactModal from "react-modal";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";

import { textColorForBackground } from "../utils/color";

import { Title } from "./Title";
import { getTheme, getBackupFolder, getMode } from "../selectors";
import { backupFolderSet } from "../settings";
import { modeClose } from "mode";

const Root = styled.div``;

const Label = styled.div`
  font-weight: bold;
`;

const Button = styled.button`
  background: none;
  border: none;
  text-decoration: underline;
  margin-left: 0.75rem;
  padding: 0;
  color: ${({ theme }) => textColorForBackground(theme.background1)};
  font-size: 0.75rem;
`;

const ButtonClose = styled(Button)`
  font-size: 1rem;
  margin: 0;
  margin-top: 2rem;
`;

export function Settings() {
  const theme = useSelector(getTheme);
  const backupFolder = useSelector(getBackupFolder);
  const dispatch = useDispatch();
  const currentMode = useSelector(getMode);

  const pickBackupFolder = async () => {
    const { filePaths } = await remote.dialog.showOpenDialog({
      properties: ["openDirectory", "createDirectory"],
    });

    if (filePaths.length > 0) {
      dispatch(backupFolderSet(filePaths[0]));
    }
  };

  return (
    <ReactModal
      isOpen={currentMode === "settings"}
      onRequestClose={() => dispatch(modeClose())}
      style={{
        overlay: {
          backgroundColor: theme.colors.background1,
          zIndex: 4,
        },
        content: {
          backgroundColor: "transparent",
          border: 0,
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
        },
      }}
      contentLabel="Settings"
    >
      <Root>
        <Title>Settings</Title>
        <Label>
          Backup folder
          <Button onClick={pickBackupFolder}>Change</Button>
          <Button onClick={() => dispatch(backupFolderSet(null))}>Clear</Button>
        </Label>
        <p>{backupFolder || "Your backup folder is not set"}</p>
        <ButtonClose onClick={() => dispatch(modeClose())}>Close</ButtonClose>
      </Root>
    </ReactModal>
  );
}
