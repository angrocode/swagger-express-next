const initTypes = Object.freeze({
  configUrl: {type: 'string'},
  dom_id: {type: 'string'},
  domNode: {type: 'string'},
  spec: {type: 'object'},
  url: {type: 'string'},
  urls: {type: 'array', itemsType: 'string'},
  'urls.primaryName': {type: 'string'},
  queryConfigEnabled: {type: 'boolean'},
  layout: {type: 'string'},
  pluginsOptions: {type: 'object'},
  plugins: {type: 'array', itemsType: 'function'},
  presets: {type: 'array', itemsType: 'function'},
  pluginLoadType: {type: 'array', itemsType: 'string'},
  deepLinking: {type: 'boolean'},
  displayOperationId: {type: 'boolean'},
  defaultModelsExpandDepth: {type: 'number'},
  defaultModelExpandDepth: {type: 'number'},
  defaultModelRendering: {type: 'string'},
  displayRequestDuration: {type: 'boolean'},
  docExpansion: {type: 'string'},
  filter: {type: 'string'},
  maxDisplayedTags: {type: 'number'},
  operationsSorter: {type: 'function'},
  showExtensions: {type: 'boolean'},
  showCommonExtensions: {type: 'boolean'},
  tagsSorter: {type: 'function'},
  useUnsafeMarkdown: {type: 'boolean'},
  onComplete: {type: 'function'},
  // syntaxHighlight Boolean/object
  // syntaxHighlight.activate Boolean=true
  // syntaxHighlight.theme Array String=["agate"*, "arta", "monokai", "nord", "obsidian", "tomorrow-night"]
  tryItOutEnabled: {type: 'boolean'},
  requestSnippetsEnabled: {type: 'boolean'},
  requestSnippets: {type: 'object'},
  oauth2RedirectUrl: {type: 'string'},
  requestInterceptor: {type: 'function'},
  'request.curlOptions': {type: 'array', itemsType: 'string'},
  responseInterceptor: {type: 'function'},
  showMutatedRequest: {type: 'boolean'},
  supportedSubmitMethods: {type: 'array', itemsType: 'string'},
  validatorUrl: {type: 'string'},
  withCredentials: {type: 'boolean'},
  modelPropertyMacro: {type: 'function'},
  parameterMacro: {type: 'function'},
  persistAuthorization: {type: 'boolean'},
  initOAuth: {type: 'object'}, // FIXME: уточнить тип
  preauthorizeBasic: {type: 'function'}, // FIXME: уточнить тип
  preauthorizeApiKey: {type: 'function'}, // FIXME: уточнить тип
  '*': {type: 'string'},
})

module.exports = initTypes
