let count = 0;

async function getDog() {
  const btn         = document.getElementById('fetchBtn');
  const img         = document.getElementById('dogImg');
  const card        = document.getElementById('card');
  const placeholder = document.getElementById('placeholder');
  const breedStrip  = document.getElementById('breedStrip');
  const breedName   = document.getElementById('breedName');
  const counterEl   = document.getElementById('counter');

  // Loading state
  btn.classList.add('loading-state');
  btn.textContent = 'FETCHING...';
  card.classList.add('loading');
  img.style.opacity = '0';

  try {
    const res  = await fetch('https://dog.ceo/api/breeds/image/random');
    const data = await res.json();

    // Parse breed from URL path
    const match = data.message.match(/breeds\/([^/]+)\//);
    const raw   = match ? match[1] : 'unknown';
    const breed = raw.replace(/-/g, ' ').toUpperCase();

    setTimeout(() => {
      placeholder.style.display = 'none';

      img.src           = data.message;
      img.style.display = 'block';
      img.style.opacity = '0';

      img.onload = () => {
        card.classList.remove('loading');
        img.style.opacity = '1';

        breedName.textContent       = breed;
        breedStrip.style.display    = 'flex';

        // Increment counter
        count++;
        counterEl.textContent = String(count).padStart(2, '0');

        btn.classList.remove('loading-state');
        btn.textContent = 'FETCH';
      };
    }, 250);

  } catch (err) {
    card.classList.remove('loading');
    placeholder.style.display = 'flex';
    placeholder.querySelector('.placeholder-text').textContent = 'FAILED\nTRY AGAIN';
    btn.classList.remove('loading-state');
    btn.textContent = 'FETCH';
    console.error(err);
  }
}

// Auto-fetch on load
getDog();
