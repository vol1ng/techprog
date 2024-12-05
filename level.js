document.addEventListener("DOMContentLoaded", () => {
  const progressText = document.getElementById("progress");
  const questionImage = document.getElementById("question-image");
  const questionText = document.getElementById("question-text");
  const answerInput = document.getElementById("answer-input");
  const submitButton = document.getElementById("submit-button");
  const finishButton = document.getElementById("finish-button");

  const back = document.getElementById("back");
  back.addEventListener("click", () => {
    location.href = "game.html";
  });

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
  const loader = document.getElementById("loader");
  const content = document.getElementById("content");

  loader.style.display = "block";

  setTimeout(() => {
    loader.style.display = "none";
    content.style.display = "block";
  }, 3000);

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
