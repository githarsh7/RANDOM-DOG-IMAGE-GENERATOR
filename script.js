async function getDog() {
  try {
    const res = await fetch("https://dog.ceo/api/breeds/image/random");
    const data = await res.json();

    const img = document.getElementById("dogImg");

    img.src = data.message;
    img.style.display = "block"; // show after loading

  } catch (error) {
    console.log("Error:", error);
  }
}

// Load one image when page opens
getDog();
