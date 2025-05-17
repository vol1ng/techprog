const levelButtons = document.querySelectorAll(".level-btn");
const loader = document.getElementById("loader");
const content = document.getElementById("content");

function updateLevelButtons() {
  levelButtons.forEach((button) => {
    const level = button.getAttribute("data-level");
    const savedData = localStorage.getItem(`level${level}`);

    if (savedData) {
      const { correctAnswers, currentQuestion } = JSON.parse(savedData);
      fetch(`level${level}.json`)
        .then((response) => response.json())
        .then((questions) => {
          const totalQuestions = questions.length;
          button.textContent = `Level ${level}: ${correctAnswers}/${totalQuestions}`;

          if (currentQuestion >= totalQuestions) {
            button.classList.add("completed");
            button.disabled = true;
          }
        });
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("updateLevels") === "true") {
    updateLevelButtons();
    localStorage.removeItem("updateLevels");
  }

  loader.style.display = "block";

  setTimeout(() => {
    loader.style.display = "none";
    content.style.display = "block";
    updateLevelButtons();
  }, 1000);

  levelButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const level = button.getAttribute("data-level");
      location.href = `level${level}.html`;
    });
  });
});

switchTheme.addEventListener("click", toggleTheme);

const back = document.getElementById("back");
back.addEventListener("click", () => {
  location.href = "index.html";
});
// Добавляем в конец файла game.js

const resetButton = document.getElementById("resetProgress");

resetButton.addEventListener("click", () => {
  if (
    confirm(
      "Are you sure you want to reset ALL progress? This cannot be undone!"
    )
  ) {
    // Удаляем все данные о прогресса уровней
    for (let i = 1; i <= 7; i++) {
      localStorage.removeItem(`level${i}`);
    }

    // Обновляем кнопки уровней
    levelButtons.forEach((button) => {
      const level = button.getAttribute("data-level");
      button.textContent = `Level ${level}: Beginner`; // Или ваше стандартное название
      button.classList.remove("completed");
      button.disabled = false;
    });

    // Можно добавить анимацию или уведомление
    alert("All progress has been reset!");
  }
});

function updateLevelButtons() {
  const levelNames = {
    1: "Beginner",
    2: "Elementary",
    3: "Pre-Intermediate",
    4: "Intermediate",
    5: "Upper-Intermediate",
    6: "Advanced",
    7: "Bonus",
  };

  levelButtons.forEach((button) => {
    const level = button.getAttribute("data-level");
    const savedData = localStorage.getItem(`level${level}`);

    if (savedData) {
      const { correctAnswers, currentQuestion } = JSON.parse(savedData);
      const totalQuestions = 10;

      button.textContent = `Level ${level}: ${correctAnswers}/${totalQuestions}`;

      if (currentQuestion >= totalQuestions) {
        button.classList.add("completed");
        button.disabled = true;
      }
    } else {
      button.textContent = `Level ${level}: ${levelNames[level]}`;
    }
  });
}
