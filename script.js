async function getDog() {
  try {
    const res = await fetch("https://dog.ceo/api/breeds/image/random");
    const data = await res.json();

    const img = document.getElementById("dogImg");

    img.style.opacity = "0";

    setTimeout(() => {
      img.src = data.message;
      img.style.display = "block";
      img.style.opacity = "1";
    }, 200);

  } catch (error) {
    console.log(error);
  }
}

getDog();
