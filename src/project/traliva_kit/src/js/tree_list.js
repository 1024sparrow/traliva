registerHelp('TreeList', {
    title: 'Простое дерево, выполненное в виде списка (с элементом "перейти на уровень выше")',
    //descr: '',
    options:{
        selectable: 'должно ли иметь место понятие "текущий элемент"',
        color: 'цвет',
        selected_color: 'цвет текущего элемента',
        hover_color: 'цвет фона при наведении курсора мыши'
    },
    stateObj:{
        data: 'список корневых элементов. Каждый элемент представлен объектом со следующими свойствами: id (если selectable), title(строка), children(список дочерних элементов)',
        current: 'id текущего элемента. Если не указан, но виджет является selectable, текущим устанавливается первый корневой элемент'
    }
});
function TreeList(p_wContainer, p_options){
    Traliva.WidgetStateSubscriber.call(this, p_wContainer, p_options);
    this.__TreeList = {
        publisher: new Traliva.StatePublisher(),
        state: {list:[{title:'1111'},{title:'2222'}]}
    };
    this.__TreeList.publisher.setState(this.__TreeList.state);
    this.__TreeList.publisher.registerSubscriber(
        new TralivaKit.SimpleList(
            p_wContainer,
            {
                getText: function(p){return p.title;},
                selectable: p_options.selectable,
                color: p_options.color,
                selected_color: p_options.selected_color,
                hover_color: p_options.hover_color
            }
        )
    );
    // ...
}
TreeList.prototype = Object.create(Traliva.WidgetStateSubscriber.prototype);
TreeList.prototype.constructor = TreeList;
TreeList.prototype.processStateChanges = function(s){
    if (!s){
        console.error('epic fail');
        return;
    }
    // ...
}
