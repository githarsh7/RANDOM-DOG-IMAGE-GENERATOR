const funFacts = [
  "Dogs have a sense of time — they can tell how long you've been gone.",
  "A dog's nose print is as unique as a human fingerprint.",
  "Dogs can learn over 1,000 words and commands.",
  "Dalmatians are born completely white — their spots appear later.",
  "Dogs dream just like humans do, often about their owners.",
  "A dog's hearing is 4× more powerful than a human's.",
  "Greyhounds can run up to 72 km/h — faster than most horses.",
  "Dogs have three eyelids — the third keeps the eye moist.",
  "The Basenji is the only dog that cannot bark — it yodels.",
  "Dogs sweat through their paws, not their skin.",
];

let fetchCount = 0;

/* Floating paw spawner */
const PAW_SVG = `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="40" cy="52" rx="16" ry="13" fill="#E07B00"/>
  <ellipse cx="22" cy="36" rx="8"  ry="10" fill="#E07B00"/>
  <ellipse cx="58" cy="36" rx="8"  ry="10" fill="#E07B00"/>
  <ellipse cx="30" cy="26" rx="6.5" ry="8" fill="#E07B00"/>
  <ellipse cx="50" cy="26" rx="6.5" ry="8" fill="#E07B00"/>
</svg>`;

function spawnPaw() {
  const el = document.createElement('div');
  el.className = 'paw-float';

  const size     = 28 + Math.random() * 36;       // 28–64px
  const startX   = Math.random() * 100;            // % across screen
  const duration = 7 + Math.random() * 10;         // 7–17s
  const delay    = Math.random() * 6;              // stagger start

  el.style.cssText = `
    left: ${startX}vw;
    bottom: -80px;
    width: ${size}px;
    height: ${size}px;
    animation-duration: ${duration}s;
    animation-delay: ${delay}s;
  `;
  el.innerHTML = PAW_SVG;
  document.body.appendChild(el);

  // Remove from DOM after animation ends to keep things clean
  el.addEventListener('animationend', () => el.remove(), { once: true });
}

// Spawn a new paw every 900ms
setInterval(spawnPaw, 900);

/* Fun fact rotator */
document.getElementById('funFactText').style.transition = 'opacity 0.3s ease';

function rotateFunFact() {
  const el   = document.getElementById('funFactText');
  const next = funFacts[Math.floor(Math.random() * funFacts.length)];
  el.style.opacity = '0';
  setTimeout(() => { el.textContent = next; el.style.opacity = '1'; }, 300);
}

/* Main fetch */
async function getDog() {
  const btn        = document.getElementById('fetchBtn');
  const img        = document.getElementById('dogImg');
  const stateEmpty = document.getElementById('stateEmpty');
  const stateLoad  = document.getElementById('stateLoading');
  const badge      = document.getElementById('breedBadge');
  const badgeName  = document.getElementById('badgeName');
  const countEl    = document.getElementById('fetchCount');

  btn.disabled      = true;
  btn.textContent   = 'Fetching…';
  stateEmpty.hidden = true;
  img.hidden        = true;
  img.style.opacity = '0';
  stateLoad.hidden  = false;
  badge.hidden      = true;

  try {
    const res  = await fetch('https://dog.ceo/api/breeds/image/random');
    const data = await res.json();

    const match = data.message.match(/breeds\/([^/]+)\//);
    const breed = match ? match[1].replace(/-/g, ' ') : 'mystery dog';

    img.src    = data.message;
    img.hidden = false;

    img.onload = () => {
      stateLoad.hidden  = false;
      stateLoad.hidden  = true;
      img.style.opacity = '1';

      badgeName.textContent = breed;
      badge.hidden          = false;

      fetchCount++;
      countEl.textContent = fetchCount;

      btn.disabled  = false;
      btn.innerHTML = `<span class="fetch-btn-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span> Fetch another`;

      rotateFunFact();
    };

  } catch (err) {
    stateLoad.hidden  = true;
    stateEmpty.hidden = false;
    stateEmpty.querySelector('.empty-text').textContent = 'Failed to fetch. Try again!';
    btn.disabled  = false;
    btn.innerHTML = `<span class="fetch-btn-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span> Fetch a dog`;
    console.error(err);
  }
}

getDog();
