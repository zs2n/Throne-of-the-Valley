/* ===== Throne hall v4: smooth vector hall, drawn at 3x resolution (logical 320x180) with living light ===== */
const HALL={W:320,H:180,HZ:94,door:[26,124],stand:[118,160],K:3};
let hallBg=null,hallKey='';
const hallDust=Array.from({length:36},()=>({x:60+Math.random()*200,y:Math.random()*180,v:.04+Math.random()*.09,r:.4+Math.random()*.6}));
function hallPal(ch,night){
 if(night)return{s1:'#27336a',s2:'#0c1130',wall:['#2a2548','#19162e'],floor:['#2c2442','#1a1528'],tint:'rgba(40,50,110,.34)',beam:'rgba(150,170,255,.0)'};
 return ch===1?{s1:'#ffe3a0',s2:'#e9944f',wall:['#5a4658','#2e2336'],floor:['#5b4642','#2a1d22'],tint:'rgba(255,170,90,.10)',beam:'rgba(255,225,160,.20)'}
 :ch===2?{s1:'#d8bcf0',s2:'#7a58a8',wall:['#4c3f62','#272037'],floor:['#4d3c48','#251b27'],tint:'rgba(150,110,210,.10)',beam:'rgba(225,200,255,.16)'}
 :{s1:'#f0906a',s2:'#7a3226',wall:['#573636','#2b1a22'],floor:['#553a38','#26171b'],tint:'rgba(200,70,40,.12)',beam:'rgba(255,170,120,.16)'}}
function bakeHall(ch,night){
 const K=HALL.K,cv=document.createElement('canvas');cv.width=HALL.W*K;cv.height=HALL.H*K;const x=cv.getContext('2d');x.scale(K,K);
 const W=HALL.W,H=HALL.H,HZ=HALL.HZ,P=hallPal(ch,night);
 const lg=(a,b,c,d,st)=>{const g=x.createLinearGradient(a,b,c,d);st.forEach(s=>g.addColorStop(s[0],s[1]));return g};
 /* back wall */
 x.fillStyle=lg(0,0,0,HZ,[[0,P.wall[1]],[.55,P.wall[0]],[1,P.wall[1]]]);x.fillRect(0,0,W,HZ+1);
 /* stone blocks, soft */
 let sd=7;const rnd=()=>(sd=(sd*16807)%2147483647)/2147483647;
 for(let y=0;y<HZ;y+=9){const off=(y/9)%2?9:0;for(let i=44-off;i<278;i+=18){const a=rnd();x.fillStyle=`rgba(${a>.5?'255,235,220':'0,0,0'},${.025+a*.045})`;x.beginPath();x.roundRect(i+.8,y+.8,16.4,7.4,1.2);x.fill()}}
 x.strokeStyle='rgba(0,0,0,.18)';x.lineWidth=.35;for(let y=9;y<HZ;y+=9){x.beginPath();x.moveTo(40,y);x.lineTo(280,y);x.stroke()}
 /* floor */
 x.fillStyle=lg(0,HZ,0,H,[[0,P.floor[1]],[1,P.floor[0]]]);x.fillRect(0,HZ,W,H-HZ);
 const rows=9,col=n=>{for(let r=0;r<rows;r++){const t0=Math.pow(r/rows,1.7),t1=Math.pow((r+1)/rows,1.7),y0=HZ+(H-HZ)*t0,y1=HZ+(H-HZ)*t1;
  for(let c=-9;c<9;c++){if((c+r)&1)continue;const xb=a=>160+(a*48-0)*0+0;const xa=160+c*58*t0*1.0,xb2=160+(c+1)*58*t0,xc=160+(c+1)*58*t1,xd=160+c*58*t1;
   x.fillStyle=`rgba(255,235,220,${.035+t1*.04})`;x.beginPath();x.moveTo(xa,y0);x.lineTo(xb2,y0);x.lineTo(xc,y1);x.lineTo(xd,y1);x.closePath();x.fill()}}};
 col();
 x.strokeStyle='rgba(0,0,0,.22)';x.lineWidth=.4;for(let c=-9;c<=9;c++){x.beginPath();x.moveTo(160,HZ);x.lineTo(160+c*58,H);x.stroke()}
 for(let r=1;r<=rows;r++){const y=HZ+(H-HZ)*Math.pow(r/rows,1.7);x.beginPath();x.moveTo(0,y);x.lineTo(W,y);x.stroke()}
 x.fillStyle=lg(0,HZ,0,HZ+40,[[0,'rgba(0,0,0,.35)'],[1,'rgba(0,0,0,0)']]);x.fillRect(0,HZ,W,40);
 /* side walls */
 for(const L of[true,false]){x.beginPath();if(L){x.moveTo(0,0);x.lineTo(52,0);x.lineTo(52,HZ);x.lineTo(0,150)}else{x.moveTo(W,0);x.lineTo(268,0);x.lineTo(268,HZ);x.lineTo(W,150)}x.closePath();
  x.fillStyle=lg(L?0:W,0,L?52:268,0,[[0,P.wall[1]],[1,'#120d19']]);x.fill();
  x.strokeStyle='rgba(255,230,210,.07)';x.lineWidth=.4;for(let k=1;k<9;k++){const yb=k*HZ/9,yf=k*150/9;x.beginPath();if(L){x.moveTo(0,yf);x.lineTo(52,yb)}else{x.moveTo(W,yf);x.lineTo(268,yb)}x.stroke()}}
 /* carpet */
 const cg=lg(0,HZ,0,H,[[0,'#8a2236'],[1,'#5a1424']]);x.fillStyle=cg;x.beginPath();x.moveTo(145,103);x.lineTo(175,103);x.lineTo(212,H);x.lineTo(108,H);x.closePath();x.fill();
 x.strokeStyle='#e3b54e';x.lineWidth=1.1;x.beginPath();x.moveTo(146.5,103);x.lineTo(110,H);x.moveTo(173.5,103);x.lineTo(210,H);x.stroke();
 x.strokeStyle='rgba(227,181,78,.45)';x.lineWidth=.5;x.beginPath();x.moveTo(148.5,103);x.lineTo(115,H);x.moveTo(171.5,103);x.lineTo(205,H);x.stroke();
 x.fillStyle='rgba(227,181,78,.16)';for(let y=112;y<H;y+=12){const t=(y-HZ)/(H-HZ);x.beginPath();x.moveTo(160,y-2.4-t*2);x.lineTo(160+3+t*6,y);x.lineTo(160,y+2.4+t*2);x.lineTo(160-3-t*6,y);x.closePath();x.fill()}
 /* windows */
 for(const wx of[86,234]){x.fillStyle='#0e0a12';x.beginPath();x.moveTo(wx-11,66);x.lineTo(wx-11,24);x.quadraticCurveTo(wx-11,6,wx,5);x.quadraticCurveTo(wx+11,6,wx+11,24);x.lineTo(wx+11,66);x.closePath();x.fill();
  x.fillStyle=lg(0,10,0,64,[[0,P.s1],[1,P.s2]]);x.beginPath();x.moveTo(wx-8.6,64);x.lineTo(wx-8.6,25);x.quadraticCurveTo(wx-8.6,9,wx,8);x.quadraticCurveTo(wx+8.6,9,wx+8.6,25);x.lineTo(wx+8.6,64);x.closePath();x.fill();
  if(night){x.fillStyle='#eaf0ff';for(const[a,b]of[[-4,20],[3,30],[-2,44],[5,52]]){x.beginPath();x.arc(wx+a,b,.5,0,7);x.fill()}x.fillStyle='#f4eed0';x.beginPath();x.arc(wx+3,17,2.6,0,7);x.fill();x.fillStyle='#27336a';x.beginPath();x.arc(wx+4.2,16.2,2.4,0,7);x.fill()}
  x.strokeStyle='#0e0a12';x.lineWidth=1.3;x.beginPath();x.moveTo(wx,8);x.lineTo(wx,66);x.moveTo(wx-9,38);x.lineTo(wx+9,38);x.stroke();
  x.fillStyle='#43344a';x.beginPath();x.roundRect(wx-13,66,26,3.2,1);x.fill();x.fillStyle='rgba(255,255,255,.12)';x.fillRect(wx-13,66,26,.8)}
 /* rose window */
 x.fillStyle='#0e0a12';x.beginPath();x.arc(160,22,14,0,7);x.fill();
 const rg=x.createRadialGradient(160,22,1,160,22,12.5);rg.addColorStop(0,night?'#aab8f0':'#fff4cc');rg.addColorStop(.6,night?'#3a4690':P.s1);rg.addColorStop(1,night?'#1a2050':P.s2);x.fillStyle=rg;x.beginPath();x.arc(160,22,12.4,0,7);x.fill();
 x.strokeStyle='#0e0a12';x.lineWidth=1.2;for(let a=0;a<8;a++){x.beginPath();x.moveTo(160,22);x.lineTo(160+Math.cos(a*Math.PI/4)*12.4,22+Math.sin(a*Math.PI/4)*12.4);x.stroke()}x.lineWidth=.9;x.beginPath();x.arc(160,22,6,0,7);x.stroke();
 /* dais */
 const steps=[[84,46,'#54445e'],[89.5,54,'#4a3c54'],[95,62,'#41344a'],[100.5,70,'#382d41']];
 steps.forEach(([y,hw,c],i)=>{x.fillStyle=lg(0,y,0,y+5.5,[[0,c],[1,'#241b2c']]);x.beginPath();x.roundRect(160-hw,y,hw*2,5.5,1);x.fill();x.fillStyle='rgba(255,235,220,.22)';x.fillRect(160-hw+1,y,hw*2-2,.7)});
 /* throne */
 x.fillStyle='#4a2c0c';x.beginPath();x.moveTo(141,86);x.lineTo(141,50);x.quadraticCurveTo(141,42,150,42);x.lineTo(170,42);x.quadraticCurveTo(179,42,179,50);x.lineTo(179,86);x.closePath();x.fill();
 x.fillStyle=lg(139,0,181,0,[[0,'#8a6420'],[.35,'#f0cb68'],[.7,'#d9a540'],[1,'#7a5418']]);x.beginPath();x.moveTo(142.4,86);x.lineTo(142.4,50.4);x.quadraticCurveTo(142.4,43.4,150.4,43.4);x.lineTo(169.6,43.4);x.quadraticCurveTo(177.6,43.4,177.6,50.4);x.lineTo(177.6,86);x.closePath();x.fill();
 x.fillStyle=lg(0,52,0,84,[[0,'#8e2234'],[1,'#5a1220']]);x.beginPath();x.roundRect(147,52,26,32,5);x.fill();x.fillStyle='rgba(255,255,255,.10)';x.beginPath();x.roundRect(149,54,5,28,2.5);x.fill();
 x.fillStyle='#e3b54e';x.beginPath();x.moveTo(153,43);x.lineTo(156,34);x.lineTo(160,40);x.lineTo(164,34);x.lineTo(167,43);x.closePath();x.fill();x.fillStyle='#d4283c';x.beginPath();x.arc(160,38,1.5,0,7);x.fill();
 /* wall torches (brackets) */
 for(const[bx,by]of[[110,82],[210,82],[30,64],[290,64]]){x.fillStyle='#241b26';x.beginPath();x.roundRect(bx-3.6,by,7.2,3,1);x.fill();x.fillRect(bx-.9,by+3,1.8,8);x.beginPath();x.moveTo(bx-3,by+11);x.lineTo(bx+3,by+11);x.lineTo(bx,by+14);x.fill()}
 return cv}
const hallLight=(x,gx,gy,rad,rgb,a)=>{const g=x.createRadialGradient(gx,gy,0,gx,gy,rad);g.addColorStop(0,`rgba(${rgb},${a})`);g.addColorStop(.5,`rgba(${rgb},${a*.35})`);g.addColorStop(1,`rgba(${rgb},0)`);x.fillStyle=g;x.fillRect(gx-rad,gy-rad,rad*2,rad*2)};
function drawHall3(x,t,o){
 const W=HALL.W,H=HALL.H,K=HALL.K,key=o.ch+'|'+(o.night?1:0),P=hallPal(o.ch,o.night);
 if(!hallBg||hallKey!==key){hallBg=bakeHall(o.ch,o.night);hallKey=key}
 x.setTransform(1,0,0,1,0,0);x.imageSmoothingEnabled=true;x.imageSmoothingQuality='high';x.drawImage(hallBg,0,0);x.setTransform(K,0,0,K,0,0);
 /* banners with cloth sway */
 for(const bx of[124,196]){const sw=Math.sin(t/1100+bx)*1.4,sw2=Math.sin(t/900+bx*2)*1.9;
  x.fillStyle='#e3b54e';x.beginPath();x.roundRect(bx-8,29,16,2.4,1);x.fill();
  const c1=o.tattered?'#6a2030':'#9a2438',c2=o.tattered?'#3a0e18':'#5a1220';
  x.beginPath();x.moveTo(bx-6.5,31);x.lineTo(bx+6.5,31);x.bezierCurveTo(bx+7.5+sw*.5,46,bx+6.5+sw,60,bx+7+sw2,74);x.lineTo(bx+sw2*.5,69+Math.sin(t/500+bx)*.8);x.lineTo(bx-7+sw2,74);x.bezierCurveTo(bx-6.5+sw,60,bx-7.5+sw*.5,46,bx-6.5,31);x.closePath();
  const g=x.createLinearGradient(bx-7,0,bx+7,0);g.addColorStop(0,c2);g.addColorStop(.35,c1);g.addColorStop(.7,c1);g.addColorStop(1,c2);x.fillStyle=g;x.fill();
  x.save();x.clip();x.strokeStyle='rgba(0,0,0,.2)';x.lineWidth=.8;for(let k=-1;k<=1;k++){x.beginPath();x.moveTo(bx+k*3.4,32);x.quadraticCurveTo(bx+k*3.6+sw*.7,52,bx+k*3.6+sw2,74);x.stroke()}x.restore();
  x.save();x.translate(sw*.5,0);x.fillStyle='#e3b54e';x.beginPath();x.moveTo(bx,40);x.lineTo(bx+3.4,48);x.lineTo(bx,56);x.lineTo(bx-3.4,48);x.closePath();x.fill();x.fillStyle=c1;x.beginPath();x.arc(bx,48,1.3,0,7);x.fill();x.restore()}
 /* door on left wall */
 x.fillStyle='#0b080e';x.beginPath();x.moveTo(13,92);x.lineTo(36.5,83.4);x.lineTo(36.5,118.5);x.lineTo(13,133);x.closePath();x.fill();
 const dg=x.createLinearGradient(16,0,35,0);if(o.doorOpen){dg.addColorStop(0,o.night?'#0c0c1c':'#e8c984');dg.addColorStop(1,o.night?'#06060e':'#8a7248')}else{dg.addColorStop(0,'#6a4426');dg.addColorStop(1,'#3a2414')}
 x.fillStyle=dg;x.beginPath();x.moveTo(15.4,94);x.lineTo(34.6,86.6);x.lineTo(34.6,117);x.lineTo(15.4,130);x.closePath();x.fill();
 if(!o.doorOpen){x.strokeStyle='rgba(20,10,4,.55)';x.lineWidth=.5;for(let k=1;k<5;k++){const u=k/5;x.beginPath();x.moveTo(15.4+u*19.2,94-u*7.4);x.lineTo(15.4+u*19.2,130-u*13);x.stroke()}x.fillStyle='#e3b54e';x.beginPath();x.arc(31,104,1,0,7);x.fill()}
 /* flames (bezier teardrops) */
 const flame=(fx,fy,w)=>{const f=Math.sin(t/70+fx)*.9+Math.sin(t/37+fx*2)*.5,h=7+f;
  const g=x.createRadialGradient(fx,fy-2,.4,fx,fy-3,h);g.addColorStop(0,'#fff4c0');g.addColorStop(.35,'#ffb347');g.addColorStop(1,'rgba(255,90,20,0)');x.fillStyle=g;
  x.beginPath();x.moveTo(fx-w,fy);x.bezierCurveTo(fx-w*1.2,fy-h*.5,fx-w*.3+Math.sin(t/90+fx)*.6,fy-h*.8,fx+Math.sin(t/60+fx)*.7,fy-h);x.bezierCurveTo(fx+w*.5,fy-h*.6,fx+w*1.3,fy-h*.4,fx+w,fy);x.closePath();x.fill()};
 flame(110,82,2.8);flame(210,82,2.8);flame(30,64,2.1);flame(290,64,2.1);
 /* shade the room so characters stand out of it */
 x.fillStyle=o.night?'rgba(14,16,48,.30)':'rgba(30,14,36,.12)';x.fillRect(0,0,W,H);
 /* characters */
 const T=t,talk=VC.talking;
 VC.draw(x,'king',160,97,47,{facing:'f',seated:true,expr:o.kingExpr||'neutral',t:T,noShadow:true});
 x.fillStyle=x.createLinearGradient(138,0,182,0);x.fillStyle='#c79a32';[[137.5,69],[172.5,69]].forEach(([ax,ay])=>{x.beginPath();x.roundRect(ax,ay,9,4.4,1.6);x.fill();x.fillStyle='#5e3c12';x.beginPath();x.roundRect(ax+1.3,ay+4.4,6.4,13,1.4);x.fill();x.fillStyle='#c79a32'});
 (o.advisors||[]).forEach((k,i)=>VC.draw(x,k,232+i*19,120+i*6,48,{mirror:true,facing:'q',t:T,expr:'neutral'}));
 if(o.petitioner){const walking=o.frame>0;VC.draw(x,o.petitioner,o.px,o.py,64,{mirror:!!o.leaving,facing:'q',t:T,expr:o.expr||'neutral',walk:walking?T/115:0,talk:!walking&&talk})}
 VC.draw(x,'guard',292,182,74,{mirror:true,facing:'q',t:T});
 /* pillars in the foreground */
 for(const px of[0,W-14]){const g=x.createLinearGradient(px,0,px+14,0);g.addColorStop(0,'#0a0710');g.addColorStop(.7,'#1c1422');g.addColorStop(1,'#2f2335');x.fillStyle=g;x.fillRect(px,0,14,H);x.fillStyle='rgba(255,230,210,.07)';x.fillRect(px===0?11:px,0,1.4,H)}
 /* light */
 x.save();x.globalCompositeOperation='lighter';
 const fl=1+Math.sin(t/120)*.04+Math.sin(t/53)*.03;
 hallLight(x,110,76,74*fl,'255,150,60',.34);hallLight(x,210,76,74*fl,'255,150,60',.34);hallLight(x,30,58,64*fl,'255,140,50',.30);hallLight(x,290,58,64*fl,'255,140,50',.30);
 hallLight(x,160,24,34,o.night?'150,170,255':'255,220,160',.34);
 if(!o.night){const br=P.beam;const sh=(Math.sin(t/3200)*.5+.5);
  for(const wx of[86,234]){const dir=wx<160?1:-1;const g=x.createLinearGradient(wx,10,wx+dir*34,H);g.addColorStop(0,br);g.addColorStop(1,'rgba(255,225,160,0)');x.globalAlpha=.55+sh*.45;x.fillStyle=g;x.beginPath();x.moveTo(wx-8,12);x.lineTo(wx+8,12);x.lineTo(wx+dir*70,H);x.lineTo(wx+dir*18,H);x.closePath();x.fill()}x.globalAlpha=1;
  x.fillStyle='rgba(255,236,190,.8)';for(const dm of hallDust){dm.y+=dm.v;dm.x+=dm.v*.35;if(dm.y>H){dm.y=14;dm.x=50+Math.random()*220}x.globalAlpha=.25+.5*Math.abs(Math.sin(t/900+dm.x));x.beginPath();x.arc(dm.x,dm.y,dm.r,0,7);x.fill()}x.globalAlpha=1}
 x.restore();
 x.fillStyle=P.tint;x.fillRect(0,0,W,H);
 if(o.ch>=3&&!o.night){x.fillStyle='rgba(205,185,175,.55)';for(let i=0;i<18;i++){x.beginPath();x.arc((i*53+t/28)%W,(i*37+t/16)%H,.55,0,7);x.fill()}x.fillStyle='rgba(140,40,20,.08)';x.fillRect(0,0,W,H)}
 const vg=x.createRadialGradient(160,100,70,160,100,215);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(6,3,10,.72)');x.fillStyle=vg;x.fillRect(0,0,W,H);
}
