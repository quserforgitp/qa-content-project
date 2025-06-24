// Ejercicio del alumno
const btn = document.querySelector("#btn");
const output = document.querySelector("#output");

btn.addEventListener("click", () => {
  if (output.textContent === "Hello World!") {
    output.textContent = "";
  } else {
    output.textContent = "Hello World!";
  }
});