let currentFile = "words.json";

const switchMode = () => {
  currentFile = currentFile === "words.json" ? "wordsru.json" : "words.json";
  const switchButton = document.getElementById("switchModeButton");
  switchButton.textContent = currentFile === "words.json" ? "Eng" : "Rus";

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
          <div class="translation-container">
            <div class="translation-content">
              <p>${translation}</p>
              <p>${transcription}</p>
            </div>
            <img id="markButton" src="images/not_marked.png" alt="Mark word" class="mark-icon">
          </div>
        `;
        updateMarkIcon(word);
        
        document.getElementById("markButton").addEventListener("click", () => {
          if (word) {
            if (!markedWords.includes(word)) {
              markedWords.push(word);
              localStorage.setItem("markedWords", JSON.stringify(markedWords));
              document.getElementById("markButton").src = "images/marked.png";
            } else {
              const index = markedWords.indexOf(word);
              markedWords.splice(index, 1);
              localStorage.setItem("markedWords", JSON.stringify(markedWords));
              document.getElementById("markButton").src = "images/not_marked.png";
            }
            updateMarkedWords();
          }
        });
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

const anchor = () => {
  fetch(currentFile);
  return;
};
anchor();

setTimeout(() => {
  loader.style.display = "none";
  content.style.display = "block";
}, 3000);

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
    popup.classList.add('active');
    updateMarkedWords();
  });

document.getElementById("closePopupButton").addEventListener("click", () => {
  const popup = document.getElementById("markedWordsPopup");
  popup.classList.remove('active');
});

document.getElementById("markButton").addEventListener("click", () => {
  const wordInput = document.getElementById("wordInput").value.trim();
  if (wordInput) {
    if (!markedWords.includes(wordInput)) {
      markedWords.push(wordInput);
      localStorage.setItem("markedWords", JSON.stringify(markedWords));
      document.getElementById("markButton").src = "images/marked.png";
    } else {
      const index = markedWords.indexOf(wordInput);
      markedWords.splice(index, 1);
      localStorage.setItem("markedWords", JSON.stringify(markedWords));
      document.getElementById("markButton").src = "images/not_marked.png";
    }
    updateMarkedWords();
  } else {
    alert("Введите слово, чтобы пометить.");
  }
});

// Функция для обновления иконки при поиске слова
function updateMarkIcon(word) {
  const markButton = document.getElementById("markButton");
  if (markedWords.includes(word)) {
    markButton.src = "images/marked.png";
  } else {
    markButton.src = "images/not_marked.png";
  }
}

document.addEventListener("keyup", (event) => {
  if (event.code === "Enter") searchWord();
});

updateMarkedWords();


const book = document.getElementById("book");
book.addEventListener("click", () => {
  window.location.href = "indexapi.html";
});