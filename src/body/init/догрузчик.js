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
                self.ok(EXTERNAL);
            }
            catch(e){
                var err = e.constructor('Ошибка возникла во время исполнения загруженного скрипта (url=\''+ url + '\'): ' + e.message);
                err.lineNumber = e.lineNumber + 5 - err.lineNumber; // 5 - количество строк, прошедших от вызова eval()
                throw err;
            }
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
}
Догрузчик.prototype.fail = function(p_reason){
    console.log('error: ' + p_reason);
}
