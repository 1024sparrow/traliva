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
var w1, w2;

function onBnSet1Clicked(){
}
function onBnRem1Clicked(){
}
function onBnSet2Clicked(){
}
function onBnRem2Clicked(){
}
function onBnShow1Clicked(){
}
function onBnHide1Clicked(){
}
function onBnShow2Clicked(){
}
function onBnHide2Clicked(){
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
wRoot.addItem(wSlot);
//~~~~~~~~~~~~ widget 1 ~~~~~~~~~~~~
var eWidget1 = document.createElement('div');
eWidget1.innerHTML = '<p>1:</p><input type="text" value="abc"></input>';
w1 = new Traliva.Widget(wSlot);
w1.setContent(eWidget1);
wSlot.addItem(w1);
//~~~~~~~~~~~~ widget 2 ~~~~~~~~~~~~
var eWidget2 = document.createElement('div');
eWidget2.innerHTML = '<p>2:</p><input type="text" value="abc"></input>';
w2 = new Traliva.Widget(wSlot);
w2.setContent(eWidget2);
wSlot.addItem(w2);
