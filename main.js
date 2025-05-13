const searchWord = async () => {
  const word = document.getElementById("wordInput").value.trim();
  const resultDiv = document.getElementById("result");
  
  // Функция для определения языка слова
  const detectLanguage = (text) => {
    const russianPattern = /[а-яА-ЯёЁ]/;
    return russianPattern.test(text) ? "ru" : "en";
  };

  const language = detectLanguage(word);
  
  try {
    // Для английских слов
    if (language === "en") {
      // Получаем определение на английском
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      const data = await response.json();
      
      if (Array.isArray(data) && data.length > 0) {
        const entry = data[0];
        const meanings = entry.meanings.map(meaning => {
          const partOfSpeech = {
            'noun': 'существительное',
            'verb': 'глагол',
            'adjective': 'прилагательное',
            'adverb': 'наречие',
            'pronoun': 'местоимение',
            'preposition': 'предлог',
            'conjunction': 'союз',
            'interjection': 'междометие'
          }[meaning.partOfSpeech] || meaning.partOfSpeech;

          return `<p><strong>${partOfSpeech}:</strong> ${meaning.definitions[0].definition}</p>`;
        }).join('');
        
        const phonetic = entry.phonetic ? `<p><strong>Транскрипция:</strong> ${entry.phonetic}</p>` : '';
        
        // Получаем перевод на русский
        const translateResponse = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ru&dt=t&q=${encodeURIComponent(word)}`);
        const translateData = await translateResponse.json();
        const translation = translateData[0][0][0];
        
        resultDiv.innerHTML = `
          <p><strong>Перевод:</strong> ${translation}</p>
          ${phonetic}
          ${meanings}
        `;
      } else {
        resultDiv.innerHTML = "Слово не найдено";
      }
    } 
    // Для русских слов
    else {
      // Получаем перевод на английский
      const translateResponse = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=ru&tl=en&dt=t&q=${encodeURIComponent(word)}`);
      const translateData = await translateResponse.json();
      const translation = translateData[0][0][0];

      // Получаем определение переведенного слова
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${translation}`);
      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        const entry = data[0];
        const meanings = entry.meanings.map(meaning => {
          const partOfSpeech = {
            'noun': 'существительное',
            'verb': 'глагол',
            'adjective': 'прилагательное',
            'adverb': 'наречие',
            'pronoun': 'местоимение',
            'preposition': 'предлог',
            'conjunction': 'союз',
            'interjection': 'междометие'
          }[meaning.partOfSpeech] || meaning.partOfSpeech;

          return `<p><strong>${partOfSpeech}:</strong> ${meaning.definitions[0].definition}</p>`;
        }).join('');

        const phonetic = entry.phonetic ? `<p><strong>Транскрипция:</strong> ${entry.phonetic}</p>` : '';

        resultDiv.innerHTML = `
          <p><strong>Перевод:</strong> ${translation}</p>
          ${phonetic}
          ${meanings}
        `;
      } else {
        resultDiv.innerHTML = "Слово не найдено";
      }
    }
  } catch (error) {
    console.error("Ошибка:", error);
    resultDiv.innerHTML = "Произошла ошибка при поиске слова";
  }
};

const loader = document.getElementById("loader");
const content = document.getElementById("content");

// Показываем контент сразу, без задержки
loader.style.display = "none";
content.style.display = "block";

document.getElementById("wordInput").addEventListener("input", function () {
  const query = this.value.trim().toLowerCase();
  const suggestionBox = document.getElementById("suggestionBox");

  if (!query) {
    suggestionBox.innerHTML = "";
    suggestionBox.style.display = "none";
    return;
  }

  // Поскольку API не предоставляет функцию автодополнения,
  // мы можем использовать локальный список слов для подсказок
  const commonWords = [
    "hello", "world", "computer", "programming", "language",
    "привет", "мир", "компьютер", "программирование", "язык"
  ];

  const suggestions = commonWords
    .filter(word => word.startsWith(query))
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
});

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
      alert("Слово помечено!");
    } else {
      alert("Это слово уже помечено!");
    }
  } else {
    alert("Введите слово, чтобы пометить.");
  }
});
document.addEventListener("keyup", (event) => {
  if (event.code === "Enter") searchWord();
});

updateMarkedWords();
