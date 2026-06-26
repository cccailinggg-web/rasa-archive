const CARDS={
  flower:{name:'花信初至',edition:'A Floral Edition',img:'assets/card01.png'},
  sun:{name:'金風果語',edition:'A Sunlit Edition',img:'assets/card02.png'},
  night:{name:'暮山焙韻',edition:'A Midnight Edition',img:'assets/card03.png'}
};

const QUESTIONS=[
  {
    q:'第一口，你想從哪種風味開始？',
    a:{text:'初戀般的清爽酸甜',score:{flower:2,sun:1,night:0}},
    b:{text:'摯友般的熱烈果香',score:{flower:0,sun:2,night:1}},
    c:{text:'戀人般的沉穩焙韻',score:{flower:0,sun:1,night:2}}
  },
  {
    q:'你最想靠近哪一種茶韻？',
    a:{text:'清透回甘',score:{flower:2,sun:1,night:0}},
    b:{text:'明亮果韻',score:{flower:0,sun:2,night:1}},
    c:{text:'醇厚馥郁',score:{flower:0,sun:0,night:2}}
  },
  {
    q:'今晚，你想為哪種感受停留？',
    a:{text:'怦然心動的相遇',score:{flower:2,sun:1,night:0}},
    b:{text:'一拍即合的默契',score:{flower:0,sun:2,night:0}},
    c:{text:'細水長流的陪伴',score:{flower:0,sun:0,night:2}}
  }
];

const DEFAULT_STOCK={flower:25,sun:25,night:25};
const STORAGE_KEY='rasaArchiveStockV25';
let step=0;
let scores={flower:0,sun:0,night:0};
let ranking=['flower','sun','night'];

const $=id=>document.getElementById(id);
const screens=['homeScreen','quizScreen','drawScreen','resultScreen'];
function show(id){screens.forEach(s=>$(s).classList.toggle('active',s===id));}
function getStock(){try{return {...DEFAULT_STOCK,...JSON.parse(localStorage.getItem(STORAGE_KEY))}}catch(e){return {...DEFAULT_STOCK}}}
function setStock(stock){localStorage.setItem(STORAGE_KEY,JSON.stringify(stock));updateStockUI();}
function updateStockUI(){const s=getStock();$('stockFlower').textContent=s.flower;$('stockSun').textContent=s.sun;$('stockNight').textContent=s.night;}
function resetFlow(){step=0;scores={flower:0,sun:0,night:0};ranking=['flower','sun','night'];$('cardField').classList.remove('shuffle');$('revealCard').classList.remove('flipped');show('homeScreen');}
function startQuiz(){step=0;scores={flower:0,sun:0,night:0};renderQuestion();show('quizScreen');}
function renderQuestion(){
  const q=QUESTIONS[step];
  $('progress').textContent=String(step+1).padStart(2,'0')+' / 03';
  $('questionText').textContent=q.q;
  $('choiceA').textContent=q.a.text;
  $('choiceB').textContent=q.b.text;
  $('choiceC').textContent=q.c.text;
}
function addScore(score){
  Object.entries(score).forEach(([k,v])=>scores[k]+=v);
  step++;
  if(step<QUESTIONS.length){renderQuestion();}
  else{
    ranking=Object.keys(scores).sort((a,b)=>scores[b]-scores[a] || Math.random()-.5);
    showDraw();
  }
}
function showDraw(){show('drawScreen');setTimeout(()=>$('cardField').classList.add('shuffle'),420);}
function chooseCard(){const stock=getStock();let chosen=ranking.find(k=>stock[k]>0);if(!chosen){chosen=ranking[0];}else{stock[chosen]-=1;setStock(stock);}return chosen;}
function reveal(){const key=chooseCard();const card=CARDS[key];$('resultImage').src=card.img;$('resultName').textContent=card.name;$('resultEdition').textContent=card.edition;show('resultScreen');setTimeout(()=>$('revealCard').classList.add('flipped'),180);}
$('homeStart').addEventListener('click',startQuiz);
$('choiceA').addEventListener('click',()=>addScore(QUESTIONS[step].a.score));
$('choiceB').addEventListener('click',()=>addScore(QUESTIONS[step].b.score));
$('choiceC').addEventListener('click',()=>addScore(QUESTIONS[step].c.score));
$('drawButton').addEventListener('click',reveal);
$('againButton').addEventListener('click',resetFlow);
$('inventoryButton').addEventListener('click',()=>{$('inventoryDialog').showModal();updateStockUI();});
$('resetStock').addEventListener('click',()=>{setStock({...DEFAULT_STOCK});});
updateStockUI();
