const searchWord = () => {
  const word = document.getElementById("wordInput").value.trim()
  fetch("words.json")
    .then((response) => response.json())
    .then((data) => {
      const resultDiv = document.getElementById("result")
      const entry = data[word]

      if (entry) {
        const translation = entry.translation
          ? `<strong>Перевод:</strong> ${entry.translation}`
          : "Перевод отсутствует."
        const transcription = entry.transcription
          ? `<strong>Транскрипция:</strong> ${entry.transcription}`
          : "Транскрипция отсутствует."

        resultDiv.innerHTML = `
                    <p>${translation}</p>
                    <p>${transcription}</p>
                `
        document.getElementById("markButton").style.display = "inline"
      } else {
        resultDiv.innerHTML = "Такого слова не существует."
        document.getElementById("markButton").style.display = "none"
      }
    })
    .catch((error) => {
      console.error("Ошибка:", error)
      document.getElementById("result").innerHTML =
        "Произошла ошибка при загрузке данных."
    })
}

const markWord = () => {
  const word = document.getElementById("wordInput").value.trim()
  if (!word) return

  let markedWords = JSON.parse(localStorage.getItem("markedWords"))
  if (!markedWords.includes(word)) {
    markedWords.push(word)
    localStorage.setItem("markedWords", JSON.stringify(markedWords))
    alert(`Слово "${word}" добавлено в помеченные.`)
  } else {
    alert(`Слово "${word}" уже помечено.`)
  }
}

const deleteMarkedWord = (wordToDelete) => {
  let markedWords = JSON.parse(localStorage.getItem("markedWords"))
  markedWords = markedWords.filter((word) => word !== wordToDelete)
  localStorage.setItem("markedWords", JSON.stringify(markedWords))
  showMarkedWords()
}

const showMarkedWords = () => {
  const markedWordsList = document.getElementById("markedWordsList")
  markedWordsList.innerHTML = ""

  const markedWords = JSON.parse(localStorage.getItem("markedWords"))
  if (markedWords.length > 0) {
    markedWords.forEach((word) => {
      const wordDiv = document.createElement("div")
      wordDiv.style.display = "flex"
      wordDiv.style.justifyContent = "space-between"
      wordDiv.style.alignItems = "center"

      const wordText = document.createElement("span")
      wordText.textContent = word
      wordText.style.cursor = "pointer"
      wordText.addEventListener("click", () => {
        document.getElementById("wordInput").value = word
        searchWord()
        closePopup()
      })

      const deleteButton = document.createElement("button")
      deleteButton.textContent = "Удалить"
      deleteButton.style.marginLeft = "10px"
      deleteButton.addEventListener("click", () => deleteMarkedWord(word))

      wordDiv.appendChild(wordText)
      wordDiv.appendChild(deleteButton)
      markedWordsList.appendChild(wordDiv)
    })
  } else {
    markedWordsList.textContent = "Пусто."
  }

  document.getElementById("markedWordsPopup").style.display = "block"
}

const closePopup = () => {
  document.getElementById("markedWordsPopup").style.display = "none"
}

document.getElementById("wordInput").addEventListener("input", function () {
  const query = this.value.trim().toLowerCase()
  const suggestionBox = document.getElementById("suggestionBox")

  if (!query) {
    suggestionBox.innerHTML = ""
    suggestionBox.style.display = "none"
    return
  }

  fetch("words.json")
    .then((response) => response.json())
    .then((data) => {
      const suggestions = Object.keys(data)
        .filter((word) => word.startsWith(query))
        .sort()
        .slice(0, 5)

      suggestionBox.innerHTML = ""
      if (suggestions.length > 0) {
        suggestionBox.style.display = "block"
        suggestions.forEach((word) => {
          const item = document.createElement("div")
          item.className = "suggestion"
          item.textContent = word
          item.addEventListener("click", () => {
            document.getElementById("wordInput").value = word
            suggestionBox.innerHTML = ""
            suggestionBox.style.display = "none"
            searchWord() // Выполняем поиск сразу после выбора слова из предложений
          })
          suggestionBox.appendChild(item)
        })
      } else {
        suggestionBox.style.display = "none"
      }
    })
    .catch((error) => {
      console.error("Ошибка при загрузке данных:", error)
    })
})

document.getElementById("searchButton").addEventListener("click", searchWord)

document.getElementById("markButton").addEventListener("click", markWord)
document
  .getElementById("showMarkedButton")
  .addEventListener("click", showMarkedWords)

document
  .getElementById("closePopupButton")
  .addEventListener("click", closePopup)
