/* =========================================================
   RASA ARCHIVE｜桃花俱樂部
   2026
========================================================= */


/* =========================================================
   三款限定飲品
========================================================= */

const CARDS = {

  moon:{
    name:'今夜月色真美',
    img:'assets/card01.png',
    description:'沒有說出口的喜歡，藏進今晚的月色裡。白桃的甜與檸檬的酸明亮交錯，再添一點 Vodka，給你剛剛好的膽量，把剩下的話說完。'
  },

  stay:{
    name:'關於留關於走',
    img:'assets/card02.png',
    description:'蜜桃與莓果的甜，最後留下茶香與杜松子的氣息；關係裡的留與走，選擇權在自己手上。'
  },

  september:{
    name:'九月二十一晚',
    img:'assets/card03.png',
    description:'白葡萄、梅酒與楊桃的酸甜交疊；當下即是永恆。時間繼續往前，曾經並肩走過的日子，都成了金色記憶。'
  }

};


/* =========================================================
   五道選擇題

   權重配置：

   Q1 情感氛圍      +1
   Q2 戀愛傾向      +1
   Q3 風味偏好      +3
   Q4 香氣偏好      +3
   Q5 舉杯時刻       0

   → 飲品實際風味為主要推薦依據
========================================================= */

const QUESTIONS = [

  /* -------------------------
     Q1｜情感氛圍
  ------------------------- */

  {
    q:'今晚，\n你為哪一種心情而來？',

    affectsResult:true,

    options:[

      {
        text:'期待一場心動相遇',
        score:{
          moon:1,
          stay:0,
          september:0
        }
      },

      {
        text:'想看看關係的更多可能',
        score:{
          moon:0,
          stay:1,
          september:0
        }
      },

      {
        text:'收藏一段值得留念的夜晚',
        score:{
          moon:0,
          stay:0,
          september:1
        }
      }

    ]
  },


  /* -------------------------
     Q2｜喜歡的方式
     此題同時記錄到結果頁
  ------------------------- */

  {
    q:'喜歡一個人時，\n你會怎麼表示？',

    affectsResult:true,

    archiveKey:'love',

    options:[

      {
        text:'喜歡，就讓他知道',
        score:{
          moon:1,
          stay:0,
          september:0
        }
      },

      {
        text:'喜歡，要欲擒故縱',
        score:{
          moon:0,
          stay:1,
          september:0
        }
      },

      {
        text:'喜歡，會珍藏於心',
        score:{
          moon:0,
          stay:0,
          september:1
        }
      }

    ]
  },


  /* -------------------------
     Q3｜實際風味
     高權重
  ------------------------- */

  {
    q:'如果心動有味道，\n你希望它是？',

    affectsResult:true,

    options:[

      {
        text:'清新明亮',
        score:{
          moon:3,
          stay:0,
          september:0
        }
      },

      {
        text:'甜美滋潤',
        score:{
          moon:0,
          stay:3,
          september:0
        }
      },

      {
        text:'馥郁柔和',
        score:{
          moon:0,
          stay:0,
          september:3
        }
      }

    ]
  },


  /* -------------------------
     Q4｜香氣偏好
     高權重
  ------------------------- */

  {
    q:'今晚，\n你想為哪種風味停留？',

    affectsResult:true,

    options:[

      {
        text:'酸甜檸檬的清爽果香',
        score:{
          moon:3,
          stay:0,
          september:0
        }
      },

      {
        text:'清新莓果與草本交疊',
        score:{
          moon:0,
          stay:3,
          september:0
        }
      },

      {
        text:'熟成青梅的醇厚甘甜',
        score:{
          moon:0,
          stay:0,
          september:3
        }
      }

    ]
  },


  /* -------------------------
     Q5｜舉杯時刻
     完全不影響飲品結果
  ------------------------- */

  {
    q:'在今晚的相遇中，\n你期待能為哪些時刻舉杯？',

    archiveKey:'toast',

    options:[

      {
        text:'為不期而遇的怦然心動'
      },

      {
        text:'為恰逢其時的彼此靠近'
      },

      {
        text:'為一觸即然的眼神交會'
      }

    ]
  }

];


/* =========================================================
   庫存設定
   每款 30 杯
========================================================= */

const DEFAULT_INVENTORY = {

  moon:{
    planned:30,
    issued:0
  },

  stay:{
    planned:30,
    issued:0
  },

  september:{
    planned:30,
    issued:0
  }

};


/*
  使用新的 STORAGE_KEY，
  避免讀到上一場活動留下的 17 杯庫存資料。
*/

const STORAGE_KEY = 'rasaArchiveInventoryPeachClubV1';


/* =========================================================
   基本狀態
========================================================= */

const $ = id => document.getElementById(id);

const screens = [
  'homeScreen',
  'quizScreen',
  'drawScreen',
  'resultScreen'
];

let step = 0;

let scores = {
  moon:0,
  stay:0,
  september:0
};

let archiveAnswers = {
  love:'',
  toast:''
};

let ranking = [
  'moon',
  'stay',
  'september'
];


/* =========================================================
   畫面切換
========================================================= */

function show(id){

  screens.forEach(s => {

    $(s).classList.toggle(
      'active',
      s === id
    );

  });

}


/* =========================================================
   庫存
========================================================= */

function cloneDefault(){

  return JSON.parse(
    JSON.stringify(DEFAULT_INVENTORY)
  );

}


function getInventory(){

  try{

    const saved = JSON.parse(
      localStorage.getItem(STORAGE_KEY)
    );

    const inv = cloneDefault();

    Object.keys(inv).forEach(k => {

      if(saved && saved[k]){

        inv[k].planned = Math.max(
          0,
          Number(saved[k].planned ?? 30)
        );

        inv[k].issued = Math.min(
          inv[k].planned,
          Math.max(
            0,
            Number(saved[k].issued ?? 0)
          )
        );

      }

    });

    return inv;

  }
  catch(e){

    return cloneDefault();

  }

}


function setInventory(inv){

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(inv)
  );

  renderInventory();

}


function remainingOf(i){

  return Math.max(
    0,
    i.planned - i.issued
  );

}


/* =========================================================
   重新開始
========================================================= */

function resetFlow(){

  step = 0;

  scores = {
    moon:0,
    stay:0,
    september:0
  };

  archiveAnswers = {
    love:'',
    toast:''
  };

  ranking = [
    'moon',
    'stay',
    'september'
  ];

  $('cardField').classList.remove('shuffle');
  $('revealCard').classList.remove('flipped');

  show('homeScreen');

}


/* =========================================================
   開始測驗
========================================================= */

function startQuiz(){

  step = 0;

  scores = {
    moon:0,
    stay:0,
    september:0
  };

  archiveAnswers = {
    love:'',
    toast:''
  };

  renderQuestion();

  show('quizScreen');

}


/* =========================================================
   顯示題目
========================================================= */

function renderQuestion(){

  const q = QUESTIONS[step];

  const buttons = [
    $('choiceA'),
    $('choiceB'),
    $('choiceC')
  ];

  $('progress').textContent =
    `${String(step + 1).padStart(2,'0')} / 05`;

  /*
    保留 \n 自動換行。
    CSS 請維持：

    #questionText{
      white-space:pre-line;
    }
  */

  $('questionText').textContent = q.q;


  buttons.forEach((b,i) => {

    const o = q.options[i];

    b.hidden = !o;

    b.textContent = o
      ? o.text
      : '';

  });

}


/* =========================================================
   回答題目
========================================================= */

function answerQuestion(i){

  const q = QUESTIONS[step];
  const o = q.options[i];

  if(!o) return;


  /* 計算飲品權重 */

  if(q.affectsResult && o.score){

    scores.moon +=
      o.score.moon || 0;

    scores.stay +=
      o.score.stay || 0;

    scores.september +=
      o.score.september || 0;

  }


  /* 儲存不只用於計分、也想在結果頁顯示的答案 */

  if(q.archiveKey){

    archiveAnswers[q.archiveKey] =
      o.text;

  }


  step++;


  if(step < QUESTIONS.length){

    renderQuestion();

    return;

  }


  /*
    分數最高者排第一。

    若分數相同，
    優先推薦目前已發放數量較少的飲品，
    避免平手時某款被過度集中。
  */

  const inv = getInventory();

  ranking = Object.keys(scores).sort(
    (a,b) => {

      const diff =
        scores[b] - scores[a];

      if(diff !== 0){
        return diff;
      }

      return (
        inv[a].issued -
        inv[b].issued
      );

    }
  );


  showDraw();

}


/* =========================================================
   洗牌
========================================================= */

function showDraw(){

  show('drawScreen');

  setTimeout(() => {

    $('cardField')
      .classList
      .add('shuffle');

  },420);

}


/* =========================================================
   從推薦排行中挑出仍有庫存的卡牌
========================================================= */

function chooseCard(){

  const inv = getInventory();


  const available =
    ranking.filter(
      k => remainingOf(inv[k]) > 0
    );


  /*
    第一順位售完時，
    自動使用第二順位。
  */

  const chosen =
    available[0] ||
    ranking[0];


  /*
    只有實際還有庫存時才扣除。
  */

  if(available[0]){

    inv[chosen].issued++;

    setInventory(inv);

  }


  return chosen;

}


/* =========================================================
   顯示抽牌結果
========================================================= */

function reveal(){

  const key = chooseCard();
  const c = CARDS[key];


  $('resultImage').src =
    c.img;


  $('resultName').textContent =
    c.name;


  /*
    這次沒有英文 edition。

    在 index.html 尚未刪除
    resultEdition 前，
    先把內容清空。
  */

  if($('resultEdition')){

    $('resultEdition').textContent = '';

  }


  $('resultDescription').textContent =
    c.description;


  /*
    暫時沿用目前 index.html 的 ID。

    songAnswer：
    顯示 Q2「喜歡一個人，你更接近哪一種？」

    toastAnswer：
    顯示 Q5 不計分的「舉杯時刻」

    等你下一步給我 index.html，
    我會一起把文字標題改掉。
  */

  if($('songAnswer')){

    $('songAnswer').textContent =
      archiveAnswers.love ||
      '今晚自己的步調';

  }


  if($('toastAnswer')){

    $('toastAnswer').textContent =
      archiveAnswers.toast ||
      '值得記住的相遇';

  }


  $('revealCard')
    .classList
    .remove('flipped');


  show('resultScreen');


  setTimeout(() => {

    $('revealCard')
      .classList
      .add('flipped');

  },220);

}


/* =========================================================
   庫存後台
========================================================= */

const LABELS = {

  moon:[
    '今夜月色真美'
  ],

  stay:[
    '關於留關於走'
  ],

  september:[
    '九月二十一晚'
  ]

};


function renderInventory(){

  const inv =
    getInventory();


  $('stockTable').innerHTML =
    Object.keys(LABELS)
      .map(k => {

        const i = inv[k];

        const n =
          LABELS[k][0];


        return `
          <article class="stock-row">

            <div class="stock-name">
              <strong>${n}</strong>
            </div>

            <div class="stock-metric">
              <span>已發放</span>
              <strong>${i.issued}</strong>
            </div>

            <div class="stock-metric">
              <span>預備總數</span>
              <strong>${i.planned}</strong>
            </div>

            <div class="stock-metric">
              <span>庫存</span>
              <strong>${remainingOf(i)}</strong>
            </div>

            <div class="stock-controls">

              <button
                type="button"
                data-action="decrease"
                data-key="${k}">
                −
              </button>

              <button
                type="button"
                data-action="increase"
                data-key="${k}">
                ＋
              </button>

            </div>

          </article>
        `;

      })
      .join('');


  $('issuedTotal').textContent =
    Object.values(inv)
      .reduce(
        (t,i) => t + i.issued,
        0
      );


  $('plannedTotal').textContent =
    Object.values(inv)
      .reduce(
        (t,i) => t + i.planned,
        0
      );


  $('remainingTotal').textContent =
    Object.values(inv)
      .reduce(
        (t,i) => t + remainingOf(i),
        0
      );

}


/* =========================================================
   手動調整已發放數量
========================================================= */

function adjustIssued(k,d){

  const inv =
    getInventory();


  inv[k].issued =
    Math.min(
      inv[k].planned,
      Math.max(
        0,
        inv[k].issued + d
      )
    );


  setInventory(inv);

}


$('stockTable')
  .addEventListener(
    'click',
    e => {

      const b =
        e.target.closest(
          'button[data-action]'
        );


      if(!b) return;


      adjustIssued(
        b.dataset.key,
        b.dataset.action === 'increase'
          ? 1
          : -1
      );

    }
  );


/* =========================================================
   主要按鈕
========================================================= */

$('homeStart')
  .addEventListener(
    'click',
    startQuiz
  );


$('choiceA')
  .addEventListener(
    'click',
    () => answerQuestion(0)
  );


$('choiceB')
  .addEventListener(
    'click',
    () => answerQuestion(1)
  );


$('choiceC')
  .addEventListener(
    'click',
    () => answerQuestion(2)
  );


$('drawButton')
  .addEventListener(
    'click',
    reveal
  );


$('againButton')
  .addEventListener(
    'click',
    resetFlow
  );


/* =========================================================
   重設庫存
========================================================= */

$('resetStock').textContent =
  '重設為每款 30 杯';


$('resetStock')
  .addEventListener(
    'click',
    () => {

      if(
        confirm(
          '確定重設為每款 30 杯、已發放 0 杯嗎？'
        )
      ){

        setInventory(
          cloneDefault()
        );

      }

    }
  );


/* =========================================================
   關閉庫存視窗
========================================================= */

function closeInv(){

  $('inventoryDialog').close();

}


$('closeInventory')
  .addEventListener(
    'click',
    closeInv
  );


$('closeInventoryBottom')
  .addEventListener(
    'click',
    closeInv
  );


$('inventoryDialog')
  .addEventListener(
    'click',
    e => {

      if(
        e.target ===
        $('inventoryDialog')
      ){

        closeInv();

      }

    }
  );


/* =========================================================
   長按開啟庫存
========================================================= */

let holdTimer = null;
let holdStart = 0;
let holdFrame = null;


function interactive(t){

  return !!t.closest(
    'button,a,dialog,.choice,.reveal-card,img'
  );

}


function stopHold(){

  clearTimeout(
    holdTimer
  );

  holdTimer = null;


  cancelAnimationFrame(
    holdFrame
  );

  holdFrame = null;


  $('holdFeedback')
    .classList
    .remove('visible');


  $('holdFeedback')
    .style
    .setProperty(
      '--hold-progress',
      '0%'
    );

}


function progress(){

  const p =
    Math.min(
      100,
      (
        performance.now() -
        holdStart
      ) / 2000 * 100
    );


  $('holdFeedback')
    .style
    .setProperty(
      '--hold-progress',
      `${p}%`
    );


  if(p < 100){

    holdFrame =
      requestAnimationFrame(
        progress
      );

  }

}


$('app')
  .addEventListener(
    'pointerdown',
    e => {

      if(
        interactive(e.target) ||
        $('inventoryDialog').open
      ){

        return;

      }


      holdStart =
        performance.now();


      $('holdFeedback')
        .classList
        .add('visible');


      progress();


      holdTimer =
        setTimeout(
          () => {

            stopHold();

            renderInventory();

            $('inventoryDialog')
              .showModal();

          },
          2000
        );

    }
  );


[
  'pointerup',
  'pointercancel',
  'pointerleave'
]
.forEach(
  t => {

    $('app')
      .addEventListener(
        t,
        stopHold
      );

  }
);


/* =========================================================
   初始化
========================================================= */

renderInventory();
