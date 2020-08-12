# ![NoteDown](./assets/github_logo.png)

NoteDown is a note-taking application built for **speed** and **power**.

![Screenshot](./assets/demo.png)

The five principles behind the design of NoteDown are:

- Keyboard-driven workflow. Almost everything should be available through the keyboard.
- Local. Your notes never leave your computer.
- Text-based. Notes are just text written in Markdown.
- Multimedia. It must allow for images, PDFs, audio files, etc.
- Customizable. The defaults have to be good, but you need to be able to change them.

**Get the latest version from the [releases page](https://github.com/subvisual/notedown/releases)**

## Functionality

Most note-taking applications work like a wiki: you can write titles for your notes, organize them by folder, assign tags, etc. NoteDown takes a different approach and it's more like a diary, or a scratchpad: you just write everything, anything, one note after the other in chronological order.

NoteDown is only for the capture and retrieval of information. Put everything into it, and use the search when you need it.

Besides text, you can add files to save them alongside your notes. Some files have special properties

- Images will show in both the editor and the notes list.
- The text inside a PDF will be indexed and you can search for it.
- Audio files will show a player.
- Youtube links will embed a player.
- There will be more to come.

but you can upload any file type.

Everything you put into it, NoteDown will and make available through the search.

### The Editor

NoteDown demands that you write in [Markdown](https://daringfireball.net/projects/markdown/syntax), and that's the only way to use it to its full potential. But the editor is not limited to writing Markdown:

- You can drop a file from the file system. A Markdown link to
  that file will be inserted at the cursor's position. For images and audio
  files, a Markdown embed will be inserted.
- You can paste images from the browser or the file system. A Markdown embed will be placed at the cursor's position.
- Pasting a link will transform it into a Markdown links.
- Images will have a preview bellow the link. We'll be adding more widgets for other elements.
- Writing lists will automatically insert and remove the `*` and `nr.`.

NoteDown also extends Markdown to allow:

- Embedding audio files using the syntax `!audio[file name](file url)`.
- Embedding Youtube videos using the syntax `!youtube[file name](link to video)`.

### Searching

NoteDown works like a diary, where you write one note after the other. Time is the only thing connecting notes. To find something, you can either scroll all the way down or use the search. You should use the search as it works in text, file names, links, it even works for text inside PDFs!

Since you cannot use tags or links like in other note-taking applications, the way to relate information is with keywords. For instance, all my notes related to NoteDown start, or end, with the word `notedown`. This makes it very easy for me to look it up. When I need to save a link to a page talking about Vim, I paste the link and then write a couple of related words such as `vim`, `editor`, or `workflow`. Search is full-text search, which means you can use `NOT`, `OR`, `AND`, `+` to refine the search. You can even use prefix, for instance, to find every word starting with _note_: `note*`.

### Notes List

The notes list allows you to perform operations on individual notes: open in the editor, delete, open in focus mode, etc. There are a lot of shortcuts when you're focused in the notes list.

### Backup

Your notes and files are only saved to your computer, so you should take some precautions to backup your data. The most important are notedown/notedown.sqlite and notedown/files/ and you can find them in:

- `%APPDATA%` on Windows
- `$XDG_CONFIG_HOME` or `~/.config` on Linux
- `~/Library/Application Support` on macOS

### Tips

- NoteDown comes with a few themes for you to choose from, but you can pick your colors and NoteDown will adjust some things around them, such as the text, to have the necessary contrast for them.
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
