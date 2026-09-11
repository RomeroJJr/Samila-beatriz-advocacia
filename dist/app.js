'use strict';
const U = window.BookingUtils;
const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#nav');
function closeMenu(restoreFocus=false) {
  const wasOpen = menu.getAttribute('aria-expanded') === 'true';
  menu.setAttribute('aria-expanded','false'); nav.classList.remove('open');
  if (wasOpen && restoreFocus) menu.focus();
}
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open)});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>closeMenu()));
document.addEventListener('keydown',e=>{if(e.key==='Escape') closeMenu(true)});
document.addEventListener('click',e=>{if(!e.target.closest('header')) closeMenu()});
if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.classList.add('js-motion');
  const observer = new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.08});
  document.querySelectorAll('.reveal').forEach(e=>observer.observe(e));
}
let today = U.parseDate(U.brazilToday()), view = new Date(today.getFullYear(),today.getMonth(),1), selected = null;
const days = document.querySelector('#days'), status = document.querySelector('#date-status');
const fullDate = new Intl.DateTimeFormat('pt-BR',{dateStyle:'full'});
const bookingForm = document.querySelector('#booking-form');
function preferences(){return {date:selected?U.dateKey(selected):'',format:bookingForm.querySelector('input[name="format"]:checked').value,area:document.querySelector('#area').value,period:document.querySelector('#period').value}}
function updateSummary(){
  const p=preferences();
  document.querySelector('#request-summary').textContent=selected?`${fullDate.format(selected)} · ${p.period} · ${p.format} · ${p.area}`:'Escolha uma data para completar sua solicitação.';
  document.querySelector('#request-fallback').hidden=true;
  document.querySelector('#copy-status').textContent='';
}
function chooseDate(date,focus=true){
  selected=date;status.textContent='Preferência: '+fullDate.format(date);status.style.color='';render();updateSummary();
  if(focus)days.querySelector('[aria-pressed="true"]')?.focus({preventScroll:true});
}
function render(){
  today=U.parseDate(U.brazilToday());
  document.querySelector('#month').textContent=new Intl.DateTimeFormat('pt-BR',{month:'long',year:'numeric'}).format(view);
  document.querySelector('#prev-month').disabled=view.getFullYear()===today.getFullYear()&&view.getMonth()===today.getMonth();
  days.replaceChildren();
  for(let i=0;i<view.getDay();i++){const blank=document.createElement('span');blank.setAttribute('aria-hidden','true');days.append(blank)}
  for(let d=1;d<=new Date(view.getFullYear(),view.getMonth()+1,0).getDate();d++){
    const date=new Date(view.getFullYear(),view.getMonth(),d),b=document.createElement('button');
    b.type='button';b.textContent=d;b.dataset.date=U.dateKey(date);b.disabled=date<today;b.setAttribute('aria-label',fullDate.format(date));
    const active=selected&&date.getTime()===selected.getTime();b.setAttribute('aria-pressed',String(!!active));
    if(active)b.classList.add('selected');if(date.getTime()===today.getTime()){b.classList.add('today');b.setAttribute('aria-current','date')}
    b.addEventListener('click',()=>chooseDate(date));days.append(b);
  }
}
function shiftMonth(delta){view=new Date(view.getFullYear(),view.getMonth()+delta,1);render()}
document.querySelector('#prev-month').addEventListener('click',()=>shiftMonth(-1));
document.querySelector('#next-month').addEventListener('click',()=>shiftMonth(1));
days.addEventListener('keydown',event=>{
  const offsets={ArrowLeft:-1,ArrowRight:1,ArrowUp:-7,ArrowDown:7};
  if(!(event.key in offsets)||!event.target.dataset.date)return;
  event.preventDefault();const date=U.parseDate(event.target.dataset.date);date.setDate(date.getDate()+offsets[event.key]);
  if(U.dateKey(date)<U.brazilToday())return;
  view=new Date(date.getFullYear(),date.getMonth(),1);render();days.querySelector(`[data-date="${U.dateKey(date)}"]`)?.focus({preventScroll:true});
});
bookingForm.addEventListener('change',updateSummary);
document.querySelectorAll('[data-area]').forEach(a=>a.addEventListener('click',()=>{document.querySelector('#area').value=a.dataset.area;updateSummary()}));
bookingForm.addEventListener('submit',event=>{
  event.preventDefault();let message;
  try{message=U.message(preferences())}catch(error){status.textContent=selected?error.message:'Escolha uma data no calendário para continuar.';status.style.color='#a12a2a';render();days.querySelector('button:not(:disabled)')?.focus();return}
  const url='https://wa.me/558398418078?text='+encodeURIComponent(message);
  document.querySelector('#request-message').value=message;document.querySelector('#reopen-whatsapp').href=url;
  document.querySelector('#request-fallback').hidden=false;
  status.textContent='Sua solicitação foi preparada. Envie a mensagem no WhatsApp e aguarde a confirmação do escritório.';
  window.open(url,'_blank','noopener,noreferrer');
});
document.querySelector('#copy-message').addEventListener('click',async()=>{
  const field=document.querySelector('#request-message');const copyStatus=document.querySelector('#copy-status');
  try{if(!navigator.clipboard?.writeText)throw new Error('Clipboard unavailable');await navigator.clipboard.writeText(field.value);copyStatus.textContent='Mensagem copiada. Cole na conversa com o escritório.'}
  catch{field.focus();field.select();copyStatus.textContent='Selecione e copie o texto acima para enviar ao escritório.'}
});
// Checklists are only in this page's memory. No persistence or document uploads.
const preparationSets={
  work:{intro:'Se tiver estes registros, deixe-os separados para a conversa.',items:['Anotar as principais datas da relação de trabalho.','Separar contrato, registros de trabalho e comprovantes disponíveis.','Organizar mensagens e documentos relacionados à sua dúvida.','Listar suas perguntas e o que deseja esclarecer.'],area:'Direito Trabalhista'},
  public:{intro:'Organize as informações do procedimento que deseja discutir.',items:['Anotar o órgão público e o assunto envolvido.','Separar comunicações, decisões e protocolos disponíveis.','Registrar datas e eventuais prazos informados nos documentos.','Listar suas dúvidas e as providências já tomadas.'],area:'Direito Administrativo'},
  general:{intro:'Você pode começar pelo que já sabe sobre a situação.',items:['Resumir o que aconteceu em ordem de datas.','Separar os documentos que já possui.','Anotar contatos e comunicações relevantes.','Listar suas principais perguntas para a consulta.'],area:'Preciso de orientação'}
};
const checkedItems={work:new Set(),public:new Set(),general:new Set()};
const prepSelect=document.querySelector('#preparation-area');
function updatePreparationProgress(){const done=checkedItems[prepSelect.value].size;document.querySelector('#preparation-count').textContent=`${done} de 4 itens organizados`;document.querySelector('#preparation-progress').value=done}
function renderPreparation(){
  const key=prepSelect.value,data=preparationSets[key];document.querySelector('#preparation-intro').textContent=data.intro;
  const list=document.querySelector('#preparation-list');list.replaceChildren();
  data.items.forEach((text,index)=>{const label=document.createElement('label'),input=document.createElement('input'),span=document.createElement('span');input.type='checkbox';input.checked=checkedItems[key].has(index);span.textContent=text;input.addEventListener('change',()=>{if(input.checked)checkedItems[key].add(index);else checkedItems[key].delete(index);updatePreparationProgress()});label.append(input,span);list.append(label)});updatePreparationProgress();
}
prepSelect.addEventListener('change',renderPreparation);
document.querySelector('#prepare-booking').addEventListener('click',()=>{document.querySelector('#area').value=preparationSets[prepSelect.value].area;updateSummary()});
renderPreparation();document.querySelector('#year').textContent=today.getFullYear();render();updateSummary();
if(document.modelContext?.registerTool){
  const lifecycle=new AbortController();
  try{Promise.resolve(document.modelContext.registerTool({name:'prepare_consultation_request',title:'Preparar solicitação de consulta',description:'Preenche o formulário visível com preferências. Não envia mensagem nem confirma agendamento.',inputSchema:{type:'object',properties:{date:{type:'string',description:'YYYY-MM-DD'},format:{type:'string',enum:U.FORMATS},area:{type:'string',enum:U.AREAS},period:{type:'string',enum:U.PERIODS}},required:['date','format','area'],additionalProperties:false},annotations:{readOnlyHint:false},execute(input){const p=U.validate({...input,period:input.period??'Sem preferência'});const date=U.parseDate(p.date);view=new Date(date.getFullYear(),date.getMonth(),1);bookingForm.querySelector(`input[name="format"][value="${p.format}"]`).checked=true;document.querySelector('#area').value=p.area;document.querySelector('#period').value=p.period;chooseDate(date,false);document.querySelector('#agendar').scrollIntoView();return {status:'prepared',...p,confirmed:false,messageSent:false}}},{signal:lifecycle.signal})).catch(()=>{});window.addEventListener('pagehide',()=>lifecycle.abort(),{once:true})}catch{}
}
// Motion enhances existing navigation; anchors and controls retain native behavior.
const motionPreference=matchMedia('(prefers-reduced-motion: reduce)');
document.querySelectorAll('.practice-grid,.values').forEach(group=>Array.from(group.children).forEach((item,i)=>item.style.setProperty('--reveal-delay',`${i*110}ms`)));
const siteHeader=document.querySelector('header');const portraitStage=document.querySelector('.portrait-stage');const heroSection=document.querySelector('.hero');let scrollFrame=0;
function updateScrollEffects(){scrollFrame=0;siteHeader.classList.toggle('scrolled',window.scrollY>24);if(!motionPreference.matches&&window.innerWidth>800){const bounds=heroSection.getBoundingClientRect();const offset=Math.max(0,Math.min(16,-bounds.top*.035));portraitStage.style.setProperty('--portrait-shift',`${offset}px`)}else portraitStage.style.setProperty('--portrait-shift','0px')}
function queueScrollEffects(){if(!scrollFrame)scrollFrame=requestAnimationFrame(updateScrollEffects)}
window.addEventListener('scroll',queueScrollEffects,{passive:true});window.addEventListener('resize',queueScrollEffects,{passive:true});motionPreference.addEventListener('change',queueScrollEffects);updateScrollEffects();
if('IntersectionObserver' in window){const activeSection=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){nav.querySelectorAll('a').forEach(link=>{if(link.hash==='#'+entry.target.id)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current')})}})},{rootMargin:'-15% 0px -60% 0px',threshold:0});document.querySelectorAll('main section[id]').forEach(section=>activeSection.observe(section))}
document.querySelectorAll('a[href^="#"]').forEach(link=>link.addEventListener('click',()=>{const target=document.getElementById(link.hash.slice(1));if(target&&!motionPreference.matches){target.classList.remove('nav-arrival');requestAnimationFrame(()=>target.classList.add('nav-arrival'));setTimeout(()=>target.classList.remove('nav-arrival'),1400)}}));
function updateMobileConsultation(){const pastHero=heroSection.getBoundingClientRect().bottom<120;const bounds=document.querySelector('#agendar').getBoundingClientRect();const inBooking=bounds.top<innerHeight&&bounds.bottom>120;document.body.classList.toggle('show-mobile-consultation',pastHero&&!inBooking)}
let mobileFrame=0;window.addEventListener('scroll',()=>{if(!mobileFrame)mobileFrame=requestAnimationFrame(()=>{mobileFrame=0;updateMobileConsultation()})},{passive:true});window.addEventListener('resize',updateMobileConsultation);updateMobileConsultation();
