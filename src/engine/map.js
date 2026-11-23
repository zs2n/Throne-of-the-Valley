/* ===== ENGINE: kingdom map ===== */
const mc=$('#map'),mg=mc.getContext('2d');
let mapBase=null,selLoc='castle';
function drawMapBase(){
 /* painted kingdom (src/art/map.png, 640x400): castle centre, mountains north, river and port west, forest south-east, ash lands east */
 if(!window.mapImg){window.mapImg=new Image();window.mapImg.src=ART.map}
 const im=window.mapImg;if(!im.complete||!im.naturalWidth)return;
 const cv=document.createElement('canvas');cv.width=640;cv.height=400;const m=cv.getContext('2d');m.imageSmoothingEnabled=false;m.drawImage(im,0,0,640,400);
 mapBase=cv}
const mapLayers=[];/* living-map layers: f(ctx,t) */
function drawMap(t){if(!mapBase)drawMapBase();if(!mapBase)return;mg.drawImage(mapBase,0,0);mg.save();mg.scale(2,2);for(const f of mapLayers)f(mg,t||0);mg.restore()}
function renderNodes(onPick){const box=$('#nodes');box.innerHTML='';
 for(const k in LOC){const L=LOC[k];const ms=M.filter(m=>m.loc===k&&(!m.cond||m.cond()));const here=S.missions.filter(m=>(M.find(x=>x.id===m.id)||{}).loc===k);
  const b=document.createElement('button');b.className='node'+(k===selLoc?' sel':'');b.style.right=(100-L.x/320*100)+'%';b.style.top=(L.y/200*100)+'%';
  b.innerHTML=`<i></i><em>${L.n}</em>${ms.length?`<span class="badge">${A(ms.length)}</span>`:''}${here.length?`<span class="busy">${here.map(m=>N[m.ret][0].split(' ').pop()).join('، ')}</span>`:''}`;
  b.onclick=()=>{selLoc=k;onPick()};b.setAttribute('aria-label',L.n);box.appendChild(b)}}

/* ---- living map: the kingdom shows what has happened ---- */
mapLayers.push((m,t)=>{
 if(!S)return;
 /* smoke over the ash lands */
 for(let i=0;i<6;i++){const sx=250+i*11,sy=(80+i*17)%180,k=((t/40+i*30)%60)/60;m.fillStyle=`rgba(90,84,80,${.32*(1-k)})`;m.beginPath();m.arc(sx+k*6,sy-k*20,3+k*5,0,7);m.fill()}
 /* Bahram's army marches week by week */
 const p=Math.min(1,(S.week-1)/11)*.85,ax=280+(168-280)*p,ay=84+(98-84)*p;
 for(let i=0;i<14;i++){m.fillStyle=i%3?'#3a3438':'#c4552b';m.fillRect(Math.round(ax+(i%5)*4-6+Math.sin(t/300+i)),Math.round(ay+Math.floor(i/5)*3+6),2,2)}
 m.fillStyle='#5a1a10';m.fillRect(Math.round(ax),Math.round(ay-6),1,10);m.fillStyle='#c4552b';m.fillRect(Math.round(ax)+1,Math.round(ay-6+Math.sin(t/200)),5,3);
 /* bandits: burning village and a wolf in the forest */
 if(F('bandits')&&!F('banditsdone')){const f=Math.sin(t/70)*1.5;m.fillStyle='rgba(255,120,40,.85)';m.fillRect(96,124-f,5,7+f);m.fillStyle='#ffd27a';m.fillRect(97,127-f,2,3);m.fillStyle='rgba(60,50,50,.6)';m.beginPath();m.arc(100,116-((t/30)%14),3,0,7);m.fill();
  m.fillStyle='#2a2422';m.fillRect(214,170,5,3);m.fillRect(218,168,2,2);m.fillStyle='#ff3a3a';m.fillRect(219,168,1,1)}
 /* plague haze */
 if(F('plague')&&!F('cured')){m.fillStyle=`rgba(120,200,90,${.18+Math.sin(t/400)*.06})`;m.beginPath();m.arc(94,134,16,0,7);m.fill()}
 /* temple light */
 if(F('temple')){m.fillStyle=`rgba(160,200,255,${.35+Math.sin(t/300)*.15})`;m.beginPath();m.arc(38,168,8,0,7);m.fill()}
 /* Horn banners when they will march */
 if(S.rel.horn>=70)for(const[bx,by]of[[128,30],[154,26],[140,36]]){m.fillStyle='#4a3020';m.fillRect(bx,by,1,8);m.fillStyle='#c9a24a';m.fillRect(bx+1,by+Math.sin(t/250+bx),4,3)}
 /* River ships when trade flows */
 if(S.rel.river>=60){const k=(t/9000)%1;const sx=32-k*26,sy=92+k*34;m.fillStyle='#5a3a20';m.fillRect(Math.round(sx)-3,Math.round(sy),7,2);m.fillStyle='#efe6d0';m.fillRect(Math.round(sx),Math.round(sy)-5,1,5);m.fillRect(Math.round(sx)+1,Math.round(sy)-4,3,3)}
 /* refugee tents near the castle */
 if(F('refugees'))for(let i=0;i<3;i++){m.fillStyle='#8a7a68';m.beginPath();m.moveTo(172+i*7,114);m.lineTo(175+i*7,108);m.lineTo(178+i*7,114);m.fill()}
 /* walls grow with fortification */
 for(let k=0;k<S.fort;k++){m.strokeStyle='#8a8590';m.lineWidth=1;m.strokeRect(136-k*3,78-k*3,32+k*6,28+k*6)}
});
