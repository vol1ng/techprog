const levelButtons = document.querySelectorAll(".level-btn");

levelButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const level = button.getAttribute("data-level");
    location.href = `level${level}.html`;
  });
});

const back = document.getElementById("back");
back.addEventListener("click", () => {
  location.href = "index.html";
});
const switchTheme = document.getElementById("switchTheme");
const themeStylesheet = document.getElementById("theme");
let isLightTheme = true;

function toggleTheme() {
  if (isLightTheme) {
    themeStylesheet.setAttribute("href", "dark.css");
    switchTheme.querySelector("img").src = "images/1.png";
    isLightTheme = false;
  } else {
    themeStylesheet.setAttribute("href", "light.css");
    switchTheme.querySelector("img").src = "images/2.png";
    isLightTheme = true;
  }
}

switchTheme.addEventListener("click", toggleTheme);
