const LANGS={en:{name:'English',title:'Domain Lookup',desc:'Search WHOIS, RDAP, registrar, DNS and lifecycle information for domains worldwide.',search:'Search',worldwide:'Worldwide TLD support'},zh:{name:'简体中文',title:'域名 WHOIS 查询',desc:'查询全球域名的 WHOIS、RDAP、注册商、DNS 与生命周期信息。',search:'查询',worldwide:'支持全球域名后缀'},de:{name:'Deutsch',title:'Domain-Abfrage',desc:'WHOIS-, RDAP-, Registrar-, DNS- und Lifecycle-Daten weltweit durchsuchen.',search:'Suchen',worldwide:'Globale TLD-Unterstützung'},fr:{name:'Français',title:'Recherche de domaine',desc:'Recherchez les données WHOIS, RDAP, registrar, DNS et cycle de vie.',search:'Rechercher',worldwide:'Prise en charge mondiale des TLD'},ja:{name:'日本語',title:'ドメイン検索',desc:'世界中のドメインの WHOIS、RDAP、レジストラ、DNS、ライフサイクル情報を検索。',search:'検索',worldwide:'世界中のTLDに対応'},es:{name:'Español',title:'Consulta de dominios',desc:'Consulta WHOIS, RDAP, registrador, DNS y ciclo de vida de dominios.',search:'Buscar',worldwide:'Compatibilidad global con TLD'}};

/* Extended interface languages: all visible content follows the selected locale. */
LANGS["pt"]={"name": "Português", "title": "Consulta de domínios", "desc": "Consulte informações de WHOIS, RDAP, registrador, DNS e ciclo de vida de domínios do mundo todo.", "search": "Pesquisar", "worldwide": "Suporte global a TLDs"};
LANGS["it"]={"name": "Italiano", "title": "Ricerca domini", "desc": "Consulta dati WHOIS, RDAP, registrar, DNS e ciclo di vita dei domini in tutto il mondo.", "search": "Cerca", "worldwide": "Supporto TLD globale"};
LANGS["ko"]={"name": "한국어", "title": "도메인 조회", "desc": "전 세계 도메인의 WHOIS, RDAP, 등록기관, DNS 및 수명 주기 정보를 조회하세요.", "search": "검색", "worldwide": "전 세계 TLD 지원"};
LANGS["ru"]={"name": "Русский", "title": "Поиск доменов", "desc": "Проверяйте WHOIS, RDAP, регистратора, DNS и жизненный цикл доменов по всему миру.", "search": "Поиск", "worldwide": "Поддержка доменных зон по всему миру"};
LANGS["ar"]={"name": "العربية", "title": "البحث عن النطاقات", "desc": "ابحث في بيانات WHOIS وRDAP والمسجّل وDNS وحالة النطاقات حول العالم.", "search": "بحث", "worldwide": "دعم نطاقات المستوى الأعلى العالمية"};
LANGS["hi"]={"name": "हिन्दी", "title": "डोमेन खोज", "desc": "दुनिया भर के डोमेन के WHOIS, RDAP, रजिस्ट्रार, DNS और जीवनचक्र की जानकारी खोजें।", "search": "खोजें", "worldwide": "वैश्विक TLD समर्थन"};
LANGS["id"]={"name": "Bahasa Indonesia", "title": "Pencarian domain", "desc": "Cari informasi WHOIS, RDAP, registrar, DNS, dan siklus hidup domain di seluruh dunia.", "search": "Cari", "worldwide": "Mendukung TLD global"};
LANGS['zh-Hant']={name:'繁體中文',title:'網域 WHOIS 查詢',desc:'查詢全球網域的 WHOIS、RDAP、註冊商、DNS 與生命週期資訊。',search:'搜尋',worldwide:'支援全球網域後綴'};
function translateThemes(){const names=THEME_NAMES[lang]||THEME_NAMES.en;const s=document.getElementById("themeSelect");const selected=s.value;["graphite","paper","sand","forest","ocean","plum","mono","slate","mint","rose"].forEach((id,i)=>{const o=s.querySelector(`option[value="${id}"]`);if(o)o.textContent=names[i+1]});s.setAttribute("aria-label",names[0]);s.title=names[0];const box=s.closest(".picker");if(box)box.title=names[0];s.value=selected;}
const DOMAIN_INPUT_LABELS={"en": "Domain name", "zh": "域名", "de": "Domainname", "fr": "Nom de domaine", "ja": "ドメイン名", "es": "Nombre de dominio", "pt": "Nome de domínio", "it": "Nome del dominio", "ko": "도메인 이름", "ru": "Доменное имя", "ar": "اسم النطاق", "hi": "डोमेन नाम", "id": "Nama domain", "zh-Hant":"網域名稱"};
function detectLang(){return detectWhoisLanguage()}
let lang=detectLang();const sel=document.getElementById('langSelect');populateLanguageSelect(sel,LANGS);function applyLang(){document.title=LANGS[lang].title+" | Mr Wang";document.documentElement.lang=lang==='zh'?'zh-CN':(lang==='zh-Hant'?'zh-TW':lang);document.documentElement.dir=lang==='ar'?'rtl':'ltr';sel.value=lang;translateLanguageGroups(sel,lang);translateThemes();renderBrand(lang);document.getElementById('domainInput').setAttribute('aria-label',(DOMAIN_INPUT_LABELS[lang]||'Domain name'));document.querySelectorAll('[data-i18n]').forEach(el=>{const v=LANGS[lang][el.dataset.i18n];if(v)el.textContent=v})}sel.onchange=()=>{const code=normalizeWhoisLanguage(sel.value);if(!code)return;lang=code;if(!sel.dataset.syncingLanguage)saveWhoisLanguage(lang);applyLang()};bindWhoisLanguage(sel);applyLang();document.getElementById('searchForm').onsubmit=e=>{e.preventDefault();const d=cleanDomain(document.getElementById('domainInput').value);if(d)location.href=searchUrl(d)};document.getElementById('year').textContent=new Date().getFullYear();

initThemePicker();

const DOMAIN_INVALID={en:'Enter a valid domain name.',zh:'请输入有效域名。','zh-Hant':'請輸入有效網域名稱。',de:'Bitte gültige Domain eingeben.',fr:'Saisissez un domaine valide.',ja:'有効なドメインを入力してください。',es:'Introduce un dominio válido.',pt:'Insira um domínio válido.',it:'Inserisci un dominio valido.',ko:'올바른 도메인을 입력하세요.',ru:'Введите допустимый домен.',ar:'أدخل اسم نطاق صالحًا.',hi:'मान्य डोमेन दर्ज करें।',id:'Masukkan domain yang valid.'};
function renderHistory(){const panel=document.getElementById('historyPanel'),title=document.getElementById('historySummary'),list=document.getElementById('historyList');if(!panel||!title||!list)return;const arr=readHistory();title.textContent=htxt('history')+' ('+arr.length+')';list.replaceChildren();if(!arr.length){const empty=document.createElement('div');empty.className='history-empty';empty.textContent=htxt('empty');list.append(empty)}else arr.forEach(d=>{const row=document.createElement('div');row.className='history-row';const a=document.createElement('a');a.className='history-link';a.textContent=d;a.href=searchUrl(d);const del=document.createElement('button');del.type='button';del.className='history-remove';del.textContent='×';del.title=htxt('remove');del.setAttribute('aria-label',htxt('remove')+' '+d);del.addEventListener('click',()=>writeHistory(readHistory().filter(x=>x!==d)));row.append(a,del);list.append(row)});const note=document.getElementById('historyNote');if(note)note.textContent=htxt('saved');const all=document.getElementById('historyClear');if(all){all.textContent=htxt('clear');all.hidden=!arr.length}}
function updateSearchControls(){const input=document.getElementById('domainInput');const btn=document.getElementById('clearInput');btn.hidden=!input.value;btn.title=htxt('clearInput');btn.setAttribute('aria-label',htxt('clearInput'));const submit=document.getElementById('searchSubmit');submit.title=htxt('searchIcon');submit.setAttribute('aria-label',htxt('searchIcon'));renderHistory();renderFavorites()}
(function setupQueryTools(){const input=document.getElementById('domainInput');const clr=document.getElementById('clearInput');clr.onclick=()=>{input.value='';input.focus();updateSearchControls()};input.addEventListener('input',()=>{input.setCustomValidity('');updateSearchControls()});
// Enter and mobile Search submit the same validated form as the search icon.
// Do not query while an IME is committing Chinese, Japanese or Korean text.
input.addEventListener('keydown',e=>{
  if(e.key!=='Enter'||e.isComposing||e.keyCode===229)return;
  e.preventDefault();
  input.form.requestSubmit(document.getElementById('searchSubmit'));
});document.getElementById('historyClear').onclick=()=>writeHistory([]);document.getElementById('searchForm').onsubmit=e=>{e.preventDefault();const d=cleanDomain(input.value);if(!d){input.setCustomValidity((DOMAIN_INVALID[lang]||DOMAIN_INVALID.en));input.reportValidity();return}input.setCustomValidity('');location.href=searchUrl(d)};sel.addEventListener('change',updateSearchControls);updateSearchControls()})();

;
/* V52 navigation: build once, sync state without rebuilding the menu. */
(()=>{
 const root=r=>typeof r==='string'?document.querySelector(r):(r||document);
 const $=(s,r=document)=>root(r)?.querySelector(s)||null, $$=(s,r=document)=>{const x=root(r);return x?[...x.querySelectorAll(s)]:[]};
 const navText={
  en:{batch:'Batch',history:'History',favorites:'Saved',display:'Display',theme:'Theme',font:'Text size',close:'Close'},
  zh:{batch:'批量查询',history:'查询历史',favorites:'收藏域名',display:'显示设置',theme:'风格',font:'文字大小',close:'关闭'},
  'zh-Hant':{batch:'批次查詢',history:'查詢紀錄',favorites:'收藏網域',display:'顯示設定',theme:'風格',font:'文字大小',close:'關閉'},
  de:{batch:'Stapel',history:'Verlauf',favorites:'Gespeichert',display:'Anzeige',theme:'Design',font:'Textgröße',close:'Schließen'},
  fr:{batch:'Lot',history:'Historique',favorites:'Favoris',display:'Affichage',theme:'Thème',font:'Taille du texte',close:'Fermer'},
  ja:{batch:'一括検索',history:'履歴',favorites:'保存済み',display:'表示',theme:'テーマ',font:'文字サイズ',close:'閉じる'},
  es:{batch:'Lote',history:'Historial',favorites:'Guardados',display:'Pantalla',theme:'Tema',font:'Tamaño de texto',close:'Cerrar'},
  pt:{batch:'Lote',history:'Histórico',favorites:'Salvos',display:'Exibição',theme:'Tema',font:'Tamanho do texto',close:'Fechar'},
  it:{batch:'Batch',history:'Cronologia',favorites:'Salvati',display:'Aspetto',theme:'Tema',font:'Dimensione testo',close:'Chiudi'},
  ko:{batch:'일괄 조회',history:'기록',favorites:'저장됨',display:'화면',theme:'테마',font:'글자 크기',close:'닫기'},
  ru:{batch:'Пакетно',history:'История',favorites:'Избранное',display:'Вид',theme:'Тема',font:'Размер текста',close:'Закрыть'},
  ar:{batch:'بحث جماعي',history:'السجل',favorites:'المحفوظات',display:'العرض',theme:'المظهر',font:'حجم النص',close:'إغلاق'},
  hi:{batch:'बैच',history:'इतिहास',favorites:'सहेजे गए',display:'दिखावट',theme:'थीम',font:'पाठ आकार',close:'बंद करें'},
  id:{batch:'Massal',history:'Riwayat',favorites:'Tersimpan',display:'Tampilan',theme:'Tema',font:'Ukuran teks',close:'Tutup'}
 };
 const themeColors={graphite:['#101318','#a2c9ca'],paper:['#f5f6f4','#346b79'],sand:['#f6f2eb','#9c6748'],forest:['#15201c','#bbd8ad'],ocean:['#edf3f6','#3e7996'],plum:['#f8f5f9','#78619c'],mono:['#fff','#202020'],slate:['#171d26','#91b5d5'],mint:['#f0f7f5','#4e9d83'],rose:['#faf5f4','#b67c90']};
 const lang=()=>$('#langSelect')?.value||'en', text=()=>navText[lang()]||navText.en;
 const popItems=$$('.nav-popover-item'), choices=$$('.nav-choice');
 function closeAll(except=null){
  popItems.forEach(n=>{if(n===except)return;const p=$('.nav-popover',n),b=$('.nav-button',n);if(p){p.hidden=true;b?.setAttribute('aria-expanded','false')}});
  choices.forEach(n=>{if(n===except)return;const p=$('.choice-panel',n),b=$('.choice-trigger',n);if(p){p.hidden=true;b?.setAttribute('aria-expanded','false')}});
 }
 function toggle(node,panelSel,buttonSel){const p=$(panelSel,node),b=$(buttonSel,node);if(!p||!b)return;const open=p.hidden;closeAll(open?node:null);p.hidden=!open;b.setAttribute('aria-expanded',String(open));if(open)requestAnimationFrame(()=>$('.choice-option.is-current,button,a',p)?.focus({preventScroll:true}))}
 function buildThemesOnce(){
  const select=$('#themeSelect'),box=$('#choice-theme-options');if(!select||!box||box.dataset.built)return;box.dataset.built='1';
  [...select.options].forEach(o=>{const b=document.createElement('button');b.type='button';b.className='choice-option theme-option';b.dataset.theme=o.value;b.setAttribute('role','radio');const sw=document.createElement('span');sw.className='theme-swatch';sw.style.setProperty('--swatch-bg',themeColors[o.value]?.[0]||'#fff');sw.style.setProperty('--swatch-ink',themeColors[o.value]?.[1]||'#333');const name=document.createElement('span');name.className='choice-option-name';const check=document.createElement('span');check.className='choice-check';check.textContent='✓';b.append(sw,name,check);b.addEventListener('click',()=>{window.applyWhoisTheme?.(o.value);syncThemeState()});box.append(b)});
 }
 function buildLanguagesOnce(){
  const select=$('#langSelect'),box=$('#choice-language-options');if(!select||!box||box.dataset.built)return;box.dataset.built='1';
  [...select.children].forEach(group=>{if(group.tagName==='OPTGROUP'){const h=document.createElement('div');h.className='choice-group-heading';h.dataset.group=group.dataset.group||'';box.append(h);[...group.children].forEach(add)}else add(group)});
  function add(o){const b=document.createElement('button');b.type='button';b.className='choice-option';b.dataset.lang=o.value;b.setAttribute('role','radio');const code=document.createElement('span');code.className='language-short';code.textContent=o.value==='zh-Hant'?'繁':o.value==='zh'?'简':o.value.toUpperCase();const name=document.createElement('span');name.className='choice-option-name';name.textContent=o.textContent;const check=document.createElement('span');check.className='choice-check';check.textContent='✓';b.append(code,name,check);b.addEventListener('click',()=>{select.value=o.value;select.dispatchEvent(new Event('change',{bubbles:true}));syncAll();closeAll()});box.append(b)}
 }
 function syncThemeState(){const select=$('#themeSelect');if(!select)return;const current=document.documentElement.dataset.theme||select.value;select.value=current;$$('[data-theme]','#choice-theme-options').forEach(b=>{const active=b.dataset.theme===current;b.classList.toggle('is-current',active);b.setAttribute('aria-checked',String(active));const o=[...select.options].find(o=>o.value===b.dataset.theme);const n=$('.choice-option-name',b);if(n&&o)n.textContent=o.textContent})}
 function syncLanguageState(){const select=$('#langSelect');if(!select)return;const current=select.value;$$('[data-lang]','#choice-language-options').forEach(b=>{const active=b.dataset.lang===current;b.classList.toggle('is-current',active);b.setAttribute('aria-checked',String(active));const o=[...select.options].find(o=>o.value===b.dataset.lang);const n=$('.choice-option-name',b);if(n&&o)n.textContent=o.textContent});$$('.choice-group-heading','#choice-language-options').forEach((h,i)=>{const groups=[...select.querySelectorAll('optgroup')];h.textContent=groups[i]?.label||''});$('#choice-language-title')&&($('#choice-language-title').textContent=select.getAttribute('aria-label')||'Language');$('#choice-language-current')&&($('#choice-language-current').textContent=select.selectedOptions[0]?.textContent||'Language')}
 function syncFont(){const current=document.documentElement.dataset.fontSize||'medium';$$('#fontSizeOptions button').forEach(b=>{const active=b.dataset.fontSize===current;b.classList.toggle('is-current',active);b.setAttribute('aria-pressed',String(active))})}
 function bindFontOnce(){$$('#fontSizeOptions button').forEach(b=>{if(b.dataset.bound)return;b.dataset.bound='1';b.addEventListener('click',()=>{const size=b.dataset.fontSize;if(!['small','medium','large'].includes(size))return;document.documentElement.dataset.fontSize=size;try{localStorage.setItem('whoisFontSize',size)}catch{};syncFont()})})}
 function syncLabels(){const t=text();$$('[data-nav-label]').forEach(el=>{const k=el.dataset.navLabel;if(t[k])el.textContent=t[k]});$('#displayTitle')&&($('#displayTitle').textContent=t.display);$('#themeSettingLabel')&&($('#themeSettingLabel').textContent=t.theme);$('#fontSettingLabel')&&($('#fontSettingLabel').textContent=t.font);$$('.popover-close,.choice-close').forEach(b=>{b.title=t.close;b.setAttribute('aria-label',t.close)})}
 function mountDisplayReset(){
  const panel=$('#choice-display-panel');if(!panel||$('#displayReset'))return;
  const footer=document.createElement('div');footer.className='display-footer';
  const b=document.createElement('button');b.type='button';b.id='displayReset';b.innerHTML='<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 1 2.6 6.4M3 12V5m0 7h7"/></svg><span></span>';footer.append(b);panel.append(footer);
  const sync=()=>{b.querySelector('span').textContent=window.WhoisTimezone?.resetLabel?.()||({zh:'恢复默认','zh-Hant':'恢復預設'}[lang()]||'Reset');b.disabled=(document.documentElement.dataset.theme||'paper')==='paper'&&(document.documentElement.dataset.fontSize||'medium')==='medium'&&(window.WhoisTimezone?.preference?.()||'auto')==='auto'};
  b.addEventListener('click',()=>{window.applyWhoisTheme?.('paper',{persist:false});document.documentElement.dataset.fontSize='medium';try{localStorage.removeItem('whoisTheme');localStorage.removeItem('whoisFontSize')}catch{}window.WhoisTimezone?.reset?.();syncAll();sync()});
  new MutationObserver(sync).observe(document.documentElement,{attributes:true,attributeFilter:['lang','data-theme','data-font-size']});window.addEventListener('whois-timezone-change',sync);sync();
 }
 function syncAll(){syncLabels();syncThemeState();syncLanguageState();syncFont();window.updateLibraryCounts?.()}
 // Bind the four primary Menu controls first. A rendering error in one optional panel must never disable navigation.
 popItems.forEach(n=>{$('.nav-button',n)?.addEventListener('click',()=>{try{window.refreshLocalLibraryUI?.()}catch(e){console.warn('Library menu refresh failed',e)}toggle(n,'.nav-popover','.nav-button')});$('.popover-close',n)?.addEventListener('click',()=>{closeAll();$('.nav-button',n)?.focus()})});
 choices.forEach(n=>{$('.choice-trigger',n)?.addEventListener('click',()=>toggle(n,'.choice-panel','.choice-trigger'));$('.choice-close',n)?.addEventListener('click',()=>{closeAll();$('.choice-trigger',n)?.focus()})});
 try{buildThemesOnce()}catch(e){console.error('Theme menu init failed',e)}
 try{buildLanguagesOnce()}catch(e){console.error('Language menu init failed',e)}
 try{bindFontOnce()}catch(e){console.error('Font menu init failed',e)}
 try{if(document.readyState==='loading'||document.readyState==='interactive')document.addEventListener('DOMContentLoaded',mountDisplayReset,{once:true});else mountDisplayReset();syncAll()}catch(e){console.error('Menu state sync failed',e)}
 document.addEventListener('pointerdown',e=>{if(!e.target.closest('.nav-popover-item,.nav-choice'))closeAll()});document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAll()});
 $('#langSelect')?.addEventListener('change',()=>queueMicrotask(syncAll));window.addEventListener('whois:themechange',syncThemeState);window.addEventListener('whois:librarychange',()=>queueMicrotask(()=>window.updateLibraryCounts?.()));
 window.addEventListener('storage',e=>{if(e.key==='whoisTheme'){window.applyWhoisTheme?.(e.newValue||'paper',{persist:false});syncThemeState()}else if(e.key==='whoisFontSize'){const s=e.newValue||'medium';if(['small','medium','large'].includes(s)){document.documentElement.dataset.fontSize=s;syncFont()}}else if(e.key==='whoisLang'||e.key===HISTORY_KEY||e.key===FAVORITES_KEY||e.key===null)queueMicrotask(syncAll)});
})();

;
(() => {
  const desk = document.querySelector('.lookup-desk');
  const language = document.getElementById('langSelect');
  if (desk) {
    let selected = 'history';
    const buttons = [...desk.querySelectorAll('[data-desk]')];
    const list = desk.querySelector('#deskDomains');
    const batch = desk.querySelector('.desk-batch');
    function fitHistory() {
      const overflow = list.children.length > 24;
      if (overflow) {
        const last = list.children[23];
        list.style.maxHeight = (last.offsetTop + last.offsetHeight) + 'px';
      } else {
        list.style.removeProperty('max-height');
      }
    }
    function showDomains() {
      const saved = selected === 'saved';
      const history = readHistory();
      const favorites = getFavorites();
      const domains = saved ? favorites : history;
      for (const button of buttons) {
        const isHistory = button.dataset.desk === 'history';
        const count = document.createElement('span');
        count.className = 'desk-count';
        count.textContent = String(isHistory ? history.length : favorites.length);
        button.replaceChildren(isHistory ? htxt('history') : xt(6), ' ', count);
        button.setAttribute('aria-pressed', String(button.dataset.desk === selected));
      }
      batch.textContent = document.querySelector('#batchNav [data-nav-label]').textContent + ' ↗';
      list.classList.add('desk-history');
      list.replaceChildren();
      if (!domains.length) {
        const note = document.createElement('p');
        note.textContent = saved ? xt(7) : htxt('empty');
        list.append(note);
      }
      for (const domain of domains) {
        const link = document.createElement('a');
        link.href = searchUrl(domain);
        link.textContent = domain;
        link.dir = 'ltr';
        list.append(link);
      }
      fitHistory();
    }
    for (const button of buttons) button.addEventListener('click', () => {
      selected = button.dataset.desk;
      list.scrollTop = 0;
      showDomains();
    });
    for (const event of ['storage','whois:librarychange','pageshow']) window.addEventListener(event,showDomains);
    language.addEventListener('change', () => queueMicrotask(showDomains));
    showDomains();
    if ('ResizeObserver' in window) new ResizeObserver(fitHistory).observe(desk);
    window.addEventListener('resize', fitHistory);
    document.fonts?.ready.then(fitHistory);
  }
})();

