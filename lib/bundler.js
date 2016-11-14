// require('debug').enable('bundler')
// require('debug').enable('bundler:transform')
// require('debug').enable('bundler:bundle')
// require('debug').enable('bundler:requeriments')

const log = require('debug')('bundler')
const Vinyl = require('vinyl')
const parallel = require('async/parallel')
const logBundle = require('debug')('bundler:bundle')
const logRequeriments = require('debug')('bundler:requeriments')
const through2 = require('through2')
const browserify = require('browserify')
const babelify = require('babelify')
const path = require('path')

exports = module.exports = bundlerTransform
exports.default = bundlerTransform
exports.jsBundler = bundlerTransform

/**
 * Preparara el archivo para las dependencias.
 */
function preparingRequerimentFile (chunk, encoding, opts) {
  const {
        requerimentfilename = 'requeriments.js',
        modules = [],
        browserify: setConfigBrowserify = {},
        debug = true
    } = opts

  const filePath = chunk.history[0];

  log('Resuelve configuración para browserify')

  const configBrowserfiy = Object.assign({}, setConfigBrowserify, {
    debug
  })

    // Elimina las entradas
  delete configBrowserfiy.entries

  logRequeriments(`Cargando instancia para crear un archivo de "requerimiento"`)

  return (cb) => {
    if (preparingRequerimentFile.filesRunned.has(filePath) === false) {
      preparingRequerimentFile.filesRunned.add(filePath)

      const newFileOut = path.resolve(path.dirname(filePath) + '/' + path.basename(filePath, '.js') + '.' + requerimentfilename)

      logRequeriments(`Comenzando a crear el archivo de "requerimiento"`)

      let b = browserify(configBrowserfiy)

      for (let m of modules) {
        b = b.require(m, {expose: m})
      }

      b.bundle((err, _bf) => {
        if (err) return cb(err)

        logRequeriments(`Se ha preparado en nuevo archivo de requerimientos ${newFileOut}`)

        this.push(new Vinyl({
          cwd: chunk.cwd,
          base: chunk.base,
          path: newFileOut,
          contents: _bf
        }))

        cb()
      })
    } else {
      logRequeriments(`Ya ha sido creado el archivo de "requerimiento"`)

            // End
      cb()
    }
  }
}
/**
 * Responde true cuando este aya sido cargado por primera vez.
 * @type {Boolean}
 */
preparingRequerimentFile.filesRunned = new Set();

/**
 * Echa para procesar los elementos en lista.
 */
function preparingBundleFile (chunk, encoding, opts) {
  const {
        modules = [],
        debug = true,
        browserify: setConfigBrowserify = {}
    } = opts
  const pathfile = chunk.history[0]

    // Preparando configración de browserify
  const configBrowserfiy = Object.assign({}, setConfigBrowserify, {
    debug
  })

  logBundle(`Preparando bundle file`)

  return (cb) => {
    logBundle(`Iniciando bundle file`)

    let b = browserify(Object.assign({}, configBrowserfiy, {
      'entries': chunk,
      'basedir': path.dirname(pathfile),
      'transform': [
        [ babelify, {} ]
      ]
    }))

    for (let m of modules) {
      b = b.external(m)
    }

    b.bundle((err, bf) => {
      if (err) {
        cb(err)
      } else {
        logBundle(`Completado bundle file`)

        this.push(new Vinyl({
          cwd: chunk.cwd,
          base: chunk.base,
          path: pathfile,
          contents: bf
        }))

        cb()
      }
    })
  }
}

/**
 * Transform
 */
function bundlerTransform (opts = {}) {
  log('Transform')

  return through2.obj(function (chunk, encoding, cb) {
    if (!chunk.stat.isFile()) return cb()

    parallel([
      preparingRequerimentFile.apply(this, [chunk, encoding, opts]),
      preparingBundleFile.apply(this, [chunk, encoding, opts])
    ],
    function (err) {
      if (err) return cb(err)

      cb()
    })

    return null
  })
}
