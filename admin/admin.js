/* =============================================================
   NÃO PARA — CMS Admin  v2.0  (live visual editor)
   ============================================================= */
"use strict";
var STOR_CMS = "NP_CMS", STOR_AUTH = "NP_ADMIN", DEF_PASS = "naopara2026";

/* ---------- data ---------- */
function blank() { return { version: 2, theme: {}, seo: {}, analytics: { ga4: "", gtm: "", fbPixel: "", linkedIn: "", customHead: "", customBody: "" }, ads: [], content: {}, imageReplace: {}, nav: { items: [], cta: { pt: "", en: "" } }, logo: { text: "", img: "" } }; }
function load() { try { return Object.assign(blank(), JSON.parse(localStorage.getItem(STOR_CMS) || "{}")); } catch (e) { return blank(); } }
function persist() { localStorage.setItem(STOR_CMS, JSON.stringify(cfg)); }
function loadAuth() { try { return JSON.parse(localStorage.getItem(STOR_AUTH) || "null"); } catch (e) { return null; } }
function saveAuth(o) { localStorage.setItem(STOR_AUTH, JSON.stringify(o)); }
function hashPass(p) { var h = 0; for (var i = 0; i < p.length; i++) h = (Math.imul(31, h) + p.charCodeAt(i)) | 0; return h.toString(36); }
function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
function el(id) { return document.getElementById(id); }

var cfg = load();
var ST = { page: "index.html", lang: "pt", section: "visual", edit: false };
var PAGES = [
  { f: "index.html", label: "Início" }, { f: "planos.html", label: "Planos" },
  { f: "blog.html", label: "Dicas" }, { f: "nutricao.html", label: "Nutrição" },
  { f: "sobre.html", label: "Sobre" }, { f: "plano.html?p=5k-iniciante", label: "Detalhe plano" },
  { f: "artigo.html?a=tenis-certo", label: "Detalhe artigo" }
];
var FONTS = ["Archivo", "Manrope", "Spline Sans Mono", "Anton", "Oswald", "Bebas Neue", "Space Grotesk", "Sora", "Syne", "Inter", "Archivo Black", "Barlow Condensed", "Teko"];

/* ---------- preview ---------- */
function previewURL() { return (ST.lang === "en" ? "../en/" : "../") + ST.page; }
function reloadPreview() { var f = el("preview"); if (f) f.src = previewURL(); }
function commit(reload) { persist(); flashSaved(); if (reload) reloadPreview(); }
function flashSaved() {
  var s = el("save-state"); if (!s) return;
  s.textContent = "A guardar…"; s.className = "save-state saving";
  clearTimeout(s._t); s._t = setTimeout(function () { s.textContent = "✓ Guardado"; s.className = "save-state ok"; }, 250);
}
function toast(m, err) { var t = el("toast"); t.textContent = m; t.className = "toast show" + (err ? " err" : ""); clearTimeout(t._t); t._t = setTimeout(function () { t.className = "toast"; }, 3000); }

/* ====================================================
   SECTIONS
   ==================================================== */
var SECTIONS = {
  visual:    { icon: "🎯", label: "Editor visual", render: secVisual },
  content:   { icon: "📝", label: "Textos",        render: secContent },
  theme:     { icon: "🎨", label: "Tema & cores",  render: secTheme },
  images:    { icon: "🖼️", label: "Imagens",       render: secImages },
  seo:       { icon: "🔍", label: "SEO",           render: secSEO },
  nav:       { icon: "🔗", label: "Menu & logo",   render: secNav },
  analytics: { icon: "📈", label: "Analytics",     render: secAnalytics },
  ads:       { icon: "📢", label: "Publicidade",   render: secAds },
  system:    { icon: "⚙️", label: "Sistema",       render: secSystem }
};

/* ---- Visual ---- */
function secVisual() {
  var n = Object.keys(cfg.content).length;
  return panelHead("Editor visual", "Clica em qualquer texto do site à direita para o editar. Clica numa imagem para a trocar.") +
    '<div class="big-toggle ' + (ST.edit ? "on" : "") + '" id="edit-toggle">' +
      '<div class="big-toggle__dot"></div>' +
      '<div><div class="big-toggle__t">' + (ST.edit ? "Modo de edição ATIVO" : "Ativar modo de edição") + '</div>' +
      '<div class="big-toggle__s">' + (ST.edit ? "Passa o rato sobre o site e clica para editar" : "Liga para editar diretamente no site") + '</div></div>' +
    '</div>' +
    '<div class="tip-list">' +
      tip("✏️", "Editar texto", "Clica num título, parágrafo ou botão e escreve. Enter ou clica fora para guardar, Esc para cancelar.") +
      tip("🖼️", "Trocar imagem", "Clica numa fotografia para definir um novo URL ou carregar um ficheiro.") +
      tip("💾", "Guarda sozinho", "Todas as alterações são guardadas automaticamente e aplicadas ao site em direto.") +
    '</div>' +
    (n ? '<div class="muted-row">' + n + ' campo(s) personalizado(s) · <button class="linkbtn" id="goto-content">ver lista</button></div>' : '');
}
function tip(ic, t, s) { return '<div class="tip"><span class="tip__ic">' + ic + '</span><div><b>' + t + '</b><p>' + s + '</p></div></div>'; }

/* ---- Content list ---- */
function secContent() {
  var keys = Object.keys(cfg.content);
  var h = panelHead("Textos personalizados", "Todos os textos que editaste. Repõe qualquer um para voltar ao original.");
  if (!keys.length) return h + '<div class="empty">Ainda não editaste nenhum texto.<br>Usa o <button class="linkbtn" id="goto-visual">Editor visual</button> e clica no site.</div>';
  h += '<div class="clist">';
  keys.forEach(function (k, i) {
    var v = cfg.content[k];
    var val = v && v.value != null ? v.value : v;
    var isImg = v && v.attr === "src";
    h += '<div class="citem"><div class="citem__sel">' + esc(shortSel(k)) + (isImg ? ' <span class="pill">imagem</span>' : '') + '</div>' +
      '<div class="citem__val">' + (isImg ? '<img src="' + esc(val) + '" style="height:34px">' : esc(stripTags(val).slice(0, 90))) + '</div>' +
      '<button class="btn-sm btn-danger" data-rm-content="' + esc(k) + '">Repor</button></div>';
  });
  return h + '</div>';
}
function shortSel(s) { return s.replace(/:nth-of-type/g, ":nth").replace(/ > /g, " ▸ ").slice(0, 60); }
function stripTags(s) { return String(s || "").replace(/<[^>]+>/g, ""); }

/* ---- Theme ---- */
function secTheme() {
  var t = cfg.theme || {};
  var swatches = ["#c9f73f", "#ff5c38", "#2a6fdb", "#ff3ea5", "#f5d020", "#19c37d", "#a06bff"];
  var h = panelHead("Tema & cores", "Personaliza a identidade visual. As alterações aplicam-se em direto.");
  h += '<div class="fld"><label>Cor de destaque (volt)</label><div class="swatches">';
  swatches.forEach(function (c) { h += '<button class="sw' + ((t.volt || "#c9f73f") === c ? " on" : "") + '" style="background:' + c + '" data-volt="' + c + '"></button>'; });
  h += '<input type="color" id="volt-custom" value="' + esc(t.volt || "#c9f73f") + '" class="sw-custom"></div></div>';
  h += colorFld("Fundo escuro (ink)", "ink", t.ink || "#0c0e0b");
  h += colorFld("Fundo claro (paper)", "paper", t.paper || "#f4f3ec");
  h += '<div class="fld"><label>Tipografia — títulos</label><select class="inp" id="font-display">' + FONTS.map(function (f) { return '<option' + ((t.display || "Archivo") === f ? " selected" : "") + '>' + f + '</option>'; }).join("") + '</select></div>';
  h += '<div class="fld"><label>Tipografia — corpo</label><select class="inp" id="font-body">' + FONTS.map(function (f) { return '<option' + ((t.body || "Manrope") === f ? " selected" : "") + '>' + f + '</option>'; }).join("") + '</select></div>';
  h += '<div class="fld"><label>Cantos arredondados — ' + (t.radius || "0px") + '</label><input type="range" min="0" max="28" step="2" value="' + parseInt(t.radius || 0) + '" id="radius" class="range"></div>';
  h += '<button class="btn-ghost" id="theme-reset">↺ Repor tema original</button>';
  return h;
}
function colorFld(label, key, val) { return '<div class="fld"><label>' + label + '</label><div class="color-row"><input type="color" id="col-' + key + '" value="' + esc(val) + '"><input type="text" class="inp" id="colt-' + key + '" value="' + esc(val) + '"></div></div>'; }

/* ---- Images ---- */
function secImages() {
  var imgs = [
    { file: "hero.png", label: "Hero / fundo principal" },
    { file: "track.png", label: "Treino / pista" },
    { file: "nutrition.png", label: "Nutrição" },
    { file: "shoes.png", label: "Ténis / equipamento" }
  ];
  var h = panelHead("Imagens globais", "Substitui uma fotografia em todo o site de uma só vez. Cola um URL ou carrega um ficheiro.");
  imgs.forEach(function (im) {
    var cur = (cfg.imageReplace || {})[im.file];
    var src = cur || ("../assets/img/" + im.file);
    h += '<div class="imgrow"><div class="imgrow__pv"><img src="' + esc(src) + '"></div>' +
      '<div class="imgrow__ct"><label>' + im.label + ' <span class="pill">' + im.file + '</span></label>' +
      '<input class="inp" type="text" id="iu-' + im.file + '" placeholder="https://…" value="' + esc(cur || "") + '">' +
      '<div class="imgrow__btns"><label class="btn-sm filebtn">Carregar<input type="file" accept="image/*" id="if-' + im.file + '" hidden></label>' +
      '<button class="btn-sm" data-img-save="' + im.file + '">Guardar</button>' +
      (cur ? '<button class="btn-sm btn-danger" data-img-rm="' + im.file + '">Repor</button>' : '') + '</div></div></div>';
  });
  return h;
}

/* ---- SEO ---- */
function secSEO() {
  var pg = ST.page.split("?")[0];
  var s = (cfg.seo || {})[pg] || {};
  return panelHead("SEO — " + pg, "Define o título e descrição para motores de busca e redes sociais. Por página.") +
    pageSwitchNote() +
    '<div class="fld"><label>Título da página &lt;title&gt;</label><input class="inp" id="seo-title" type="text" value="' + esc(s.title || "") + '" placeholder="Ex: Planos de Treino | Não Para"></div>' +
    '<div class="fld"><label>Meta descrição</label><textarea class="inp" id="seo-desc" rows="3" placeholder="120–160 caracteres…">' + esc(s.desc || "") + '</textarea><div class="charcount" id="seo-cc"></div></div>' +
    '<div class="fld"><label>Imagem de partilha social (og:image)</label><input class="inp" id="seo-og" type="text" value="' + esc(s.ogImage || "") + '" placeholder="https://…"></div>' +
    '<button class="btn-primary" id="seo-save">Guardar SEO desta página</button>';
}
function pageSwitchNote() { return '<div class="muted-row">A editar: <b>' + esc(ST.page) + '</b> — muda a página no topo do preview.</div>'; }

/* ---- Nav ---- */
function secNav() {
  var items = cfg.nav.items && cfg.nav.items.length ? cfg.nav.items : [
    { pt: "Início", en: "Home", href: "index.html" }, { pt: "Planos", en: "Plans", href: "planos.html" },
    { pt: "Dicas", en: "Tips", href: "blog.html" }, { pt: "Nutrição", en: "Nutrition", href: "nutricao.html" },
    { pt: "Sobre", en: "About", href: "sobre.html" }
  ];
  var cta = cfg.nav.cta || { pt: "Começar agora", en: "Start now" }, logo = cfg.logo || {};
  var h = panelHead("Menu & logótipo", "Edita os itens de navegação, o botão de ação e o logótipo.");
  h += '<div class="subh">Itens do menu</div>';
  items.forEach(function (it, i) {
    h += '<div class="navrow"><span class="ix">' + (i + 1) + '</span>' +
      '<input class="inp" id="np-' + i + '" placeholder="PT" value="' + esc(it.pt) + '">' +
      '<input class="inp" id="ne-' + i + '" placeholder="EN" value="' + esc(it.en || "") + '">' +
      '<input class="inp" id="nh-' + i + '" placeholder="href" value="' + esc(it.href || "") + '"></div>';
  });
  h += '<div class="subh">Botão CTA</div><div class="two"><input class="inp" id="cta-pt" placeholder="PT" value="' + esc(cta.pt) + '"><input class="inp" id="cta-en" placeholder="EN" value="' + esc(cta.en) + '"></div>';
  h += '<div class="subh">Logótipo</div><div class="fld"><label>Texto da marca (parte a verde)</label><input class="inp" id="logo-text" value="' + esc(logo.text || "") + '" placeholder="PARA"></div>';
  h += '<div class="fld"><label>Ou imagem do logo (URL)</label><input class="inp" id="logo-img" value="' + esc(logo.img || "") + '" placeholder="https://…"></div>';
  h += '<button class="btn-primary" id="nav-save">Guardar menu</button>';
  return h;
}

/* ---- Analytics ---- */
function secAnalytics() {
  var a = cfg.analytics || {};
  return panelHead("Analytics & tags", "Injetadas automaticamente em todas as páginas (PT + EN).") +
    grp("Google Analytics 4", fld("Measurement ID", "an-ga4", a.ga4, "G-XXXXXXXXXX")) +
    grp("Google Tag Manager", fld("Container ID", "an-gtm", a.gtm, "GTM-XXXXXX")) +
    grp("Meta Pixel", fld("Pixel ID", "an-fb", a.fbPixel, "1234567890")) +
    grp("LinkedIn Insight", fld("Partner ID", "an-li", a.linkedIn, "123456")) +
    grp("Código &lt;head&gt;", '<textarea class="inp code" id="an-head" rows="5" placeholder="&lt;script&gt;…">' + esc(a.customHead) + '</textarea>') +
    grp("Código &lt;body&gt;", '<textarea class="inp code" id="an-body" rows="5" placeholder="&lt;script&gt;…">' + esc(a.customBody) + '</textarea>') +
    '<button class="btn-primary" id="an-save">Guardar analytics</button>';
}
function grp(t, inner) { return '<div class="grp"><div class="grp__t">' + t + '</div>' + inner + '</div>'; }
function fld(label, id, val, ph) { return '<div class="fld"><label>' + label + '</label><input class="inp" id="' + id + '" value="' + esc(val) + '" placeholder="' + esc(ph || "") + '"></div>'; }

/* ---- Ads ---- */
function secAds() {
  var ads = cfg.ads || [];
  var h = panelHead("Publicidade", "Injeta anúncios (Google AdSense, programático) em qualquer ponto do site.") +
    '<button class="btn-primary" id="ad-new">+ Novo bloco</button>';
  if (!ads.length) h += '<div class="empty">Sem anúncios. Cria o primeiro acima e escolhe a posição visualmente.</div>';
  ads.forEach(function (ad, i) {
    h += '<div class="adcard"><div class="adcard__h"><b>' + esc(ad.name || "Anúncio " + (i + 1)) + '</b>' +
      '<span class="badge ' + (ad.enabled !== false ? "on" : "off") + '">' + (ad.enabled !== false ? "Ativo" : "Inativo") + '</span></div>' +
      '<div class="adcard__m">' + esc(pageLabel(ad.pages)) + ' · <code>' + esc(shortSel(ad.selector || "")) + '</code> · ' + esc(posLabel(ad.position)) + '</div>' +
      '<div class="adcard__a"><button class="btn-sm" data-ad-ed="' + i + '">Editar</button>' +
      '<button class="btn-sm" data-ad-tg="' + i + '">' + (ad.enabled !== false ? "Desativar" : "Ativar") + '</button>' +
      '<button class="btn-sm btn-danger" data-ad-rm="' + i + '">Remover</button></div></div>';
  });
  return h;
}
function pageLabel(p) { if (!p || p === "*") return "Todas"; var f = PAGES.filter(function (x) { return x.f.split("?")[0] === p; })[0]; return f ? f.label : p; }
function posLabel(p) { return { after: "depois", before: "antes", append: "dentro/fim", prepend: "dentro/início" }[p] || p; }

/* ---- System ---- */
function secSystem() {
  return panelHead("Sistema", "Backup, importação e segurança.") +
    grp("Backup", '<p class="muted">Exporta toda a configuração para um ficheiro JSON.</p><button class="btn-primary" id="sys-exp">⬇ Exportar JSON</button>' +
      '<div class="fld" style="margin-top:14px"><label>Importar (substitui tudo)</label><textarea class="inp code" id="sys-imp-d" rows="4" placeholder="Cola o JSON…"></textarea><button class="btn-sm" id="sys-imp" style="margin-top:8px">⬆ Importar</button></div>') +
    grp("Alterar senha", fld("Senha atual", "pw-old", "", "") + fld("Nova senha", "pw-new", "", "") + fld("Confirmar", "pw-new2", "", "") + '<button class="btn-primary" id="pw-save">Alterar senha</button>') +
    '<div class="grp danger"><div class="grp__t" style="color:#ff6b6b">Zona de perigo</div><p class="muted">Apaga toda a configuração e repõe o site original.</p><button class="btn-sm btn-danger" id="sys-reset">🗑 Repor tudo</button></div>';
}

function panelHead(t, s) { return '<div class="phead"><h2>' + t + '</h2><p>' + s + '</p></div>'; }

/* ====================================================
   RENDER + BIND
   ==================================================== */
function renderSection() {
  el("panel").innerHTML = SECTIONS[ST.section].render();
  document.querySelectorAll(".navbtn").forEach(function (b) { b.classList.toggle("on", b.getAttribute("data-sec") === ST.section); });
  bindSection();
}

function bindSection() {
  var S = ST.section;
  // cross links
  hook("goto-content", function () { go("content"); });
  hook("goto-visual", function () { go("visual"); });

  if (S === "visual") {
    hook("edit-toggle", function () { ST.edit = !ST.edit; if (window.NPVisual) NPVisual.setEdit(ST.edit); setEditBadge(); renderSection(); });
  }
  if (S === "content") {
    document.querySelectorAll("[data-rm-content]").forEach(function (b) {
      b.addEventListener("click", function () { delete cfg.content[b.getAttribute("data-rm-content")]; commit(true); renderSection(); });
    });
  }
  if (S === "theme") bindTheme();
  if (S === "images") bindImages();
  if (S === "seo") bindSEO();
  if (S === "nav") bindNav();
  if (S === "analytics") hook("an-save", function () {
    cfg.analytics = { ga4: v("an-ga4"), gtm: v("an-gtm"), fbPixel: v("an-fb"), linkedIn: v("an-li"), customHead: v("an-head"), customBody: v("an-body") };
    commit(true); toast("✓ Analytics guardado");
  });
  if (S === "ads") bindAds();
  if (S === "system") bindSystem();
}
function hook(id, fn) { var e = el(id); if (e) e.addEventListener("click", fn); }
function v(id) { var e = el(id); return e ? e.value.trim() : ""; }
function go(sec) { ST.section = sec; renderSection(); }
function setEditBadge() { var b = el("pb-edit"); if (b) b.style.display = ST.edit ? "block" : "none"; }

function bindTheme() {
  function setVolt(c) { cfg.theme.volt = c; if (window.NPVisual) { NPVisual.applyVar("--volt", c); NPVisual.applyVar("--volt-deep", c); } commit(); renderSection(); }
  document.querySelectorAll("[data-volt]").forEach(function (b) { b.addEventListener("click", function () { setVolt(b.getAttribute("data-volt")); }); });
  hook("volt-custom", null); var vc = el("volt-custom"); if (vc) vc.addEventListener("input", function () { setVolt(vc.value); });
  ["ink", "paper"].forEach(function (k) {
    var c = el("col-" + k), t = el("colt-" + k);
    function set(val) { cfg.theme[k] = val; if (c) c.value = val; if (t) t.value = val; if (window.NPVisual) NPVisual.applyVar("--" + k, val); commit(); }
    if (c) c.addEventListener("input", function () { set(c.value); });
    if (t) t.addEventListener("change", function () { set(t.value); });
  });
  var fd = el("font-display"); if (fd) fd.addEventListener("change", function () { cfg.theme.display = fd.value; commit(true); });
  var fb = el("font-body"); if (fb) fb.addEventListener("change", function () { cfg.theme.body = fb.value; commit(true); });
  var r = el("radius"); if (r) r.addEventListener("input", function () { cfg.theme.radius = r.value + "px"; commit(); var lab = r.closest(".fld").querySelector("label"); if (lab) lab.textContent = "Cantos arredondados — " + r.value + "px"; });
  if (r) r.addEventListener("change", function () { commit(true); });
  hook("theme-reset", function () { cfg.theme = {}; commit(true); renderSection(); toast("✓ Tema reposto"); });
}

function bindImages() {
  document.querySelectorAll("[data-img-save]").forEach(function (b) {
    b.addEventListener("click", function () {
      var file = b.getAttribute("data-img-save"), urlInp = el("iu-" + file), fileInp = el("if-" + file);
      if (fileInp && fileInp.files && fileInp.files[0]) return compress(fileInp.files[0], function (data) { cfg.imageReplace[file] = data; commit(true); renderSection(); });
      if (urlInp && urlInp.value.trim()) { cfg.imageReplace[file] = urlInp.value.trim(); commit(true); renderSection(); }
    });
  });
  document.querySelectorAll("[data-img-rm]").forEach(function (b) {
    b.addEventListener("click", function () { delete cfg.imageReplace[b.getAttribute("data-img-rm")]; commit(true); renderSection(); });
  });
}
function compress(file, cb) {
  var r = new FileReader();
  r.onload = function (e) {
    var img = new Image();
    img.onload = function () {
      var sc = Math.min(1, 1600 / img.width), cv = document.createElement("canvas");
      cv.width = img.width * sc; cv.height = img.height * sc;
      cv.getContext("2d").drawImage(img, 0, 0, cv.width, cv.height);
      try { cb(cv.toDataURL("image/jpeg", 0.82)); } catch (err) { toast("⚠️ Imagem muito grande, usa URL", true); }
    };
    img.src = e.target.result;
  };
  r.readAsDataURL(file);
}

function bindSEO() {
  var cc = el("seo-cc"), d = el("seo-desc");
  function upd() { if (cc && d) cc.textContent = d.value.length + " caracteres" + (d.value.length > 160 ? " (longo)" : ""); }
  if (d) { d.addEventListener("input", upd); upd(); }
  hook("seo-save", function () {
    var pg = ST.page.split("?")[0];
    cfg.seo[pg] = { title: v("seo-title"), desc: v("seo-desc"), ogImage: v("seo-og") };
    commit(true); toast("✓ SEO guardado para " + pg);
  });
}

function bindNav() {
  hook("nav-save", function () {
    var items = [];
    for (var i = 0; i < 5; i++) { if (!el("np-" + i)) break; items.push({ pt: v("np-" + i), en: v("ne-" + i), href: v("nh-" + i) }); }
    cfg.nav = { items: items, cta: { pt: v("cta-pt"), en: v("cta-en") } };
    cfg.logo = { text: v("logo-text"), img: v("logo-img") };
    commit(true); toast("✓ Menu guardado");
  });
}

function bindAds() {
  hook("ad-new", function () { adModal(null); });
  document.querySelectorAll("[data-ad-ed]").forEach(function (b) { b.addEventListener("click", function () { adModal(+b.getAttribute("data-ad-ed")); }); });
  document.querySelectorAll("[data-ad-tg]").forEach(function (b) { b.addEventListener("click", function () { var i = +b.getAttribute("data-ad-tg"); cfg.ads[i].enabled = cfg.ads[i].enabled === false; commit(true); renderSection(); }); });
  document.querySelectorAll("[data-ad-rm]").forEach(function (b) { b.addEventListener("click", function () { if (confirm("Remover anúncio?")) { cfg.ads.splice(+b.getAttribute("data-ad-rm"), 1); commit(true); renderSection(); } }); });
}
function adModal(idx) {
  var ad = idx != null ? cfg.ads[idx] : { name: "", pages: "*", selector: ".cta", position: "before", code: "", enabled: true };
  var pageOpts = '<option value="*"' + (ad.pages === "*" ? " selected" : "") + '>Todas as páginas</option>' + PAGES.map(function (p) { var f = p.f.split("?")[0]; return '<option value="' + f + '"' + (ad.pages === f ? " selected" : "") + '>' + p.label + '</option>'; }).join("");
  var posOpts = [["before", "Antes do elemento"], ["after", "Depois do elemento"], ["prepend", "Dentro — no início"], ["append", "Dentro — no fim"]].map(function (o) { return '<option value="' + o[0] + '"' + (ad.position === o[0] ? " selected" : "") + '>' + o[1] + '</option>'; }).join("");
  el("modal-content").innerHTML = '<h3>' + (idx != null ? "Editar" : "Novo") + ' anúncio</h3>' +
    '<div class="fld"><label>Nome</label><input class="inp" id="m-name" value="' + esc(ad.name) + '"></div>' +
    '<div class="fld"><label>Página</label><select class="inp" id="m-pages">' + pageOpts + '</select></div>' +
    '<div class="fld"><label>Elemento-âncora (seletor CSS)</label><div class="pick-row"><input class="inp" id="m-sel" value="' + esc(ad.selector) + '"><button class="btn-sm" id="m-pick">🎯 Escolher no site</button></div></div>' +
    '<div class="fld"><label>Posição</label><select class="inp" id="m-pos">' + posOpts + '</select></div>' +
    '<div class="fld"><label>Código do anúncio</label><textarea class="inp code" id="m-code" rows="7" placeholder="&lt;ins class=adsbygoogle…&gt;">' + esc(ad.code) + '</textarea></div>' +
    '<div class="modal-btns"><button class="btn-primary" id="m-save">Guardar</button><button class="btn-sm" id="m-cancel">Cancelar</button></div>';
  el("modal").style.display = "flex";
  hook("m-pick", function () {
    el("modal").style.display = "none"; toast("Clica no elemento do site onde queres o anúncio");
    if (window.NPVisual) NPVisual.pickElement(function (sel, desc) { el("modal").style.display = "flex"; el("m-sel").value = sel; toast("✓ Posição: " + desc); });
  });
  hook("m-cancel", function () { el("modal").style.display = "none"; });
  hook("m-save", function () {
    var o = { name: v("m-name"), pages: el("m-pages").value, selector: v("m-sel"), position: el("m-pos").value, code: el("m-code").value, enabled: ad.enabled !== false };
    if (idx != null) cfg.ads[idx] = o; else cfg.ads.push(o);
    el("modal").style.display = "none"; commit(true); renderSection(); toast("✓ Anúncio guardado");
  });
}

function bindSystem() {
  hook("sys-exp", function () { var b = new Blob([JSON.stringify(cfg, null, 2)], { type: "application/json" }); var a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = "naopara-cms.json"; a.click(); });
  hook("sys-imp", function () { try { var d = JSON.parse(el("sys-imp-d").value); localStorage.setItem(STOR_CMS, JSON.stringify(d)); cfg = load(); commit(true); renderSection(); toast("✓ Importado"); } catch (e) { toast("⚠️ JSON inválido", true); } });
  hook("pw-save", function () {
    var auth = loadAuth() || { hash: hashPass(DEF_PASS) };
    if (hashPass(v("pw-old")) !== auth.hash) return toast("⚠️ Senha atual incorreta", true);
    if (v("pw-new") !== v("pw-new2")) return toast("⚠️ As senhas não coincidem", true);
    if (v("pw-new").length < 6) return toast("⚠️ Mínimo 6 caracteres", true);
    saveAuth({ hash: hashPass(v("pw-new")) }); toast("✓ Senha alterada");
  });
  hook("sys-reset", function () { if (confirm("Apagar toda a configuração?")) { localStorage.removeItem(STOR_CMS); cfg = load(); commit(true); renderSection(); toast("✓ Reposto"); } });
}

/* ====================================================
   PREVIEW + VISUAL WIRING
   ==================================================== */
function buildTopbar() {
  var psel = el("page-sel"); psel.innerHTML = PAGES.map(function (p) { return '<option value="' + p.f + '"' + (ST.page === p.f ? " selected" : "") + '>' + p.label + '</option>'; }).join("");
  psel.addEventListener("change", function () { ST.page = psel.value; reloadPreview(); if (ST.section === "seo") renderSection(); });
  document.querySelectorAll("[data-lang]").forEach(function (b) {
    b.addEventListener("click", function () { ST.lang = b.getAttribute("data-lang"); document.querySelectorAll("[data-lang]").forEach(function (x) { x.classList.toggle("on", x === b); }); reloadPreview(); });
  });
}
function wireVisual() {
  if (!window.NPVisual) return;
  var f = el("preview"); NPVisual.attach(f);
  f.addEventListener("load", function () {
    NPVisual.onFrameLoad(); NPVisual.setEdit(ST.edit);
  });
  NPVisual.onChange(function (sel, val) { cfg.content[sel] = val; commit(); if (ST.section === "content") renderSection(); });
  NPVisual.onImage(function (sel, src) { imageDialog(sel, src); });
}
function imageDialog(sel, src) {
  el("modal-content").innerHTML = '<h3>Trocar imagem</h3>' +
    '<div class="imgrow__pv" style="width:100%;height:160px;margin-bottom:14px"><img src="' + esc(src) + '" id="imgdlg-pv"></div>' +
    '<div class="fld"><label>Novo URL da imagem</label><input class="inp" id="imgdlg-url" placeholder="https://…"></div>' +
    '<div class="fld"><label>Ou carrega um ficheiro</label><input type="file" accept="image/*" id="imgdlg-file"></div>' +
    '<div class="modal-btns"><button class="btn-primary" id="imgdlg-save">Aplicar</button><button class="btn-sm" id="imgdlg-cancel">Cancelar</button></div>';
  el("modal").style.display = "flex";
  hook("imgdlg-cancel", function () { el("modal").style.display = "none"; });
  hook("imgdlg-save", function () {
    var fileInp = el("imgdlg-file"), url = v("imgdlg-url");
    function apply(data) { cfg.content[sel] = { value: data, attr: "src" }; if (window.NPVisual) NPVisual.applyLive(sel, { value: data, attr: "src" }); commit(); el("modal").style.display = "none"; toast("✓ Imagem trocada"); }
    if (fileInp && fileInp.files && fileInp.files[0]) compress(fileInp.files[0], apply);
    else if (url) apply(url);
  });
}

/* ====================================================
   AUTH + INIT
   ==================================================== */
function init() {
  if (!loadAuth()) saveAuth({ hash: hashPass(DEF_PASS) });
  if (sessionStorage.getItem("NP_SESSION") === "1") showApp();
  else {
    el("login-screen").style.display = "flex"; el("app").style.display = "none";
    el("login-form").addEventListener("submit", function (e) {
      e.preventDefault();
      var auth = loadAuth();
      if (hashPass(el("login-pw").value) === auth.hash) { sessionStorage.setItem("NP_SESSION", "1"); showApp(); }
      else { el("login-err").textContent = "Senha incorreta."; el("login-pw").value = ""; }
    });
  }
}
function showApp() {
  el("login-screen").style.display = "none"; el("app").style.display = "grid";
  var nav = el("sidenav"); nav.innerHTML = "";
  Object.keys(SECTIONS).forEach(function (id) {
    var s = SECTIONS[id], b = document.createElement("button");
    b.className = "navbtn"; b.setAttribute("data-sec", id);
    b.innerHTML = '<span class="navbtn__i">' + s.icon + '</span><span>' + s.label + '</span>';
    b.addEventListener("click", function () { go(id); });
    nav.appendChild(b);
  });
  hook("logout", function () { sessionStorage.removeItem("NP_SESSION"); location.reload(); });
  el("modal").addEventListener("click", function (e) { if (e.target === el("modal")) el("modal").style.display = "none"; });
  buildTopbar(); wireVisual(); reloadPreview(); renderSection();
}
window.addEventListener("DOMContentLoaded", init);
