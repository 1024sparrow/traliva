// p_widgets - конструкторы виджетов
// p_widgetScope - здесь мы сохраняем наши виджеты
function construct_layout(p_wParent, p_oLayout, p_widgets, p_widgetScope){
    console.log('construct_layout: ' + JSON.stringify(p_oLayout));

    var i, cand, w, type = typeof p_oLayout;
    var retVal;
    if (!p_oLayout){
        // (пружинка)
    }
    if (type === 'string'){
        if (p_widgetScope.hasOwnProperty(p_oLayout)){
            console.log('error: идентификаторы пользовательских виджетов должны иметь уникальные значения');
            return;// возможно, это зря. Особо не думал.
        }
        if (p_widgets.hasOwnProperty(p_oLayout)){
            // вызываем конструктор..
            // not implemented
            console.log('not implemented');
            return;
        }
        else{
            // создаём виджет-заглушку
            console.log('создаём заглушку');

            w = new Widget(p_wParent);
            cand = new StubWidget(w, p_oLayout);
            p_widgetScope[p_oLayout] = cand;
            return w;
        }
    }
    else if (type === 'object'){
        if (!p_oLayout.hasOwnProperty('type')){
            console.log('error: incorrect layout description: \'type\' must be');
            return;
        }
        type = p_oLayout.type;
        if (type === 'strip'){
            if (!p_oLayout.hasOwnProperty('orient')){
                console.log('error: layout must have property \'orient\'');
                return;
            }
            var orient;
            if (p_oLayout.orient === 'h')
                orient = Traliva.Strip__Orient__hor;
            else if (p_oLayout.orient === 'v')
                orient = Traliva.Strip__Orient__vert;
            else{
                console.log('error: incorrect value of a strip orientation. Possible values: \'h\',\'v\'.');
                return;
            }
            retVal = new Strip(orient, p_wParent, p_oLayout.scroll);
            retVal._div.className = 'strip';//
            for (i = 0 ; i < p_oLayout.items.length ; i++){
                //console.log('item '+i);
                cand = p_oLayout.items[i];
                w = construct_layout(retVal, cand.widget, p_widgets, p_widgetScope);
                if (!w)
                    return; // error ocurred in internal self calling
                retVal.addItem(w, cand.size);
            }
            return retVal;
        }
        else if (type === 'stack'){
            console.log('not implemented');
        }
        else{
            console.log('error: incorrect type of a layout item');
        }
    }
    console.log('epic fail');
}
