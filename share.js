/* Live sharing for Sideline Subs: encryption, signatures and the relay client. Used by the coach app and watch.html.
 *
 * Who can do what (nothing here relies on the relay server being trusted):
 *   - The coach's phone owns an ECDSA private key. Every state message is signed with it.
 *   - The watch link carries the matching PUBLIC key and a read key (AES-GCM). Watchers can read and verify, but can not sign.
 *   - The scorer link also carries a scorer key. Score suggestions are authenticated with it (HMAC) and the coach approves each one.
 *   - Messages are encrypted before they leave the phone, so the relay only ever sees unreadable text.
 */
const Share = (() => {
  const enc = new TextEncoder(), dec = new TextDecoder();
  const DEFAULT_RELAY = 'https://ntfy.sh';
  const b64 = {
    enc(buf) { const a = new Uint8Array(buf); let s = ''; for (let i = 0; i < a.length; i++) s += String.fromCharCode(a[i]); return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); },
    dec(str) { const s = atob(str.replace(/-/g, '+').replace(/_/g, '/')); const a = new Uint8Array(s.length); for (let i = 0; i < s.length; i++) a[i] = s.charCodeAt(i); return a; },
  };
  const rnd = n => crypto.getRandomValues(new Uint8Array(n));
  const subtle = () => crypto.subtle;

  async function stream(bytes, Ctor, fmt) {
    const cs = new Ctor(fmt), w = cs.writable.getWriter();
    w.write(bytes); w.close();
    return new Uint8Array(await new Response(cs.readable).arrayBuffer());
  }
  const canZip = () => typeof CompressionStream === 'function' && typeof DecompressionStream === 'function';

  const keyCache = new Map();
  async function aesKey(kv) {
    if (!keyCache.has(kv)) keyCache.set(kv, await subtle().importKey('raw', b64.dec(kv), 'AES-GCM', false, ['encrypt', 'decrypt']));
    return keyCache.get(kv);
  }
  async function macKey(ks) {
    const k = 'm' + ks;
    if (!keyCache.has(k)) keyCache.set(k, await subtle().importKey('raw', b64.dec(ks), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']));
    return keyCache.get(k);
  }
  async function pubKey(pub) {
    const k = 'p' + pub;
    if (!keyCache.has(k)) keyCache.set(k, await subtle().importKey('raw', b64.dec(pub), { name: 'ECDSA', namedCurve: 'P-256' }, false, ['verify']));
    return keyCache.get(k);
  }
  async function privKey(jwk) {
    return subtle().importKey('jwk', jwk, { name: 'ECDSA', namedCurve: 'P-256' }, false, ['sign']);
  }

  /** A fresh session: random id, read key, scorer key, and the coach's signing key pair. */
  async function newSession() {
    const pair = await subtle().generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, true, ['sign', 'verify']);
    return {
      id: b64.enc(rnd(16)), kv: b64.enc(rnd(32)), ks: b64.enc(rnd(32)),
      priv: await subtle().exportKey('jwk', pair.privateKey),
      pub: b64.enc(await subtle().exportKey('raw', pair.publicKey)),
    };
  }
  const topics = id => ({ state: 'sl-' + id + '-s', inbox: 'sl-' + id + '-i' });

  /* ---- coach -> watchers: encrypted and signed snapshot ---- */
  async function sealState(sess, obj) {
    let data = enc.encode(JSON.stringify(obj)), z = '-';
    if (canZip()) { try { data = await stream(data, CompressionStream, 'deflate-raw'); z = 'z'; } catch (e) { data = enc.encode(JSON.stringify(obj)); } }
    const iv = rnd(12), ct = await subtle().encrypt({ name: 'AES-GCM', iv }, await aesKey(sess.kv), data);
    const body = ['ss1' + z, b64.enc(iv), b64.enc(ct)].join('.');
    const sig = await subtle().sign({ name: 'ECDSA', hash: 'SHA-256' }, await privKey(sess.priv), enc.encode(body));
    return body + '.' + b64.enc(sig);
  }
  /** Returns the snapshot, or null when the message is not from this coach, is damaged, or is not for this link. */
  async function openState(link, text) {
    try {
      const p = String(text).trim().split('.');
      if (p.length !== 4 || !/^ss1[z-]$/.test(p[0])) return null;
      const body = p.slice(0, 3).join('.');
      const good = await subtle().verify({ name: 'ECDSA', hash: 'SHA-256' }, await pubKey(link.pub), b64.dec(p[3]), enc.encode(body));
      if (!good) return null;
      let data = new Uint8Array(await subtle().decrypt({ name: 'AES-GCM', iv: b64.dec(p[1]) }, await aesKey(link.kv), b64.dec(p[2])));
      if (p[0][3] === 'z') data = await stream(data, DecompressionStream, 'deflate-raw');
      return JSON.parse(dec.decode(data));
    } catch (e) { return null; }
  }

  /* ---- scorer -> coach: encrypted note authenticated with the scorer key ---- */
  async function sealNote(link, obj) {
    const iv = rnd(12), ct = await subtle().encrypt({ name: 'AES-GCM', iv }, await aesKey(link.kv), enc.encode(JSON.stringify(obj)));
    const body = ['sc1', b64.enc(iv), b64.enc(ct)].join('.');
    return body + '.' + b64.enc(await subtle().sign('HMAC', await macKey(link.ks), enc.encode(body)));
  }
  async function openNote(sess, text) {
    try {
      const p = String(text).trim().split('.');
      if (p.length !== 4 || p[0] !== 'sc1') return null;
      const body = p.slice(0, 3).join('.');
      if (!(await subtle().verify('HMAC', await macKey(sess.ks), b64.dec(p[3]), enc.encode(body)))) return null;
      return JSON.parse(dec.decode(await subtle().decrypt({ name: 'AES-GCM', iv: b64.dec(p[1]) }, await aesKey(sess.kv), b64.dec(p[2]))));
    } catch (e) { return null; }
  }

  /* ---- links: everything secret stays in the #fragment, which browsers never send to a server ---- */
  function makeLink(base, sess, relay, scorer) {
    const parts = scorer ? [sess.id, sess.kv, sess.pub, sess.ks] : [sess.id, sess.kv, sess.pub];
    return base + 'watch.html#' + (scorer ? 's=' : 'w=') + parts.join('.') + (relay && relay !== DEFAULT_RELAY ? '&r=' + encodeURIComponent(relay) : '');
  }
  function parseLink(hash) {
    const m = /^#?([ws])=([\w-]+(?:\.[\w-]+){2,3})(?:&r=(.+))?$/.exec(hash || '');
    if (!m) return null;
    const p = m[2].split('.');
    if (m[1] === 'w' && p.length !== 3) return null;
    if (m[1] === 's' && p.length !== 4) return null;
    return { scorer: m[1] === 's', id: p[0], kv: p[1], pub: p[2], ks: p[3] || '', relay: m[3] ? decodeURIComponent(m[3]) : DEFAULT_RELAY };
  }

  /* ---- relay client (ntfy-compatible: POST a message, read it back by polling or Server-Sent Events) ---- */
  const Relay = {
    async publish(base, topic, text) {
      const r = await fetch(base + '/' + topic, { method: 'POST', body: text });
      if (!r.ok) { const e = new Error('Relay answered ' + r.status); e.status = r.status; e.retryAfter = +r.headers.get('retry-after') || 0; throw e; }
    },
    /** Latest cached message(s) for a topic, newest last. */
    async recent(base, topic, since) {
      const r = await fetch(base + '/' + topic + '/json?poll=1&since=' + encodeURIComponent(since || 'all'));
      if (!r.ok) { const e = new Error('Relay answered ' + r.status); e.status = r.status; throw e; }
      return (await r.text()).split('\n').map(l => { try { return JSON.parse(l); } catch (e) { return null; } }).filter(m => m && m.event === 'message');
    },
    /** Live feed. Calls onMessage(text, id) for each message and onStatus('live' | 'offline'). */
    subscribe(base, topic, since, onMessage, onStatus) {
      let es = null, closed = false, timer = null;
      const open = () => {
        if (closed) return;
        es = new EventSource(base + '/' + topic + '/sse' + (since ? '?since=' + encodeURIComponent(since) : ''));
        es.onopen = () => onStatus && onStatus('live');
        es.onerror = () => {
          onStatus && onStatus('offline');
          if (es) es.close();
          if (!closed) timer = setTimeout(open, 5000);
        };
        es.onmessage = ev => {
          try { const m = JSON.parse(ev.data); if (m.event === 'message') { since = m.id; onMessage(m.message, m.id); } } catch (e) {}
        };
      };
      open();
      return { close() { closed = true; clearTimeout(timer); if (es) es.close(); } };
    },
  };

  return { b64, newSession, topics, sealState, openState, sealNote, openNote, makeLink, parseLink, Relay, DEFAULT_RELAY };
})();
