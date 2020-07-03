# NoteDown

![Screenshot](./assets/demo.png)

The principles behind the design of NoteDown:

- Keyboard-driven. Almost everything should be accomplished through a shortcut.
- Private. There are no severs and accounts. Nothing leaves your computer so
  you don't have to trust anyone.
- Simple. You can write markdown and drop/paste media files.

**Get the latest version from [releases page](https://github.com/subvisual/notedown/releases)**

## Features

### The Editor

NoteDown demands that you write notes in [Markdown](https://daringfireball.net/projects/markdown/syntax). That's the only way to use it to its full potential. Besides writing Markdown:

- You can drop a file from the file system to save it to NoteDown. A Markdown link to
  that file will be inserted at the cursor's position. For images and audio
  files, a Markdown embed will be inserted.
- You can paste images from the browser or the file system. The image will be saved to NoteDown, and a Markdown embed will be placed at the cursor's position.
- Pasting links (only links) will transform them into Markdown links.
- Images will have a preview bellow. We'll be adding more widgets for other elements.
- Writing lists will automatically insert and remove the `*` and `nr.`.

Besides the original syntax, we extended Markdown to allow:

- embedding audio files using the syntax `!audio[file name](file url)`.
- embedding youtube videos using the syntax `!youtube[file name](link to video)`.

### Searching

NoteDown is like a diary. You write one entry after the other. Notes are not connected. If you need to find something, you can either scroll, or find. You should use the find as it works to search by text, file names, links, it even works for text inside PDFs! Since you cannot use tags or links like other note-taking applications, they way to relate information is using a keyword. For instance, all my notes related to NoteDown start, or end, with the word `@notedown`. This makes is very easy to look for it. When I need to save a link related to Vim, the link doesn't contain the word `vim` I will usually just write after the link, to make sure I can find it later.

### Notes Explorer

### Backup

Because all your notes and files will be saved to your computer, you should take some precautions to backup your data. On the menu, there's an option for "Sync Folder". This is a two-way mechanism to sync notes to and from a folder. You can use it to back-up notes to Google Drive for instance. You can even use it to sync notes between two computers using NoteDown, but I advise caution on this one, as I haven't tested this thoroughly.

- 

### Tips

- NoteDown comes with a few themes for you to choose from, but you can pick your colors and NoteDown will adjust some things, such as the text, to match the necessary contrast for them.
- Use the "focus" mode to hide everything but the editor.

## Todo

- Allow writing charts and digrams in markdown.
- Mobile app.

## Setup

To install NoteDown, run the follow commands:

```sh
git clone git@github.com:subvisual/notedown.git
cd notedown
bin/setup
```

## Development

To start the development environment, run:

```sh
bin/server
```

## Deployment

If you're building on macOS and you don't have a signing profile setup, you may
want set the environment variable `CSC_IDENTITY_AUTO_DISCOVERY` to `false`.

To create a macOS and Linux builds, run:

```sh
bin/build
```

## About

NoteDown was created and is maintained with :heart: by [Subvisual][subvisual].
If you have any questions or comments, feel free to open an issue or reach out
to [Gabriel on Twitter](https://twitter.com/gabrielgpoca).

[![Subvisual][subvisual-logo]][subvisual]

[subvisual]: http://subvisual.com
[subvisual-logo]: https://raw.githubusercontent.com/subvisual/guides/master/github/templates/logos/blue.png
