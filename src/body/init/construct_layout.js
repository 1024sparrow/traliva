// p_widgets - конструкторы виджетов
// p_widgetScope - здесь мы сохраняем наши виджеты
// в случае аварийного выхода (некорректные параметры) мы заботимся о корректном освобождении памяти и о снятии ненужных подписчиков
function construct_layout(p_wParent, p_oLayout, p_defaultBackground, p_widgets, p_widgetScope, p_innerCall){
    console.log('construct_layout: ' + JSON.stringify(p_oLayout));

    var i, cand, w, type = typeof p_oLayout;
    var retVal;
    var used = p_innerCall || {};// множество использованных в новом лэйауте id-шников
    if (!p_oLayout){
        // (пружинка)
    }
    if (type === 'string'){
        /*if (p_widgetScope.hasOwnProperty(p_oLayout)){
            console.log('error: идентификаторы пользовательских виджетов должны иметь уникальные значения');
            return;// возможно, это зря. Особо не думал.
        }*/
        if (p_oLayout.hasOwnProperty('id')){
            if (Traliva.widgets.hasOwnProperty(p_oLayout.id))
                console.error('Обнаружено дублирование идентификаторов виджетов. Идентификатор конфликта - ' + p_oLayout.id);
        }
        if (p_widgetScope.hasOwnProperty(p_oLayout))
            retVal = p_widgetScope[p_oLayout].__WidgetStateSubscriber.wContainer;
        else{
            retVal = new Widget(p_wParent);
            if (p_widgets.hasOwnProperty(p_oLayout)){
                // вызываем конструктор..
                i = p_widgets[p_oLayout];
                if (typeof i === 'function')
                    cand = new i(retVal);
                else{
                    cand = new i.constructor(retVal, i.options || undefined);
                    if (i.hasOwnProperty('substate'))
                        cand = cand.useSubstate(i.substate);
                    //cand = new i[0](retVal).substate(i[1]);// согласно спецификации, если не конструктор, то массив из конструктора и (чего-то, описывающего подсостояние)
                }
            }
            else{
                // создаём виджет-заглушку
                //console.log('создаётся виджет-заглушка для элемента лейаута с id = \''+p_oLayout+'\'');
                cand = new StubWidget(retVal, p_oLayout);
            }
            //retVal.setContent(cand);cand - не виджет, а его представитель из мира Подписчиков
            Traliva.__d.widgets[p_oLayout] = retVal;
            p_widgetScope[p_oLayout] = cand;
            Traliva.__d.publisher.registerSubscriber(cand);
        }
        used[p_oLayout] = 1;
    }
    else if (type === 'object'){
        if (!p_oLayout.hasOwnProperty('type'))
            console.error('error: incorrect layout description: \'type\' must be');
        type = p_oLayout.type;
        if (type === 'strip'){
            if (!p_oLayout.hasOwnProperty('orient'))
                console.error('error: layout must have property \'orient\'');
            var orient;
            if (p_oLayout.orient === 'h')
                orient = Traliva.Strip__Orient__hor;
            else if (p_oLayout.orient === 'v')
                orient = Traliva.Strip__Orient__vert;
            else
                console.error('error: incorrect value of a strip orientation. Possible values: \'h\',\'v\'.');
            retVal = new Strip(orient, p_wParent, p_oLayout.scroll);
            if (p_oLayout.hasOwnProperty('items')){
                for (i = 0 ; i < p_oLayout.items.length ; i++){
                    //console.log('item '+i);
                    cand = p_oLayout.items[i];
                    if (typeof cand === 'string'){
                        cand = {widget: cand};
                    }
                    if (cand.widget){
                        w = construct_layout(retVal, cand.widget, p_oLayout.bg || p_defaultBackground, p_widgets, p_widgetScope, p_innerCall || used);
                    }
                    else{
                        w = new Widget(retVal);
                    }
                    if (!w)
                        console.error('oops');// error ocurred in internal self calling
                    console.log('widget added to layout');
                    retVal.addItem(w, cand.size);
                }
            }
        }
        else if (type === 'stack'){
            retVal = new Stack(p_wParent, p_oLayout.scroll);
            for (i = 0 ; i < p_oLayout.items.length ; i++){
                cand = p_oLayout.items[i];
                if (typeof cand === 'string' || cand.hasOwnProperty('type'))
                    cand = {widget: cand};
                w = construct_layout(retVal, cand.widget, p_oLayout.bg || p_defaultBackground, p_widgets, p_widgetScope, p_innerCall || used);
                if (!w)
                    console.error('oops'); // error ocurred in internal self calling
                retVal.addItem(w);
            }
        }
        else{
            console.error('error: incorrect type of a layout item');
        }
    }
    if (p_oLayout.hasOwnProperty('bg')){
        cand = (p_oLayout.bg.length) ? p_oLayout.bg : p_defaultBackground;
        if (cand)
            retVal._div.style.background = cand;
    }

    if (!p_innerCall){
        // уничтожаем те виджеты, id которых не попали в used
        for (i in p_widgetScope){
            if (!used.hasOwnProperty(i)){
                Traliva.__d.publisher.unregisterSubscriber(p_widgetScope[i]);
                w = p_widgetScope[i].destroy(); // w - DOM-элемент...
                delete p_widgetScope[i];
            }
        }
    }
    if (p_oLayout.hasOwnProperty('id')){
        Traliva.widgets[p_oLayout.id] = retVal;
    }
    return retVal; // возврат из функции должен быть здесь
}
