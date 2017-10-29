# traliva

JavaScript фреймворк для разработки клиенской части (front-end) web-приложений.

В коде фреймворка используется JavaScript по состоянию на 2011 год. EcmaScript5 и CSS3.

Три составляющие:
* Классы для работы с состояниями. Паттерн "Подписчик-издатель" для изменений в едином объекте, описывающем состояние всего веб-приложения.
    * StatePublisher
    * StateSubscriber
    * StateDebugWidget
    * StateToUriMapper
* Классы для построения GUI
    * _WidgetBase
    * Widget
    * Strip
    * Stack
* Отдельные функции общего назначения
    * ajax
    * checkVisible


## Лицензия

Copyright © 2017 [Васильев Борис](https://github.com/1024sparrow)
Публикуется под лицензией [MIT license](https://github.com/1024sparrow/traliva/blob/master/LICENSE).
