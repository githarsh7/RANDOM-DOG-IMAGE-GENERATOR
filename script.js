const funFacts = [
  "DOGS HAVE A SENSE OF TIME — THEY CAN TELL HOW LONG YOU'VE BEEN GONE.",
  "A DOG'S NOSE PRINT IS AS UNIQUE AS A HUMAN FINGERPRINT.",
  "DOGS CAN LEARN OVER 1,000 WORDS AND COMMANDS.",
  "DALMATIANS ARE BORN COMPLETELY WHITE — THEIR SPOTS APPEAR LATER.",
  "DOGS DREAM JUST LIKE HUMANS DO, OFTEN ABOUT THEIR OWNERS.",
  "A DOG'S HEARING IS 4X MORE POWERFUL THAN A HUMAN'S.",
  "GREYHOUNDS CAN RUN UP TO 72 KM/H — FASTER THAN MOST HORSES.",
  "DOGS HAVE THREE EYELIDS — THE THIRD KEEPS THE EYE MOIST.",
  "THE BASENJI IS THE ONLY DOG THAT CANNOT BARK — IT YODELS.",
  "DOGS SWEAT THROUGH THEIR PAWS, NOT THEIR SKIN.",
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
  const el       = document.createElement('div');
  el.className   = 'paw-float';
  const size     = 28 + Math.random() * 36;
  const startX   = Math.random() * 100;
  const duration = 7 + Math.random() * 10;
  const delay    = Math.random() * 6;

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
  el.addEventListener('animationend', () => el.remove(), { once: true });
}

setInterval(spawnPaw, 900);

/* Fun fact rotator */
document.getElementById('funFactText').style.transition = 'opacity 0.3s ease';

function rotateFunFact() {
  const el   = document.getElementById('funFactText');
  const next = funFacts[Math.floor(Math.random() * funFacts.length)];
  el.style.opacity = '0';
  setTimeout(() => { el.textContent = next; el.style.opacity = '1'; }, 300);
}

const FETCH_ICON = `<span class="fetch-btn-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>`;

async function getDog() {
  const btn        = document.getElementById('fetchBtn');
  const img        = document.getElementById('dogImg');
  const stateEmpty = document.getElementById('stateEmpty');
  const stateLoad  = document.getElementById('stateLoading');
  const badge      = document.getElementById('breedBadge');
  const badgeName  = document.getElementById('badgeName');
  const countEl    = document.getElementById('fetchCount');

  btn.disabled      = true;
  btn.innerHTML     = `${FETCH_ICON} FETCHING...`;
  stateEmpty.hidden = true;
  img.hidden        = true;
  img.style.opacity = '0';
  stateLoad.hidden  = false;
  badge.hidden      = true;

  try {
    const res  = await fetch('https://dog.ceo/api/breeds/image/random');
    const data = await res.json();

    const match = data.message.match(/breeds\/([^/]+)\//);
    const breed = match ? match[1].replace(/-/g, ' ').toUpperCase() : 'MYSTERY DOG';

    img.src    = data.message;
    img.hidden = false;

    img.onload = () => {
      stateLoad.hidden  = true;
      img.style.opacity = '1';

      badgeName.textContent = breed;
      badge.hidden          = false;

      fetchCount++;
      countEl.textContent = fetchCount;

      btn.disabled  = false;
      btn.innerHTML = `${FETCH_ICON} FETCH ANOTHER`;

      rotateFunFact();
    };

    img.onerror = () => {
      stateLoad.hidden  = true;
      stateEmpty.hidden = false;
      stateEmpty.querySelector('.empty-text').textContent = 'FAILED TO LOAD. TRY AGAIN!';
      btn.disabled  = false;
      btn.innerHTML = `${FETCH_ICON} FETCH A DOG`;
    };

  } catch (err) {
    stateLoad.hidden  = true;
    stateEmpty.hidden = false;
    stateEmpty.querySelector('.empty-text').textContent = 'FAILED TO FETCH. TRY AGAIN!';
    btn.disabled  = false;
    btn.innerHTML = `${FETCH_ICON} FETCH A DOG`;
    console.error(err);
  }
}

getDog();
