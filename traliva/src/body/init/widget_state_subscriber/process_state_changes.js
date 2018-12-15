$WidgetStateSubscriber.prototype.$processStateChanges = function(s){
    /*вызовите этот базовый метод в начале своей реализации этого метода*/
    if (!s){
        console.error('epic fail');
        return;
    }
    //boris here
    console.log('ТИПА ОБНОВЛЯЕМ СОДЕРЖИМОЕ КОНТЕЙНЕРА');
    if (this.$__WidgetStateSubscriber.$children){
    }

    var $0, $1, $2, $3,
        $descr = this.$__WidgetStateSubscriber.$descr,
        $arrSubstate,
        $cand, /*=undefined*/
        $tmp;
    ;
    if ($descr.$children){
        console.log('-------- children detected:', JSON.stringify($descr.$children), $descr.$children);//
        $0 = $descr
        for ($1 in $descr.$children){
            $arrSubstate = s;
            if ($descr.$children[$1].$substate){
                $0 = $descr.$children[$1].$substate.split('/');
                while (($arrSubstate !== undefined) && $0.length){
                    $arrSubstate = $arrSubstate[$0.shift()];
                }
            }
            if ($arrSubstate === this.$__WidgetStateSubscriber.$children[$1]){
                console.log('ссылка на массив сохранилась');//
                if (this.$__WidgetStateSubscriber.$childrenChanged[$1]){
                    if (!$cand)
                        $cand = {};
                    $cand[$1] = $arrSubstate;
                }
            }
            else{
                console.log('ссылка на массив изменилась');//
                $WidgetStateSubscriber__makeArrayReportable(this, $arrSubstate, $1);
                //this.$__WidgetStateSubscriber.$children[$1] = $arrSubstate;
                if (!$cand)
                    $cand = {};
                $cand[$1] = $arrSubstate;
                #USAGE_BEGIN#debug##if (!($arrSubstate instanceof Array))console.log('epic fail');#USAGE_END#debug##
            }
        }
        console.log('%%%%%%%%% cand:', $cand);//
        /*
            сейчас в cand находится массив в объектами, которые в объекте состояния описывают дочерние виджеты
            мы должны вызват _updateLayout и передать туда объект со свойствами- изменившимися массивами детей $0
            $0:{
                items:{
                    _widget: <ссылка на виджет>,
                    ... (опции из descr.options)
                }
            }
        */

        /* убираем лишние
        for ($1 = $p_content.length ; $1 < this.$__items.length ; ++$1){
        }

        // добавляем новые
        for ($1 = this.$__items.length ? this.$__items.length - 1 : 0 ; $1 < $p_content.length ; ++$1){*/

        if ($cand){
            $0 = {};
            for ($1 in $cand){
                $0[$1] = [];
                console.log('%%%', JSON.stringify($cand));//
                if (!this.$__WidgetStateSubscriber.$childrenWidgets[$1])
                    this.$__WidgetStateSubscriber.$childrenWidgets[$1] = [];
                // убираем лишние
                for ($2 = $cand[$1].length ; $2 < this.$__WidgetStateSubscriber.$childrenWidgets[$1].length ; ++$2){
                }
                // добавляем новые
                for ($2 = this.$__WidgetStateSubscriber.$childrenWidgets[$1].length ? this.$__WidgetStateSubscriber.$childrenWidgets[$1].length - 1 : 0 ; $2 < $cand[$1].length ; ++$2){
                    $tmp = Object.create($descr.$children[$1].$options || null);
                    console.log('@@', this.$__WidgetStateSubscriber.$wContainer);//
                    $tmp.$_widget = new $Widget(this.$__WidgetStateSubscriber.$wContainer);
                    $3 = new $descr.$children[$1].$constructor($tmp.$_widget, $descr.$options); // boris here: надо хранить, чтоб потом удалять. А ещё надо зарегистрировать этого подписчика.
                    //$tmp.$_widget = this.$__WidgetStateSubscriber.$childrenWidgets[$1][$2];
                    $0[$1].push($tmp);
                }

                /*$0[$1] = [];
                if (this.$__WidgetStateSubscriber.$childrenWidgets[$1]){
                    for ($2 = 0 ; $2 < this.$__WidgetStateSubscriber.$childrenWidgets[$1].length; ++$2){
                        $tmp = Object.create($descr.$children[$1].$options || null);
                        $tmp.$_widget = this.$__WidgetStateSubscriber.$childrenWidgets[$1][$2];
                        $0[$1].push($tmp);
                    }
                }*/
            }
            console.log('XX:', $0);
            this.$_updateLayout($0);
        }
    }
    console.log('WSS::processStateChanges finished: ', this);//
};
