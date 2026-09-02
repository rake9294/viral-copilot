import { chromium } from '/opt/data/tmp_pw/node_modules/playwright/index.mjs';
import { mkdirSync, writeFileSync } from 'fs';
const out = '/opt/data/viral-copilot/research/design-references';
mkdirSync(out, { recursive: true });
const refs = [{slug:'postiz',url:'https://postiz.com/'},{slug:'21st',url:'https://21st.dev/'}];
const browser = await chromium.launch({ args:['--no-sandbox'], headless:true });
async function inspect(ref, viewport, suffix) {
  const context = await browser.newContext({ viewport, colorScheme:'dark', reducedMotion:'no-preference' });
  const page = await context.newPage();
  await page.goto(ref.url,{waitUntil:'domcontentloaded',timeout:120000});
  await page.waitForLoadState('load',{timeout:30000}).catch(()=>{});
  await page.evaluate(()=>document.fonts?.ready).catch(()=>{});
  await page.waitForTimeout(5000);
  for (const pattern of [/accept all/i,/allow all/i,/accept/i]) { try { await page.getByRole('button',{name:pattern}).first().click({timeout:800}); break; } catch {} }
  await page.waitForTimeout(700);
  await page.screenshot({path:`${out}/${ref.slug}-${suffix}.png`,fullPage:false});
  if (suffix==='desktop') {
    for (const [name,y] of [['mid',1400],['lower',3200]]) { await page.evaluate(v=>scrollTo(0,v),y); await page.waitForTimeout(800); await page.screenshot({path:`${out}/${ref.slug}-${name}.png`,fullPage:false}); }
    await page.evaluate(()=>scrollTo(0,0));
    const data = await page.evaluate(() => {
      const clean=v=>(v||'').replace(/\s+/g,' ').trim();
      const count=(map,key)=>{if(key&&key!=='rgba(0, 0, 0, 0)'&&key!=='transparent'&&key!=='none')map[key]=(map[key]||0)+1;};
      const colors={},backgrounds={},borders={},fonts={},sizes={},weights={},radii={},shadows={},animations={},transitions={};
      for(const el of [...document.querySelectorAll('body *')].slice(0,2200)){const s=getComputedStyle(el),r=el.getBoundingClientRect();if(!r.width||!r.height)continue;count(colors,s.color);count(backgrounds,s.backgroundColor);count(borders,s.borderColor);count(fonts,s.fontFamily);count(sizes,s.fontSize);count(weights,s.fontWeight);count(radii,s.borderRadius);count(shadows,s.boxShadow);count(animations,s.animationName);count(transitions,s.transitionDuration);}
      const top=obj=>Object.entries(obj).sort((a,b)=>b[1]-a[1]).slice(0,24).map(([value,count])=>({value,count}));
      const root=getComputedStyle(document.documentElement),variables={};
      for(let i=0;i<root.length;i++){const n=root[i];if(n.startsWith('--')){const v=root.getPropertyValue(n).trim();if(v&&v.length<180)variables[n]=v;}}
      const pick=selector=>[...document.querySelectorAll(selector)].slice(0,30).map(el=>{const s=getComputedStyle(el),r=el.getBoundingClientRect();return{tag:el.tagName.toLowerCase(),text:clean(el.textContent).slice(0,140),class:clean(el.className?.toString()).slice(0,260),x:Math.round(r.x),y:Math.round(r.y),width:Math.round(r.width),height:Math.round(r.height),fontFamily:s.fontFamily,fontSize:s.fontSize,fontWeight:s.fontWeight,lineHeight:s.lineHeight,letterSpacing:s.letterSpacing,color:s.color,background:s.backgroundColor,border:s.border,borderRadius:s.borderRadius,boxShadow:s.boxShadow,padding:s.padding,transition:s.transition,animation:s.animation};});
      return{title:document.title,viewport:{width:innerWidth,height:innerHeight},document:{width:document.documentElement.scrollWidth,height:document.documentElement.scrollHeight},stylesheets:[...document.styleSheets].map(s=>s.href).filter(Boolean),variables,frequencies:{colors:top(colors),backgrounds:top(backgrounds),borders:top(borders),fonts:top(fonts),sizes:top(sizes),weights:top(weights),radii:top(radii),shadows:top(shadows),animations:top(animations),transitions:top(transitions)},headings:pick('h1,h2,h3'),buttons:pick('button,a[role="button"],a[class*="rounded"]'),cards:pick('[class*="card"],[class*="rounded-"]'),images:[...document.images].slice(0,100).map(i=>({alt:i.alt,src:i.currentSrc||i.src,width:i.naturalWidth,height:i.naturalHeight})).filter(x=>x.src)};
    });
    writeFileSync(`${out}/${ref.slug}-computed.json`,JSON.stringify(data,null,2));
  }
  await context.close();
}
for(const ref of refs){await inspect(ref,{width:1440,height:1000},'desktop');await inspect(ref,{width:390,height:844},'mobile');}
await browser.close();
console.log(JSON.stringify({ok:true,out}));
