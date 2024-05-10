// Watch and compile all Civet files!
// To use this, you'll need Chokidar and Civet installed.
const chokidar = require('chokidar') // Watch for *.civet changes
const {compile} = require('@danielx/civet') // Compile civet code
const fs = require('node:fs/promises')  // Write outputs for civet files

// Refs:
// - https://civet.dev/getting-started
// - https://github.com/paulmillr/chokidar
// - https://github.com/arstnei0/civetman/blob/main/cli/src/main.civet

const watcher = chokidar.watch(['**/*.civet'], {
    ignored: [/node_modules\/?/, '/.git\/?'], // Might want to customize these
    ignoreInitial: false // false = Compile everything at the start!
})

watcher
    .on('add',    compileFile)
    .on('change', compileFile)
    .on('unlink', deleteCorrespondingFile)
    // .on('ready', () => { console.log(watcher.getWatched()) })

// Options
const CIVET_COMPILE_OPTIONS = {
    // js: true,
    // inlineMap: true,
}
// const PREPEND_DIRECTIVES =
// `"civet react"
// `
// ^ See footnote [1]
const OUTPUT_EXTENSION = '.tsx' // See footnote [2]

async function compileFile(path) {
    const outputPath = path.replace(/(\.civet)$/, OUTPUT_EXTENSION)
    const civetCode = await fs.readFile(path, 'utf8')
    const compiled = await compile(
      (PREPEND_DIRECTIVES || '') + civetCode,
      CIVET_COMPILE_OPTIONS
    )
    console.log(`${time()} - ⏩`, outputPath)
    await fs.writeFile(outputPath, compiled, 'utf8')
    return outputPath
}
async function deleteCorrespondingFile(path) {
    const outputPath = path.replace(/(\.civet)$/, OUTPUT_EXTENSION)
    if (!fileExists(outputPath)) return
    console.log(`${time()} - 🗑️`, outputPath)
    await fs.unlink(outputPath)
    return outputPath
}

// Helpers
async function fileExists(path) { return !!(await fs.stat(path).catch(e => false)) }
function time() { return new Date().toLocaleTimeString() }

// Footnotes
// - [1]: To get the text editor LSP to read directives, repeat them
//        in a civetconfig.json: `{ "parseOptions": { "react": true } }`
//        (It'd be cool if I read the config here, but I didn't find a simple or built-in
//         way to do that yet, so, prepending it is.)
// 
// - [2]: You'd think you can use OUTPUT_EXTENSION = '' with filenames like
//        example1.ts.civet, and example2.tsx.civet. But, files named this way
//        break the Civet/TS LSP integration somehow.
