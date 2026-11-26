window.WhoisSuffixes = (() => {
  const label = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/;
  const normalize = values => [...new Set(values.map(v => String(v).trim().toLowerCase().replace(/^\./,'')).filter(v => {
    const parts = v.split('.');
    return parts.at(-1).length >= 2 && /[a-z]/.test(parts.at(-1)) && parts.every(p => label.test(p));
  }))].sort();
  let catalog;
  async function read(name) {
    const response = await fetch(new URL('assets/'+name+'.json?v=70',document.baseURI).href, {cache:'force-cache'});
    if (!response.ok) throw new Error('Suffix catalog');
    const data = await response.json();
    const list = normalize(Array.isArray(data) ? data : data.suffixes || []);
    if (!list.length) throw new Error('Empty suffix catalog');
    return list;
  }
  function load() {
    return catalog ||= read('domain-suffixes').catch(() => read('tlds-fallback')).catch(() => {
      catalog = undefined;
      return [];
    });
  }
  function match(domain, catalog) {
    const parts = domain.split('.');
    const suffixes = new Set(catalog);
    for (let i=1;i<parts.length;i++) {
      const suffix = parts.slice(i).join('.');
      if (suffixes.has(suffix)) return suffix;
    }
    return parts.at(-1);
  }
  return {load,match};
})();
