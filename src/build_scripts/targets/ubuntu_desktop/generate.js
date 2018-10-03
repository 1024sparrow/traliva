#!/usr/bin/node

var process = require('process');
var path = require('path');
var fs = require('fs');
//var fse = require('fs-extra');
var child_process = require('child_process');

console.log(process.argv); // 0 - node, 1 - this script
console.log('=====================');
if (process.argv.length !== 4){
    console.error("Usage: node <this_script> <path_to_compiled_project_dir> <path_to_target_dir>");
    return;
}
const projectPath = process.argv[2];
const targetPath = process.argv[3];
// вставить проверку существования директорий, пути к которым переданы в аргументах к данному скрипту
var api = fs.readFileSync(path.join(projectPath, 'api'), 'utf8');
api = eval('[' + api + ']');

var fsChanges = {};

var api_native__h__public = '';
var api_native__h__privateSlots = '';
var api_native__h = fs.readFileSync('t/api_native.h', 'utf8');
console.log('api_native.h:\n', api_native__h);

var i, c, t, o;
for (i = 0 ; i < api.length ; ++i){
    o = api[i];
    if (!o.hasOwnProperty('start')){
        console.error('api: свойство \'start\' является обязательным. Сборка прервана.');
        return;
    }
    if (api_native__h__public.length !== 0)
        api_native__h__public += '\n    ';
    api_native__h__public += 'Q_INVOKABLE int ' + o.start + '();';
    // вставить исходный код в cpp
    if (o.input){
        api_native__h__public += '\n    Q_INVOKABLE int ' + o.input + '(const QString &);';
        // вставить исходный код в cpp
    }
    api_native__h__public += '\n';
    if (o.output){
        if (api_native__h__privateSlots.length !== 0)
            api_native__h__privateSlots += '\n    ';
        api_native__h__privateSlots += 'void ' + o.output + '();';
        // вставить исходный код в cpp
    }
    if (o.finished){
        if (api_native__h__privateSlots.length !== 0)
            api_native__h__privateSlots += '\n    ';
        api_native__h__privateSlots += 'void ' + o.finished + '(int p_exitCode);';
        // вставить исходный код в cpp
    }
    api_native__h__privateSlots += '\n';
}


api_native__h = api_native__h.replace('[ code here: public ]', api_native__h__public);
api_native__h = api_native__h.replace('[ code here: private slots ]', api_native__h__privateSlots);
console.log('~~~~~~~~~~~~~~~~~~~\napi_native.h:\n', api_native__h);
applyFilesystemChanges({
    'api_native.h': api_native__h
});

function applyFilesystemChanges(p_o){
    console.log('applying: ', p_o);
}


//var api = JSON.parse

/*program.action(function(p_projectPath, p_targetPath){
    console.log(p_projectPath, p_targetPath);
});*/
