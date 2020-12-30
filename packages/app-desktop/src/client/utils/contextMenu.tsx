import { remote, shell } from "electron";
import { notesFileToFullPath } from "@notedown/lib/files";

const { Menu, MenuItem } = remote;

const getElementSource = (el: EventTarget) => {
  if (el instanceof HTMLImageElement) {
    return el.src;
  } else if (el instanceof HTMLAudioElement) {
    return el.currentSrc;
  } else if (el instanceof HTMLAnchorElement) {
    return el.href;
  }

  return null;
};

const createMenuForElement = (el: EventTarget) => {
  const src = getElementSource(el);

  const menu = new Menu();

  if (src && src.startsWith("notesfile://")) {
    menu.append(
      new MenuItem({
        label: "Open",
        click() {
          shell.openPath(notesFileToFullPath(src));
        },
      })
    );
    menu.append(
      new MenuItem({
        label: "Reveal in file explorer",
        click() {
          shell.showItemInFolder(notesFileToFullPath(src));
        },
      })
    );
  }

  return menu;
};

window.addEventListener(
  "contextmenu",
  (e) => {
    e.preventDefault();

    const menu = createMenuForElement(e.target);
    menu.popup({ window: remote.getCurrentWindow() });
  },
  false
);
