document.addEventListener('DOMContentLoaded', () => {
  const resultMessage = document.getElementById('result-message');

  // Fetch the result from the backend (you may need to pass the user ID or quiz ID)
  fetch('http://localhost:3000/fetch-result?userId=your_user_id&quizId=your_quiz_id')
      .then(response => response.json())
      .then(data => {
          if (data.success) {
              resultMessage.innerText = `Your score: ${data.score}`;
          } else {
              resultMessage.innerText = 'Failed to fetch result.';
          }
      })
      .catch(error => {
          console.error('Error fetching result:', error);
          resultMessage.innerText = 'An error occurred while fetching the result.';
      });
});
