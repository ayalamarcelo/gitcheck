document.addEventListener('DOMContentLoaded', () => {
    const numStars = 150;
    const starContainer = document.getElementById('stars');
    
    for (let i = 0; i < numStars; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        const size = Math.random() * 5 + 2;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.top = `${Math.random() * 100}vh`;
        star.style.left = `${Math.random() * 100}vw`;
        star.style.animationDuration = `${Math.random() * 15 + 15}s`;
        starContainer.appendChild(star);
    }
});
