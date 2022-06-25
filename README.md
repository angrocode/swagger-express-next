<div align="center"><h2>swagger express next</h2></div>

#### Мотивация
Более полное управление параметрами, возможность добавлять плагины в swagger, скрипты с типами и тэгами, произвольное количество модификаций html кода. \
Всё началось с того что я решил написать [плагин для swagger](https://github.com/angrocode/swagger-plugin-authorizeIcons) изменяющий поведение [иконок авторизации]((https://github.com/swagger-api/swagger-ui/issues/4402)), 
но подключить его через модуль swagger-ui-express не удалось, код из [примера](https://github.com/scottie1984/swagger-ui-express#custom-swagger-options) 
отправляет плагин не в скрипт инициализации, а в схему openapi. Поэтому появилась эта реализация.

#### Задачи
1. Тестирование OAuth.
2. Определение имени файла содержащего скрипт инициализации, получение параметров инициализации предлагаемых разработчиками [swagger-ui](https://github.com/swagger-api/swagger-ui).

#### Совместимость
Тестирование произведено на: \
[NestJS 8.4.7](https://nestjs.com/) \
Примеры из документации [swagger-ui-express](https://github.com/scottie1984/swagger-ui-express)

Стратегия совместимости до конца не определена, нужно больше примеров использования. \
Сейчас выбрана реализация функций setup и serveFiles как единой точки получения всех файлов. \
Функции setup и serveFiles идентичны по функционалу, т.к. каждая из них отправляет ответ с сервера и не вызывает следующий слой выполнения, использование обеих функций не должно приводить к не корректному выполнению (генерации). \
Остальные функции являются заглушками, созданными для совместимости.

Для подмены пакета swagger-ui-express используется функция moduleReplace,
которая переименовывает директорию swagger-ui-express в swagger-ui-express_original
и заменяет её с помощью копирования на директорию swagger-ui-express с содержимым
этого модуля. Операция производиться в том node_modules куда установлен этот пакет.

#### Описание
Модуль может работать в двух режимах, оригинальном через вызов функции swagger и режиме совместимости с [swagger-ui-express](https://github.com/scottie1984/swagger-ui-express). \
В режиме совместимости все параметры приводятся к структуре параметров функции swagger.

Функция swagger принимает три параметра:
1. Структура скрипта инициализации в виде объекта.
2. Структура стартовой страницы в виде объекта.
3. Настройки генерации скрипта, страницы и общие в виде объекта

Любые ключи и их значения скрипта инициализации могут быть переданы get или post запросом (но это не точно).

Объект настройки скрипта инициализации принимает ключи описанные в [этом документе](https://github.com/swagger-api/swagger-ui/blob/master/docs/usage/configuration.md), 
типы значений могут отличаться от указанных в документации, так array можно передать в виде string, если добавляется одно значение, bool в виде стринг и т.д.
Если скрипт не сможет привести переданные значения к установленным типам будет выдано исключение. \
Объекты и json преобразуются с помощью JSON.stringify и JSON.parse соответственно, 
в случаи ошибки исключения не выдаются, описание ошибки можно найти во фронте в виде объекта {error: e}
на том ключе которому был передан объекты или json.

Объект настройки стартовой страницы принимает два ключа (header, body). \
Значения ключей могут быть одного из типов: строка, массив, объект (используются значения)

Объект настройки генерации принимает три ключа (script, html, queryConfig). \
Объект script имеет два параметра {default: true, join: true}, \
default определяет будет загружена конфигурация по умолчанию или нет. \
join определяет ключи конфигурации имеющие тип массивов дополняться пользовательскими
значениями или будут полностью переопределяться. \
queryConfig разрешает использование параметров в запросе.

<div align="center"><h3>Примеры</h3></div>

#### Минимальный

```js
app.use('/api', swagger(
    {
      url: 'https://petstore.swagger.io/v2/swagger.json',
      layout:'StandaloneLayout',
    },
    {
      header: '<title>Swagger TEST</title>',
    },
    {
      queryConfig: true,
    }
))
```


```text
http://127.0.0.1:3000/api/?url=https://petstore.swagger.io/v2/swagger.json
http://127.0.0.1:3000/api/?spec={"openapi": "3.0.0","info": {"title": "temp1","version": "1.0"},"servers": [{"url": "http://localhost:3000"}]}
```


