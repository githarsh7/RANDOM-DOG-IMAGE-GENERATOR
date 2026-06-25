/* ── STATE ── */
let count    = 0;
let lastFact = -1;
let busy     = false;

/* ── DOG FACTS ── */
const FACTS = [
  "A dog's nose print is as unique as a human fingerprint.",
  "Dogs can hear up to 65,000 Hz — 3× the human range.",
  "Dalmatians are born white; their spots develop over weeks.",
  "The Basenji is the only breed that yodels instead of barking.",
  "Dogs dream during REM sleep, often replaying their day.",
  "A dog's sense of smell is up to 100,000× more acute than ours.",
  "Three dogs survived the Titanic sinking.",
  "Greyhounds can sustain 72 km/h for over 7 kilometres.",
  "Dogs sweat through their paw pads, not their skin.",
  "The oldest dog on record lived 29 years and 5 months.",
  "Dogs can detect certain cancers with up to 97% accuracy.",
  "Border Collies are widely considered the most intelligent breed.",
  "Bloodhounds can follow a scent trail over 300 hours old.",
  "Chow Chows and Shar-Peis are the only breeds with black-blue tongues.",
  "Dogs have three eyelids — the third keeps the eye moist.",
  "Puppies are born blind, deaf, and toothless.",
  "A dog's heart beats 60–140 bpm depending on size.",
  "Dogs have ~1,700 taste buds; humans have ~9,000.",
  "A dog's whiskers help them sense changes in airflow.",
  "Dogs can recognise their owner's face in a photograph.",
];

/* ── ELEMENT REFS ── */
const fetchBtn  = document.getElementById('fetchBtn');
const btnTxt    = document.getElementById('btnTxt');
const dogImg    = document.getElementById('dogImg');
const emptyState= document.getElementById('emptyState');
const spinRing  = document.getElementById('spinRing');
const emptyTxt  = document.getElementById('emptyTxt');
const badgeBreed= document.getElementById('badgeBreed');
const factSlant = document.getElementById('factSlant');
const stampCount= document.getElementById('stampCount');
const breedVal  = document.getElementById('breedVal');
const countChip = document.getElementById('countChip');
const stampN    = document.getElementById('stampN');
const factTxt   = document.getElementById('factTxt');

/* ── HELPERS ── */

/** Fade out → swap text → fade in */
function nextFact() {
  factTxt.classList.add('fade');
  setTimeout(() => {
    let i;
    do { i = Math.floor(Math.random() * FACTS.length); } while (i === lastFact);
    lastFact = i;
    factTxt.textContent = FACTS[i];
    factTxt.classList.remove('fade');
  }, 240);
}

/** Animate count chip with a quick pop */
function bumpCount(n) {
  countChip.textContent = n;
  stampN.textContent    = n;
  countChip.animate(
    [{ transform: 'scale(1)' }, { transform: 'scale(1.4)' }, { transform: 'scale(1)' }],
    { duration: 320, easing: 'ease-out' }
  );
}

/** Show the three overlay cards with staggered delays */
function showCards() {
  setTimeout(() => badgeBreed.classList.add('show'),  80);
  setTimeout(() => factSlant.classList.add('show'),  160);
  setTimeout(() => stampCount.classList.add('show'), 240);
}

/** Hide all overlay cards instantly (before next fetch) */
function hideCards() {
  badgeBreed.classList.remove('show');
  factSlant.classList.remove('show');
  stampCount.classList.remove('show');
}

/** Enter loading state */
function setLoading() {
  dogImg.classList.remove('show');
  hideCards();
  emptyState.classList.remove('gone');
  spinRing.style.display = 'block';
  emptyTxt.textContent   = 'Finding a good boy…';
  fetchBtn.disabled      = true;
  btnTxt.textContent     = 'Fetching…';
}

/** Enter error / idle state */
function setError() {
  spinRing.style.display = 'none';
  emptyTxt.textContent   = 'Awaiting fetch';
  fetchBtn.disabled      = false;
  btnTxt.textContent     = 'Try Again';
  busy = false;
}

/* ── MAIN FETCH ── */
async function fetchDog() {
  if (busy) return;
  busy = true;

  setLoading();

  try {
    const res  = await fetch('https://dog.ceo/api/breeds/image/random');
    const data = await res.json();

    /* extract breed from URL path e.g. /breeds/hound-afghan/img.jpg */
    const match = data.message.match(/breeds\/([^\/]+)\//);
    const breed = match ? match[1].replace(/-/g, ' ') : 'mystery dog';

    /* wait for image to load before revealing */
    dogImg.onload = () => {
      spinRing.style.display = 'none';
      emptyState.classList.add('gone');

      /* double-RAF ensures CSS transition triggers after display change */
      requestAnimationFrame(() => requestAnimationFrame(() => {
        dogImg.classList.add('show');
        showCards();
      }));

      breedVal.textContent = breed;
      count++;
      bumpCount(count);
      fetchBtn.disabled  = false;
      btnTxt.textContent = 'Fetch Another';
      busy = false;
      nextFact();
    };

    dogImg.onerror = setError;
    dogImg.src     = data.message;

  } catch (err) {
    console.error('PawPaw fetch error:', err);
    setError();
  }
}

/* ── WIRE UP BUTTON ── */
fetchBtn.addEventListener('click', fetchDog);

/* ── AUTO FETCH ON LOAD ── */
window.addEventListener('load', () => setTimeout(fetchDog, 500));
