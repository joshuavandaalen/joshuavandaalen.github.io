// 🦄 UNICORN CURSOR FOLLOWER WITH RAINBOW TRAIL 🦄

(function () {
  var unicorn = document.createElement('div');
  unicorn.className = 'unicorn-follower';
  unicorn.innerHTML = '🦄';
  document.body.appendChild(unicorn);

  var mouseX = -100, mouseY = -100;
  var uniX = -100, uniY = -100;
  var trail = [];
  var MAX_TRAIL = 20;
  var RAINBOW = ['#ff0000','#ff8800','#ffff00','#00ff00','#0088ff','#8800ff','#ff00ff'];

  // Pre-create trail dots
  for (var i = 0; i < MAX_TRAIL; i++) {
    var dot = document.createElement('div');
    dot.className = 'rainbow-dot';
    dot.style.background = RAINBOW[i % RAINBOW.length];
    dot.style.opacity = (1 - i / MAX_TRAIL).toFixed(2);
    var size = Math.max(4, 14 - i);
    dot.style.width = size + 'px';
    dot.style.height = size + 'px';
    document.body.appendChild(dot);
    trail.push({ el: dot, x: -100, y: -100 });
  }

  document.addEventListener('mousemove', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animate() {
    // Smooth follow with easing
    uniX += (mouseX - uniX) * 0.12;
    uniY += (mouseY - uniY) * 0.12;

    // Flip unicorn based on movement direction
    var dx = mouseX - uniX;
    unicorn.style.transform = dx < -1 ? 'scaleX(-1)' : 'scaleX(1)';

    unicorn.style.left = (uniX + 10) + 'px';
    unicorn.style.top = (uniY - 20) + 'px';

    // Shift trail positions down the chain
    for (var i = trail.length - 1; i > 0; i--) {
      trail[i].x = trail[i - 1].x;
      trail[i].y = trail[i - 1].y;
    }
    trail[0].x = uniX;
    trail[0].y = uniY;

    for (var j = 0; j < trail.length; j++) {
      trail[j].el.style.left = trail[j].x + 'px';
      trail[j].el.style.top = trail[j].y + 'px';
    }

    requestAnimationFrame(animate);
  }

  // Inject styles
  var style = document.createElement('style');
  style.textContent = [
    '.unicorn-follower {',
    '  position: fixed; pointer-events: none; z-index: 999998;',
    '  font-size: 32px; transition: none;',
    '  filter: drop-shadow(0 0 6px rgba(255,100,255,0.7));',
    '  animation: unicorn-bob 0.6s ease-in-out infinite alternate;',
    '}',
    '@keyframes unicorn-bob {',
    '  from { margin-top: 0; }',
    '  to { margin-top: -6px; }',
    '}',
    '.rainbow-dot {',
    '  position: fixed; pointer-events: none; z-index: 999997;',
    '  border-radius: 50%;',
    '  box-shadow: 0 0 4px currentColor;',
    '  transition: none;',
    '}',
  ].join('\n');
  document.head.appendChild(style);

  requestAnimationFrame(animate);
})();
