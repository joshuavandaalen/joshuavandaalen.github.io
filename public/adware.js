// 🚨 ADWARE POPUP ENGINE 🚨
// Authentic 90s internet experience - annoying modal ads every 15 seconds!

(function () {
  const AD_INTERVAL = 15000;
  let adIndex = 0;

  const ads = [
    {
      bg: 'linear-gradient(135deg, #ff0000, #ff6600)',
      title: '🎉 CONGRATULATIONS!!! 🎉',
      body: 'You are the 1,000,000th visitor to this website!!!<br><br>Click HERE to claim your <b>FREE Sony PlayStation 2</b>!!!',
      cta: '>>> CLAIM PRIZE NOW <<<',
      small: '* Limited time offer. Must be 18+. Offer valid in participating galaxies only.',
    },
    {
      bg: 'linear-gradient(135deg, #00cc00, #009900)',
      title: '⚠️ WARNING: YOUR PC IS SLOW!! ⚠️',
      body: 'Our scan detected <b><u>847 ERRORS</u></b> on your computer!<br><br>Download <i>TurboClean Pro 98</i> to FIX your PC and make it <b>500% FASTER!!!</b>',
      cta: 'DOWNLOAD NOW - FREE!!!',
      small: 'TurboClean Pro is definitely not a virus. Trust us.',
    },
    {
      bg: 'linear-gradient(135deg, #ff00ff, #6600cc)',
      title: '💰 MAKE MONEY FAST!!! 💰',
      body: 'Local Melbourne mum earns <b>$47,000/week</b> from home using this ONE WEIRD TRICK!<br><br>Banks HATE her!!!',
      cta: 'LEARN THE SECRET >>>',
      small: 'Results not typical. Or possible. Or real.',
    },
    {
      bg: 'linear-gradient(135deg, #0066ff, #00ccff)',
      title: '🔥 HOT SINGLES IN YOUR AREA 🔥',
      body: 'There are <b>47 HOT SINGLES</b> in the Melbourne CBD who want to talk about <b>Domain-Driven Design</b> with you RIGHT NOW!!!',
      cta: 'CHAT NOW - FREE!!!',
      small: 'By "hot singles" we mean software developers with strong opinions about bounded contexts.',
    },
    {
      bg: 'linear-gradient(135deg, #ffcc00, #ff6600)',
      title: '🎵 FREE iPod Nano!!! 🎵',
      body: 'Simply complete a <b>SHORT SURVEY</b> (only 97 questions!) and receive a <b>FREE iPod Nano</b> loaded with MIDI ringtones!!!',
      cta: '>>> START SURVEY <<<',
      small: 'iPod may be a picture of an iPod. Survey has no end.',
    },
    {
      bg: 'linear-gradient(135deg, #cc0000, #880000)',
      title: '🚨 VIRUS ALERT!!! 🚨',
      body: '<b style="font-size:18px">Your computer has been infected!!!</b><br><br>We detected the <u>W32.DDD.Worm</u> virus!<br>Your files will be DELETED in <b id="adCountdown">00:47</b>!!!',
      cta: 'REMOVE VIRUS NOW!!!',
      small: 'This is definitely a real warning and not an ad at all.',
    },
    {
      bg: 'linear-gradient(135deg, #ff69b4, #ff1493)',
      title: '✨ FREE CURSOR PACK!!! ✨',
      body: 'Download <b>500+ ANIMATED CURSORS</b> for your desktop!!!<br><br>Includes: Rainbow trail, Dinosaur, Dancing Baby, and <i>Spinning Globe</i>!!!',
      cta: 'DOWNLOAD CURSORS.EXE',
      small: 'File size: 847MB. Includes 17 bonus toolbars for Internet Explorer.',
    },
    {
      bg: 'linear-gradient(135deg, #00ff00, #00aa00)',
      title: '🏆 YOU HAVE WON!!! 🏆',
      body: 'A <b>FREE TRIP TO GOLD COAST</b>!!!*<br><br>All expenses paid! 5-star resort! Just enter your credit card for <i>"verification purposes"</i>!!!',
      cta: '>>> CLAIM HOLIDAY <<<',
      small: '* Trip is to a carpark near the Gold Coast. "Free" means $9,999.',
    },
    {
      bg: 'linear-gradient(135deg, #8800ff, #4400aa)',
      title: '🔮 FREE BONZI BUDDY!!! 🔮',
      body: 'Meet your new <b>DESKTOP FRIEND</b>!!!<br><br>BonziBuddy will help you browse the web, read emails, and <b>definitely not install spyware</b>!!!',
      cta: 'INSTALL BONZIBUDDY.EXE',
      small: 'BonziBuddy sees all. BonziBuddy knows all. BonziBuddy is forever.',
    },
    {
      bg: 'linear-gradient(135deg, #ff4444, #cc0066)',
      title: '📱 NOKIA 3310 - FREE!!! 📱',
      body: 'Text <b>WIN</b> to 1-900-DDD-FREE and receive a <b>BRAND NEW NOKIA 3310</b> with <u>Snake II</u> pre-installed!!!',
      cta: '>>> GET NOKIA NOW <<<',
      small: 'Texts cost $45.00 each. You will be texted 900 times per day.',
    },
  ];

  function showAd() {
    var ad = ads[adIndex % ads.length];
    adIndex++;

    // Overlay
    var overlay = document.createElement('div');
    overlay.className = 'adware-overlay';

    // Modal window - styled like a Windows 98 dialog
    var modal = document.createElement('div');
    modal.className = 'adware-modal';

    // Random slight rotation and offset for that "stacked popups" feel
    var rot = (Math.random() - 0.5) * 6;
    var offX = (Math.random() - 0.5) * 60;
    var offY = (Math.random() - 0.5) * 40;
    modal.style.transform = 'translate(calc(-50% + ' + offX + 'px), calc(-50% + ' + offY + 'px)) rotate(' + rot + 'deg)';

    modal.innerHTML =
      '<div class="adware-titlebar">' +
        '<span class="adware-titlebar-text">Advertisement - Internet Explorer</span>' +
        '<div class="adware-titlebar-buttons">' +
          '<span class="adware-btn-min">_</span>' +
          '<span class="adware-btn-max">□</span>' +
          '<span class="adware-btn-close" id="adClose">X</span>' +
        '</div>' +
      '</div>' +
      '<div class="adware-content" style="background:' + ad.bg + '">' +
        '<div class="adware-title">' + ad.title + '</div>' +
        '<div class="adware-body">' + ad.body + '</div>' +
        '<button class="adware-cta">' + ad.cta + '</button>' +
        '<div class="adware-small">' + ad.small + '</div>' +
      '</div>';

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Entrance sound effect via Web Audio
    try {
      var ctx = new (window.AudioContext || window.webkitAudioContext)();
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.2);
    } catch (e) { /* no audio, no problem */ }

    // Close handlers
    var closeBtn = modal.querySelector('#adClose');
    closeBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      overlay.remove();
    });

    // Clicking the CTA spawns ANOTHER ad before closing
    var ctaBtn = modal.querySelector('.adware-cta');
    ctaBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      overlay.remove();
      // Spawn two more because that's how adware works
      setTimeout(showAd, 200);
      setTimeout(showAd, 600);
    });

    // Clicking overlay background closes it
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) {
        overlay.remove();
      }
    });

    // Countdown timer for the virus ad
    var countdown = modal.querySelector('#adCountdown');
    if (countdown) {
      var secs = 47;
      var timer = setInterval(function () {
        secs--;
        if (secs <= 0) { clearInterval(timer); countdown.textContent = '00:00'; return; }
        countdown.textContent = '00:' + (secs < 10 ? '0' : '') + secs;
      }, 1000);
    }
  }

  // Inject styles
  var style = document.createElement('style');
  style.textContent = [
    '.adware-overlay {',
    '  position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;',
    '  background: rgba(0,0,0,0.5);',
    '  z-index: 9999999;',
    '  display: flex; align-items: center; justify-content: center;',
    '  animation: adware-fadein 0.15s ease-out;',
    '}',
    '@keyframes adware-fadein {',
    '  from { opacity: 0; } to { opacity: 1; }',
    '}',
    '.adware-modal {',
    '  position: fixed; top: 50%; left: 50%;',
    '  transform: translate(-50%, -50%);',
    '  width: 420px; max-width: 92vw;',
    '  border: 3px outset #dfdfdf;',
    '  box-shadow: 4px 4px 0 #000, 8px 8px 20px rgba(0,0,0,0.5);',
    '  font-family: "MS Sans Serif", Tahoma, Arial, sans-serif;',
    '  animation: adware-bouncein 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);',
    '}',
    '@keyframes adware-bouncein {',
    '  0% { transform: translate(-50%,-50%) scale(0.3); opacity: 0; }',
    '  100% { transform: translate(-50%,-50%) scale(1); opacity: 1; }',
    '}',
    '.adware-titlebar {',
    '  background: linear-gradient(90deg, #000080, #1084d0);',
    '  color: white; font-size: 12px; font-weight: bold;',
    '  padding: 3px 4px; display: flex; justify-content: space-between; align-items: center;',
    '  user-select: none;',
    '}',
    '.adware-titlebar-text { flex: 1; padding-left: 2px; }',
    '.adware-titlebar-buttons { display: flex; gap: 2px; }',
    '.adware-titlebar-buttons span {',
    '  width: 16px; height: 14px; background: #c0c0c0; border: 1px outset #fff;',
    '  text-align: center; line-height: 14px; font-size: 10px; cursor: pointer;',
    '  font-family: monospace; font-weight: bold; color: #000;',
    '}',
    '.adware-titlebar-buttons span:active { border-style: inset; }',
    '.adware-btn-close:hover { background: #ff0000; color: white; }',
    '.adware-content {',
    '  padding: 20px; text-align: center; color: white;',
    '  border: 2px inset #808080;',
    '  text-shadow: 1px 1px 2px rgba(0,0,0,0.5);',
    '}',
    '.adware-title {',
    '  font-size: 22px; font-weight: bold; margin-bottom: 12px;',
    '  font-family: Impact, "Arial Black", sans-serif;',
    '  animation: adware-pulse 0.5s ease-in-out infinite alternate;',
    '  letter-spacing: 1px;',
    '}',
    '@keyframes adware-pulse {',
    '  from { transform: scale(1); text-shadow: 1px 1px 2px rgba(0,0,0,0.5); }',
    '  to { transform: scale(1.05); text-shadow: 0 0 10px #fff, 0 0 20px #fff; }',
    '}',
    '.adware-body {',
    '  font-size: 15px; line-height: 1.5; margin-bottom: 16px;',
    '  font-family: "Comic Sans MS", cursive;',
    '}',
    '.adware-cta {',
    '  display: inline-block; padding: 10px 24px;',
    '  background: linear-gradient(180deg, #ffff00, #ffcc00);',
    '  color: #cc0000; font-size: 18px; font-weight: bold;',
    '  font-family: Impact, "Arial Black", sans-serif;',
    '  border: 3px outset #ffdd00; cursor: pointer;',
    '  text-transform: uppercase; letter-spacing: 1px;',
    '  animation: adware-cta-throb 0.6s ease-in-out infinite alternate;',
    '}',
    '@keyframes adware-cta-throb {',
    '  from { transform: scale(1); box-shadow: 0 0 5px #ff0; }',
    '  to { transform: scale(1.08); box-shadow: 0 0 20px #ff0, 0 0 40px #ff6600; }',
    '}',
    '.adware-cta:hover { background: linear-gradient(180deg, #ff6600, #ff3300); color: #fff; }',
    '.adware-cta:active { border-style: inset; }',
    '.adware-small {',
    '  margin-top: 12px; font-size: 9px; opacity: 0.6;',
    '  font-family: "Times New Roman", serif; font-style: italic;',
    '}',
  ].join('\n');
  document.head.appendChild(style);

  // Start the ad engine after 15 seconds
  setTimeout(function () {
    showAd();
    setInterval(showAd, AD_INTERVAL);
  }, AD_INTERVAL);

  // Expose for manual testing: showAdNow() in console
  window.showAdNow = showAd;
})();
