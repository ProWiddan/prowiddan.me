/* prowiddan.me — macOS Tahoe Engine Refined */

const DISCORD_ID = '1175860358104219710';
const MACOS_ICONS = {
  folder: 'https://s3.macosicons.com/macosicons/icons/wXACI5GsEd/lowResPngFile_9d588459b96594f563889f10f1002539_wXACI5GsEd.png',
  finder: 'https://s3.macosicons.com/macosicons/icons/bhhvTp8oqu/lowResPngFile_8f73531df26c05ab58877c5f889f84cd_bhhvTp8oqu.png',
  safari: 'https://s3.macosicons.com/macosicons/icons/LWzZ6l63vI/lowResPngFile_a1dd6c2143868c36ab74dc1129da983b_LWzZ6l63vI.png',
  mail: 'https://s3.macosicons.com/macosicons/icons/OABVbEbk1D/lowResPngFile_1b3cda920534d66fcf25849afdeee35b_low_res_Mail__MacOS_Tahoe_.png',
  notes: 'https://s3.macosicons.com/macosicons/icons/aRx5cGokA4/lowResPngFile_3775aa86374eb5aa9ba0450d5c9d7794_aRx5cGokA4.png',
  calculator: 'https://s3.macosicons.com/macosicons/icons/0AdfjY0BQw/lowResPngFile_59c4de81f50281ea69caf6766ba65f39_0AdfjY0BQw.png',
  settings: 'https://s3.macosicons.com/macosicons/icons/4FTDfMVfPo/lowResPngFile_cf42e4b2bb0951eaeac99d7fdd84865b_low_res_Settings.png',
  launchpad: 'https://s3.macosicons.com/macosicons/icons/ncy8MiCAOA/lowResPngFile_0f531e205b4ebaf7ab0b01d1bd6040cb_low_res_Launchpad__MacOS_Tahoe_.png',
  terminal: 'https://s3.macosicons.com/macosicons/icons/pqhtMOGG97/lowResPngFile_44521cff49a09db9c074eaba5b796ab8_pqhtMOGG97.png',
  spotify: 'https://s3.macosicons.com/macosicons/icons/AiVIJCBk89/lowResPngFile_8d99b5f5dec64894fe0f92479fd69be2_AiVIJCBk89.png',
  github: 'https://s3.macosicons.com/macosicons/icons/AhTpsJCAbn/lowResPngFile_f024fedc7c28b04afb3e45d69ad10be2_low_res_GitHub_Desktop__clear__dark_.png',
  discord: 'https://s3.macosicons.com/macosicons/icons/VGpMiSdUqI/lowResPngFile_8dbf13cc942b8032b823a9b77db7735e_low_res_Discord__Dark___macOS_26.2__.png',
  pdf: 'https://cdn-icons-png.flaticon.com/512/337/337946.png',
  camera: 'https://s3.macosicons.com/macosicons/icons/YkTXCN5mt2/lowResPngFile_1eb2d288e5a796340bfe57dbffdd8206_low_res_Camera_Photo_Booth__iOS_18_Dark_.png',
  chess: 'https://s3.macosicons.com/macosicons/icons/mkFov9ZvXG/lowResPngFile_dc2f0a8c2e0aa37c93fcc10d9cc13754_low_res_Chess__Chess.com_.png',
  achievements: 'https://cdn-icons-png.flaticon.com/512/3112/3112946.png',
  calendar: 'https://s3.macosicons.com/macosicons/icons/XP2RCmzU3F/lowResPngFile_0e7336c7e247fc8640d63def8958d82e_low_res_Google_Calender.png'
};
const GITHUB_USER = 'ProWiddan';
const LANYARD_REST = 'https://api.lanyard.rest/v1/users/';
const LANYARD_WS = 'wss://api.lanyard.rest/socket';

let zIdx = 1000, activeWin = null, dragState = null, winPos = {};
let openWindows = new Set();
let finderHistory = ['recent'], finderIdx = 0;
let currentFinderPath = 'recent';
let finderViewMode = 'list';
let widgetCalDate = new Date();
let calcDisplay = '0', calcOp = '', calcPrev = 0, calcReset = false;
let safariTabs = [
  { id: 1, title: 'Instagram', url: 'instagram.com/sujayram_prasad', active: true },
  { id: 2, title: 'GitHub', url: 'github.com/ProWiddan', active: false },
  { id: 3, title: 'Discord', url: 'discord.com', active: false },
  { id: 4, title: 'LinkedIn', url: 'linkedin.com/in/sujayram-prasad-0b5a61282', active: false },
  { id: 5, title: 'X / Twitter', url: 'x.com/SujayramPrasad', active: false }
];

/* ====================== INIT ====================== */
document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
  initBoot(); initClock(); initCalendar(); initTerminal();
  initDockMag(); initMenuBar(); initGitHub();
  initLanyard(); initSettings(); initSafari(); initYouTube();
  applyAllSettings();
  initNotes();
  refreshDock();
  const finderSearch = document.getElementById('finder-search');
  if (finderSearch) { finderSearch.addEventListener('input', () => renderFinder()); }
  navigateFinder('recent');
  initLaunchpad();

  // Real-time Optimization: Performance Ticks
  requestAnimationFrame(function performanceTick() {
    // Sync any high-frequency UI updates here
    requestAnimationFrame(performanceTick);
  });


  // macOS Context Menu Logic
  const ctxMenu = document.getElementById('context-menu');
  document.addEventListener('contextmenu', e => {
    e.preventDefault();
    closeAllMenus();

    if (ctxMenu) {
      ctxMenu.classList.add('open');

      // Position menu
      let x = e.clientX;
      let y = e.clientY;

      // Prevent overflow
      if (x + 180 > window.innerWidth) x -= 180;
      if (y + ctxMenu.offsetHeight > window.innerHeight) y -= ctxMenu.offsetHeight;

      ctxMenu.style.left = x + 'px';
      ctxMenu.style.top = y + 'px';
    }
  });

  // Close context menu on any click
  document.addEventListener('mousedown', e => {
    if (ctxMenu && !ctxMenu.contains(e.target)) {
      ctxMenu.classList.remove('open');
    }
  });

  document.addEventListener('keydown', e => {
    if (e.ctrlKey && (e.key === 'u' || e.key === 'U' || e.key === 's' || e.key === 'S')) {
      e.preventDefault();
      return false;
    }
    if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
      e.preventDefault();
      return false;
    }
  });

  // Easter Egg Tracker
  let keySequence = '';
  document.addEventListener('keydown', (e) => {
    keySequence += (e.key.length === 1 ? e.key.toLowerCase() : `[${e.key}]`);
    if (keySequence.endsWith('tahoe')) {
      unlockAchievement('lore_master');
      showNotification({ name: 'System Secrets', icon: '🏔️' });
      keySequence = '';
    }
    if (keySequence.endsWith('[ArrowUp][ArrowUp][ArrowDown][ArrowDown][ArrowLeft][ArrowRight][ArrowLeft][ArrowRight]ba')) {
      unlockAchievement('konami');
      keySequence = '';
    }
    if (keySequence.length > 50) keySequence = keySequence.slice(-50);
  });
});

/* ====================== LAUNCHPAD ====================== */
const LAUNCHPAD_APPS = [
  { id: 'safari', name: 'Safari', img: MACOS_ICONS.safari },
  { id: 'youtube', name: 'YouTube', img: 'https://cdn-icons-png.flaticon.com/512/1384/1384060.png' },
  { id: 'discord', name: 'Discord', img: MACOS_ICONS.discord },
  { id: 'spotify', name: 'Spotify', img: MACOS_ICONS.spotify },
  { id: 'github', name: 'GitHub', img: MACOS_ICONS.github },
  { id: 'notes', name: 'Notes', img: MACOS_ICONS.notes },
  { id: 'finder', name: 'Finder', img: MACOS_ICONS.finder },
  { id: 'mail', name: 'Mail', img: MACOS_ICONS.mail },
  { id: 'terminal', name: 'Terminal', img: MACOS_ICONS.terminal },
  { id: 'settings', name: 'Settings', img: MACOS_ICONS.settings },
  { id: 'calendar', name: 'Calendar', img: MACOS_ICONS.calendar },
  { id: 'game2048', name: '2048', img: 'https://cdn-icons-png.flaticon.com/512/8649/8649595.png' },
  { id: 'tetris', name: 'Tetris', img: 'https://cdn-icons-png.flaticon.com/512/2583/2583482.png' },
  { id: 'flappy', name: 'Flappy Bird', img: 'https://cdn-icons-png.flaticon.com/512/1864/1864513.png' },
  { id: 'snake', name: 'Snake', img: 'https://cdn-icons-png.flaticon.com/512/616/616554.png' },
  { id: 'chess', name: 'Chess', img: MACOS_ICONS.chess },
  { id: 'calculator', name: 'Calculator', img: MACOS_ICONS.calculator },
  { id: 'camera', name: 'Camera', img: MACOS_ICONS.camera },
  { id: 'achievements', name: 'Achievements', img: MACOS_ICONS.achievements }
];

function initLaunchpad() {
  const grid = document.getElementById('lp-grid');
  if (!grid) return;
  LAUNCHPAD_APPS.forEach((app, i) => {
    const el = document.createElement('div');
    el.className = 'lp-item';
    el.style.animationDelay = (i * 0.02) + 's';
    const imgClass = 'lp-img';
    el.innerHTML = `<img src="${app.img}" alt="${app.name}" class="${imgClass}"><span>${app.name}</span>`;
    el.onclick = () => { closeLaunchpad(); openWindow(app.id); };
    el.dataset.name = app.name.toLowerCase();
    grid.appendChild(el);
  });
}
function toggleLaunchpad() {
  const lp = document.getElementById('launchpad');
  if (!lp) return;
  if (lp.classList.contains('hidden')) {
    lp.classList.remove('hidden', 'closing');
    document.getElementById('lp-search')?.focus();
    document.getElementById('lp-search').value = '';
    filterLaunchpad('');
  } else {
    closeLaunchpad();
  }
}
function closeLaunchpad() {
  const lp = document.getElementById('launchpad');
  if (!lp || lp.classList.contains('hidden')) return;
  lp.classList.add('closing');
  setTimeout(() => {
    lp.classList.add('hidden');
    lp.classList.remove('closing');
  }, 300);
}
function filterLaunchpad(q) {
  const items = document.querySelectorAll('.lp-item');
  const v = (q || '').toLowerCase().trim();
  items.forEach(el => { el.style.display = (!v || el.dataset.name.includes(v)) ? 'flex' : 'none'; });
}

/* ====================== BOOT ====================== */
function initBoot() {
  const boot = document.getElementById('boot-screen');
  const desk = document.getElementById('desktop');
  const fill = boot.querySelector('.boot-progress-fill');

  // Pre-apply theme and wallpaper to prevent flashing
  applyAllSettings();

  fill.style.transition = 'width 1.5s ease-in-out';
  setTimeout(() => fill.style.width = '100%', 100);

  setTimeout(() => {
    boot.classList.add('fade-out');
    desk.classList.remove('hidden');
    desk.style.opacity = '1';

    requestAnimationFrame(() => {
      desk.classList.add('system-ready');
    });

    setTimeout(() => {
      boot.classList.add('hidden');
    }, 800);
  }, 2000);
}

/* ====================== SYSTEM ====================== */
function initClock() { updateClock(); setInterval(updateClock, 1000); }
function updateClock() {
  const n = new Date(); const el = document.getElementById('mb-clock');
  if (el) el.textContent = n.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) + '  ' + n.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}
function toggleFullScreen() {
  if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(() => { });
  else if (document.exitFullscreen) document.exitFullscreen();
  closeAllMenus();
}

/* ====================== CALENDAR ====================== */
function initCalendar() {
  const container = document.getElementById('widget-calendar');
  if (container) {
    container.style.cursor = 'default'; // Change to default since we have nav buttons now
  }

  const prev = document.getElementById('w-cal-prev');
  const next = document.getElementById('w-cal-next');
  const mEl = document.getElementById('w-cal-month');

  if (prev && next) {
    prev.onclick = (e) => { e.stopPropagation(); widgetCalDate.setMonth(widgetCalDate.getMonth() - 1); renderWidgetCalendar(); };
    next.onclick = (e) => { e.stopPropagation(); widgetCalDate.setMonth(widgetCalDate.getMonth() + 1); renderWidgetCalendar(); };
  }

  if (mEl) {
    mEl.style.cursor = 'pointer';
    mEl.title = 'Click to go to today';
    mEl.onclick = (e) => { e.stopPropagation(); widgetCalDate = new Date(); renderWidgetCalendar(); };
  }

  renderWidgetCalendar();
}

function renderWidgetCalendar() {
  const grid = document.getElementById('w-cal-grid');
  const mEl = document.getElementById('w-cal-month');
  if (!grid || !mEl) return;

  grid.innerHTML = '';
  const y = widgetCalDate.getFullYear(), m = widgetCalDate.getMonth();
  const today = new Date();

  mEl.textContent = widgetCalDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase();

  ['M', 'T', 'W', 'T', 'F', 'S', 'S'].forEach(d => {
    const e = document.createElement('div'); e.className = 'ch'; e.textContent = d; grid.appendChild(e);
  });

  let start = new Date(y, m, 1).getDay() - 1; if (start < 0) start = 6;
  const dim = new Date(y, m + 1, 0).getDate(), pDim = new Date(y, m, 0).getDate();

  for (let i = start - 1; i >= 0; i--) {
    const e = document.createElement('div'); e.className = 'cd dim'; e.textContent = pDim - i; grid.appendChild(e);
  }

  for (let i = 1; i <= dim; i++) {
    const e = document.createElement('div');
    const isToday = i === today.getDate() && m === today.getMonth() && y === today.getFullYear();
    e.className = 'cd' + (isToday ? ' today' : '');
    e.textContent = i;
    e.onclick = (e) => { e.stopPropagation(); openWindow('calendar'); };
    grid.appendChild(e);
  }

  const totalCells = grid.children.length;
  const rem = Math.ceil((totalCells) / 7) * 7 - totalCells;
  for (let i = 1; i <= rem; i++) {
    const e = document.createElement('div'); e.className = 'cd dim'; e.textContent = i; grid.appendChild(e);
  }
}

/* ====================== MENU BAR ====================== */
function initMenuBar() {
  document.querySelectorAll('.mb-item[data-menu]').forEach(btn => {
    btn.addEventListener('click', (e) => { e.stopPropagation(); toggleMenu(btn.dataset.menu, btn); });
  });
  document.querySelectorAll('.mb-icon-btn[data-menu]').forEach(btn => {
    btn.addEventListener('click', (e) => { e.stopPropagation(); toggleMenu(btn.dataset.menu, btn); });
  });
  document.addEventListener('click', closeAllMenus);
}
function toggleMenu(name, btn) {
  const dd = document.getElementById('dd-' + name);
  const wasOpen = dd && dd.classList.contains('open');
  closeAllMenus();
  if (!wasOpen && dd) {
    dd.classList.add('open');
    if (btn && !btn.classList.contains('mb-icon-btn')) btn.classList.add('active');
    const r = (btn || document.querySelector('.mb-icon-btn[data-menu="' + name + '"]')).getBoundingClientRect();
    dd.style.left = (r.right - (dd.classList.contains('dd-control') ? 280 : 0)) + 'px';
    dd.style.top = '25px';
    if (name === 'window') populateWindowList();
  }
}
function closeAllMenus() {
  document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('open'));
  document.querySelectorAll('.mb-item').forEach(b => b.classList.remove('active'));
}
function populateWindowList() {
  const list = document.getElementById('dd-window-list');
  if (!list) return;
  list.innerHTML = '';
  openWindows.forEach(id => {
    const win = document.getElementById('window-' + id);
    if (!win || (!win.classList.contains('open') && !win.classList.contains('minimizing'))) return;
    const title = win.querySelector('.win-title')?.textContent || id;
    const btn = document.createElement('button'); btn.className = 'dd-item'; btn.textContent = title;
    btn.onclick = () => { bringToFront(id); closeAllMenus(); };
    list.appendChild(btn);
  });
  if (!list.children.length) list.innerHTML = '<div class="dd-item disabled">No open windows</div>';
}
function showAboutMac() { closeAllMenus(); document.getElementById('about-mac-modal').classList.add('open'); }
function hideAboutMac() { document.getElementById('about-mac-modal').classList.remove('open'); }
function closeActiveWindow() { closeAllMenus(); if (activeWin) closeWindow(activeWin); }
function minimizeAll() { closeAllMenus(); openWindows.forEach(id => minimizeWindow(id)); }
function closeAllWindows() { closeAllMenus();[...openWindows].forEach(id => closeWindow(id)); }
function resetWindows() { closeAllMenus(); closeAllWindows(); }
function toggleWidgets() { closeAllMenus(); document.getElementById('widgets')?.classList.toggle('widgets-visible'); }
function closeWidget(id) { const w = document.getElementById(id); if (!w) return; w.classList.add('closing'); setTimeout(() => w.style.display = 'none', 300); }

/* ====================== WINDOW MANAGER ====================== */
function openNewWindow(id) { openWindow(id); if (id === 'finder') navigateFinder('desktop'); }

const DOCK_PINNED = ['finder', 'launchpad', 'safari', 'mail', 'notes', 'discord', 'github', 'spotify', 'terminal', 'calculator', 'settings'];

function appToDock(id) {
  if (DOCK_PINNED.includes(id)) return;
  const shelf = document.getElementById('dock-shelf');
  if (shelf.querySelector(`.dock-item[data-app="${id}"]`)) return;

  const app = LAUNCHPAD_APPS.find(a => a.id === id);
  if (!app) return;

  const btn = document.createElement('button');
  btn.className = 'dock-item dynamic-app';
  btn.dataset.app = id;
  btn.onclick = () => toggleApp(id);
  btn.innerHTML = `<img class="dock-img" src="${app.img}" alt="${app.name}"><span class="dock-tooltip">${app.name}</span>`;

  // Find where to insert (before the separators or end)
  const separators = shelf.querySelectorAll('.dock-sep');
  if (separators.length > 0) {
    shelf.insertBefore(btn, separators[0]);
  } else {
    shelf.appendChild(btn);
  }
}

function toggleApp(id) {
  const win = document.getElementById('window-' + id);
  if (!win) return;

  const isOpen = win.classList.contains('open');
  const isActive = win.classList.contains('active');

  if (isOpen && isActive) {
    minimizeWindow(id);
  } else if (isOpen && !isActive) {
    bringToFront(id);
    if (win.classList.contains('minimizing')) {
      win.classList.remove('minimizing');
      void win.offsetWidth;
      win.classList.add('open');
    }
  } else {
    openWindow(id);
  }
}

function openWindow(id) {
  const win = document.getElementById('window-' + id);
  if (!win) return;
  const baseId = id.replace(/-\d+$/, '') || id;

  appToDock(baseId);

  // Achievement: First app
  unlockAchievement('first_app');
  openedApps.add(baseId);
  if (openedApps.size >= 5) unlockAchievement('explorer');
  if (['game2048', 'flappy', 'tetris', 'snake', 'chess'].filter(g => openedApps.has(g)).length >= 3) unlockAchievement('gamer');

  // Animate dock item
  const dItems = document.querySelectorAll(`.dock-item[data-app="${baseId}"]`);
  dItems.forEach(d => {
    d.classList.add('bouncing', 'dock-jump');
    setTimeout(() => {
      d.classList.remove('bouncing', 'dock-jump');
    }, 500);
    d.classList.add('running');
  });

  if (openWindows.has(id)) {
    bringToFront(id);
    if (!win.classList.contains('open')) {
      win.classList.remove('minimizing');
      void win.offsetWidth;
      win.classList.add('open');
    }
    return;
  }

  win.classList.remove('minimizing', 'closing');
  win.classList.add('open');
  openWindows.add(id);
  bringToFront(id);

  if (id === 'chess') initChess();
  if (id === 'game2048') { init2048(); setupGameScaling('game2048'); }
  if (id === 'flappy') { initFlappy(); setupGameScaling('flappy'); }
  if (id === 'tetris') { initTetris(); setupGameScaling('tetris'); }
  if (id === 'snake') { initSnake(); setupGameScaling('snake'); }
  if (id === 'camera') initCamera();
  if (id === 'settings') initSettings();
}

function setupGameScaling(id) {
  const body = document.getElementById(id + '-body');
  if (!body) return;

  const obs = new ResizeObserver(entries => {
    for (let entry of entries) {
      const { width, height } = entry.contentRect;
      const content = body.firstElementChild;
      if (!content) return;

      const contentWidth = content.offsetWidth || 400;
      const contentHeight = content.offsetHeight || 500;

      const scale = Math.min(width / contentWidth, height / contentHeight, 1.2);
      content.style.transform = `scale(${scale})`;
      content.style.transformOrigin = 'center center';
    }
  });
  obs.observe(body);
}
function closeWindow(id) {
  const win = document.getElementById('window-' + id); if (!win) return;
  win.classList.add('closing');
  const baseId = id.replace(/-\d+$/, '') || id;

  // Custom: Stop music when Spotify is closed
  if (baseId === 'spotify' && spPlayer) {
    spPlayer.pause();
    const playBtn = document.getElementById('sp-play-btn');
    if (playBtn) playBtn.textContent = '▶';
  }

  setTimeout(() => {
    win.classList.remove('open', 'closing', 'maximized');
    openWindows.delete(id);
    const others = [...openWindows].filter(w => (w.replace(/-\d+$/, '') || w) === baseId);
    if (!others.length) {
      document.querySelectorAll(`.dock-item[data-app="${baseId}"]`).forEach(d => {
        d.classList.remove('running');
        if (d.classList.contains('dynamic-app')) {
          d.classList.add('removing');
          setTimeout(() => d.remove(), 500);
        }
      });
    }
    if (activeWin === id) { activeWin = null; setAppName('Prowiddan.me'); focusNext(); }
    if (openWindows.size === 0) unlockAchievement('zen_master');
  }, 250);
}
function minimizeWindow(id) {
  const win = document.getElementById('window-' + id); if (!win) return;
  win.classList.add('minimizing');
  setTimeout(() => { win.classList.remove('open', 'minimizing'); if (activeWin === id) focusNext(); }, 300);
}
function maximizeWindow(id) {
  const win = document.getElementById('window-' + id); if (!win) return;
  if (win.classList.contains('maximized')) { win.classList.remove('maximized'); if (winPos[id]) Object.assign(win.style, winPos[id]); }
  else { winPos[id] = { top: win.style.top, left: win.style.left, width: win.style.width, height: win.style.height }; win.classList.add('maximized'); }
}
function bringToFront(id) {
  const win = document.getElementById('window-' + id); if (!win) return;
  document.querySelectorAll('.window').forEach(w => w.classList.remove('active'));
  zIdx++; win.style.zIndex = zIdx; win.classList.add('active'); activeWin = id;
  const titles = { finder: 'Finder', safari: 'Safari', settings: 'System Settings', terminal: 'Terminal', github: 'GitHub', spotify: 'Spotify', calculator: 'Calculator', notes: 'Notes', mail: 'Mail', camera: 'Camera', chess: 'Chess', game2048: '2048', flappy: 'Flappy Bird', tetris: 'Tetris', snake: 'Snake' };
  setAppName(titles[id] || 'Prowiddan.me');
}
function setAppName(n) { const el = document.getElementById('mb-appname'); if (el) el.textContent = n; }
function focusNext() {
  const filtered = [...openWindows].filter(id => { const el = document.getElementById('window-' + id); return el && el.classList.contains('open'); });
  if (filtered.length) bringToFront(filtered[filtered.length - 1]);
  else setAppName('Prowiddan.me');
}

/* DRAG */
document.addEventListener('mousedown', e => {
  const chrome = e.target.closest('.win-chrome');
  if (!chrome || e.target.closest('.traffic-lights') || e.target.closest('.tb-btn')) return;
  const wid = chrome.dataset.window; const win = document.getElementById('window-' + wid);
  if (!win || win.classList.contains('maximized')) return;
  bringToFront(wid);
  const r = win.getBoundingClientRect();
  dragState = { win, sx: e.clientX, sy: e.clientY, ox: r.left, oy: r.top };
});
document.addEventListener('mousemove', e => {
  if (!dragState) return;
  dragState.win.style.left = (dragState.ox + e.clientX - dragState.sx) + 'px';
  dragState.win.style.top = Math.max(26, dragState.oy + e.clientY - dragState.sy) + 'px';
});
document.addEventListener('mouseup', () => dragState = null);

/* RESIZE */
let resizeState = null;
document.addEventListener('mousedown', e => {
  const handle = e.target.closest('.resize-handle');
  if (!handle || !handle.closest('.window')) return;
  const win = handle.closest('.window');
  if (win.classList.contains('maximized')) return;
  const r = win.getBoundingClientRect();
  resizeState = { win, handle: handle.className, sx: e.clientX, sy: e.clientY, w: r.width, h: r.height, l: r.left, t: r.top };
});
document.addEventListener('mousemove', e => {
  if (!resizeState) return;
  const { win, handle, sx, sy, w, h, l, t } = resizeState;
  const dx = e.clientX - sx, dy = e.clientY - sy, minW = 280, minH = 180;
  if (handle.includes('resize-r')) win.style.width = Math.max(minW, w + dx) + 'px';
  if (handle.includes('resize-b')) win.style.height = Math.max(minH, h + dy) + 'px';
  if (handle.includes('resize-br')) { win.style.width = Math.max(minW, w + dx) + 'px'; win.style.height = Math.max(minH, h + dy) + 'px'; }
  if (handle.includes('resize-l')) { const nw = Math.max(minW, w - dx); win.style.width = nw + 'px'; win.style.left = (l + w - nw) + 'px'; }
  if (handle.includes('resize-bl')) { const nw = Math.max(minW, w - dx); win.style.width = nw + 'px'; win.style.left = (l + w - nw) + 'px'; win.style.height = Math.max(minH, h + dy) + 'px'; }
});
document.addEventListener('mouseup', () => resizeState = null);

/* ====================== FINDER ====================== */
const finderData = {
  desktop: [
    { name: 'About Me', type: 'folder', modified: 'Today', size: '--', kind: 'Folder', tag: 'green', icon: MACOS_ICONS.folder, open: () => { openWindow('notes'); openNoteByTitle('About Me'); } },
    { name: 'Skills', type: 'folder', modified: 'Today', size: '--', kind: 'Folder', tag: 'green', icon: MACOS_ICONS.folder, open: () => { openWindow('notes'); openNoteByTitle('Skills & Stack'); } },
    { name: 'Projects', type: 'folder', modified: 'Today', size: '--', kind: 'Folder', tag: 'blue', icon: MACOS_ICONS.folder, open: () => openWindow('github') },
    { name: 'Contact', type: 'folder', modified: 'Today', size: '--', kind: 'Folder', tag: 'purple', icon: MACOS_ICONS.folder, open: () => openWindow('safari') },
    { name: 'cv.pdf', type: 'file', modified: 'Feb 10, 2026', size: '1.2 MB', kind: 'PDF', tag: 'red', icon: MACOS_ICONS.pdf, open: () => openPreviewResume() }
  ],
  applications: [
    { name: 'Safari', type: 'app', modified: 'Today', size: '--', kind: 'Application', tag: 'blue', icon: MACOS_ICONS.safari, open: () => openWindow('safari') },
    { name: 'Mail', type: 'app', modified: 'Today', size: '--', kind: 'Application', tag: 'orange', icon: MACOS_ICONS.mail, open: () => openWindow('mail') },
    { name: 'Notes', type: 'app', modified: 'Today', size: '--', kind: 'Application', tag: 'green', icon: MACOS_ICONS.notes, open: () => openWindow('notes') },
    { name: 'Terminal', type: 'app', modified: 'Today', size: '--', kind: 'Application', tag: 'red', icon: MACOS_ICONS.terminal, open: () => openWindow('terminal') },
    { name: 'GitHub', type: 'app', modified: 'Today', size: '--', kind: 'Application', tag: 'blue', icon: MACOS_ICONS.github, open: () => openWindow('github') },
    { name: 'System Settings', type: 'app', modified: 'Today', size: '--', kind: 'Application', tag: 'blue', icon: MACOS_ICONS.settings, open: () => openWindow('settings') },
    { name: 'Spotify', type: 'app', modified: 'Today', size: '--', kind: 'Application', tag: 'green', icon: MACOS_ICONS.spotify, open: () => openWindow('spotify') },
    { name: 'Calculator', type: 'app', modified: 'Today', size: '--', kind: 'Application', tag: 'orange', icon: MACOS_ICONS.calculator, open: () => openWindow('calculator') },
    { name: 'Camera', type: 'app', modified: 'Today', size: '--', kind: 'Application', tag: 'blue', icon: MACOS_ICONS.camera, open: () => openWindow('camera') },
    { name: 'Chess', type: 'app', modified: 'Today', size: '--', kind: 'Application', tag: 'green', icon: MACOS_ICONS.chess, open: () => openWindow('chess') }
  ],
  documents: [
    { name: 'Portfolio Case Study.pages', type: 'file', modified: 'Jan 22, 2026', size: '820 KB', kind: 'Document', tag: 'orange', icon: MACOS_ICONS.folder },
    { name: 'Design Philosophy.md', type: 'file', modified: 'Jan 10, 2026', size: '12 KB', kind: 'Markdown', tag: 'green', icon: MACOS_ICONS.folder }
  ],
  downloads: [
    { name: 'prowiddan-assets.zip', type: 'file', modified: 'Feb 01, 2026', size: '24 MB', kind: 'Archive', tag: 'blue', icon: MACOS_ICONS.folder }
  ],
  recent: [],
};
finderData.recent = [...finderData.desktop, ...finderData.applications.slice(0, 3), ...finderData.documents];

function getFinderItems(path) { return finderData[path] || []; }
function updateFinderHistory(path) {
  if (finderHistory[finderIdx] !== path) { finderHistory = finderHistory.slice(0, finderIdx + 1); finderHistory.push(path); finderIdx++; }
  document.getElementById('finder-back').disabled = finderIdx === 0;
  document.getElementById('finder-fwd').disabled = finderIdx === finderHistory.length - 1;
}
function navigateFinder(path) {
  const items = getFinderItems(path);
  if (!items.length && !finderData[path]) return;
  currentFinderPath = path;
  document.querySelectorAll('#finder-sidebar .fs-item').forEach(btn => { btn.classList.toggle('active', btn.getAttribute('onclick')?.includes(`'${path}'`)); });
  updateFinderHistory(path);
  renderFinder();
}
function finderBack() { if (finderIdx > 0) { finderIdx--; currentFinderPath = finderHistory[finderIdx]; renderFinder(); } }
function finderForward() { if (finderIdx < finderHistory.length - 1) { finderIdx++; currentFinderPath = finderHistory[finderIdx]; renderFinder(); } }
function setFinderView(mode) {
  finderViewMode = mode;
  document.querySelectorAll('.finder-view-btn').forEach(btn => btn.classList.remove('active'));
  const activeBtn = document.getElementById(mode === 'icon' ? 'view-icon' : 'view-list');
  if (activeBtn) activeBtn.classList.add('active');
  const header = document.querySelector('.finder-colheader');
  if (header) header.classList.toggle('hidden', mode !== 'list');
  renderFinder();
}
function filterByTag(tag) { renderFinder(getFinderItems(currentFinderPath).filter(item => item.tag === tag)); }
function getFinderFilterText() { const input = document.getElementById('finder-search'); return input ? input.value.trim().toLowerCase() : ''; }
function renderFinder(overrideItems) {
  const container = document.getElementById('finder-content');
  if (!container) return;
  const allItems = overrideItems || getFinderItems(currentFinderPath);
  const query = getFinderFilterText();
  const items = query ? allItems.filter(item => item.name.toLowerCase().includes(query) || (item.kind && item.kind.toLowerCase().includes(query))) : allItems;
  container.innerHTML = '';
  if (finderViewMode === 'icon') {
    const grid = document.createElement('div'); grid.className = 'finder-grid';
    items.forEach(item => {
      const el = document.createElement('div'); el.className = 'finder-icon-item';
      el.ondblclick = () => { if (item.open) item.open(); else if (item.preview) showPreview(item.name, item.preview); };
      el.innerHTML = `<img src="${item.icon || MACOS_ICONS.folder}" alt="" class="finder-icon-img"><div class="finder-icon-title">${item.name}</div><div class="finder-icon-meta">${item.kind} • ${item.modified}</div>`;
      grid.appendChild(el);
    });
    container.appendChild(grid);
  } else {
    items.forEach(item => {
      const el = document.createElement('div'); el.className = 'fr';
      el.innerHTML = `<span style="flex:2">${item.name}</span><span style="flex:1">${item.modified}</span><span style="width:80px">${item.size}</span><span style="width:80px">${item.kind}</span>`;
      el.ondblclick = () => { if (item.open) item.open(); else if (item.preview) showPreview(item.name, item.preview); };
      container.appendChild(el);
    });
  }
  const status = document.getElementById('finder-statusbar');
  if (status) status.textContent = items.length + ' item' + (items.length === 1 ? '' : 's');
}
function showPreview(title, content) { document.getElementById('preview-title').textContent = title; document.getElementById('preview-content').innerHTML = content; openWindow('preview'); }

/* ====================== SAFARI ====================== */
function initSafari() { renderSafariTabs(); document.getElementById('safari-url')?.addEventListener('focus', function () { this.select(); }); }
function safariNavigateOrSearch(val) {
  const v = (val || '').trim(); if (!v) return;
  if (v.includes('.') && !v.includes(' ')) { const url = v.startsWith('http') ? v : 'https://' + v; const id = Date.now(); safariTabs.forEach(t => t.active = false); safariTabs.push({ id, title: v.slice(0, 30), url, active: true }); renderSafariTabs(); window.open(url, '_blank'); }
  else safariSearchInNewTab(v);
}
function safariGoBack() { }
function safariGoForward() { }
function renderSafariTabs() {
  const bar = document.getElementById('safari-tabs'); bar.innerHTML = '';
  safariTabs.forEach(tab => { const el = document.createElement('div'); el.className = 'safari-tab' + (tab.active ? ' active' : ''); el.textContent = tab.title; el.onclick = () => switchSafariTab(tab.id); bar.appendChild(el); });
  const active = safariTabs.find(t => t.active);
  document.getElementById('safari-url').value = active.url;
  renderSafariContent(active);
}
function switchSafariTab(id) { safariTabs.forEach(t => t.active = (t.id === id)); renderSafariTabs(); }
function addSafariTab() { const id = Date.now(); safariTabs.forEach(t => t.active = false); safariTabs.push({ id, title: 'New Tab', url: 'https://www.google.com', active: true }); renderSafariTabs(); window.open('https://www.google.com', '_blank'); }
function safariSearchInNewTab(query) {
  if (!query.trim()) return;
  const id = Date.now(); safariTabs.forEach(t => t.active = false);
  safariTabs.push({ id, title: 'Search: ' + query.slice(0, 20), url: 'https://www.google.com/search?q=' + encodeURIComponent(query), active: true });
  renderSafariTabs(); window.open('https://www.google.com/search?q=' + encodeURIComponent(query), '_blank');
}
function renderSafariContent(tab) {
  const container = document.getElementById('safari-content');
  if (tab.url.includes('google.com') || tab.url.startsWith('https://')) {
    container.innerHTML = `<div class="safari-search-page"><div class="safari-search-box"><input type="text" id="safari-search-inp" placeholder="Search Google or enter URL" onkeydown="if(event.key==='Enter') safariSearchInNewTab(this.value)"><button class="safari-search-btn" onclick="safariSearchInNewTab(document.getElementById('safari-search-inp').value)">Search</button></div><p class="safari-search-hint">Press Enter to search in a new tab</p></div>`;
  } else if (tab.url.includes('github.com')) {
    container.innerHTML = `<iframe src="https://github.com/ProWiddan" style="width:100%;height:100%;border:none"></iframe>`;
  } else if (tab.url.includes('discord.com')) {
    container.innerHTML = `<iframe src="https://discord.com" style="width:100%;height:100%;border:none"></iframe>`;
  } else { container.innerHTML = getContactPageHTML(); }
}
function getContactPageHTML() {
  return `<div class="safari-contact">
    <div class="safari-contact-hero">
      <img src="https://avatars.githubusercontent.com/u/111640651?v=4" alt="ProWiddan" class="safari-contact-avatar">
      <h1>Sujayram (ProWiddan)</h1>
      <p>Student · Science · CBSE · Chess Enthusiast</p>
      <p class="safari-contact-loc">Muscat, Oman · Originally from India</p>
    </div>
    <div class="safari-contact-grid" onclick="unlockAchievement('social')">
      <a class="safari-contact-card" href="mailto:sujayramprasad@gmail.com" target="_blank">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
        <span>Email</span><strong>sujayramprasad@gmail.com</strong>
      </a>
      <a class="safari-contact-card" href="https://github.com/ProWiddan" target="_blank">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
        <span>GitHub</span><strong>@ProWiddan</strong>
      </a>
      <a class="safari-contact-card" href="https://discordapp.com/users/1175860358104219710" target="_blank">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.79 19.79 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.865-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.618-1.25.077.077 0 00-.079-.037A19.74 19.74 0 003.677 4.37a.07.07 0 00-.032.028C.533 9.046-.32 13.58.099 18.058a.082.082 0 00.031.056 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.042-.106 13.11 13.11 0 01-1.872-.892.077.077 0 01-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 01.078-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.009c.12.099.246.198.373.292a.077.077 0 01-.006.127 12.3 12.3 0 01-1.873.892.076.076 0 00-.041.107c.36.698.772 1.363 1.225 1.993a.076.076 0 00.084.029 19.9 19.9 0 006.002-3.03.077.077 0 00.032-.055c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.029z"/></svg>
        <span>Discord</span><strong>@prowiddan</strong>
      </a>
      <a class="safari-contact-card" href="https://x.com/SujayramPrasad" target="_blank">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
        <span>X (Twitter)</span><strong>@SujayramPrasad</strong>
      </a>
      <a class="safari-contact-card" href="https://linkedin.com/in/sujayram-prasad-0b5a61282/" target="_blank">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
        <span>LinkedIn</span><strong>sujayram-prasad</strong>
      </a>
      <a class="safari-contact-card" href="https://www.instagram.com/sujayram_prasad/" target="_blank">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
        <span>Instagram</span><strong>sujayram_prasad</strong>
        <em style="font-size: 8px; font-style: normal; opacity: 0.6; margin-top: 2px;">follow for more</em>
      </a>
    </div>
  </div>`;
}

/* ====================== SYSTEM SETTINGS: TAHOE ====================== */
let settingsState = {
  darkMode: true,
  notch: true,
  wallpaper: 4,
  dockSize: 1,
  dockMagnification: true,
  dockPosition: 'bottom',
  transparency: 0.55,
  accentColor: '#007AFF',
  username: 'Sujayram'
};

const ACHIEVEMENTS = [
  { id: 'first_app', name: 'Hello World', icon: '🚀', desc: 'Opened your first application. Welcome to Tahoe!' },
  { id: 'explorer', name: 'Power User', icon: '🔍', desc: 'Explored the system by opening 5 different apps.' },
  { id: 'gamer', name: 'Arcade Hobbyist', icon: '🕹️', desc: 'Tried out the local arcade collection.' },
  { id: 'social', name: 'Link in Bio', icon: '🤝', desc: 'Checked out the social connections.' },
  { id: 'maestro', name: 'Local DJ', icon: '🎵', desc: 'Interacted with the music player.' },
  { id: 'shutter', name: 'Say Cheese', icon: '📸', desc: 'Accessed the camera module.' },
  { id: 'snake_pro', name: 'Venomous', icon: '🐍', desc: 'Showed real skill in Snake.' },
  { id: 'flappy_pro', name: 'Aviator', icon: '🐦', desc: 'Reached 10 points in Flappy Bird.' },
  { id: 'chess_pro', name: 'Grandmaster', icon: '♟️', desc: 'Opened the royal game.' },
  { id: 'customizer', name: 'Interior Designer', icon: '🎨', desc: 'Personalized your workspace.' },
  { id: 'hacker', name: 'Zero Day', icon: '💻', desc: 'Used the terminal like a pro.' },
  { id: 'lore_master', name: 'Historian', icon: '📜', desc: 'Discovered the truth in the mountains.' },
  { id: 'dark_side', name: 'Midnight Owl', icon: '🦉', desc: 'Realized that Light Mode is a myth.' },
  { id: 'matrix_hired', name: 'The One', icon: '🕶️', desc: 'Entered the matrix.' },
  { id: 'zen_master', name: 'Zen Master', icon: '🧘', desc: 'Cleaned up your desk completely.' },
  { id: 'konami', name: 'Cheat Code', icon: '🎮', desc: 'U U D D L R L R B A Start.' }
];

let unlockedAchievements = new Set();
let openedApps = new Set();

function saveSettings() {
  localStorage.setItem('prowiddan_settings', JSON.stringify(settingsState));
  localStorage.setItem('prowiddan_achievements', JSON.stringify([...unlockedAchievements]));
}

function loadSettings() {
  const s = localStorage.getItem('prowiddan_settings');
  if (s) settingsState = { ...settingsState, ...JSON.parse(s) };
  const a = localStorage.getItem('prowiddan_achievements');
  if (a) unlockedAchievements = new Set(JSON.parse(a));
}

function applyAllSettings() {
  document.body.classList.toggle('dark', settingsState.darkMode);
  document.getElementById('menubar')?.classList.toggle('notch', settingsState.notch);

  // Apply transparency to CSS variables and system elements
  document.documentElement.style.setProperty('--glass-opacity', settingsState.transparency);
  document.documentElement.style.setProperty('--blue', settingsState.accentColor);

  const mb = document.getElementById('menubar');
  if (mb) mb.style.background = `rgba(0, 0, 0, ${settingsState.transparency * 0.4})`;

  document.querySelectorAll('.window').forEach(win => {
    win.style.background = `rgba(30, 30, 35, ${settingsState.transparency})`;
  });

  setWallpaper(settingsState.wallpaper);
  setDockSize(settingsState.dockSize);
  setDockPosition(settingsState.dockPosition);
  renderAchievements();
}

function unlockAchievement(id) {
  if (unlockedAchievements.has(id)) return;
  unlockedAchievements.add(id);
  saveSettings();
  renderAchievements();

  const a = ACHIEVEMENTS.find(item => item.id === id);
  if (a) showNotification(a);

  // Pulse trophy icon in menu bar
  const trophy = document.querySelector('.mb-icon-btn[data-menu="achievements"]');
  if (trophy) {
    trophy.classList.add('new-unlock');
    setTimeout(() => trophy.classList.remove('new-unlock'), 10000);
  }
}

function showNotification(achievement) {
  const container = document.getElementById('notification-container');
  if (!container) return;

  const notif = document.createElement('div');
  notif.className = 'achievement-notification';
  notif.onclick = () => {
    openWindow('achievements');
  };

  notif.innerHTML = `
    <div class="achievement-notif-icon">${achievement.icon}</div>
    <div class="achievement-notif-body">
      <div class="achievement-notif-title">Achievement unlocked</div>
      <div class="achievement-notif-name">${achievement.name}</div>
    </div>
  `;

  container.appendChild(notif);
  // Soft system sound
  try { new Audio('https://raw.githubusercontent.com/Anish-Agnihotri/macos-web/main/public/assets/sounds/dialog_standard.mp3').play(); } catch (e) { }

  setTimeout(() => {
    notif.style.animation = 'notificationOut 0.5s var(--smooth) forwards';
    setTimeout(() => notif.remove(), 500);
  }, 5000);
}

function renderAchievements() {
  const containers = [
    document.getElementById('achievements-list'),
    document.getElementById('settings-achievements-list'),
    document.getElementById('achievements-list-full')
  ];

  const unlockedCount = unlockedAchievements.size;
  const totalCount = ACHIEVEMENTS.length;

  const totalEl = document.getElementById('ach-total-count');
  const unlockedEl = document.getElementById('ach-unlocked-count');
  if (totalEl) totalEl.textContent = totalCount;
  if (unlockedEl) unlockedEl.textContent = unlockedCount;

  containers.forEach(container => {
    if (!container) return;

    // Different layout for dropdown vs full app
    const isFull = container.id === 'achievements-list-full' || container.id === 'settings-achievements-list';

    container.innerHTML = ACHIEVEMENTS.map(a => {
      const isUnlocked = unlockedAchievements.has(a.id);
      if (!isFull && !isUnlocked) return ''; // Only show unlocked in dropdown for brevity

      return `
        <div class="achievement-item ${isUnlocked ? 'unlocked' : ''}">
          <div class="achievement-icon">${isUnlocked ? a.icon : '🔒'}</div>
          <div class="achievement-info">
            <div class="achievement-name">${a.name}</div>
            <div class="achievement-desc">${isUnlocked ? a.desc : 'Achieve this to unlock'}</div>
          </div>
          ${isUnlocked && isFull ? '<div class="achievement-check">✓</div>' : ''}
        </div>
      `;
    }).join('');

    if (!isFull && container.innerHTML === '') {
      container.innerHTML = '<div style="font-size:11px; color:var(--t3); text-align:center; padding:12px">No achievements yet</div>';
    }
  });
}

// End of Settings Helpers

const WALLPAPERS = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=85',
  'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1920&q=85',
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1920&q=85',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=85',
  'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1920&q=85',
  'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=1920&q=85'
];

const SETTINGS_ITEMS = [
  { id: 'appearance', label: 'Appearance', icon: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2v20M12 2a10 10 0 0 0 0 20"/></svg>', color: '#007AFF' },
  { id: 'dock', label: 'Dock & Menu Bar', icon: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 17h18"/></svg>', color: '#8E8E93' },
  { id: 'wallpaper', label: 'Wallpaper', icon: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>', color: '#00D2FF' },
  { id: 'display', label: 'Display', icon: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>', color: '#34C759' },
  { id: 'general', label: 'General', icon: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>', color: '#FF9F0A' },
  { id: 'icons', label: 'App Icons', icon: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.9 0 1.5-.6 1.5-1.5 0-.4-.1-.8-.4-1.1-.3-.3-.4-.7-.4-1.1 0-.9.7-1.5 1.5-1.5H16c3.3 0 6-2.7 6-6 0-4.9-4.5-8.8-10-8.8z"/></svg>', color: '#AF2896' },
  { id: 'about', label: 'About', icon: '<span style="font-weight:bold; font-family:serif">i</span>', color: '#8E8E93' }
];
function initSettings(startSection = 'appearance') {
  const sidebar = document.getElementById('settings-sidebar');
  if (!sidebar) return;

  sidebar.innerHTML = `
    <div style="padding: 12px 16px; margin-bottom: 12px;">
      <div style="display:flex; align-items:center; gap:12px; background:rgba(255,255,255,0.05); padding:10px; border-radius:12px">
        <img src="https://avatars.githubusercontent.com/u/111640651?v=4" style="width:32px; height:32px; border-radius:50%" alt="">
        <div>
          <div style="font-size:13px; font-weight:600">${settingsState.username}</div>
          <div style="font-size:11px; opacity:0.5">ProWiddan Account</div>
        </div>
      </div>
    </div>
    <div class="settings-nav-list">
      ${SETTINGS_ITEMS.map(i => `
        <button class="settings-nav-item" data-section="${i.id}">
          <span class="settings-nav-icon" style="background:${i.color}">${i.icon}</span>
          ${i.label}
        </button>
      `).join('')}
    </div>
  `;

  document.querySelectorAll('.settings-nav-item').forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll('.settings-nav-item').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderSettings(btn.dataset.section);
    };
  });

  const start = document.querySelector(`.settings-nav-item[data-section="${startSection}"]`) || document.querySelector('.settings-nav-item');
  if (start) start.click();
}

function renderSettings(section) {
  const panel = document.getElementById('settings-panel');
  if (!panel) return;

  // Sync sidebar highlight
  document.querySelectorAll('.settings-nav-item').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.section === section);
  });

  let html = `<div class="settings-body">
    <h1 class="settings-section-title">${SETTINGS_ITEMS.find(i => i.id === section)?.label || 'Settings'}</h1>`;

  if (section === 'appearance') {
    html += `
      <div class="settings-group-label">Mode</div>
      <div class="settings-card">
        <div class="settings-row">
          <label>Dark Mode</label>
          <button class="toggle ${settingsState.darkMode ? 'on' : ''}" onclick="toggleSettings('darkMode')"></button>
        </div>
      </div>
      <div class="settings-group-label">Accent</div>
      <div class="settings-card">
        <div class="settings-row">
          <label>Accent Color</label>
          <div style="display:flex; gap:10px">
            ${['#007AFF', '#BF5AF2', '#FF453A', '#30D158', '#FF9F0A'].map(c => `
              <div onclick="setAccentColor('${c}'); unlockAchievement('customizer')" style="width:22px; height:22px; border-radius:50%; background:${c}; border:2px solid ${settingsState.accentColor === c ? '#fff' : 'transparent'}; cursor:pointer; box-shadow: 0 0 0 1px rgba(0,0,0,0.1)"></div>
            `).join('')}
          </div>
        </div>
      </div>
      <div class="settings-group-label">Vibrancy</div>
      <div class="settings-card">
        <div class="settings-row">
          <label>Transparency</label>
          <input type="range" min="0.1" max="0.9" step="0.05" value="${settingsState.transparency}" oninput="setTransparency(this.value)" style="width:140px">
        </div>
      </div>
    `;
  } else if (section === 'dock') {
    html += `
      <div class="settings-group-label">Behavior</div>
      <div class="settings-card">
        <div class="settings-row">
          <label>Size</label>
          <input type="range" min="0.6" max="1.4" step="0.1" value="${settingsState.dockSize}" oninput="setDockSize(this.value)" style="width:140px">
        </div>
      </div>
    `;
  } else if (section === 'wallpaper') {
    html += `
      <div class="wallpaper-grid">
        ${WALLPAPERS.map((url, i) => `
          <div style="position:relative">
            <img class="wallpaper-thumb ${i === settingsState.wallpaper ? 'active' : ''}" src="${url}" alt="" onclick="setWallpaper(${i}); unlockAchievement('customizer')">
            ${i === settingsState.wallpaper ? '<div style="position:absolute; bottom:8px; right:8px; background:var(--blue); color:#fff; width:16px; height:16px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:10px">✓</div>' : ''}
          </div>
        `).join('')}
      </div>
    `;
  } else if (section === 'display') {
    html += `
      <div class="settings-card">
        <div class="settings-row">
          <label>Dynamic Island</label>
          <button class="toggle ${settingsState.notch ? 'on' : ''}" onclick="toggleSettings('notch')"></button>
        </div>
      </div>
    `;
  } else if (section === 'icons') {
    html += `
      <div class="settings-card" style="padding:16px">
        <div class="settings-search-bar">
          <input type="text" id="icon-search-inp" placeholder="Search macOSicons.com..." onkeydown="if(event.key==='Enter') executeIconSearch()">
          <button onclick="executeIconSearch()">Search</button>
        </div>
      </div>
      <div id="icon-search-results" class="icon-results-grid"></div>
    `;
  } else if (section === 'general') {
    html += `
      <div class="settings-group-label">Language & Region</div>
      <div class="settings-card">
        <div class="settings-row">
          <label>Primary Language</label>
          <div style="display:flex; align-items:center; gap:8px">
            <span style="font-size:13px; opacity:0.6">English (Tahoe)</span>
            <button class="toggle on" onclick="alert('Changing language is disabled because Tahoe only speaks Facts.')" style="opacity:0.5; cursor:not-allowed"></button>
          </div>
        </div>
      </div>
      <div class="settings-group-label">System Data</div>
      <div class="settings-card">
        <div class="settings-row" style="padding-top:12px; padding-bottom:12px">
          <div>
            <div style="font-weight:500">Reset Local Storage</div>
            <div style="font-size:11px; opacity:0.5; margin-top:2px">Clears all settings, achievements, and notes.</div>
          </div>
          <button onclick="resetSystemData()" style="background:#FF453A; color:#fff; border:none; padding:6px 12px; border-radius:6px; font-size:11px; font-weight:600; cursor:pointer">Reset...</button>
        </div>
      </div>
    `;
  } else if (section === 'about') {
    html += `
      <div style="text-align:center; padding:40px 0">
        <svg width="60" height="72" viewBox="0 0 170 200" fill="var(--t1)" style="margin-bottom:20px">
          <path d="M150.4 130.2c-2.8 6.5-6.1 12.4-10 17.9-5.3 7.5-9.6 12.7-13 15.6-5.2 4.8-10.7 7.2-16.7 7.4-4.3 0-9.4-1.2-15.4-3.7-6.1-2.4-11.6-3.7-16.7-3.7-5.3 0-11 1.2-17 3.7-6.1 2.5-11 3.8-14.7 3.9-5.7.3-11.4-2.2-17-7.5-3.7-3.1-8.3-8.5-13.8-16.1-5.9-8.2-10.8-17.7-14.6-28.6C-2.6 108.1-4.7 97.4-4.7 87c0-12 2.6-22.3 7.8-31 4.1-7 9.5-12.4 16.4-16.4 6.9-4 14.3-6 22.3-6.2 4.5 0 10.5 1.4 17.9 4.2 7.3 2.8 12 4.2 14.1 4.2 1.5 0 6.7-1.6 15.5-4.9 8.3-3 15.4-4.3 21.1-3.8 15.6 1.3 27.3 7.5 35.1 18.8-14 8.5-20.9 20.3-20.7 35.6.2 11.9 4.4 21.8 12.7 29.7 3.8 3.6 8 6.3 12.7 8.3-1 2.9-2.1 5.7-3.3 8.5zM102.3 2.5c0 9.3-3.4 18-10.1 26.1-8.1 9.5-17.9 14.9-28.5 14.1-.1-1.1-.2-2.3-.2-3.6 0-9 3.9-18.5 10.8-26.3 3.4-3.9 7.8-7.2 13.1-9.8 5.3-2.5 10.3-3.9 15-4.2.1 1.3.2 2.5.2 3.7z" />
        </svg>
        <div style="font-size:24px; font-weight:700">macOS Tahoe</div>
        <div style="font-size:13px; opacity:0.6; margin-top:4px">Version 15.0 Beta</div>
        <div style="margin-top:32px">
          <div class="settings-card" style="text-align:left; width:100%; max-width:400px; margin:0 auto">
            <div class="settings-row"><label>Processor</label><span style="opacity:0.6">8-core CPU</span></div>
            <div class="settings-row"><label>Memory</label><span style="opacity:0.6">16 GB</span></div>
            <div class="settings-row"><label>Graphics</label><span style="opacity:0.6">Apple GPU</span></div>
          </div>
          <button style="opacity:0.02; cursor:default; margin-top:20px; border:none; background:none; color:inherit" onclick="unlockAchievement('developer'); showNotification({name:'Easter Egg Found!', icon:'🎓'})">.</button>
        </div>
      </div>
    `;
  }

  html += '</div>';
  panel.innerHTML = html;
}

function setAccentColor(c) {
  settingsState.accentColor = c;
  document.documentElement.style.setProperty('--blue', c);
  saveSettings();
  renderSettings(document.querySelector('.settings-nav-item.active')?.dataset.section);
}

function toggleSettings(key) {
  if (key === 'darkMode') {
    // The Joke
    const btn = event.currentTarget;
    if (settingsState.darkMode) {
      btn.classList.add('no-click');
      const originalText = btn.parentElement.querySelector('label').textContent;
      btn.parentElement.querySelector('label').textContent = "Nice try, imagine wanting Light mode";
      unlockAchievement('dark_side');
      setTimeout(() => {
        btn.classList.remove('no-click');
        btn.parentElement.querySelector('label').textContent = originalText;
      }, 3000);
      return;
    }
  }
  settingsState[key] = !settingsState[key];
  if (key === 'notch') document.getElementById('menubar')?.classList.toggle('notch', settingsState.notch);
  saveSettings();
  applyAllSettings();
  renderSettings(document.querySelector('.settings-nav-item.active')?.dataset.section);
}

function setWallpaper(i) {
  settingsState.wallpaper = i;
  const url = WALLPAPERS[i];
  document.body.style.backgroundImage = `url(${url})`;
  const desk = document.getElementById('desktop');
  if (desk) desk.style.backgroundImage = `url(${url})`;
  saveSettings();
  const active = document.querySelector('.settings-nav-item.active');
  if (active?.dataset.section === 'wallpaper') renderSettings('wallpaper');
}

function setTransparency(v) {
  settingsState.transparency = parseFloat(v);
  applyAllSettings();
  saveSettings();
  // No need to re-render slider usually as it's an oninput move, but let's be safe for other elements
}

function setDockSize(v) {
  settingsState.dockSize = parseFloat(v);
  const shelf = document.querySelector('.dock-shelf');
  if (shelf) {
    const size = 58 * v;
    shelf.style.setProperty('--dock-size', `${size}px`);
  }
  saveSettings();
}

function setDockPosition(pos) {
  settingsState.dockPosition = pos;
  const dock = document.getElementById('dock');
  if (dock) {
    dock.className = '';
    dock.classList.add(`pos-${pos}`);
  }
  saveSettings();
}

function resetSystemData() {
  if (confirm("Are you sure you want to reset everything? Your achievements, settings, and notes will be lost.")) {
    localStorage.clear();
    location.reload();
  }
}
// End of Settings System

async function executeIconSearch() {
  const inp = document.getElementById('icon-search-inp');
  const grid = document.getElementById('icon-search-results');
  if (!inp || !grid) return;
  const q = inp.value.trim();
  if (!q) return;

  grid.innerHTML = '<div class="sp-loading">Searching macOSicons...</div>';
  const data = await searchMacOSIcons(q);
  if (!data || !data.hits || data.hits.length === 0) {
    grid.innerHTML = '<div class="sp-error">No icons found.</div>';
    return;
  }

  grid.innerHTML = data.hits.slice(0, 12).map(hit => `
    <div class="icon-result-card" onclick="applyIcon('${hit.appName}', '${hit.lowResPngUrl || hit.icnsUrl}')">
      <img src="${hit.lowResPngUrl || hit.icnsUrl}" alt="">
      <div class="icon-result-name">${hit.appName}</div>
    </div>
  `).join('');
}

async function searchMacOSIcons(query) {
  const API_KEY = '6b4aded92ffde76b308bc2a6ccf86dfc8c3b0d53b3a79bd5aef179b73e5a3c9b';
  try {
    const res = await fetch('https://api.macosicons.com/api/v1/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': API_KEY },
      body: JSON.stringify({ query })
    });
    return await res.json();
  } catch (e) { return null; }
}

function applyIcon(name, url) {
  const target = prompt(`Apply this icon to which app? (e.g. finder, safari, spotify, folder)`, name.toLowerCase());
  if (!target || !MACOS_ICONS[target.trim()]) return;
  MACOS_ICONS[target.trim()] = url;

  // Refresh UI
  renderLaunchpad();
  refreshDock();
  alert(`Icon for ${target} updated!`);
}

function refreshDock() {
  document.querySelectorAll('.dock-item').forEach(item => {
    const app = item.dataset.app;
    if (MACOS_ICONS[app]) {
      const img = item.querySelector('.dock-img');
      if (img) img.src = MACOS_ICONS[app];
    }
  });
}

function renderLaunchpad() {
  const grid = document.getElementById('lp-grid');
  if (!grid) return;
  grid.innerHTML = ''; // Clear
  LAUNCHPAD_APPS.forEach((app, i) => {
    // Sync with MACOS_ICONS if it has been updated
    if (MACOS_ICONS[app.id]) app.img = MACOS_ICONS[app.id];

    const el = document.createElement('div');
    el.className = 'lp-item';
    el.style.animationDelay = (i * 0.01) + 's';
    const imgClass = 'lp-img';
    el.innerHTML = `<img src="${app.img}" alt="${app.name}" class="${imgClass}"><span>${app.name}</span>`;
    el.onclick = () => { closeLaunchpad(); openWindow(app.id); };
    el.dataset.name = app.name.toLowerCase();
    grid.appendChild(el);
  });
}

/* ====================== TERMINAL ====================== */
/* ====================== TERMINAL ====================== */
const FS = {
  '~': { type: 'dir', children: ['about_me.txt', 'projects', 'system_logs.txt', 'secret_key.txt'] },
  '~/projects': { type: 'dir', children: ['prowiddan.me', 'portfolio-v3', 'tahoe-engine'] },
  '~/about_me.txt': { type: 'file', content: 'Sujayram (ProWiddan) - Student & Developer.\nI build things that feel alive. If you found this terminal, you are already one step ahead.' },
  '~/system_logs.txt': { type: 'file', content: '[LOG] Initializing Tahoe Kernel...\n[LOG] Port 8080 open.\n[LOG] User: ProWiddan authenticated.\n[LOG] Warning: Reality distortion field active.\n[LOG] The truth is in the mountains.' },
  '~/secret_key.txt': { type: 'file', content: 'The key is "TAHOE2025". But what does it unlock? 🕵️' }
};
let termCwd = '~';

function initTerminal() {
  const inp = document.getElementById('term-in');
  if (!inp) return;
  inp.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const cmd = inp.value.trim();
      if (cmd) runCmd(cmd);
      inp.value = '';
    }
  });
  runCmd('neofetch');
}

function runCmd(raw) {
  const out = document.getElementById('term-output');
  const d = document.createElement('div'); d.className = 'term-line';
  const args = raw.split(' ');
  const cmd = args[0].toLowerCase();

  if (cmd === 'neofetch') {
    d.innerHTML = `<span style="color:var(--teal)">prowiddan@macbook</span><br>─────────────<br>OS: prowiddan.me v4.0 (macOS Tahoe)<br>Host: Sujayram's MacBook Pro<br>Uptime: ∞<br>Shell: zsh 5.9<br>Resolution: Dynamic<br>Location: Muscat, Oman<br>Status: Learning things, breaking things 🧠`;
  } else if (cmd === 'clear') { out.innerHTML = ''; return; }
  else if (cmd === 'help') { d.innerHTML = 'Available commands: ls, cd, cat, mkdir, clear, help, whoami, date, echo, neofetch'; }
  else if (cmd === 'whoami') { d.textContent = 'prowiddan'; }
  else if (cmd === 'date') { d.textContent = new Date().toString(); }
  else if (cmd === 'echo') { d.textContent = args.slice(1).join(' '); }
  else if (cmd === 'ls') {
    unlockAchievement('hacker');
    const dir = FS[termCwd];
    d.innerHTML = dir.children.map(c => {
      const isDir = FS[termCwd + '/' + c]?.type === 'dir' || !c.includes('.');
      return `<span style="color:${isDir ? 'var(--blue)' : 'var(--t2)'}; margin-right: 12px">${c}</span>`;
    }).join('');
  } else if (cmd === 'cd') {
    const target = args[1];
    if (!target || target === '~') { termCwd = '~'; d.textContent = 'Changed directory to ~'; }
    else if (target === '..') {
      if (termCwd !== '~') { termCwd = '~'; d.textContent = 'Changed directory to ~'; }
      else d.textContent = 'Already at root';
    } else {
      const fullPath = termCwd + '/' + target;
      if (FS[fullPath] && FS[fullPath].type === 'dir') { termCwd = fullPath; d.textContent = `Changed directory to ${target}`; }
      else d.textContent = `cd: no such directory: ${target}`;
    }
  } else if (cmd === 'matrix') {
    unlockAchievement('matrix_hired');
    d.innerHTML = '<span style="color:#00ff00">Wake up, Neo...</span>';
    setTimeout(() => {
      out.innerHTML += '<div class="term-line" style="color:#00ff00">The Matrix has you.</div>';
      document.body.style.filter = 'hue-rotate(90deg) brightness(1.2)';
      setTimeout(() => document.body.style.filter = '', 3000);
    }, 1000);
  } else if (cmd === 'cat') {
    const target = args[1];
    const fullPath = termCwd + (termCwd === '~' ? '/' : '/') + target;
    if (target === 'system_logs.txt') unlockAchievement('lore_master');
    if (FS[fullPath] && FS[fullPath].type === 'file') { d.textContent = FS[fullPath].content; }
    else d.textContent = `cat: ${target}: No such file`;
  } else if (cmd === 'mkdir') {
    const name = args[1];
    if (!name) d.textContent = 'mkdir: missing operand';
    else {
      FS[termCwd].children.push(name);
      FS[termCwd + '/' + name] = { type: 'dir', children: [] };
      d.textContent = `Created directory: ${name}`;
    }
  } else { d.textContent = `zsh: command not found: ${cmd}`; }

  const promptRow = document.createElement('div');
  promptRow.className = 'term-line';
  promptRow.innerHTML = `<span style="color:var(--green)">you →</span> <span style="color:var(--t2)">${raw}</span>`;
  out.appendChild(promptRow);
  out.appendChild(d);
  document.getElementById('terminal-body').scrollTop = 9999;
}

/* ====================== NOTES ====================== */
const notesData = [
  { id: 1, title: 'About Me', content: '<div class="notes-page"><h1>Sujayram (ProWiddan)</h1><p>I am a student currently navigating the academic obstacle course run by the Central Board of Secondary Education. I live in <strong>Oman</strong>, I\'m originally from <strong>India</strong>, and I spend most of my time learning things, breaking things, or wondering why I didn\'t start earlier.</p><p>I\'m a science student who likes figuring out how systems work—whether they are biological, physical, or digital.</p></div>', date: Date.now() },
  { id: 2, title: 'Skills & Stack', content: '<div class="notes-page"><h1>Skills & Expertise</h1><div class="notes-skill-bar"><span>JavaScript/Web</span><div class="skill-meter"><div class="skill-progress" style="width:85%"></div></div><span>Advanced</span></div><div class="notes-skill-bar"><span>Chess Strategy</span><div class="skill-meter"><div class="skill-progress" style="width:75%"></div></div><span>Intermediate</span></div><br><ul><li><strong>Problem Solving</strong>: Debugging complex systems and logic issues.</li><li><strong>UI/UX Design</strong>: Obsessed with premium, native-feeling experiences.</li><li><strong>Rapid Learning</strong>: Ability to pick up new frameworks and tools over a weekend.</li></ul></div>', date: Date.now() },
  { id: 3, title: 'Philosophy', content: '<div class="notes-page"><h1>My Philosophy</h1><p>I don\'t think people need to be naturally talented to get good at things. I think <strong>direction</strong>, <strong>consistency</strong>, and <strong>curiosity</strong> matter more.</p><blockquote>"Understanding lasts longer than memorizing."</blockquote><ul><li>Learning things properly instead of rushing.</li><li>Improving gradually instead of dramatically.</li><li>Doing work that actually matters and serves a purpose.</li></ul></div>', date: Date.now() },
  { id: 4, title: 'Connect', content: '<div class="notes-page"><h1>Connect</h1><p>I\'m always open to interesting projects or just a quick chat about tech and science.</p><ul><li><strong>Email</strong>: sujayramprasad@gmail.com</li><li><strong>LinkedIn</strong>: <a href="https://www.linkedin.com/in/sujayram-prasad-0b5a61282/" target="_blank" style="color:var(--blue)">sujayram-prasad</a></li><li><strong>Twitter/X</strong>: <a href="https://x.com/SujayramPrasad" target="_blank" style="color:var(--blue)">@SujayramPrasad</a></li><li><strong>Instagram</strong>: <a href="https://www.instagram.com/sujayram_prasad/" target="_blank" style="color:var(--blue)">sujayram_prasad</a> <small style="display:block;font-size:10px;opacity:0.6"></small></li><li><strong>Discord</strong>: <a href="https://discordapp.com/users/1175860358104219710" target="_blank" style="color:var(--blue)">@prowiddan</a></li></ul></div>', date: Date.now() }
];
let activeNoteId = 1;

function initNotes() {
  renderNotesSidebar();
  selectNote(1);
}

function renderNotesSidebar(filter = '') {
  const sidebar = document.getElementById('notes-sidebar');
  if (!sidebar) return;

  const filtered = notesData.filter(n =>
    n.title.toLowerCase().includes(filter.toLowerCase())
  );

  sidebar.innerHTML = filtered.map(note => {
    const snippet = note.content.replace(/<[^>]*>/g, '').substring(0, 40);
    const dateStr = 'Today';
    const isActive = note.id === activeNoteId;
    return `
      <div class="ns-item ${isActive ? 'active' : ''}" onclick="selectNote(${note.id})">
        <div class="ns-title">${note.title}</div>
        <div class="ns-meta">
          <span class="ns-date">${dateStr}</span>
          <span class="ns-snippet">${snippet}</span>
        </div>
      </div>
    `;
  }).join('');
}

function selectNote(id) {
  activeNoteId = id;
  const note = notesData.find(n => n.id === id);
  const editor = document.getElementById('notes-content');
  const header = document.getElementById('notes-content-header');
  if (!note || !editor || !header) return;

  editor.innerHTML = note.content;
  header.textContent = 'Last Modified: Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  renderNotesSidebar();
}

function searchNotes(q) {
  renderNotesSidebar(q);
}

function toggleNotesSidebar() {
  document.getElementById('notes-sidebar')?.classList.toggle('hidden');
}

function openNoteByTitle(title) {
  openWindow('notes');
  const note = notesData.find(n => n.title.toLowerCase().includes(title.toLowerCase()));
  if (note) selectNote(note.id);
}

function factoryReset() {
  if (confirm('Are you sure you want to reset all settings? This will clear your custom wallpaper, icons, and notes.')) {
    localStorage.clear();
    location.reload();
  }
}

function openNoteByTitle(title) {
  openWindow('notes');
  const note = notesData.find(n => n.title.toLowerCase().includes(title.toLowerCase()));
  if (note) selectNote(note.id);
}
async function sendMail() {
  const subjEl = document.querySelector('.mail-in');
  const bodyEl = document.querySelector('.mail-textarea');
  const subj = subjEl?.value || 'Message from prowiddan.me';
  const body = bodyEl?.value || '';
  const sendBtn = document.querySelector('#window-mail .btn-primary');

  if (!body.trim()) {
    showNotification({ name: 'Mail', icon: '✉️', title: 'Empty Message', text: 'Please write something before sending.' });
    return;
  }

  // Update UI to show sending state
  if (sendBtn) {
    sendBtn.disabled = true;
    sendBtn.innerHTML = 'Sending...';
  }
  showNotification({ name: 'Mail', icon: '✉️', title: 'Outgoing...', text: 'Connecting to mail server...' });

  try {
    // We use Formspree which is the standard for static websites. 
    // You will need to replace 'YOUR_FORMSPREE_ID' with your actual ID from formspree.io
    const response = await fetch('https://formspree.io/f/mnjbbvzb', {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subject: subj,
        message: body,
        _replyto: 'sujayramprasad@gmail.com'
      })
    });

    if (response.ok) {
      showNotification({ name: 'Mail', icon: '✉️', title: 'Sent!', text: 'Message delivered to Sujayram.' });
      if (subjEl) subjEl.value = '';
      if (bodyEl) bodyEl.value = '';
      setTimeout(() => closeWindow('mail'), 1000);
    } else {
      throw new Error('Server error');
    }
  } catch (error) {
    showNotification({ name: 'Mail', icon: '⚠️', title: 'Delivery Failed', text: 'Error: Use "mailto:" backup or check connection.' });
    // Backup: if Fetch fails, fall back to mailto so the message isn't lost
    window.location.href = 'mailto:sujayramprasad@gmail.com?subject=' + encodeURIComponent(subj) + '&body=' + encodeURIComponent(body);
  } finally {
    if (sendBtn) {
      sendBtn.disabled = false;
      sendBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg> Send';
    }
  }
}
function openPreviewResume() {
  openWindow('preview');
  document.getElementById('preview-title').textContent = 'Resume';
  document.getElementById('preview-content').innerHTML = '<h1>Sujayram — Resume</h1><p>Student · Science · CBSE</p><p>Muscat, Oman · Originally from India</p><h2>About</h2><p>A science student who likes technology, coding, and understanding systems. Typing speed ~120 WPM. Chess enthusiast.</p><h2>Skills</h2><ul><li>Web Development (HTML, CSS, JavaScript)</li><li>Problem solving & debugging</li><li>Quick learner</li><li>Workflow optimization</li></ul>';
}

/* ====================== DOCK MAGNIFICATION ====================== */
function initDockMag() {
  const dock = document.getElementById('dock');
  const dockShelf = document.getElementById('dock-shelf');
  if (!dock || !dockShelf) return;

  const dockItems = dockShelf.querySelectorAll('.dock-item .dock-img');
  const BASE_SIZE = 58;
  const MAX_SIZE = 100;
  const DISTANCE_THRESHOLD = 200;
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  if (isTouch) return; // Disable magnification on mobile

  document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    // Only magnify if mouse is close to the bottom edge
    const dockRect = dock.getBoundingClientRect();
    if (mouseY < dockRect.top - 50) {
      resetDock();
      return;
    }

    const currentItems = dockShelf.querySelectorAll('.dock-item .dock-img');
    let maxScaledHeight = BASE_SIZE;

    currentItems.forEach(img => {
      const rect = img.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const distance = Math.abs(mouseX - centerX);

      if (distance < DISTANCE_THRESHOLD) {
        const normalized = distance / DISTANCE_THRESHOLD;
        const scale = 1 + (MAX_SIZE / BASE_SIZE - 1) * Math.cos(normalized * Math.PI / 2);
        const newSize = BASE_SIZE * scale;
        img.style.width = `${newSize}px`;
        img.style.height = `${newSize}px`;
        img.style.marginBottom = `${(newSize - BASE_SIZE) / 2}px`; // Pop up effect
        if (newSize > maxScaledHeight) maxScaledHeight = newSize;
      } else {
        img.style.width = `${BASE_SIZE}px`;
        img.style.height = `${BASE_SIZE}px`;
        img.style.marginBottom = '0px';
      }
    });
  });

  document.addEventListener('mouseleave', resetDock);

  function resetDock() {
    dockShelf.querySelectorAll('.dock-item .dock-img').forEach(img => {
      img.style.width = `${BASE_SIZE}px`;
      img.style.height = `${BASE_SIZE}px`;
      img.style.marginBottom = '0px';
    });
  }
}

/* ====================== LANYARD (Real-time Presence) ====================== */
let lanyardWS = null;

function initLanyard() {
  if (lanyardWS) lanyardWS.close();
  lanyardWS = new WebSocket(LANYARD_WS);

  lanyardWS.onopen = () => {
    lanyardWS.send(JSON.stringify({
      op: 2,
      d: { subscribe_to_id: DISCORD_ID }
    }));
  };

  lanyardWS.onmessage = (msg) => {
    const data = JSON.parse(msg.data);
    if (data.op === 1) { // Heartbeat
      lanyardWS.send(JSON.stringify({ op: 3 }));
    } else if (data.t === 'INIT_STATE' || data.t === 'PRESENCE_UPDATE') {
      updatePresence(data.d);
    }
  };

  lanyardWS.onclose = () => {
    setTimeout(initLanyard, 5000); // Reconnect
  };
}

function updatePresence(data) {
  if (!data) return;
  const dot = document.getElementById('mb-status-dot');
  if (dot) dot.style.background = { online: '#30D158', idle: '#FF9F0A', dnd: '#FF453A', offline: '#666' }[data.discord_status] || '#666';

  if (data.discord_user) {
    const avatar = document.getElementById('discord-avatar');
    if (avatar) avatar.src = `https://cdn.discordapp.com/avatars/${data.discord_user.id}/${data.discord_user.avatar}.png`;
    const displayName = document.getElementById('discord-display-name');
    if (displayName) displayName.textContent = data.discord_user.global_name || data.discord_user.username;
    const username = document.getElementById('discord-username');
    if (username) username.textContent = '@' + data.discord_user.username;
  }

  const badge = document.getElementById('discord-badge');
  if (badge) {
    badge.textContent = data.discord_status === 'dnd' ? 'Do Not Disturb' : data.discord_status.charAt(0).toUpperCase() + data.discord_status.slice(1);
    badge.className = 'w-discord-badge ' + (data.discord_status || 'offline');
  }

  const lastOnline = document.getElementById('discord-last-online');
  if (lastOnline) {
    if (data.discord_status === 'offline' && data.kv?.last_seen) {
      const time = new Date(parseInt(data.kv.last_seen)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      lastOnline.textContent = `Last seen: ${time}`;
      lastOnline.classList.remove('hidden');
    } else if (data.discord_status !== 'offline') {
      lastOnline.textContent = 'Status: Active now';
    } else {
      lastOnline.textContent = 'Status: Offline';
    }
  }

  const activity = document.getElementById('discord-activity');
  if (activity) {
    const act = data.activities?.find(a => a.type === 0) || data.activities?.[0];
    activity.textContent = act ? (act.emoji ? act.emoji.name + ' ' : '') + act.name + (act.state ? ': ' + act.state : '') : 'No activity';
  }

  // Native Discord Window Update
  const discordWindow = document.getElementById('window-discord');
  if (discordWindow && !discordWindow.classList.contains('hidden')) {
    const winAvatar = discordWindow.querySelector('.discord-win-avatar');
    if (winAvatar && data.discord_user) {
      winAvatar.src = `https://cdn.discordapp.com/avatars/${data.discord_user.id}/${data.discord_user.avatar}.png?size=256`;
    }
    const winName = discordWindow.querySelector('.discord-win-name');
    if (winName) winName.textContent = data.discord_user?.global_name || data.discord_user?.username || 'ProWiddan';

    const winStatus = discordWindow.querySelector('.discord-win-status-text');
    if (winStatus) winStatus.textContent = data.discord_status === 'dnd' ? 'Do Not Disturb' : data.discord_status.charAt(0).toUpperCase() + data.discord_status.slice(1);

    const winStatusDot = discordWindow.querySelector('.discord-status-indicator');
    if (winStatusDot) winStatusDot.style.background = { online: '#23a55a', idle: '#f0b232', dnd: '#f23f43', offline: '#80848e' }[data.discord_status] || '#80848e';
  }

  // Sync Spotify Across Both
  syncSpotifyState(data);
}

/* ====================== GITHUB ====================== */
async function initGitHub() {
  const container = document.getElementById('github-body');
  if (!container) return;
  try {
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${GITHUB_USER}`),
      fetch(`https://api.github.com/users/${GITHUB_USER}/repos?sort=updated`)
    ]);
    const user = await userRes.json();
    const repos = await reposRes.json();
    container.innerHTML = `
      <div class="gh-profile">
        <img class="gh-avatar" src="${user.avatar_url}" alt="">
        <div class="gh-info">
          <h2>${user.name || user.login}</h2>
          <div class="gh-username">@${user.login}</div>
          <p class="gh-bio">${user.bio || 'Developer'}</p>
          <div class="gh-stats"><span>${user.followers} followers</span><span>${user.following} following</span><span>${user.public_repos} repos</span></div>
          <a class="btn-primary gh-open-btn" href="https://github.com/${GITHUB_USER}" target="_blank">Open in GitHub</a>
        </div>
      </div>
      <div class="gh-repos-title">Repositories</div>
      <div class="gh-repos" id="gh-repos"></div>`;
    const reposEl = document.getElementById('gh-repos');
    (repos.slice(0, 8) || []).forEach(repo => {
      const el = document.createElement('div'); el.className = 'gh-repo';
      el.innerHTML = `<h3>${repo.name}</h3><p>${repo.description || 'No description'}</p><div class="gh-repo-meta"><span>${repo.language || '—'}</span><span>★ ${repo.stargazers_count}</span></div>`;
      el.onclick = () => window.open(repo.html_url, '_blank');
      reposEl.appendChild(el);
    });
  } catch (e) {
    container.innerHTML = `<div class="gh-profile"><p>Could not load GitHub. <a href="https://github.com/${GITHUB_USER}" target="_blank">Open GitHub</a></p></div>`;
  }
}

/* ====================== CALCULATOR ====================== */
let calcMemory = 0;
function calcBtn(v) {
  const display = document.getElementById('calc-display');
  if (!display) return;

  const animate = () => {
    display.classList.add('calc-flash');
    setTimeout(() => display.classList.remove('calc-flash'), 100);
  };

  if (v === 'C') {
    calcDisplay = '0';
    calcOp = '';
    calcPrev = 0;
    calcReset = false;
  } else if (v === 'negate') {
    calcDisplay = (parseFloat(calcDisplay) * -1).toString();
  } else if (v === '%') {
    calcDisplay = (parseFloat(calcDisplay) / 100).toString();
  } else if (['+', '-', '*', '/'].includes(v)) {
    calcPrev = parseFloat(calcDisplay);
    calcOp = v;
    calcReset = true;
    return;
  } else if (v === '=') {
    const current = parseFloat(calcDisplay);
    if (calcOp === '+') calcDisplay = (calcPrev + current).toString();
    if (calcOp === '-') calcDisplay = (calcPrev - current).toString();
    if (calcOp === '*') calcDisplay = (calcPrev * current).toString();
    if (calcOp === '/') calcDisplay = (calcPrev / current).toString();
    calcOp = '';
    calcReset = true;
    animate();
  } else if (['sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'sinh', 'cosh', 'tanh', 'log', 'ln', 'sqrt', 'cbrt', 'exp', 'fact', '1/x'].includes(v)) {
    const val = parseFloat(calcDisplay);
    if (v === 'sin') calcDisplay = Math.sin(val).toString();
    if (v === 'cos') calcDisplay = Math.cos(val).toString();
    if (v === 'tan') calcDisplay = Math.tan(val).toString();
    if (v === 'log') calcDisplay = Math.log10(val).toString();
    if (v === 'ln') calcDisplay = Math.log(val).toString();
    if (v === 'sqrt') calcDisplay = Math.sqrt(val).toString();
    if (v === 'cbrt') calcDisplay = Math.cbrt(val).toString();
    if (v === 'exp') calcDisplay = Math.exp(val).toString();
    if (v === '1/x') calcDisplay = (1 / val).toString();
    if (v === 'fact') {
      let r = 1;
      for (let i = 2; i <= val; i++) r *= i;
      calcDisplay = r.toString();
    }
    calcReset = true;
    animate();
  } else if (v === '2nd') {
    document.querySelector('.calc-keys')?.classList.toggle('scientific');
    return;
  } else if (v === 'pi') {
    calcDisplay = Math.PI.toString();
    calcReset = true;
  } else if (v === 'e') {
    calcDisplay = Math.E.toString();
    calcReset = true;
  } else if (v === 'rand') {
    calcDisplay = Math.random().toString();
    calcReset = true;
  } else {
    if (calcReset || calcDisplay === '0') {
      calcDisplay = v;
      calcReset = false;
    } else {
      calcDisplay += v;
    }
  }

  // Format display string to fixed length if too long
  if (calcDisplay.length > 12) {
    const num = parseFloat(calcDisplay);
    calcDisplay = num.toPrecision(8).toString();
  }

  // Highlight active operator
  document.querySelectorAll('.ck-op').forEach(btn => {
    btn.classList.toggle('active', btn.textContent === calcOp && !calcReset);
  });

  // Toggle AC / C
  const acBtn = Array.from(document.querySelectorAll('.ck-fn')).find(b => b.textContent === 'AC' || b.textContent === 'C');
  if (acBtn) acBtn.textContent = (calcDisplay === '0' && !calcOp) ? 'AC' : 'C';

  display.innerHTML = `<span class="calc-display-val">${calcDisplay}</span>`;
}



/* ====================== SPOTIFY: UNIFIED ENGINE ====================== */
let spPlayer = new Audio();
let spCurrentTrack = null;

function spPlayLocal(track) {
  if (!track || !track.preview) return;
  spCurrentTrack = track;
  spPlayer.src = track.preview;
  spPlayer.play();
  updateSpotifyUI(track);
}

function updateSpotifyUI(track) {
  // Update Widget
  document.getElementById('w-spotify-playing')?.classList.remove('hidden');
  document.getElementById('w-spotify-idle')?.classList.add('hidden');
  const art = document.getElementById('w-spotify-art');
  if (art) art.src = track.img || '';
  const song = document.getElementById('w-spotify-song');
  if (song) song.textContent = track.name;
  const artist = document.getElementById('w-spotify-artist');
  if (artist) artist.textContent = track.artist;

  // Update App if open
  const appName = document.getElementById('sp-track-name');
  if (appName) appName.textContent = track.name;
  const appArtist = document.getElementById('sp-artist-name');
  if (appArtist) appArtist.textContent = track.artist;
  const appArt = document.getElementById('sp-art-small');
  if (appArt) appArt.src = track.img || '';
}

function spTogglePlay() {
  if (!spPlayer.src) return;
  if (spPlayer.paused) spPlayer.play();
  else spPlayer.pause();
  const state = spPlayer.paused ? '▶' : '⏸';
  const btn = document.getElementById('sp-play-btn');
  if (btn) btn.textContent = state;
}

function syncSpotifyState(data) {
  const container = document.getElementById('w-spotify-integrated');
  if (data.spotify) {
    container?.classList.remove('hidden');
    const track = {
      name: data.spotify.song,
      artist: data.spotify.artist,
      img: data.spotify.album_art_url
    };
    updateSpotifyUI(track);
  } else {
    container?.classList.add('hidden');
  }
}

/* ====================== CAMERA ====================== */
function initCamera() {
  const body = document.getElementById('camera-body');
  if (!body) return;
  body.innerHTML = `<video id="camera-video" autoplay playsinline style="width:100%;height:100%;object-fit:cover;background:#000"></video>
    <div style="position:absolute;bottom:16px;left:50%;transform:translateX(-50%);display:flex;gap:12px;z-index:10">
      <button onclick="capturePhoto()" style="width:56px;height:56px;border-radius:50%;background:rgba(255,255,255,.9);border:4px solid rgba(255,255,255,.6);cursor:pointer"></button>
    </div>`;
  navigator.mediaDevices?.getUserMedia({ video: true }).then(stream => {
    document.getElementById('camera-video').srcObject = stream;
  }).catch(() => {
    body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#fff;flex-direction:column;gap:12px;background:#000"><p style="font-size:48px">📷</p><p>Camera access denied or unavailable</p></div>';
  });
}
function capturePhoto() {
  const video = document.getElementById('camera-video');
  if (!video) return;
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth; canvas.height = video.videoHeight;
  canvas.getContext('2d').drawImage(video, 0, 0);
  const link = document.createElement('a');
  link.download = 'photo.png'; link.href = canvas.toDataURL(); link.click();
}

/* ====================== CHESS ====================== */
let chessGame, chessBoardEl;
const CHESS_PIECES = {
  'p': 'https://raw.githubusercontent.com/lichess-org/lila/master/public/piece/cburnett/bP.svg',
  'r': 'https://raw.githubusercontent.com/lichess-org/lila/master/public/piece/cburnett/bR.svg',
  'n': 'https://raw.githubusercontent.com/lichess-org/lila/master/public/piece/cburnett/bN.svg',
  'b': 'https://raw.githubusercontent.com/lichess-org/lila/master/public/piece/cburnett/bB.svg',
  'q': 'https://raw.githubusercontent.com/lichess-org/lila/master/public/piece/cburnett/bQ.svg',
  'k': 'https://raw.githubusercontent.com/lichess-org/lila/master/public/piece/cburnett/bK.svg',
  'P': 'https://raw.githubusercontent.com/lichess-org/lila/master/public/piece/cburnett/wP.svg',
  'R': 'https://raw.githubusercontent.com/lichess-org/lila/master/public/piece/cburnett/wR.svg',
  'N': 'https://raw.githubusercontent.com/lichess-org/lila/master/public/piece/cburnett/wN.svg',
  'B': 'https://raw.githubusercontent.com/lichess-org/lila/master/public/piece/cburnett/wB.svg',
  'Q': 'https://raw.githubusercontent.com/lichess-org/lila/master/public/piece/cburnett/wQ.svg',
  'K': 'https://raw.githubusercontent.com/lichess-org/lila/master/public/piece/cburnett/wK.svg'
};

const CHESS_VALS = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000 };
const CHESS_PST = {
  p: [
    [0, 0, 0, 0, 0, 0, 0, 0], [50, 50, 50, 50, 50, 50, 50, 50],
    [10, 10, 20, 30, 30, 20, 10, 10], [5, 5, 10, 25, 25, 10, 5, 5],
    [0, 0, 0, 20, 20, 0, 0, 0], [5, -5, -10, 0, 0, -10, -5, 5],
    [5, 10, 10, -20, -20, 10, 10, 5], [0, 0, 0, 0, 0, 0, 0, 0]
  ],
  n: [
    [-50, -40, -30, -30, -30, -30, -40, -50], [-40, -20, 0, 0, 0, 0, -20, -40],
    [-30, 0, 10, 15, 15, 10, 0, -30], [-30, 5, 15, 20, 20, 15, 5, -30],
    [-30, 0, 15, 20, 20, 15, 0, -30], [-30, 5, 10, 15, 15, 10, 5, -30],
    [-40, -20, 0, 5, 5, 0, -20, -40], [-50, -40, -30, -30, -30, -30, -40, -50]
  ],
  b: [
    [-20, -10, -10, -10, -10, -10, -10, -20], [-10, 0, 0, 0, 0, 0, 0, -10],
    [-10, 0, 5, 10, 10, 5, 0, -10], [-10, 5, 5, 10, 10, 5, 5, -10],
    [-10, 0, 10, 10, 10, 10, 0, -10], [-10, 10, 10, 10, 10, 10, 10, -10],
    [-10, 5, 0, 0, 0, 0, 5, -10], [-20, -10, -10, -10, -10, -10, -10, -20]
  ],
  r: [
    [0, 0, 0, 0, 0, 0, 0, 0], [5, 10, 10, 10, 10, 10, 10, 5],
    [-5, 0, 0, 0, 0, 0, 0, -5], [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5], [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5], [0, 0, 0, 5, 5, 0, 0, 0]
  ],
  q: [
    [-20, -10, -10, -5, -5, -10, -10, -20], [-10, 0, 0, 0, 0, 0, 0, -10],
    [-10, 0, 5, 5, 5, 5, 0, -10], [-5, 0, 5, 5, 5, 5, 0, -5],
    [0, 0, 5, 5, 5, 5, 0, -5], [-10, 5, 5, 5, 5, 5, 0, -10],
    [-10, 0, 5, 0, 0, 0, 0, -10], [-20, -10, -10, -5, -5, -10, -10, -20]
  ],
  k: [
    [-30, -40, -40, -50, -50, -40, -40, -30], [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30], [-30, -40, -40, -50, -50, -40, -40, -30],
    [-20, -30, -30, -40, -40, -30, -30, -20], [-10, -20, -20, -20, -20, -20, -20, -10],
    [20, 20, 0, 0, 0, 0, 20, 20], [20, 30, 10, 0, 0, 10, 30, 20]
  ]
};

function chessEval(game) {
  let score = 0;
  const board = game.board();
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (p) {
        const isWhite = p.color === 'w';
        // Correct PST mapping: Index 0 is Rank 8 (row 0), Index 7 is Rank 1 (row 7)
        // White pieces at row r use CHESS_PST[p.type][r][c]
        // Black pieces at row r use CHESS_PST[p.type][7-r][c] (flipped)
        const pValue = CHESS_VALS[p.type] + CHESS_PST[p.type][isWhite ? r : 7 - r][c];
        score += pValue * (isWhite ? 1 : -1);
      }
    }
  }
  return score;
}

function chessMinimax(game, depth, alpha, beta, isMax) {
  if (depth === 0) return chessEval(game);

  const moves = game.moves();
  if (moves.length === 0) {
    if (game.in_checkmate()) return isMax ? -50000 : 50000;
    return 0;
  }

  // Simple move ordering: captures and checks first
  moves.sort((a, b) => {
    let sa = 0, sb = 0;
    if (a.includes('x')) sa += 10; if (b.includes('x')) sb += 10;
    if (a.includes('+')) sa += 5; if (b.includes('+')) sb += 5;
    return sb - sa;
  });

  if (isMax) {
    let best = -Infinity;
    for (const m of moves) {
      game.move(m);
      best = Math.max(best, chessMinimax(game, depth - 1, alpha, beta, false));
      game.undo();
      alpha = Math.max(alpha, best);
      if (beta <= alpha) break;
    }
    return best;
  } else {
    let best = Infinity;
    for (const m of moves) {
      game.move(m);
      best = Math.min(best, chessMinimax(game, depth - 1, alpha, beta, true));
      game.undo();
      beta = Math.min(beta, best);
      if (beta <= alpha) break;
    }
    return best;
  }
}


function initChess() {
  chessGame = new Chess();
  chessBoardEl = document.getElementById('chess-body');
  chessSelected = null;
  chessMoves = [];
  isAiThinking = false;
  renderChess();
}

function renderChess() {
  if (!chessBoardEl) return;
  const board = chessGame.board();
  const history = chessGame.history();
  const turn = chessGame.turn() === 'w' ? 'white' : 'black';
  const lastMove = history.length > 0 ? chessGame.history({ verbose: true }).pop() : null;

  let html = '<div class="chess-container"><div class="chess-board-wrapper"><div class="chess-board">';

  // Render board
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const square = String.fromCharCode(97 + c) + (8 - r);
      const piece = board[r][c];
      const light = (r + c) % 2 === 0;
      const isSelected = chessSelected === square;
      const isMoveHighlight = chessMoves?.some(m => m.to === square);
      const isLastMove = lastMove && (lastMove.from === square || lastMove.to === square);

      html += `
        <div class="chess-cell ${light ? 'light' : 'dark'} ${isSelected ? 'selected' : ''} ${isLastMove ? 'chess-last-move' : ''} ${isMoveHighlight ? 'highlight' : ''}" 
             onclick="chessSquareClick('${square}')">
          ${piece ? `<img src="${CHESS_PIECES[piece.color === 'w' ? piece.type.toUpperCase() : piece.type]}" alt="${piece.type}">` : ''}
          ${c === 0 ? `<span class="coord rank">${8 - r}</span>` : ''}
          ${r === 7 ? `<span class="coord file">${String.fromCharCode(97 + c)}</span>` : ''}
        </div>`;
    }
  }
  html += '</div></div>';

  // Enhanced Sidebar
  html += `<div class="chess-sidebar">`;
  html += `<div class="chess-sb-header">
            <h3>Prowiddan Engine</h3>
            <div class="chess-players-info">
              <div class="player white active">
                <span class="p-icon">👤</span>
                <span class="p-name">You (White)</span>
              </div>
              <div class="player black ${isAiThinking ? 'active' : ''}">
                <span class="p-icon">�</span>
                <span class="p-name">AI Engine</span>
              </div>
            </div>
            <span class="chess-status-pill ${isAiThinking ? 'thinking' : ''}">${isAiThinking ? 'Analyzing...' : (turn === 'white' ? 'Your turn' : 'Thinking...')}</span>
          </div>`;

  if (chessGame.in_check()) html += `<div class="chess-alert check">⚠️ CHECK</div>`;
  if (chessGame.game_over()) {
    let msg = "Game Over";
    if (chessGame.in_draw()) msg = "Draw!";
    else if (chessGame.in_checkmate()) msg = (chessGame.turn() === 'w' ? 'Black' : 'White') + " Wins!";
    html += `<div class="chess-alert win">${msg}</div>`;
  }

  html += `<div class="chess-actions">
    <button class="btn-primary" onclick="initChess()">New Game</button>
    <button class="btn-secondary" onclick="chessUndoMove()">Undo</button>
  </div>`;

  html += `<div class="chess-history">
            <div class="history-label">Move History</div>
            <div class="history-list">`;
  for (let i = 0; i < history.length; i += 2) {
    html += `<div class="history-row">
      <span class="move-num">${Math.floor(i / 2) + 1}</span>
      <span class="move-val white">${history[i]}</span>
      <span class="move-val black">${history[i + 1] || ''}</span>
    </div>`;
  }
  if (history.length === 0) html += `<div class="history-empty">No moves yet</div>`;
  html += '</div></div>';

  html += `
    <a href="https://www.chess.com/member/sujayram_prasad" target="_blank" class="chess-profile-link modern">
      <img src="https://www.chess.com/favicon.ico" alt="chess.com">
      Play on Chess.com
    </a>
  `;

  html += '</div></div>';

  chessBoardEl.innerHTML = html;
}

function chessUndoMove() {
  chessGame.undo(); // Undo AI move
  chessGame.undo(); // Undo Player move
  chessSelected = null;
  chessMoves = [];
  isAiThinking = false;
  renderChess();
}

function handleGameOver() {
  // Potential for confetti or sound
  renderChess();
}

let chessSelected = null;
let chessMoves = [];

function chessSquareClick(square) {
  if (chessGame.game_over() || isAiThinking || chessGame.turn() === 'b') return;

  // If clicking the same square, deselect
  if (chessSelected === square) {
    chessSelected = null;
    chessMoves = [];
    renderChess();
    return;
  }

  // Try to move
  const move = chessGame.move({ from: chessSelected, to: square, promotion: 'q' });

  if (move) {
    chessSelected = null;
    chessMoves = [];
    renderChess();
    if (!chessGame.game_over()) {
      isAiThinking = true;
      renderChess();
      setTimeout(chessAI, 250);
    }
  } else {
    // Select square
    const piece = chessGame.get(square);
    if (piece && piece.color === chessGame.turn()) {
      chessSelected = square;
      chessMoves = chessGame.moves({ square: square, verbose: true });
      renderChess();
    } else {
      chessSelected = null;
      chessMoves = [];
      renderChess();
    }
  }
}

function chessAI() {
  if (chessGame.game_over()) return;

  try {
    const moves = chessGame.moves();
    if (moves.length === 0) return;

    let bestMove = null;
    let bestValue = Infinity; // Black wants to minimize the score

    // We'll use a total depth of 3 (1 here + 2 in minimax)
    // This is plenty for a browser-based internal engine to play competently but instantly
    for (const m of moves) {
      chessGame.move(m);
      const boardValue = chessMinimax(chessGame, 2, -Infinity, Infinity, true);
      chessGame.undo();

      if (boardValue < bestValue) {
        bestValue = boardValue;
        bestMove = m;
      }
    }

    if (bestMove) {
      chessGame.move(bestMove);
    }
  } catch (e) {
    console.error('Chess AI Error:', e);
    // Move randomly if the engine fails for any reason
    const moves = chessGame.moves();
    if (moves.length > 0) chessGame.move(moves[Math.floor(Math.random() * moves.length)]);
  }

  isAiThinking = false;
  renderChess();
  if (chessGame.game_over()) handleGameOver();
}

/* ====================== 2048 ====================== */
let grid2048, score2048;
function init2048() {
  grid2048 = Array(4).fill(null).map(() => Array(4).fill(0));
  score2048 = 0; add2048Tile(); add2048Tile(); render2048();
  document.onkeydown = e => { if (!openWindows.has('game2048')) return; const m = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right' }[e.key]; if (m) { e.preventDefault(); move2048(m); } };
}
function add2048Tile() {
  const empty = [];
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) if (grid2048[r][c] === 0) empty.push([r, c]);
  if (empty.length) { const [r, c] = empty[Math.floor(Math.random() * empty.length)]; grid2048[r][c] = Math.random() < .9 ? 2 : 4; }
}
function render2048() {
  const body = document.getElementById('game2048-body');
  if (!body) return;
  const colors = { 0: 'rgba(238, 228, 218, 0.35)', 2: '#eee4da', 4: '#ede0c8', 8: '#f2b179', 16: '#f59563', 32: '#f67c5f', 64: '#f65e3b', 128: '#edcf72', 256: '#edcc61', 512: '#edc850', 1024: '#edc53f', 2048: '#edc22e' };
  const textColors = { 0: 'transparent', 2: '#776e65', 4: '#776e65' };

  let html = `<div class="game-2048-container">
    <div class="game-2048-header">
      <button class="btn-primary" onclick="init2048()">New Game</button>
      <div class="game-2048-score-box">
        <div class="game-2048-score-label">Score</div>
        <div class="game-2048-score-value">${score2048}</div>
      </div>
    </div>
    <div class="game-2048-grid">`;

  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const v = grid2048[r][c];
      html += `<div class="tile-2048" style="background:${colors[v] || '#3c3a32'}; color:${textColors[v] || '#f9f6f2'}">${v || ''}</div>`;
    }
  }

  html += `</div>
    <div style="font-size:12px; color:#8e8e93">Use arrow keys to combine tiles!</div>
  </div>`;
  body.innerHTML = html;
}
function move2048(dir) {
  let moved = false;
  const rotate = g => g[0].map((_, c) => g.map(r => r[c]).reverse());
  let g = grid2048.map(r => [...r]);
  let rotations = { up: 0, right: 1, down: 2, left: 3 }[dir];
  for (let i = 0; i < rotations; i++) g = rotate(g);
  for (let r = 0; r < 4; r++) {
    let row = g[r].filter(v => v); let merged = [];
    for (let i = 0; i < row.length; i++) { if (i < row.length - 1 && row[i] === row[i + 1]) { merged.push(row[i] * 2); score2048 += row[i] * 2; i++; moved = true; } else merged.push(row[i]); }
    while (merged.length < 4) merged.push(0);
    if (g[r].join(',') !== merged.join(',')) moved = true;
    g[r] = merged;
  }
  for (let i = 0; i < (4 - rotations) % 4; i++) g = rotate(g);
  if (moved) { grid2048 = g; add2048Tile(); render2048(); }
}

/* ====================== FLAPPY BIRD ====================== */
function initFlappy() {
  const body = document.getElementById('flappy-body');
  if (!body) return;
  body.innerHTML = `<div style="display:flex; flex-direction:column; align-items:center; gap:16px; padding:20px; background:#1c1c1e; height:100%; justify-content:center">
    <div style="display:flex; justify-content:space-between; width:400px; align-items:center">
      <div style="background:#3a3a3c; padding:8px 16px; border-radius:8px">
        <div style="font-size:10px; color:#8e8e93; font-weight:700; text-transform:uppercase">Score</div>
        <div id="flappy-score" style="font-size:20px; font-weight:700">0</div>
      </div>
      <button class="btn-primary" onclick="initFlappy()">Restart</button>
    </div>
    <div style="position:relative">
      <canvas id="flappy-canvas" width="400" height="500" style="display:block; background:#4EC0CA; border-radius:12px; box-shadow:0 12px 40px rgba(0,0,0,0.4)"></canvas>
      <div id="flappy-overlay" class="game-over-overlay hidden">
        <h2 style="font-size:32px; margin-bottom:8px">CRASHED!</h2>
        <p id="flappy-final-score" style="font-size:18px; color:var(--t2); margin-bottom:24px"></p>
        <button class="btn-primary" onclick="initFlappy()">Fly Again</button>
      </div>
    </div>
  </div>`;

  const canvas = document.getElementById('flappy-canvas');
  const ctx = canvas.getContext('2d');
  let bird = { x: 80, y: 200, vy: 0, r: 15 }, pipes = [], gap = 140, score = 0, running = true, frame = 0;

  function addPipe() {
    const h = 80 + Math.random() * 200;
    pipes.push({ x: 400, top: h, bot: h + gap });
  }

  function tick() {
    if (!running) return;
    ctx.clearRect(0, 0, 400, 500);
    // Draw sky
    ctx.fillStyle = '#4EC0CA'; ctx.fillRect(0, 0, 400, 500);

    bird.vy += 0.4; bird.y += bird.vy;

    // Draw bird (modern look)
    ctx.fillStyle = '#F7DC6F';
    ctx.beginPath(); ctx.arc(bird.x, bird.y, bird.r, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(bird.x + 8, bird.y - 4, 2, 0, Math.PI * 2); ctx.fill(); // Eye
    ctx.fillStyle = '#E67E22'; ctx.beginPath(); ctx.moveTo(bird.x + 12, bird.y); ctx.lineTo(bird.x + 20, bird.y); ctx.lineTo(bird.x + 12, bird.y + 4); ctx.fill(); // Beak

    frame++; if (frame % 90 === 0) addPipe();

    ctx.fillStyle = '#2ECC71';
    pipes.forEach(p => {
      p.x -= 2;
      // Top Pipe
      ctx.fillRect(p.x, 0, 40, p.top);
      ctx.fillStyle = '#27AE60'; ctx.fillRect(p.x - 4, p.top - 20, 48, 20); ctx.fillStyle = '#2ECC71';
      // Bot Pipe
      ctx.fillRect(p.x, p.bot, 40, 500 - p.bot);
      ctx.fillStyle = '#27AE60'; ctx.fillRect(p.x - 4, p.bot, 48, 20); ctx.fillStyle = '#2ECC71';

      if (bird.x + bird.r > p.x && bird.x - bird.r < p.x + 40 && (bird.y - bird.r < p.top || bird.y + bird.r > p.bot)) { running = false; }
    });

    pipes = pipes.filter(p => p.x > -48);
    if (bird.y > 500 || bird.y < 0) running = false;

    if (running) {
      score++;
      const s = Math.floor(score / 10);
      document.getElementById('flappy-score').textContent = s;
      if (s >= 10) unlockAchievement('flappy_pro');
      requestAnimationFrame(tick);
    } else {
      document.getElementById('flappy-overlay').classList.remove('hidden');
      document.getElementById('flappy-final-score').textContent = `Score: ${Math.floor(score / 10)}`;
    }
  }

  function flap() { if (running) bird.vy = -7; }

  canvas.onclick = flap;
  document.onkeydown = e => { if (e.code === 'Space' && openWindows.has('flappy')) { e.preventDefault(); flap(); } };
  addPipe();
  tick();
}

/* ====================== TETRIS ====================== */
function initTetris() {
  const body = document.getElementById('tetris-body');
  if (!body) return;
  body.innerHTML = `<div class="tetris-ui">
    <div style="position:relative">
      <canvas id="tetris-canvas" width="240" height="480" style="display:block; background:#000; border:1px solid #333"></canvas>
      <div id="tetris-overlay" class="game-over-overlay hidden">
        <h2 style="font-size:28px; margin-bottom:8px">GAME OVER</h2>
        <button class="btn-primary" onclick="initTetris()">Restart</button>
      </div>
    </div>
    <div class="tetris-info">
      <div class="tetris-stat">
        <div class="tetris-stat-label">Score</div>
        <div id="tetris-score" class="tetris-stat-value">0</div>
      </div>
      <div class="tetris-stat">
        <div class="tetris-stat-label">Next</div>
        <div style="height:60px; display:flex; align-items:center; justify-content:center; font-size:24px">?</div>
      </div>
      <button class="btn-primary" onclick="initTetris()" style="margin-top:auto">New</button>
    </div>
  </div>`;

  const canvas = document.getElementById('tetris-canvas');
  const ctx = canvas.getContext('2d');
  const COLS = 10, ROWS = 20, SZ = 24;
  let board = Array(ROWS).fill(null).map(() => Array(COLS).fill(0));
  const SHAPES = [[[1, 1, 1, 1]], [[1, 1], [1, 1]], [[0, 1, 0], [1, 1, 1]], [[1, 0, 0], [1, 1, 1]], [[0, 0, 1], [1, 1, 1]], [[0, 1, 1], [1, 1, 0]], [[1, 1, 0], [0, 1, 1]]];
  const COLORS = ['#00f0f0', '#f0f000', '#a000f0', '#0000f0', '#f0a000', '#00f000', '#f00000'];
  let piece, px, py, pcolor, score = 0, running = true, interval;

  function newPiece() {
    const i = Math.floor(Math.random() * SHAPES.length);
    piece = SHAPES[i].map(r => [...r]);
    pcolor = COLORS[i]; px = 3; py = 0;
    if (collides(px, py, piece)) { running = false; }
  }

  function collides(x, y, p) {
    for (let r = 0; r < p.length; r++)
      for (let c = 0; c < p[0].length; c++)
        if (p[r][c] && (y + r >= ROWS || x + c < 0 || x + c >= COLS || board[y + r][x + c])) return true;
    return false;
  }

  function merge() {
    for (let r = 0; r < piece.length; r++)
      for (let c = 0; c < piece[0].length; c++)
        if (piece[r][c]) board[py + r][px + c] = pcolor;
  }

  function clearRows() {
    for (let r = ROWS - 1; r >= 0; r--)
      if (board[r].every(c => c)) {
        board.splice(r, 1);
        board.unshift(Array(COLS).fill(0));
        score += 100;
        document.getElementById('tetris-score').textContent = score;
        if (score >= 500) unlockAchievement('tetris_wizard');
        r++;
      }
  }

  function rotate() {
    const p = piece[0].map((_, c) => piece.map(r => r[c]).reverse());
    if (!collides(px, py, p)) piece = p;
  }

  function draw() {
    ctx.clearRect(0, 0, 240, 480);
    // Grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.03)';
    for (let i = 0; i <= 240; i += SZ) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 480); ctx.stroke(); }
    for (let i = 0; i <= 480; i += SZ) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(240, i); ctx.stroke(); }

    for (let r = 0; r < ROWS; r++)
      for (let c = 0; c < COLS; c++) {
        if (board[r][c]) {
          ctx.fillStyle = board[r][c];
          ctx.beginPath();
          ctx.roundRect(c * SZ + 1, r * SZ + 1, SZ - 2, SZ - 2, 3);
          ctx.fill();
        }
      }

    if (piece)
      for (let r = 0; r < piece.length; r++)
        for (let c = 0; c < piece[0].length; c++)
          if (piece[r][c]) {
            ctx.fillStyle = pcolor;
            ctx.beginPath();
            ctx.roundRect((px + c) * SZ + 1, (py + r) * SZ + 1, SZ - 2, SZ - 2, 3);
            ctx.fill();
          }

    if (!running) {
      document.getElementById('tetris-overlay').classList.remove('hidden');
      clearInterval(interval);
    }
  }

  function tick() { if (!running) return; if (!collides(px, py + 1, piece)) { py++; } else { merge(); clearRows(); newPiece(); } draw(); }

  document.onkeydown = e => {
    if (!openWindows.has('tetris') || !running) return;
    if (e.key === 'ArrowLeft' && !collides(px - 1, py, piece)) { px--; draw(); }
    if (e.key === 'ArrowRight' && !collides(px + 1, py, piece)) { px++; draw(); }
    if (e.key === 'ArrowDown') { if (!collides(px, py + 1, piece)) py++; draw(); }
    if (e.key === 'ArrowUp') { rotate(); draw(); }
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) e.preventDefault();
  };

  newPiece(); draw(); interval = setInterval(tick, 500);
}

/* ====================== SNAKE ====================== */
function initSnake() {
  const body = document.getElementById('snake-body');
  if (!body) return;
  body.innerHTML = `<div class="snake-container" style="display:flex; flex-direction:column; align-items:center; gap:16px; padding:20px">
    <div style="display:flex; justify-content:space-between; width:400px; align-items:center">
      <div style="background:#3a3a3c; padding:8px 16px; border-radius:8px">
        <div style="font-size:10px; color:#8e8e93; font-weight:700; text-transform:uppercase">Score</div>
        <div id="snake-score" style="font-size:20px; font-weight:700">${0}</div>
      </div>
      <button class="btn-primary" onclick="initSnake()">Restart</button>
    </div>
    <div class="snake-canvas-wrap" style="position:relative">
      <canvas id="snake-canvas" width="400" height="400" style="display:block; background:#000; border-radius:4px"></canvas>
      <div id="snake-overlay" class="game-over-overlay hidden">
        <h2 style="font-size:32px; margin-bottom:8px">GAME OVER</h2>
        <p id="snake-final-score" style="font-size:18px; color:var(--t2); margin-bottom:24px"></p>
        <button class="btn-primary" onclick="initSnake()">Try Again</button>
      </div>
    </div>
  </div>`;

  const canvas = document.getElementById('snake-canvas');
  const ctx = canvas.getContext('2d');
  const SZ = 20, COLS = 20, ROWS = 20;
  let snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }], dir = { x: 1, y: 0 }, food, score = 0, running = true;

  function placeFood() {
    food = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
    if (snake.some(s => s.x === food.x && s.y === food.y)) placeFood();
  }

  function draw() {
    ctx.clearRect(0, 0, 400, 400);
    // Draw grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    for (let i = 0; i <= 400; i += SZ) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 400); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(400, i); ctx.stroke();
    }

    // Draw snake
    snake.forEach((s, i) => {
      ctx.fillStyle = i === 0 ? '#30D158' : '#28a745';
      const r = i === 0 ? 6 : 4;
      ctx.beginPath();
      ctx.roundRect(s.x * SZ + 1, s.y * SZ + 1, SZ - 2, SZ - 2, 4);
      ctx.fill();
    });

    // Draw food
    ctx.fillStyle = '#FF453A';
    ctx.beginPath();
    ctx.arc(food.x * SZ + SZ / 2, food.y * SZ + SZ / 2, 8, 0, Math.PI * 2);
    ctx.fill();

    if (!running) {
      document.getElementById('snake-overlay').classList.remove('hidden');
      document.getElementById('snake-final-score').textContent = `Final Score: ${score}`;
    }
  }

  function tick() {
    if (!running) return;
    const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
    if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS || snake.some(s => s.x === head.x && s.y === head.y)) {
      running = false; draw(); return;
    }
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
      score += 10;
      document.getElementById('snake-score').textContent = score;
      if (score >= 50) unlockAchievement('snake_pro');
      placeFood();
    } else snake.pop();
    draw();
    setTimeout(tick, 100);
  }

  placeFood();
  draw();
  tick();

  document.onkeydown = e => {
    if (!openWindows.has('snake')) return;
    const dirs = { ArrowUp: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 }, ArrowLeft: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 } };
    if (dirs[e.key]) {
      const d = dirs[e.key];
      if (d.x !== -dir.x || d.y !== -dir.y) dir = d;
      e.preventDefault();
    }
  };
}

/* ====================== TUTORIAL SYSTEM ====================== */
let currentTutorialStep = 0;
const tutorialSteps = [
  { text: "Hey! Welcome to ProWiddanOS. It's a tribute to macOS, built entirely with code. Let's take a quick look around.", target: null },
  { text: "Up here is the Menu Bar. It's where you'll find system settings, the clock, and some handy controls.", target: "#menubar" },
  { text: "This is the Dock. Just like on a real Mac, it holds your open apps. Give them a hover—they're quite reactive.", target: "#dock" },
  { text: "The Launchpad is where all the fun stuff is. I've packed it with games and tools for you to explore.", target: ".dock-item[data-app='launchpad']" },
  { text: "Over here is my Discord widget. You can see my real-time status or judge my Spotify playlist. (Mostly vibes).", target: "#widget-discord" },
  { text: "That's the basic tour! Feel free to click around and break things—it's how I learned to build this.", target: null }
];

let tutorialTypingTimer = null;

function startTutorial() {
  const overlay = document.getElementById('tutorial-overlay');
  if (!overlay) return;
  overlay.classList.remove('hidden');
  currentTutorialStep = 0;
  updateTutorialStep();
}

function updateTutorialStep() {
  const textEl = document.getElementById('tutorial-text');
  const card = document.querySelector('.tutorial-card');
  const dots = document.querySelectorAll('.tutorial-dot');

  // Remove old highlight
  document.querySelectorAll('.tutorial-highlight').forEach(el => el.classList.remove('tutorial-highlight'));

  // Card Bounce Animation on step change
  if (card) {
    card.style.animation = 'none';
    card.offsetHeight; // trigger reflow
    card.style.animation = 'springPop 0.5s var(--spring) forwards';
  }

  const step = tutorialSteps[currentTutorialStep];

  // Typing Effect
  if (textEl) {
    if (tutorialTypingTimer) clearInterval(tutorialTypingTimer);
    textEl.textContent = '';
    textEl.classList.add('typing');
    let i = 0;
    tutorialTypingTimer = setInterval(() => {
      if (i < step.text.length) {
        textEl.textContent += step.text.charAt(i);
        i++;
      } else {
        clearInterval(tutorialTypingTimer);
        textEl.classList.remove('typing');
      }
    }, 25);
  }

  // Add new highlight and punch hole
  if (step.target) {
    const target = document.querySelector(step.target);
    if (target) {
      target.classList.add('tutorial-highlight');
      const rect = target.getBoundingClientRect();
      const overlay = document.getElementById('tutorial-overlay');
      if (overlay) {
        overlay.style.setProperty('--hole-top', `${rect.top}px`);
        overlay.style.setProperty('--hole-left', `${rect.left}px`);
        overlay.style.setProperty('--hole-right', `${rect.right}px`);
        overlay.style.setProperty('--hole-bottom', `${rect.bottom}px`);
      }
    }
  } else {
    // Reset hole if no target
    const overlay = document.getElementById('tutorial-overlay');
    if (overlay) {
      overlay.style.setProperty('--hole-top', '0');
      overlay.style.setProperty('--hole-left', '0');
      overlay.style.setProperty('--hole-right', '0');
      overlay.style.setProperty('--hole-bottom', '0');
    }
  }

  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === currentTutorialStep);
  });

  const nextBtn = document.querySelector('.btn-tutorial.next');
  if (nextBtn) nextBtn.textContent = currentTutorialStep === tutorialSteps.length - 1 ? "Get Started! 🚀" : "Next Step";
}

function nextTutorialStep() {
  if (currentTutorialStep < tutorialSteps.length - 1) {
    currentTutorialStep++;
    updateTutorialStep();
  } else {
    skipTutorial();
  }
}

function skipTutorial() {
  const overlay = document.getElementById('tutorial-overlay');
  if (overlay) {
    overlay.classList.add('hidden');
    overlay.style.setProperty('--hole-top', '0');
    overlay.style.setProperty('--hole-left', '0');
    overlay.style.setProperty('--hole-right', '0');
    overlay.style.setProperty('--hole-bottom', '0');
  }
  document.querySelectorAll('.tutorial-highlight').forEach(el => el.classList.remove('tutorial-highlight'));
  localStorage.setItem('prowiddan_tutorial_seen', 'true');
}

// Check for first visit
window.addEventListener('load', () => {
  setTimeout(() => {
    if (!localStorage.getItem('prowiddan_tutorial_seen')) {
      startTutorial();
    }
  }, 4500); // Start after boot sequence
});

/* ====================== YOUTUBE APP: RECREATED ====================== */
const YT_VIDEOS = [
  { id: 'FcMfck3F9gA', title: "DIE YOU FILTH | by adichapri16", author: "adichapri16", views: "38 views", date: "9 days ago", duration: "0:08", thumb: "https://i.ytimg.com/an_webp/FcMfck3F9gA/mqdefault_6s.webp?du=3000&sqp=CMC438wG&rs=AOn4CLByrdX0zJWxHWXiXTbDCZU8Z-mUZQ" },
  { id: 'B4ZEGk3p8ks', title: "Kim Jong Adi | by adichapri16", author: "adichapri16", views: "43 views", date: "10 days ago", duration: "0:34", thumb: "https://i.ytimg.com/an_webp/B4ZEGk3p8ks/mqdefault_6s.webp?du=3000&sqp=CIXF38wG&rs=AOn4CLChE3k8dL6G5se4jATplw6DbEzvrA" },
  { id: 'A_Rg9PJM0Js', title: "Hyperbaiter Disstrack | by adichapri16", author: "adichapri16", views: "32 views", date: "10 days ago", duration: "0:37", thumb: "https://i.ytimg.com/vi/A_Rg9PJM0Js/hqdefault.jpg?sqp=-oaymwEnCNACELwBSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLDpFUFYVC7YhRF8Lr5Rm9YRT6gPcQ" }
];

function initYouTube() {
  const grid = document.getElementById('yt-video-grid');
  if (!grid) return;
  renderYouTubeGrid(YT_VIDEOS);

  const searchInput = document.querySelector('.yt-search-input');
  searchInput?.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
    const filtered = YT_VIDEOS.filter(v => v.title.toLowerCase().includes(q));
    renderYouTubeGrid(filtered);
  });
}

function renderYouTubeGrid(videos) {
  const grid = document.getElementById('yt-video-grid');
  if (!grid) return;
  grid.innerHTML = videos.map(v => `
    <div class="yt-video-card" onclick="window.open('https://www.youtube.com/@Adichapri16', '_blank')">
      <div class="yt-thumbnail-wrapper">
        <img src="${v.thumb}" class="yt-thumbnail" alt="">
        <span class="yt-duration">${v.duration}</span>
      </div>
      <div class="yt-video-info">
        <div class="yt-video-meta">
          <h4>${v.title}</h4>
          <p>${v.author}</p>
          <p>${v.views} • ${v.date}</p>
        </div>
      </div>
    </div>
  `).join('');
}

function playYouTubeVideo(id) {
  const overlay = document.getElementById('yt-player-overlay');
  if (!overlay) return;
  overlay.innerHTML = `
    <div class="yt-player-header">
      <button class="yt-back-btn" onclick="closeYouTubePlayer()">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
      </button>
      <span style="font-weight:600">Back home</span>
    </div>
    <iframe class="yt-video-frame" src="https://www.youtube.com/embed/${id}?autoplay=1" allowfullscreen allow="autoplay"></iframe>
  `;
  overlay.classList.remove('hidden');
}

function closeYouTubePlayer() {
  const overlay = document.getElementById('yt-player-overlay');
  if (overlay) {
    overlay.classList.add('hidden');
    overlay.innerHTML = '';
  }
}

