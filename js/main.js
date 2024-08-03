document.getElementById('checkButton').addEventListener('click', async () => {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = 'Checking...';
  
    try {
      const response = await fetch('/api/not-following-back');
      const notFollowingBack = await response.json();
  
      if (notFollowingBack.length) {
        resultDiv.innerHTML = '<h3>Usuarios que no te siguen de vuelta:</h3>';
        const ul = document.createElement('ul');
        notFollowingBack.forEach(user => {
          const li = document.createElement('li');
          li.textContent = user;
          ul.appendChild(li);
        });
        resultDiv.appendChild(ul);
      } else {
        resultDiv.innerHTML = 'Todos los usuarios a los que sigues te siguen de vuelta.';
      }
    } catch (error) {
      resultDiv.innerHTML = `Error: ${error.message}`;
    }
  });