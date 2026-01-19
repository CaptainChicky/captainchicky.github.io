/* 
* This .js file helps animate the robot, but other than that I don't understand the code below at all lol, so I'll analyze this in the future xD. <It's from a scam page btw> kek
*/

"use strict";
$(document).ready(function(){I(),setInterval(function(){I()},5e3);

var e=document.getElementById("armLeft"),t=document.getElementById("armRight"),s=document.getElementById("eyeNormal"),i=document.getElementById("eyeBlink"),
a=document.getElementById("rHeadBox"),d=document.getElementById("mouth1"),m=document.getElementById("mouth2"),n=document.getElementById("mouth3"),o=document.getElementById("rBodyBox"),c=!1;

setInterval(function(){c=c?(o.classList.remove("rAnim"),a.classList.remove("rAnim"),!1):(o.classList.add("rAnim"),a.classList.add("rAnim"),!0)},4e3),
setInterval(function(){setTimeout(function(){s.classList.add("hide"),i.classList.add("showBlock")},0),setTimeout(function(){s.classList.remove("hide"),i.classList.remove("showBlock")},300)},5e3);

var l,r,u=0;

function h(){l&&L(),l=setInterval(function(){0===u?(d.classList.add("hide"),m.classList.remove("hide"),n.classList.add("hide")):1===u?(d.classList.add("hide"),
m.classList.add("hide"),n.classList.remove("hide")):2===u?(d.classList.add("hide"),m.classList.remove("hide"),n.classList.add("hide")):3===u&&(d.classList.remove("hide"),
m.classList.add("hide"),n.classList.add("hide")),3<++u&&(u=0)},170),r=setTimeout(function(){L()},1701)}function L(){clearInterval(l),clearTimeout(r),u=0,$("#mouth1").removeClass("hide"),
$("#mouth2").removeClass("hide"),$("#mouth3").removeClass("hide")}var v,f=!1,g=!1;

function I(){h(),g||(g=!0,$("#armRight").addClass("armRightAnim"),$("#armLeft").addClass("armRightAnim"),f=!0,
v=setInterval(function(){f?(f=!1,t.classList.remove("armRightAnim"),e.classList.remove("armLeftAnim")):(f=!0,t.classList.add("armRightAnim"),
e.classList.add("armLeftAnim"))},250),setTimeout(function(){clearInterval(v),L(),t.classList.remove("armRightAnim"),e.classList.remove("armLeftAnim"),g=!1},1750))}});