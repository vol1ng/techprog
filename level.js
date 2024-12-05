document.addEventListener("DOMContentLoaded", () => {
  const progressText = document.getElementById("progress");
  const questionImage = document.getElementById("question-image");
  const questionText = document.getElementById("question-text");
  const answerInput = document.getElementById("answer-input");
  const submitButton = document.getElementById("submit-button");
  const finishButton = document.getElementById("finish-button");

  let questions = [];
  let currentQuestion = 0;
  let correctAnswers = 0;

  const level = location.pathname.replace(".html", "");
  fetch(`${level}.json`)
    .then((response) => response.json())
    .then((data) => {
      questions = data;
      loadQuestion();
    });

  function updateProgress() {
    progressText.textContent = `Progress: ${correctAnswers}/${questions.length}`;
  }

  function loadQuestion() {
    if (currentQuestion >= questions.length) {
      submitButton.disabled = true;
      answerInput.disabled = true;
      finishButton.disabled = false;
      finishButton.classList.remove("disabled");
      return;
    }

    const question = questions[currentQuestion];
    questionImage.src = `images/${question.image}`;
    questionText.textContent = `What is this?`;
    answerInput.value = "";
  }

  submitButton.addEventListener("click", () => {
    const userAnswer = answerInput.value.trim().toLowerCase();
    const correctAnswer = questions[currentQuestion].answer;

    if (userAnswer === correctAnswer) {
      correctAnswers++;
    }

    currentQuestion++;
    localStorage.setItem(
      level,
      JSON.stringify({ correctAnswers, currentQuestion })
    );
    updateProgress();
    loadQuestion();
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
  const back = document.getElementById("back");
  back.addEventListener("click", () => {
    location.href = "game.html";
  });

  switchTheme.addEventListener("click", toggleTheme);

  finishButton.addEventListener("click", () => {
    location.href = "game.html";
  });
  document.addEventListener("keyup", (event) => {
    if (event.code === "Enter") {
      const userAnswer = answerInput.value.trim().toLowerCase();
      const correctAnswer = questions[currentQuestion].answer;

      if (userAnswer === correctAnswer) {
        correctAnswers++;
      }

      currentQuestion++;
      localStorage.setItem(
        level,
        JSON.stringify({ correctAnswers, currentQuestion })
      );
      updateProgress();
      loadQuestion();
    }
  });

  updateProgress();
});
