#!/usr/bin/node

var process = require('process');
var path = require('path');
var fs = require('fs');
//var fse = require('fs-extra');
var child_process = require('child_process');
var applyFsChangesModule = require('./apply_fs_changes.js');

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
var api_native__cpp__cpp = '';
var api_native__cpp = fs.readFileSync('t/api_native.cpp', 'utf8');

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
    api_native__cpp__cpp += 'int ApiNative::' + o.start + '()\n{\n    return startProcess("' + o.start + '", ';
    api_native__cpp__cpp += o.input ? `"${o.input}"` : "";
    api_native__cpp__cpp += ", ";
    api_native__cpp__cpp += o.output ? `SLOT(${o.output}())` : "0";
    api_native__cpp__cpp += ", ";
    api_native__cpp__cpp += o.finished ? `SLOT(${o.finished}(int))` : "0";
    api_native__cpp__cpp += ");\n}\n\n";

    if (o.input){
        api_native__h__public += '\n    Q_INVOKABLE int ' + o.input + '(const QString &);';
        // вставить исходный код в cpp
        api_native__cpp__cpp += `void ApiNative::${o.input}(const QString &p)`;
        api_native__cpp__cpp += '\n{\n    writeToProcess("';
        api_native__cpp__cpp += o.input;
        api_native__cpp__cpp += '", p);\n}\n\n';
    }
    api_native__h__public += '\n';
    if (o.output){
        if (api_native__h__privateSlots.length !== 0)
            api_native__h__privateSlots += '\n    ';
        api_native__h__privateSlots += 'void ' + o.output + '();';
        // вставить исходный код в cpp
        api_native__cpp__cpp += `void ApiNative::${o.output}()`;
        api_native__cpp__cpp += '\n{\n    onReadyReadStandardOutput("';
        api_native__cpp__cpp += o.output;
        api_native__cpp__cpp += '");\n}\n\n';
    }
    if (o.finished){
        if (api_native__h__privateSlots.length !== 0)
            api_native__h__privateSlots += '\n    ';
        api_native__h__privateSlots += 'void ' + o.finished + '(int p_exitCode);';
        // вставить исходный код в cpp
        api_native__cpp__cpp += `void ApiNative::${o.finished}(int p_exitCode)`;
        api_native__cpp__cpp += '\n{\n    onProcessFinished("';
        api_native__cpp__cpp += o.finished;
        api_native__cpp__cpp += '", p_exitCode);\n}\n\n';
    }
    api_native__h__privateSlots += '\n';
}


api_native__h = api_native__h.replace('[ code here: public ]', api_native__h__public);
api_native__h = api_native__h.replace('[ code here: private slots ]', api_native__h__privateSlots);
api_native__cpp = api_native__cpp.replace('[ code here: cpp ]', api_native__cpp__cpp);
console.log('api_native.h:\n------------\n', api_native__h);
console.log('api_native.cpp:\n--------------\n', api_native__cpp);

/*applyFsChangesModule.applyFilesystemChanges({
    'api_native.h': api_native__h,
    'api_native.cpp': api_native__cpp
});*/
applyFsChangesModule.applyFilesystemChanges([
    {
        command: 'write',
        target: 'api_native.h',
        content: api_native__h
    },
    {
        command: 'write',
        target: 'api_native.cpp',
        content: api_native__cpp
    }
]);

