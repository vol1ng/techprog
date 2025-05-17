document.addEventListener("DOMContentLoaded", function () {
  const wordInput = document.getElementById("wordInput");
  const resultDiv = document.getElementById("result");
  const searchedWord = document.getElementById("searchedWord");
  const phoneticText = document.getElementById("phoneticText");
  const audioButton = document.getElementById("audioButton");
  const partOfSpeech = document.getElementById("partOfSpeech");
  const definition = document.getElementById("definition");
  const example = document.getElementById("example");
  const loader = document.getElementById("loader");
  const content = document.getElementById("content");
  const errorMessage = document.getElementById("errorMessage");

  let audio = null;

  wordInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      const word = wordInput.value.trim();
      if (word) fetchWord(word);
    }
  });

  async function fetchWord(word) {
    try {
      showLoader();

      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
      );
      addToHistory(word);
      if (!response.ok) throw new Error("Word not found");

      const data = await response.json();
      displayWordData(data[0]);

      hideLoader();
    } catch (error) {
      hideLoader();
      showError(error.message);
    }
  }

  function displayWordData(data) {
    errorMessage.style.display = "none";
    resultDiv.style.display = "block";
    searchedWord.textContent = data.word;

    const phonetic = data.phonetics.find((p) => p.text && p.audio) || {};
    phoneticText.textContent = phonetic.text || "";

    if (phonetic.audio) {
      audio = new Audio(phonetic.audio);
      audioButton.style.display = "inline-block";
    } else {
      audioButton.style.display = "none";
    }

    const firstMeaning = data.meanings[0];
    if (firstMeaning) {
      partOfSpeech.innerHTML = `<em>${firstMeaning.partOfSpeech}</em>`;
      const firstDefinition = firstMeaning.definitions[0];
      definition.textContent =
        firstDefinition?.definition || "No definition found";

      if (firstDefinition?.example) {
        example.innerHTML = `<em>Example:</em> ${firstDefinition.example}`;
      } else {
        example.textContent = "";
      }
    }
  }

  audioButton.addEventListener("click", function () {
    if (audio) {
      audio.currentTime = 0;
      audio.play();
    }
  });

  function showLoader() {
    loader.style.display = "block";
    content.style.display = "none";
    resultDiv.style.display = "none";
  }

  function hideLoader() {
    loader.style.display = "none";
    content.style.display = "block";
  }

  function showError(message) {
    errorMessage.style.display = "block";
    errorMessage.textContent = `${message}. Try another word.`;
    resultDiv.style.display = "none";
  }

  resultDiv.style.display = "none";
});

const gamebtn = document.getElementById("gameButton");
gamebtn.addEventListener("click", () => {
  window.location.href = "game.html";
});

const backBtn = document.getElementById("goBack");

backBtn.addEventListener("click", () => {
  window.location.href = "index.html";
});
let searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];

function addToHistory(word) {
  searchHistory = [word, ...searchHistory.filter((w) => w !== word)].slice(
    0,
    5
  );
  localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
  renderSearchHistory();
}

function renderSearchHistory() {
  const list = document.getElementById("searchHistoryList");
  list.innerHTML = "";
  searchHistory.forEach((word) => {
    const li = document.createElement("li");
    li.textContent = word;
    li.addEventListener("click", () => {
      wordInput.value = word;
      fetchWord(word);
    });
    list.appendChild(li);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  renderSearchHistory();
});
