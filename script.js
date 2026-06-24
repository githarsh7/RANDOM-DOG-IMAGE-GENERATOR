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

/* Falling blood drop spawner */
const DROP_SVG = `<svg viewBox="0 0 20 28" xmlns="http://www.w3.org/2000/svg">
  <path d="M10 2 Q16 10 16 18 A6 6 0 0 1 4 18 Q4 10 10 2Z" fill="#8B0000"/>
</svg>`;

function spawnDrop() {
  const el     = document.createElement('div');
  el.className = 'drop-float';
  const size   = 10 + Math.random() * 18;
  const x      = Math.random() * 100;
  const dur    = 6 + Math.random() * 10;
  const delay  = Math.random() * 5;
  el.style.cssText = `
    left: ${x}vw; top: -40px;
    width: ${size}px; height: ${size * 1.4}px;
    animation-duration: ${dur}s;
    animation-delay: ${delay}s;
  `;
  el.innerHTML = DROP_SVG;
  document.body.appendChild(el);
  el.addEventListener('animationend', () => el.remove(), { once: true });
}

setInterval(spawnDrop, 1100);

/* Fun fact rotator */
function rotateFunFact() {
  const el   = document.getElementById('funFactText');
  const next = funFacts[Math.floor(Math.random() * funFacts.length)];
  el.style.opacity = '0';
  setTimeout(() => { el.textContent = next; el.style.opacity = '1'; }, 300);
}

const FETCH_ICON = `FETCH A DOG <span class="btn-arrow">→</span>`;

async function getDog() {
  const btn        = document.getElementById('fetchBtn');
  const img        = document.getElementById('dogImg');
  const stateEmpty = document.getElementById('stateEmpty');
  const stateLoad  = document.getElementById('stateLoading');
  const badge      = document.getElementById('breedBadge');
  const badgeName  = document.getElementById('badgeName');
  const countEl    = document.getElementById('fetchCount');

  btn.disabled      = true;
  btn.innerHTML     = `FETCHING... <span class="btn-arrow">...</span>`;
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
      countEl.textContent   = String(fetchCount).padStart(2, '0');
      btn.disabled          = false;
      btn.innerHTML         = `FETCH ANOTHER <span class="btn-arrow">→</span>`;
      rotateFunFact();
    };

    img.onerror = () => {
      stateLoad.hidden  = true;
      stateEmpty.hidden = false;
      stateEmpty.querySelector('.empty-text').textContent = 'FAILED TO LOAD.\nTRY AGAIN.';
      btn.disabled  = false;
      btn.innerHTML = FETCH_ICON;
    };

  } catch (err) {
    stateLoad.hidden  = true;
    stateEmpty.hidden = false;
    stateEmpty.querySelector('.empty-text').textContent = 'NETWORK ERROR.\nTRY AGAIN.';
    btn.disabled  = false;
    btn.innerHTML = FETCH_ICON;
    console.error(err);
  }
}

getDog();
