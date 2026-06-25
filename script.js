let count = 0;
let lastFact = -1;
let busy = false;

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

const fetchBtn = document.getElementById('fetchBtn');
const btnTxt = document.getElementById('btnTxt');
const dogImg = document.getElementById('dogImg');
const emptyState = document.getElementById('emptyState');
const spinRing = document.getElementById('spinRing');
const emptyTxt = document.getElementById('emptyTxt');
const badgeBreed = document.getElementById('badgeBreed');
const factSlant = document.getElementById('factSlant');
const stampCount = document.getElementById('stampCount');
const breedVal = document.getElementById('breedVal');
const countChip = document.getElementById('countChip');
const stampN = document.getElementById('stampN');
const factTxt = document.getElementById('factTxt');

function pickFact() {
  let i;
  do {
    i = Math.floor(Math.random() * FACTS.length);
  } while (i === lastFact && FACTS.length > 1);
  lastFact = i;
  return FACTS[i];
}

function nextFact() {
  factTxt.classList.add('fade');
  setTimeout(() => {
    factTxt.textContent = pickFact();
    factTxt.classList.remove('fade');
  }, 220);
}

function bumpCount(n) {
  countChip.textContent = n;
  stampN.textContent = n;
  countChip.animate(
    [
      { transform: 'scale(1)' },
      { transform: 'scale(1.35)' },
      { transform: 'scale(1)' }
    ],
    { duration: 300, easing: 'ease-out' }
  );
}

function showCards() {
  setTimeout(() => badgeBreed.classList.add('show'), 60);
  setTimeout(() => factSlant.classList.add('show'), 140);
  setTimeout(() => stampCount.classList.add('show'), 220);
}

function hideCards() {
  badgeBreed.classList.remove('show');
  factSlant.classList.remove('show');
  stampCount.classList.remove('show');
}

function setLoading() {
  dogImg.classList.remove('show');
  hideCards();
  emptyState.classList.remove('gone');
  spinRing.style.display = 'block';
  emptyTxt.textContent = 'Finding a good boy…';
  fetchBtn.disabled = true;
  btnTxt.textContent = 'Fetching…';
}

function setError() {
  spinRing.style.display = 'none';
  emptyTxt.textContent = 'Awaiting fetch';
  fetchBtn.disabled = false;
  btnTxt.textContent = 'Try Again';
  busy = false;
}

function revealImageAndUI(breed) {
  spinRing.style.display = 'none';
  emptyState.classList.add('gone');

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      dogImg.classList.add('show');
      showCards();
    });
  });

  breedVal.textContent = breed;
  count++;
  bumpCount(count);
  fetchBtn.disabled = false;
  btnTxt.textContent = 'Fetch Another';
  busy = false;
  nextFact();
}

async function fetchDog() {
  if (busy) return;
  busy = true;
  setLoading();

  try {
    const res = await fetch('https://dog.ceo/api/breeds/image/random');
    if (!res.ok) throw new Error('Network response was not ok');

    const data = await res.json();
    const match = data.message.match(/breeds\/([^\/]+)\//);
    const breed = match ? match[1].replace(/-/g, ' ') : 'mystery dog';

    dogImg.onload = () => revealImageAndUI(breed);
    dogImg.onerror = setError;
    dogImg.src = data.message;
  } catch (err) {
    console.error('PawPaw fetch error:', err);
    setError();
  }
}

fetchBtn.addEventListener('click', fetchDog);

window.addEventListener('load', () => {
  setTimeout(fetchDog, 400);
});
