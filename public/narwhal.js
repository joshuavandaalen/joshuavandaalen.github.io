// 🐋 NARWHAL + COPILOT RIDER ANIMATION 🐋
// Every 3 minutes, a narwhal leaps across the screen with a Copilot riding it!

(function() {
  const INTERVAL_MS = 3 * 60 * 1000; // 3 minutes
  const FLIGHT_DURATION = 4000; // 4 seconds to cross screen

  function createNarwhal() {
    // Container for the whole narwhal scene
    const scene = document.createElement('div');
    scene.className = 'narwhal-scene';

    scene.innerHTML = `
      <div class="narwhal-group">
        <!-- Water splash behind -->
        <div class="narwhal-splash">💦</div>
        
        <!-- Copilot rider -->
        <div class="copilot-rider">
          <div class="copilot-body">
            <div class="copilot-visor">◈</div>
            <div class="copilot-cape"></div>
          </div>
          <div class="copilot-arms">🤘</div>
        </div>

        <!-- Narwhal body -->
        <div class="narwhal-body">
          <div class="narwhal-horn"></div>
          <div class="narwhal-head">
            <div class="narwhal-eye"></div>
            <div class="narwhal-mouth"></div>
            <div class="narwhal-spot spot1"></div>
            <div class="narwhal-spot spot2"></div>
            <div class="narwhal-spot spot3"></div>
          </div>
          <div class="narwhal-belly"></div>
          <div class="narwhal-flipper"></div>
          <div class="narwhal-tail">
            <div class="narwhal-tail-top"></div>
            <div class="narwhal-tail-bottom"></div>
          </div>
        </div>

        <!-- Rainbow trail -->
        <div class="narwhal-rainbow"></div>

        <!-- Sparkle particles -->
        <div class="narwhal-sparkles">
          <span class="nsparkle" style="top:-10px;left:20px;animation-delay:0s">✨</span>
          <span class="nsparkle" style="top:15px;left:-10px;animation-delay:0.3s">⭐</span>
          <span class="nsparkle" style="top:-20px;left:50px;animation-delay:0.6s">💫</span>
          <span class="nsparkle" style="top:30px;left:0px;animation-delay:0.2s">✨</span>
          <span class="nsparkle" style="top:-5px;left:70px;animation-delay:0.8s">🌟</span>
        </div>
      </div>
    `;

    document.body.appendChild(scene);

    // Remove after animation completes
    setTimeout(() => {
      scene.remove();
    }, FLIGHT_DURATION + 500);
  }

  // Inject styles
  const style = document.createElement('style');
  style.textContent = `
    .narwhal-scene {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 999999;
      overflow: hidden;
    }

    .narwhal-group {
      position: absolute;
      left: -200px;
      top: 50%;
      animation: narwhal-fly ${FLIGHT_DURATION}ms cubic-bezier(0.25, 0.1, 0.25, 1) forwards;
    }

    @keyframes narwhal-fly {
      0%   { left: -250px; top: 90%;  transform: rotate(-30deg); }
      25%  { left: 25vw;   top: 20%;  transform: rotate(-10deg); }
      50%  { left: 50vw;   top: 10%;  transform: rotate(5deg); }
      75%  { left: 75vw;   top: 25%;  transform: rotate(15deg); }
      100% { left: 110vw;  top: 85%;  transform: rotate(30deg); }
    }

    /* === NARWHAL BODY === */
    .narwhal-body {
      position: relative;
      width: 160px;
      height: 70px;
      background: linear-gradient(180deg, #7eb8d0 0%, #a8d8ea 40%, #d4ecf7 100%);
      border-radius: 80px 60px 50px 70px;
      box-shadow: 0 0 15px rgba(126, 184, 208, 0.6), inset 0 -5px 10px rgba(0,0,0,0.1);
    }

    .narwhal-horn {
      position: absolute;
      top: 10px;
      left: -45px;
      width: 50px;
      height: 6px;
      background: linear-gradient(90deg, #f0d060, #ffe98a, #f0d060, #ffe98a);
      border-radius: 3px 0 0 3px;
      transform: rotate(-8deg);
      transform-origin: right center;
      box-shadow: 0 0 8px rgba(240, 208, 96, 0.8);
      background-size: 12px 6px;
    }

    .narwhal-head {
      position: absolute;
      left: -10px;
      top: 5px;
      width: 60px;
      height: 55px;
      background: linear-gradient(180deg, #7eb8d0, #a8d8ea);
      border-radius: 50% 30% 40% 50%;
    }

    .narwhal-eye {
      position: absolute;
      top: 16px;
      left: 18px;
      width: 12px;
      height: 14px;
      background: #1a1a2e;
      border-radius: 50%;
      box-shadow: inset 2px 2px 0 3px #1a1a2e, 3px -2px 0 1px white;
    }

    .narwhal-mouth {
      position: absolute;
      top: 35px;
      left: 10px;
      width: 16px;
      height: 8px;
      border-bottom: 3px solid #5a8a9a;
      border-radius: 0 0 50% 50%;
    }

    .narwhal-spot {
      position: absolute;
      background: rgba(255,255,255,0.4);
      border-radius: 50%;
    }
    .spot1 { width: 8px; height: 8px; top: 15px; left: 70px; }
    .spot2 { width: 12px; height: 10px; top: 25px; left: 95px; }
    .spot3 { width: 6px; height: 6px; top: 10px; left: 115px; }

    .narwhal-belly {
      position: absolute;
      bottom: 0;
      left: 20px;
      width: 120px;
      height: 30px;
      background: linear-gradient(180deg, transparent, rgba(255,255,255,0.3));
      border-radius: 0 0 50px 40px;
    }

    .narwhal-flipper {
      position: absolute;
      bottom: -8px;
      left: 50px;
      width: 30px;
      height: 18px;
      background: #6aa8bc;
      border-radius: 0 0 60% 40%;
      transform: rotate(15deg);
      animation: flipper-wave 0.4s ease-in-out infinite alternate;
    }

    @keyframes flipper-wave {
      from { transform: rotate(10deg); }
      to   { transform: rotate(25deg); }
    }

    .narwhal-tail {
      position: absolute;
      right: -30px;
      top: 10px;
    }

    .narwhal-tail-top, .narwhal-tail-bottom {
      width: 30px;
      height: 20px;
      background: #7eb8d0;
    }

    .narwhal-tail-top {
      border-radius: 0 80% 0 0;
      transform: rotate(-10deg);
    }
    .narwhal-tail-bottom {
      border-radius: 0 0 80% 0;
      transform: rotate(10deg);
      margin-top: -5px;
    }

    /* === COPILOT RIDER === */
    .copilot-rider {
      position: absolute;
      top: -50px;
      left: 40px;
      animation: copilot-bounce 0.5s ease-in-out infinite alternate;
    }

    @keyframes copilot-bounce {
      from { transform: translateY(0); }
      to   { transform: translateY(-5px); }
    }

    .copilot-body {
      position: relative;
      width: 30px;
      height: 30px;
      background: linear-gradient(135deg, #1f6feb, #58a6ff);
      border-radius: 50% 50% 45% 45%;
      border: 2px solid #0d419d;
      box-shadow: 0 0 10px rgba(31, 111, 235, 0.5);
    }

    .copilot-visor {
      position: absolute;
      top: 6px;
      left: 3px;
      width: 24px;
      height: 14px;
      background: linear-gradient(180deg, #ff6b6b, #ff8e53);
      border-radius: 12px 12px 8px 8px;
      border: 2px solid #0d419d;
      font-size: 10px;
      text-align: center;
      line-height: 14px;
      color: white;
      text-shadow: 0 0 4px rgba(255,255,255,0.8);
      box-shadow: 0 0 6px rgba(255, 107, 107, 0.6);
    }

    .copilot-cape {
      position: absolute;
      top: 15px;
      right: -12px;
      width: 20px;
      height: 25px;
      background: linear-gradient(135deg, #6f42c1, #8b5cf6);
      clip-path: polygon(0 0, 100% 20%, 80% 100%, 0% 70%);
      animation: cape-flutter 0.3s ease-in-out infinite alternate;
      box-shadow: 0 0 8px rgba(111, 66, 193, 0.4);
    }

    @keyframes cape-flutter {
      from { transform: skewY(0deg) scaleX(1); }
      to   { transform: skewY(5deg) scaleX(1.1); }
    }

    .copilot-arms {
      position: absolute;
      top: -2px;
      left: 28px;
      font-size: 14px;
      animation: arms-pump 0.3s ease-in-out infinite alternate;
    }

    @keyframes arms-pump {
      from { transform: rotate(-10deg); }
      to   { transform: rotate(10deg); }
    }

    /* === RAINBOW TRAIL === */
    .narwhal-rainbow {
      position: absolute;
      top: 10px;
      right: -80px;
      width: 80px;
      height: 50px;
      background: linear-gradient(
        180deg,
        #ff0000 0%, #ff0000 14%,
        #ff8800 14%, #ff8800 28%,
        #ffff00 28%, #ffff00 42%,
        #00ff00 42%, #00ff00 57%,
        #0088ff 57%, #0088ff 71%,
        #8800ff 71%, #8800ff 85%,
        #ff00ff 85%, #ff00ff 100%
      );
      border-radius: 0 25px 25px 0;
      opacity: 0.7;
      animation: rainbow-trail 0.2s linear infinite;
    }

    @keyframes rainbow-trail {
      0%   { opacity: 0.5; width: 70px; }
      50%  { opacity: 0.8; width: 90px; }
      100% { opacity: 0.5; width: 70px; }
    }

    /* === SPLASH === */
    .narwhal-splash {
      position: absolute;
      bottom: -20px;
      left: -20px;
      font-size: 28px;
      animation: splash-wiggle 0.3s ease-in-out infinite alternate;
    }

    @keyframes splash-wiggle {
      from { transform: rotate(-15deg) scale(1); }
      to   { transform: rotate(15deg) scale(1.2); }
    }

    /* === SPARKLES === */
    .narwhal-sparkles {
      position: absolute;
      top: 0;
      left: 0;
    }

    .nsparkle {
      position: absolute;
      font-size: 16px;
      animation: nsparkle-fade 1s ease-in-out infinite;
    }

    @keyframes nsparkle-fade {
      0%   { opacity: 1; transform: scale(1) translateY(0); }
      50%  { opacity: 0.3; transform: scale(0.5) translateY(-10px); }
      100% { opacity: 1; transform: scale(1) translateY(0); }
    }
  `;
  document.head.appendChild(style);

  // First one after 10 seconds (so user sees it quickly for testing), then every 3 min
  setTimeout(() => {
    createNarwhal();
    setInterval(createNarwhal, INTERVAL_MS);
  }, 10000);

  // Also expose for manual testing: narwhalNow() in console
  window.narwhalNow = createNarwhal;
})();
