document.addEventListener("DOMContentLoaded", () => {
  const progressText = document.getElementById("progress");
  const questionImage = document.getElementById("question-image");
  const questionText = document.getElementById("question-text");
  const answerInput = document.getElementById("answer-input");
  const submitButton = document.getElementById("submit-button");
  const finishButton = document.getElementById("finish-button");
  const back = document.getElementById("back");

  const level = window.location.pathname.split("/").pop().replace(".html", "");

  let questions = [];
  let currentQuestion = 0;
  let correctAnswers = 0;
  const totalQuestions = 10; // Должно соответствовать количеству вопросов в JSON

  const loader = document.getElementById("loader");
  const content = document.getElementById("content");

  loader.style.display = "block";

  fetch(`${level}.json`)
    .then((response) => response.json())
    .then((data) => {
      questions = data;
      const savedData = localStorage.getItem(level);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        currentQuestion = parsedData.currentQuestion || 0;
        correctAnswers = parsedData.correctAnswers || 0;
      }
      loadQuestion();

      setTimeout(() => {
        loader.style.display = "none";
        content.style.display = "block";
      }, 1000);
    });

  function loadQuestion() {
    updateProgress();

    if (currentQuestion >= questions.length) {
      submitButton.disabled = true;
      answerInput.disabled = true;
      finishButton.disabled = false;
      finishButton.classList.remove("disabled");
      finishButton.textContent = "Level Completed!";
      return;
    }

    const question = questions[currentQuestion];
    questionImage.src = `images/${question.image}`;
    questionText.textContent = "What is this?";
    answerInput.value = "";
    answerInput.focus();
  }

  function updateProgress() {
    progressText.textContent = `Progress: ${correctAnswers}/${totalQuestions}`;
  }

  function checkAnswer() {
    const userAnswer = answerInput.value.trim().toLowerCase();
    const correctAnswer = questions[currentQuestion].answer.toLowerCase();

    if (userAnswer === correctAnswer) {
      correctAnswers++;
    }

    currentQuestion++;
    localStorage.setItem(
      level,
      JSON.stringify({ correctAnswers, currentQuestion })
    );
    loadQuestion();
  }

  submitButton.addEventListener("click", checkAnswer);
  answerInput.addEventListener("keyup", (event) => {
    if (event.key === "Enter") checkAnswer();
  });

  finishButton.addEventListener("click", () => {
    localStorage.setItem("updateLevels", "true");
    location.href = "game.html";
  });

  back.addEventListener("click", () => {
    location.href = "game.html";
  });
});
