'use strict';

var $ee, $234;
#u#loop##
#USAGE_BEGIN#loop##
for (var $0 = 0 ; $0 < 5 ; $0++){
    console.log('hello $клюква!');
}
var $1, $клюква, $hello;
;$клюква=4;
#USAGE_END#loop##

#ENUM#Qwe:q,w,ee##
#ENUM#Qwe2:q,w,ee,a##
#MASK#Qwer:q,w,ee##
#MASK#Qwer2:q,w,ee,a##
#a#ok##
#a#ok##
#a#not_ok##
#a#ok##


var $клюква = #e#Qwe:ee##
if ($клюква & #e#Qwe##)
    console.log('Клюква!');
#e#Qwe##
#e#Qwe:w##
#e#Qwe2:a##

var $клюква = #e#Qwer:ee##
if ($клюква & #e#Qwer##)
    console.log('Клюква!');
#e#Qwer##
#e#Qwer:w##
#e#Qwer2:a##


#m#Qwer:q##
#m#Qwer:w##
#m#Qwer:ee##
#m#Qwer:q,w,ee##

