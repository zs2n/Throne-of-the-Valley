/* ===== ENGINE: speech before battle + animated siege with three decisions ===== */
const SPEECH=[
 {title:'افتتاح الخطبة',opts:[
  {t:'«يا أهل الواحة، لم أترككم جوعى يومًا»',f:()=>S.famines===0&&S.hap>=50?[10,'هتف الناس: صدقتَ!']:[-5,'تذكّر الناس الجوع فتمتموا.']},
  {t:'«سأكون أول من يقف على السور»',f:()=>[6,'رفع الجنود رماحهم.']},
  {t:'«الرماد جاء جائعًا، ونحن سنصمد لأننا أهل»',f:()=>F('refugees')||F('ashsecret')?[8,'فهم الناس أنهم يقاتلون من أجل شيء أكبر.']:[3,'أومأ بعضهم.']}]},
 {title:'عن الحلفاء',opts:[
  {t:'«إخوتنا من الجبال معنا»',f:()=>S.rel.horn>=70?[10,'زأر محاربو القرن من خلف الصفوف.']:[-6,'التفت الناس يبحثون عن أهل القرن. لم يجدوهم.']},
  {t:'«النهر لم يتركنا»',f:()=>S.rel.river>=70?[8,'لوّح بحّارة ماجد بمجاديفهم.']:[-4,'لا سفن في النهر. سكت الناس.']},
  {t:'«القمر يحرس أسوارنا»',f:()=>S.rel.moon>=70&&!F('betrayedmoon')?[8,'رفعت الكاهنات قناديلهن على البرج.']:[-4,'لا قناديل على البرج الليلة.']}]},
 {title:'الختام',opts:[
  {t:'«الخائن في القيد، ولا خنجر في ظهوركم»',f:()=>F('exposed')?[12,'صفّق الناس. يعرفون أن البوابة آمنة.']:[-8,'همس أحدهم: وأين الأمير طلال؟']},
  {t:'«إن سقطتُ، فقاتلوا من أجل أطفالكم»',f:()=>F('evac')?[8,'الأطفال في أمان. الآباء يقاتلون بلا خوف.']:[4,'شدّ الآباء على أسلحتهم.']},
  {t:'«غنّوا معي!»',f:()=>F('bards')||S.done.anthem||S.done.bard?[10,'ارتفع نشيد سعيد على الأسوار.']:[3,'غنّى قليلون بأصوات مرتجفة.']}]},
];
let SG=null;/* siege state */
function siegeSetup(){
 const me=myPower(),en=enemyPower();
 SG={phase:0,my:1,en:1,log:[],t0:performance.now(),enemyX:330,fires:[],arrows:[],breach:pick(['north','gate','river']),
  traitor:!F('exposed')&&(F('tower')||F('vanguard'))?(F('vanguard')?60:35):0,baseMe:me,baseEn:en};
}
const PHASES=[
 {title:'المرحلة الأولى: السهام',text:'جيش الرماد يتقدّم عبر الحقول. الرماة على الأسوار ينتظرون أمرك.',opts:()=>[
  {t:'أطلقوا الآن',r:F('arrows')||F('halfarrows')?[0,-.10,'أمطرت السهام صفوفهم الأولى.']:[0,-.05,'سهام قليلة، لكنها أبطأتهم.']},
  {t:'انتظروا حتى يقتربوا',r:F('crossbows')||S.fort>=2?[0,-.15,'حين اقتربوا، حصدتهم الأقواس الآلية من خلف الأسوار.']:[-.05,-.05,'اقتربوا أكثر مما ينبغي، وبلغ بعضهم السور.']},
  {t:'أشعلوا الحقول أمامهم',r:[0,-.12,'احترقت حقولك، واحترق معها نصف كبرياء صخر.'],e:{hap:-3}}]},
 {title:'المرحلة الثانية: البوابة',text:'الكبش يضرب البوابة. الخشب يئن.',opts:()=>[
  {t:'صبّوا الزيت المغلي',need:()=>F('oil'),hint:'يتطلب قدور الزيت',r:[0,-.15,'صرخات تحت البوابة، واحترق الكبش.']},
  {t:'الاحتياط إلى البوابة',r:[-.05,-.10,'صمدت البوابة بأكتاف الرجال.']},
  {t:'هجوم مضاد بالخيل',r:S.rel.horn>=70||S.rel.river>=70?[0,-.18,'انقضّ الحلفاء من الجانب، وتفرّق حاملو الكبش.']:[-.10,-.06,'خرجت الخيل قليلة، وعاد نصفها.']}]},
 {title:'المرحلة الثالثة: الثغرة',text:()=>'انهار جزء من السور! '+(F('scouted')?'كشّافتك يعرفون طرق صخر: الهجمة الكبرى ستأتي من '+{north:'البرج الشمالي',gate:'البوابة',river:'سور النهر'}[SG.breach]+'.':'لا تعرف من أين ستأتي الهجمة الكبرى.')+' إلى أين ترسل الاحتياط الأخير؟',opts:()=>[['north','البرج الشمالي'],['gate','البوابة'],['river','سور النهر']].map(([k,n])=>({t:n,r:k===SG.breach?[0,-.15,'كان الاحتياط في المكان الصحيح. ارتدّ جيش الرماد.']:[-.08,0,'جاءت الهجمة من مكان آخر، وتراجع رجالك خطوة.']}))},
];
function siegeScene(t){
 const x=g,W=320,H=180,K=HALL.K;x.setTransform(K,0,0,K,0,0);x.imageSmoothingEnabled=true;
 const sky=x.createLinearGradient(0,0,0,H);sky.addColorStop(0,'#1a0e1c');sky.addColorStop(.55,'#6a2a1c');sky.addColorStop(1,'#2a1410');x.fillStyle=sky;x.fillRect(0,0,W,H);
 const sg=x.createRadialGradient(262,118,2,262,118,90);sg.addColorStop(0,'rgba(255,170,80,.55)');sg.addColorStop(1,'rgba(255,120,50,0)');x.fillStyle=sg;x.fillRect(150,20,170,200);
 for(let i=0;i<30;i++){x.fillStyle='rgba(255,200,150,'+(.2+.2*Math.sin(t/700+i))+')';x.beginPath();x.arc((i*37)%W,(i*23)%70,.5,0,7);x.fill()}
 x.fillStyle='#24141a';x.beginPath();x.moveTo(0,130);for(let i=0;i<=W;i+=8)x.lineTo(i,118+Math.sin(i/22)*5+Math.sin(i/9)*1.5);x.lineTo(W,H);x.lineTo(0,H);x.closePath();x.fill();
 const gg=x.createLinearGradient(0,136,0,H);gg.addColorStop(0,'#4a2e20');gg.addColorStop(1,'#241410');x.fillStyle=gg;x.fillRect(0,136,W,44);
 const target=[250,190,150,130][SG.phase]||130;SG.enemyX+=(target-SG.enemyX)*.01;
 const n=Math.min(22,Math.round(26*Math.min(1.3,SG.en)));
 for(let i=0;i<n;i++){const col=i%7,row=Math.floor(i/7),ex=SG.enemyX+col*17+row*7,ey=140+row*8;
  VC.draw(x,'ashsoldier',ex,ey,23,{mirror:true,facing:'q',t:t,walk:SG.phase<3?t/150+i:0});
  if(i%7===3){x.strokeStyle='#3a1a10';x.lineWidth=.8;x.beginPath();x.moveTo(ex+3,ey-24);x.lineTo(ex+3,ey-2);x.stroke();x.fillStyle='#c4552b';x.beginPath();x.moveTo(ex+3.4,ey-24);x.quadraticCurveTo(ex+8,ey-23+Math.sin(t/200+i)*1.5,ex+10,ey-20);x.lineTo(ex+3.4,ey-19);x.fill()}}
 if(SG.phase>=1){x.fillStyle='#6a4626';x.beginPath();x.roundRect(SG.enemyX-32,140,26,7,2);x.fill();x.fillStyle='#2a2028';x.beginPath();x.roundRect(SG.enemyX-38,141,9,5,2);x.fill()}
 const wg=x.createLinearGradient(0,0,96,0);wg.addColorStop(0,'#3c3446');wg.addColorStop(1,'#5a506a');x.fillStyle=wg;x.fillRect(0,60,96,120);
 for(let i=0;i<96;i+=12){x.beginPath();x.roundRect(i,52,8,9,1);x.fill()}
 x.strokeStyle='rgba(0,0,0,.25)';x.lineWidth=.5;for(let y=68;y<180;y+=8){x.beginPath();x.moveTo(0,y);x.lineTo(96,y);x.stroke()}
 x.fillStyle='#24140e';x.beginPath();x.moveTo(68,180);x.lineTo(68,128);x.quadraticCurveTo(81,112,94,128);x.lineTo(94,180);x.fill();x.fillStyle=SG.phase>=2?'#7a5630':'#523420';x.beginPath();x.moveTo(71,180);x.lineTo(71,130);x.quadraticCurveTo(81,117,91,130);x.lineTo(91,180);x.fill();
 if(SG.phase>=3){x.fillStyle='#1a1014';x.beginPath();x.moveTo(20,60);x.quadraticCurveTo(34,64,40,72);x.lineTo(30,100);x.lineTo(14,90);x.fill()}
 const defenders=Math.min(7,Math.round(7*Math.min(1.4,SG.my)));
 for(let i=0;i<defenders;i++)VC.draw(x,'guard',12+i*12,60,21,{facing:'q',t:t,noShadow:true});
 if(Math.random()<.25)SG.arrows.push({x:90,y:48,vx:2+Math.random()*1.5,vy:-1-Math.random()});
 if(Math.random()<.15)SG.arrows.push({x:SG.enemyX,y:124,vx:-2-Math.random(),vy:-1.6,e:1});
 x.strokeStyle='#f0deb6';x.lineWidth=.7;x.lineCap='round';SG.arrows=SG.arrows.filter(a=>{a.x+=a.vx;a.y+=a.vy;a.vy+=.05;x.beginPath();x.moveTo(a.x,a.y);x.lineTo(a.x-a.vx*2,a.y-a.vy*2);x.stroke();return a.y<140&&a.x>-5&&a.x<330});
 x.save();x.globalCompositeOperation='lighter';for(const f of SG.fires){const fl=Math.sin(t/60+f.x)*2,h=9+fl;const gr=x.createRadialGradient(f.x,f.y-2,.5,f.x,f.y-3,h);gr.addColorStop(0,'rgba(255,240,170,.95)');gr.addColorStop(.4,'rgba(255,140,40,.7)');gr.addColorStop(1,'rgba(255,80,20,0)');x.fillStyle=gr;x.beginPath();x.arc(f.x,f.y-3,h,0,7);x.fill()}x.restore();
 const vg=x.createRadialGradient(160,90,60,160,90,210);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,.6)');x.fillStyle=vg;x.fillRect(0,0,W,H);
}
function siegeBar(){const me=SG.baseMe.total*SG.my,en=SG.baseEn*SG.en;const p=clamp(me/(me+en)*100,5,95);return`<div class="row"><span>${ic('soldiers')} الواحة</span><span>جيش الرماد ${ic('enemy')}</span></div><div class="siegebar"><i style="width:${p}%"></i></div>`}
function siegePhase(){
 if(SG.phase>=PHASES.length){siegeEnd();return}
 if(SG.phase===1&&SG.traitor&&!SG.traitorDone){siegeTraitor();return}
 const P=PHASES[SG.phase],opts=P.opts();sfx('drum');
 $('#panel').innerHTML=`<h3>${P.title}</h3>${siegeBar()}<div class="speech">${txt(P.text)}</div><div class="opts">${opts.map((o,i)=>{const no=o.need&&!o.need();return`<button class="opt siege-pick" data-sp="${i}" ${no?'disabled':''}><span>${o.t}</span>${o.need?`<span class="chips"><span class="chip ${no?'bad':'req'}">${o.hint}</span></span>`:''}</button>`}).join('')}</div>${SG.log.length?`<div class="ledger"><ul>${SG.log.map(l=>`<li class="note" style="display:block">${l}</li>`).join('')}</ul></div>`:''}`;
 $$('[data-sp]').forEach(b=>b.onclick=()=>{if(SG.busy)return;SG.busy=1;$$('.siege-pick').forEach(x=>x.disabled=true);const o=opts[+b.dataset.sp];const[dm,de,txt_]=o.r;SG.my*=1+dm;SG.en*=1+de*.6;if(o.e)apply(o.e);SG.log.push(`${P.title.split(':')[1].trim()}: ${txt_}`);
  sfx(de<-.1?'good':'clash');if(de<0)for(let k=0;k<3;k++)SG.fires.push({x:SG.enemyX+Math.random()*60,y:132+Math.random()*10});SG.phase++;setTimeout(()=>{SG.busy=0;siegePhase()},400)});
}
function siegeTraitor(){
 sfx('bad');const can=[];
 $('#panel').innerHTML=`<h3>خيانة!</h3>${siegeBar()}<div class="speech">البوابة الشرقية تُفتح من الداخل! رجال الأمير طلال يرفعون المزلاج وجيش الرماد يندفع نحوها.</div><div class="opts">
  <button class="opt siege-pick" data-tr="ghazi" ${S.ret.ghazi.on&&S.ret.ghazi.inj<=S.week?'':'disabled'}><span>غازي، أغلقها بأي ثمن!</span></button>
  <button class="opt siege-pick" data-tr="nawal" ${S.ret.nawal.on?'':'disabled'}><span>نوال، أوقفي طلال</span></button>
  <button class="opt siege-pick" data-tr="none"><span>لا أحد هناك… قاتلوا عند البوابة الرئيسية</span></button></div>`;
 $$('[data-tr]').forEach(b=>b.onclick=()=>{if(SG.busy)return;SG.busy=1;$$('.siege-pick').forEach(x=>x.disabled=true);const k=b.dataset.tr;const frac=k==='nawal'?.9:k==='ghazi'?.55:0;SG.en*=1-(SG.traitor*frac)/SG.baseEn;
  SG.log.push(k==='nawal'?'خيانة: سقط طلال بخنجر نوال قبل أن تُفتح البوابة كاملة.':k==='ghazi'?'خيانة: أغلق غازي البوابة الشرقية بعد أن عبر بعضهم.':'خيانة: عبر رجال صخر البوابة الشرقية.');
  if(k==='nawal')S.flags.rustamfell=1;SG.traitorDone=1;setTimeout(()=>{SG.busy=0;siegePhase()},300)});
}
function siegeEnd(){
 sceneHook=null;
 const me=myPower(),en=Math.round(SG.baseEn*SG.en),mt=Math.round(me.total*SG.my);
 const r=mt/en;S.battle={me:{total:mt,parts:me.parts.concat([['قرارات المعركة ('+(SG.my>=1?'+':'')+A(Math.round((SG.my-1)*100))+'٪)',mt-me.total]])},en,r,log:SG.log};
 let k;if(r>=1.1)k=F('exposed')||F('rustamfell')?(S.hap>=50?'dawn':'victory'):(S.hap>=60?'shadow':'stolen');else if(r>=.85)k='ashwin';else k=(F('betrothed')&&S.rel.horn>=50)?'exile':'fall';
 sfx(r>=1.1?'good':'bad');setTimeout(()=>{showStage('scene');ending(k)},900);
}
function speechStart(){
 let round=0,total=0;const lines=[];
 const show=()=>{if(round>=SPEECH.length){S.morale=clamp(S.morale+total,-30,30);S.speech=lines;startSiege();return}
  const R=SPEECH[round];
  $('#panel').innerHTML=`<h3>خطبة الملك: ${R.title}</h3><p class="muted">آلاف العيون على الشرفة. كل جملة تُحسب، والكلام الذي لا يصدّقه الناس يضرّ. (${ic('morale')} المعنويات: ${sg(S.morale+total)}٪)</p>${lines.length?`<div class="ledger"><ul>${lines.map(l=>`<li class="note" style="display:block">${l}</li>`).join('')}</ul></div>`:''}<div class="opts speech-pick">${R.opts.map((o,i)=>`<button class="opt siege-pick" data-sq="${i}">${o.t}</button>`).join('')}</div>`;
  $$('[data-sq]').forEach(b=>b.onclick=()=>{const o=R.opts[+b.dataset.sq];const[v,res]=o.f();total+=v;lines.push(`${o.t} ← ${res} (${sg(v)}٪)`);sfx(v>0?'good':'bad');round++;show()})};
 show();
}
function startSiege(){siegeSetup();sceneHook=siegeScene;showStage('siege');$('#scene').hidden=false;siegePhase()}
FINALE=()=>{$('#queue').hidden=true;speechStart()};
HOOK.ending.push(()=>{const b=S.battle;if(!b||!b.log)return'';return`<div class="ledger"><h4>يوم الحصار</h4><ul>${(S.speech||[]).concat(b.log).map(l=>`<li class="note" style="display:block">${l}</li>`).join('')}</ul></div>`});
