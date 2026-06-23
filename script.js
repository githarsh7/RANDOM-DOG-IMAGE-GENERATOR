async function getDog() {
  const btn         = document.querySelector('.generate-btn');
  const img         = document.getElementById('dogImg');
  const card        = document.getElementById('card');
  const placeholder = document.getElementById('placeholder');
  const breedTag    = document.getElementById('breedTag');

  // Button bounce
  btn.style.transform = 'scale(0.94)';
  setTimeout(() => btn.style.transform = '', 150);

  // Loading state
  card.classList.add('loading');
  img.style.opacity = '0';

  try {
    const res  = await fetch('https://dog.ceo/api/breeds/image/random');
    const data = await res.json();

    // Extract breed from URL e.g. .../breeds/labrador/n123.jpg
    const breedMatch = data.message.match(/breeds\/([^/]+)\//);
    const breed = breedMatch
      ? breedMatch[1].replace(/-/g, ' ')
      : 'mystery doggo';

    setTimeout(() => {
      placeholder.style.display = 'none';

      img.src            = data.message;
      img.style.display  = 'block';
      img.style.opacity  = '0';

      img.onload = () => {
        card.classList.remove('loading');
        img.style.opacity = '1';

        breedTag.textContent  = '🐾 ' + breed;
        breedTag.style.display = 'block';

        // Briefly speed up the running dog on each fetch
        const runner = document.getElementById('runner');
        runner.style.animationDuration = '2.5s';
        setTimeout(() => runner.style.animationDuration = '', 3000);
      };
    }, 280);

  } catch (err) {
    card.classList.remove('loading');
    placeholder.style.display = 'flex';
    placeholder.querySelector('p').textContent = '😢 Oops! The doggo ran away. Try again!';
    console.error(err);
  }
}

// Fetch one on load
getDog();
