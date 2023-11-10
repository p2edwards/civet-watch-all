# Civet Watch-All

Compiles and re-compiles all [Civet](https://civet.dev/) files on change.

Like [Civetman](https://github.com/arstnei0/civetman/tree/main), but a little
bit simpler.

## Usage

Copy [`index.js`](./index.js) to your project. Run with node.

Read the code, it's pretty short.

Customize to meet your needs.

## Dependencies

- [`chokidar`](https://github.com/paulmillr/chokidar) for file watching
- [`@danielx/civet`](https://github.com/DanielXMoore/Civet#civet) for Civet compile
- [node `fs`](https://nodejs.org/api/fs.html#promise-example) for file
  read/write
