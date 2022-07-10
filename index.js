const {join} = require('node:path')
const {getAbsoluteFSPath} = require('swagger-ui-dist')
const fs = require('node:fs')
const {initTypes} = require('./initTypes.js')


let InitScriptName = 'swagger-initializer.js'
const localFiles = ['index.html', 'swagger-initializer.js']
const swaggerFiles = fs.readdirSync(getAbsoluteFSPath()).filter(f => ![
  'index.html',
  'index.js',
  'package.json',
  'LICENSE',
  'NOTICE',
  'README.md',
  'swagger-initializer.js',
].includes(f))

const baseHtml = fs.readFileSync(join(getAbsoluteFSPath(), 'index.html'))
  .toString('utf8')
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

function isObj(d) {
  return (d === Object(d) && Object.prototype.toString.call(d) === '[object Object]')
}

function objson(d) {
  let r
  if (typeof d === 'string' || d instanceof String) try {r = JSON.parse(d)} catch (e) {r = {objson_error: e}}
  if (isObj(d)) try {r = JSON.stringify(d)} catch (e) {r = {objson_error: e}}
  return r ?? d
}

function genHtml(defaultHtml, userHtml, params) {
  params = {default: true, uri: '', ...params}
  if (!params?.default) return userHtml
  if (!params?.default && !Array.isArray(defaultHtml) && !defaultHtml?.length)
    throw new Error('genHtml: defaultHtml must not be an empty array')
  let html = [...defaultHtml]
  let head = userHtml?.head ?? userHtml?.header
  let body = userHtml?.body

  if (head) {
    if (typeof head === 'string' || head instanceof String) head = [head]
    else if (Array.isArray(head)) head = [...head]
    else if (isObj(head)) head = Object.values(head)
    else throw new Error('The head can be a string, an array, an object')

    let indx
    if ((indx = head.findIndex(v => v.includes('<title>'))) + 1) {
      html[html.findIndex(v => v.includes('<title>'))] = `\t${head.splice(indx, 1)[0]}`
    }

    if (head.some(v => v.includes('icon'))) {
      html = html.filter(v => !v.includes('icon'))
    }

    indx = html.findIndex(v => v.includes('</head>'))
    head.forEach(v => {
      html.splice(indx++, null, `\t${v}`)
    })
  }

  if (body) {
    if (typeof body === 'string' || body instanceof String) body = [body]
    else if (Array.isArray(body)) body = [...body]
    else if (isObj(body)) body = Object.values(body)
    else throw new Error('The body can be a string, an array, an object')

    let indx
    indx = html.findIndex(v => v.includes('</body>'))
    body.forEach(v => html.splice(indx++, null, `\t${v}`))
  }

  html = html.map(v => {
    v = v.replace(/href=["./]+(?!http)/, `href="${params.uri}`).replace(/href=['./]+(?!http)/, `href='${params.uri}`)
    v = v.replace(/src=["./]+(?!http)/, `src="${params.uri}`).replace(/src=['./]+(?!http)/, `src='${params.uri}`)
    return v
  })

  return html.reduce((a, v) => {
    return a + `${v} \n`
  }, '')
}

function genScript(defaultScript, userScript, params) {
  params = {default: true, join: true, ...params}

  let retObj = {}, defK, userK

  try {
    defK = Object.keys(defaultScript)
  } catch (e) {
    throw new Error(`defaultScript must be an object \n ${e}`)
  }

  try {
    userK = Object.keys(userScript)
  } catch (e) {
    throw new Error(`userScript must be an object \n ${e}`)
  }

  const keys = [...new Set([...defK, ...userK])]

  keys.forEach(k => {
    if (!k in initTypes) throw new Error('It is not possible to determine the field type')
    const t = initTypes[k]
    if (params.default && k in defaultScript && k in userScript) retObj[k] = _print(k, t, _merge(t,
      _normalize(k, t, defaultScript[k]), _normalize(k, t, userScript[k])))
    else if (params.default && k in defaultScript) retObj[k] = _print(k, t, _normalize(k, t, defaultScript[k]))
    else if (k in userScript) retObj[k] = _print(k, t, _normalize(k, t, userScript[k]))
  })

  function _printObj(k, t, d) {
    const r = Object.entries(d).reduce((a, [k, v]) => {
      return a + `\t\t\t"${k}": ${_print(k, t.itemsType[k], _normalize(k, t.itemsType[k], v))}, \n`
    }, '')
    return `{\n${r}\t\t}`
  }

  function _printArr(t, d) {
    return t.itemsType == 'string' ? `[${d.reduce((a, v) => a + `"${v}",`, '')}]` : `[${d.toString()}]`
  }

  function _print(k, t, d) {
    switch (t.type) {
      case 'string':   return `"${d}"`
      case 'number':   return d
      case 'boolean':  return d
      case 'function': return d.toString()
      case 'array':    return _printArr(t, d)
      case 'object':   return _printObj(k, t, d)
      case 'json':     return d
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
      case 'json':     return params.join ? objson({...objson(d), ...objson(u)}) : u
    }
  }

  function _normalize(k, t, d) {
    if (typeof d == 'string' || d instanceof String) {
      switch (t.type) {
        case 'string':   return d
        case 'number':   return parseInt(d, 10)
        case 'boolean':  return !(d == 'false' || d == '0')
        case 'array':    return [d]
        case 'object':   return objson(d)
        case 'json':     return d
        default: throw new Error(`${k} must be an ${t.type}`)
      }

    } else if (d === null || d === undefined) {
      console.error(`! ${k} must be an ${t.type}, now ${d} !`)
      switch (t.type) {
        case 'string':   return ''
        case 'number':   return 0
        case 'boolean':  return false
        case 'array':    return []
        case 'object':   return {}
        case 'json':     return '{}'
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
        case 'string':   return d[0]
        case 'number':   return d[0]
        case 'boolean':  return d[0]
        case 'array':    return d
        case 'object':   return d[0]
        case 'json':     return isObj(d[0]) ? objson(d[0]) : d[0]
        default: throw new Error(`${k} must be an ${t.type}`)
      }

    } else if (isObj(d)) {
      switch (t.type) {
        case 'array':    return [d]
        case 'object':   return d
        case 'json':     return objson(d)
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

function urlParser(url) {
  const [u, q] = url.split('?')
  let r; const urn = (r = u.split('/').filter(Boolean).map(v => decodeURIComponent(v))).length > 0 ? r : null
  if (!q) return {urn, query: null}
  else return {urn, query: Object.fromEntries(decodeURIComponent(q).split('&').filter(Boolean).map(v => v.split('=')))}
}

/**
 * gasket between swagger and express.
 *
 * @param {object} script - [swagger-ui configuration]{@link https://github.com/swagger-api/swagger-ui/blob/master/docs/usage/configuration.md}, there are exceptions
 * @param {{head?: string | array | object, body?: string | array | object}=} html - start page
 * @param {{script?: {default: boolean, join: boolean}, html?: {default: boolean}, queryConfig?: boolean, type?: object}=} params - page and script creation settings
 * @see [module documentation]{@link https://github.com/angrocode/swagger-express-next}
 */
function swagger(script, html, params) {
  if (Object.keys(script).filter(k => ['script', 'html', 'params'].includes(k)).length > 0)
    params = script?.params ?? params, html = script?.html ?? html, script = script?.script

  if (isObj(params?.type)) Object.entries(params.type).forEach(([k, v]) => {
    if (isObj(v)) initTypes[k] = v
    else if (v === 'array') initTypes[k] = {type: 'array', itemsType: 'string'}
    else initTypes[k] = {type: v}
  })

  let queryMod, uri
  function _routsVariable(key) {
    switch (key) {
      case 'index.html':
        return genHtml(baseHtml, html, {uri, ...params?.html})
      case InitScriptName:
        return genScript(baseScript, {...script, ...queryMod}, params?.script)
      default: return null
    }
  }

  function router(url) {
    const {urn, query} = urlParser(url)
    const rout = urn && urn.at(-1).includes('.') ? urn.at(-1) : 'index.html'
    if (!swaggerFiles.includes(rout) && !localFiles.includes(rout)) return {type: 'text/plain', buffer: null}
    if (rout == 'index.html') queryMod = query, uri = `/${urn.join('/')}/`
    let t; const type = (t = mimeTypes[rout.match(/[^.]+$/)]) ? t : 'text/plain'
    const buffer = swaggerFiles.includes(rout) ? loadSwagger(rout) : loadVariable(_routsVariable(rout))
    return {type, buffer: buffer ?? null}
  }

  return (req, res) => {
    const data = router(req?.originalUrl ?? req.url)

    const headers = {
      'Surrogate-Control': 'no-store',
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Content-Type': data.type,
    }

    res.writeHead(data.buffer ? 200 : 404, headers).end(data.buffer)
  }
}

// bind https://github.com/scottie1984/swagger-ui-express/blob/master/index.js

let swgMiddleware

function setup(swaggerDoc, opts, options, customCss, customfavIcon, swaggerUrl, customSiteTitle) {
  swgMiddleware = swagger(generateParams(swaggerDoc, opts, options, customCss, customfavIcon, swaggerUrl, customSiteTitle))
  return swgMiddleware
}

function serve(req, res) {
  swgMiddleware(req, res)
}

function serveFiles(swaggerDoc, opts) {
  return swagger(generateParams(swaggerDoc, opts))
}

function serveWithOptions(...args) {return (req, res, next) => next()}
function generateHTML(...args) {return ''}

function generateParams(swaggerDoc, opts, options, customCss, customfavIcon, swaggerUrl, customSiteTitle) {
  const script = {}
  const head   = []
  const body   = []

  const swgOptions   = isObj(opts?.swaggerOptions) ? opts.swaggerOptions : {}
  options            = isObj(options) ? options : {}
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
  if (swaggerDoc)      script['spec']   = isObj(swaggerDoc) ? objson(swaggerDoc) : swaggerDoc

  if (customfavIcon)   head.push(`<link rel="icon" href="${customfavIcon}" />`)
  if (customSiteTitle) head.push(`<title>${customSiteTitle}</title>`)
  if (customCssUrl)    head.push(`<link href="${customCssUrl}" rel="stylesheet">`)
  if (customCss)       head.push(`<style>${customCss}</style>`)
  if (customJs)        body.push(`<script src="${customJs}"></script>`)
  if (customJsStr)     body.push(`<script>${customJsStr}</script>`)

  return {script: {...script, ...swgOptions, ...options}, html: {head, body}}
}

function moduleReplace() {
  const om = 'swagger-ui-express'
  const nm = 'swagger-express-next'

  if (fs.existsSync(join(__dirname, '../', om))) {
    const pj = fs.readFileSync(join(__dirname, '../', om, 'package.json')).toString('utf8')
    if (JSON.parse(pj).name != nm) {
      fs.renameSync(join(__dirname, '../', om), join(__dirname, '../', `${om}_original`))
      fs.mkdirSync(join(__dirname, '../', om))
      fs.readdirSync(join(__dirname)).forEach(f => {
        fs.copyFileSync(join(__dirname, f), join(__dirname, '../', om, f))
      })
    }
  } else {
    fs.mkdirSync(join(__dirname, '../', om))
    fs.readdirSync(join(__dirname)).forEach(f => {
      fs.copyFileSync(join(__dirname, f), join(__dirname, '../', om, f))
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
