// Einfaches State-Management
let pages = [];
let currentPageId = null;

const pageSelect = document.getElementById('pageSelect');
const addPageBtn = document.getElementById('addPageBtn');
const renamePageBtn = document.getElementById('renamePageBtn');
const canvas = document.getElementById('canvas');
const bgColorPicker = document.getElementById('bgColorPicker');
const bgImageInput = document.getElementById('bgImageInput');
const applyBgBtn = document.getElementById('applyBgBtn');
const fontFamilySelect = document.getElementById('fontFamilySelect');
const textColorPicker = document.getElementById('textColorPicker');
const applyTextStyleBtn = document.getElementById('applyTextStyleBtn');
const previewBtn = document.getElementById('previewBtn');
const addElementButtons = document.querySelectorAll('.add-element-btn');

let dragState = null;
let resizeState = null;

// Initiale Seite
function init() {
  createPage('Startseite');
  renderPageOptions();
  loadCurrentPage();
}

function createPage(name) {
  const id = 'page-' + Date.now() + '-' + Math.random().toString(16).slice(2);
  pages.push({
    id,
    name,
    backgroundColor: '#ffffff',
    backgroundImage: '',
    fontFamily: 'system-ui',
    textColor: '#000000',
    elements: []
  });
  currentPageId = id;
}

function getCurrentPage() {
  return pages.find(p => p.id === currentPageId);
}

function renderPageOptions() {
  pageSelect.innerHTML = '';
  pages.forEach(page => {
    const opt = document.createElement('option');
    opt.value = page.id;
    opt.textContent = page.name;
    if (page.id === currentPageId) opt.selected = true;
    pageSelect.appendChild(opt);
  });
}

function loadCurrentPage() {
  const page = getCurrentPage();
  if (!page) return;

  // Hintergrund
  applyCanvasBackground(page);

  // Schrift-Einstellungen
  fontFamilySelect.value = page.fontFamily;
  textColorPicker.value = page.textColor;

  // Canvas leeren
  canvas.innerHTML = '';

  // Elemente rendern
  page.elements.forEach(el => {
    const node = createCanvasElementNode(el);
    canvas.appendChild(node);
  });
}

function applyCanvasBackground(page) {
  canvas.style.backgroundColor = page.backgroundColor || '#ffffff';
  if (page.backgroundImage) {
    canvas.style.backgroundImage = `url("${page.backgroundImage}")`;
    canvas.style.backgroundSize = 'cover';
    canvas.style.backgroundPosition = 'center';
  } else {
    canvas.style.backgroundImage = '';
  }
}

// Seitenwechsel
pageSelect.addEventListener('change', () => {
  currentPageId = pageSelect.value;
  loadCurrentPage();
});

addPageBtn.addEventListener('click', () => {
  const name = prompt('Name der neuen Seite:');
  if (!name) return;
  createPage(name);
  renderPageOptions();
  loadCurrentPage();
});

renamePageBtn.addEventListener('click', () => {
  const page = getCurrentPage();
  if (!page) return;
  const name = prompt('Neuer Seitenname:', page.name);
  if (!name) return;
  page.name = name;
  renderPageOptions();
});

// Hintergrund anwenden
applyBgBtn.addEventListener('click', () => {
  const page = getCurrentPage();
  if (!page) return;
  page.backgroundColor = bgColorPicker.value;
  page.backgroundImage = bgImageInput.value.trim();
  applyCanvasBackground(page);
});

// Text-Styles auf Seite anwenden
applyTextStyleBtn.addEventListener('click', () => {
  const page = getCurrentPage();
  if (!page) return;
  page.fontFamily = fontFamilySelect.value;
  page.textColor = textColorPicker.value;

  // Auf alle Elemente anwenden
  page.elements.forEach(el => {
    el.fontFamily = page.fontFamily;
    el.color = page.textColor;
  });
  loadCurrentPage();
});

// Element hinzufügen
addElementButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const type = btn.dataset.type;
    addElement(type);
  });
});

function addElement(type) {
  const page = getCurrentPage();
  if (!page) return;

  let content = '';
  let src = '';

  if (type === 'img') {
    src = prompt('Bild-URL:');
    if (!src) return;
  } else {
    content = prompt('Textinhalt:') || '';
  }

  const el = {
    id: 'el-' + Date.now() + '-' + Math.random().toString(16).slice(2),
    type,
    content,
    src,
    x: 40,
    y: 40,
    width: 260,
    height: 80,
    fontFamily: page.fontFamily,
    color: page.textColor
  };

  page.elements.push(el);
  const node = createCanvasElementNode(el);
  canvas.appendChild(node);
}

function createCanvasElementNode(el) {
  const wrapper = document.createElement('div');
  wrapper.className = 'canvas-element';
  wrapper.dataset.id = el.id;
  wrapper.style.left = el.x + 'px';
  wrapper.style.top = el.y + 'px';
  wrapper.style.width = el.width + 'px';
  wrapper.style.height = el.height + 'px';
  wrapper.style.fontFamily = el.fontFamily;
  wrapper.style.color = el.color;

  let inner;
  if (el.type === 'h1') {
    inner = document.createElement('h1');
    inner.textContent = el.content;
  } else if (el.type === 'h2') {
    inner = document.createElement('h2');
    inner.textContent = el.content;
  } else if (el.type === 'h3') {
    inner = document.createElement('h3');
    inner.textContent = el.content;
  } else if (el.type === 'p') {
    inner = document.createElement('p');
    inner.textContent = el.content;
  } else if (el.type === 'img') {
    inner = document.createElement('img');
    inner.src = el.src;
    inner.alt = '';
  }

  wrapper.appendChild(inner);

  // Resize-Handle
  const handle = document.createElement('div');
  handle.className = 'resize-handle';
  wrapper.appendChild(handle);

  // Events
  wrapper.addEventListener('mousedown', onElementMouseDown);
  handle.addEventListener('mousedown', onResizeMouseDown);

  // Doppelklick zum Bearbeiten
  wrapper.addEventListener('dblclick', () => {
    editElement(el.id);
  });

  return wrapper;
}

function editElement(id) {
  const page = getCurrentPage();
  if (!page) return;
  const el = page.elements.find(e => e.id === id);
  if (!el) return;

  if (el.type === 'img') {
    const newSrc = prompt('Neue Bild-URL:', el.src);
    if (!newSrc) return;
    el.src = newSrc;
  } else {
    const newText = prompt('Neuer Text:', el.content);
    if (newText === null) return;
    el.content = newText;
  }
  loadCurrentPage();
}

// Drag & Drop
function onElementMouseDown(e) {
  if (e.target.classList.contains('resize-handle')) return;

  const target = e.currentTarget;
  const id = target.dataset.id;
  const page = getCurrentPage();
  if (!page) return;
  const el = page.elements.find(el => el.id === id);
  if (!el) return;

  // Auswahl
  document.querySelectorAll('.canvas-element').forEach(node => {
    node.classList.remove('selected');
  });
  target.classList.add('selected');

  const rect = target.getBoundingClientRect();
  const canvasRect = canvas.getBoundingClientRect();

  dragState = {
    id,
    offsetX: e.clientX - rect.left,
    offsetY: e.clientY - rect.top,
    canvasLeft: canvasRect.left,
    canvasTop: canvasRect.top
  };

  document.addEventListener('mousemove', onElementMouseMove);
  document.addEventListener('mouseup', onElementMouseUp);
}

function onElementMouseMove(e) {
  if (!dragState) return;
  const page = getCurrentPage();
  if (!page) return;
  const el = page.elements.find(el => el.id === dragState.id);
  if (!el) return;

  const x = e.clientX - dragState.canvasLeft - dragState.offsetX;
  const y = e.clientY - dragState.canvasTop - dragState.offsetY;

  el.x = Math.max(0, x);
  el.y = Math.max(0, y);

  const node = canvas.querySelector(`[data-id="${el.id}"]`);
  if (node) {
    node.style.left = el.x + 'px';
    node.style.top = el.y + 'px';
  }
}

function onElementMouseUp() {
  dragState = null;
  document.removeEventListener('mousemove', onElementMouseMove);
  document.removeEventListener('mouseup', onElementMouseUp);
}

// Resize
function onResizeMouseDown(e) {
  e.stopPropagation();
  const wrapper = e.currentTarget.parentElement;
  const id = wrapper.dataset.id;
  const page = getCurrentPage();
  if (!page) return;
  const el = page.elements.find(el => el.id === id);
  if (!el) return;

  const rect = wrapper.getBoundingClientRect();

  resizeState = {
    id,
    startWidth: rect.width,
    startHeight: rect.height,
    startX: e.clientX,
    startY: e.clientY
  };

  document.addEventListener('mousemove', onResizeMouseMove);
  document.addEventListener('mouseup', onResizeMouseUp);
}

function onResizeMouseMove(e) {
  if (!resizeState) return;
  const page = getCurrentPage();
  if (!page) return;
  const el = page.elements.find(el => el.id === resizeState.id);
  if (!el) return;

  const deltaX = e.clientX - resizeState.startX;
  const deltaY = e.clientY - resizeState.startY;

  el.width = Math.max(80, resizeState.startWidth + deltaX);
  el.height = Math.max(40, resizeState.startHeight + deltaY);

  const node = canvas.querySelector(`[data-id="${el.id}"]`);
  if (node) {
    node.style.width = el.width + 'px';
    node.style.height = el.height + 'px';
  }
}

function onResizeMouseUp() {
  resizeState = null;
  document.removeEventListener('mousemove', onResizeMouseMove);
  document.removeEventListener('mouseup', onResizeMouseUp);
}

// Vorschau öffnen
previewBtn.addEventListener('click', () => {
  const exportData = exportPagesToHTML();
  // Im localStorage ablegen (einfacher Transport)
  localStorage.setItem('builder_export', JSON.stringify(exportData));
  window.open('preview.html', '_blank');
});

// Export: responsive HTML generieren
function exportPagesToHTML() {
  const pagesExport = pages.map(page => {
    const html = generatePageHTML(page);
    return {
      id: page.id,
      name: page.name,
      html
    };
  });
  return { pages: pagesExport, currentPageId };
}

function generatePageHTML(page) {
  // Wir bauen eine responsive Struktur:
  // - Container mit relativer Position
  // - Elemente absolut, aber in Prozent, damit es auf kleineren Screens skaliert
  // Hier einfache Umsetzung: wir nutzen px, aber packen alles in einen scrollbaren Bereich.
  const bgStyle = `
    background-color: ${page.backgroundColor};
    ${page.backgroundImage ? `background-image: url('${page.backgroundImage}'); background-size: cover; background-position: center;` : ''}
  `;

  const elementsHTML = page.elements.map(el => {
    const style = `
      position:absolute;
      left:${el.x}px;
      top:${el.y}px;
      width:${el.width}px;
      height:${el.height}px;
      font-family:${el.fontFamily};
      color:${el.color};
      overflow:hidden;
    `;

    if (el.type === 'img') {
      return `<div style="${style}">
  <img src="${el.src}" alt="" style="max-width:100%;height:auto;display:block;">
</div>`;
    }

    const tag = el.type;
    const safeText = escapeHtml(el.content);
    return `<div style="${style}">
  <${tag} style="margin:0;">${safeText}</${tag}>
</div>`;
  }).join('\n');

  const html = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(page.name)}</title>
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: ${page.fontFamily};
      color: ${page.textColor};
    }
    .page-root {
      position: relative;
      width: 100%;
      min-height: 100vh;
      ${bgStyle}
      overflow: auto;
    }
    @media (max-width: 768px) {
      .page-root {
        padding: 1rem;
      }
    }
  </style>
</head>
<body>
  <div class="page-root">
${elementsHTML}
  </div>
</body>
</html>`;

  return html;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

init();
