/* Shared by single and batch lookup. */
window.WhoisLookup = (() => {
  const endpoint = 'https://api.mrwang.com/whois.php';
  const object = value => value && typeof value === 'object' && !Array.isArray(value);
  const text = {
    en: {timeout:'The lookup timed out.', network:'Could not connect to the lookup API.', invalid:'The API returned an unexpected response.', rateLimited:'The lookup service is temporarily rate limited.', cancelled:'Cancelled', render:'The response arrived, but the page could not display it.', http:'The lookup API returned HTTP'},
    zh: {timeout:'查询超时，请重试。', network:'无法连接查询接口，请检查网络或接口跨域配置后重试。', invalid:'查询接口返回了无法识别的数据，请稍后重试。', rateLimited:'查询接口暂时限流，请稍后重试。', cancelled:'已取消', render:'已收到查询结果，但页面显示失败。', http:'查询接口返回 HTTP'},
    'zh-Hant': {timeout:'查詢逾時，請重試。', network:'無法連線至查詢介面，請檢查網路後重試。', invalid:'查詢介面傳回無法辨識的資料。', rateLimited:'查詢介面暫時限制流量，請稍後重試。', cancelled:'已取消', render:'已收到查詢結果，但頁面顯示失敗。', http:'查詢介面傳回 HTTP'}
  };

  function error(kind, status) {
    return Object.assign(new Error(kind), {kind, status});
  }

  function payload(json) {
    if (!object(json)) throw error('invalid');
    if (Number(json.code) === 429) throw error('rateLimited', 429);
    const data = (json.code === 0 || json.code === '0') ? json.data : json.code === undefined ? json : null;
    if (!object(data) || !['domain','registered','reserved','unknown','rateLimited','whoisData','rdapData'].some(key => Object.hasOwn(data,key))) {
      throw error('invalid');
    }
    return data;
  }

  function state(d) {
    if (d.reserved === true) return 'reserved';
    if (d.rateLimited === true) return 'rateLimited';
    if (d.registered === true) return 'registered';
    const raw=typeof d.whoisData==='string'?d.whoisData:'';
    const rdap=object(d.rdapData)?d.rdapData:null;
    if (d.registered === false && d.unknown !== true) return 'available';
    if (/^(?:no match(?: for.*)?|not found|no registration record|domain not found|no data found|查无注册记录|查無註冊記錄|未找到注册记录)[.!。]?$/im.test(raw.trim()) || /^no match for [^\r\n]+/im.test(raw) || Number(rdap?.errorCode)===404) return 'available';
    if (d.unknown === true) return 'unknown';
    return 'unknown';
  }

  function message(err, lang) {
    const copy = text[lang] || text.en;
    return err.kind === 'http' ? copy.http + ' ' + err.status + '.' : copy[err.kind] || copy.invalid;
  }

  async function query(domain, signal) {
    const controller = new AbortController();
    const cancel = () => controller.abort();
    signal?.addEventListener('abort', cancel, {once:true});
    if (signal?.aborted) cancel();
    const timer = setTimeout(cancel, 20000);
    try {
      const url = new URL(endpoint);
      url.search = new URLSearchParams({domain, json:'1'});
      const response = await fetch(url, {headers:{Accept:'application/json'}, signal:controller.signal, cache:'no-store'});
      if (response.status === 429) throw error('rateLimited',429);
      if (!response.ok) throw error('http',response.status);
      const body = await response.text();
      let json;
      try { json = JSON.parse(body.replace(/^\uFEFF/, '')); }
      catch { throw error('invalid'); }
      return payload(json);
    } catch (err) {
      if (controller.signal.aborted) throw error(signal?.aborted ? 'cancelled' : 'timeout');
      throw err.kind ? err : error('network');
    } finally {
      clearTimeout(timer);
      signal?.removeEventListener('abort',cancel);
    }
  }
  return {query, state, message, payload};
})();
