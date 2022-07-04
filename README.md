<div align="center"><h2>swagger express next</h2></div>

<div align="right">

[![ver badge](https://badgen.net/npm/v/swagger-express-next)](https://www.npmjs.com/package/swagger-express-next) 
[![down badge](https://badgen.net/npm/dm/swagger-express-next)](https://www.npmjs.com/package/swagger-express-next)

</div>

#### Описание
Модуль реализует использование пакета [swagger-ui](https://github.com/swagger-api/swagger-ui)
в виде промежуточного программного обеспечения [express](https://github.com/expressjs/express).
Простое решение с неограниченными возможностями модификации загрузочной страницы
и поддержкой всех настроек скрипта инициализации.
Совместим с апи [swagger-ui-express](https://github.com/scottie1984/swagger-ui-express).

#### Использование

###### Прямое
```js
const swagger = require('swagger-express-next').swagger
const express = require('express')
const app = express()
const swaggerDocument = '{"openapi": "3.0.0","info": {"title": "test","version": "1.0"}}'

app.use('/api', swagger({spec: swaggerDocument}, {header: '<title>Swagger Test</title>'}))

app.listen(3000)
```

###### В качестве замены для swagger-ui-express
```js
+ require('swagger-express-next').moduleReplace()
const express = require('express')
const app = express()
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = '{"openapi": "3.0.0","info": {"title": "test","version": "1.0"}}'

app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.listen(3000)
```
Больше примеров [смотрите в тестах](https://github.com/angrocode/swagger-express-next/blob/main/tests.md).

#### Установка
```
npm i swagger-express-next
```

#### Параметры

###### Общий пример
```js
const swagger = require('swagger-express-next').swagger
const express = require('express')
const app = express()

const settings = {
  html: {header: '<title>Swagger Test</title>'},
  script: {
    layout:'StandaloneLayout',
    url: 'https://petstore.swagger.io/v2/swagger.json',
  },
  params: {
    script: {default: true, join: true},
    html:   {default: true},
    queryConfig: false,
    type:   {newParam1: {type: 'array', itemsType: 'string'}, newParam2: 'boolean'},
  }
}

app.use('/api', swagger(settings))
// OR
// app.use('/api', swagger(settings.script, settings.html, settings.params))

app.listen(3000)
```

**swagger(script, html, params)**

script **object** \
Смотрите [swagger-ui configuration](https://github.com/swagger-api/swagger-ui/blob/master/docs/usage/configuration.md) \
Исключения: \
syntaxHighlight: только **object**\
initOAuth: только **object**\
requestSnippets.languages **array[string]**

Типы значений могут отличаться от указанных в документации, так array можно передать в виде строки, если добавляется одно значение, bool в виде строки и т.д. Если скрипт не сможет привести переданные значения к установленным типам будет выдано исключение.
Объекты и json преобразуются с помощью JSON.stringify и JSON.parse соответственно, в случаи ошибки исключения не выдаются, описание ошибки можно найти в браузере в виде объекта {objson_error: e} на том ключе которому был передан объект или json.

html **object**
* header: **string or array or object(values)** html теги, добавляются перед `</head>`
* body: **string or array or object(values)** html теги, добавляются перед `</body>`

params **object**
* script: **object** по умолчанию ***{default: true, join: true}***
  * default: **boolean** \
  Использовать параметры предложенные разработчиками swagger-ui при генерации скрипта,
  будут дополнены / изменены значениями из параметра script.
  * join: **boolean**
    * true параметры типа массив дополняются пользовательскими значениями.
    * false заменяет массив значений предложенных разработчиками на пользовательский.
* html: **object** по умолчанию ***{default: true}***
  * default: **boolean** \
    Использовать параметры предложенные разработчиками swagger-ui при генерации страницы загрузки,
    будут дополнены / изменены значениями из параметра html.
* queryConfig **boolean** \
  Разрешает передачу параметров в запросе, методом GET и POST
* type: **object** \
  Позволяет передать пользовательские типы для ключей скрипта инициализации.\
  Типы могут быть объявлены как объект или строка и соответствовать используемым в [стандартных типах](https://github.com/angrocode/swagger-express-next/blob/main/initTypes.js). \
  Тип массив всегда должен указываться в виде объекта {type: 'array', itemsType: 'string'} или {type: 'array', itemsType: 'function'}.
  
#### Совместимость
Тестирование произведено на: \
[NestJS 8.4.7](https://nestjs.com/) \
Примеры из тестов [swagger-ui-express](https://github.com/scottie1984/swagger-ui-express/blob/master/test/testapp/app.js)

Для подмены пакета swagger-ui-express используется функция moduleReplace. \
Функцию нужно вызвать до импорта swagger-ui-express.
```js
require('swagger-express-next').moduleReplace()
const swaggerUi = require('swagger-ui-express')
```

Если пакет swagger-ui-express обнаружен в node_modules его директория будет переименована в swagger-ui-express_original.
В новую директорию swagger-ui-express копируются файлы из swagger-express-next.

