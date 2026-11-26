const LANGS={en:{name:'English'},zh:{name:'简体中文'},'zh-Hant':{name:'繁體中文'},de:{name:'Deutsch'},fr:{name:'Français'},ja:{name:'日本語'},es:{name:'Español'},pt:{name:'Português'},it:{name:'Italiano'},ko:{name:'한국어'},ru:{name:'Русский'},ar:{name:'العربية'},hi:{name:'हिन्दी'},id:{name:'Bahasa Indonesia'}};
const COPY={
 en:['BATCH LOOKUP','Batch domain lookup','Enter complete domains, or enter names and combine them with selected suffixes.','Domains or names','Up to 50 queries · duplicates are removed automatically','Clear','Start lookup','Results','Registered','Available','Unknown','Invalid domain','Failed','Suffix catalog','Loading suffix catalog…','suffixes ready','Common','Clear','Search suffix, e.g. com / ai / de','For lines without a dot, selected suffixes are appended automatically. Complete domains are queried as entered.','Select at least one suffix for names without a dot.','Using built-in suffix catalog','Reserved'],
 zh:['批量查询','批量域名查询','可输入完整域名，也可以只输入名称并与选中的后缀自动组合查询。','域名或名称','最多 50 个查询 · 自动去重','清空','开始查询','查询结果','已注册','可注册','未知','域名格式无效','查询失败','后缀目录','正在加载后缀目录…','个后缀可用','常用','清除','搜索后缀，例如 com / ai / de','没有“.”的名称会自动拼接已选后缀；完整域名则按原样查询。','请输入完整域名，或至少选择一个后缀。','已启用内置后缀目录','保留'],
 'zh-Hant':['批次查詢','批次網域查詢','可輸入完整網域，也可以只輸入名稱並與選取的後綴自動組合查詢。','網域或名稱','最多 50 個查詢 · 自動去重','清空','開始查詢','查詢結果','已註冊','可註冊','未知','網域格式無效','查詢失敗','後綴目錄','正在載入後綴目錄…','個後綴可用','常用','清除','搜尋後綴，例如 com / ai / de','沒有「.」的名稱會自動拼接已選後綴；完整網域則按原樣查詢。','請輸入完整網域，或至少選取一個後綴。','已啟用內建後綴目錄','保留']
};
for(const code of Object.keys(LANGS))if(!COPY[code])COPY[code]=COPY.en;
function detectLang(){let saved='';try{saved=localStorage.getItem('whoisLang')||''}catch{}if(LANGS[saved])return saved;const n=(navigator.language||'en').toLowerCase(),c=n.split('-')[0];if(c==='zh'&&/tw|hk|mo|hant/.test(n))return'zh-Hant';return LANGS[c]?c:'en'}
let lang=detectLang(),allTlds=[],selectedTlds=new Set(),suffixSource='';
const sel=document.getElementById('langSelect');populateLanguageSelect(sel,LANGS);
const $=id=>document.getElementById(id);
function translateThemeOptions(){const names=THEME_NAMES[lang]||THEME_NAMES.en,select=$('themeSelect');if(!select)return;const ids=['graphite','paper','sand','forest','ocean','plum','mono','slate','mint','rose'];ids.forEach((id,i)=>{const o=select.querySelector('option[value="'+id+'"]');if(o)o.textContent=names[i+1]||o.textContent});select.setAttribute('aria-label',names[0]||'Theme')}
function applyLang(){const c=COPY[lang]||COPY.en;document.documentElement.lang=lang==='zh'?'zh-CN':lang==='zh-Hant'?'zh-TW':lang;document.documentElement.dir=lang==='ar'?'rtl':'ltr';sel.value=lang;translateLanguageGroups(sel,lang);translateThemeOptions();renderBrand(lang);[['batchKicker',0],['batchTitle',1],['batchDesc',2],['batchInputLabel',3],['batchHint',4],['batchClear',5],['batchSubmit',6],['batchResultsTitle',7],['suffixLabel',13],['suffixCommon',16],['suffixClear',17],['suffixHelp',19]].forEach(([id,i])=>{const e=$(id);if(e)e.textContent=c[i]});$('suffixSearch').placeholder=c[18];$('suffixSearch').setAttribute('aria-label',c[18]);updateSuffixStatus();renderHistory();renderFavorites()}
sel.onchange=()=>{lang=sel.value;try{localStorage.setItem('whoisLang',lang)}catch{}applyLang()};
function renderHistory(){const arr=readHistory(),title=$('historySummary'),list=$('historyList');if(!title||!list)return;title.textContent=htxt('history')+' ('+arr.length+')';list.replaceChildren();if(!arr.length){const e=document.createElement('div');e.className='history-empty';e.textContent=htxt('empty');list.append(e)}else arr.forEach(d=>{const row=document.createElement('div');row.className='history-row',a=document.createElement('a'),del=document.createElement('button');a.className='history-link';a.textContent=d;a.href=searchUrl(d);del.type='button';del.className='history-remove';del.textContent='×';del.setAttribute('aria-label',htxt('remove')+' '+d);del.onclick=()=>writeHistory(readHistory().filter(x=>x!==d));row.append(a,del);list.append(row)});const note=$('historyNote');if(note)note.textContent=htxt('saved');const b=$('historyClear');if(b){b.textContent=htxt('clear');b.hidden=!arr.length;b.onclick=()=>writeHistory([])}}
const textarea=$('batchDomains'),submit=$('batchSubmit'),clear=$('batchClear'),results=$('batchResults'),list=$('batchResultList'),progress=$('batchProgress'),suffixList=$('suffixList'),suffixSearch=$('suffixSearch');
clear.onclick=()=>{textarea.value='';list.replaceChildren();batchRows=[];filter.value='';results.hidden=true;updateBatchPreview();textarea.focus()};
async function loadSuffixes(){
 const catalog=await WhoisSuffixes.load();
 allTlds=catalog.length?catalog:COMMON_TLDS;
 suffixSource=catalog.length?'lookup-package':'emergency';
 renderSuffixes();
 updateSuffixStatus();
}
function updateSuffixStatus(){updateBatchPreview();const e=$('suffixStatus'),c=COPY[lang]||COPY.en;if(!e)return;if(!allTlds.length){e.textContent=c[14];return}e.textContent=(suffixSource==='lookup-package'?c[21]+' · ':suffixSource==='emergency'?c[21]+' · ':'')+allTlds.length+' '+c[15]+' · '+selectedTlds.size+' selected'}
const COMMON_TLDS=['com','net','org','cn','io','ai','co','me','app','dev','info','biz','us','uk','de','fr','jp','kr','au','ca','xyz','online','site','shop','store','tech'];
let suffixRenderFrame=0;
function renderSuffixes(){
 const q=suffixSearch.value.trim().toLowerCase().replace(/^\./,'');
 let view;if(q)view=allTlds.filter(t=>t.startsWith(q)||t.includes(q)).slice(0,80);else{const common=new Set([...selectedTlds,...COMMON_TLDS]);view=allTlds.filter(t=>common.has(t)).slice(0,40)}
 suffixList.replaceChildren();const frag=document.createDocumentFragment();view.forEach(t=>{const b=document.createElement('button');b.type='button';b.className='suffix-chip'+(selectedTlds.has(t)?' is-selected':'');b.textContent='.'+t;b.setAttribute('aria-pressed',String(selectedTlds.has(t)));b.onclick=()=>{selectedTlds.has(t)?selectedTlds.delete(t):selectedTlds.add(t);b.classList.toggle('is-selected',selectedTlds.has(t));b.setAttribute('aria-pressed',String(selectedTlds.has(t)));updateSuffixStatus()};frag.append(b)});suffixList.append(frag)
}
function scheduleSuffixRender(){cancelAnimationFrame(suffixRenderFrame);suffixRenderFrame=requestAnimationFrame(renderSuffixes)}
suffixSearch.addEventListener('input',scheduleSuffixRender);$('suffixCommon').onclick=()=>{selectedTlds=new Set(['com','net','org','cn','io','ai','co','me','app','dev']);renderSuffixes();updateSuffixStatus()};$('suffixClear').onclick=()=>{selectedTlds.clear();renderSuffixes();updateSuffixStatus()};
const batchCopy={
 zh:['全部状态','停止查询','重试未完成','导出 CSV','复制当前域名','待查询','查询中','查无注册记录','注册商','到期时间','输入名称时请先选择后缀。','仅查询前 50 个域名','无匹配结果'],
 'zh-Hant':['全部狀態','停止查詢','重試未完成','匯出 CSV','複製目前網域','待查詢','查詢中','查無註冊記錄','註冊商','到期時間','輸入名稱時請先選擇後綴。','僅查詢前 50 個網域','無相符結果'],
 en:['All statuses','Stop lookup','Retry unfinished','Export CSV','Copy shown domains','Queued','Looking up','No registration record','Registrar','Expiration','Select a suffix to look up a bare name.','Only the first 50 domains will be queried','No matching results']
};
const ui=i=>(batchCopy[lang]||batchCopy.en)[i];
let batchRows=[], active=null;
const toolbar=document.createElement('div');
toolbar.className='batch-tools';
const filter=document.createElement('select');
const stop=document.createElement('button'),retry=document.createElement('button');
const csv=document.createElement('button'),copy=document.createElement('button');
for(const button of [stop,retry,csv,copy])button.type='button';
toolbar.append(filter,stop,retry,csv,copy);
const plan=document.createElement('p');
plan.className='batch-preview';
plan.setAttribute('aria-live','polite');
submit.parentElement.before(plan);
const preview=document.createElement('p');
preview.className='batch-preview';
preview.setAttribute('aria-live','polite');
list.before(toolbar,preview);
progress.setAttribute('aria-live','polite');

function buildDomains(){
 const domains=new Set(), invalid=new Set();
 let needsSuffix=false;
 for(const token of textarea.value.split(/[\s,;]+/).filter(Boolean)){
  const domain=cleanDomain(token);
  if(domain){domains.add(domain);continue}
  if(!/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i.test(token)){invalid.add(token);continue}
  if(!selectedTlds.size)needsSuffix=true;
  for(const suffix of selectedTlds){
   const candidate=cleanDomain(token+'.'+suffix);
   if(candidate)domains.add(candidate);
  }
 }
 return {domains,invalid,needsSuffix};
}

function updateBatchPreview(){
 const {domains,invalid,needsSuffix}=buildDomains();
 const summary=lang==='zh'? ['待查询','无效输入']:lang==='zh-Hant'?['待查詢','無效輸入']:['Domains queued','Invalid inputs'];
 plan.textContent=textarea.value.trim()?[
  summary[0]+' '+Math.min(50,domains.size)+' / '+domains.size,
  invalid.size?summary[1]+' '+invalid.size:'',
  needsSuffix?ui(10):''
 ].filter(Boolean).join(' · '):'';
}

function label(state){
 const c=COPY[lang]||COPY.en;
 const labels={http:lang==='zh'?'接口错误':lang==='zh-Hant'?'介面錯誤':'API error',queued:ui(5),loading:ui(6),registered:c[8],available:ui(7),unknown:c[10],invalid:c[11],failed:c[12],reserved:c[22]||'Reserved'};
 return labels[state]||WhoisLookup.message({kind:state==='invalidResponse'?'invalid':state},lang);
}

function shown(){
 return batchRows.filter(row=>!filter.value||row.state===filter.value);
}

function paintRow(job){
 job.row.hidden=!!filter.value&&filter.value!==job.state;
 job.status.className='batch-state '+job.state;
 job.status.textContent=job.error?WhoisLookup.message(job.error,lang):label(job.state);
 const data=job.data;
 job.detail.textContent=data?[data.registrar,WhoisTimezone.format(data.expirationDateISO8601||data.expirationDate)].filter(Boolean).join(' · '):'';
}

function controls(){
 const current=filter.value;
 const states=[...new Set([...batchRows.map(row=>row.state),...(current?[current]:[])])];
 filter.replaceChildren(new Option(ui(0),''),...states.map(s=>new Option(label(s),s)));
 filter.value=states.includes(current)?current:'';
 filter.setAttribute('aria-label',ui(0));
 [stop,retry,csv,copy].forEach((button,i)=>button.textContent=ui(i+1));
 stop.disabled=!active;
 retry.disabled=!!active||!batchRows.some(retryable);
 const hasResults=shown().some(r=>r.state!=='invalid');
 csv.disabled=copy.disabled=!hasResults;
 const valid=batchRows.filter(r=>r.state!=='invalid');
 progress.textContent=valid.filter(r=>r.state!=='queued'&&r.state!=='loading').length+' / '+valid.length;
 batchRows.forEach(paintRow);
}

function rowFor(domain,state){
 const row=document.createElement('div');
 row.className='batch-row';
 const name=document.createElement('span'),status=document.createElement('span'),detail=document.createElement('small');
 name.className='batch-domain';
 name.textContent=domain;
 detail.className='batch-row-detail';
 name.append(detail);
 row.append(name,status);
 if(state!=='invalid'){
  const open=document.createElement('a');
  open.className='batch-open';
  open.href=searchUrl(domain);
  open.setAttribute('aria-label',domain);
  open.textContent='→';
  row.append(open);
 }
 return {domain,row,status,detail,state};
}

function retryable(row){
 return ['failed','timeout','network','rateLimited','invalidResponse','cancelled','unknown','http'].includes(row.state);
}

async function run(jobs){
 if(active||!jobs.length)return;
 const controller=new AbortController();
 active=controller;
 submit.disabled=clear.disabled=true;
 for(const job of jobs){job.state='queued';job.error=null;job.data=null}
 controls();
 let next=0;
 async function worker(){
  while(!controller.signal.aborted&&next<jobs.length){
   const job=jobs[next++];
   job.state='loading';
   controls();
   try{
    job.data=await WhoisLookup.query(job.domain,controller.signal);
    job.state=WhoisLookup.state(job.data);
   }catch(err){
    job.error=err;
    job.state=err.kind==='invalid'?'invalidResponse':err.kind||'failed';
   }
   controls();
  }
 }
 try{
  await Promise.all(Array.from({length:Math.min(4,jobs.length)},worker));
  for(const job of jobs)if(job.state==='queued')job.state='cancelled';
  const completed=jobs.filter(job=>job.data).map(job=>job.domain);
  if(completed.length)writeHistory([...completed.reverse(),...readHistory()]);
 }finally{
  active=null;
  submit.disabled=clear.disabled=false;
  controls();
 }
}

submit.onclick=()=>{
 if(active)return;
 const {domains,invalid,needsSuffix}=buildDomains();
 const jobs=[...domains].slice(0,50).map(d=>rowFor(d,'queued'));
 batchRows=[...jobs,...[...invalid].slice(0,10).map(d=>rowFor(d,'invalid'))];
 filter.value='';
 list.replaceChildren(...batchRows.map(r=>r.row));
 results.hidden=false;
 const messages=[];
 if(domains.size>50)messages.push(domains.size+' · '+ui(11));
 if(needsSuffix)messages.push(ui(10));
 if(!batchRows.length&&!messages.length)messages.push((COPY[lang]||COPY.en)[20]);
 preview.textContent=messages.join(' · ');
 controls();
 run(jobs);
};
filter.onchange=controls;
stop.onclick=()=>active?.abort();
retry.onclick=()=>run(batchRows.filter(retryable));
copy.onclick=async()=>{
 try{await window.copyToClipboard(shown().filter(row=>row.state!=='invalid').map(row=>row.domain).join('\n'));window.showToast?.(toastText('copied'),'success')}
 catch{window.showToast?.(toastText('copyFailed'),'error')}
};
csv.onclick=()=>{
 const columns=['Domain','Status','Registrar','Expiration','Details'];
 const values=shown().filter(row=>row.state!=='invalid').map(({domain,state,data,error})=>[domain,state,data?.registrar,data?.expirationDateISO8601||data?.expirationDate,error?.status||error?.kind]);
 function cell(value){
  let text=String(value??'');
  if(/^[\s]*[=+@-]|^[\t\r\n]/.test(text))text="'"+text;
  return '"'+text.replace(/"/g,'""')+'"';
 }
 const file=new Blob(['\uFEFF'+[columns,...values].map(row=>row.map(cell).join(',')).join('\r\n')],{type:'text/csv;charset=utf-8'});
 const url=URL.createObjectURL(file),link=document.createElement('a');
 link.href=url;link.download='domain-lookups.csv';link.click();
 setTimeout(()=>URL.revokeObjectURL(url),1000);
};
textarea.addEventListener('input',updateBatchPreview);
sel.addEventListener('change',()=>{controls();updateBatchPreview()});
window.addEventListener('whois-timezone-change',controls);
initThemePicker();
applyLang();
$('year').textContent=new Date().getFullYear();
loadSuffixes();
controls();
