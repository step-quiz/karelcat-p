(function () {
  // Mode embed (iframes del curs): no mostrem el footer per no saturar l'UI.
  try {
    if (new URLSearchParams(window.location.search).get('embed') === '1') return;
  } catch (e) { /* ignore */ }

  // Detecta si estem dins de la carpeta curs/ o a l'arrel
  var isCurs = window.location.pathname.indexOf('/curs/') !== -1;
  var root = isCurs ? '../' : '';

  // Estils del footer. NO és fix: va al final de la pàgina (o a la darrera
  // fila del simulador), així mai tapa el contingut ni el registre d'errors.
  var style = document.createElement('style');
  style.textContent = [
    '.karel-footer {',
    '  flex-shrink: 0;',
    '  display: flex;',
    '  align-items: center;',
    '  justify-content: center;',
    '  gap: 6px;',
    '  padding: 4px 12px;',
    '  border-top: 1px solid var(--border, #ddd);',
    '  font-family: system-ui, sans-serif;',
    '  font-size: 0.78rem;',
    '  color: var(--muted, #555);',
    '  text-align: center;',
    '  flex-wrap: wrap;',
    '  line-height: 1.4;',
    '  background: var(--bg, #fff);',
    '}',
    '.karel-footer a { color: inherit; }'
  ].join('\n');
  document.head.appendChild(style);

  // HTML del footer — modifica aquí per canviar el text.
  // Llicència: vegeu LICENSE i LLICENCIA.md (contingut CC BY-NC-SA 4.0, codi MIT).
  var footer = document.createElement('footer');
  footer.className = 'karel-footer';
  footer.innerHTML =
    '<span>© 2026 <strong>David Arso Civil</strong> · INS Miquel Tarradell.</span>' +
    '<span>Contingut: <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.ca" target="_blank" rel="noopener">CC BY-NC-SA 4.0</a>' +
    ' · Codi: <a href="' + root + 'LICENSE" target="_blank" rel="noopener">llicència MIT</a></span>';

  document.body.appendChild(footer);
})();
