import {LeafThrough,type PageChangeDetail} from 'leafthrough';

type Section={id:string;label:string;page:number};
type MagazineData={title:string;pages:string[];pageTexts?:string[];width:number;height:number;background:string;duration:number;sections:Section[];navigationColor:string;aboutHtml?:string};
declare global {interface Window {MAGAZINE_DATA?:MagazineData;MagazineViewer?:{mount:(element:HTMLElement,data:MagazineData)=>void}}}
const make=(tag:string,cls='')=>{const e=document.createElement(tag);e.className=cls;return e};

function mount(root:HTMLElement,data:MagazineData){
 root.replaceChildren();root.className='magazine-root';root.style.setProperty('--bg',data.background||'#101010');root.style.setProperty('--ink',data.navigationColor||'#fff');
 const header=make('header','magazine-header'),nav=make('nav','magazine-nav');nav.setAttribute('aria-label','Capítulos');header.append(nav);
 const readingButton=make('button','magazine-reading-trigger');readingButton.textContent='Aa';readingButton.setAttribute('aria-label','Abrir modo de leitura acessível');readingButton.title='Modo leitura';
 const aboutButton=make('button','magazine-about-trigger');aboutButton.textContent='SOBRE';header.append(nav,aboutButton);root.append(header,readingButton);
 const stage=make('div','magazine-stage'),surface=make('div','magazine-surface loading');stage.append(surface);root.append(stage);
 const footer=make('footer','magazine-footer'),prev=make('button','magazine-arrow'),next=make('button','magazine-arrow'),counter=make('span','magazine-counter'),full=make('button','magazine-fullscreen');
 const zoom=make('div','magazine-zoom'),zoomOut=make('button'),zoomValue=make('button'),zoomIn=make('button');zoomOut.textContent='−';zoomValue.textContent='100%';zoomIn.textContent='+';zoomOut.setAttribute('aria-label','Diminuir zoom');zoomValue.setAttribute('aria-label','Ajustar revista à tela');zoomIn.setAttribute('aria-label','Aumentar zoom');zoom.append(zoomOut,zoomValue,zoomIn);
 prev.textContent='←';next.textContent='→';full.textContent='TELA CHEIA';prev.setAttribute('aria-label','Página anterior');next.setAttribute('aria-label','Próxima página');full.setAttribute('aria-label','Alternar tela cheia');counter.setAttribute('aria-live','polite');counter.setAttribute('aria-atomic','true');footer.append(prev,counter,next,zoom,full);root.append(footer);
 const overlay=make('div','magazine-drawer-overlay'),drawer=make('aside','magazine-drawer'),drawerHead=make('div','magazine-drawer-head'),drawerTitle=make('h2');drawerTitle.textContent='Sobre';
 const close=make('button','magazine-drawer-close');close.textContent='×';close.setAttribute('aria-label','Fechar Sobre');drawerHead.append(drawerTitle,close);
 const aboutBody=make('div','magazine-drawer-content');aboutBody.innerHTML=data.aboutHtml||'<p>Informações sobre esta publicação.</p>';drawer.append(drawerHead,aboutBody);root.append(overlay,drawer);
 const openAbout=()=>{overlay.classList.add('visible');drawer.classList.add('visible');close.focus()},closeAbout=()=>{overlay.classList.remove('visible');drawer.classList.remove('visible')};aboutButton.onclick=openAbout;close.onclick=closeAbout;overlay.onclick=closeAbout;
 const readingOverlay=make('div','magazine-reading-overlay'),readingDrawer=make('aside','magazine-reading-drawer');readingDrawer.setAttribute('aria-label','Modo de leitura acessível');
 const readingHead=make('div','magazine-reading-head'),readingTitle=make('div');readingTitle.innerHTML='<strong>Modo leitura</strong><small>Texto extraído do PDF</small>';
 const readingTools=make('div','magazine-reading-tools'),smaller=make('button'),larger=make('button'),contrast=make('button'),readingClose=make('button');smaller.textContent='A−';larger.textContent='A+';contrast.textContent='◐';readingClose.textContent='×';smaller.setAttribute('aria-label','Diminuir texto');larger.setAttribute('aria-label','Aumentar texto');contrast.setAttribute('aria-label','Alternar alto contraste');readingClose.setAttribute('aria-label','Fechar modo leitura');readingTools.append(smaller,larger,contrast,readingClose);readingHead.append(readingTitle,readingTools);
 const readingBody=make('div','magazine-reading-content');readingBody.setAttribute('aria-live','polite');readingDrawer.append(readingHead,readingBody);root.append(readingOverlay,readingDrawer);
 let readingScale=1,currentVisible:number[]=[];
 const renderReading=(visible=currentVisible)=>{currentVisible=visible;readingBody.replaceChildren();visible.forEach(index=>{const article=make('article'),h=make('h2'),p=make('p');h.textContent=`Página ${index+1}`;p.textContent=data.pageTexts?.[index]?.trim()||'Esta página não possui texto selecionável. Use a visualização da revista para consultar seu conteúdo gráfico.';article.append(h,p);readingBody.append(article)});readingBody.style.setProperty('--reading-scale',String(readingScale))};
 const closeReading=()=>{readingOverlay.classList.remove('visible');readingDrawer.classList.remove('visible');readingButton.focus()};readingButton.onclick=()=>{renderReading();readingOverlay.classList.add('visible');readingDrawer.classList.add('visible');readingClose.focus()};readingClose.onclick=closeReading;readingOverlay.onclick=closeReading;
 smaller.onclick=()=>{readingScale=Math.max(.85,readingScale-.15);renderReading()};larger.onclick=()=>{readingScale=Math.min(1.75,readingScale+.15);renderReading()};contrast.onclick=()=>readingDrawer.classList.toggle('high-contrast');
 const sections=[...(data.sections||[])].filter(s=>s.label?.trim()&&s.page>=1&&s.page<=data.pages.length).sort((a,b)=>a.page-b.page);
 let magazine:LeafThrough;
 const buttons=sections.map(s=>{const b=make('button','magazine-nav-item');b.textContent=s.label;b.onclick=()=>magazine.goTo(s.page-1,{animate:true});nav.append(b);return b});
 const updateUI=(detail?:PageChangeDetail)=>{
  const visible=detail?.visiblePages||magazine.visiblePages,page=detail?.page??magazine.page;
  if(visible.length===0)counter.textContent='CAPA';
  else if(visible.length===1)counter.textContent=visible[0]===0?'CAPA':`PÁGINA ${visible[0]+1} / ${data.pages.length}`;
  else counter.textContent=`PÁGINAS ${visible[0]+1}–${visible.at(-1)!+1} / ${data.pages.length}`;
  prev.disabled=page<=0;next.disabled=visible.includes(data.pages.length-1);
  let active=-1;sections.forEach((s,i)=>{if(s.page<=page+1)active=i});buttons.forEach((b,i)=>b.classList.toggle('active',i===active));
  renderReading(visible);
 };
 const speed=Math.max(.45,Math.min(2.4,850/Math.max(350,data.duration||850)));
 magazine=new LeafThrough(surface,{
  pages:data.pages.map((src,i)=>({src,alt:`Página ${i+1} de ${data.pages.length}`,text:data.pageTexts?.[i]||''})),layout:'spread',pageAspect:Math.max(.65,Math.min(2.5,(data.height||842)/(data.width||595))),bleed:false,preload:Infinity,maxPixelRatio:2,label:data.title||'Revista',
  paper:{grain:true,grainStrength:.12,showThrough:.015,inkGloss:.32,roughness:.58,metalness:.1,wrinkles:.9,bulge:1,sheetGap:0,depthBias:true},
  lighting:{ambient:{sky:'#ffffff',ground:'#9da2a6',intensity:1.45},sun:{color:'#fffaf2',intensity:2.35,position:[-3,5,7]},shadows:true,shadowMapSize:2048,floorShadow:.16},
  motion:{speed,curl:1,maxTilt:45,jitter:true,hoverLift:.03,dragDistance:.8,commitThreshold:.2,reducedMotion:false},
  interaction:{drag:true,click:true,hold:true,hover:true,keyboard:false},
  formatPageLabel:detail=>detail.visiblePages.length===1?`Página ${detail.visiblePages[0]+1} de ${detail.pageCount}`:`Páginas ${detail.visiblePages.map(p=>p+1).join(' e ')} de ${detail.pageCount}`,
  onReady:()=>{surface.classList.remove('loading');updateUI()},onPageChange:updateUI,
  onError:()=>{surface.classList.remove('loading');counter.textContent='ERRO AO CARREGAR PÁGINA'}
 });
 counter.textContent='PREPARANDO REVISTA';prev.disabled=true;next.disabled=true;
 let zoomLevel=1;const setZoom=(value:number)=>{zoomLevel=Math.max(.75,Math.min(2.5,value));surface.style.width=`${zoomLevel*100}%`;surface.style.height=`${zoomLevel*100}%`;zoomValue.textContent=`${Math.round(zoomLevel*100)}%`;zoomOut.disabled=zoomLevel<=.75;zoomIn.disabled=zoomLevel>=2.5};
 zoomOut.onclick=()=>setZoom(zoomLevel-.25);zoomIn.onclick=()=>setZoom(zoomLevel+.25);zoomValue.onclick=()=>setZoom(1);
 prev.onclick=()=>magazine.prev();next.onclick=()=>magazine.next();full.onclick=()=>{if(document.fullscreenElement)document.exitFullscreen();else root.requestFullscreen?.()};
 const onKey=(e:KeyboardEvent)=>{if(e.key==='Escape'){closeAbout();closeReading();return}if(drawer.classList.contains('visible')||readingDrawer.classList.contains('visible'))return;if(e.key==='+'||e.key==='='){e.preventDefault();setZoom(zoomLevel+.25);return}if(e.key==='-'){e.preventDefault();setZoom(zoomLevel-.25);return}if(e.key==='0'){e.preventDefault();setZoom(1);return}if(e.key==='ArrowRight'||e.key==='PageDown'){e.preventDefault();magazine.next()}if(e.key==='ArrowLeft'||e.key==='PageUp'){e.preventDefault();magazine.prev()}if(e.key==='Home'){e.preventDefault();magazine.goTo(0)}if(e.key==='End'){e.preventDefault();magazine.goTo(data.pages.length-1)}};
 window.addEventListener('keydown',onKey);window.addEventListener('pagehide',()=>{window.removeEventListener('keydown',onKey);magazine.dispose()},{once:true});
}
window.MagazineViewer={mount};if(window.MAGAZINE_DATA){const root=document.getElementById('magazine-root');if(root)mount(root,window.MAGAZINE_DATA)}
