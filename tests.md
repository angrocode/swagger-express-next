
#### test 1
```js
require('swagger-express-next').moduleReplace()
const express = require('express')
const app = express()
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = '{"openapi": "3.0.0","info": {"title": "test","version": "1.0"}}'

app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.listen(3000)
```
#### test 2
```js
require('swagger-express-next').moduleReplace()
const express = require('express')
const app = express()
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = '{"openapi": "3.0.0","info": {"title": "test","version": "1.0"}}'

app.use('/api', swaggerUi.serve)
app.get('/api', swaggerUi.setup(
  swaggerDocument,
  null,
  {layout:'StandaloneLayout'},
  '.swagger-ui .topbar { background-color: red }')
)

app.listen(3000)
```
#### test 3
```js
require('swagger-express-next').moduleReplace()
const express = require('express')
const app = express()
const router = express.Router()
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = '{"openapi": "3.0.0","info": {"title": "test","version": "1.0"}}'

router.use('/api', swaggerUi.serve)
router.get('/api', swaggerUi.setup(swaggerDocument))
app.use('/birds', router)

app.listen(3000)
```
#### test 4
```js
require('swagger-express-next').moduleReplace()
const express = require('express')
const app = express()
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = '{"openapi": "3.0.0","info": {"title": "test","version": "1.0"}}'

const options = {
  validatorUrl : null,
  url: 'https://petstore.swagger.io/v2/swagger.json',
  layout:'StandaloneLayout',
  initOAuth: {
    clientId: "test", // and user
    clientSecret: "abc123", // and user
    realm: "realms1",
    appName: "swagger-express-next",
    scopeSeparator: ",",
    "scopes": "read:pets, write:pets",
    additionalQueryStringParams: {}
  }
}

app.use('/api', swaggerUi.serve)
app.get('/api', swaggerUi.setup(false, false, options, '.swagger-ui .topbar { background-color: red }'))

app.listen(3000)
```
#### test 5
```js
require('swagger-express-next').moduleReplace()
const express = require('express')
const app = express()
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = '{"openapi": "3.0.0","info": {"title": "test","version": "1.0"}}'

const swaggerUiOpts2 = {
  explorer: false,
  swaggerOptions: {},
  customCss: '.swagger-ui .topbar { background-color: pink }',
  swaggerUrl: 'https://petstore.swagger.io/v2/swagger.json',
  customJs: 'my-custom.js',
  operationsSorter: 'alpha',
  customCssUrl: 'https://cdn.jsdelivr.net/npm/swagger-ui-themes@3.0.0/themes/3.x/theme-feeling-blue.css'
}

app.use('/api', swaggerUi.serve)
app.get('/api', swaggerUi.setup(null, swaggerUiOpts2))

app.listen(3000)
```
#### test 6
```js
require('swagger-express-next').moduleReplace()
const express = require('express')
const app = express()
const swaggerUi = require('swagger-ui-express')

const swaggerUiOpts = {
  explorer: true,
  swaggerOptions: {
    plugins: 'authorizeIcons',
  },
  swaggerUrl: 'https://petstore.swagger.io/v2/swagger.json',
  customJs: 'https://cdn.jsdelivr.net/gh/angrocode/swagger-plugin-authorizeIcons/index.js',
  customCssUrl: 'https://cdn.jsdelivr.net/npm/swagger-ui-themes@3.0.0/themes/3.x/theme-flattop.css'
}

app.use('/api', swaggerUi.serve)
app.get('/api', swaggerUi.setup(null, swaggerUiOpts))

app.listen(3000)
```
#### test 7
```js
const swagger = require('swagger-express-next').swagger
const express = require('express')
const app = express()

const swgSettings = {
  html: {
    header: [
      '<title>Theme & Plugin</title>',
      '<link href="https://cdn.jsdelivr.net/npm/swagger-ui-themes@3.0.0/themes/3.x/theme-flattop.css" rel="stylesheet">',
    ],
    body: '<script src="https://cdn.jsdelivr.net/gh/angrocode/swagger-plugin-authorizeIcons/index.js"></script>'
  },
  script: {
    url: 'https://petstore.swagger.io/v2/swagger.json',
    layout:'StandaloneLayout',
    plugins: 'authorizeIcons',
  }
}

// app.use('/api', swagger(swgSettings.script, swgSettings.html))
// OR
// app.use('/api', swagger(swgSettings))

app.listen(3000)
```

#### test 8
```js
const swagger = require('swagger-express-next').swagger
const express = require('express')
const app = express()

const swgSettings = {
  html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Title</title>
    </head>
    <body>
        <div id="load">Loading...</div>
        
        <script>
          window.onload = function() {
            document.getElementById('load').innerHTML = new Date()
          }
        </script>
    </body>
    </html>
  `,
  params: {
    html:   {default: false},
  }
}

app.use('/api', swagger(swgSettings))

app.listen(3000)
```

#### test 9
```js
const swagger = require('swagger-express-next').swagger
const express = require('express')
const app = express()

const swgSettings = {
  html: {
    header: '<title>Swagger Snippets</title>',
  },
  script: {
    layout:'StandaloneLayout',
    url: 'https://petstore.swagger.io/v2/swagger.json',
    requestSnippetsEnabled: true,
    requestSnippets: {
      generators: {
        curl_bash: {
          title: "cURL (bash)",
          syntax: "bash"
        },
        curl_powershell: {
          title: "cURL (PowerShell)",
          syntax: "powershell"
        },
        curl_cmd: {
          title: "cURL (CMD)",
          syntax: "bash"
        },
      },
      defaultExpanded: true,
      languages: ['curl_bash', 'curl_powershell', 'curl_cmd'],
    }
  },
}

app.use('/api', swagger(swgSettings))

app.listen(3000)
```

#### test 99 Old & New Options (internal test)
```js
require('swagger-express-next').moduleReplace()
const express = require('express')
const app = express()
const router = express.Router()
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = {openapi: "3.0.0", info: {title: "test", version: "1.0"}}

const oldOptions = {
  explorer: false,
  swaggerOptions: {},
  customCss: '.swagger-ui .topbar { background-color: pink }',
  swaggerUrl: 'https://petstore.swagger.io/v2/swagger.json',
  customJs: 'my-custom.js',
  operationsSorter: 'alpha',
  customCssUrl: 'https://cdn.jsdelivr.net/npm/swagger-ui-themes@3.0.0/themes/3.x/theme-feeling-blue.css'
}

const newOptions = {
  html: {
    header: [
      '<title>Old & New Options</title>',
      '<link rel="icon" type="image/x-icon" href="favicon-1.test" /> ',
      '<link href="https://cdn.jsdelivr.net/npm/swagger-ui-themes@3.0.0/themes/3.x/theme-flattop.css" rel="stylesheet">',
    ],
    body: '<script src="https://cdn.jsdelivr.net/gh/angrocode/swagger-plugin-authorizeIcons/index.js"></script>'
  },
  script: {
    url: 'https://petstore.swagger.io/v2/swagger.json',
    layout:'StandaloneLayout',
    plugins: 'authorizeIcons',
  }
}

app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerDocument, oldOptions, newOptions))

app.listen(3000)

```
