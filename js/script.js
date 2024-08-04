document.getElementById('checkButton').addEventListener('click', async () => {
  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = 'Checking...';

  try {
    const response = await fetch('/api/not-following-back');
    console.log('Application received in /api/not-following-back');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const notFollowingBack = await response.json(); // Read response body as JSON

    console.log('Parsed JSON:', notFollowingBack);

    if (notFollowingBack.length) {
      resultDiv.innerHTML = '<h3>Users who do not follow you back:</h3>';
      const ul = document.createElement('ul');
      notFollowingBack.forEach(user => {
        const li = document.createElement('li');
        li.textContent = user;
        ul.appendChild(li);
      });
      resultDiv.appendChild(ul);
    } else {
      resultDiv.innerHTML = 'All the users you follow and follow you back.';
    }
  } catch (error) {
    resultDiv.innerHTML = `Error: ${error.message}`;
    console.error('Error:', error);
  }
});
