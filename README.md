# NoteDown

![Screenshot](./assets/demo.png)

- It's keyboard-driven. There are shortcuts for almost everything.
- There are no severs and accounts. Your data is saved to the file system so
  you don't have to trust anyone else.
- It's simple. Just write and drop files into it. Use the search to find what
  you're looking for.

**Get the latest version from [relases page](https://github.com/subvisual/notedown/releases)**

## Features

- Markdown editor with image previews.
- Change the theme or pick your colors.
- Shortcuts for almost everything.
- Drop files.
- Paste images.
- Full-text search in content and PDFs.
- Folder sync to backup and restore.
- Simplicity.
- Focused writing mode.

## Todo

- Code signing.
- Allow writing charts and digrams in markdown.
- Search text inside images and PDFs.
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
