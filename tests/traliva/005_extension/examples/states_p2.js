'use strict';

var wRoot = new B.Strip(B.Strip__Orient__vert, EXTERNAL.canvas);
var wContentsHeader = new B.Strip(B.Strip__Orient__hor, wRoot);
var wGameplay = new B.Stack(wRoot);
var wText = new B.Widget(wGameplay, 'v');
var wContents = new B.Widget(wGameplay, 'v');
wGameplay.addItem(wText);
wGameplay.addItem(wContents);
wRoot.addItem(wContentsHeader, EXTERNAL.scope.CONTENTS_BUTTON_GEOMETRY.h+'px');
wRoot.addItem(wGameplay);

//wContentsHeader.setContent(undefined, '#f00');//
var wContentsButton = new B.Widget(wContentsHeader);
var wContentsTitle = new B.Widget(wContentsHeader);
wContentsHeader.addItem(wContentsButton, EXTERNAL.scope.CONTENTS_BUTTON_GEOMETRY.w+'px');
wContentsHeader.addItem(wContentsTitle);
/*wContentsHeader._onResized = function(w,h){
    //if (w < 699){
    if (w > 699){
        wContentsButton.setItemSize({0:'49px', 1:(w - 49)+'px'});
    }
}*/

EXTERNAL.canvas.setContent(wRoot);
EXTERNAL.subscribers.push(new B.StateToUriMapper(EXTERNAL.scope.states).useSubstate('page'));
EXTERNAL.subscribers.push(new EXTERNAL.scope.Text(wText).useSubstate('page'));
EXTERNAL.subscribers.push(new EXTERNAL.scope.Contents(wContents, EXTERNAL.scope.states).useSubstate('page'));
EXTERNAL.subscribers.push(new EXTERNAL.scope.ContentsButton(wContentsButton).useSubstate('page'));
EXTERNAL.subscribers.push(new EXTERNAL.scope.Title(wContentsTitle).useSubstate('page'));

/*var eDebug = document.createElement('div');
var wDebug = new B.Widget(wRoot);
wDebug.setContent(eDebug, '#000');
wRoot.addItem(wDebug, '300px');
p.registerSubscriber(new B.StateDebugWidget(eDebug));*/
console.log('2.js executed');
