/* ===== ENGINE: finale, endings, title, boot ===== */
/* painted backdrops behind the title and ending cards (src/art/end_*.png) */
const ENDART={dawn:'end_good',victory:'end_good',peace:'end_good',shadow:'end_storm',stolen:'end_storm',ashwin:'end_storm',exile:'end_storm',fall:'end_fall',revolt:'end_fall'};
const ovArt=n=>ART[n]?`<div class="ovart" style="background-image:linear-gradient(rgba(10,7,12,.28),rgba(10,7,12,.66)),url(${ART[n]})"></div>`:'';

function finale(){
 if(F('peacedone')){ending('peace');return}
 if(FINALE){FINALE();return}
 resolveBattle();
}
function resolveBattle(bonus){
 const me=myPower();if(bonus){me.parts.push(...bonus.parts);me.total+=bonus.total}
 const en=enemyPower();const r=me.total/en;S.battle={me,en,r};
 let k;if(r>=1.1)k=F('exposed')?(S.hap>=50?'dawn':'victory'):(S.hap>=60?'shadow':'stolen');else if(r>=.85)k='ashwin';else k=(F('betrothed')&&S.rel.horn>=50)?'exile':'fall';
 ending(k);
}
function ending(k){
 S.phase='end';S.endKey=k;store.del(SAVE);
 const[t,body]=ENDS[k];const b=S.battle;const lines=[];
 if(b){lines.push(...b.me.parts.map(([n,v])=>`<li><span>${n}</span><span class="p">${A(v)}</span></li>`));lines.push(`<li><span><b>قوّتك</b></span><span>${A(b.me.total)}</span></li><li><span><b>جيش بهرام</b>${S.rel.moon>=70&&!F('betrayedmoon')?' (أضعفه سحر القمر)':''}${!F('exposed')?' (بمساعدة الخائن)':''}</span><span class="n">${A(b.en)}</span></li>`)}
 const fam=[];if(F('linatrust'))fam.push('لينا وثقت بك حتى النهاية.');if(F('linacold'))fam.push('لينا لم تسامحك على الخطبة.');if(F('queentrust'))fam.push('الملكة ديما بقيت إلى جانبك.');if(F('pardoned'))fam.push('رستم قاتل في الصف الأول ليمحو عاره.');if(F('betrayedmoon'))fam.push('أسيل لم تعد من الشرق.');
 const extra=run('ending',k);
 $('#ov').hidden=false;$('#ov').innerHTML=`${ovArt(ENDART[k])}<div class="box ending on-art"><p class="muted">النهاية · ${DIFF[S.diff].n}</p><h1>${t}</h1><p>${body}</p>
 ${lines.length?`<div class="ledger"><h4>ميزان الحصار</h4><ul>${lines.join('')}</ul></div>`:''}
 ${fam.length?`<p class="muted">${fam.join(' ')}</p>`:''}
 <p class="muted">رضا ${A(S.hap)} · جنود ${A(S.soldiers)} · بنو النهر ${A(S.rel.river)} · أهل القرن ${A(S.rel.horn)} · رهبنة القمر ${A(S.rel.moon)}</p>
 ${extra.join('')}
 <div class="row"><button class="px gold" id="again">احكم من جديد</button></div><p class="credit">إنتاج استوديو قرطاس</p></div>`;
 $('#again').onclick=()=>title();
 run('endingBind',k);
}
HOOK.endingBind=HOOK.endingBind||[];
function title(){
 const sv=load();
 $('#ov').hidden=false;$('#ov').innerHTML=`${ovArt('end_good')}<div class="box on-art"><div class="title-name">عرش الوادي</div><p class="title-sub">لعبة إدارة مملكة وقرارات</p>
 <p>أنت الملك سالار. الجفاف يأكل حقولك، وأخوك يبتسم أكثر مما ينبغي، وفي الشرق يجمع بهرام سيّد أرض الرماد جيشًا جائعًا. أمامك اثنا عشر أسبوعًا قبل أن يطرق بوابتك.</p>
 <p class="muted">استقبل رعاياك، وأدِر الذهب والطعام والجنود، وأرسل مستشاريك في المهام، واكسب الحلفاء أو اخسرهم. كل قرار يُحسب.</p>
 <h3>اختر مستوى الحكم</h3><div class="diffs">${Object.entries(DIFF).map(([k,d])=>`<button class="px${k==='normal'?' gold':''}" data-diff="${k}"><b>${d.n}</b><small>${d.d}</small></button>`).join('')}</div>
 <div class="row">${sv?`<button class="px" id="cg">تابع من الأسبوع ${A(sv.week)} (${DIFF[sv.diff].n})</button>`:''}<button class="px" id="hp">طريقة اللعب</button>${title.extra.map(b=>`<button class="px" id="${b.id}">${b.label}</button>`).join('')}</div>
 <p class="credit">إنتاج استوديو قرطاس</p></div>`;
 $$('[data-diff]').forEach(b=>b.onclick=()=>{S=fresh(b.dataset.diff);$('#ov').hidden=true;sfx('good');startWeek()});
 if(sv)$('#cg').onclick=()=>{S=sv;S.lastCh=0;$('#ov').hidden=true;startWeek()};
 $('#hp').onclick=()=>{showHelp();$('#mx').onclick=()=>title()};
 title.extra.forEach(b=>{$('#'+b.id).onclick=b.click});
}
title.extra=title.extra||[];
function boot(data){
 S=fresh();hud();$('#panel').innerHTML=`<h3>قاعة العرش</h3><p class="muted">الشموع مضاءة، والعرش ينتظر.</p>`;
 requestAnimationFrame(loop);
 const hs=data&&migrate(data.S);if(hs&&hs.phase!=='end'){S=hs;S.lastCh=0;startWeek()}else title();
}
window.claude?.hot?.snapshot?.(()=>({S}));
window.__arvand={get S(){return S},set S(v){S=v},E,M,choose,endWeek,finale,myPower,enemyPower,startWeek,renderCouncil,buildQueue,optionsOf,optState,apply,fresh};
(window.claude?.hot?.ready?window.claude.hot.ready(boot):boot(window.claude?.hot?.data??{}));
