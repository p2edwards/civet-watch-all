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
const OUTPUT_EXTENSION = '.ts' // See footnote [1]

async function compileFile(path) {
    const outputPath = path.replace(/(\.civet)$/, OUTPUT_EXTENSION)
    const civetCode = await fs.readFile(path, 'utf8')
    const compiled = compile(civetCode, CIVET_COMPILE_OPTIONS)
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
// - [1]: To support both .ts and .tsx, you could use OUTPUT_EXTENSION = ''
//        with filenames like example1.ts.civet, example2.tsx.civet