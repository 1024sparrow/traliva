# traliva

>JavaScript фреймворк для разработки клиенской части (front-end) web-приложений.

## Что это за зверь

Три составляющие:
* Классы для работы с состояниями. Паттерн "Подписчик-издатель" для изменений в едином объекте, описывающем состояние всего веб-приложения.
    * StatePublisher. "Издатель" - экземпляр этого класса оповещает подписчиков об изменении Состояния.
    * StateSubscriber. Класс для наследования. "Подписчик". Обрабатывает изменения Состояния и регистрирует свои изменения.
    * StateDebugWidget. Подписчик, который в реальном времени отображает Состояние внутри указанного div-а (DomElement).
    * StateToUriMapper. Подписчик, который отображает Состояние в URL и обратно - при смене URL соответвующим образом меняет объект Состояния. Конструктор параметром принимает объект, описывающий соответствие подкаталогов URL-а значениям отдельных полей в объекте Состояния.
* Классы для построения GUI. События изменения размеров виджетов прокидываются сверху вниз - от браузера к виджету верхнего уровня, и далее к его дочерним виджетам. Также прокидываются события изменения видимости, и есть свой метод для переопределения onScrolled.
    * _WidgetBase. Класс для наследования. Наследуйтесь от этого класса, если хотите написать свой контейнер виджетов. Под виджетом понимается наследник этого класса.
    * Widget. Контейнер одного элемента, который можно передавать StateSubscriber-ам для установки ими туда другого виджета или DOM-элемента.
    * Strip. Контейнер виджетов: Горизонтальный или вертикальный лэйаут.
    * Stack. Контейнер виджетов: Многослойный.
* Отдельные функции общего назначения
    * ajax - обёртка над XmlHttpRequest для простого выполнения асихронных HTTP-запросов.
    * checkVisible - эта простенькая функция вам понадобится, если вы будете делать динамическую подгрузку контента при прокручивании контента.

## Как использовать

```
<html>
...
<body>
...
<script src="gameplay.js"></script>
</body>
</html>
```
Внутри gameplay.js делаем вызов
```
Traliva.init(o);
```
### Формат объекта, передаваемого в функцию Traliva.init()

Передаваемый в функцию Traliva.init() объект должен иметь следующие поля:
- target
    идентификатор платформы. Например, для сайта здесь может быть 'web', а для мобильного приложения под Android - 'android'. Эта строка зашивается жёстко в код на этапе компиляции(написания) скрипта gameplay.js. Зачем этот идентификатор платформы оставлять в коде - для возможности быстрого переключения между разными версиями веб-приложения на этапе разработки.
- get_layout
    function(w,h,target), return layout_id(String)
- layouts
    {layout_id --> {..см. "Формат лэйаута" ниже по тексту..}}
- states
    {..см. "Формат объекта, описывающего состояния" ниже по тексту..}
- widgets
    {widget_id --> constructor function}
- stateSubscribers
    [..list of Traliva.StateSubscriber-s constructors..]

    В зависимости от размеров экрана или от платформы (предполагается, что помимо сайтов, фреймворк также используется для создания графических интерфейсов программ) элементы страницы располагаются тем или иным образом. Взаимное расположение элементов задаёт объект, который мы называем лэйаутом. Для разных платформ и разных размеров экрана (окна) могут применяться разные лэйауты. Объект, передаваемый параметром в ```Traliva.init()``` должен содержать свойства target(строковый идентификатор платформы - например, для сайта это может быть 'web', а для приложения под Android - 'android'), get_layout(функция, параметры - ширина w, высота h, идентификатор платформы target; возвращает идентификатор лэйаута) и layouts (объект, используемый как Map, в котором строковому идентификатору лэйаута ставится в соответствие лэйаут). Формат описания лэйаута приведён ниже (см. 'Формат лэйаута').
```
Traliva.init({
    ...
    get_layout: function(w,h,target){
        ...
        return 'id лэйаута';
    },
    layouts: {
        'id лэйаута': {
            ... лэйаут
        }
    },
    ...
});
```
В описании лэйаута могут упоминаться пользовательские виджеты (наследуются от класса Traliva.WidgetStateSubscriber) - в лэйауте указывается их строковый идентификатор (вы сами его задаёте), по которому функция Traliva.init() будет искать в свойстве 'widgets' передаваемого параметром объекта. Свойство widgets представляет собой объект, в котором идентификаторам виджетов ставится в соответствие пара (т.е. массив) из функции-конструктора виджета и (опционально) строки, 

### Формат лэйаута

Лэйаут представляет собой объект, содержащий другие лэйауты(тип 'object') или id_виджета(тип 'string').
В случае, если вам лэйауты не нужны, можно вместо лэйаута указать id_виджета.
Лэйаут должен иметь поле 'type'. Доступны следующие типы вложенных объектов:
- strip
- stack
    В зависимости от типа объекта необходимо указывать те или иные свойства.
Лэйаут типа 'strip' должен иметь свойства 'orient' (со значением 'v' или 'h') и items.
Свойство 'items' представляет собой массив. Элементы этого массива - объекты, имеющие свойства 'widget' и (опционально) 'size'(например, '64 px' или '2 part'; значение по умолчанию - '1part', то есть занимает оставшееся после элементов с фикисированным размером место). Свойство 'widget' - либо строковый идентификатор виджета (id_виджета)

Контейнеры stack и strip имеют поле items, в котором ожидается список элементов контейнера. В качестве элемента контейнера может быть как другой контейнер (тип 'object'), так и id_виджета (тип 'string'). В случае, если указан id_виджета, функция Traliva.init() созхдаст элемент с помощью конструктора, ассоциированного с этим id_виджета в свойстве widgets объекта, переданного в Traliva.init(). Если же в поле widgets не найден соответвующий конструктор, будет создана заглушка - виджет, на котором отображается id_виджета и цвет фона имеет уникальное в рамках всего веб-приложения значения.


### Формат объекта, описывающего дерево состояний


## Лицензия

Copyright © 2017 [Васильев Борис](https://github.com/1024sparrow)
Публикуется под лицензией [MIT license](https://github.com/1024sparrow/traliva/blob/master/LICENSE).
