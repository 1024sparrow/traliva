#!/usr/bin/node

var process = require('process');
var path = require('path');
var fs = require('fs');
//var fse = require('fs-extra');
var child_process = require('child_process');

console.log('hello');

console.log(process.argv); // 0 - node, 1 - this script
if (process.argv.length !== 4){
    console.error("Usage: node <this_script> <path_to_compiled_project_dir> <path_to_target_dir>");
    return;
}

/*program.action(function(p_projectPath, p_targetPath){
    console.log(p_projectPath, p_targetPath);
});*/
