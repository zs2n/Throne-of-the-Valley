#!/usr/bin/env python3
"""Build: concatenates src/ into a single self-contained page.
   dist/arvand.html  -> body-only page for the Claude artifact
   index.html        -> full HTML document for GitHub Pages"""
import os
R=os.path.dirname(os.path.abspath(__file__))
S=lambda p:open(os.path.join(R,'src',p),encoding='utf-8').read()
ORDER=['engine/util.js','engine/sprites.js','engine/sprites3.js','data/characters.js','engine/core.js',
 'data/missions.js','data/events.js','data/events_ch3.js','data/events_people.js','data/events_family.js','data/events_extra.js','data/letters.js','data/items.js','data/decrees.js','data/endings.js',
 'engine/audio.js','engine/hall3.js','engine/scene.js','engine/map.js','engine/ui.js','engine/court.js','engine/council.js','engine/report.js',
 'engine/systems.js','engine/advice.js','engine/siege.js','engine/music.js','engine/meta.js','engine/ending.js']
js='\n'.join(f'/* ---- {p} ---- */\n'+S(p) for p in ORDER if os.path.exists(os.path.join(R,'src',p)))
import base64 as _b64
def _art():
    d=os.path.join(R,'src','art');items=[]
    for n in sorted(os.listdir(d)) if os.path.isdir(d) else []:
        if n.endswith('.png'):items.append("'%s':'data:image/png;base64,%s'"%(n[:-4],_b64.b64encode(open(os.path.join(d,n),'rb').read()).decode()))
    return '/* ---- art (src/art/*.png as data URIs) ---- */\nconst ART={'+','.join(items)+'};\n'
js=js.replace('/* ---- engine/hall3.js ---- */',_art()+'/* ---- engine/hall3.js ---- */',1)
head='''<title>عرش الوادي</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Handjet:wght@400;600;800&family=Noto+Kufi+Arabic:wght@400;600;700&display=swap">
<style>'''+S('style.css')+'</style>\n'
import base64
ico=lambda n:base64.b64encode(open(os.path.join(R,'src',n),'rb').read()).decode()
# dist/arvand.html (artifact) embeds the icons; index.html (GitHub Pages) links real files, which bookmarks and tabs pick up more reliably
head_dist=head.replace('<link rel="preconnect"','<link rel="icon" type="image/png" href="data:image/png;base64,'+ico('icon64.png')+'">\n<link rel="apple-touch-icon" href="data:image/png;base64,'+ico('icon192.png')+'">\n<link rel="preconnect"',1)
head=head.replace('<link rel="preconnect"','<link rel="icon" href="favicon.ico" sizes="any">\n<link rel="icon" type="image/png" href="favicon.png">\n<link rel="apple-touch-icon" href="apple-touch-icon.png">\n<link rel="preconnect"',1)
body=S('shell.html')+'\n<script>\n'+js+'\n</script>\n'
os.makedirs(os.path.join(R,'dist'),exist_ok=True)
open(os.path.join(R,'dist','arvand.html'),'w',encoding='utf-8').write(head_dist+body)
open(os.path.join(R,'index.html'),'w',encoding='utf-8').write('<!doctype html>\n<html lang="ar" dir="rtl">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n<meta name="description" content="عرش الوادي: لعبة إدارة مملكة وقرارات بأسلوب بكسل آرت، من إنتاج استوديو قرطاس.">\n'+head+'</head>\n<body>\n'+body+'</body>\n</html>\n')
print('built',len(head+body)//1024,'KB')
