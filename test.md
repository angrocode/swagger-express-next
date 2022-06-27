
```js
require('swagger-express-next').moduleReplace()
const express = require('express')
const app = express()
const router = express.Router()
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = '{"openapi": "3.0.0","info": {"title": "test","version": "1.0"}}'

app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.listen(3000)
```

```js
require('swagger-express-next').moduleReplace()
const express = require('express')
const app = express()
const router = express.Router()
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

```js
require('swagger-express-next').moduleReplace()
const express = require('express')
const app = express()
const router = express.Router()
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

```js
require('swagger-express-next').moduleReplace()
const express = require('express')
const app = express()
const router = express.Router()
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = '{"openapi": "3.0.0","info": {"title": "test","version": "1.0"}}'

var swaggerUiOpts2 = {
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

```js
require('swagger-express-next').moduleReplace()
const express = require('express')
const app = express()
const router = express.Router()
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = '{"openapi": "3.0.0","info": {"title": "test","version": "1.0"}}'

var swaggerUiOpts = {
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

```js

```
