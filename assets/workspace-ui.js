(() => {
  const desk = document.querySelector('.lookup-desk');
  const language = document.getElementById('langSelect');
  if (desk) {
    let selected = 'history';
    const buttons = [...desk.querySelectorAll('[data-desk]')];
    const list = desk.querySelector('#deskDomains');
    const batch = desk.querySelector('.desk-batch');
    function fitHistory() {
      const overflow = selected === 'history' && list.children.length > 24;
      if (overflow) {
        const last = list.children[23];
        list.style.maxHeight = (last.offsetTop + last.offsetHeight) + 'px';
      } else {
        list.style.removeProperty('max-height');
      }
    }
    function showDomains() {
      const saved = selected === 'saved';
      const domains = saved ? getFavorites().slice(0, 6) : readHistory();
      for (const button of buttons) {
        button.textContent = button.dataset.desk === 'history' ? htxt('history') : xt(6);
        button.setAttribute('aria-pressed', String(button.dataset.desk === selected));
      }
      batch.textContent = document.querySelector('#batchNav [data-nav-label]').textContent + ' ↗';
      list.classList.toggle('desk-history', !saved);
      list.replaceChildren();
      if (!domains.length) {
        const note = document.createElement('p');
        note.textContent = saved ? xt(7) : htxt('empty');
        list.append(note);
      }
      for (const domain of domains) {
        const link = document.createElement('a');
        link.href = searchUrl(domain);
        link.textContent = domain;
        link.dir = 'ltr';
        list.append(link);
      }
      fitHistory();
    }
    for (const button of buttons) button.addEventListener('click', () => {
      selected = button.dataset.desk;
      list.scrollTop = 0;
      showDomains();
    });
    for (const event of ['storage','whois:librarychange','pageshow']) window.addEventListener(event,showDomains);
    language.addEventListener('change', () => queueMicrotask(showDomains));
    showDomains();
    if ('ResizeObserver' in window) new ResizeObserver(fitHistory).observe(desk);
    window.addEventListener('resize', fitHistory);
    document.fonts?.ready.then(fitHistory);
  }
})();
