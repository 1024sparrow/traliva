'use strict';
// 1.js

var $ee, $234;
#u#loop##
#USAGE_BEGIN#loop##
for (var $0 = 0 ; $0 < 5 ; $0++){
    //ee
    console.log('hello $клюква!');
}
var $1, $клюква, $hello;
;$клюква=4;
#USAGE_END#loop##

#ENUM#My_enum:q,w,ee##
#ENUM#My_enum2:q,w,ee,a##
#MASK#My_mask:q,w,ee##
#MASK#My_mask2:q,w,ee,a##
#a#ok##
#a#ok##
#a#not_ok##
#a#ok##

//#MASK#My_enum:q,w,ee##

var $клюква = #e#My_enum:ee##
if ($клюква & #e#My_enum##)
    console.log('Клюква!');
#e#My_enum##
#e#My_enum:w,ee##
#e#My_enum:w##
#e#My_enum2:a##
//#e#My_enum:a##

var $клюква = #e#My_mask:ee##
if ($клюква & #e#My_mask##)
    console.log('Клюква!');
#e#My_mask##
#e#My_mask:w,ee##
#e#My_mask:w##
#e#My_mask2:a##
//#e#My_mask:a##


#m#My_mask:q##
//#m#My_mask:w##
//#m#My_mask:ee##
//#m#My_mask:a##
//#m#My_mask:q,w,ee##

