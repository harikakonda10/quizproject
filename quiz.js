// Variables
let currentQuestionIndex = 0;
let score = 0;
let timerInterval;
const timeLimitInSeconds = 30; // Set your desired time limit for each question
let timeRemaining = timeLimitInSeconds;

// Sample questions data (replace with actual questions from your backend)
const questions = [
    {
        type: 'multiple-choice',
        question: 'What is the capital of France?',
        answers: [
            { text: 'Berlin', correct: false },
            { text: 'Paris', correct: true },
            { text: 'Madrid', correct: false },
            { text: 'Rome', correct: false }
        ]
    },
    {
        type: 'true-false',
        question: 'Is the Earth round?',
        correctAnswer: true
    },
    {
        type: 'open-ended',
        question: 'What is the largest ocean?',
        correctAnswer: 'Pacific Ocean'
    }
    // Add more questions as needed
];

// Function to start the quiz
function startQuiz() {
    // Display initial question and start timer
    showQuestion(questions[currentQuestionIndex]);
    updateTimerDisplay();

    // Start the timer interval
    timerInterval = setInterval(() => {
        timeRemaining--;

        // Update the timer display
        updateTimerDisplay();

        // Check if time is up
        if (timeRemaining <= 0) {
            clearInterval(timerInterval); // Stop the timer
            handleTimeUp();
        }
    }, 1000); // Update every 1000 milliseconds (1 second)
}

// Function to display a question
function showQuestion(question) {
    const questionContainer = document.getElementById('question-container');
    questionContainer.innerHTML = '';

    // Display question text
    const questionText = document.createElement('p');
    questionText.innerText = question.question;
    questionContainer.appendChild(questionText);

    // Display answer options based on question type
    if (question.type === 'multiple-choice') {
        const answerButtons = document.createElement('ul');
        answerButtons.id = 'answer-buttons';
        question.answers.forEach(answer => {
            const button = document.createElement('li');
            button.innerText = answer.text;
            button.classList.add('btn');
            button.addEventListener('click', () => selectAnswer(answer));
            answerButtons.appendChild(button);
        });
        questionContainer.appendChild(answerButtons);
    } else if (question.type === 'true-false') {
        const trueButton = document.createElement('button');
        trueButton.innerText = 'True';
        trueButton.classList.add('btn');
        trueButton.addEventListener('click', () => selectAnswer(true));

        const falseButton = document.createElement('button');
        falseButton.innerText = 'False';
        falseButton.classList.add('btn');
        falseButton.addEventListener('click', () => selectAnswer(false));

        questionContainer.appendChild(trueButton);
        questionContainer.appendChild(falseButton);
    } else if (question.type === 'open-ended') {
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Your answer...';

        const submitButton = document.createElement('button');
        submitButton.innerText = 'Submit';
        submitButton.classList.add('btn');
        submitButton.addEventListener('click', () => selectAnswer(input.value));

        questionContainer.appendChild(input);
        questionContainer.appendChild(submitButton);
    }
}

// Function to update the timer display
function updateTimerDisplay() {
    const timerValue = document.getElementById('timer-value');
    timerValue.innerText = timeRemaining;
}

// Function to handle answer selection
function selectAnswer(answer) {
    let isCorrect;

    if (questions[currentQuestionIndex].type === 'multiple-choice') {
        isCorrect = answer.correct;
    } else if (questions[currentQuestionIndex].type === 'true-false') {
        isCorrect = answer === questions[currentQuestionIndex].correctAnswer;
    } else if (questions[currentQuestionIndex].type === 'open-ended') {
        isCorrect = answer.toLowerCase() === questions[currentQuestionIndex].correctAnswer.toLowerCase();
    }

    if (isCorrect) {
        score++;
    }

    // Reset the timer for the next question
    clearInterval(timerInterval);
    timeRemaining = timeLimitInSeconds;
    updateTimerDisplay();

    // Display feedback (you can modify this part based on your UI)
    const feedback = isCorrect ? 'Correct!' : 'Incorrect!';
    alert(feedback);

    // Move to the next question or complete the quiz
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion(questions[currentQuestionIndex]);
    } else {
        // Quiz is complete
        alert(`Quiz complete! Your score: ${score}`);
        submitResultToBackend(score);
    }
}

// Function to handle when time is up
function handleTimeUp() {
    // Your logic when the time for a question is up
    alert('Time is up! Moving to the next question.');

    // Move to the next question or complete the quiz
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion(questions[currentQuestionIndex]);
    } else {
        // Quiz is complete
        alert(`Quiz complete! Your score: ${score}`);
        submitResultToBackend(score);
    }
}

// Function to submit quiz result to the backend
function submitResultToBackend(score) {
    const userId = 'your_user_id'; // Replace with actual user ID
    const quizId = 'your_quiz_id'; // Replace with actual quiz ID

    // You may want to fetch these IDs dynamically based on your application's structure

    fetch('http://localhost:3000/submit-result', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, quizId, score }),
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // You can handle the response as needed (e.g., show a success message)

            // After submitting the result, navigate to the leaderboard page
            window.location.href = 'leaderboard.html';
        })
        .catch(error => {
            console.error('Error submitting result:', error);
            // Handle errors appropriately
        });
}

// Function to move to the next question
function nextQuestion() {
    // Move to the next question or complete the quiz
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion(questions[currentQuestionIndex]);
    } else {
        // Quiz is complete
        alert(`Quiz complete! Your score: ${score}`);
        submitResultToBackend(score);
    }
}

// Start the quiz when the page loads
document.addEventListener('DOMContentLoaded', startQuiz);
