async function getDog() {
  try {
    const res = await fetch("https://dog.ceo/api/breeds/image/random");
    const data = await res.json();

    console.log(data); // check in console

    document.getElementById("dogImg").src = data.message;
  } catch (error) {
    console.log(error);
  }
}