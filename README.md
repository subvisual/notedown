# ![NoteDown](./assets/github_logo.png)

NoteDown is a note-taking app.

![Screenshot](./assets/demo.png)

But it's not like every other app. The principles behind the design of NoteDown are:

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
- embedding Youtube videos using the syntax `!youtube[file name](link to video)`.

### Searching

NoteDown is like a diary. You write one note after the other. Time is the only thing connecting notes. To find something, you can either scroll all the way down, or use search input. You should use the search as it works in text, file names, links, it even works for text inside PDFs!

Since you cannot use tags or links like in other note-taking applications, they way to relate information is with keywords. For instance, all my notes related to NoteDown start, or end, with the word `@notedown`. This makes it very easy for me to look it up. When I need to save a link to a page talking about Vim, I paste the link and then write a couple of related words such as `vim` , `editor` or `workflow`.

### Notes Explorer

### Backup

Because all your notes and files will be saved to your computer, you should take some precautions to backup your data. On the menu, there's an option for "Sync Folder". This is a two-way mechanism to sync notes to and from a folder. You can use it to back-up notes to Google Drive for instance. You can even use it to sync notes between two computers using NoteDown, but I advise caution on this one, as I haven't tested this thoroughly.

### Tips

- NoteDown comes with a few themes for you to choose from, but you can pick your colors and NoteDown will adjust some things, such as the text, to match the necessary contrast for them.
- Use the "focus" mode to hide everything but the editor.

### Todo

These are other things that we may do. We are also open to contributions, so feel free to make them and I'll help getting them merged.

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
