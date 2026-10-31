const CARDS = {
  card01: {name:'混血王子的魔藥筆記', english:'The Half-Blood Prince’s Notes', description:'風味｜苦酒・草本・香料・可樂香', alcohol:true, img:'assets/card01-front.jpg', back:'assets/card01-back.jpg'},
  card02: {name:'愛麗絲的縮小藥水', english:'Drink Me!', description:'風味｜葡萄柚・烏龍・酸甜清爽', alcohol:false, img:'assets/card02-front.jpg', back:'assets/card02-back.jpg'},
  card03: {name:'史瑞克的洗澡水', english:'Shrek’s Bathwater', description:'風味｜泰綠・抹茶・青草香', alcohol:true, img:'assets/card03-front.jpg', back:'assets/card03-back.jpg'},
  card04: {name:'威利旺卡的秘密配方', english:'Willy Wonka’s Secret Recipe', description:'風味｜爆米花・焦糖・奶香・烘焙香', alcohol:false, img:'assets/card04-front.jpg', back:'assets/card04-back.jpg'},
  card05: {name:'壞皇后的美容秘方', english:'The Evil Queen’s Beauty Elixir', description:'風味｜苦酒・葡萄柚・玫瑰・氣泡', alcohol:true, img:'assets/card05-front.jpg', back:'assets/card05-back.jpg'},
  card06: {name:'霹靂卡霹靂拉拉', english:'Pirika Pirilala Poporina Peperuto', description:'風味｜草莓・金萱・奶香・蘋果皮', alcohol:false, img:'assets/card06-front.jpg', back:'assets/card06-back.jpg'},
};
const DEFAULT_INVENTORY = Object.fromEntries(Object.keys(CARDS).map(k=>[k,{planned:10,issued:0}]));
const STORAGE_KEY = 'rasaArchiveHalloweenSixJPG10V1';
const $ = id => document.getElementById(id);
const screens = ['homeScreen','quizScreen','drawScreen','resultScreen'];
let selectedAlcohol = null;
let selectedKey = null;
let busy = false;
function show(id){ screens.forEach(s=>$(s).classList.toggle('active',s===id)); }
function cloneDefault(){return JSON.parse(JSON.stringify(DEFAULT_INVENTORY));}
function getInventory(){
  try{
    const saved=JSON.parse(localStorage.getItem(STORAGE_KEY));
    const inv=cloneDefault();
    Object.keys(inv).forEach(k=>{
      if(saved && saved[k]){
        inv[k].planned=Math.max(0,Math.floor(Number(saved[k].planned)||0));
        inv[k].issued=Math.min(inv[k].planned,Math.max(0,Math.floor(Number(saved[k].issued)||0)));
      }
    });
    return inv;
  }catch(e){return cloneDefault();}
}
function setInventory(inv){localStorage.setItem(STORAGE_KEY,JSON.stringify(inv));renderInventory();}
function remainingOf(i){return Math.max(0,i.planned-i.issued);}
function resetFlow(){
  selectedAlcohol=null; selectedKey=null; busy=false;
  $('cardField').classList.remove('shuffle');
  $('revealCard').classList.remove('flipped');
  $('drawButton').disabled=false;
  show('homeScreen');
}
function startQuiz(){
  $('progress').textContent='01 / 01';
  $('questionText').textContent='今晚有沒有想要喝酒？';
  $('choiceA').textContent='有！今晚來點魔法微醺 ✦';
  $('choiceB').textContent='沒有！今天喝無酒精 ✧';
  show('quizScreen');
}
function answerQuestion(alcohol){
  selectedAlcohol=alcohol;
  show('drawScreen');
  setTimeout(()=>$('cardField').classList.add('shuffle'),420);
}
/* 真正隨機挑選當前發放數最少的同類卡牌；售罄時不重複發放 */
function chooseCard(){
  const inv=getInventory();
  const candidates=Object.keys(CARDS).filter(k=>CARDS[k].alcohol===selectedAlcohol && remainingOf(inv[k])>0);
  if(!candidates.length) return null;
  const minIssued=Math.min(...candidates.map(k=>inv[k].issued));
  const tied=candidates.filter(k=>inv[k].issued===minIssued);
  const chosen=tied[Math.floor(Math.random()*tied.length)];
  inv[chosen].issued++;
  setInventory(inv);
  return chosen;
}
function reveal(){
  if(busy)return;
  busy=true;
  $('drawButton').disabled=true;
  const key=chooseCard();
  if(!key){
    busy=false;
    $('drawButton').disabled=false;
    alert('這一組飲品已全部抽完，請洽現場工作人員！');
    return;
  }
  selectedKey=key;
  const c=CARDS[key];
  $('resultImage').src=c.img;
  $('resultImage').alt=c.name+' 正面';
  $('resultBackImage').src=c.back;
  $('resultName').textContent=c.name;
  $('resultEnglish').textContent=c.english;
  $('resultDescription').textContent=c.description;
  $('revealCard').classList.remove('flipped');
  show('resultScreen');
  setTimeout(()=>$('revealCard').classList.add('flipped'),220);
}
function renderInventory(){
  const inv=getInventory();
  $('stockTable').innerHTML=Object.keys(CARDS).map(k=>{
    const i=inv[k],c=CARDS[k];
    return `<article class="stock-row"><div class="stock-name"><strong>${c.name}</strong><small>${c.alcohol?'有酒精':'無酒精'}</small></div><div class="stock-metric"><span>已發放</span><strong>${i.issued}</strong></div><div class="stock-metric"><span>預備總數</span><strong>${i.planned}</strong></div><div class="stock-metric"><span>庫存</span><strong>${remainingOf(i)}</strong></div><div class="stock-controls"><button type="button" data-action="decrease" data-key="${k}">−</button><button type="button" data-action="increase" data-key="${k}">＋</button></div></article>`;
  }).join('');
  $('issuedTotal').textContent=Object.values(inv).reduce((n,i)=>n+i.issued,0);
  $('plannedTotal').textContent=Object.values(inv).reduce((n,i)=>n+i.planned,0);
  $('remainingTotal').textContent=Object.values(inv).reduce((n,i)=>n+remainingOf(i),0);
}
$('stockTable').addEventListener('click',e=>{
  const b=e.target.closest('button[data-action]');if(!b)return;
  const inv=getInventory(),k=b.dataset.key;if(!inv[k])return;
  const delta=b.dataset.action==='increase'?1:-1;
  inv[k].issued=Math.min(inv[k].planned,Math.max(0,inv[k].issued+delta));
  setInventory(inv);
});
$('homeStart').addEventListener('click',startQuiz);
$('choiceA').addEventListener('click',()=>answerQuestion(true));
$('choiceB').addEventListener('click',()=>answerQuestion(false));
$('drawButton').addEventListener('click',reveal);
$('againButton').addEventListener('click',resetFlow);
$('resetStock').addEventListener('click',()=>{
  if(confirm('確定將六款飲品都重設為每款 10 杯、已發放 0 杯嗎？'))setInventory(cloneDefault());
});
function closeInv(){$('inventoryDialog').close();}
$('closeInventory').addEventListener('click',closeInv);
$('closeInventoryBottom').addEventListener('click',closeInv);
$('inventoryDialog').addEventListener('click',e=>{if(e.target===$('inventoryDialog'))closeInv();});
let holdTimer=null,holdStart=0,holdFrame=null;
function interactive(t){return !!t.closest('button,a,dialog,.choice,.reveal-card,img');}
function stopHold(){clearTimeout(holdTimer);holdTimer=null;cancelAnimationFrame(holdFrame);holdFrame=null;$('holdFeedback').classList.remove('visible');$('holdFeedback').style.setProperty('--hold-progress','0%');}
function progress(){const p=Math.min(100,(performance.now()-holdStart)/2000*100);$('holdFeedback').style.setProperty('--hold-progress',`${p}%`);if(p<100)holdFrame=requestAnimationFrame(progress);}
$('app').addEventListener('pointerdown',e=>{
  if(interactive(e.target)||$('inventoryDialog').open)return;
  holdStart=performance.now();$('holdFeedback').classList.add('visible');progress();
  holdTimer=setTimeout(()=>{stopHold();renderInventory();$('inventoryDialog').showModal();},2000);
});
['pointerup','pointercancel','pointerleave'].forEach(t=>$('app').addEventListener(t,stopHold));
renderInventory();
