const levelButtons = document.querySelectorAll(".level-btn");

levelButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const level = button.getAttribute("data-level");
    location.href = `level${level}.html`;
  });
});

const loader = document.getElementById("loader");
const content = document.getElementById("content");

loader.style.display = "block";

setTimeout(() => {
  loader.style.display = "none";
  content.style.display = "block";
}, 2000);

switchTheme.addEventListener("click", toggleTheme);
const back = document.getElementById("back");
back.addEventListener("click", () => {
  location.href = "index.html";
});
