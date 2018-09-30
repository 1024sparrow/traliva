'use strict';

//window.alert('dfghj');
//document.body.style.background = '#f00';

/*var api = {
    func1: function(){
        window.alert('api.func1');
        return "api.func1";
    }

}*/
//{{
var apiDescr = {
    native: [
        /*{
            path: 'utils/2.sh',
            platforms: ['ubuntu_desktop'],
            prestarted: true,
            //startFunc: 'startPlayer', // ## из состава Traliva.api
            stdin: 'setToPlayer', // ## записать из JS в стандартный ввод процесса
            stdout: 'playerChanged', // эта функция будет вызываться, процесс что-то пишет в стандартный вывод
            finished: 'playerFinished' // эта функция будет вызываться с кодом завершения процесса
        },*/
        {
            path: 'binutils/play.sh',
            platforms: ['ubuntu_desktop'],
            prestarted: false,
            startFunc: 'startPlayer', // ## из состава Traliva.api.native
            stdin: 'setToPlayer', // ## записать из JS в стандартный ввод процесса
            stdout: 'playerChanged', // эта функция будет вызываться, процесс что-то пишет в стандартный вывод
            finished: 'playerFinished' // эта функция будет вызываться с кодом завершения процесса
        }
    ]
};
//}}

var api = {
    sum: function(p_a, p_b){
        return p_a + p_b;
    },
    func1: function(){
        window.alert('api.func1');
        return "api.func1";
    },
    playerChanged: function(p_data){
        //
    },
    playerFinished: function(p_exitStatus){
        window.alert("player finish signal received winth exit code: " + p_exitStatus);
    }

};
if (TralivaApi)
    api.native = TralivaApi;

var eBn = document.getElementById('button1');
eBn.addEventListener('click', function(){window.alert('button 1 clicked: ' + api.sum(2, 3) + ' -- ' + api.func1())});

eBn = document.getElementById('button2');
eBn.addEventListener('click', function(){
    api.playerChanged = function(p_data){window.alert('data changed: ' + p_data);};
    var a = api.native.startPlayer();
    window.alert('start status: '+ a);
    api.native.setToPlayer("12 привет\n");
});

var API = {};

