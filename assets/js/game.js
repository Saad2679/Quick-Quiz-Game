async function fetchQuestions() {
    try {
        const response = await fetch('assets/questions.json');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching questions:', error);
    }
  }
  
  let questions = [];
  let currentQuestionIndex = 0;
  let score = 0;
  const maxQuestions = 4;
  
  async function setupGame() {
    questions = await fetchQuestions();
    if (questions && questions.length > 0) {
        questions = shuffleArray(questions).slice(0, maxQuestions);
        showQuestion(questions[currentQuestionIndex]);
        document.getElementById('game').classList.remove('hidden');
        document.getElementById('loader').classList.add('hidden');
        updateHud();
    } else {
        console.error('No questions available');
    }
  }
  
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  
  function showQuestion(question) {
    if (!question) return;
  
    document.getElementById('question').innerText = question.question;
  
    const choices = document.querySelectorAll('.choice');
    choices.forEach((choice, index) => {
        choice.innerText = `${String.fromCharCode(65 + index)}. ${question[`choice${index + 1}`]}`;
        choice.onclick = () => handleAnswer(index + 1, choice);
    });
  }
  
  function handleAnswer(selectedAnswer, selectedChoice) {
    const question = questions[currentQuestionIndex];
    const choices = document.querySelectorAll('.choice');
    choices.forEach(choice => choice.disabled = true);
  
    if (selectedAnswer === question.answer) {
        selectedChoice.classList.add('correct');
        score += 100;
        updateScore();
    } else {
        selectedChoice.classList.add('incorrect');
        choices[question.answer - 1].classList.add('correct');
    }
  
    setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            showQuestion(questions[currentQuestionIndex]);
            choices.forEach(choice => choice.disabled = false);
            choices.forEach(choice => choice.classList.remove('correct', 'incorrect'));
            updateHud();
        } else {
            endGame();
        }
    }, 1000);
  }
  
  function updateHud() {
    const progressText = document.getElementById('progressText');
    progressText.innerText = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
  }
  
  function updateScore() {
    const scoreText = document.getElementById('score');
    scoreText.innerText = `Score: ${score}`;
  }
  
  function endGame() {
    window.location.href = `end.html?score=${score}`;
  }
  
  setupGame();
  