#!/usr/bin/node

const process = require('process');
const path = require('path');
const fs = require('fs');
//var fse = require('fs-extra');
const child_process = require('child_process');
const applyFsChangesModule = require('./apply_fs_changes.js');
const execSync = require('child_process').execSync;//

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

var i, c, t, o, t2;
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
        api_native__h__public += '\n    Q_INVOKABLE void ' + o.input + '(const QString &);';
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
//console.log('api_native.h:\n------------\n', api_native__h);
//console.log('api_native.cpp:\n--------------\n', api_native__cpp);

let iconsResourceFile = '';
let main__h__splash_0 = '';
let main__h__splash_1 = '';
let main__cpp__icon = '';
let main__cpp__splash_0 = '';
let main__cpp__splash_1 = '';
let main__cpp__splash_2 = '';
if (fs.existsSync(path.join(projectPath, 'configfiles', 'favicon.png'))){
    console.log('ICON DETECTED!!');
    // copyFileSync - нет такой функции в NodeJS v.6 => обхожу его использование через системный вызов
    //fs.copyFileSync(path.join(projectPath, 'configfiles', 'favicon.png'), targetPath);//path.join(targetPath, 'favicon.png'));
    execSync('cp  ' + path.join(projectPath, 'configfiles', 'favicon.png') + ' ' + targetPath + '/');
    iconsResourceFile += '\n        <file>favicon.png</file>';
    main__cpp__icon += '\n    app.setWindowIcon(QIcon(":/favicon.png"));';
}
if (fs.existsSync(path.join(projectPath, 'configfiles', 'splash.png'))){
    console.log('SPLASH DETECTED!!');
    // copyFileSync - нет такой функции в NodeJS v.6 => обхожу его использование через системный вызов
    //fs.copyFileSync(path.join(projectPath, 'configfiles', 'favicon.png'), targetPath);//path.join(targetPath, 'favicon.png'));
    execSync('cp  ' + path.join(projectPath, 'configfiles', 'splash.png') + ' ' + targetPath + '/');
    iconsResourceFile += '\n        <file>splash.png</file>';
    main__h__splash_0 += '\nclass QSplashScreen;';
    main__h__splash_1 += '\n    QSplashScreen *splashScreen;';
    main__cpp__splash_0 += '\n#include <QPixmap>\n#include <QSplashScreen>\n#include <QBitmap>';
    main__cpp__splash_1 += 'QPixmap pix(":/splash.png");\n    splashScreen = new QSplashScreen(pix);\n    splashScreen->setMask(pix.mask());\n    splashScreen->show();\n';
    main__cpp__splash_2 += '\n    splashScreen->finish(wv);';
}
iconsResourceFile = fs.readFileSync('t/splash_and_icons.qrc', 'utf8').replace('[ code here: png-s ]', iconsResourceFile);
fs.writeFileSync(path.join(targetPath, 'splash_and_icons.qrc'), iconsResourceFile);
fs.writeFileSync(path.join(targetPath, 'main.h'), fs.readFileSync('t/main.h', 'utf8')
    .replace('[ code here: splash_0 ]', main__h__splash_0)
    .replace('[ code here: splash_1 ]', main__h__splash_1)
);
fs.writeFileSync(path.join(targetPath, 'main.cpp'), fs.readFileSync('t/main.cpp', 'utf8')
    .replace('[ code here: icon ]', main__cpp__icon)
    .replace('[ code here: splash_0 ]', main__cpp__splash_0)
    .replace('[ code here: splash_1 ]', main__cpp__splash_1)
    .replace('[ code here: splash_2 ]', main__cpp__splash_2)
);
fs.writeFileSync(path.join(targetPath, 'api_native.h'), api_native__h, 'utf8');
fs.writeFileSync(path.join(targetPath, 'api_native.cpp'), api_native__cpp, 'utf8');

var content__qrc__web_contents = '';
t = path.join(projectPath, 'res');
if (fs.existsSync(t)){
    var stack = [t];
    while (stack.length){
        o = stack.pop();
        t = fs.readdirSync(o);
        for (i = 0 ; i < t.length ; ++i){
            t2 = path.join(o, t[i]);
            if (fs.statSync(t2).isDirectory())
                stack.push(t2);
            else{
                content__qrc__web_contents += `\n        <file>web_content/${path.relative(projectPath, t2)}</file>`;
            }
        }
    }
}
fs.writeFileSync(path.join(targetPath, 'content.qrc'), fs.readFileSync('t/content.qrc', 'utf8')
    .replace('[ code here: web_contents ]', content__qrc__web_contents)
);

