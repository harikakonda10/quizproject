document.addEventListener('DOMContentLoaded', () => {
  const leaderboardList = document.getElementById('leaderboard-list');

  // Fetch leaderboard data from the backend
  fetch('http://localhost:3000/leaderboard')
      .then(response => response.json())
      .then(leaderboard => {
          // Update the UI with leaderboard data
          displayLeaderboard(leaderboard);
      })
      .catch(error => {
          console.error('Error fetching leaderboard:', error);
          // Handle errors appropriately
      });

  // Function to display leaderboard data
  function displayLeaderboard(leaderboard) {
      leaderboardList.innerHTML = '';

      leaderboard.forEach((entry, index) => {
          const listItem = document.createElement('li');
          listItem.innerText = `${index + 1}. User ID: ${entry.userId}, Score: ${entry.score}, Timestamp: ${new Date(entry.timestamp).toLocaleString()}`;
          leaderboardList.appendChild(listItem);
      });
  }
});
