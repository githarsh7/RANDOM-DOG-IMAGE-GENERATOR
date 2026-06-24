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

function rotateFunFact() {
  const el = document.getElementById('funFactText');
  const next = funFacts[Math.floor(Math.random() * funFacts.length)];
  el.style.opacity = '0';
  setTimeout(() => { el.textContent = next; el.style.opacity = '1'; }, 300);
}

document.getElementById('funFactText').style.transition = 'opacity 0.3s ease';

async function getDog() {
  const btn        = document.getElementById('fetchBtn');
  const img        = document.getElementById('dogImg');
  const stateEmpty = document.getElementById('stateEmpty');
  const stateLoad  = document.getElementById('stateLoading');
  const badge      = document.getElementById('breedBadge');
  const badgeName  = document.getElementById('badgeName');
  const countEl    = document.getElementById('fetchCount');

  // UI → loading
  btn.disabled = true;
  btn.textContent = 'Fetching…';
  stateEmpty.hidden = true;
  img.hidden = true;
  img.style.opacity = '0';
  stateLoad.hidden = false;
  badge.hidden = true;

  try {
    const res  = await fetch('https://dog.ceo/api/breeds/image/random');
    const data = await res.json();

    const match = data.message.match(/breeds\/([^/]+)\//);
    const breed = match
      ? match[1].replace(/-/g, ' ')
      : 'mystery dog';

    img.src    = data.message;
    img.hidden = false;

    img.onload = () => {
      stateLoad.hidden = true;
      img.style.opacity = '1';

      badgeName.textContent = breed;
      badge.hidden = false;

      fetchCount++;
      countEl.textContent = fetchCount;

      btn.disabled    = false;
      btn.innerHTML   = `<span class="fetch-btn-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span> Fetch another`;

      rotateFunFact();
    };

  } catch (err) {
    stateLoad.hidden = true;
    stateEmpty.hidden = false;
    stateEmpty.querySelector('.empty-text').textContent = 'Failed to fetch. Try again!';
    btn.disabled  = false;
    btn.innerHTML = `<span class="fetch-btn-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span> Fetch a dog`;
    console.error(err);
  }
}

getDog();
