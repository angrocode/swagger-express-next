
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
const swagger = require('swagger-express-next').swagger
const express = require('express')
const app = express()

const swgSettings = {
  html: {
    head: '<title>Swagger OAuth Origin</title>',
  },
  script: {
    layout:'StandaloneLayout',
    url: 'https://petstore.swagger.io/v2/swagger.json',
    oauth2RedirectUrl: 'https://c783-178-70-90-138.ngrok.io/api/oauth2-redirect.html',
    initOAuth: {
      clientId: 'test',
      clientSecret: 'abc123',
      realm: 'realm1',
      appName: 'swagger-express-next',
      scopeSeparator: ',',
      scopes: 'read:pets, write:pets',
    },
  },
}

app.use('/api', swagger(swgSettings))

app.listen(3000)
```

#### test 5
```js
require('swagger-express-next').moduleReplace()
const express = require('express')
const app = express()
const swaggerUi = require('swagger-ui-express')

const options = {
  customSiteTitle: 'Swagger OAuth Compatibility',
  swaggerOptions: {
    layout:'StandaloneLayout',
    url: 'https://petstore.swagger.io/v2/swagger.json',
    oauth2RedirectUrl: 'https://21b9-178-70-90-138.ngrok.io/api/oauth2-redirect.html',
    initOAuth: {
      clientId: 'test',
      clientSecret: 'abc123',
      realm: 'realm1',
      appName: 'swagger-express-next',
      scopeSeparator: ',',
      scopes: 'read:pets, write:pets',
    },
  },
}

app.use('/api', swaggerUi.serve)
app.get('/api', swaggerUi.setup(null, options))

app.listen(3000)
```
#### test 6
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
#### test 7
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
#### test 8
```js
const swagger = require('swagger-express-next').swagger
const express = require('express')
const app = express()

const swgSettings = {
  html: {
    head: [
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

#### test 9
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

#### test 10
```js
const swagger = require('swagger-express-next').swagger
const express = require('express')
const app = express()

const swgSettings = {
  html: {
    head: '<title>Swagger Snippets</title>',
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

#### test 11 without express
```js
const {createServer} = require('node:http')
const {swagger} = require('swagger-express-next')
const swaggerDocument = {openapi: "3.0.0", info: {title: "test", version: 1.0}}

createServer((req, res) => {

  swagger({spec: swaggerDocument}, {head: '<title>Swagger Test</title>'})(req, res)

}).listen(3000, '127.0.0.1', e => {
  e ? console.log('HTTP server start error', e) : console.log('HTTP server running ...')
})
```

#### test 12 nestjs
```js
import { moduleReplace } from 'swagger-express-next'; moduleReplace()
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { DocumentBuilder, ExpressSwaggerCustomOptions, SwaggerModule } from '@nestjs/swagger'

const options: ExpressSwaggerCustomOptions = {
  explorer: false,
  swaggerOptions: {
    plugins: 'authorizeIcons',
  },
  customJs: 'https://cdn.jsdelivr.net/gh/angrocode/swagger-plugin-authorizeIcons/index.js',
  customCssUrl: 'https://cdn.jsdelivr.net/npm/swagger-ui-themes@3.0.0/themes/3.x/theme-flattop.css'
}

;(async function() {
  const app = await NestFactory.create(AppModule)

  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .addBasicAuth()
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document, options)

  await app.listen(3000)
})()

```
