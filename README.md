<div align="center"><h2>swagger express next</h2></div>

<div align="right">

[![ver badge](https://badgen.net/npm/v/swagger-express-next)](https://www.npmjs.com/package/swagger-express-next) 
[![down badge](https://badgen.net/npm/dm/swagger-express-next)](https://www.npmjs.com/package/swagger-express-next)

</div>

#### Мотивация
Более полное управление параметрами, возможность добавлять плагины в swagger, скрипты с типами и тэгами, произвольное количество модификаций html кода. \
Всё началось с того что я решил написать [плагин для swagger](https://github.com/angrocode/swagger-plugin-authorizeIcons) изменяющий поведение [иконок авторизации]((https://github.com/swagger-api/swagger-ui/issues/4402)), 
но подключить его через модуль swagger-ui-express не удалось, поэтому появилась эта реализация.

#### Задачи
1. Тестирование OAuth.
2. Определение имени файла содержащего скрипт инициализации, получение параметров инициализации предлагаемых разработчиками [swagger-ui](https://github.com/swagger-api/swagger-ui).

#### Совместимость
Тестирование произведено на: \
[NestJS 8.4.7](https://nestjs.com/) \
Примеры из тестов [swagger-ui-express](https://github.com/scottie1984/swagger-ui-express/blob/master/test/testapp/app.js)

Стратегия совместимости до конца не определена, нужно больше примеров, [работающие тесты](https://github.com/angrocode/swagger-express-next/blob/main/tests.md).

Для подмены пакета swagger-ui-express используется функция moduleReplace,
которая переименовывает директорию swagger-ui-express в swagger-ui-express_original
и заменяет её с помощью копирования на директорию swagger-ui-express с содержимым
этого модуля. Операция производиться в том node_modules куда установлен этот пакет.

#### Описание
Модуль может работать в двух режимах, оригинальном через вызов функции swagger и режиме совместимости с [swagger-ui-express](https://github.com/scottie1984/swagger-ui-express). \
В режиме совместимости все параметры приводятся к структуре параметров функции swagger.

Функция swagger принимает три параметра:
1. Структура скрипта инициализации в виде объекта.
2. Структура стартовой страницы в виде объекта или текста, если отключено использование базовой структуры страницы.
3. Настройки генерации скрипта, страницы и общие в виде объекта.

Все параметры могут быть переданны в первую позицию функции swagger в виде объекта, [пример](https://github.com/angrocode/swagger-express-next/blob/main/test.md#test-7).

Любые ключи и их значения скрипта инициализации могут быть переданы get или post запросом (но это не точно).

Объект настройки скрипта инициализации принимает ключи описанные в [этом документе](https://github.com/swagger-api/swagger-ui/blob/master/docs/usage/configuration.md), 
типы значений могут отличаться от указанных в документации, так array можно передать в виде string, если добавляется одно значение, bool в виде стринг и т.д.
Если скрипт не сможет привести переданные значения к установленным типам будет выдано исключение. \
Объекты и json преобразуются с помощью JSON.stringify и JSON.parse соответственно, 
в случаи ошибки исключения не выдаются, описание ошибки можно найти во фронте в виде объекта {error: e}
на том ключе которому был передан объекты или json.

Объект настройки стартовой страницы принимает два ключа (header, body). \
Значения ключей могут быть одного из типов: строка, массив, объект (используются значения)

Объект настройки генерации принимает четыре ключа (script, html, type, queryConfig). \
Объект script имеет два параметра {default: true, join: true}, \
default определяет будет использоваться конфигурация по умолчанию или нет. \
join определяет будут ключи конфигурации имеющие тип массивов дополняться пользовательскими
значениями или будут полностью переопределяться.

Объект html имеет одно значение {default: true}, \
default определяет будет загружена структура страницы по умолчанию или нет. \
Если использование базовой структуры страницы отключено, во фронт будет выдано содержание параметра html функции swagger без изменений.

Объект type позволяет передать пользовательские типы для ключей скрипта инициализации.\
Типы могут быть объявлены через object или string и соответствовать используемым в [стандартных типах](https://github.com/angrocode/swagger-express-next/blob/main/initTypes.js).
Тип array всегда должен указываться в виде объекта {type: 'array', itemsType: 'string'} или {type: 'array', itemsType: 'function'}.

queryConfig разрешает передачу параметров в запросе.

#### Примеры

[смотрите тесты](https://github.com/angrocode/swagger-express-next/blob/main/tests.md)

```js
const swagger = require('swagger-express-next').swagger
const express = require('express')
const app = express()

const swgSettings = {
  html: {header: '<title>Swagger Test</title>'},
  script: {
    layout:'StandaloneLayout',
    url: 'https://petstore.swagger.io/v2/swagger.json',
  },
  params: {
    script: {default: true, join: true},
    html:   {default: true},
    type:   {newParam1: {type: 'array', itemsType: 'string'}, newParam2: 'boolean'},
    queryConfig: true,
  }
}

app.use('/api', swagger(swgSettings))
// OR
// app.use('/api', swagger(swgSettings.script, swgSettings.html, swgSettings.params))

app.listen(3000)
```

```text
http://127.0.0.1:3000/api/?url=https://petstore.swagger.io/v2/swagger.json
http://127.0.0.1:3000/api/?spec={"openapi": "3.0.0","info": {"title": "test","version": "1.0"}}
```
