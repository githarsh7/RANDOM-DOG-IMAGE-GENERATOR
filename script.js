async function getDog() {
  try {
    const res = await fetch("https://dog.ceo/api/breeds/image/random");
    const data = await res.json();

    const img = document.getElementById("dogImg");
    const card = document.querySelector(".card");

    card.classList.remove("loaded");
    img.style.opacity = "0";

    setTimeout(() => {
      img.src = data.message;
      img.style.display = "block";

      img.onload = () => {
        img.style.opacity = "1";
        card.classList.add("loaded");
      };
    }, 300);

  } catch (error) {
    console.log(error);
  }
}

getDog();
