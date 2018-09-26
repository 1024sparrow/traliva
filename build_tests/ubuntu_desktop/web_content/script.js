'use strict';

//window.alert('dfghj');
//document.body.style.background = '#f00';

var api = {
    func1: function(){
        window.alert('api.func1');
        return "api.func1";
    }

}

api = {
    js: api, // from Native to JS
    native: TralivaApi // from JS to Native
};

//api = apiTmp;

/*var i;
if (TralivaApi){
    window.alert('qwertyj');
    for (i in TralivaApi){
        api[i] = TralivaApi[i];
    }
}*/

var eBn = document.getElementById('button1');
eBn.addEventListener('click', function(){window.alert('button 1 clicked: ' + api.native.sum(2, 3) + ' -- ' + api.js.func1())});

var API = {};

