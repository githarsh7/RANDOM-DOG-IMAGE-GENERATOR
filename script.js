/* ── State ── */
let count = 0;
let lastFact = -1;
let busy = false;

/* ── Facts ── */
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
  "Dogs can recognise their owner's face in a photograph."
];

/* ── DOM refs ── */
const fetchBtn     = document.getElementById('fetchBtn');
const btnTxt       = document.getElementById('btnTxt');
const dogImg       = document.getElementById('dogImg');
const idleState    = document.getElementById('idleState');
const idleHint     = document.getElementById('idleHint');
const spinner      = document.getElementById('spinner');
const breedVal     = document.getElementById('breedVal');
const factTxt      = document.getElementById('factTxt');
const countDisplay = document.getElementById('countDisplay');
const stripBreed   = document.getElementById('stripBreed');

/* ── Helpers ── */
function pickFact() {
  let i;
  do { i = Math.floor(Math.random() * FACTS.length); }
  while (i === lastFact && FACTS.length > 1);
  lastFact = i;
  return FACTS[i];
}

function updateFact() {
  factTxt.classList.add('fade');
  setTimeout(() => {
    factTxt.textContent = pickFact();
    factTxt.classList.remove('fade');
  }, 220);
}

function formatBreed(raw) {
  return raw
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

/* ── State transitions ── */
function setLoading() {
  dogImg.classList.remove('show');
  idleState.classList.remove('gone');
  spinner.style.display = 'block';
  idleHint.textContent = 'Finding a good soul -';
  fetchBtn.disabled = true;
  btnTxt.textContent = 'Fetching…';
}

function setError() {
  spinner.style.display = 'none';
  idleHint.textContent = 'Something went wrong.';
  fetchBtn.disabled = false;
  btnTxt.textContent = 'Try Again';
  busy = false;
}

function setReady(breed) {
  spinner.style.display = 'none';
  idleState.classList.add('gone');

  requestAnimationFrame(() => requestAnimationFrame(() => {
    dogImg.classList.add('show');
  }));

  const label = formatBreed(breed);
  breedVal.textContent = label;
  stripBreed.textContent = label;

  count++;
  countDisplay.textContent = count;

  fetchBtn.disabled = false;
  btnTxt.textContent = 'Fetch Another';
  busy = false;

  updateFact();
}

/* ── Core fetch ── */
async function fetchDog() {
  if (busy) return;
  busy = true;
  setLoading();

  try {
    const res = await fetch('https://dog.ceo/api/breeds/image/random');
    if (!res.ok) throw new Error('Bad response');

    const data = await res.json();
    const match = data.message.match(/breeds\/([^/]+)\//);
    const breed = match ? match[1] : 'mystery-dog';

    dogImg.onload  = () => setReady(breed);
    dogImg.onerror = setError;
    dogImg.src     = data.message;
  } catch (err) {
    console.error('PawPaw error:', err);
    setError();
  }
}

/* ── Init ── */
fetchBtn.addEventListener('click', fetchDog);
window.addEventListener('load', () => setTimeout(fetchDog, 350));
