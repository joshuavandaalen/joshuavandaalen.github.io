// DDD Melbourne - 90s JavaScript Magic! ✨

// Visitor counter
async function updateVisitorCount() {
    try {
        const response = await fetch('/api/visitors');
        const data = await response.json();
        const counterElement = document.getElementById('visitor-count');
        
        if (counterElement) {
            // Pad the number with leading zeros for that retro counter look
            const formattedCount = data.count.toString().padStart(6, '0');
            counterElement.textContent = formattedCount;
            
            // Animate the counter
            counterElement.style.animation = 'none';
            setTimeout(() => {
                counterElement.style.animation = 'counter-spin 0.5s ease-out';
            }, 10);
        }
    } catch (error) {
        console.log('Could not load visitor count:', error);
        const counterElement = document.getElementById('visitor-count');
        if (counterElement) {
            counterElement.textContent = '123456'; // Fallback retro number
        }
    }
}

// Add counter spin animation
const style = document.createElement('style');
style.textContent = `
    @keyframes counter-spin {
        0% { transform: rotateY(0deg); }
        50% { transform: rotateY(180deg); }
        100% { transform: rotateY(360deg); }
    }
`;
document.head.appendChild(style);

// Random sparkle effect
function createSparkle() {
    const sparkle = document.createElement('div');
    sparkle.textContent = '✨';
    sparkle.style.position = 'fixed';
    sparkle.style.left = Math.random() * window.innerWidth + 'px';
    sparkle.style.top = Math.random() * window.innerHeight + 'px';
    sparkle.style.fontSize = (Math.random() * 20 + 10) + 'px';
    sparkle.style.pointerEvents = 'none';
    sparkle.style.zIndex = '9999';
    sparkle.style.animation = 'sparkle-fade 2s ease-out forwards';
    
    document.body.appendChild(sparkle);
    
    setTimeout(() => {
        sparkle.remove();
    }, 2000);
}

// Add sparkle animation
const sparkleStyle = document.createElement('style');
sparkleStyle.textContent = `
    @keyframes sparkle-fade {
        0% {
            opacity: 1;
            transform: scale(0) rotate(0deg);
        }
        50% {
            opacity: 1;
            transform: scale(1.5) rotate(180deg);
        }
        100% {
            opacity: 0;
            transform: scale(0) rotate(360deg);
        }
    }
`;
document.head.appendChild(sparkleStyle);

// Create sparkles occasionally
setInterval(createSparkle, 3000);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateVisitorCount();
    
    // Add some initial sparkles
    for (let i = 0; i < 3; i++) {
        setTimeout(createSparkle, i * 500);
    }
    
    // Easter egg: Konami code
    let konamiCode = [];
    const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    
    document.addEventListener('keydown', (e) => {
        konamiCode.push(e.key);
        konamiCode = konamiCode.slice(-10);
        
        if (konamiCode.join(',') === konamiSequence.join(',')) {
            activateMaximum90sMode();
        }
    });
});

// Secret maximum 90s mode
function activateMaximum90sMode() {
    alert('🎉 MAXIMUM 90s MODE ACTIVATED! 🎉');
    
    // Make EVERYTHING blink
    const everything = document.querySelectorAll('*');
    everything.forEach((el, index) => {
        setTimeout(() => {
            if (Math.random() > 0.7) {
                el.style.animation = 'blink-animation 0.5s steps(2, start) infinite';
            }
        }, index * 10);
    });
    
    // Spawn sparkles like crazy
    for (let i = 0; i < 50; i++) {
        setTimeout(createSparkle, i * 100);
    }
    
    // Add Comic Sans to EVERYTHING
    document.body.style.fontFamily = "'Comic Sans MS', cursive";
}

// Random color text effect for headers (optional fun)
function rainbowifyText(element) {
    const text = element.textContent;
    element.innerHTML = '';
    
    const colors = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3'];
    
    for (let i = 0; i < text.length; i++) {
        const span = document.createElement('span');
        span.textContent = text[i];
        span.style.color = colors[i % colors.length];
        span.style.display = 'inline-block';
        span.style.animation = `rainbow-wave 2s ease-in-out ${i * 0.1}s infinite`;
        element.appendChild(span);
    }
}

// Add wave animation
const waveStyle = document.createElement('style');
waveStyle.textContent = `
    @keyframes rainbow-wave {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
    }
`;
document.head.appendChild(waveStyle);

// Console Easter egg
console.log('%c🌟 Welcome to DDD Melbourne! 🌟', 'font-size: 24px; color: #FF00FF; background: #FFFF00; padding: 10px;');
console.log('%cYou found the secret developer console!', 'font-size: 16px; color: #00FF00;');
console.log('%cTry the Konami Code: ↑ ↑ ↓ ↓ ← → ← → B A', 'font-size: 14px; color: #00FFFF;');
