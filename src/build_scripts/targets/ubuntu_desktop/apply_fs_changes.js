var fs = require('fs');
const execSync = require('child_process').execSync;

exports.applyFilesystemChanges = function(p_o){
    //console.log('applying: ', JSON.stringify(p_o, undefined, 2));
    for (let o of p_o){
        if (o.command === 'write'){
            if (!(o.target && o.content)){
                console.error('Некорректные параметры для команды "write": ожидается наличие ненулевых свойств "target" и "content"');
            }
            fs.writeFileSync(o.target, o.content, 'utf8');
        }
        else if (o.command === 'copy'){
            if (!(o.target && o.src)){
                console.error('Некорректные параметры для команды "copy": ожидается наличие ненулевых свойств "target" и "src"');
            }
            code = execSync(`cp -rf ${o.src} ${o.target}`);
            console.log('code: ', code);
        }
        else
            console.error('Неизвестная команда: ', o.command);
    }
};
