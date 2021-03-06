import * as React from "react";
import { useDispatch } from "react-redux";

const { remote, clipboard } = require("electron");
const { Menu } = remote;

import { modeSet } from "../mode";
import { MenuItemConstructorOptions } from "electron";
import { notesEdit } from "../notes";
import { pasteWithoutFormatting } from "../components/CodeMirrorEditor";

const isMac = process.platform === "darwin";

export const useMenu = () => {
  const dispatch = useDispatch();

  React.useMemo(() => {
    //@ts-ignore
    const menu: MenuItemConstructorOptions[] = [
      ...(isMac
        ? [
            {
              label: "NoteDown",
              submenu: [{ role: "quit" }],
            },
          ]
        : []),
      {
        label: "NoteDown",
        submenu: [
          {
            label: "New Note",
            accelerator: "CmdOrCtrl+N",
            click: () => {
              dispatch(modeSet("editor"));
            },
          },
          {
            label: "Edit Note",
            accelerator: "CmdOrCtrl+E",
            click: () => dispatch(notesEdit()),
          },
          { type: "separator" },
          {
            label: "Preferences",
            accelerator: "CmdOrCtrl+,",
            click: () => {
              dispatch(modeSet("settings"));
            },
          },
          { type: "separator" },
          { label: "Quit", role: "quit" },
        ],
      },
      {
        label: "File",
        submenu: [isMac ? { role: "close" } : { role: "quit" }],
      },
      {
        label: "Edit",
        submenu: [
          { role: "undo" },
          { role: "redo" },
          { role: "cut" },
          { role: "copy" },
          { role: "paste" },
          {
            label: "Paste Without Formatting",
            accelerator: "CmdOrCtrl+Shift+V",
            click: () => pasteWithoutFormatting.next(clipboard.readText()),
          },
          { role: "delete" },
          { role: "selectAll" },
          { type: "separator" },
          {
            label: "Search Notes",
            accelerator: "CmdOrCtrl+F",
            click: () => dispatch(modeSet("search")),
          },
          { type: "separator" },
          {
            label: "Theme",
            click: async () => {
              dispatch(modeSet("colorPicker"));
            },
          },
        ],
      },
      {
        label: "View",
        submenu: [
          {
            label: "Focus mode",
            accelerator: "CmdOrCtrl+T",
            click: () => dispatch(modeSet("editorFocus")),
          },
          { type: "separator" },
          { label: "Reload", role: "reload" },
          { label: "Toggle Developer Tools", role: "toggleDevTools" },
        ],
      },
      {
        label: "Help",
        submenu: [
          {
            label: "Tips",
            click: async () => {
              dispatch(modeSet("tips"));
            },
          },
          {
            label: "Shortcuts",
            click: async () => {
              dispatch(modeSet("shortcuts"));
            },
          },
        ],
      },
    ];

    const appMenu = Menu.buildFromTemplate(menu);
    Menu.setApplicationMenu(appMenu);
  }, [dispatch]);
};
