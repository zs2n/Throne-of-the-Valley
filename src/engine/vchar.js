/* ===== Vector characters: smooth, shaded, animated (replaces pixel sprites) =====
   figure(): full body, feet at (0,0), about 100 units tall, drawn in a transformed context.
   Animation is driven by time: breathing, blinking, head sway, talking mouth, hand gestures, walking. */
const VC=(()=>{
const hexc=h=>{h=h.replace('#','');if(h.length===3)h=[...h].map(c=>c+c).join('');const n=parseInt(h,16);return[n>>16&255,n>>8&255,n&255]};
const mc=new Map();
const mix=(a,b,t)=>{const k=a+b+t;let v=mc.get(k);if(v)return v;const A=hexc(a),B=hexc(b);v='#'+[0,1,2].map(i=>Math.round(A[i]+(B[i]-A[i])*t).toString(16).padStart(2,'0')).join('');mc.set(k,v);return v};
const dk=(c,t)=>mix(c,'#0e0712',t),lt=(c,t)=>mix(c,'#fff1d8',t);
const hash=s=>{let h=7;for(const ch of s)h=(h*31+ch.charCodeAt(0))>>>0;return h};
const LG=(x,x0,y0,x1,y1,st)=>{const g=x.createLinearGradient(x0,y0,x1,y1);st.forEach(([o,c])=>g.addColorStop(o,c));return g};
const RG=(x,cx,cy,r0,r1,st)=>{const g=x.createRadialGradient(cx,cy,r0,cx,cy,r1);st.forEach(([o,c])=>g.addColorStop(o,c));return g};
const OUT=.75;
function fillStroke(x,fill,stroke,lw){x.fillStyle=fill;x.fill();if(stroke){x.lineWidth=lw||OUT;x.strokeStyle=stroke;x.lineJoin='round';x.stroke()}}
function ell(x,cx,cy,rx,ry,rot){x.beginPath();x.ellipse(cx,cy,Math.max(.01,rx),Math.max(.01,ry),rot||0,0,Math.PI*2)}
/* thick limb: stroke along a polyline with round caps (outline first, then fill, then soft highlight) */
function limb(x,pts,w,col,edge){x.lineCap='round';x.lineJoin='round';x.beginPath();pts.forEach((p,i)=>i?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1]));
 x.strokeStyle=edge;x.lineWidth=w+1.5;x.stroke();x.strokeStyle=col;x.lineWidth=w;x.stroke();
 x.strokeStyle=lt(col,.18);x.globalAlpha=.55;x.lineWidth=w*.28;x.save();x.translate(-w*.22,0);x.stroke();x.restore();x.globalAlpha=1}

function figure(x,c,o){
 const t=o.t||0,Q=o.facing!=='f',seated=!!o.seated,ph=(o.ph||0),walk=o.walk||0;
 const E=o.expr||'neutral';
 const skin=c.skin,hair=c.hair||'#3a2418',beardC=c.beard||hair,robe=c.robe,trim=c.trim||'#c9a24a';
 const breath=Math.sin(t/980+ph)*.55,sway=Math.sin(t/2300+ph*1.7)*.6;
 const bob=walk?Math.abs(Math.sin(walk))*1.7:0;
 const stride=walk?Math.sin(walk):0;
 const blinkAt=((t+ph*997)%4300);const blink=blinkAt<130?Math.sin(blinkAt/130*Math.PI):0;
 const talk=o.talk?.5+.5*Math.sin(t/105+ph*3):0;
 const gest=o.gest||0;
 /* skeleton */
 const sw=Q?11.4:14.2,ww=Q?9.4:11.2,hem=seated?-11:-7,hw=Q?(seated?15:16.5):(seated?17:19);
 const bx=Q?-.8:0,shY=-73.5+breath*.35,wsY=-52+breath*.12;
 const hx=(Q?1.5:0)+sway*.35,hy=-88.2+breath*.3-bob*.6,ry=9.2,rx=7.5;
 const neckY=-76;
 const metal='#a8b1be',gold='#e3b54e';
 const robeL=lt(robe,.2),robeD=dk(robe,.34),robeE=dk(robe,.62);
 /* ---------- shadow ---------- */
 if(!o.noShadow){x.save();x.translate(0,.6);x.scale(1,.2);x.fillStyle=RG(x,0,0,2,hw+8,[[0,'rgba(0,0,0,.5)'],[1,'rgba(0,0,0,0)']]);x.beginPath();x.arc(0,0,hw+8,0,7);x.fill();x.restore()}
 /* ---------- back items ---------- */
 if(c.item==='bow'){x.save();x.lineCap='round';x.strokeStyle='#4a2c14';x.lineWidth=1.6;x.beginPath();x.moveTo(-sw-1,shY-4);x.quadraticCurveTo(-sw-9,-48,-sw+1,-18);x.stroke();x.strokeStyle='rgba(235,225,200,.8)';x.lineWidth=.35;x.beginPath();x.moveTo(-sw-1,shY-4);x.lineTo(-sw+1,-18);x.stroke();x.restore()}
 /* ---------- cape ---------- */
 if(c.cape){const cs=Math.sin(t/700+ph)*1.4+stride*2;x.beginPath();x.moveTo(bx-sw+1,shY);x.quadraticCurveTo(bx-sw-5,-45,bx-hw-5+cs,hem+3);x.quadraticCurveTo(bx,hem+7,bx+hw+3+cs,hem+3);x.quadraticCurveTo(bx+sw+4,-45,bx+sw-1,shY);x.closePath();
  fillStroke(x,LG(x,-hw,0,hw,0,[[0,lt(c.cape,.12)],[.5,c.cape],[1,dk(c.cape,.4)]]),dk(c.cape,.65));
  x.strokeStyle=dk(c.cape,.45);x.lineWidth=.5;x.globalAlpha=.6;for(const f of[-.45,.1,.55]){x.beginPath();x.moveTo(bx+f*sw,shY+4);x.quadraticCurveTo(bx+f*hw*1.1,-38,bx+f*hw*1.35+cs*.6,hem+4);x.stroke()}x.globalAlpha=1}
 /* ---------- back hair / hood / veil ---------- */
 const longH=c.hs===2&&!['helm'].includes(c.hat);
 if(longH){x.beginPath();x.moveTo(hx-rx-1,hy-3);x.quadraticCurveTo(hx-rx-5.5,hy+14,hx-sw-.5,-63);x.quadraticCurveTo(hx,-60+breath*.3,hx+sw+.5,-63);x.quadraticCurveTo(hx+rx+5.5,hy+14,hx+rx+1,hy-3);x.quadraticCurveTo(hx,hy-ry-4.2,hx-rx-1,hy-3);x.closePath();
  fillStroke(x,LG(x,hx-rx,0,hx+rx,0,[[0,lt(hair,.14)],[.5,hair],[1,dk(hair,.35)]]),dk(hair,.6))}
 if(c.hat==='hood'||c.hat==='veil'){const hc=c.hatc||robe;x.beginPath();x.moveTo(hx-rx-2.5,hy-1);x.quadraticCurveTo(hx-rx-6.5,hy+12,hx-sw-3,shY+3);x.lineTo(hx+sw+3,shY+3);x.quadraticCurveTo(hx+rx+6.5,hy+12,hx+rx+2.5,hy-1);x.quadraticCurveTo(hx,hy-ry-6.5,hx-rx-2.5,hy-1);x.closePath();
  fillStroke(x,LG(x,hx-rx,0,hx+rx,0,[[0,lt(hc,.14)],[.5,hc],[1,dk(hc,.4)]]),dk(hc,.62))}
 /* ---------- legs and boots ---------- */
 if(!seated){const lift=a=>Math.max(0,a)*2.4;const L=[[-4.4+bx-stride*2.6,lift(-stride)],[4.4+bx+stride*2.6,lift(stride)]];
  L.forEach(([lx,up],i)=>{x.beginPath();x.moveTo(lx-2.9,hem-1);x.lineTo(lx+2.9,hem-1);x.lineTo(lx+3.2,-up-1.2);x.quadraticCurveTo(lx+(Q?5.8:3.8),-up+.4,lx+(Q?5.8:3.8),-up);x.lineTo(lx-3.3,-up);x.quadraticCurveTo(lx-3.8,-up-2.6,lx-2.9,hem-1);x.closePath();
   fillStroke(x,LG(x,lx-3,0,lx+4,0,[[0,'#5a4030'],[1,'#241812']]),'#120a08')})}
 else{for(const lx of[-5+bx,5.5+bx]){ell(x,lx+1,-2.2,4.4,2.4);fillStroke(x,'#2e1f16','#120a08')}}
 /* ---------- sword scabbard (behind robe edge) ---------- */
 if(c.item==='sword'){x.save();x.translate(bx-ww-.5,wsY+2);x.rotate(.2);x.beginPath();x.moveTo(-1.1,0);x.lineTo(1.1,0);x.lineTo(1.3,24);x.lineTo(-1.3,24);x.closePath();fillStroke(x,'#3a2418','#120a08',.5);x.fillStyle=gold;x.fillRect(-1.5,22.4,3,2.4);x.restore()}
 /* ---------- back arm (three-quarter shows a sliver) ---------- */
 const handFX=Q?bx+sw-1.2:bx+sw+3,handFY=-46-gest*7-breath*.2;
 if(Q){limb(x,[[bx-sw+1.4,shY+2],[bx-sw-.8,-61],[bx-sw+.6,-47]],4.4,robeD,robeE);ell(x,bx-sw+.6,-45.2,2.1,2.4);fillStroke(x,dk(skin,.2),dk(skin,.6),.5)}
 else{limb(x,[[bx-sw+1,shY+2],[bx-sw-2.2,-60],[bx-sw-.6,-46]],4.8,robe,robeE);ell(x,bx-sw-.6,-44.2,2.3,2.5);fillStroke(x,skin,dk(skin,.55),.5)}
 /* ---------- robe ---------- */
 x.beginPath();x.moveTo(bx-4.2,neckY+.6);x.quadraticCurveTo(bx-sw+1,shY-1.2,bx-sw,shY+2);x.quadraticCurveTo(bx-ww-.8,-62,bx-ww,wsY);x.quadraticCurveTo(bx-hw*.8,-30,bx-hw,hem);
 x.quadraticCurveTo(bx-hw*.5,hem+2.2,bx,hem+1.2);x.quadraticCurveTo(bx+hw*.5,hem+2.2,bx+hw,hem);x.quadraticCurveTo(bx+hw*.8,-30,bx+ww,wsY);x.quadraticCurveTo(bx+ww+.8,-62,bx+sw,shY+2);x.quadraticCurveTo(bx+sw-1,shY-1.2,bx+4.2,neckY+.6);x.quadraticCurveTo(bx,neckY+3.2,bx-4.2,neckY+.6);x.closePath();
 fillStroke(x,LG(x,bx-hw,0,bx+hw,0,[[0,robeL],[.38,robe],[1,robeD]]),robeE);
 /* folds */
 x.save();x.clip();x.lineCap='round';
 for(const[f,a]of[[-.55,.28],[-.15,.2],[.28,.3],[.62,.22]]){x.strokeStyle=robeE;x.globalAlpha=a;x.lineWidth=.9;x.beginPath();x.moveTo(bx+f*ww,wsY+3);x.quadraticCurveTo(bx+f*hw*.95+Math.sin(t/1400+f)*.3,-30,bx+f*hw*1.18,hem+1);x.stroke()}
 x.globalAlpha=.16;x.fillStyle='#000';x.fillRect(bx-hw,hem-14,hw*2,20);
 x.globalAlpha=1;x.restore();
 /* hem trim */
 x.beginPath();x.moveTo(bx-hw+.2,hem-.8);x.quadraticCurveTo(bx-hw*.5,hem+1.4,bx,hem+.4);x.quadraticCurveTo(bx+hw*.5,hem+1.4,bx+hw-.2,hem-.8);x.lineTo(bx+hw-.5,hem-3.6);x.quadraticCurveTo(bx+hw*.5,hem-1.6,bx,hem-2.5);x.quadraticCurveTo(bx-hw*.5,hem-1.6,bx-hw+.5,hem-3.6);x.closePath();fillStroke(x,LG(x,bx-hw,0,bx+hw,0,[[0,lt(trim,.15)],[1,dk(trim,.3)]]),dk(trim,.6),.4);
 /* front opening */
 x.strokeStyle=dk(trim,.25);x.lineWidth=.8;x.beginPath();x.moveTo(bx+(Q?1.2:0),neckY+3);x.lineTo(bx+(Q?1.6:0),hem-3);x.stroke();
 /* armor plates */
 if(c.armor){x.beginPath();x.moveTo(bx-sw+1.4,shY+1);x.quadraticCurveTo(bx,shY-2.5,bx+sw-1.4,shY+1);x.lineTo(bx+ww-.4,-55);x.quadraticCurveTo(bx,-51.5,bx-ww+.4,-55);x.closePath();fillStroke(x,LG(x,bx-sw,0,bx+sw,0,[[0,lt(metal,.35)],[.45,metal],[1,dk(metal,.5)]]),dk(metal,.65));
  x.strokeStyle=dk(metal,.4);x.lineWidth=.5;x.beginPath();x.moveTo(bx,shY-1);x.lineTo(bx,-52);x.stroke();x.fillStyle=dk(metal,.5);for(const[rx2,ry2]of[[-5,-70],[5,-70],[-4,-60],[4,-60]])x.fillRect(bx+rx2-.4,ry2,.8,.8);
  for(const s of[-1,1]){ell(x,bx+s*(sw-.6),shY+2.6,4.4,3.2,s*.4);fillStroke(x,LG(x,bx+s*sw-4,0,bx+s*sw+4,0,[[0,lt(metal,.3)],[1,dk(metal,.45)]]),dk(metal,.65),.6)}}
 /* neckline trim */
 x.beginPath();x.moveTo(bx-5.2,neckY+.2);x.quadraticCurveTo(bx,neckY+5.8,bx+5.2,neckY+.2);x.lineTo(bx+4,neckY+.2);x.quadraticCurveTo(bx,neckY+3.4,bx-4,neckY+.2);x.closePath();fillStroke(x,trim,dk(trim,.6),.4);
 /* belt */
 const by=wsY-1.5;x.beginPath();x.moveTo(bx-ww-.2,by);x.lineTo(bx+ww+.2,by);x.lineTo(bx+ww+.4,by+3.1);x.lineTo(bx-ww-.4,by+3.1);x.closePath();fillStroke(x,LG(x,0,by,0,by+3,[[0,'#6a4628'],[1,'#3a2414']]),'#1c0e08',.45);
 x.fillStyle=gold;x.strokeStyle=dk(gold,.6);x.lineWidth=.4;x.beginPath();x.rect(bx+(Q?1:0)-1.5,by-.3,3,3.7);x.fill();x.stroke();
 if(c.item==='sword'){const sx=bx-ww-.4;x.fillStyle=gold;x.fillRect(sx-2.2,by-3.6,4.4,1.2);x.fillStyle='#2e1a10';x.fillRect(sx-.6,by-8,1.2,4.4);x.fillStyle=gold;x.beginPath();x.arc(sx,by-8.4,1.1,0,7);x.fill()}
 /* ---------- neck ---------- */
 x.beginPath();x.moveTo(hx-3.1,hy+ry-3);x.lineTo(hx+3.1,hy+ry-3);x.lineTo(bx+3.8,neckY+2.4);x.quadraticCurveTo(bx,neckY+4.6,bx-3.8,neckY+2.4);x.closePath();
 fillStroke(x,LG(x,hx-3.4,0,hx+3.4,0,[[0,skin],[1,dk(skin,.3)]]),dk(skin,.55),.5);
 x.fillStyle='rgba(30,10,10,.22)';x.beginPath();x.ellipse(hx+.4,hy+ry-.4,4.4,2,0,0,Math.PI);x.fill();
 /* ---------- head ---------- */
 const earL=Q?hx-rx+.4:hx-rx-.2;
 for(const side of(Q?[-1]:[-1,1])){ell(x,hx+side*(rx-.1)+(Q?0:0),hy+1.6,1.5,2.5);fillStroke(x,dk(skin,.12),dk(skin,.55),.45)}
 x.beginPath();x.moveTo(hx,hy-ry);x.bezierCurveTo(hx+rx+.8,hy-ry,hx+rx+.9,hy-ry*.15,hx+rx-.4,hy+ry*.28);x.bezierCurveTo(hx+rx-1.6,hy+ry*.78,hx+2.6,hy+ry+.3,hx,hy+ry+.3);
 x.bezierCurveTo(hx-2.6,hy+ry+.3,hx-rx+1.6,hy+ry*.78,hx-rx+.4,hy+ry*.28);x.bezierCurveTo(hx-rx-.9,hy-ry*.15,hx-rx-.8,hy-ry,hx,hy-ry);x.closePath();
 fillStroke(x,RG(x,hx-2.2,hy-2,1.5,rx+5,[[0,lt(skin,.16)],[.55,skin],[1,dk(skin,.26)]]),dk(skin,.58),.55);
 /* cheek warmth and nose */
 x.fillStyle='rgba(205,100,90,.13)';ell(x,hx+(Q?-1.2:-3.6),hy+4,1.9,1.3);x.fill();ell(x,hx+(Q?5.2:3.6),hy+4,1.9,1.3);x.fill();
 /* ---------- beard ---------- */
 const mx=hx+(Q?4.3:0),my=hy+5.9;
 if(c.beard){x.beginPath();x.moveTo(hx-rx+.5,hy+1);x.quadraticCurveTo(hx-rx-.4,hy+ry+1,hx-1.5,hy+ry+4.2);x.quadraticCurveTo(hx+(Q?3.5:.6),hy+ry+6.4,hx+(Q?6:1.6),hy+ry+3.6);x.quadraticCurveTo(hx+rx+.6,hy+ry+.4,hx+rx-.6,hy+1);
  x.quadraticCurveTo(hx+rx-1.6,hy+3.6,hx+(Q?7:5),my-.4);x.quadraticCurveTo(hx+(Q?4:0),my-2.4,hx-(Q?1:5),my-.4);x.quadraticCurveTo(hx-rx+1.4,hy+3.6,hx-rx+.5,hy+1);x.closePath();
  fillStroke(x,LG(x,hx-rx,0,hx+rx,0,[[0,lt(beardC,.12)],[.5,beardC],[1,dk(beardC,.4)]]),dk(beardC,.6),.5)}
 /* ---------- face ---------- */
 face(x,c,{hx,hy,rx,ry,Q,E,blink,talk,mx,my,skin,hair,beardC});
 /* ---------- hair (front) ---------- */
 const covered=['helm','hood','veil'].includes(c.hat);
 if(c.hs&&!covered){const L=c.hs===2;x.beginPath();x.moveTo(hx-rx-.9,hy+(L?3:-.2));x.bezierCurveTo(hx-rx-1.8,hy-ry*.9,hx-3,hy-ry-2.4,hx+1,hy-ry-1.6);x.bezierCurveTo(hx+rx+.4,hy-ry-1,hx+rx+1.4,hy-ry*.55,hx+rx+.6,hy+(L?3:-.2));
  x.bezierCurveTo(hx+rx-.2,hy-3.4,hx+rx-1.6,hy-6.1,hx+2.6,hy-6.3);x.bezierCurveTo(hx-1,hy-6.6,hx-rx+1.1,hy-5.2,hx-rx+.5,hy-1.2);x.bezierCurveTo(hx-rx-.2,hy-.2,hx-rx-.7,hy+.6,hx-rx-.9,hy+(L?3:-.2));x.closePath();
  fillStroke(x,LG(x,hx-rx,hy-ry,hx+rx,hy,[[0,lt(hair,.22)],[.5,hair],[1,dk(hair,.42)]]),dk(hair,.62),.5);
  x.strokeStyle=lt(hair,.34);x.globalAlpha=.5;x.lineWidth=.45;for(let k=0;k<4;k++){x.beginPath();x.moveTo(hx-5+k*2.6,hy-ry-.6);x.quadraticCurveTo(hx-3+k*2.4,hy-ry*.78,hx-4.4+k*2.5,hy-6.4);x.stroke()}x.globalAlpha=1}
 else if(!c.hs&&!c.hat&&!covered){x.fillStyle='rgba(255,240,220,.18)';ell(x,hx-1.6,hy-ry+2.6,3.2,1.5,-.3);x.fill()}
 /* ---------- hats ---------- */
 hat(x,c,{hx,hy,rx,ry,Q,t,ph});
 /* ---------- front arm, hand, items ---------- */
 const shx=bx+(Q?sw-.4:sw-.6),shy=shY+2.2;
 const elb=[shx+(Q?1.2:2.6)+gest*3,-61-gest*5];
 limb(x,[[shx,shy],elb,[handFX,handFY+1]],Q?5.2:5.4,robe,robeE);
 x.beginPath();x.moveTo(handFX-2.7,handFY-.8);x.lineTo(handFX+2.7,handFY-.8);x.lineTo(handFX+2.4,handFY+.8);x.lineTo(handFX-2.4,handFY+.8);x.closePath();fillStroke(x,trim,dk(trim,.6),.4);
 ell(x,handFX+.2,handFY+2.5,2.4,2.8);fillStroke(x,skin,dk(skin,.55),.5);
 if(!Q){const lx=bx-sw-.6;/* second hand already drawn */}
 if(c.item==='spear'||c.item==='staff'){const ix=handFX+.6;x.strokeStyle='#2e1a10';x.lineWidth=2.1;x.lineCap='round';x.beginPath();x.moveTo(ix,-110);x.lineTo(ix,0);x.stroke();x.strokeStyle='#8a5a30';x.lineWidth=1.2;x.beginPath();x.moveTo(ix-.2,-110);x.lineTo(ix-.2,0);x.stroke();
  if(c.item==='spear'){x.beginPath();x.moveTo(ix,-122);x.quadraticCurveTo(ix+2.9,-116,ix+1.4,-109);x.lineTo(ix-1.4,-109);x.quadraticCurveTo(ix-2.9,-116,ix,-122);x.closePath();fillStroke(x,LG(x,ix-3,0,ix+3,0,[[0,'#eef2f8'],[1,'#7e8794']]),'#2a3038',.5)}
  else{const gc=c.itemc||'#9fd0ff';x.fillStyle=RG(x,ix,-114,0,12,[[0,gc+'cc'],[1,gc+'00']]);x.globalAlpha=.55+.25*Math.sin(t/300+ph);x.fillRect(ix-12,-126,24,24);x.globalAlpha=1;ell(x,ix,-113.6,2.7,2.7);fillStroke(x,RG(x,ix-.8,-114.6,.2,3,[[0,'#fff'],[1,gc]]),dk(gc,.6),.5)}}
 if(c.item==='scroll'){x.save();x.translate(handFX+1.4,handFY+1.6);x.rotate(-.5);x.fillStyle='#ecdcae';x.strokeStyle='#7a6238';x.lineWidth=.45;x.beginPath();x.rect(-1.6,-4.6,3.2,9.2);x.fill();x.stroke();x.fillStyle='#c4a468';x.fillRect(-1.9,-4.9,3.8,1.2);x.fillRect(-1.9,3.7,3.8,1.2);x.restore()}
 if(c.item==='basket'){x.save();x.translate(handFX+3,handFY+7);x.strokeStyle='#6a4520';x.lineWidth=.7;x.beginPath();x.arc(0,-2.6,4.4,Math.PI,0);x.stroke();ell(x,0,0,5.6,3.3);fillStroke(x,LG(x,0,-3,0,3,[[0,'#c8984a'],[1,'#7a4f22']]),'#3a220c',.5);
  x.strokeStyle='rgba(60,30,10,.55)';x.lineWidth=.35;for(let k=-4;k<=4;k+=2){x.beginPath();x.moveTo(k,-2.7);x.lineTo(k*.8,2.8);x.stroke()}x.fillStyle='#d94a32';x.beginPath();x.arc(-1.6,-3.1,1.4,0,7);x.fill();x.fillStyle='#e9c25a';x.beginPath();x.arc(1.4,-3.3,1.4,0,7);x.fill();x.restore()}
}

function face(x,c,o){
 const{hx,hy,rx,ry,Q,E,blink,talk,mx,my,skin,hair,beardC}=o;
 const D='#1c1018',lip=mix(skin,'#a8444c',.45),eyeC=c.eye||'#3a2418',brC=dk(hair,.1);
 const ey=hy+.9;
 const ex=Q?[hx+.9,hx+6.1]:[hx-3.2,hx+3.2];
 const erx=Q?[2,1.35]:[1.95,1.95],ery=1.05;
 /* expression parameters: brow inner/outer offsets per side, lid droop, mouth kind */
 const X={neutral:{bi:[0,0],bo:[0,0],lid:0,m:'n'},happy:{bi:[-.5,-.5],bo:[-.7,-.7],lid:.15,m:'h'},angry:{bi:[1.6,1.6],bo:[-.5,-.5],lid:.2,m:'a'},fierce:{bi:[2,2],bo:[-.8,-.8],lid:.25,m:'f'},sad:{bi:[-1.7,-1.7],bo:[.7,.7],lid:.3,m:'s'},shock:{bi:[-2.2,-2.2],bo:[-2,-2],lid:-.2,m:'o'},smug:{bi:[.2,-1.2],bo:[-.6,-1.4],lid:.38,m:'g'},cold:{bi:[.6,.6],bo:[.2,.2],lid:.4,m:'c'},tired:{bi:[-.8,-.8],bo:[.9,.9],lid:.5,m:'t'}}[E]||{bi:[0,0],bo:[0,0],lid:0,m:'n'};
 /* eyes */
 [0,1].forEach(i=>{const far=Q&&i===1;const cx=ex[i],rxE=erx[i],lidFrac=Math.min(.95,Math.max(0,X.lid+blink*1.2));
  x.save();x.beginPath();x.moveTo(cx-rxE-.2,ey+.1);x.quadraticCurveTo(cx,ey-ery*1.9,cx+rxE+.2,ey+.1);x.quadraticCurveTo(cx,ey+ery*1.4,cx-rxE-.2,ey+.1);x.closePath();x.clip();
  x.fillStyle='#f6f0e6';x.fillRect(cx-rxE-1,ey-3,rxE*2+2,6);
  const look=(Q?.45:0)+Math.sin(hash(c.robe)%7+Date.now()/1700)*.15;const ir=far?.85:1.05;
  x.fillStyle=RG(x,cx+look,ey,.1,ir,[[0,dk(eyeC,.35)],[.7,eyeC],[1,dk(eyeC,.5)]]);x.beginPath();x.arc(cx+look,ey+.05,ir,0,7);x.fill();
  x.fillStyle=D;x.beginPath();x.arc(cx+look,ey+.05,ir*.52,0,7);x.fill();x.fillStyle='rgba(255,255,255,.9)';x.beginPath();x.arc(cx+look-.35,ey-.35,.3,0,7);x.fill();
  if(E==='fierce'){x.fillStyle='rgba(255,140,40,.75)';x.beginPath();x.arc(cx+look,ey,ir*.9,0,7);x.fill()}
  /* upper lid (skin colour) */
  x.fillStyle=dk(skin,.04);x.fillRect(cx-rxE-1,ey-3,rxE*2+2,3+(ery*2*lidFrac)-ery*.9);
  if(E==='angry'||E==='fierce'){x.beginPath();x.moveTo(cx-rxE-1,ey-3);x.lineTo(cx+rxE+1,ey-3);x.lineTo(cx+rxE+1,ey-.2+(i===0?(Q?1.4:1.4):-.4));x.lineTo(cx-rxE-1,ey-.2+(i===0?-.4:1.4));x.closePath();x.fillStyle=dk(skin,.04);x.fill()}
  x.restore();
  /* lash line */
  x.strokeStyle=D;x.lineWidth=far?.5:.65;x.lineCap='round';x.beginPath();x.moveTo(cx-rxE-.2,ey+.15);x.quadraticCurveTo(cx,ey-ery*1.9+lidFrac*2*ery,cx+rxE+.2,ey+.15);x.stroke();
  if(E==='tired'){x.strokeStyle='rgba(60,30,40,.35)';x.lineWidth=.4;x.beginPath();x.moveTo(cx-rxE,ey+1.9);x.quadraticCurveTo(cx,ey+2.7,cx+rxE,ey+1.9);x.stroke()}});
 /* brows */
 x.strokeStyle=brC;x.lineCap='round';
 [0,1].forEach(i=>{const far=Q&&i===1,cx=ex[i],w=erx[i]+1.2,inner=i===0?1:-1;
  const bi=X.bi[i],bo=X.bo[i];const y0=ey-3.6;
  const xi=cx-inner*(w-.2)*-1, xo=cx+inner*w*-1;
  const xin=i===0?cx+w:cx-w,xout=i===0?cx-w:cx+w;
  x.lineWidth=far?.75:1.05;x.beginPath();x.moveTo(xin,y0+bi);x.quadraticCurveTo(cx,y0-.7+(bi+bo)/2,xout,y0+bo+.3);x.stroke()});
 /* nose */
 const nx=hx+(Q?5.4:0),ny=hy+3.3;
 x.strokeStyle=dk(skin,.4);x.lineWidth=.55;x.globalAlpha=.75;x.beginPath();if(Q){x.moveTo(hx+4.2,hy+.8);x.quadraticCurveTo(hx+4.5,hy+3.2,hx+7.6,hy+3.8);x.quadraticCurveTo(hx+7.2,hy+4.6,hx+5.6,hy+4.5)}else{x.moveTo(hx+.2,hy+.9);x.quadraticCurveTo(hx+1,hy+3.4,hx+1.6,hy+4);x.quadraticCurveTo(hx,hy+4.8,hx-1.6,hy+4)}x.stroke();x.globalAlpha=1;
 x.fillStyle='rgba(255,236,210,.25)';ell(x,nx-(Q?1.2:.5),hy+2,.55,1.4);x.fill();
 /* mouth */
 const lw=Q?2.1:2.4;const t0=talk;
 x.lineCap='round';
 const mo=(op)=>{ // open mouth with animated opening
  x.beginPath();x.ellipse(mx,my+.4,lw*(.75+op*.12),.5+op*1.9,0,0,Math.PI*2);x.fillStyle='#2a0e14';x.fill();x.strokeStyle=dk(lip,.45);x.lineWidth=.45;x.stroke();
  x.fillStyle='#b8505a';x.beginPath();x.ellipse(mx,my+.4+op*.8,lw*.45,Math.max(.01,op*.7),0,0,Math.PI);x.fill();if(op>.45){x.fillStyle='#f4ece0';x.fillRect(mx-lw*.55,my+.4-op*1.5,lw*1.1,Math.min(.8,op*.9))}};
 if(t0>.12&&X.m!=='o'){mo(t0)}
 else if(X.m==='o')mo(1.1);
 else{x.strokeStyle=dk(lip,.5);x.lineWidth=.6;x.beginPath();
  if(X.m==='h'){x.moveTo(mx-lw-.3,my-.5);x.quadraticCurveTo(mx,my+2.5,mx+lw+.3,my-.7);x.stroke();x.fillStyle='#f6eee2';x.beginPath();x.moveTo(mx-lw*.7,my-.1);x.quadraticCurveTo(mx,my+1.8,mx+lw*.7,my-.2);x.quadraticCurveTo(mx,my+.6,mx-lw*.7,my-.1);x.fill();
   x.fillStyle='rgba(225,110,110,.22)';ell(x,hx+(Q?-1.1:-4),hy+4.2,1.8,1.2);x.fill();ell(x,hx+(Q?5.6:4),hy+4.2,1.8,1.2);x.fill()}
  else if(X.m==='s'){x.moveTo(mx-lw,my+.8);x.quadraticCurveTo(mx,my-1.4,mx+lw,my+.8);x.stroke();x.fillStyle='rgba(150,210,255,.85)';ell(x,ex[0]-.6,ey+3.6,.45,.8);x.fill()}
  else if(X.m==='a'){x.moveTo(mx-lw,my+.4);x.quadraticCurveTo(mx,my-.6,mx+lw,my+.5);x.stroke()}
  else if(X.m==='f'){x.moveTo(mx-lw,my+.2);x.quadraticCurveTo(mx,my-.9,mx+lw,my+.4);x.stroke();x.fillStyle='#f4ece0';x.fillRect(mx-lw*.6,my-.1,lw*1.2,.8);x.strokeStyle=dk(lip,.5);x.lineWidth=.3;x.strokeRect(mx-lw*.6,my-.1,lw*1.2,.8)}
  else if(X.m==='g'){x.moveTo(mx-lw,my+.3);x.quadraticCurveTo(mx+lw*.3,my+.5,mx+lw+.4,my-1.1);x.stroke()}
  else if(X.m==='t'){x.moveTo(mx-lw*.8,my+.4);x.quadraticCurveTo(mx,my-.2,mx+lw*.8,my+.5);x.stroke()}
  else{x.moveTo(mx-lw,my+.1);x.quadraticCurveTo(mx,my+.7,mx+lw,my+.1);x.stroke();x.strokeStyle=lip;x.lineWidth=.35;x.beginPath();x.moveTo(mx-lw*.6,my+.9);x.quadraticCurveTo(mx,my+1.4,mx+lw*.6,my+.9);x.stroke()}}
 if(c.beard&&X.m!=='o'&&t0<=.12){/* moustache over the mouth */x.fillStyle=beardC;x.beginPath();x.moveTo(mx-lw-.8,my-.3);x.quadraticCurveTo(mx-lw*.3,my-2.2,mx,my-1.2);x.quadraticCurveTo(mx+lw*.3,my-2.2,mx+lw+.8,my-.3);x.quadraticCurveTo(mx+lw*.4,my-.9,mx,my-.5);x.quadraticCurveTo(mx-lw*.4,my-.9,mx-lw-.8,my-.3);x.fill()}
 if(E==='shock'){x.fillStyle='rgba(160,215,255,.85)';x.beginPath();x.ellipse(hx-rx+1.8,hy-ry+3.6,.55,.95,.3,0,7);x.fill()}
}

function hat(x,c,o){
 const{hx,hy,rx,ry,Q,t,ph}=o,H=c.hat,gold='#e3b54e',hc=c.hatc||c.robe;
 if(!H)return;
 const top=hy-ry;
 if(H==='crown'){const y0=hy-ry+2.6,h=3.4;x.beginPath();x.moveTo(hx-rx-.2,y0+h);
  const n=5,w=(rx*2+.4)/n;for(let i=0;i<n;i++){const a=hx-rx-.2+i*w;x.lineTo(a+w*.15,y0-(i%2?3.2:5.2));x.lineTo(a+w*.5,y0-1);}
  x.lineTo(hx+rx+.2,y0-4.6);x.lineTo(hx+rx+.2,y0+h);x.closePath();fillStroke(x,LG(x,hx-rx,0,hx+rx,0,[[0,'#fff0a8'],[.4,gold],[1,dk(gold,.45)]]),dk(gold,.62),.5);
  x.fillStyle='#d4283c';x.beginPath();x.arc(hx+(Q?1.6:0),y0+1.6,.95,0,7);x.fill();x.fillStyle='#4fc0f0';x.beginPath();x.arc(hx+(Q?-3.2:-3.6),y0+1.7,.7,0,7);x.fill();x.beginPath();x.arc(hx+(Q?6:3.6),y0+1.7,.7,0,7);x.fill();
  x.fillStyle='rgba(255,255,255,.6)';x.fillRect(hx-rx+1.2,y0+.2,1.2,.5);return}
 if(H==='circlet'){x.beginPath();x.moveTo(hx-rx-.5,hy-3.6);x.quadraticCurveTo(hx,hy-6.9,hx+rx+.5,hy-3.6);x.lineTo(hx+rx+.5,hy-2.6);x.quadraticCurveTo(hx,hy-5.8,hx-rx-.5,hy-2.6);x.closePath();fillStroke(x,LG(x,hx-rx,0,hx+rx,0,[[0,'#fff0a8'],[.5,gold],[1,dk(gold,.4)]]),dk(gold,.62),.4);
  x.fillStyle='#7ad0ff';x.beginPath();x.arc(hx+(Q?2.4:0),hy-5.6,.95,0,7);x.fill();x.strokeStyle=dk('#7ad0ff',.5);x.lineWidth=.3;x.stroke();return}
 if(H==='helm'){x.beginPath();x.moveTo(hx-rx-1.2,hy+3.4);x.bezierCurveTo(hx-rx-2.2,hy-ry-1,hx+rx+2.2,hy-ry-1,hx+rx+1.2,hy+3.4);x.lineTo(hx+rx+.4,hy+3.4);x.quadraticCurveTo(hx+rx+.8,hy-3.6,hx+(Q?4:4),hy-3.4);x.lineTo(hx-(Q?4.4:4),hy-3.4);x.quadraticCurveTo(hx-rx-.8,hy-3.6,hx-rx-.4,hy+3.4);x.closePath();
  fillStroke(x,LG(x,hx-rx-1,0,hx+rx+1,0,[[0,'#eef2f8'],[.4,'#a8b1be'],[1,'#5c6572']]),'#262c34',.6);
  x.strokeStyle='#3a424c';x.lineWidth=.9;x.beginPath();x.moveTo(hx-rx-1.2,hy-3.5);x.quadraticCurveTo(hx,hy-6,hx+rx+1.2,hy-3.5);x.stroke();
  x.fillStyle=LG(x,hx,0,hx+2,0,[[0,'#cfd6e0'],[1,'#6a7480']]);x.beginPath();x.moveTo(hx+(Q?3:0)-1,hy-4);x.lineTo(hx+(Q?3:0)+1,hy-4);x.lineTo(hx+(Q?3:0)+.7,hy+3.6);x.lineTo(hx+(Q?3:0)-.7,hy+3.6);x.closePath();x.fill();x.strokeStyle='#262c34';x.lineWidth=.35;x.stroke();
  x.fillStyle='rgba(255,255,255,.55)';ell(x,hx-3,hy-ry+2.2,2.2,.9,-.5);x.fill();return}
 if(H==='hood'||H==='veil'){x.beginPath();x.moveTo(hx-rx-2.4,hy+4);x.bezierCurveTo(hx-rx-3.6,hy-ry-3,hx+rx+3.6,hy-ry-3,hx+rx+2.4,hy+4);x.quadraticCurveTo(hx+rx+.2,hy-2.4,hx+(H==='veil'?rx*.8:rx*.7),hy-5.2);x.quadraticCurveTo(hx,hy-7.4,hx-rx*.78,hy-5.2);x.quadraticCurveTo(hx-rx-.2,hy-2.4,hx-rx-2.4,hy+4);x.closePath();
  fillStroke(x,LG(x,hx-rx,0,hx+rx,0,[[0,lt(hc,.18)],[.5,hc],[1,dk(hc,.42)]]),dk(hc,.62),.6);
  if(H==='veil'){x.strokeStyle=c.trim;x.lineWidth=.9;x.beginPath();x.moveTo(hx-rx*.78,hy-5.2);x.quadraticCurveTo(hx,hy-7.4,hx+rx*.8,hy-5.2);x.stroke()}
  x.fillStyle='rgba(0,0,0,.22)';x.beginPath();x.moveTo(hx-rx*.78,hy-5.2);x.quadraticCurveTo(hx,hy-7.4,hx+rx*.78,hy-5.2);x.quadraticCurveTo(hx,hy-3.8,hx-rx*.78,hy-5.2);x.fill();return}
 if(H==='turban'){x.beginPath();x.moveTo(hx-rx-1.6,hy-2.4);x.bezierCurveTo(hx-rx-3.4,hy-ry-7,hx+rx+3.4,hy-ry-7,hx+rx+1.6,hy-2.4);x.quadraticCurveTo(hx,hy-6.2,hx-rx-1.6,hy-2.4);x.closePath();fillStroke(x,LG(x,hx-rx,0,hx+rx,0,[[0,lt(hc,.2)],[.5,hc],[1,dk(hc,.4)]]),dk(hc,.62),.6);
  x.strokeStyle=dk(hc,.4);x.lineWidth=.5;x.globalAlpha=.7;for(let k=0;k<5;k++){x.beginPath();x.moveTo(hx-rx-1+k*.6,hy-3.6-k*2.1);x.quadraticCurveTo(hx,hy-6.8-k*2.3,hx+rx+1-k*.6,hy-3.4-k*2.1);x.stroke()}x.globalAlpha=1;
  x.fillStyle='#d4283c';x.beginPath();x.arc(hx+(Q?3:0),hy-5.4,.95,0,7);x.fill();x.strokeStyle=gold;x.lineWidth=.5;x.stroke();return}
 if(H==='cap'){x.beginPath();x.moveTo(hx-rx-1,hy-2.4);x.bezierCurveTo(hx-rx-2,hy-ry-4.6,hx+rx+2,hy-ry-4.6,hx+rx+1,hy-2.4);x.quadraticCurveTo(hx,hy-5.2,hx-rx-1,hy-2.4);x.closePath();fillStroke(x,LG(x,hx-rx,0,hx+rx,0,[[0,lt(hc,.2)],[.5,hc],[1,dk(hc,.4)]]),dk(hc,.62),.6);
  x.beginPath();x.moveTo(hx-rx-1.4,hy-2.8);x.quadraticCurveTo(hx,hy-6.4,hx+rx+1.4,hy-2.8);x.lineTo(hx+rx+1.2,hy-1.4);x.quadraticCurveTo(hx,hy-4.8,hx-rx-1.2,hy-1.4);x.closePath();fillStroke(x,dk(hc,.25),dk(hc,.65),.4)}
}

/* ---------- public API ---------- */
/* draw a character: feet at (x,feet), pixel height h. Options: facing 'q'|'f', mirror, expr, t, talk, gest, walk(phase), seated */
function draw(ctx,key,x,feet,h,o={}){
 const c=C[key]||C.guard,ph=(hash(key)%628)/100;
 ctx.save();ctx.translate(x,feet);const s=h/100;ctx.scale(o.mirror?-s:s,s);
 figure(ctx,c,Object.assign({ph},o));ctx.restore()}
/* portrait: bust inside w×h box, with soft background; returns nothing */
function portrait(ctx,key,w,h,o={}){
 const c=C[key]||C.guard,ph=(hash(key)%628)/100;
 ctx.save();ctx.beginPath();ctx.rect(0,0,w,h);ctx.clip();
 const bg=o.bg||'#2b2133';const g=ctx.createRadialGradient(w*.5,h*.38,2,w*.5,h*.45,w*.85);g.addColorStop(0,lt(bg,.22));g.addColorStop(1,dk(bg,.35));ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
 const s=h/50;ctx.translate(w*.5-1.5*s,106*s);ctx.scale(s,s);
 figure(ctx,c,Object.assign({ph,noShadow:true,facing:'q'},o));
 ctx.restore()}
return{draw,portrait,figure,mix,dk,lt,hash};
})();

/* ---------- animated portraits: SPR.paint now registers canvas; the main loop redraws them ---------- */
VC.talking=false;
const VCP=new Set();
SPR.paint=function(cv,k,e,bg){cv.width=cv.height=192;cv._vc={k,e:e||'neutral',bg:bg||null};VCP.add(cv);VC.drawPortrait(cv,0);return cv};
VC.drawPortrait=function(cv,t){const d=cv._vc,x=cv.getContext('2d');x.clearRect(0,0,192,192);VC.portrait(x,d.k,192,192,{expr:d.e,t,bg:d.bg||'#46354f',talk:cv.id==='pt'&&VC.talking})};
VC.tick=function(t){if(t-(VC._l||0)<33)return;VC._l=t;for(const cv of VCP){if(!cv.isConnected){VCP.delete(cv);continue}VC.drawPortrait(cv,t)}};
SPR.portrait=function(k,e){const cv=document.createElement('canvas');cv.width=cv.height=96;const x=cv.getContext('2d');VC.portrait(x,k,96,96,{expr:e||'neutral',t:0});return cv};
