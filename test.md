
```js
require('swagger-express-next').moduleReplace()
const express = require('express');
const app = express();
const router = express.Router();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = '{"openapi": "3.0.0","info": {"title": "test","version": "1.0"}}';

router.use('/api', swaggerUi.serve);
router.get('/api', swaggerUi.setup(swaggerDocument));
app.use('/birds', router)

app.listen(3000)
```

```js
require('swagger-express-next').moduleReplace()
const express = require('express');
const app = express();
const router = express.Router();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = '{"openapi": "3.0.0","info": {"title": "test","version": "1.0"}}';

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

```

```js

```

```js

```
