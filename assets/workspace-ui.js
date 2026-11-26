(() => {
  const desk = document.querySelector('.lookup-desk');
  const jump = document.getElementById('resultJump');
  const language = document.getElementById('langSelect');
  if (desk) {
    let selected = 'history';
    const buttons = [...desk.querySelectorAll('[data-desk]')];
    const list = desk.querySelector('#deskDomains');
    const batch = desk.querySelector('.desk-batch');
    function showDomains() {
      const saved = selected === 'saved';
      const domains = (saved ? getFavorites() : readHistory()).slice(0, 6);
      for (const button of buttons) {
        button.textContent = button.dataset.desk === 'history' ? htxt('history') : xt(6);
        button.setAttribute('aria-pressed', String(button.dataset.desk === selected));
      }
      batch.textContent = document.querySelector('#batchNav [data-nav-label]').textContent + ' ↗';
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
    }
    for (const button of buttons) button.addEventListener('click', () => {
      selected = button.dataset.desk;
      showDomains();
    });
    for (const event of ['storage','whois:librarychange','pageshow']) window.addEventListener(event,showDomains);
    language.addEventListener('change', () => queueMicrotask(showDomains));
    showDomains();
  }
  if (jump) {
    const groups = ['identityGroup','technicalGroup','whoisRaw','rdapRaw'].map(id => document.getElementById(id));
    function syncLinks() {
      jump.replaceChildren();
      for (const group of groups) {
        if (group.hidden) continue;
        const heading = group.querySelector('h2,summary');
        if (!heading) continue;
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = heading.textContent;
        button.onclick = () => {
          if (group.tagName === 'DETAILS') group.open = true;
          heading.tabIndex = -1;
          heading.focus({preventScroll:true});
          group.scrollIntoView({block:'start',behavior:'instant'});
        };
        jump.append(button);
      }
      jump.hidden = !jump.children.length;
    }
    const observer = new MutationObserver(syncLinks);
    for (const group of groups) observer.observe(group,{attributes:true,attributeFilter:['hidden']});
    language.addEventListener('change',syncLinks);
    syncLinks();
  }
})();
