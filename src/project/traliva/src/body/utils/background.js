/*
Эта функция устанавливает переданному DOM-элементу p_e CSS-стиль исходя из параметра p_o.
Параметр p_o - строка, содержащая путь (сетевой!) до картинки, или объект, описывающий картинку в спрайте.
В случае строки, содержащей путь до картинки, элементу p_e будет установлен встроенный стиль CSS "background".
В случае использования спрайта элементу p_e будут установлены встроенные стили CSS "background", "width" и "height".
Формат описания картинки в спрайте:
{
    $path: 'путь/до/описателя/спрайта',
    $id: 'идентификатор картинки в описателе спрайта'
}.
Описатель спрайта представляет собой JSON-файл. У файла пишется расширение ".sprite". Этот файл имеет следующий формат:
{
    "$image": "путь/до/картинки",
    "$rows": [
        {
            "$h": высота_строки_спрайта_в_пикселях,
            "$items":[
                {
                    "$id": "идентификатор_первой_картинки",
                    "$w": ширина_в_пикселях,
                    "$h": высота_в_пикселях(если отличается от высоты строки)
                },
                ...
              ]
        },
        {...},
        ...
    ]
}
*/
var $background__cache = {};
function $background($p_e, $p_o){
    #USAGE_BEGIN#debug##
    if (typeof $p_o === 'string'){
        $p_e.style.$background = 'url("' + $p_o + '") 0 0 no-repeat';
    }
    else{
        var $apply = function($p_e, $p_o, $p_id){ // $p_o - содержимое файла .sprite в виде JS-объекта
            var $iX, $iY, $x, $y = 0, $row, $item;
            for ($iY = 0 ; $iY < $p_o.$rows.length ; $iY++){
                $row = $p_o.$rows[$iY];
                $x = 0;
                for ($iX = 0 ; $iX < $row.$items.length ; $iX++){
                    $item = $row.$items[$iX];
                    if ($item.$id === $p_id){
                        if ($x > 0)
                            $x = '-' + $x + 'px';
                        if ($y > 0)
                            $y = '-' + $y + 'px';
                        $p_e.style.$background = 'url("' + $p_o.$image + '") ' + $x + ' ' + $y;
                        $p_e.style.width = $item.$w + 'px';
                        $p_e.style.height = ($item.$h || $row.$h) + 'px';
                        return;
                    }
                    $x += $item.$w;
                }
                $y += $row.$h;
            }
        };
        if ($background__cache.hasOwnProperty($p_o.$path)){
            $apply($p_e, $background__cache[$p_o.$path], $p_o.$id);
        }
        else{
            $ajax({
                $sourcePath: $p_o.$path,
                $readyFunc: (function($cache, $spritePath, $elem, $applyFunc, $id){return function($result){
                    var $0 = JSON.parse($result); // здесь не перехватывается исключение в случае некорректного JSON
                    $cache[$spritePath] = $0;
                    $applyFunc($elem, $0, $id);
                };})($background__cache, $p_o.$path, $p_e, $apply, $p_o.$id),
                $errorFunc: function(){
                    console.error('не удалось установить фон для элемента - не найден файл "' + $p_o.$path + '"');
                }
            });
        }
    }
    #USAGE_END#debug##
}
