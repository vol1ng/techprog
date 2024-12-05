let currentFile = "Wordsru.json";

const switchMode = () => {
  currentFile = currentFile === "Wordsru.json" ? "words.json" : "Wordsru.json";
  const switchButton = document.getElementById("switchModeButton");
  switchButton.textContent = currentFile === "Wordsru.json" ? "Rus" : "Eng";

  document.getElementById("result").innerHTML = "";
  document.getElementById("suggestionBox").innerHTML = "";
  document.getElementById("suggestionBox").style.display = "none";
};

const searchWord = () => {
  const word = document.getElementById("wordInput").value.trim();
  fetch(currentFile)
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
const loader = document.getElementById("loader");
const content = document.getElementById("content");

loader.style.display = "block";

setTimeout(() => {
  loader.style.display = "none";
  content.style.display = "block";
}, 2000);

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

document
  .getElementById("switchModeButton")
  .addEventListener("click", switchMode);

const gameButton = document.getElementById("gameButton");
gameButton.addEventListener("click", () => {
  location.href = "game.html";
});

let markedWords = JSON.parse(localStorage.getItem("markedWords")) || [];

function updateMarkedWords() {
  const markedWordsList = document.getElementById("markedWordsList");
  markedWordsList.innerHTML = "";

  markedWords.forEach((word, index) => {
    const listItem = document.createElement("li");
    listItem.textContent = word;

    const removeButton = document.createElement("button");
    removeButton.textContent = "Delete";
    removeButton.addEventListener("click", () => {
      removeMarkedWord(index);
    });

    listItem.appendChild(removeButton);
    markedWordsList.appendChild(listItem);
  });
}

function removeMarkedWord(index) {
  markedWords.splice(index, 1);
  localStorage.setItem("markedWords", JSON.stringify(markedWords));
  updateMarkedWords();
}

document
  .getElementById("viewMarkedWordsButton")
  .addEventListener("click", () => {
    const popup = document.getElementById("markedWordsPopup");
    popup.style.display = "flex";
    updateMarkedWords();
  });

document.getElementById("closePopupButton").addEventListener("click", () => {
  const popup = document.getElementById("markedWordsPopup");
  popup.style.display = "none";
});

document.getElementById("markButton").addEventListener("click", () => {
  const wordInput = document.getElementById("wordInput").value.trim();
  if (wordInput) {
    if (!markedWords.includes(wordInput)) {
      markedWords.push(wordInput);
      localStorage.setItem("markedWords", JSON.stringify(markedWords));
      alert("The word was marked");
    } else {
      alert("The word is already marked");
    }
  } else {
    alert("Enter the word to mark");
  }
});
document.addEventListener("keyup", (event) => {
  if (event.code === "Enter") searchWord();
});

updateMarkedWords();
