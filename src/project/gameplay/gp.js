//hello from gp.js

$Traliva.$debug = {
    $state: true
};
var $o = {
    $target: 'web',
    $get_layout:function($w, $h, $target){
        return '$lay_1';
    },
    $layouts:{
        $lay_1:{
            $type: '$strip',
            $orient: 'v',
            $items:['dd','aa']
        }
    }
};
$Traliva.$init($o);
