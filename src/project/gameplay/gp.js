//hello from gp.js
var testString1 = '3"s".';
var testString2 = "222'3'444'55";
var testString3 = '\\\nw';
var testString4 = ' \\';
var testString5 = '  \\\\  e  ';
var testString6 = ' " \"we "';
var testString7 = ' " \\\\\"we "';
var testString8 = ' " \\\\\"we "';

var multilineString = 'first line - \
second line';

#USAGE_BEGIN#a##
'aaaa';
#USAGE_END#a##
'between a and b';
#USAGE_BEGIN#b##
'bbbb';
#USAGE_END#b##

#USAGE#ab:a,b##
#u#ab##
