let currentFile = "wordsru.json";

const switchMode = () => {
  currentFile = currentFile === "wordsru.json" ? "words.json" : "wordsru.json";
  const switchButton = document.getElementById("switchModeButton");
  switchButton.textContent = currentFile === "wordsru.json" ? "Ru" : "Eng";

  document.getElementById("result").innerHTML = "";
  document.getElementById("suggestionBox").innerHTML = "";
  document.getElementById("suggestionBox").style.display = "none";
};


const searchWord = () => {
  const word = document.getElementById("wordInput").value.trim();
  fetch(currentFile) // Используем текущий файл
    .then((response) => response.json())
    .then((data) => {
      const resultDiv = document.getElementById("result");
      const entry = data[word];

      if (entry) {
        const translation = entry.translation
          ? `<strong>Перевод:</strong> ${entry.translation}`
          : "Перевод отсутствует.";
        const transcription = entry.transcription
          ? `<strong>Транскрипция:</strong> ${entry.transcription}`
          : "Транскрипция отсутствует.";

        resultDiv.innerHTML = `
                    <p>${translation}</p>
                    <p>${transcription}</p>
                `;

      }
    })
    .catch((error) => {
      console.error("Ошибка:", error);
      document.getElementById("result").innerHTML =
        "Произошла ошибка при загрузке данных.";
    });
};

document.getElementById("wordInput").addEventListener("input", function () {
  const query = this.value.trim().toLowerCase();
  const suggestionBox = document.getElementById("suggestionBox");

  if (!query) {
    suggestionBox.innerHTML = "";
    suggestionBox.style.display = "none";
    return;
  }

  fetch(currentFile)
    .then((response) => response.json())
    .then((data) => {
      const suggestions = Object.keys(data)
        .filter((word) => word.startsWith(query))
        .sort()
        .slice(0, 5);

      suggestionBox.innerHTML = "";
      if (suggestions.length > 0) {
        suggestionBox.style.display = "block";
        suggestions.forEach((word) => {
          const item = document.createElement("div");
          item.className = "suggestion";
          item.textContent = word;
          item.addEventListener("click", () => {
            document.getElementById("wordInput").value = word;
            suggestionBox.innerHTML = "";
            suggestionBox.style.display = "none";
            searchWord();
          });
          suggestionBox.appendChild(item);
        });
      } else {
        suggestionBox.style.display = "none";
      }
    })
    .catch((error) => {
      console.error("Ошибка при загрузке данных:", error);
    });
});
document.getElementById("switchModeButton").addEventListener("click", switchMode);


const switchTheme = document.getElementById('switchTheme');
const themeStylesheet = document.getElementById('theme');
let isLightTheme = true;

function toggleTheme() {
    if (isLightTheme) {

        themeStylesheet.setAttribute('href', 'dark.css');

        switchTheme.querySelector('img').src = 'images/night-mode.png'; 
        isLightTheme = false;
    } else {

        themeStylesheet.setAttribute('href', 'light.css');

        switchTheme.querySelector('img').src = 'images/brightness.png'; 
        isLightTheme = true;
    }
}


switchTheme.addEventListener('click', toggleTheme);
