
const pluginsOptions = {
  pluginLoadType: {type: 'string'},
}

const requestSnippets = {
  generators: {type: 'json'},
  defaultExpanded: {type: 'boolean'},
  languages: {type: 'array', itemsType: 'string'},
}

const syntaxHighlight = {
  activate: {type: 'boolean'},
  theme: {type: 'array', itemsType: 'string'},
}

const initOAuth = {
  clientId: {type: 'string'},
  clientSecret: {type: 'string'},
  realm: {type: 'string'},
  appName: {type: 'string'},
  scopeSeparator: {type: 'string'},
  scopes: {type: 'string'},
  additionalQueryStringParams: {type: 'string'},
  useBasicAuthenticationWithAccessCodeGrant: {type: 'boolean'},
  usePkceWithAuthorizationCodeGrant: {type: 'boolean'},
}

const initTypes = {
  configUrl: {type: 'string'},
  dom_id: {type: 'string'},
  domNode: {type: 'string'},
  spec: {type: 'json'},
  url: {type: 'string'},
  urls: {type: 'array', itemsType: 'string'},
  'urls.primaryName': {type: 'string'},
  queryConfigEnabled: {type: 'boolean'},
  layout: {type: 'string'},
  pluginsOptions: {type: 'object', itemsType: pluginsOptions},
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
  syntaxHighlight: {type: 'object', itemsType: syntaxHighlight},
  tryItOutEnabled: {type: 'boolean'},
  requestSnippetsEnabled: {type: 'boolean'},
  requestSnippets: {type: 'object', itemsType: requestSnippets},
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
  initOAuth: {type: 'object', itemsType: initOAuth},
  preauthorizeBasic: {type: 'function'},
  preauthorizeApiKey: {type: 'function'},
}

module.exports = {
  initTypes
}
