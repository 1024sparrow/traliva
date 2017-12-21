'use strict';

/*
  set 1
  rem 1
    set 2
    rem 2
  show 1
  hide 1
    show 1
    hide 2
*/

var wSlot;
//var w1, w2;

function onBnSet1Clicked(){
    wSlot.setContent('w_1', createWidget1());
}
function onBnRem1Clicked(){
    wSlot.removeContent('w_1');
}
function onBnSet2Clicked(){
    wSlot.setContent('w_2', createWidget2());
}
function onBnRem2Clicked(){
    wSlot.removeContent('w_2');
}
function onBnShow1Clicked(){
    var w = wSlot.widget('w_1');
    if (w)
        w.setVisible(true);
    else
        console.log('widget "w_1" not set');
}
function onBnHide1Clicked(){
    var w = wSlot.widget('w_1');
    if (w)
        w.setVisible(false);
    else
        console.log('widget "w_1" not set');
}
function onBnShow2Clicked(){
    var w = wSlot.widget('w_2');
    if (w)
        w.setVisible(true);
    else
        console.log('widget "w_2" not set');
}
function onBnHide2Clicked(){
    var w = wSlot.widget('w_2');
    if (w)
        w.setVisible(false);
    else
        console.log('widget "w_2" not set');
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~
var wRoot = new Traliva.Strip(Traliva.Strip__Orient__hor);

var eButtons = document.createElement('div');
eButtons.id = 'buttons_group'

var eBn = document.createElement('div');
eBn.innerHTML = '<p>set 1</p>';
eBn.id = 'set_1';
eBn.className = 'bn';
eBn.onclick = onBnSet1Clicked;
eButtons.appendChild(eBn);

eBn = document.createElement('div');
eBn.innerHTML = '<p>rem 1</p>';
eBn.id = 'rem_1';
eBn.className = 'bn';
eBn.onclick = onBnRem1Clicked;
eButtons.appendChild(eBn);

eBn = document.createElement('div');
eBn.innerHTML = '<p>set 2</p>';
eBn.id = 'set_2';
eBn.className = 'bn';
eBn.onclick = onBnSet2Clicked;
eButtons.appendChild(eBn);

eBn = document.createElement('div');
eBn.innerHTML = '<p>rem 2</p>';
eBn.id = 'rem_2';
eBn.className = 'bn';
eBn.onclick = onBnRem2Clicked;
eButtons.appendChild(eBn);

eBn = document.createElement('div');
eBn.innerHTML = '<p>show 1</p>';
eBn.id = 'show_1';
eBn.className = 'bn';
eBn.onclick = onBnShow1Clicked;
eButtons.appendChild(eBn);

eBn = document.createElement('div');
eBn.innerHTML = '<p>hide 1</p>';
eBn.id = 'hide_1';
eBn.className = 'bn';
eBn.onclick = onBnHide1Clicked;
eButtons.appendChild(eBn);

eBn = document.createElement('div');
eBn.innerHTML = '<p>show 2</p>';
eBn.id = 'show_2';
eBn.className = 'bn';
eBn.onclick = onBnShow2Clicked;
eButtons.appendChild(eBn);

eBn = document.createElement('div');
eBn.innerHTML = '<p>hide 2</p>';
eBn.id = 'hide_2';
eBn.className = 'bn';
eBn.onclick = onBnHide2Clicked;
eButtons.appendChild(eBn);

document.body.appendChild(eButtons);
var wButtons = new Traliva.Widget(wRoot);
wButtons.setContent(eButtons, '#fff');
wRoot.addItem(wButtons, '128px');

wSlot = new Traliva.SlotWidget(wRoot);
wSlot._div.style.background = '#fff';
wRoot.addItem(wSlot);
//~~~~~~~~~~~~ widget 1 ~~~~~~~~~~~~
function createWidget1(){
    var eWidget1 = document.createElement('div');
    eWidget1.innerHTML = '<p>1:</p><input type="text" value="1111"></input>';
    var w1 = new Traliva.Widget(wSlot);
    w1.setContent(eWidget1);
    return w1;
    //wSlot.addItem(w1);
}
//~~~~~~~~~~~~ widget 2 ~~~~~~~~~~~~
function createWidget2(){
    var eWidget2 = document.createElement('div');
    eWidget2.innerHTML = '<p style="margin:128px 0 0 0">2:</p><input type="text" value="2222"></input>';
    var w2 = new Traliva.Widget(wSlot);
    w2.setContent(eWidget2);
    return w2;
    //wSlot.addItem(w2);
}
