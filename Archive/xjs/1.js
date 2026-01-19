try{
s_e("sym8");
/*

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/
var s_yz=function(a,b,c){s_Kg.call(this);this.ud=null;this.oa=!1;this.Rn=a;this.wa=c;this.ka=b||window;this.Yf=s_d(this.J6b,this)};s_p(s_yz,s_Kg);s_=s_yz.prototype;s_.start=function(){this.stop();this.oa=!1;var a=s_Kpc(this),b=s_Lpc(this);a&&!b&&this.ka.mozRequestAnimationFrame?(this.ud=s_F(this.ka,"MozBeforePaint",this.Yf),this.ka.mozRequestAnimationFrame(null),this.oa=!0):this.ud=a&&b?a.call(this.ka,this.Yf):this.ka.setTimeout(s_ofa(this.Yf),20)};
s_.stop=function(){if(this.jj()){var a=s_Kpc(this),b=s_Lpc(this);a&&!b&&this.ka.mozRequestAnimationFrame?s_Vg(this.ud):a&&b?b.call(this.ka,this.ud):this.ka.clearTimeout(this.ud)}this.ud=null};s_.jj=function(){return null!=this.ud};s_.J6b=function(){this.oa&&this.ud&&s_Vg(this.ud);this.ud=null;this.Rn.call(this.wa,s_$c())};s_.Mb=function(){this.stop();s_yz.Gc.Mb.call(this)};
var s_Kpc=function(a){a=a.ka;return a.requestAnimationFrame||a.webkitRequestAnimationFrame||a.mozRequestAnimationFrame||a.oRequestAnimationFrame||a.msRequestAnimationFrame||null},s_Lpc=function(a){a=a.ka;return a.cancelAnimationFrame||a.cancelRequestAnimationFrame||a.webkitCancelRequestAnimationFrame||a.mozCancelRequestAnimationFrame||a.oCancelRequestAnimationFrame||a.msCancelRequestAnimationFrame||null};

s_f();

}catch(e){_DumpException(e)}
try{
var s_Mpc=function(a){return 0<a?1:0>a?-1:a},s_Npc=function(a){return Math.sqrt(a.x*a.x+a.y*a.y)};s_e("sym9");
/*

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/
var s_Opc={},s_Ppc=null,s_zz=null,s_Az=function(a){var b=s_va(a);b in s_Opc||(s_Opc[b]=a);s_Qpc()},s_Bz=function(a){a=s_va(a);delete s_Opc[a];s_ld(s_Opc)&&s_zz&&s_zz.stop()},s_Rpc=function(){var a=s_zz&&s_zz.jj();s_Ga(s_zz);s_zz=null;s_Ppc=s_Ia;a&&s_Qpc()},s_Qpc=function(){s_zz||(s_Ppc?s_zz=new s_yz(function(b){s_Spc(b)},s_Ppc):s_zz=new s_Sc(function(){s_Spc(s_$c())},20));var a=s_zz;a.jj()||a.start()},s_Spc=function(a){s_id(s_Opc,function(b){b.Vj(a)});s_ld(s_Opc)||s_Qpc()};

s_f();

}catch(e){_DumpException(e)}
try{
s_e("sy1a2");

s_f();

}catch(e){_DumpException(e)}
try{
s_e("NVUNBd");
var s_MV=function(a,b){b=void 0===b?!0:b;s_j.call(this,a.Ja);var c=this;this.context=s_SCh();this.canvas=this.context.canvas;b&&(a=document.body,a.insertBefore(this.canvas,a.firstElementChild));s_G(this.canvas,"uOSdRb");s_F(s_fg(),"resize",function(){c.pP()});s_Ti(function(){c.pP()},0);this.Sa=window.AudioContext?new window.AudioContext:window.webkitAudioContext?new window.webkitAudioContext:null;this.Kb={};this.Wa={};this.Tb=0;this.ub=Date.now();s_Az(this)};s_m(s_MV,s_j);s_MV.Fa=s_j.Fa;s_=s_MV.prototype;
s_.nb=function(){s_j.prototype.nb.call(this);s_Bz(this)};s_.pP=function(){var a=s_ag();this.canvas.width=a.width;this.canvas.height=a.height;this.Vj(Date.now())};s_.Vj=function(a){for(var b=Math.max(20,(a-this.ub)/10);this.ub+b<=a;)this.ub+=b,this.update(b);this.render(this.ub)};s_.update=function(){};s_.render=function(){};
s_.$i=function(a){a="https://www.google.com/logos/fnbx/"+a;if(null===this.Sa)s_TCh(this,a).play();else if(this.Kb[a]){var b=this.Sa.createBufferSource();b.buffer=this.Kb[a];b.connect(this.Sa.destination);(window.AudioContext||window.webkitAudioContext)&&b.start(0)}};
var s_UCh=function(a,b){if(null!==a.Sa){var c="https://www.google.com/logos/fnbx/"+b;b=new s_ll;b.oa="arraybuffer";s_Tg(b,"complete",function(d){d=d.target;if(!d.Ih())throw Error("mg");d=d.getResponse();null!==a.Sa&&a.Sa.decodeAudioData(d,function(e){a.Kb[c]=e})});b.send(c,"GET")}},s_TCh=function(a,b){var c=a.Ha().el(),d=s_ig("AUDIO");s_Xl(d,b);c.appendChild(d);s_Wl(a).Ni(d,"ended",function(){c.removeChild(d)});return d};
s_MV.prototype.Mfa=function(a,b){var c=this;b=void 0===b?null:b;var d=new Image;s_Wl(this).Ni(d,"load",function(){c.Wa[a]=d;c.Tb--;b&&b(d)});d.crossOrigin="Anonymous";d.src="https://www.google.com/logos/fnbx/"+a;this.Tb++};s_MV.prototype.m3b=function(){return 0<this.Tb};var s_SCh=function(a,b){a=void 0===a?0:a;b=void 0===b?0:b;var c=s_ig("CANVAS"),d=c.getContext("2d");0<a&&0<b&&(c.width=a,c.height=b);return d};s_P(s_MV.prototype,"N0E2af",function(){return this.m3b});s_P(s_MV.prototype,"RO68ed",function(){return this.pP});
s_P(s_MV.prototype,"k4Iseb",function(){return this.nb});s_2l(s_MV);

s_f();

}catch(e){_DumpException(e)}
try{
s_e("dR0r0b");
var s_2Ch=s_Me?250:1E3,s_3Ch=s_Me?4.5:3.5,s_4Ch=function(a){s_MV.call(this,a.Ja,!1);this.Jb=this.Ha().el();this.Ca=this.Da("cxGMKc").el();this.Ba=this.Da("eSFRkb").el();this.Ga=this.Da("qam9Gc").$d();this.oa=this.Da("IZiAje").$d();this.Ea=this.Da("k1HHBb").el();this.wa=document.body;this.ka={rK:new s_Yf(0,0),PO:new s_Yf(0,0),Ffa:1,N1:1,D_b:-1,kDa:new s_Yf(0,0),oxb:1,Hsa:-1,Cna:-1,width:0,j6:!1};this.Aa=!1};s_m(s_4Ch,s_MV);s_4Ch.Fa=s_MV.Fa;
s_4Ch.prototype.yr=function(){var a=this;if(!this.Aa){s_T(this.Jb,{interactionContext:0});this.Aa=!0;s_G(this.Ea,"jVTE2c");s_I(this.Jb,"cursor","default");var b=s_7h(this.Jb);s_6h(this.oa,b);this.ka.width=b.width;this.ka.Ffa=1;this.ka.N1=1;s_I(this.Ga,"display","none");s_I(this.oa,"display","initial");s_I(this.Ca,"display","initial");s_I(this.Ba,"display","initial");b=s_5Ch(this);s_Vh(this.oa,b);this.ka.rK=b.clone();this.ka.PO=b.clone();this.ka.j6=!1;b=Date.now();this.ka.D_b=b;this.ka.kDa.x=2*Math.random()*
Math.PI;this.ka.kDa.y=2*Math.random()*Math.PI;this.ka.oxb=.9+.2*Math.random();s_6Ch(this,b);s_G(this.wa,"VYrSid");s_Ti(function(){s_I(a.Ca,"bottom",0);s_G(a.wa,"XGAhB");s_G(a.wa,"XhTkX");s_G(a.Ba,"xMgSBd")},0)}};
s_4Ch.prototype.m7=function(){if(this.Aa&&!this.ka.j6){s_H(this.Ea,"jVTE2c");this.ka.j6=!0;var a=Date.now(),b=s_7Ch((a-this.ka.Hsa)/this.ka.Cna);this.ka.rK=new s_Yf(this.ka.rK.x*(1-b)+this.ka.PO.x*b,this.ka.rK.y*(1-b)+this.ka.PO.y*b);this.ka.Hsa=a;this.ka.Cna=1500;this.ka.Ffa=this.ka.Ffa*(1-b)+this.ka.N1*b;this.ka.N1=1;s_I(this.Ca,"bottom","");s_H(this.wa,"XhTkX");s_H(this.Ba,"xMgSBd")}};
var s_8Ch=function(a){s_I(a.oa,"display","none");s_I(a.Ga,"display","initial");s_Ti(function(){s_I(a.Ca,"display","none");s_I(a.Ba,"display","none");s_H(a.wa,"VYrSid");s_H(a.wa,"XGAhB");s_I(a.Jb,"cursor","pointer");a.Aa=!1},1E3)};
s_4Ch.prototype.render=function(a){if(this.Aa&&s_ai(this.oa)&&a>this.ka.Hsa){var b=(a-this.ka.Hsa)/this.ka.Cna;if(1>b){var c=s_7Ch(b),d=this.ka.Ffa*(1-c)+this.ka.N1*c,e=this.ka.j6?s_5Ch(this):this.ka.PO;c=new s_Yf(this.ka.rK.x*(1-c)+e.x*c,this.ka.rK.y*(1-c)+e.y*c);a-=this.ka.D_b;e=1;this.ka.j6?e=1-b:1E3>a&&(e=a/1E3);var f=3*this.ka.width/4;a=new s_Yf(Math.cos(a/(1E3*this.ka.oxb)+this.ka.kDa.x)*f*e*d,Math.sin(a/1E3+this.ka.kDa.y)*f*e*d);c.x+=a.x;c.y+=a.y;s_Vh(this.oa,c);b=s_7Ch(b/2);s_I(this.oa,"transform",
"rotate("+30*Math.min(s_2Ch,Math.abs(this.ka.PO.x-this.ka.rK.x))/s_2Ch*Math.sin(2*Math.PI*(0===b||1===b?0:-b*Math.log2(b)-(1-b)*Math.log2(1-b)))*Math.sign(this.ka.PO.x-this.ka.rK.x)+"deg) scale("+d+")")}else this.ka.j6?(this.ka.j6=!1,s_8Ch(this)):s_6Ch(this,a)}};
var s_5Ch=function(a){var b=a.Jb.getBoundingClientRect();a=a.Ba.getBoundingClientRect();return new s_Yf(b.left-a.left,b.top-a.top)},s_6Ch=function(a,b){if(a.ka.rK.equals(a.ka.PO)){a.ka.Ffa=a.ka.N1;a.ka.N1=1+1.25*Math.random();var c=s_ag(),d=a.ka.width*a.ka.N1*1.25;a.ka.PO=new s_Yf(Math.random()*(c.width-2*d)+d,Math.random()*(c.height-2*d-100)+d);a.ka.Cna=Math.max(1E3,s_Zf(a.ka.rK,a.ka.PO)*s_3Ch*(1+.2*Math.random()*(.5>Math.random()?1:-1)))}else c=s_Zf(a.ka.rK,a.ka.PO),a.ka.rK=a.ka.PO.clone(),a.ka.Ffa=
a.ka.N1,a.ka.Cna=Math.min(1500,Math.max(250,250/c*1500));a.ka.Hsa=b},s_7Ch=function(a){return.5>a?2*a*a:-1+(4-2*a)*a};s_P(s_4Ch.prototype,"yZGKvf",function(){return this.m7});s_P(s_4Ch.prototype,"uG8GZb",function(){return this.yr});s_R(s_pIa,s_4Ch);

s_f();

}catch(e){_DumpException(e)}
// Google Inc.
