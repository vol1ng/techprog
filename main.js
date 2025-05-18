let currentFile = "words.json";
let markedWords = JSON.parse(localStorage.getItem("markedWords")) || [];

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
        
        const markButton = document.getElementById("markButton");
        if (markButton) {
          markButton.addEventListener("click", async () => {
            if (word) {
              const userId = localStorage.getItem('userId');
              if (!userId) {
                alert('Пожалуйста, войдите в систему, чтобы отмечать слова');
                return;
              }

              try {
                console.log('Обработка клика по кнопке отметки слова:', word);
                if (!markedWords.includes(word)) {
                  // Добавляем слово
                  console.log('Отправка запроса на добавление слова');
                  const response = await fetch('http://localhost:3000/api/marked-words', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userId, word })
                  });

                  if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                  }

                  const data = await response.json();
                  console.log('Ответ сервера:', data);

                  if (data.success) {
                    markedWords.push(word);
                    localStorage.setItem("markedWords", JSON.stringify(markedWords));
                    markButton.src = "images/marked.png";
                    console.log('Слово успешно отмечено:', word);
                  } else {
                    throw new Error(data.message || 'Ошибка при отметке слова');
                  }
                } else {
                  // Удаляем слово
                  console.log('Отправка запроса на удаление слова');
                  const response = await fetch('http://localhost:3000/api/marked-words', {
                    method: 'DELETE',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userId, word })
                  });

                  if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                  }

                  const data = await response.json();
                  console.log('Ответ сервера:', data);

                  if (data.success) {
                    const index = markedWords.indexOf(word);
                    markedWords.splice(index, 1);
                    localStorage.setItem("markedWords", JSON.stringify(markedWords));
                    markButton.src = "images/not_marked.png";
                    console.log('Слово успешно удалено:', word);
                  } else {
                    throw new Error(data.message || 'Ошибка при удалении слова');
                  }
                }
                updateMarkedWords();
              } catch (error) {
                console.error('Ошибка при работе с отмеченным словом:', error);
                alert('Произошла ошибка при работе с отмеченным словом: ' + error.message);
              }
            }
          });
        }
      }
    })
    .catch((error) => {
      console.error("Ошибка:", error);
      document.getElementById("result").innerHTML =
        "Произошла ошибка при загрузке данных.";
    });
};

function updateMarkedWords() {
  const markedWordsList = document.getElementById("markedWordsList");
  if (!markedWordsList) return;
  
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

// Функция для обновления иконки при поиске слова
function updateMarkIcon(word) {
  const markButton = document.getElementById("markButton");
  if (markButton) {
    if (markedWords.includes(word)) {
      markButton.src = "images/marked.png";
    } else {
      markButton.src = "images/not_marked.png";
    }
  }
}

// Функция для загрузки отмеченных слов с сервера
async function loadMarkedWords() {
  const userId = localStorage.getItem('userId');
  if (!userId) {
    console.log('Пользователь не авторизован');
    return;
  }

  try {
    console.log('Загрузка отмеченных слов для пользователя:', userId);
    const response = await fetch(`http://localhost:3000/api/marked-words/${userId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Получены данные с сервера:', data);
    
    if (data.success) {
      markedWords = data.words.map(w => w.word);
      localStorage.setItem("markedWords", JSON.stringify(markedWords));
      updateMarkedWords();
      console.log('Отмеченные слова загружены:', markedWords);
    } else {
      console.error('Ошибка при загрузке слов:', data.message);
    }
  } catch (error) {
    console.error('Ошибка при загрузке отмеченных слов:', error);
  }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  const loader = document.getElementById("loader");
  const content = document.getElementById("content");

  if (loader) loader.style.display = "block";
  if (content) content.style.display = "none";

  const anchor = () => {
    fetch(currentFile);
    return;
  };
  anchor();

  setTimeout(() => {
    if (loader) loader.style.display = "none";
    if (content) content.style.display = "block";
  }, 3000);

  // Обработчик ввода слова
  const wordInput = document.getElementById("wordInput");
  if (wordInput) {
    wordInput.addEventListener("input", function () {
      const query = this.value.trim().toLowerCase();
      const suggestionBox = document.getElementById("suggestionBox");

      if (!query) {
        if (suggestionBox) {
          suggestionBox.innerHTML = "";
          suggestionBox.style.display = "none";
        }
        return;
      }

      fetch(currentFile)
        .then((response) => response.json())
        .then((data) => {
          const suggestions = Object.keys(data)
            .filter((word) => word.startsWith(query))
            .sort()
            .slice(0, 5);

          if (suggestionBox) {
            suggestionBox.innerHTML = "";
            if (suggestions.length > 0) {
              suggestionBox.style.display = "block";
              suggestions.forEach((word) => {
                const item = document.createElement("div");
                item.className = "suggestion";
                item.textContent = word;
                item.addEventListener("click", () => {
                  if (wordInput) wordInput.value = word;
                  if (suggestionBox) {
                    suggestionBox.innerHTML = "";
                    suggestionBox.style.display = "none";
                  }
                  searchWord();
                });
                suggestionBox.appendChild(item);
              });
            } else {
              suggestionBox.style.display = "none";
            }
          }
        })
        .catch((error) => {
          console.error("Ошибка при загрузке данных:", error);
        });
    });
  }

  // Обработчик переключения режима
  const switchModeButton = document.getElementById("switchModeButton");
  if (switchModeButton) {
    switchModeButton.addEventListener("click", switchMode);
  }

  // Обработчик кнопки игры
  const gameButton = document.getElementById("gameButton");
  if (gameButton) {
    gameButton.addEventListener("click", () => {
      location.href = "game.html";
    });
  }

  // Обработчик кнопки просмотра отмеченных слов
  const viewMarkedWordsButton = document.getElementById("viewMarkedWordsButton");
  if (viewMarkedWordsButton) {
    viewMarkedWordsButton.addEventListener("click", () => {
      const popup = document.getElementById("markedWordsPopup");
      if (popup) {
        popup.classList.add('active');
        updateMarkedWords();
      }
    });
  }

  // Обработчик кнопки закрытия попапа
  const closePopupButton = document.getElementById("closePopupButton");
  if (closePopupButton) {
    closePopupButton.addEventListener("click", () => {
      const popup = document.getElementById("markedWordsPopup");
      if (popup) popup.classList.remove('active');
    });
  }

  // Обработчик нажатия Enter
  document.addEventListener("keyup", (event) => {
    if (event.code === "Enter") searchWord();
  });

  // Загружаем отмеченные слова при старте
  loadMarkedWords();
});

const book = document.getElementById("book");
book.addEventListener("click", () => {
  window.location.href = "indexapi.html";
});