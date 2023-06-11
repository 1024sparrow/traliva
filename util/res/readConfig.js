#!/usr/bin/node

for (const oArg of process.argv.slice(2)){
	//console.log(oArg);
	if (oArg === '--help'){
		return `
--test <путь/до/файла/конфига>
	проверить корректность (полноту) конфигурации
--list-git-submodules <путь/до/файла/конфига>
	выдать единым списком информацию по репозиториям в конфиге
`;
		process.exit(0);
	}
}

var
	FS = require('fs'),
	state = 'init',
	fErrorArg = function(a){
		process.stderr.write(`неожиданный аргумент: "${a}". См. справку.
`);
		process.exit(1);
	},
	argConfigPath
;

for (const oArg of process.argv.slice(2)){
	if (state === 'init'){
		if (oArg === '--test'){
			state = 'test.init';
		}
		else if (oArg === '--list-git-submodules'){
			state = 'list-git.init';
		}
		else fErrorArg(oArg);
	}
	else if (state === 'test.init'){
		if (oArg.slice(0,1) === '-'){
			ERROR(`Неожиданный ключ "$oArg"`);
		}
		if (!FS.existsSync(oArg)){
			ERROR(`Нет такого файла: "${oArg}"`);
		}
		argConfigPath = oArg;
		state = 'test.ready';
	}
	else if (state === 'list-git.init'){
		if (oArg.slice(0,1) === '-'){
			ERROR(`Неожиданный ключ "$oArg"`);
		}
		if (!FS.existsSync(oArg)){
			ERROR(`Нет такого файла: "${oArg}"`);
		}
		argConfigPath = oArg;
		state = 'list-git.ready';
	}
	else{
		ERROR('лишние параметры указаны. См. справку.');
	}
}
if (state === 'test.ready'){
	testConfig(argConfigPath);
}
else if (state === 'list-git.ready'){
	listGit(argConfigPath);
}
else{
	ERROR('Не хватает аргументов. См. справку.');
}

function ERROR(a) {
	process.stderr.write(`Ошибка: ${a}
`);
	process.exit(1);
}

function testConfig(a) {
	var conf = require(`./${a}`);
	var n = 0;
	if (!(conf.gitSubmodules instanceof Array)){
		ERROR(`Корневое свойство "gitSubmodules" отсутствует или не является списком`);
	}
	if (conf.gitSubmodules.length !== 4){
		ERROR(`gitSubmodules: должно быть ровно 4 элемента в списке`)
	}
	for (const oSubmodule of conf.gitSubmodules){
		++n;
		for (oField of [
			'codePath',
			'repositoryForkFrom',
			'repositoryPushTo',
			'branch'
		]){
			if (typeof oSubmodule[oField] !== 'string'){
				ERROR(`gitSubmodules: ${n}-й элемент списка: свойство "${oField}" отсутствует или не является строкой`);
			}
		}
	}
	process.stdout.write(`Конфигурационный файл проекта на фреймворке Тралива "${a}" предварительную проверку на корректность прошёл успешно.
`);
}

function listGit(a) {
	var conf = require(`./${a}`);
	for (const oSubmodule of conf.gitSubmodules){
		for (oField of [
			'codePath',
			'repositoryForkFrom',
			'repositoryPushTo',
			'branch'
		]){
			process.stdout.write(oSubmodule[oField] + '\n');
		}
	}
}
