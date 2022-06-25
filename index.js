const fs = require('node:fs')
const join = require('node:path').join
const initTypes = require('./initTypes.js')
const getAbsoluteFSPath = require('swagger-ui-dist/absolute-path.js')


function isObj(d) {
  return (d === Object(d) && Object.prototype.toString.call(d) === '[object Object]')
}

const baseHtml = fs.readFileSync(join(getAbsoluteFSPath(), 'index.html'))
  .toString('utf8')
  .replaceAll('./', '')
  .split('\n')

const baseScript = JSON.parse(`{
  "dom_id": "#swagger-ui",
  "deepLinking": "true",
  "queryConfigEnabled": "false",
  "presets": [
    "SwaggerUIBundle.presets.apis",
    "SwaggerUIStandalonePreset"
  ],
  "plugins": [
    "SwaggerUIBundle.plugins.DownloadUrl"
  ]
}`)

function genHtml(defaultHtml, userHtml, params) {
  params = {default: true, ...params}
  defaultHtml = params?.default ? defaultHtml ?? [] : []
  const {header, body} = userHtml ?? {}

  if (header && params?.default) _merge(header, defaultHtml.findIndex(s => String(s).includes('</head>')))
  else _merge(header, 0)

  if (body && params?.default)   _merge(body, defaultHtml.findIndex(s => String(s).includes('</body>')))
  else defaultHtml.push('', ''); _merge(header, defaultHtml.length)

  function _merge(u, indx) {
    if (typeof u === 'string' || u instanceof String) {
      if (u.includes('<title>')) defaultHtml[defaultHtml.findIndex(s => String(s).includes('<title>'))] = `\t${u}`
      else if (u.includes('icon')) defaultHtml.forEach((s, i) => s.includes('icon') ? defaultHtml.splice(i, 1, `\t${u}`) : null)
      else defaultHtml.splice(indx, null, `\t${u}`)

    } else if (Array.isArray(u)) {
      u.forEach((v, i) => {
        if (v.includes('<title>')) defaultHtml[defaultHtml.findIndex(s => String(s).includes('<title>'))] = `\t${v}`
        else if (v.includes('icon')) defaultHtml.forEach((s, i) => s.includes('icon') ? defaultHtml.splice(i, 1, `\t${v}`) : null)
        else defaultHtml.splice(indx + i, null, `\t${v}`)
      })

    } else if (isObj(u)) {
      Object.values(u).forEach((v, i) => {
        if (v.includes('<title>')) defaultHtml[defaultHtml.findIndex(s => String(s).includes('<title>'))] = `\t${v}`
        else if (v.includes('icon')) defaultHtml.forEach((s, i) => s.includes('icon') ? defaultHtml.splice(i, 1, `\t${v}`) : null)
        else defaultHtml.splice(indx + i, null, `\t${v}`)
      })
    } else {
      throw new Error(`incorrect html data format`)
    }
  }

  return defaultHtml.reduce((a, v) => {
    return a + `${v} \n`
  }, '')
}

function genScript(defaultObj, userObj, params) {
  defaultObj = defaultObj ?? {}
  userObj = userObj ?? {}
  params = {default: true, join: true, ...params}

  let retObj = {}, defK = [], userK = []

  try {
    defK = Object.keys(defaultObj)
  } catch (e) {
    throw new Error(`defaultObj must be an object \n ${e}`)
  }

  try {
    userK = Object.keys(userObj)
  } catch (e) {
    throw new Error(`userObj must be an object \n ${e}`)
  }

  const keys = [...new Set([...defK, ...userK])]

  keys.forEach(k => {
    const t = initTypes[k] ?? initTypes['*']
    if (params.default && k in defaultObj && k in userObj) retObj[k] = _print(t, _merge(t, _normalize(t, k, defaultObj[k]), _normalize(t, k, userObj[k])))
    else if (params.default && k in defaultObj) retObj[k] = _print(t, _normalize(t, k, defaultObj[k]))
    else if (k in userObj) retObj[k] = _print(t, _normalize(t, k, userObj[k]))
  })

  function _print(t, d) {
    switch (t.type) {
      case 'string':   return `"${d}"`
      case 'number':   return d
      case 'boolean':  return d
      case 'function': return d.toString()
      case 'array':    return t.itemsType == 'string' ? `[${d.reduce((a, v) => a + `"${v}",`, '')}]` : `[${d.toString()}]`
      case 'object':   return ((d) => {let r; try {r = JSON.stringify(d)} catch (e) {r = {error: e}} return r})(d)
    }
  }

  function _merge(t, d, u) {
    switch (t.type) {
      case 'string':   return u
      case 'number':   return u
      case 'boolean':  return u
      case 'function': return u
      case 'array':    return params.join ? [...new Set([...d, ...u])] : u
      case 'object':   return params.join ? {...d, ...u} : u
    }
  }

  function _normalize(t, k, d) {
    if (typeof d == 'string' || d instanceof String) {
      switch (t.type) {
        case 'string':   return d
        case 'number':   return parseInt(d, 10)
        case 'boolean':  return !(d == 'false' || d == '0')
        case 'array':    return [d]
        case 'object':   return ((d) => {let r; try {r = JSON.parse(d)} catch (e) {r = {error: e}} return r})(d)
        default: throw new Error(`${k} must be an ${t.type}`)
      }

    } else if (typeof d == 'boolean' || d instanceof Boolean) {
      switch (t.type) {
        case 'string':   return String(d)
        case 'boolean':  return d
        case 'array':    return [d]
        default: throw new Error(`${k} must be an ${t.type}`)
      }

    } else if (typeof d == 'number' || d instanceof Number) {
      switch (t.type) {
        case 'string':   return String(d)
        case 'number':   return d
        case 'boolean':  return !(d == 0)
        case 'array':    return [d]
        default: throw new Error(`${k} must be an ${t.type}`)
      }

    } else if (Array.isArray(d)) {
      switch (t.type) {
        case 'array':    return d
        default: throw new Error(`${k} must be an ${t.type}`)
      }

    } else if (isObj(d)) {
      switch (t.type) {
        case 'array':    return [d]
        case 'object':   return d
        default: throw new Error(`${k} must be an ${t.type}`)
      }

    } else if (typeof d == 'function') {
      switch (t.type) {
        case 'function': return d
        case 'array':    return [d]
        default: throw new Error(`${k} must be an ${t.type}`)
      }
    }
  }

  return '' +
    `window.onload = function() {
    window.ui = SwaggerUIBundle({\n`
    + Object.entries(retObj).reduce((a, [k, v]) => a + `\t\t"${k}": ${v}, \n`, '')
    +'\t})\n}'
}

function loadSwagger(fileName) {
  let buffer
  try {
    buffer = fs.readFileSync(join(getAbsoluteFSPath(), fileName))
  } catch (e) {}
  return buffer ?? null
}

function loadVariable(variable) {
  let buffer
  try {
    buffer = Buffer.from(variable)
  } catch (e) {}
  return buffer ?? null
}

const mimeTypes = {
  css: 'text/css',
  png: 'image/png',
  html: 'text/html',
  ico: 'image/x-icon',
  js: 'application/json',
}

function swagger(script, html, params) {
  let scrMod

  function scriptMod(mod) {
    if (isObj(mod)) scrMod = mod
    else scrMod = {}
  }

  const routsLoader = {
    '*': loadSwagger,
    'null': loadVariable,
    'swagger-initializer.js': loadVariable,
  }

  function _routsVariable(key) {
    switch (key) {
      case null:
        return genHtml(baseHtml, html, params?.html)
      case 'swagger-initializer.js':
        return genScript(baseScript, {...script, ...(params?.queryConfig ? scrMod : {})}, params?.script)
      default: return null
    }
  }

  function router(fileName) {
    let t, b
    const type = fileName ? (t = mimeTypes[fileName.match(/[^.]+$/)]) ? t : 'text/plain' : 'text/html'
    const loader = fileName in routsLoader ? routsLoader[fileName] : routsLoader['*']
    const buffer = (b = loader(_routsVariable(fileName))) ? b : loader(fileName)
    return {type, buffer: buffer ?? null}
  }

  return (req, res, next) => {
    let f; const fileName = (f = req.url.match(/^\/(.*?)([/?]|$)/)[1]) != '' ? f : null

    if (!fileName) scriptMod(['GET'].includes(req.method) ? req.query ?? {} : req.body ?? {})

    const data = router(fileName)

    res.setHeader('Surrogate-Control', 'no-store')
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    res.setHeader('Pragma', 'no-cache')
    res.setHeader('Expires', '0')

    res.status(data.buffer ? 200 : 404).contentType(data.type).send(data.buffer)
  }
}

// bind https://github.com/scottie1984/swagger-ui-express/blob/master/index.js

function setup(swaggerDoc, opts, options, customCss, customfavIcon, swaggerUrl, customSiteTitle) {
  const {script, html} = generateParams(swaggerDoc, opts, options, customCss, customfavIcon, swaggerUrl, customSiteTitle)
  return swagger(script, html)
}

function serveFiles(swaggerDoc, opts) {
  const {script, html} = generateParams(swaggerDoc, opts)
  return swagger(script, html)
}

function serve(...args) {return (req, res, next) => {next()}}
function serveWithOptions(...args) {return (req, res, next) => {next()}}
function generateHTML(...args) {return ''}

function generateParams(swaggerDoc, opts, options, customCss, customfavIcon, swaggerUrl, customSiteTitle) {
  const script = {}
  const header = []
  const body   = []

  options            = opts?.swaggerOptions ?? options
  customCss          = opts?.customCss ?? customCss
  const customJs     = opts?.customJs
  const customJsStr  = opts?.customJsStr
  customfavIcon      = opts?.customfavIcon ?? customfavIcon
  swaggerUrl         = opts?.swaggerUrl ?? swaggerUrl
  const swaggerUrls  = opts?.swaggerUrls
  const isExplorer   = opts?.explorer || !!swaggerUrls
  customSiteTitle    = opts?.customSiteTitle ?? customSiteTitle
  const customCssUrl = opts?.customCssUrl

  if (swaggerUrl)      script['url']    = swaggerUrl
  if (swaggerUrls)     script['urls']   = swaggerUrls
  if (isExplorer)      script['layout'] = 'StandaloneLayout'
  if (swaggerDoc)      script['spec']   = isObj(swaggerDoc) ? ((d) => {let r; try {r = JSON.stringify(d)} catch (e) {r = {error: e}} return r})(swaggerDoc) : swaggerDoc

  if (customCss)       header.push(`<style>${customCss}</style>`)
  if (customfavIcon)   header.push(`<link rel="icon" href="${customfavIcon}" />`)
  if (customSiteTitle) header.push(`<title>${customSiteTitle}</title>`)
  if (customCssUrl)    header.push(`<link href="${customCssUrl}" rel="stylesheet">`)
  if (customJs)        body.push  (`<script src="${customJs}"></script>`)
  if (customJsStr)     body.push  (`<script>${customJsStr}</script>`)

  return {script: {...script, ...(isObj(options) ? options : {})}, html: {header, body}}
}

function moduleReplace() {
  const om = 'swagger-ui-express'
  const nm = 'swagger-express-next'

  if (!fs.existsSync(join(__dirname, `${om}_original`))) {
    if (fs.existsSync(join(__dirname, om))) fs.renameSync(join(__dirname, om), join(__dirname, `${om}_original`))
    fs.mkdirSync(join(__dirname, om))
    fs.readdirSync(join(__dirname, nm)).forEach(f => {
      fs.copyFileSync(join(__dirname, nm, f), join(__dirname, om, f))
    })
  }
}

module.exports = {
  swagger: swagger,
  moduleReplace: moduleReplace,
  setup: setup,
  serve: serve,
  serveWithOptions: serveWithOptions,
  generateHTML: generateHTML,
  serveFiles: serveFiles,
}
