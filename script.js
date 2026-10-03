/* RASA ARCHIVE｜FOURTH GATHERING */
const CARDS={
  friendship:{name:'友情可貴',img:'assets/card01.png',description:'矮額～～叫我格來～～人家想要黑皮的哈囉凱蒂😘 喝甜甜的有錯嗎?? 妹酒就是讚啦xDD'},
  wish:{name:'心想事成',img:'assets/card02.png',description:'紅露炸彈～～問就是ㄐㄏ啦😂 這次真的是認真的好嗎?? 不准唱衰我們😒 #要一直在一起哦 #30天 #永遠不要分開哦'},
  forget:{name:'勿忘我',img:'assets/card03.png',description:'聽說大人心情不好都會喝酒?? 那我也要喝喝看啊～～✌️ 喝醉就可以全部忘記了吧((最好是XDD'}
};

const QUESTIONS=[
  {q:'放學鐘聲一響，\n你第一個想去哪？',affectsResult:true,archiveKey:'afterSchool',options:[
    {text:'福利社買飲料，留下來跟朋友喇賽',score:{friendship:1,wish:0,forget:0}},
    {text:'揪一團人，反正先出去再說',score:{friendship:0,wish:1,forget:0}},
    {text:'戴上耳機，一個人慢慢晃回家',score:{friendship:0,wish:0,forget:1}}
  ]},
  {q:'如果現在要交換聯絡簿，\n你會在「個性」那欄寫？',affectsResult:true,options:[
    {text:'好相處、愛聊天 ^___^',score:{friendship:1,wish:0,forget:0}},
    {text:'瘋瘋癲癲、熟了就知道 XDD',score:{friendship:0,wish:1,forget:0}},
    {text:'慢熟啦～其實我人很好：P',score:{friendship:0,wish:0,forget:1}}
  ]},
  {q:'今天的你，\n想喝哪一種？',affectsResult:true,options:[
    {text:'甜甜順口，喝酒也要好喝啊 >///<',score:{friendship:3,wish:0,forget:0}},
    {text:'甜中帶勁，今晚就是要嗨啦 .ᐟ.ᐟ',score:{friendship:0,wish:3,forget:0}},
    {text:'汽水系酸甜，熟悉又有點刺激',score:{friendship:0,wish:0,forget:3}}
  ]},
  {q:'KTV 麥克風傳到你手上，\n你會？',affectsResult:true,options:[
    {text:'找朋友一起唱，自己唱太害羞啦',score:{friendship:1,wish:0,forget:0}},
    {text:'等很久了欸！直接站起來唱',score:{friendship:0,wish:1,forget:0}},
    {text:'先說不要，前奏一下還是默默接過來',score:{friendship:0,wish:0,forget:1}}
  ]},
  {q:'MP3 只能再塞最後一首歌，\n你會留給？',archiveKey:'mp3',options:[
    {text:'一聽就想到那群朋友的歌'},
    {text:'前奏一下，全班都會唱的神曲'},
    {text:'只有自己知道為什麼捨不得刪的那首'}
  ]}
];

const DEFAULT_INVENTORY={friendship:{planned:25,issued:0},wish:{planned:25,issued:0},forget:{planned:25,issued:0}};
const STORAGE_KEY='rasaArchiveInventoryFourthGatheringV1';
const $=id=>document.getElementById(id);
const screens=['homeScreen','quizScreen','drawScreen','resultScreen'];
let step=0,scores={friendship:0,wish:0,forget:0},archiveAnswers={afterSchool:'',mp3:''},ranking=['friendship','wish','forget'];

function show(id){screens.forEach(s=>$(s).classList.toggle('active',s===id))}
function cloneDefault(){return JSON.parse(JSON.stringify(DEFAULT_INVENTORY))}
function getInventory(){try{const saved=JSON.parse(localStorage.getItem(STORAGE_KEY)),inv=cloneDefault();Object.keys(inv).forEach(k=>{if(saved&&saved[k]){inv[k].planned=Math.max(0,Number(saved[k].planned??25));inv[k].issued=Math.min(inv[k].planned,Math.max(0,Number(saved[k].issued??0)))}});return inv}catch(e){return cloneDefault()}}
function setInventory(inv){localStorage.setItem(STORAGE_KEY,JSON.stringify(inv));renderInventory()}
function remainingOf(i){return Math.max(0,i.planned-i.issued)}
function resetFlow(){step=0;scores={friendship:0,wish:0,forget:0};archiveAnswers={afterSchool:'',mp3:''};ranking=['friendship','wish','forget'];$('cardField').classList.remove('shuffle');$('revealCard').classList.remove('flipped');show('homeScreen')}
function startQuiz(){step=0;scores={friendship:0,wish:0,forget:0};archiveAnswers={afterSchool:'',mp3:''};renderQuestion();show('quizScreen')}
function renderQuestion(){const q=QUESTIONS[step],buttons=[$('choiceA'),$('choiceB'),$('choiceC')];$('progress').textContent=`${String(step+1).padStart(2,'0')} / 05`;$('questionText').textContent=q.q;buttons.forEach((b,i)=>{const o=q.options[i];b.hidden=!o;b.textContent=o?o.text:''})}
function answerQuestion(i){const q=QUESTIONS[step],o=q.options[i];if(!o)return;if(q.affectsResult&&o.score){scores.friendship+=o.score.friendship||0;scores.wish+=o.score.wish||0;scores.forget+=o.score.forget||0}if(q.archiveKey)archiveAnswers[q.archiveKey]=o.text;step++;if(step<QUESTIONS.length){renderQuestion();return}const inv=getInventory();ranking=Object.keys(scores).sort((a,b)=>{const diff=scores[b]-scores[a];if(diff!==0)return diff;return inv[a].issued-inv[b].issued});showDraw()}
function showDraw(){show('drawScreen');setTimeout(()=>$('cardField').classList.add('shuffle'),420)}
function chooseCard(){const inv=getInventory(),available=ranking.filter(k=>remainingOf(inv[k])>0),chosen=available[0]||ranking[0];if(available[0]){inv[chosen].issued++;setInventory(inv)}return chosen}
function reveal(){const key=chooseCard(),c=CARDS[key];$('resultImage').src=c.img;$('resultName').textContent=c.name;$('resultDescription').textContent=c.description;$('afterSchoolAnswer').textContent=archiveAnswers.afterSchool||'放學後再說啦～';$('mp3Answer').textContent=archiveAnswers.mp3||'捨不得刪掉的那首歌';$('revealCard').classList.remove('flipped');show('resultScreen');setTimeout(()=>$('revealCard').classList.add('flipped'),220)}

const LABELS={friendship:['友情可貴'],wish:['心想事成'],forget:['勿忘我']};
function renderInventory(){const inv=getInventory();$('stockTable').innerHTML=Object.keys(LABELS).map(k=>{const i=inv[k],n=LABELS[k][0];return`<article class="stock-row"><div class="stock-name"><strong>${n}</strong></div><div class="stock-metric"><span>已發放</span><strong>${i.issued}</strong></div><div class="stock-metric"><span>預備總數</span><strong>${i.planned}</strong></div><div class="stock-metric"><span>庫存</span><strong>${remainingOf(i)}</strong></div><div class="stock-controls"><button type="button" data-action="decrease" data-key="${k}">−</button><button type="button" data-action="increase" data-key="${k}">＋</button></div></article>`}).join('');$('issuedTotal').textContent=Object.values(inv).reduce((t,i)=>t+i.issued,0);$('plannedTotal').textContent=Object.values(inv).reduce((t,i)=>t+i.planned,0);$('remainingTotal').textContent=Object.values(inv).reduce((t,i)=>t+remainingOf(i),0)}
function adjustIssued(k,d){const inv=getInventory();inv[k].issued=Math.min(inv[k].planned,Math.max(0,inv[k].issued+d));setInventory(inv)}
$('stockTable').addEventListener('click',e=>{const b=e.target.closest('button[data-action]');if(!b)return;adjustIssued(b.dataset.key,b.dataset.action==='increase'?1:-1)});
$('homeStart').addEventListener('click',startQuiz);$('choiceA').addEventListener('click',()=>answerQuestion(0));$('choiceB').addEventListener('click',()=>answerQuestion(1));$('choiceC').addEventListener('click',()=>answerQuestion(2));$('drawButton').addEventListener('click',reveal);$('againButton').addEventListener('click',resetFlow);
$('resetStock').textContent='重設為每款 25 杯';$('resetStock').addEventListener('click',()=>{if(confirm('確定重設為每款 25 杯、已發放 0 杯嗎？'))setInventory(cloneDefault())});
function closeInv(){$('inventoryDialog').close()}$('closeInventory').addEventListener('click',closeInv);$('closeInventoryBottom').addEventListener('click',closeInv);$('inventoryDialog').addEventListener('click',e=>{if(e.target===$('inventoryDialog'))closeInv()});
let holdTimer=null,holdStart=0,holdFrame=null;function interactive(t){return!!t.closest('button,a,dialog,.choice,.reveal-card,img')}function stopHold(){clearTimeout(holdTimer);holdTimer=null;cancelAnimationFrame(holdFrame);holdFrame=null;$('holdFeedback').classList.remove('visible');$('holdFeedback').style.setProperty('--hold-progress','0%')}function progress(){const p=Math.min(100,(performance.now()-holdStart)/2000*100);$('holdFeedback').style.setProperty('--hold-progress',`${p}%`);if(p<100)holdFrame=requestAnimationFrame(progress)}$('app').addEventListener('pointerdown',e=>{if(interactive(e.target)||$('inventoryDialog').open)return;holdStart=performance.now();$('holdFeedback').classList.add('visible');progress();holdTimer=setTimeout(()=>{stopHold();renderInventory();$('inventoryDialog').showModal()},2000)});['pointerup','pointercancel','pointerleave'].forEach(t=>$('app').addEventListener(t,stopHold));
renderInventory();
