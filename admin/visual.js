/* =============================================================
   NÃO PARA — CMS Visual Editor  v1.0
   Live click-to-edit over a same-origin preview iframe.
   Exposes window.NPVisual used by admin.js.
   ============================================================= */
(function () {
  "use strict";

  var FRAME, DOC, WIN, EDIT = false, onChange = null, onImage = null, onPick = null, PICKMODE = false, pickCb = null;

  /* ---- stable CSS selector for any element ---- */
  function cssPath(el) {
    if (!el || el.nodeType !== 1) return null;
    if (el.id) return "#" + CSS.escape(el.id);
    var parts = [];
    while (el && el.nodeType === 1 && el.tagName.toLowerCase() !== "html") {
      var sel = el.tagName.toLowerCase();
      var p = el.parentNode;
      if (!p) break;
      var sib = [].filter.call(p.children, function (c) { return c.tagName === el.tagName; });
      if (sib.length > 1) sel += ":nth-of-type(" + (sib.indexOf(el) + 1) + ")";
      parts.unshift(sel);
      if (el.tagName.toLowerCase() === "body") break;
      el = p;
    }
    return parts.join(" > ");
  }

  /* an element is directly-text-editable if it holds real text and few element children */
  function isTextEditable(el) {
    if (!el || el.nodeType !== 1) return false;
    var tag = el.tagName.toLowerCase();
    if (["img", "svg", "path", "input", "textarea", "select", "script", "style", "br", "hr"].indexOf(tag) > -1) return false;
    if (el.closest && el.closest(".cms-ad-slot")) return false;
    var txt = "";
    [].forEach.call(el.childNodes, function (n) { if (n.nodeType === 3) txt += n.textContent; });
    return txt.trim().length > 0;
  }
  function bestTextTarget(el) {
    var node = el;
    while (node && node !== DOC.body) {
      if (isTextEditable(node)) return node;
      node = node.parentNode;
    }
    return isTextEditable(el) ? el : null;
  }

  /* ---- styling injected into the iframe for edit affordances ---- */
  var EDIT_CSS = "" +
    ".npx-hl{outline:2px dashed var(--volt,#c9f73f)!important;outline-offset:2px;cursor:text!important}" +
    ".npx-hl-img{outline:3px solid var(--volt,#c9f73f)!important;outline-offset:-3px;cursor:pointer!important;position:relative}" +
    ".npx-editing{outline:2px solid var(--volt,#c9f73f)!important;outline-offset:2px;background:rgba(201,247,63,.06)!important}" +
    ".npx-pick{outline:2px dashed #2a6fdb!important;outline-offset:2px;cursor:crosshair!important}" +
    "[contenteditable]{caret-color:var(--volt,#c9f73f)}" ;

  function ensureStyle() {
    if (!DOC) return;
    if (DOC.getElementById("npx-style")) return;
    var s = DOC.createElement("style"); s.id = "npx-style"; s.textContent = EDIT_CSS; DOC.head.appendChild(s);
  }

  /* ---- event handlers (capture phase, only active in edit mode) ---- */
  function onOver(e) {
    if (!EDIT && !PICKMODE) return;
    clearHL();
    if (PICKMODE) { var t = e.target.closest("section,header,footer,div,article,.wrap"); if (t) t.classList.add("npx-pick"); return; }
    if (e.target.tagName === "IMG") { e.target.classList.add("npx-hl-img"); return; }
    var tgt = bestTextTarget(e.target);
    if (tgt) tgt.classList.add("npx-hl");
  }
  function clearHL() {
    if (!DOC) return;
    qa(".npx-hl, .npx-hl-img, .npx-pick").forEach(function (n) { n.classList.remove("npx-hl", "npx-hl-img", "npx-pick"); });
  }
  function onClick(e) {
    if (!EDIT && !PICKMODE) return;
    e.preventDefault(); e.stopPropagation();
    if (PICKMODE) {
      var box = e.target.closest("section,header,footer,div,article,.wrap") || e.target;
      PICKMODE = false; clearHL();
      if (pickCb) pickCb(cssPath(box), describe(box));
      return;
    }
    if (e.target.tagName === "IMG") { if (onImage) onImage(cssPath(e.target), e.target.src, e.target); return; }
    var tgt = bestTextTarget(e.target);
    if (!tgt) return;
    startEdit(tgt);
  }

  function startEdit(el) {
    clearHL();
    var hadHTML = /<[a-z][\s\S]*>/i.test(el.innerHTML.trim()) && el.children.length > 0;
    el.classList.add("npx-editing");
    el.setAttribute("contenteditable", "true");
    el.focus();
    /* place caret at click */
    var sel = WIN.getSelection();
    var before = el.innerHTML;
    function finish() {
      el.removeAttribute("contenteditable");
      el.classList.remove("npx-editing");
      el.removeEventListener("blur", finish);
      el.removeEventListener("keydown", keyer);
      var after = el.innerHTML;
      if (after !== before && onChange) {
        onChange(cssPath(el), { value: hadHTML ? after : el.textContent, html: hadHTML });
      }
    }
    function keyer(ev) {
      if (ev.key === "Escape") { el.innerHTML = before; el.blur(); }
      if (ev.key === "Enter" && !ev.shiftKey && !hadHTML) { ev.preventDefault(); el.blur(); }
    }
    el.addEventListener("blur", finish);
    el.addEventListener("keydown", keyer);
  }

  function describe(el) {
    var t = el.tagName.toLowerCase();
    var cls = (el.className || "").toString().split(" ").filter(Boolean)[0];
    return t + (cls ? "." + cls : "");
  }

  function qa(s) { return DOC ? [].slice.call(DOC.querySelectorAll(s)) : []; }

  function bind() {
    if (!DOC) return;
    DOC.addEventListener("mouseover", onOver, true);
    DOC.addEventListener("mouseout", clearHL, true);
    DOC.addEventListener("click", onClick, true);
    /* block navigation while editing */
    DOC.addEventListener("submit", function (e) { if (EDIT) e.preventDefault(); }, true);
  }

  /* ====================== PUBLIC API ====================== */
  window.NPVisual = {
    attach: function (iframe) { FRAME = iframe; },
    onFrameLoad: function () {
      try { DOC = FRAME.contentDocument; WIN = FRAME.contentWindow; } catch (e) { DOC = null; }
      if (!DOC) return;
      ensureStyle(); bind();
      if (EDIT) DOC.body && DOC.body.setAttribute("data-npx-edit", "1");
    },
    setEdit: function (on) {
      EDIT = on; PICKMODE = false; clearHL();
      if (DOC && DOC.body) DOC.body.setAttribute("data-npx-edit", on ? "1" : "0");
    },
    isEdit: function () { return EDIT; },
    pickElement: function (cb) { PICKMODE = true; pickCb = cb; },
    cancelPick: function () { PICKMODE = false; clearHL(); },
    onChange: function (fn) { onChange = fn; },
    onImage: function (fn) { onImage = fn; },
    getDoc: function () { return DOC; },
    /* live-apply a value to the preview without reload */
    applyLive: function (sel, v) {
      if (!DOC) return; var el; try { el = DOC.querySelector(sel); } catch (e) { return; }
      if (!el) return;
      if (v.attr) el.setAttribute(v.attr, v.value);
      else if (v.html) el.innerHTML = v.value;
      else el.textContent = v.value;
    },
    applyVar: function (name, val) {
      if (!DOC) return; DOC.documentElement.style.setProperty(name, val);
    },
    cssPath: cssPath
  };
})();
