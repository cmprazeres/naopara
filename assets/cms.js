/* =============================================================
   NÃO PARA — CMS Runtime Engine  v2.0
   Reads NP_CMS from localStorage and applies every override to
   the live page: theme, SEO, analytics, ads, content, images.
   Load in <head> before </head>.
   ============================================================= */
(function () {
  "use strict";
  var cfg = null;
  try { cfg = JSON.parse(localStorage.getItem("NP_CMS") || "null"); } catch (e) {}
  if (!cfg) return;
  var LANG = window.NP_LANG || "pt";
  var PAGE = (location.pathname.split("/").pop() || "index.html").toLowerCase();

  function q(s, r) { return (r || document).querySelector(s); }
  function qa(s, r) { return [].slice.call((r || document).querySelectorAll(s)); }

  /* ---------- THEME (CSS variables) — inject ASAP ---------- */
  if (cfg.theme) {
    var t = cfg.theme, rules = ":root{";
    if (t.volt)    rules += "--volt:" + t.volt + ";--volt-deep:" + t.volt + ";";
    if (t.voltInk) rules += "--volt-ink:" + t.voltInk + ";";
    if (t.ink)     rules += "--ink:" + t.ink + ";";
    if (t.paper)   rules += "--paper:" + t.paper + ";";
    if (t.display) rules += "--display:'" + t.display + "',sans-serif;";
    if (t.body)    rules += "--body:'" + t.body + "',sans-serif;";
    if (t.radius)  rules += "--radius:" + t.radius + ";";
    rules += "}";
    if (t.radius) rules += ".btn,.tag,.inp,.card,.plan,.media,.ph,.img-preview{border-radius:" + t.radius + " !important}";
    var st = document.createElement("style"); st.id = "cms-theme"; st.textContent = rules;
    (document.head || document.documentElement).appendChild(st);
    /* extra Google font load if custom */
    [t.display, t.body].forEach(function (f) {
      if (f && ["Archivo", "Manrope", "Spline Sans Mono"].indexOf(f) === -1) {
        var l = document.createElement("link"); l.rel = "stylesheet";
        l.href = "https://fonts.googleapis.com/css2?family=" + f.replace(/ /g, "+") + ":wght@400;500;600;700;800;900&display=swap";
        document.head.appendChild(l);
      }
    });
  }

  /* ---------- ANALYTICS ---------- */
  var an = cfg.analytics || {};
  function addInline(code, id) { if (id && document.getElementById(id)) return; var s = document.createElement("script"); s.text = code; if (id) s.id = id; document.head.appendChild(s); }
  function addSrc(src, id) { if (id && document.getElementById(id)) return; var s = document.createElement("script"); s.src = src; s.async = true; if (id) s.id = id; document.head.appendChild(s); }
  if (an.gtm) addInline("(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','" + an.gtm + "');", "cms-gtm");
  if (an.ga4) { addSrc("https://www.googletagmanager.com/gtag/js?id=" + an.ga4, "cms-ga4-src"); addInline("window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','" + an.ga4 + "');", "cms-ga4-cfg"); }
  if (an.fbPixel) addInline("!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','" + an.fbPixel + "');fbq('track','PageView');", "cms-fb");
  if (an.linkedIn) addInline("_linkedin_partner_id='" + an.linkedIn + "';window._linkedin_data_partner_ids=window._linkedin_data_partner_ids||[];window._linkedin_data_partner_ids.push('" + an.linkedIn + "');", "cms-li");
  if (an.customHead) { var d = document.createElement("div"); d.innerHTML = an.customHead; [].forEach.call(d.childNodes, function (n) { document.head.appendChild(n.cloneNode(true)); }); }

  /* ---------- SEO (per page) — apply ASAP ---------- */
  if (cfg.seo && cfg.seo[PAGE]) {
    var s = cfg.seo[PAGE];
    if (s.title) { document.title = s.title; setMeta("property", "og:title", s.title); }
    if (s.desc) { setMeta("name", "description", s.desc); setMeta("property", "og:description", s.desc); }
    if (s.ogImage) setMeta("property", "og:image", s.ogImage);
  }
  function setMeta(attr, key, val) {
    var m = q('meta[' + attr + '="' + key + '"]');
    if (!m) { m = document.createElement("meta"); m.setAttribute(attr, key); document.head.appendChild(m); }
    m.setAttribute("content", val);
  }

  /* ---------- DOM overrides ---------- */
  function apply() {
    /* content (selector → {value, html, lang?}) */
    var c = cfg.content || {};
    Object.keys(c).forEach(function (sel) {
      var v = c[sel]; if (!v) return;
      if (v.lang && v.lang !== LANG) return;
      var el; try { el = q(sel); } catch (e) { return; }
      if (!el) return;
      if (v.attr) el.setAttribute(v.attr, v.value);
      else if (v.html) el.innerHTML = v.value;
      else el.textContent = (v.value != null ? v.value : v);
    });

    /* images — global replace by filename suffix */
    var ir = cfg.imageReplace || {};
    Object.keys(ir).forEach(function (file) {
      if (!ir[file]) return;
      qa("img").forEach(function (img) {
        var src = img.getAttribute("src") || "";
        if (src.indexOf(file) > -1) img.src = ir[file];
      });
    });

    /* nav labels + cta */
    var nav = cfg.nav || {};
    if (nav.items && nav.items.length) {
      qa(".nav a").forEach(function (a, i) { if (nav.items[i]) a.textContent = LANG === "en" ? (nav.items[i].en || nav.items[i].pt) : nav.items[i].pt; });
      qa(".drawer__links a").forEach(function (a, i) {
        if (!nav.items[i]) return; var ix = a.querySelector(".ix");
        a.textContent = LANG === "en" ? (nav.items[i].en || nav.items[i].pt) : nav.items[i].pt;
        if (ix) a.insertBefore(ix, a.firstChild);
      });
    }
    if (nav.cta && (nav.cta.pt || nav.cta.en)) {
      var label = LANG === "en" ? (nav.cta.en || nav.cta.pt) : nav.cta.pt;
      qa(".hdr__cta .btn--volt, .drawer__foot .btn--volt").forEach(function (b) { if (b.childNodes[0]) b.childNodes[0].textContent = label; });
    }

    /* logo */
    if (cfg.logo) {
      if (cfg.logo.img) qa(".brand").forEach(function (b) { b.innerHTML = '<img src="' + cfg.logo.img + '" alt="logo" style="height:32px;object-fit:contain">'; });
      else if (cfg.logo.text) qa(".brand b").forEach(function (b) { b.textContent = cfg.logo.text; });
    }

    /* ads */
    (cfg.ads || []).forEach(function (ad) {
      if (ad.enabled === false || !ad.code) return;
      var pages = ad.pages && ad.pages !== "*" ? ad.pages.split(",").map(function (p) { return p.trim(); }) : null;
      if (pages && pages.indexOf(PAGE) === -1 && pages.indexOf("*") === -1) return;
      var el; try { el = q(ad.selector); } catch (e) { return; }
      if (!el) return;
      var w = document.createElement("div"); w.className = "cms-ad-slot"; w.style.cssText = "width:100%;text-align:center;overflow:hidden"; w.innerHTML = ad.code;
      if (ad.position === "before") el.parentNode.insertBefore(w, el);
      else if (ad.position === "prepend") el.insertBefore(w, el.firstChild);
      else if (ad.position === "append") el.appendChild(w);
      else el.parentNode.insertBefore(w, el.nextSibling);
      qa("script", w).forEach(function (sc) { var ns = document.createElement("script"); ns.text = sc.text; sc.parentNode.replaceChild(ns, sc); });
    });

    /* GTM noscript + custom body */
    if (an.gtm && document.body) { var ns = document.createElement("noscript"); ns.innerHTML = '<iframe src="https://www.googletagmanager.com/ns.html?id=' + an.gtm + '" height="0" width="0" style="display:none;visibility:hidden"></iframe>'; document.body.insertBefore(ns, document.body.firstChild); }
    if (an.customBody && document.body) { var bs = document.createElement("script"); bs.text = an.customBody; document.body.appendChild(bs); }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", apply);
  else apply();
})();
