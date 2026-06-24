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

let fetchCount  = 0;
const recentDogs = []; // { url, breed }

function rotateFact() {
  const el   = document.getElementById('factText');
  const next = funFacts[Math.floor(Math.random() * funFacts.length)];
  el.style.opacity = '0';
  setTimeout(() => { el.textContent = next; el.style.opacity = '1'; }, 300);
}
document.getElementById('factText').style.transition = 'opacity 0.3s ease';

function updateThumbs() {
  const container = document.getElementById('thumbCards');
  container.innerHTML = '';

  const slots = 3;
  for (let i = 0; i < slots; i++) {
    const card = document.createElement('div');
    card.className = 'thumb-card';

    const dog = recentDogs[recentDogs.length - 1 - i];
    if (dog) {
      const img = document.createElement('img');
      img.className = 'thumb-img';
      img.src = dog.url;
      img.alt = dog.breed;

      const info = document.createElement('div');
      info.className = 'thumb-info';
      info.innerHTML = `
        <div class="thumb-breed">${dog.breed}</div>
        <div class="thumb-tag">FETCHED</div>
      `;
      card.appendChild(img);
      card.appendChild(info);
    } else {
      const ph = document.createElement('div');
      ph.className = 'thumb-placeholder';
      const info = document.createElement('div');
      info.className = 'thumb-info';
      info.innerHTML = `
        <div class="thumb-breed">—</div>
        <div class="thumb-tag">FETCH ONE</div>
      `;
      card.appendChild(ph);
      card.appendChild(info);
    }
    container.appendChild(card);
  }
}

const BTN_ICON = `<svg class="btn-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10h12M11 5l5 5-5 5"/></svg>`;

async function getDog() {
  const btn      = document.getElementById('fetchBtn');
  const img      = document.getElementById('heroImg');
  const empty    = document.getElementById('imgEmpty');
  const loader   = document.getElementById('imgLoader');
  const pill     = document.getElementById('breedPill');
  const breedEl  = document.getElementById('breedName');
  const countEl  = document.getElementById('fetchCount');

  btn.disabled = true;
  btn.innerHTML = `<span>Fetching...</span> ${BTN_ICON}`;

  empty.hidden  = true;
  img.hidden    = true;
  img.style.opacity = '0';
  loader.hidden = false;
  pill.hidden   = true;

  try {
    const res  = await fetch('https://dog.ceo/api/breeds/image/random');
    const data = await res.json();

    const match = data.message.match(/breeds\/([^/]+)\//);
    const breed = match ? match[1].replace(/-/g, ' ') : 'mystery dog';

    img.src    = data.message;
    img.hidden = false;

    img.onload = () => {
      loader.hidden     = true;
      img.style.opacity = '1';

      breedEl.textContent = breed;
      pill.hidden         = false;

      fetchCount++;
      countEl.textContent = fetchCount;

      // Store for thumbnails (max 3)
      recentDogs.push({ url: data.message, breed });
      if (recentDogs.length > 3) recentDogs.shift();
      updateThumbs();

      btn.disabled  = false;
      btn.innerHTML = `<span>Fetch Another</span> ${BTN_ICON}`;
      rotateFact();
    };

    img.onerror = () => {
      loader.hidden = true;
      empty.hidden  = false;
      empty.querySelector('p').textContent = 'Failed to load.\nTry again.';
      btn.disabled  = false;
      btn.innerHTML = `<span>Fetch a Dog</span> ${BTN_ICON}`;
    };

  } catch (err) {
    loader.hidden = true;
    empty.hidden  = false;
    empty.querySelector('p').textContent = 'Network error.\nTry again.';
    btn.disabled  = false;
    btn.innerHTML = `<span>Fetch a Dog</span> ${BTN_ICON}`;
    console.error(err);
  }
}

getDog();
