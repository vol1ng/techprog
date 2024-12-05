const switchTheme = document.getElementById("switchTheme");
const themeStylesheet = document.getElementById("theme");

let isLightTheme =
  localStorage.getItem("theme") === "light" || !localStorage.getItem("theme");

function applyTheme() {
  if (isLightTheme) {
    themeStylesheet.setAttribute("href", "css/light.css");
    switchTheme.querySelector("img").src = "images/2.png";
    localStorage.setItem("theme", "light");
  } else {
    themeStylesheet.setAttribute("href", "css/dark.css");
    switchTheme.querySelector("img").src = "images/1.png";
    localStorage.setItem("theme", "dark");
  }
}

function toggleTheme() {
  isLightTheme = !isLightTheme;
  applyTheme();
}

isLightTheme = localStorage.getItem("theme") === "light";
applyTheme();

switchTheme.addEventListener("click", toggleTheme);
