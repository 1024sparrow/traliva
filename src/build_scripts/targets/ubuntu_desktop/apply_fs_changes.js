var fs = require('fs');

exports.applyFilesystemChanges = function(p_o){
    //console.log('applying: ', JSON.stringify(p_o, undefined, 2));
    for (let o of p_o){
        if (o.command === 'write'){
            if (!(o.target && o.content)){
                console.error('Некорректные параметры для команды "write": ожидается наличие ненулевых свойств "target" и "content"');
            }
            fs.writeFileSync(o.target, o.content, 'utf8');
        }
        else
            console.error('Неизвестная команда: ', o.command);
    }
};
