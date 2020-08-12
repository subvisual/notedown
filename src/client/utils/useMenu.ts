import * as React from "react";
import { useDispatch } from "react-redux";

const { remote } = require("electron");
const { Menu } = remote;

import { modeSet } from "../mode";
import { MenuItemConstructorOptions } from "electron";
import { notesEdit } from "../notes";

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
          { label: "Reload", role: "reload" },
          { type: "separator" },
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
