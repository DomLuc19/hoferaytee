const dataRaw = localStorage.getItem('builder_export');
const previewFrame = document.getElementById('previewFrame');
const codeOutput = document.getElementById('codeOutput');

if (!dataRaw) {
  codeOutput.textContent = 'Keine Daten gefunden. Bitte zuerst im Editor auf "Vorschau" klicken.';
} else {
  const data = JSON.parse(dataRaw);
  const currentPage = data.pages.find(p => p.id === data.currentPageId) || data.pages[0];

  if (!currentPage) {
    codeOutput.textContent = 'Keine Seite gefunden.';
  } else {
    // HTML in iframe schreiben
    const doc = previewFrame.contentDocument || previewFrame.contentWindow.document;
    doc.open();
    doc.write(currentPage.html);
    doc.close();

    // Code anzeigen
    codeOutput.textContent = currentPage.html;
  }
}