// 🌙☀️ DARK MODE TOGGLE - 90s STYLE 🌙☀️
(function () {
  var isDark = localStorage.getItem('ddd-dark-mode') !== 'light';

  // Create toggle widget
  var toggle = document.createElement('div');
  toggle.className = 'darkmode-toggle';
  toggle.innerHTML =
    '<div class="darkmode-label">MODE:</div>' +
    '<button class="darkmode-btn" id="darkmodeBtn">' +
      (isDark ? '☀️ LIGHT' : '🌙 DARK') +
    '</button>';
  document.body.appendChild(toggle);

  function applyMode() {
    if (isDark) {
      document.body.classList.remove('light-mode');
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
      document.body.classList.add('light-mode');
    }
    var btn = document.getElementById('darkmodeBtn');
    if (btn) btn.textContent = isDark ? '☀️ LIGHT' : '🌙 DARK';
  }

  document.getElementById('darkmodeBtn').addEventListener('click', function () {
    isDark = !isDark;
    localStorage.setItem('ddd-dark-mode', isDark ? 'dark' : 'light');
    applyMode();
  });

  applyMode();

  // Inject styles
  var style = document.createElement('style');
  style.textContent = [
    '.darkmode-toggle {',
    '  position: fixed; top: 12px; right: 12px; z-index: 999998;',
    '  background: #c0c0c0; border: 2px outset #fff;',
    '  padding: 4px 8px; font-family: "MS Sans Serif", Tahoma, Arial, sans-serif;',
    '  box-shadow: 2px 2px 0 #000; display: flex; align-items: center; gap: 6px;',
    '}',
    '.darkmode-label {',
    '  font-size: 10px; font-weight: bold; color: #000;',
    '}',
    '.darkmode-btn {',
    '  background: linear-gradient(180deg, #fff, #c0c0c0);',
    '  border: 2px outset #fff; padding: 2px 10px; cursor: pointer;',
    '  font-size: 11px; font-weight: bold; font-family: "MS Sans Serif", Tahoma, Arial, sans-serif;',
    '}',
    '.darkmode-btn:active { border-style: inset; }',
    '',
    '/* === LIGHT MODE OVERRIDES === */',
    'body.light-mode { background: #ffffff !important; }',
    'body.light-mode .stars { background: none !important; opacity: 0 !important; }',
    'body.light-mode .container {',
    '  background: repeating-conic-gradient(#f0f0f0 0% 25%, #ffffff 0% 50%) 0 0 / 20px 20px;',
    '}',
    'body.light-mode .content-box {',
    '  background: #ffffcc !important;',
    '  border-color: #cc9900 !important;',
    '  color: #000080 !important;',
    '}',
    'body.light-mode .content-box p,',
    'body.light-mode .content-box span,',
    'body.light-mode .content-box div,',
    'body.light-mode .content-box a,',
    'body.light-mode .content-box li,',
    'body.light-mode .content-box td,',
    'body.light-mode .content-box th,',
    'body.light-mode .content-box h4 {',
    '  color: #000080 !important;',
    '}',
    'body.light-mode .section-title { color: #cc0000 !important; text-shadow: 1px 1px 0 #ffcc00 !important; }',
    'body.light-mode .highlight { color: #cc0000 !important; }',
    'body.light-mode .highlight-box { background: #ccffcc !important; border-color: #009900 !important; }',
    'body.light-mode .highlight-box p,',
    'body.light-mode .highlight-box span,',
    'body.light-mode .highlight-box div { color: #006600 !important; }',
    'body.light-mode .site-header { background: linear-gradient(180deg, #ffcc00, #ff9900) !important; }',
    'body.light-mode .glowing-title { color: #cc0000 !important; text-shadow: 2px 2px 0 #ffcc00 !important; }',
    'body.light-mode .subtitle-container { color: #000080 !important; }',
    'body.light-mode .site-footer { background: #000080 !important; }',
    'body.light-mode .date-details h3 { color: #cc0000 !important; }',
    'body.light-mode .sponsor-card { background: #ffffff !important; border-color: #cc9900 !important; }',
    'body.light-mode .sponsor-name { color: #000080 !important; }',
    'body.light-mode .retro-link { color: #cc0000 !important; }',
    'body.light-mode .intro-text { color: #000080 !important; }',
    'body.light-mode .fun-text { color: #000080 !important; }',
    'body.light-mode .browser-banner { background: #ffcc00 !important; color: #000 !important; }',
    'body.light-mode .browser-banner .blink { color: #cc0000 !important; }',
    'body.light-mode .flash-banner { background: linear-gradient(135deg, #ff9900, #ffcc00, #ff9900) !important; }',
    'body.light-mode .flash-text { color: #cc0000 !important; text-shadow: 2px 2px 0 #ffcc00 !important; }',
    'body.light-mode .flash-subtext { color: #000080 !important; }',
    'body.light-mode .construction-text { color: #cc0000 !important; }',
    'body.light-mode .anca-banner { background: linear-gradient(180deg, #fff8e0, #ffffcc) !important; border-color: #cc0000 !important; }',
    'body.light-mode .anca-logo-text { color: #cc0000 !important; text-shadow: 2px 2px 0 #990000 !important; }',
    'body.light-mode .anca-logo-sub { color: #333 !important; }',
    'body.light-mode .anca-details { color: #333 !important; }',
    'body.light-mode .anca-badge { background: #fff !important; color: #cc0000 !important; }',
    '',
    '/* Agenda table light mode */',
    'body.light-mode .agenda-table th { color: #fff !important; }',
    'body.light-mode .session-card { background: #ffffff !important; border-color: #cc9900 !important; }',
    'body.light-mode .session-title { color: #000080 !important; }',
    'body.light-mode .session-speaker { color: #006600 !important; }',
  ].join('\n');
  document.head.appendChild(style);
})();
