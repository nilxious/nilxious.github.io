// Title effects: particles around themed titles and the heat-wobble filter used by the burning text.
(function () {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Heat shimmer for the Fire / Necropolis lettering.
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  defs.setAttribute('width', '0'); defs.setAttribute('height', '0');
  defs.setAttribute('aria-hidden', 'true');
  defs.style.position = 'absolute';
  defs.innerHTML = '<filter id="fx-heat" x="-10%" y="-30%" width="120%" height="160%">' +
    '<feTurbulence type="fractalNoise" baseFrequency="0.02 0.09" numOctaves="2" seed="3" result="n">' +
    '<animate attributeName="baseFrequency" dur="2.4s" values="0.02 0.09;0.025 0.13;0.02 0.09" repeatCount="indefinite"/></feTurbulence>' +
    '<feDisplacementMap in="SourceGraphic" in2="n" scale="5" xChannelSelector="R" yChannelSelector="G"/></filter>' +
    '<filter id="fx-heat-sm" x="-10%" y="-30%" width="120%" height="160%">' +
    '<feTurbulence type="fractalNoise" baseFrequency="0.03 0.12" numOctaves="1" seed="5" result="n">' +
    '<animate attributeName="baseFrequency" dur="2s" values="0.03 0.12;0.035 0.16;0.03 0.12" repeatCount="indefinite"/></feTurbulence>' +
    '<feDisplacementMap in="SourceGraphic" in2="n" scale="1.6" xChannelSelector="R" yChannelSelector="G"/></filter>';
  document.body.appendChild(defs);
  document.documentElement.classList.add('fx-live');

  // theme -> [particle kinds, particles per second, animation]
  const kinds = {
    'fire-dungeon': [['ember'], 9, 'fx-rise'],
    'necropolis-dungeon': [['soul', 'soul', 'soul', 'skull'], 7, 'fx-rise'],
    'little-wilds': [['leaf'], 2.2, 'fx-fall'],
    'anime-village': [['petal'], 3, 'fx-fall'],
    'haunted-mansion': [['wisp'], 2.5, 'fx-float'],
    'ghostly-village': [['wisp'], 3, 'fx-float'],
    'steal-an-x': [['spark'], 2.5, 'fx-twinkle'],
    'fantasy-lobby': [['sparkle'], 3, 'fx-twinkle'],
    'rpg-environments': [['sparkle'], 2.5, 'fx-twinkle'],
    'miner-s-equilibrium': [['sparkle'], 2.5, 'fx-twinkle'],
    'prospecting-style-build': [['sparkle', 'spark'], 4, 'fx-twinkle'],
    'coastal-village': [['bubble'], 3, 'fx-float'],
    'dungeons': [['spark'], 3, 'fx-rise'],
    'armor-sets': [['spark'], 2.5, 'fx-twinkle'],
    'weapons': [['spark'], 2.5, 'fx-twinkle'],
    'dungeon-crawler-lobby': [['ember'], 3, 'fx-rise'],
    'dungeon-crawler-lobby-ii': [['ember'], 3, 'fx-rise'],
  };
  const rand = (a, b) => a + Math.random() * (b - a);

  function emitter(title, theme) {
    const conf = kinds[theme];
    if (!conf) return null;
    const layer = document.createElement('span');
    layer.className = 'fx-layer';
    layer.setAttribute('aria-hidden', 'true');
    title.appendChild(layer);
    const [types, rate, anim] = conf;
    let timer = 0;
    function spawn() {
      const p = document.createElement('i');
      const type = types[Math.floor(Math.random() * types.length)];
      const twinkle = anim === 'fx-twinkle';
      const falling = anim === 'fx-fall';
      p.className = 'fx-p ' + type;
      p.style.cssText =
        `--x:${rand(-2, 98)}%;--s:${type === 'skull' ? rand(.28, .4) : type === 'leaf' || type === 'petal' ? rand(.2, .3) : rand(.1, .2)}em;` +
        `--d:${twinkle ? rand(.8, 1.4) : falling ? rand(2.2, 3.4) : rand(1.1, 2)}s;--dx:${rand(-.5, .5)}em;--r:${rand(-260, 260)}deg;` +
        `--anim:${type === 'skull' ? 'fx-skull' : anim};` + (twinkle ? `bottom:${rand(0, 90)}%;` : '');
      p.addEventListener('animationend', () => p.remove());
      layer.appendChild(p);
    }
    return {
      start() { if (!timer && !document.hidden) timer = setInterval(spawn, 1000 / rate); },
      stop() { clearInterval(timer); timer = 0; },
    };
  }

  const running = [];
  // Project pages: the page title runs all the time.
  document.querySelectorAll('.project[data-theme]').forEach((article) => {
    const h1 = article.querySelector('.project-title h1');
    const e = h1 && emitter(h1, article.dataset.theme);
    if (e) { e.start(); running.push(e); }
  });
  // Cards: only while hovered or focused (fire and necropolis cards always burn).
  document.querySelectorAll('.card[data-theme]').forEach((card) => {
    const h3 = card.querySelector('h3');
    const e = h3 && emitter(h3, card.dataset.theme);
    if (!e) return;
    if (/^(fire|necropolis)-dungeon$/.test(card.dataset.theme)) { e.start(); running.push(e); return; }
    card.addEventListener('pointerenter', e.start);
    card.addEventListener('focus', e.start);
    card.addEventListener('pointerleave', e.stop);
    card.addEventListener('blur', e.stop);
  });
  // Pause when the tab is hidden.
  document.addEventListener('visibilitychange', () => running.forEach((e) => (document.hidden ? e.stop() : e.start())));
})();
