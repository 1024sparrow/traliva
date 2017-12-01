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

# Текущее состояния

На данный момент обкатывается при разработке сайта.
Будет ещё решение для постоения адаптивных интерфейсов (разный набор и компоновка виджетов для разных размеров области отображения) - возможно, API изменится радикальным образом. Так что, документации пока нет.

## Какой код должен быть

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
- get_layout
    function(w,h,target), return layout_id(String)
- layouts
    {layout_id --> {..see layout object descriptition later..}}
- states
    {..see states object description later..}
- widgets
    {widget_id --> constructor function}
- stateSubscribers
    [..list of Traliva.StateSubscriber-s constructors..]


## Лицензия

Copyright © 2017 [Васильев Борис](https://github.com/1024sparrow)
Публикуется под лицензией [MIT license](https://github.com/1024sparrow/traliva/blob/master/LICENSE).
