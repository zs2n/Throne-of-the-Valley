/* ===== Throne hall v4: flat side-on stage (Yes, Your Grace style) =====
   The room is a painted pixel-art backdrop (src/art/hall.png, embedded as ART.hall) at 480x270.
   Code adds life on top: candle flicker, window light shafts, dust, small characters, tints per chapter/night. */
const HALL={W:480,H:270,door:[-24,236],stand:[122,236],style:'tall',
 throne:[239,174],                     /* king's seat: center x, sitting-base y */
 /* light sources (x,y,radius) for flicker; windows (x0,x1,y0,y1) for shafts and night glow */
 lights:[[243,42,46],[202,90,26],[277,90,26],[5,95,30],[476,95,30]],
 wins:[[148,170,30,143],[312,332,30,143]],
 advisors:[[300,198],[318,198],[336,198],[354,198]]};
let hallImg=null,hallBg=null,hallKey='';
function hallImage(){if(!hallImg){hallImg=new Image();hallImg.src=ART.hall}return hallImg}
function bakeHall(ch,night,tat){
 const img=hallImage();if(!img.complete||!img.naturalWidth)return null;
 const W=HALL.W,H=HALL.H,cv=document.createElement('canvas');cv.width=W;cv.height=H;const x=cv.getContext('2d');x.imageSmoothingEnabled=false;
 x.drawImage(img,0,0,W,H);
 /* mood: multiply tint, then a gentle lift so shadows keep detail */
 const tint=night?'#46548c':ch===2?'#d9c6e6':ch===3?'#e6b4a4':null;
 if(tint){x.save();x.globalCompositeOperation='multiply';x.fillStyle=tint;x.fillRect(0,0,W,H);x.restore()}
 if(tat){x.save();x.globalCompositeOperation='multiply';x.fillStyle='#b4a4ac';x.fillRect(0,0,W,H);x.restore()}
 if(night){x.save();x.globalCompositeOperation='lighter';
  for(const[a,b,y0,y1]of HALL.wins){const g=x.createLinearGradient(0,y0,0,y1);g.addColorStop(0,'rgba(120,140,230,.50)');g.addColorStop(1,'rgba(60,70,150,.25)');x.fillStyle=g;x.fillRect(a,y0,b-a,y1-y0)}
  x.restore()}
 return cv}
function drawHall3(x,t,o){
 const night=!!o.night,W=HALL.W,H=HALL.H,key=o.ch+'|'+(night?1:0)+'|'+(o.tattered?1:0);
 if(!hallBg||hallKey!==key){const b=bakeHall(o.ch,night,o.tattered);if(!b){x.fillStyle='#1a1220';x.fillRect(0,0,W,H);return}hallBg=b;hallKey=key}
 x.drawImage(hallBg,0,0);
 /* light shafts from the windows (day only) */
 x.save();x.globalCompositeOperation='lighter';
 if(!night){x.fillStyle='rgba(255,226,170,.06)';
  x.beginPath();x.moveTo(150,44);x.lineTo(170,44);x.lineTo(236,262);x.lineTo(176,262);x.fill();
  x.beginPath();x.moveTo(312,44);x.lineTo(332,44);x.lineTo(268,262);x.lineTo(322,262);x.fill()}
 /* candle flicker */
 const fl=i=>1+Math.sin(t/110+i*2.3)*.07+Math.sin(t/47+i)*.04;
 HALL.lights.forEach(([lx,ly,r],i)=>{const rr=r*fl(i),g=x.createRadialGradient(lx,ly,0,lx,ly,rr);g.addColorStop(0,'rgba(255,170,80,'+(night?.34:.20)+')');g.addColorStop(1,'rgba(255,170,80,0)');x.fillStyle=g;x.fillRect(lx-rr,ly-rr,rr*2,rr*2)});
 x.restore();
 /* characters: small, standing on the floor like a stage */
 const S3=(k,o2)=>SP3.get(k,Object.assign({style:HALL.style},o2));
 const put=(k,cx,feet,o2,flip,still)=>{const cv=S3(k,o2),w=cv.width;const bob=still||(o2&&o2.frame)?0:(Math.sin(t/760+cx*.41)>.55?-1:0);feet+=bob;
  x.fillStyle='rgba(8,4,10,.40)';x.beginPath();x.ellipse(cx,feet,w*.30,Math.max(1.6,w*.07),0,0,7);x.fill();
  if(flip){x.save();x.translate(Math.round(cx),0);x.scale(-1,1);x.drawImage(cv,-Math.round(w/2),Math.round(feet-cv.height+1));x.restore()}
  else x.drawImage(cv,Math.round(cx-w/2),Math.round(feet-cv.height+1))};
 const kc=S3('king',{H:34,facing:'f',seated:true,expr:o.kingExpr||'neutral'});
 x.drawImage(kc,Math.round(HALL.throne[0]-kc.width/2),Math.round(HALL.throne[1]-kc.height+1)+(Math.sin(t/900)>.6?-1:0));
 put('guard',54,214,{H:44,facing:'q'},false);put('guard',428,214,{H:44,facing:'q'},true);
 (o.advisors||[]).forEach((k,i)=>{const p=HALL.advisors[i];if(p)put(k,p[0],p[1],{H:40,facing:'q'},p[0]>HALL.throne[0])});
 if(o.petitioner)put(o.petitioner,o.px,o.py,{H:48,facing:'q',expr:o.expr||'neutral',frame:o.frame||0},o.leaving);
 /* dust drifting through the light (day) */
 if(!night){x.fillStyle='rgba(255,236,190,.55)';for(const dm of hallDust){dm.y+=dm.v;dm.x+=dm.v*.35;if(dm.y>H-10){dm.y=36;dm.x=150+Math.random()*180}x.fillRect(Math.round(dm.x),Math.round(dm.y),1,1)}}
 /* ash on the wind in chapter 3 */
 if(o.ch>=3&&!night){x.fillStyle='rgba(200,180,170,.6)';for(let i=0;i<18;i++)x.fillRect((i*53+t/26)%W,(i*37+t/16)%H,1,1)}
 /* soft vignette */
 const vg=x.createRadialGradient(W/2,H*.52,H*.38,W/2,H*.52,W*.62);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(6,3,10,.50)');x.fillStyle=vg;x.fillRect(0,0,W,H);
}
const hallDust=Array.from({length:40},()=>({x:150+Math.random()*180,y:30+Math.random()*220,v:.05+Math.random()*.1}));
