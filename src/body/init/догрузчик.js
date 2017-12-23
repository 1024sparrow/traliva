/* Предполагается, что использоваться будет с подсостоянием */
function Догрузчик(p_getUrl, p_parent){
    StateSubscriber.call(this);
    this._extId = undefined;
    this._getUrl = p_getUrl;
}
Догрузчик.prototype = Object.create(StateSubscriber.prototype);
Догрузчик.prototype.constructor = Догрузчик;
Догрузчик.prototype.processStateChanges = function(s){
    if (s === this._extId)
        return;
    console.log('Меняю id на ' + s);

    if (this._extId){
        // деинициализация старого "продолжения"
    }

    var url = this._getUrl(s);

    (function(self, url){
    Traliva.ajax({
        sourcePath: url,
        readyFunc: function(result){
            console.log('loaded ok');
            var EXTERNAL = {};
            try{
                eval(result);
            }
            catch(e){
                var err = e.constructor('Ошибка возникла во время исполнения загруженного скрипта (url=\''+ url + '\'): ' + e.message);
                err.lineNumber = e.lineNumber + 4 - err.lineNumber; // 4 - количество строк, прошедших от вызова eval()
                throw err;
                return;
            }
            self.ok(EXTERNAL);
        },
        errorFunc: function(isNetworkProblem){
            console.log('loaded not ok');
        }
    });
    })(this, url);

    this._extId = s;
}
Догрузчик.prototype.ok = function(o){
    console.log(JSON.stringify(o));
    //if (Traliva.__d.w.hasOwnProperty())
    var i,t,content,d = Traliva.__d, slotWidget;
    for (i in d.w){
        console.log(i + '-- '+d.w[i]);//
    }
    for (i in o.layouts){
        console.log('downloaded layout id: '+i);//
        //continue;//

        slotWidget = d.widgets[i];
        if (!slotWidget){
            console.log('epic fail: ' + i);
            continue;
        }
        content = construct_layout(slotWidget, o.layouts[i], o.widgets, d.w);//
        if (content){
            slotWidget.setContent(content);
        }
        console.log('test: ' + typeof content);//
    }
}
Догрузчик.prototype.fail = function(p_reason){
    console.log('error: ' + p_reason);
}
