console.log('Garden loaded — edit INSTRUCTIONS_IMG at the top to set your image path');

const INSTRUCTIONS_IMG = 'images/Instuctions.png';


// ── FLOWER DATA ───────────────────────────────────────────────
const FLOWERS = [
  { id: 0, name: 'Lavender',      imgKey: 'lavender',     color: '#D5CDE6', cardSrc: 'images/flowers/lavender.png',
    desc: 'Lavender gets its name from the Latin "lavare," meaning "to wash"—ancient Romans used it in their baths for its calming scent.' },

  { id: 1, name: 'Hibiscus',      imgKey: 'hibiscus',     color: '#D39BA0', cardSrc: 'images/flowers/hibiscus.png',
    desc: 'Hibiscus is brewed into a bold, ruby-red drink across the Caribbean, known for its tart flavor and refreshing kick.' },

  { id: 2, name: 'Sunflower',     imgKey: 'sunflower',    color: '#EE9452', cardSrc: 'images/flowers/sunflower.png',
    desc: 'Young sunflowers practice heliotropism—they literally turn their heads to follow the sun across the sky.' },

  { id: 3, name: 'Marigold',     imgKey: 'marigold',     color: '#EE9452', cardSrc: 'images/flowers/maragold.png',
    desc: 'Marigold has edible petals once used to add golden color to soups and butter.' },

  { id: 4, name: 'Gardenia',      imgKey: 'gardenia',     color: '#F5F0E0', cardSrc: 'images/flowers/garenia.png',
    desc: 'Gardenias are famous for their intoxicating fragrance—but they are notoriously picky and dramatic to grow.' },

  { id: 5, name: 'Coreopsis',     imgKey: 'coreopsis',    color: '#F0C040', cardSrc: 'images/flowers/Coreopsis.png',
    desc: 'Coreopsis is nicknamed "tickseed" because its tiny seeds resemble little ticks—pretty flower, unfortunate branding.' },

  { id: 6, name: 'Weld',          imgKey: 'weld',         color: '#D4D88A', cardSrc: 'images/flowers/weld.png',
    desc: 'Weld was once Europe\'s most important source of yellow dye before synthetic pigments took over.' },

  { id: 7, name: 'Black Scabiosa', imgKey: 'blackscabiosa', color: '#4A3A5A', cardSrc: 'images/flowers/black scaboisa.png',
    desc: 'Black Scabiosa produces velvety blooms so deep burgundy they appear almost black—moody, dramatic, unforgettable.' },
];

const FLOWER_BY_IMGKEY = {};
FLOWERS.forEach(f => { FLOWER_BY_IMGKEY[f.imgKey] = f; });

let discovered = new Set();
let animFrame  = null;


// ── IMAGE PRELOAD ─────────────────────────────────────────────
const IMGS = {};
[
  ['flower0',        'images/game items/random/flower0.png'],
  ['flower1',        'images/game items/random/flower1.png'],
  ['flower2',        'images/game items/random/flower2.png'],
  ['flower3',        'images/game items/random/flower3.png'],
  ['flower4',        'images/game items/random/flower4.png'],
  ['flower5',        'images/game items/random/flower5.png'],
  ['flower6',        'images/game items/random/flower6.png'],
  ['flower7',        'images/game items/random/flower7.png'],
  ['flower8',        'images/game items/random/flower8.png'],
  ['flower9',        'images/game items/random/flower9.png'],
  ['lavender',       'images/game items/flowers/lavender.png'],
  ['hibiscus',       'images/game items/flowers/hibiscus.png'],
  ['sunflower',      'images/game items/flowers/Sunflower.png'],
  ['gardenia',       'images/game items/flowers/gardenia.png'],
  ['coreopsis',      'images/game items/flowers/Coreopsis.png'],
  ['marigold',       'images/game items/flowers/maragold.png'],
  ['weld',           'images/game items/flowers/weld.png'],
  ['blackscabiosa',  'images/game items/flowers/black scaboisa.png'],
  ['bush1',          'images/game items/random/bush1.png'],
  ['bush2',          'images/game items/random/bush2.png'],
  ['bush3',          'images/game items/random/bush3.png'],
  ['bush4',          'images/game items/random/bush4.png'],
  ['tiramisu',       'images/game items/desert/tiramisu.png'],
  ['cookies',        'images/game items/desert/cookies.png'],
  ['pudding',        'images/game items/desert/pudding.png'],
  ['macaron',        'images/game items/desert/macaron.png'],
  ['keylime',        'images/game items/desert/key lime.png'],
  ['eclair',         'images/game items/desert/eclair.png'],
  ['cinnamonroll',   'images/game items/desert/cinnamon.png'],
  ['cocostrawberry', 'images/game items/desert/coco stawberry.png'],
  ['cheesecake',     'images/game items/desert/cheesecake.png'],
  ['brownie',        'images/game items/desert/brownie.png'],
  ['tableMain',      'images/tables/table.png'],
  ['tableFront',     'images/tables/face front.png'],
  ['tableLeft',      'images/tables/face left.png'],
  ['tableRight',     'images/tables/face right.png'],
].forEach(([k, src]) => {
  const img = new Image();
  img.onload = () => { img._ok = true; };
  img.src = src;
  IMGS[k] = img;
});

function imgReady(key) {
  const i = IMGS[key];
  return i && (i._ok || (i.complete && i.naturalWidth > 0));
}
function drawImgCentered(ctx, key, cx, cy, size) {
  if (!imgReady(key)) return false;
  ctx.drawImage(IMGS[key], cx - size / 2, cy - size / 2, size, size);
  return true;
}

const SPARKLE_FLOWERS = new Set(['lavender', 'hibiscus', 'sunflower', 'gardenia', 'coreopsis', 'marigold', 'weld', 'blackscabiosa']);
const DESSERT_NAMES   = { tiramisu: 'Tiramisu', cookies: 'Cookies', pudding: 'Pudding', macaron: 'Macarons', keylime: 'Key Lime Pie', eclair: 'Éclair', cinnamonroll: 'Cinnamon Roll', cocostrawberry: 'Coco Strawberry', cheesecake: 'Cheesecake', brownie: 'Brownie' };


// ── CARD MODAL ────────────────────────────────────────────────
const cardModal = document.createElement('div');
cardModal.id = 'card-modal';
cardModal.style.cssText = 'position:fixed;inset:0;z-index:200000;display:none;align-items:center;justify-content:center;background:rgba(0,0,0,0.55);backdrop-filter:blur(4px);';
cardModal.innerHTML = `
  <div style="position:relative;max-width:90vw;max-height:88vh;border-radius:16px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,0.45);">
    <button id="card-modal-close" style="position:absolute;top:10px;right:12px;background:rgba(255,255,255,0.85);border:2px solid var(--deep-sage);border-radius:50%;width:32px;height:32px;font-size:.95rem;cursor:pointer;display:flex;align-items:center;justify-content:center;z-index:10;">✕</button>
    <img id="card-modal-img" src="" alt="Flower card" style="display:block;max-width:90vw;max-height:88vh;object-fit:contain;">
  </div>`;
document.body.appendChild(cardModal);
document.getElementById('card-modal-close').addEventListener('click', () => {
  cardModal.style.display = 'none';
  document.getElementById('card-modal-img').src = '';
});
cardModal.addEventListener('click', e => {
  if (e.target === cardModal) { cardModal.style.display = 'none'; document.getElementById('card-modal-img').src = ''; }
});
function showCardModal(src) {
  document.getElementById('card-modal-img').src = src;
  cardModal.style.display = 'flex';
}


// ── COLLECT CARD ──────────────────────────────────────────────
const collectCard = document.createElement('div');
collectCard.id = 'collect-card';
collectCard.style.cssText = 'position:fixed;z-index:99999;left:50%;top:50%;transform:translate(-50%,-50%) scale(0.7);opacity:0;pointer-events:none;transition:opacity 0.3s ease,transform 0.3s ease;display:flex;flex-direction:column;align-items:center;background:rgba(255,255,255,0.97);border:3px solid var(--deep-sage);border-radius:18px;padding:20px 28px 16px;box-shadow:5px 5px 0 var(--deep-sage);min-width:190px;max-width:250px;text-align:center;font-family:Lora,serif;';
collectCard.innerHTML = `
  <div style="font-size:.7rem;color:#999;letter-spacing:.1em;text-transform:uppercase;margin-bottom:10px;">You found</div>
  <div id="cc-img-wrap" style="width:90px;height:90px;margin-bottom:12px;display:flex;align-items:center;justify-content:center;border-radius:12px;overflow:hidden;border:2px solid var(--deep-sage);background:rgba(200,212,176,0.2);"></div>
  <div id="cc-name" style="font-family:'Playfair Display',serif;font-style:italic;font-size:1.2rem;color:var(--deep-sage);margin-bottom:8px;"></div>
  <div id="cc-desc" style="font-size:.72rem;color:#666;line-height:1.5;margin-bottom:8px;display:none;"></div>
  <div id="cc-tags" style="display:flex;flex-wrap:wrap;gap:4px;justify-content:center;"></div>
  <div id="cc-hint" style="font-size:.65rem;color:#aaa;margin-top:10px;font-style:italic;">Click to close · check Flower Index for full card</div>`;
document.body.appendChild(collectCard);
let collectCardTimer = null;

function showCollectCard(imgKey, kind) {
  const wrap = document.getElementById('cc-img-wrap');
  wrap.innerHTML = '';
  if (imgReady(imgKey)) {
    const el = new Image();
    el.src = IMGS[imgKey].src;
    el.style.cssText = 'width:86px;height:86px;object-fit:contain;image-rendering:pixelated;';
    wrap.appendChild(el);
  } else {
    const sw = document.createElement('div');
    sw.style.cssText = `width:100%;height:100%;background:${kind === 'flower' ? '#D5CDE6' : '#f5d5b0'};`;
    wrap.appendChild(sw);
  }
  const tagsEl = document.getElementById('cc-tags');
  const descEl = document.getElementById('cc-desc');
  const hintEl = document.getElementById('cc-hint');
  tagsEl.innerHTML = '';
  descEl.style.display = 'none';

  if (kind === 'flower') {
    const entry = FLOWER_BY_IMGKEY[imgKey];
    document.getElementById('cc-name').textContent = entry ? entry.name : imgKey;
    if (entry && entry.tags) {
      descEl.textContent = entry.desc.slice(0, 90) + '…';
      descEl.style.display = 'block';
      entry.tags.forEach(t => {
        const s = document.createElement('span');
        s.className = `tag ${TAG_CLS[t]}`;
        s.textContent = TAG_LABEL[t];
        tagsEl.appendChild(s);
      });
    }
    hintEl.style.display = 'block';
  } else {
    document.getElementById('cc-name').textContent = DESSERT_NAMES[imgKey] || imgKey;
    const s = document.createElement('span');
    s.className = 'tag tag-food';
    s.textContent = 'Dessert';
    tagsEl.appendChild(s);
    hintEl.style.display = 'none';
  }

  collectCard.style.pointerEvents = 'auto';
  requestAnimationFrame(() => {
    collectCard.style.opacity = '1';
    collectCard.style.transform = 'translate(-50%,-50%) scale(1)';
  });
  clearTimeout(collectCardTimer);
  collectCardTimer = setTimeout(hideCollectCard, 3500);
}
function hideCollectCard() {
  collectCard.style.opacity = '0';
  collectCard.style.transform = 'translate(-50%,-50%) scale(0.7)';
  collectCard.style.pointerEvents = 'none';
}
collectCard.addEventListener('click', hideCollectCard);


// ── FLOWER INDEX ──────────────────────────────────────────────
function buildIndex() {
  const grid = document.getElementById('flowerGrid');
  grid.innerHTML = '';
  FLOWERS.forEach(f => {
    const unlocked = discovered.has(f.id);
    const card = document.createElement('div');
    card.className = 'flower-card';
    if (unlocked) {
      const gameSrc = IMGS[f.imgKey] ? IMGS[f.imgKey].src : '';
      card.innerHTML = `
        <div class="index-flower-thumb">
          ${gameSrc ? `<img src="${gameSrc}" alt="${f.name}" class="index-flower-img">` : `<div class="flower-swatch" style="background:${f.color};width:100%;height:100%;"></div>`}
        </div>
        <div class="index-flower-name">${f.name}</div>
        <div class="index-flower-hint">Tap to view card</div>`;
      card.style.cursor = 'pointer';
      card.addEventListener('click', () => showCardModal(f.cardSrc));
    } else {
      card.innerHTML = `
        <div class="index-flower-thumb index-flower-locked"><div class="index-lock-icon">?</div></div>
        <div class="index-flower-name" style="color:#aaa;">???</div>
        <div class="index-flower-hint">Find in the garden</div>`;
    }
    grid.appendChild(card);
  });
}

function showModal(f) {
  document.getElementById('modalColor').style.background = f.color;
  document.getElementById('modalTitle').textContent = f.name;
  document.getElementById('modalDesc').textContent = f.desc;
  document.getElementById('modalUses').textContent = f.uses || '';
  const tagsEl = document.getElementById('modalTags');
  if (tagsEl && f.tags) {
    tagsEl.innerHTML = f.tags.map(t => `<span class="tag ${TAG_CLS[t]}">${TAG_LABEL[t]}</span>`).join('');
  }
  document.getElementById('info-modal').classList.add('active');
}
document.getElementById('modalClose').addEventListener('click', () => document.getElementById('info-modal').classList.remove('active'));


// ── COMPLETION SCREEN ─────────────────────────────────────────
function buildCompletionScreen() {
  let el = document.getElementById('completionScreen');
  if (!el) {
    el = document.createElement('div');
    el.id = 'completionScreen';
    el.style.cssText = 'position:fixed;inset:0;z-index:50000;display:none;flex-direction:column;align-items:center;justify-content:center;overflow:hidden;font-family:Lora,serif;';
    document.body.appendChild(el);
  }

  el.innerHTML = `
    <canvas id="teaCanvas" style="position:absolute;inset:0;width:100%;height:100%;image-rendering:pixelated;"></canvas>
    <div id="tea-content" style="position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;gap:18px;padding:20px;width:100%;max-width:820px;">
      <div style="font-family:'Playfair Display',serif;font-style:italic;font-size:2rem;color:#fff;text-shadow:2px 3px 0 rgba(60,80,40,0.7);letter-spacing:.02em;">Garden Party Complete!</div>
      <div id="tea-scene" style="position:relative;width:380px;height:240px;flex-shrink:0;"></div>
      <div style="background:rgba(255,255,255,0.82);border-radius:16px;padding:14px 20px;border:2px solid rgba(123,140,99,0.4);max-width:700px;width:100%;">
        <div style="font-size:.75rem;color:#7b8c63;letter-spacing:.12em;text-transform:uppercase;margin-bottom:10px;text-align:center;">Flowers Discovered</div>
        <div id="tea-flowers" style="display:flex;flex-wrap:wrap;gap:10px;justify-content:center;"></div>
      </div>
      <div style="display:flex;gap:14px;flex-wrap:wrap;justify-content:center;">
        <button id="teaPlayAgain" style="font-family:Lora,serif;font-style:italic;background:var(--deep-sage);color:#fff;border:none;border-radius:12px;padding:10px 26px;font-size:.95rem;cursor:pointer;box-shadow:3px 3px 0 rgba(60,80,40,0.3);">Play Again</button>
        <button id="teaIndexBtn" style="font-family:Lora,serif;font-style:italic;background:rgba(255,255,255,0.85);color:var(--deep-sage);border:2px solid var(--deep-sage);border-radius:12px;padding:10px 26px;font-size:.95rem;cursor:pointer;">Flower Index</button>
      </div>
    </div>`;

  requestAnimationFrame(() => {
    const cv = document.getElementById('teaCanvas');
    if (!cv) return;
    cv.width  = window.innerWidth;
    cv.height = window.innerHeight;
    drawPixelGarden(cv);
    drawTeaScene();
    populateFlowerSummary();
  });

  document.getElementById('teaPlayAgain').addEventListener('click', () => {
    el.style.display = 'none';
    startGame();
    showScreen('game');
  });
  document.getElementById('teaIndexBtn').addEventListener('click', () => {
    el.style.display = 'none';
    indexReturnScreen = 'completion';
    buildIndex();
    showScreen('index');
  });
}

function drawPixelGarden(cv) {
  const ctx = cv.getContext('2d');
  const W = cv.width, H = cv.height;
  const TS = 8;

  const sky = ctx.createLinearGradient(0, 0, 0, H * 0.55);
  sky.addColorStop(0, '#b8d4e8'); sky.addColorStop(1, '#d4eac0');
  ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H * 0.55);

  const ground = ctx.createLinearGradient(0, H * 0.5, 0, H);
  ground.addColorStop(0, '#8ab878'); ground.addColorStop(1, '#6a9458');
  ctx.fillStyle = ground; ctx.fillRect(0, H * 0.5, W, H * 0.5);

  const grassCols = ['#7ab068', '#88be74', '#6aa05a', '#96c880', '#72a860'];
  for (let x = 0; x < W; x += TS) {
    for (let y = Math.floor(H * 0.5); y < H; y += TS) {
      if (Math.random() < 0.55) {
        ctx.fillStyle = grassCols[Math.floor(Math.random() * grassCols.length)];
        ctx.fillRect(x, y, TS, TS);
      }
    }
  }

  const cloudPositions = [[0.15, 0.08], [0.5, 0.05], [0.78, 0.12], [0.35, 0.15]];
  cloudPositions.forEach(([cx, cy]) => {
    const bx = Math.floor(W * cx), by = Math.floor(H * cy);
    [[0, 1], [1, 0], [1, 1], [1, 2], [2, 1], [2, 0], [3, 1]].forEach(([dx, dy]) => {
      ctx.fillStyle = `rgba(255,255,255,${0.6 + Math.random() * 0.3})`;
      ctx.fillRect(bx + dx * 12, by + dy * 8, 14, 10);
    });
  });

  const flowerCols = ['#E8C4D0', '#D5CDE6', '#F0D090', '#C8E0A8', '#F4A0A0', '#A8C8F0'];
  for (let i = 0; i < 60; i++) {
    const fx = Math.random() * W, fy = H * 0.52 + Math.random() * H * 0.44;
    const col = flowerCols[Math.floor(Math.random() * flowerCols.length)];
    ctx.fillStyle = '#5a8040'; ctx.fillRect(fx, fy, 2, 8);
    ctx.fillStyle = col;
    [[-4, -2], [4, -2], [0, -6], [0, 2]].forEach(([dx, dy]) => ctx.fillRect(fx + dx, fy + dy, 4, 4));
    ctx.fillStyle = '#FFE566'; ctx.fillRect(fx, fy - 2, 4, 4);
  }

  const bushCols = ['#4a8038', '#5a9848', '#3e7030'];
  for (let x = 0; x < W; x += 48 + Math.random() * 60) {
    const by = H * 0.78 + Math.random() * H * 0.18;
    const col = bushCols[Math.floor(Math.random() * bushCols.length)];
    [[-16, 8], [0, 0], [16, 8], [-8, -8], [8, -8], [0, -16]].forEach(([dx, dy]) => {
      ctx.fillStyle = col; ctx.fillRect(x + dx, by + dy, 18, 14);
    });
  }

  ctx.fillStyle = 'rgba(210,190,150,0.35)';
  ctx.fillRect(W / 2 - 60, H * 0.52, 120, H * 0.48);
  for (let py = H * 0.54; py < H; py += 10) {
    ctx.fillStyle = `rgba(180,155,110,${0.1 + Math.random() * 0.15})`;
    ctx.fillRect(W / 2 - 55 + Math.random() * 10, py, 6 + Math.random() * 8, 4);
  }
}

function drawTeaScene() {
  const scene = document.getElementById('tea-scene');
  if (!scene) return;
  scene.innerHTML = '';

  function placeImg(key, styles) {
    const img = document.createElement('img');
    img.style.cssText = `position:absolute;image-rendering:pixelated;${styles}`;
    img.src = IMGS[key] ? IMGS[key].src : '';
    if (IMGS[key] && !imgReady(key)) {
      IMGS[key].addEventListener('load', () => { img.src = IMGS[key].src; });
    }
    scene.appendChild(img);
    return img;
  }

  placeImg('tableMain',  'width:180px;height:auto;left:50%;top:50%;transform:translate(-50%,-50%);z-index:3;');
  placeImg('tableFront', 'width:90px;height:auto;left:50%;bottom:0;transform:translateX(-50%);z-index:4;');
  placeImg('tableLeft',  'width:80px;height:auto;right:10px;top:50%;transform:translateY(-50%);z-index:2;');
  placeImg('tableRight', 'width:80px;height:auto;left:10px;top:50%;transform:translateY(-50%);z-index:2;');
}

function populateFlowerSummary() {
  const container = document.getElementById('tea-flowers');
  if (!container) return;
  container.innerHTML = '';

  const found   = FLOWERS.filter(f => discovered.has(f.id));
  const missing = FLOWERS.filter(f => !discovered.has(f.id));

  found.forEach(f => {
    const wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:4px;';
    const thumb = document.createElement('div');
    thumb.style.cssText = 'width:52px;height:52px;border-radius:8px;overflow:hidden;border:2px solid var(--deep-sage);background:rgba(200,212,176,0.2);display:flex;align-items:center;justify-content:center;';
    if (imgReady(f.imgKey)) {
      const img = document.createElement('img');
      img.src = IMGS[f.imgKey].src;
      img.style.cssText = 'width:100%;height:100%;object-fit:contain;image-rendering:pixelated;';
      thumb.appendChild(img);
    } else { thumb.style.background = f.color; }
    const name = document.createElement('div');
    name.style.cssText = 'font-size:.6rem;color:var(--deep-sage);font-style:italic;text-align:center;max-width:56px;line-height:1.2;';
    name.textContent = f.name;
    wrap.appendChild(thumb); wrap.appendChild(name);
    container.appendChild(wrap);
  });

  missing.forEach(f => {
    const wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:4px;opacity:.35;';
    const thumb = document.createElement('div');
    thumb.style.cssText = 'width:52px;height:52px;border-radius:8px;border:2px dashed #aaa;background:#eee;display:flex;align-items:center;justify-content:center;font-size:1.2rem;color:#bbb;';
    thumb.textContent = '?';
    const name = document.createElement('div');
    name.style.cssText = 'font-size:.6rem;color:#aaa;text-align:center;max-width:56px;';
    name.textContent = '???';
    wrap.appendChild(thumb); wrap.appendChild(name);
    container.appendChild(wrap);
  });
}

function showCompletionScreen() {
  cancelAnimationFrame(animFrame);
  animFrame = null;
  buildCompletionScreen();
  Object.values(screens).forEach(s => s.classList.add('hidden'));
  document.getElementById('completionScreen').style.display = 'flex';
}


// ── FOLLOWER ──────────────────────────────────────────────────
const follower = document.getElementById('mouse-follower');
const toggle   = document.getElementById('followerToggle');
let targetX = -200, targetY = -200, curX = -200, curY = -200;

document.addEventListener('mousemove', e => {
  targetX = e.clientX; targetY = e.clientY;
  follower.style.opacity = '1';
});
(function animFollower() {
  curX += (targetX - curX) * 0.14;
  curY += (targetY - curY) * 0.14;
  follower.style.left = (curX - 16) + 'px';
  follower.style.top  = (curY - 16) + 'px';
  requestAnimationFrame(animFollower);
})();
toggle.addEventListener('change', () => {
  follower.classList.toggle('bee-follower',       !toggle.checked);
  follower.classList.toggle('butterfly-follower',  toggle.checked);
});


// ── HOW TO PLAY MODAL ─────────────────────────────────────────
const howToPlayModal = document.createElement('div');
howToPlayModal.id = 'how-to-play-modal';
howToPlayModal.style.cssText = `
  position:fixed;inset:0;z-index:300000;
  display:none;align-items:center;justify-content:center;
  background:rgba(0,0,0,0.6);backdrop-filter:blur(4px);`;
howToPlayModal.innerHTML = `
  <div style="position:relative;max-width:92vw;max-height:90vh;">
    <img id="htp-img" src="" alt="How to Play"
      style="display:block;max-width:92vw;max-height:88vh;object-fit:contain;border-radius:12px;box-shadow:0 8px 40px rgba(0,0,0,0.5);">
    <button id="htp-close" style="
      position:absolute;top:10px;right:12px;
      background:rgba(255,255,255,0.88);border:2px solid #7b8c63;
      border-radius:50%;width:34px;height:34px;
      font-size:1rem;cursor:pointer;line-height:1;
      display:flex;align-items:center;justify-content:center;
      box-shadow:2px 2px 0 rgba(60,80,40,0.2);">✕</button>
  </div>`;
document.body.appendChild(howToPlayModal);
document.getElementById('htp-img').src = INSTRUCTIONS_IMG;

function showHowToPlay() { howToPlayModal.style.display = 'flex'; }
function hideHowToPlay() { howToPlayModal.style.display = 'none'; }

document.getElementById('htp-close').addEventListener('click', hideHowToPlay);
howToPlayModal.addEventListener('click', e => { if (e.target === howToPlayModal) hideHowToPlay(); });

const htpBtn = document.getElementById('howToPlayBtn');
if (htpBtn) htpBtn.addEventListener('click', showHowToPlay);

if (!sessionStorage.getItem('htp-seen')) {
  sessionStorage.setItem('htp-seen', '1');
  if (document.readyState !== 'loading') {
    setTimeout(showHowToPlay, 400);
  } else {
    window.addEventListener('DOMContentLoaded', () => setTimeout(showHowToPlay, 400));
  }
}


// ── ABOUT THE DEVELOPERS DROPDOWN ────────────────────────────
const aboutDropdown = document.createElement('div');
aboutDropdown.id = 'about-dropdown';
aboutDropdown.style.cssText = `
  position:fixed;bottom:18px;left:50%;transform:translateX(-50%);
  z-index:100000;font-family:Lora,serif;text-align:center;`;
aboutDropdown.innerHTML = `
  <button id="about-toggle" style="
    font-family:Lora,serif;font-style:italic;font-size:.8rem;
    background:rgba(255,255,255,0.75);color:#4a5c35;
    border:1.5px solid rgba(123,140,99,0.5);border-radius:20px;
    padding:5px 16px;cursor:pointer;letter-spacing:.04em;
    box-shadow:2px 2px 0 rgba(123,140,99,0.15);transition:background .2s;">✿ About the Developers ✿</button>
  <div id="about-panel" style="
    display:none;margin-top:8px;
    background:rgba(255,255,255,0.96);border:2px solid rgba(123,140,99,0.35);
    border-radius:14px;padding:16px 24px 14px;
    box-shadow:4px 4px 0 rgba(123,140,99,0.2);max-width:320px;text-align:center;">
    <div style="font-family:'Playfair Display',serif;font-style:italic;font-size:1rem;color:#4a5c35;margin-bottom:10px;">Made with 🌸 by</div>
    <div style="display:flex;gap:20px;justify-content:center;margin-bottom:12px;">
      <div style="display:flex;flex-direction:column;align-items:center;gap:3px;">
        <div style="font-size:.95rem;font-weight:600;color:#4a5c35;">Nishi</div>
        <div style="font-size:.7rem;color:#888;font-style:italic;background:rgba(211,155,160,0.2);border-radius:8px;padding:2px 8px;">Chemistry Major</div>
      </div>
      <div style="width:1px;background:rgba(123,140,99,0.2);"></div>
      <div style="display:flex;flex-direction:column;align-items:center;gap:3px;">
        <div style="font-size:.95rem;font-weight:600;color:#4a5c35;">Alicia</div>
        <div style="font-size:.7rem;color:#888;font-style:italic;background:rgba(213,205,230,0.3);border-radius:8px;padding:2px 8px;">Computer Science Major</div>
      </div>
    </div>
    <div style="font-size:.68rem;color:#aaa;font-style:italic;line-height:1.5;">A little garden game about flowers, dyes,<br>tea, and the magic of nature 🌿</div>
  </div>`;
document.body.appendChild(aboutDropdown);

document.getElementById('about-toggle').addEventListener('click', () => {
  const panel = document.getElementById('about-panel');
  panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
});


// ── SCREEN NAVIGATION ─────────────────────────────────────────
const screens = {
  menu:  document.getElementById('menuScreen'),
  index: document.getElementById('indexScreen'),
  game:  document.getElementById('gameScreen'),
};
let indexReturnScreen = 'menu';

function showScreen(name) {
  const cs = document.getElementById('completionScreen');
  if (cs) cs.style.display = 'none';
  Object.values(screens).forEach(s => s.classList.add('hidden'));
  screens[name].classList.remove('hidden');
  if (name === 'menu') { cancelAnimationFrame(animFrame); animFrame = null; }
  if (name === 'game' && animFrame === null) { gameLoop(); }
  if (aboutDropdown) aboutDropdown.style.display = name === 'menu' ? 'block' : 'none';
}

document.querySelectorAll('.js-index-btn').forEach(el =>
  el.addEventListener('click', () => {
    indexReturnScreen = screens.game.classList.contains('hidden') ? 'menu' : 'game';
    buildIndex();
    showScreen('index');
  })
);
document.getElementById('backFromIndex').addEventListener('click', () => {
  if (indexReturnScreen === 'completion') {
    // Hide all screens, then re-show the completion screen
    Object.values(screens).forEach(s => s.classList.add('hidden'));
    const cs = document.getElementById('completionScreen');
    if (cs) cs.style.display = 'flex';
  } else {
    showScreen(indexReturnScreen);
  }
});
document.getElementById('startBtn').addEventListener('click', () => { startGame(); showScreen('game'); });
document.getElementById('backFromGame').addEventListener('click', () => { cancelAnimationFrame(animFrame); animFrame = null; showScreen('menu'); });


// ── WORLD MAP ─────────────────────────────────────────────────
const WORLD_W = 3600, SCROLL_ZONE = 90, SCROLL_SPD = 4, PATH_RATIO = 0.32;
let cameraX = 0, mouseCX = 0, mouseCY = 0;

let COLLECTIBLES = [
  // FLOWERS
  { id: 'f0',  kind: 'flower',  img: 'flower0',       wx: 120,  wy: 0.08, collected: false },
  { id: 'f3',  kind: 'flower',  img: 'sunflower',     wx: 240,  wy: 0.80, collected: false },
  { id: 'f1',  kind: 'flower',  img: 'flower1',       wx: 420,  wy: 0.12, collected: false },
  { id: 'f4',  kind: 'flower',  img: 'gardenia',      wx: 560,  wy: 0.85, collected: false },
  { id: 'f2',  kind: 'flower',  img: 'flower2',       wx: 740,  wy: 0.06, collected: false },
  { id: 'f5',  kind: 'flower',  img: 'coreopsis',     wx: 880,  wy: 0.76, collected: false },
  { id: 'f6',  kind: 'flower',  img: 'flower3',       wx: 1060, wy: 0.20, collected: false },
  { id: 'f8',  kind: 'flower',  img: 'marigold',      wx: 1200, wy: 0.88, collected: false },
  { id: 'f7',  kind: 'flower',  img: 'flower4',       wx: 1380, wy: 0.10, collected: false },
  { id: 'f9',  kind: 'flower',  img: 'weld',          wx: 1500, wy: 0.72, collected: false },
  { id: 'f10', kind: 'flower',  img: 'flower5',       wx: 1680, wy: 0.24, collected: false },
  { id: 'f12', kind: 'flower',  img: 'blackscabiosa', wx: 1820, wy: 0.82, collected: false },
  { id: 'f11', kind: 'flower',  img: 'flower6',       wx: 1980, wy: 0.08, collected: false },
  { id: 'f13', kind: 'flower',  img: 'flower0',       wx: 2120, wy: 0.78, collected: false },
  { id: 'f14', kind: 'flower',  img: 'flower7',       wx: 2280, wy: 0.16, collected: false },
  { id: 'f19', kind: 'flower',  img: 'lavender',      wx: 2420, wy: 0.86, collected: false },
  { id: 'f15', kind: 'flower',  img: 'flower8',       wx: 2580, wy: 0.06, collected: false },
  { id: 'f16', kind: 'flower',  img: 'flower1',       wx: 2720, wy: 0.74, collected: false },
  { id: 'f18', kind: 'flower',  img: 'flower9',       wx: 2880, wy: 0.22, collected: false },
  { id: 'f20', kind: 'flower',  img: 'flower3',       wx: 3020, wy: 0.84, collected: false },
  { id: 'f22', kind: 'flower',  img: 'hibiscus',      wx: 3100, wy: 0.12, collected: false },
  { id: 'f17', kind: 'flower',  img: 'flower2',       wx: 3200, wy: 0.78, collected: false },
  { id: 'f21', kind: 'flower',  img: 'flower4',       wx: 3320, wy: 0.18, collected: false },
  { id: 'f23', kind: 'flower',  img: 'flower5',       wx: 3460, wy: 0.86, collected: false },

  // BUSHES
  { id: 'b0',  kind: 'bush',    img: 'bush1', wx: 200,  wy: 0.18, collected: false },
  { id: 'b1',  kind: 'bush',    img: 'bush2', wx: 480,  wy: 0.82, collected: false },
  { id: 'b2',  kind: 'bush',    img: 'bush3', wx: 760,  wy: 0.14, collected: false },
  { id: 'b3',  kind: 'bush',    img: 'bush4', wx: 1040, wy: 0.86, collected: false },
  { id: 'b4',  kind: 'bush',    img: 'bush1', wx: 1320, wy: 0.20, collected: false },
  { id: 'b5',  kind: 'bush',    img: 'bush2', wx: 1600, wy: 0.80, collected: false },
  { id: 'b6',  kind: 'bush',    img: 'bush3', wx: 1880, wy: 0.16, collected: false },
  { id: 'b7',  kind: 'bush',    img: 'bush4', wx: 2160, wy: 0.84, collected: false },
  { id: 'b8',  kind: 'bush',    img: 'bush1', wx: 2440, wy: 0.12, collected: false },
  { id: 'b9',  kind: 'bush',    img: 'bush2', wx: 2720, wy: 0.82, collected: false },
  { id: 'b10', kind: 'bush',    img: 'bush3', wx: 3000, wy: 0.18, collected: false },
  { id: 'b11', kind: 'bush',    img: 'bush4', wx: 3280, wy: 0.80, collected: false },

  // DESSERTS
  { id: 'd0',  kind: 'dessert', img: 'tiramisu',       wx: 160,  wy: 0.50, collected: false },
  { id: 'd1',  kind: 'dessert', img: 'cookies',        wx: 490,  wy: 0.44, collected: false },
  { id: 'd2',  kind: 'dessert', img: 'pudding',        wx: 820,  wy: 0.54, collected: false },
  { id: 'd3',  kind: 'dessert', img: 'macaron',        wx: 1150, wy: 0.46, collected: false },
  { id: 'd4',  kind: 'dessert', img: 'keylime',        wx: 1480, wy: 0.52, collected: false },
  { id: 'd5',  kind: 'dessert', img: 'eclair',         wx: 1810, wy: 0.44, collected: false },
  { id: 'd6',  kind: 'dessert', img: 'cinnamonroll',   wx: 2140, wy: 0.56, collected: false },
  { id: 'd7',  kind: 'dessert', img: 'cocostrawberry', wx: 2470, wy: 0.46, collected: false },
  { id: 'd8',  kind: 'dessert', img: 'cheesecake',     wx: 2800, wy: 0.54, collected: false },
  { id: 'd9',  kind: 'dessert', img: 'brownie',        wx: 3400, wy: 0.48, collected: false },
];

let gravelPebbles = [], grassTiles = [], dirtTiles = [];

function seedGravel(H) {
  gravelPebbles = [];
  const pt = H * ((1 - PATH_RATIO) / 2), ph = H * PATH_RATIO;
  for (let i = 0; i < 500; i++)
    gravelPebbles.push({ wx: Math.random() * WORLD_W, wy: pt + 4 + Math.random() * (ph - 8), rx: 1.2 + Math.random() * 2.5, ry: 0.7 + Math.random() * 1.5, rot: Math.random() * Math.PI, col: Math.random() < 0.5 ? '#b4a494' : '#cbbfaf' });
}
function seedGrassTiles(H) {
  grassTiles = [];
  const pt = H * ((1 - PATH_RATIO) / 2), pb = H * ((1 + PATH_RATIO) / 2);
  const cols = ['#9db89a', '#a8c4a4', '#91ae8e', '#b5ccb0', '#8aaa87', '#bdd4b8', '#96b293'];
  for (let x = 0; x < WORLD_W; x += 8) {
    for (let y = 0; y < pt; y += 8) if (Math.random() < 0.7) grassTiles.push({ x, y, col: cols[Math.floor(Math.random() * cols.length)] });
    for (let y = pb; y < H; y += 8) if (Math.random() < 0.7) grassTiles.push({ x, y, col: cols[Math.floor(Math.random() * cols.length)] });
  }
}
function seedDirtTiles(H) {
  dirtTiles = [];
  const pt = H * ((1 - PATH_RATIO) / 2), ph = H * PATH_RATIO;
  const cols = ['#c8b090', '#c0a882', '#d4bc9e', '#b89a78', '#cbb498', '#bca080'];
  for (let x = 0; x < WORLD_W; x += 8)
    for (let y = pt; y < pt + ph; y += 8)
      if (Math.random() < 0.65) dirtTiles.push({ x, y, col: cols[Math.floor(Math.random() * cols.length)] });
}

function startGame() {
  cancelAnimationFrame(animFrame); animFrame = null;
  cameraX = 0; discovered.clear();
  COLLECTIBLES.forEach(c => c.collected = false);
  requestAnimationFrame(() => {
    const canvas = document.getElementById('gameCanvas');
    canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight;
    mouseCX = canvas.width / 2; mouseCY = canvas.height / 2;
    seedGravel(canvas.height); seedGrassTiles(canvas.height); seedDirtTiles(canvas.height);
    gameLoop();
  });
}

document.getElementById('gameCanvas').addEventListener('mousemove', e => {
  const r = document.getElementById('gameCanvas').getBoundingClientRect();
  mouseCX = e.clientX - r.left; mouseCY = e.clientY - r.top;
});

document.getElementById('gameCanvas').addEventListener('click', e => {
  const canvas = document.getElementById('gameCanvas');
  const r = canvas.getBoundingClientRect();
  const cx = e.clientX - r.left + cameraX, cy = e.clientY - r.top, H = canvas.height;
  for (const obj of COLLECTIBLES) {
    if (obj.collected) continue;
    const wy = obj.wy * H, dist = Math.hypot(cx - obj.wx, cy - wy);
    if (dist < (obj.kind === 'bush' ? 32 : 26)) {
      obj.collected = true;
      spawnBurst(e.clientX, e.clientY, obj.kind);
      if (obj.kind === 'flower' && SPARKLE_FLOWERS.has(obj.img)) {
        const entry = FLOWER_BY_IMGKEY[obj.img]; if (entry) discovered.add(entry.id);
        showCollectCard(obj.img, 'flower');
      } else if (obj.kind === 'dessert') {
        showCollectCard(obj.img, 'dessert');
      }
      if (COLLECTIBLES.every(c => c.collected)) { setTimeout(showCompletionScreen, 800); }
      break;
    }
  }
});

function gameLoop() {
  const canvas = document.getElementById('gameCanvas');
  if (!canvas) return;
  if (screens.game.classList.contains('hidden')) { animFrame = requestAnimationFrame(gameLoop); return; }

  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  if (W === 0 || H === 0) { animFrame = requestAnimationFrame(gameLoop); return; }

  const t = Date.now() / 1000, maxCam = WORLD_W - W;
  if (mouseCX < SCROLL_ZONE && mouseCX > 0)   cameraX = Math.max(0,      cameraX - SCROLL_SPD * (1 - mouseCX / SCROLL_ZONE) * 2.5);
  if (mouseCX > W - SCROLL_ZONE && mouseCX < W) cameraX = Math.min(maxCam, cameraX + SCROLL_SPD * (1 - (W - mouseCX) / SCROLL_ZONE) * 2.5);

  const pathH = H * PATH_RATIO, pathTop = (H - pathH) / 2, pathBot = pathTop + pathH;
  const visL = cameraX - 8, visR = cameraX + W + 8;

  ctx.clearRect(0, 0, W, H);
  ctx.save(); ctx.translate(-cameraX, 0);

  ctx.fillStyle = '#9db89a';
  ctx.fillRect(0, 0, WORLD_W, pathTop);
  ctx.fillRect(0, pathBot, WORLD_W, H - pathBot);

  for (const t2 of grassTiles) {
    if (t2.x + 8 < visL || t2.x > visR) continue;
    ctx.fillStyle = t2.col; ctx.fillRect(t2.x, t2.y, 8, 8);
  }
  ctx.strokeStyle = 'rgba(70,100,60,0.28)'; ctx.lineWidth = 1;
  for (let gx = 4; gx < WORLD_W; gx += 14) {
    if (gx < visL || gx > visR) continue;
    const sw = Math.sin(t * 0.9 + gx * 0.04) * 2.5;
    ctx.beginPath(); ctx.moveTo(gx, pathTop * 0.85); ctx.lineTo(gx + sw, pathTop * 0.45); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(gx, pathBot + (H - pathBot) * 0.15); ctx.lineTo(gx + sw, pathBot + (H - pathBot) * 0.55); ctx.stroke();
  }

  ctx.fillStyle = '#c8b090'; ctx.fillRect(0, pathTop, WORLD_W, pathH);
  for (const t2 of dirtTiles) {
    if (t2.x + 8 < visL || t2.x > visR) continue;
    ctx.fillStyle = t2.col; ctx.fillRect(t2.x, t2.y, 8, 8);
  }
  const dg = ctx.createLinearGradient(0, pathTop, 0, pathBot);
  dg.addColorStop(0, 'rgba(140,110,75,0.30)'); dg.addColorStop(0.5, 'rgba(140,110,75,0.06)'); dg.addColorStop(1, 'rgba(140,110,75,0.30)');
  ctx.fillStyle = dg; ctx.fillRect(0, pathTop, WORLD_W, pathH);
  for (const p of gravelPebbles) {
    if (p.wx < visL || p.wx > visR) continue;
    ctx.fillStyle = p.col; ctx.beginPath(); ctx.ellipse(p.wx, p.wy, p.rx, p.ry, p.rot, 0, Math.PI * 2); ctx.fill();
  }
  ctx.strokeStyle = 'rgba(120,95,65,0.55)'; ctx.lineWidth = 2; ctx.setLineDash([6, 6]);
  ctx.beginPath(); ctx.moveTo(0, pathTop); ctx.lineTo(WORLD_W, pathTop); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0, pathBot); ctx.lineTo(WORLD_W, pathBot); ctx.stroke();
  ctx.setLineDash([]);

  for (const obj of COLLECTIBLES) {
    const wy = obj.wy * H;
    if (obj.collected) { drawCollected(ctx, obj.wx, wy, t); continue; }
    const dist = Math.hypot((mouseCX + cameraX) - obj.wx, mouseCY - wy);
    const hover = dist < (obj.kind === 'bush' ? 44 : 38);
    switch (obj.kind) {
      case 'flower':  drawFlowerSpot(ctx, obj.wx, wy, obj.img, t, hover); break;
      case 'bush':    drawBushSpot(ctx, obj.wx, wy, obj.img, hover);       break;
      case 'dessert': drawDessert(ctx, obj.wx, wy, obj.img, hover);        break;
    }
  }

  ctx.fillStyle = 'rgba(100,120,80,0.18)';
  ctx.fillRect(0, 0, 40, H);
  ctx.fillRect(WORLD_W - 40, 0, 40, H);
  ctx.restore();

  if (cameraX > 10)         drawArrow(ctx, 22, H / 2, 'left');
  if (cameraX < maxCam - 10) drawArrow(ctx, W - 22, H / 2, 'right');

  const prog = maxCam > 0 ? cameraX / maxCam : 0;
  ctx.fillStyle = 'rgba(0,0,0,0.10)'; ctx.beginPath(); ctx.roundRect(W / 2 - 70, H - 14, 140, 7, 4); ctx.fill();
  ctx.fillStyle = 'rgba(123,140,99,0.75)'; ctx.beginPath(); ctx.roundRect(W / 2 - 70, H - 14, 140 * prog, 7, 4); ctx.fill();

  const done = COLLECTIBLES.filter(c => c.collected).length;
  ctx.fillStyle = 'rgba(255,255,255,0.75)'; ctx.beginPath(); ctx.roundRect(W - 110, 10, 100, 28, 8); ctx.fill();
  ctx.fillStyle = '#4a5c35'; ctx.font = 'italic 12px Lora,serif'; ctx.textAlign = 'right';
  ctx.fillText(`${done} / ${COLLECTIBLES.length} found`, W - 14, 29);

  animFrame = requestAnimationFrame(gameLoop);
}


// ── DRAW HELPERS ──────────────────────────────────────────────
function drawSparkles(ctx, cx, cy, t, phase) {
  ctx.save();
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 + t * 0.55 + phase, d = 15 + Math.sin(t * 2.2 + i * 0.9) * 7;
    const px = Math.round(cx + Math.cos(a) * d), py = Math.round(cy + Math.sin(a) * d);
    const alpha = (Math.sin(t * 3.0 + i + phase) + 1) / 2;
    ctx.globalAlpha = alpha * 0.85;
    ctx.fillStyle = '#ffffff'; ctx.fillRect(px - 1, py, 3, 1); ctx.fillRect(px, py - 1, 1, 3);
    ctx.fillStyle = '#FFE566'; ctx.fillRect(px, py, 1, 1);
  }
  ctx.restore();
}
function hoverGlow(ctx, wx, wy, r, col) {
  ctx.save(); ctx.globalAlpha = 0.22; ctx.fillStyle = col;
  ctx.beginPath(); ctx.arc(wx, wy, r + 10, 0, Math.PI * 2); ctx.fill(); ctx.restore();
}
function drawCollected(ctx, wx, wy, t) {
  ctx.save(); ctx.globalAlpha = 0.45;
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2 + t * 1.2, r = 10 + Math.sin(t * 2 + i) * 3;
    ctx.fillStyle = '#E0B451'; ctx.beginPath(); ctx.arc(wx + Math.cos(a) * r, wy + Math.sin(a) * r, 2, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 0.6; ctx.fillStyle = '#4a5c35'; ctx.font = '10px Lora,serif'; ctx.textAlign = 'center';
  ctx.fillText('✓', wx, wy + 4); ctx.restore();
}
function drawFlowerSpot(ctx, wx, wy, imgKey, t, hover) {
  ctx.save();
  if (hover) hoverGlow(ctx, wx, wy, 26, '#D5CDE6');
  if (!drawImgCentered(ctx, imgKey, wx, wy - 2, 44)) {
    ctx.strokeStyle = 'rgba(100,130,70,0.5)'; ctx.lineWidth = 2; ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(wx, wy + 22); ctx.lineTo(wx, wy - 2); ctx.stroke(); ctx.setLineDash([]);
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2;
      ctx.fillStyle = 'rgba(213,205,230,0.55)'; ctx.beginPath(); ctx.ellipse(wx + Math.cos(a) * 9, wy - 2 + Math.sin(a) * 9, 6, 10, a, 0, Math.PI * 2); ctx.fill();
    }
    ctx.fillStyle = 'rgba(224,180,81,0.6)'; ctx.beginPath(); ctx.arc(wx, wy - 2, 5, 0, Math.PI * 2); ctx.fill();
  }
  if (SPARKLE_FLOWERS.has(imgKey)) drawSparkles(ctx, wx, wy - 2, t, (wx * 0.013) % (Math.PI * 2));
  ctx.restore();
}
function drawBushSpot(ctx, wx, wy, imgKey, hover) {
  ctx.save();
  if (hover) hoverGlow(ctx, wx, wy, 30, '#9db89a');
  if (!drawImgCentered(ctx, imgKey, wx, wy, 56)) {
    [[-16, 6], [16, 6], [0, -6]].forEach(([ox, oy], i) => {
      ctx.fillStyle = ['rgba(110,148,85,0.45)', 'rgba(88,124,65,0.40)', 'rgba(130,162,100,0.42)'][i];
      ctx.beginPath(); ctx.arc(wx + ox, wy + oy, 22, 0, Math.PI * 2); ctx.fill();
    });
  }
  ctx.restore();
}
function drawDessert(ctx, wx, wy, imgKey, hover) {
  ctx.save();
  if (hover) hoverGlow(ctx, wx, wy, 24, '#f5d5b0');
  if (!drawImgCentered(ctx, imgKey, wx, wy, 42)) {
    ctx.fillStyle = '#e8d4c0'; ctx.beginPath(); ctx.arc(wx, wy, 18, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#c0a080'; ctx.lineWidth = 1.5; ctx.stroke();
  }
  ctx.restore();
}
function drawArrow(ctx, x, y, dir) {
  ctx.save(); ctx.fillStyle = 'rgba(100,125,75,0.6)'; ctx.beginPath();
  const s = 11;
  if (dir === 'left')  { ctx.moveTo(x + s, y - s); ctx.lineTo(x - s, y); ctx.lineTo(x + s, y + s); }
  else                 { ctx.moveTo(x - s, y - s); ctx.lineTo(x + s, y); ctx.lineTo(x - s, y + s); }
  ctx.closePath(); ctx.fill(); ctx.restore();
}
function spawnBurst(x, y, kind) {
  const col = { flower: '#D5CDE6', bush: '#b5ccb0', dessert: '#f5d5b0' }[kind] || '#E0B451';
  for (let i = 0; i < 10; i++) {
    const p = document.createElement('div');
    p.className = 'pollen-burst';
    const angle = (i / 10) * Math.PI * 2, dist = 28 + Math.random() * 22;
    p.style.cssText = `left:${x - 4}px;top:${y - 4}px;background:${col};`;
    document.body.appendChild(p);
    requestAnimationFrame(() => {
      p.style.transform = `translate(${Math.cos(angle) * dist}px,${Math.sin(angle) * dist}px) scale(.2)`;
      p.style.opacity = '0';
    });
    p.addEventListener('transitionend', () => p.remove(), { once: true });
  }
}


// ── VINE TOOLTIPS ─────────────────────────────────────────────
const vineFlowerData = {
  'flower-wisteria':   { name: 'Wisteria',    fact: 'Produces soft lilac dyes and was historically woven into garlands.' },
  'flower-foxglove':   { name: 'Foxglove',    fact: 'Source of digitalis, a powerful heart medicine. Not edible!' },
  'flower-lilac':      { name: 'Lilac',        fact: 'Used in perfumery and produces light purple dyes.' },
  'flower-blush':      { name: 'Blush Peony',  fact: 'Petals are edible and used in teas and floral salads.' },
  'flower-cornflower': { name: 'Cornflower',   fact: 'Produces a vivid blue dye and petals are edible in salads.' },
};
const tt = document.createElement('div');
tt.id = 'vine-tooltip';
tt.style.cssText = 'position:fixed;z-index:99998;background:rgba(255,255,255,.92);border:2px solid var(--deep-sage);border-radius:10px;padding:6px 12px;font-family:Lora,serif;font-size:.78rem;color:var(--deep-sage);pointer-events:none;opacity:0;transition:opacity .2s;max-width:160px;line-height:1.4;box-shadow:2px 3px 0 rgba(123,140,99,.25);';
document.body.appendChild(tt);

document.querySelectorAll('.pixel-flower').forEach(el => {
  const cls = [...el.classList].find(c => vineFlowerData[c]);
  if (!cls) return;
  const { name, fact } = vineFlowerData[cls];
  el.addEventListener('mouseenter', e => { tt.innerHTML = `<strong>${name}</strong><br>${fact}`; tt.style.opacity = '1'; positionTooltip(e); });
  el.addEventListener('mousemove', positionTooltip);
  el.addEventListener('mouseleave', () => tt.style.opacity = '0');
});
function positionTooltip(e) {
  tt.style.left = Math.min(e.clientX + 24, window.innerWidth - tt.offsetWidth - 10) + 'px';
  tt.style.top  = Math.max(10, Math.min(e.clientY - 10, window.innerHeight - tt.offsetHeight - 10)) + 'px';
}


// ── UTILITIES ─────────────────────────────────────────────────
function checkPollinatorCollision(x, y) {
  for (const f of document.querySelectorAll('.pixel-flower')) {
    const r = f.getBoundingClientRect();
    if (x >= r.left - 16 && x <= r.right + 16 && y >= r.top - 16 && y <= r.bottom + 16) return f;
  }
  return null;
}
window.checkPollinatorCollision = checkPollinatorCollision;

function triggerPollinationEffect(flowerEl) {
  const rect = flowerEl.getBoundingClientRect();
  const ox = rect.left + rect.width / 2, oy = rect.top + rect.height / 2;
  for (let i = 0; i < 8; i++) {
    const p = document.createElement('div'), a = (i / 8) * Math.PI * 2, d = 28 + Math.random() * 20;
    p.style.cssText = `position:fixed;left:${ox - 4}px;top:${oy - 4}px;width:8px;height:8px;background:var(--pollen);border-radius:50%;pointer-events:none;z-index:99997;transition:transform .6s ease-out,opacity .6s ease-out;`;
    document.body.appendChild(p);
    requestAnimationFrame(() => { p.style.transform = `translate(${Math.cos(a) * d}px,${Math.sin(a) * d}px) scale(.3)`; p.style.opacity = '0'; });
    p.addEventListener('transitionend', () => p.remove(), { once: true });
  }
}
window.triggerPollinationEffect = triggerPollinationEffect;
