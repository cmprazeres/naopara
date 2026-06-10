/* NÃO PARA — shared interactions */
(function () {
  "use strict";

  /* mobile drawer */
  var burger = document.querySelector(".burger");
  var drawer = document.querySelector(".drawer");
  if (burger && drawer) {
    var dBurger = drawer.querySelector(".burger");
    function toggle(open) {
      drawer.classList.toggle("is-open", open);
      burger.classList.toggle("is-open", open);
      if (dBurger) dBurger.classList.toggle("is-open", open);
      document.body.style.overflow = open ? "hidden" : "";
    }
    burger.addEventListener("click", function () { toggle(!drawer.classList.contains("is-open")); });
    if (dBurger) dBurger.addEventListener("click", function () { toggle(false); });
    drawer.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { toggle(false); });
    });
  }

  /* scroll reveal */
  var rv = document.querySelectorAll(".rv");
  if ("IntersectionObserver" in window && rv.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    rv.forEach(function (el) { io.observe(el); });
  } else {
    rv.forEach(function (el) { el.classList.add("in"); });
  }

  /* filter tabs (data-filter-group / data-filter / data-cat) */
  document.querySelectorAll("[data-filter-group]").forEach(function (group) {
    var tabs = group.querySelectorAll("[data-filter]");
    var targetSel = group.getAttribute("data-target");
    var items = document.querySelectorAll(targetSel + " [data-cat]");
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        tabs.forEach(function (t) { t.classList.remove("is-on"); });
        tab.classList.add("is-on");
        var f = tab.getAttribute("data-filter");
        items.forEach(function (it) {
          var show = f === "all" || it.getAttribute("data-cat").split(" ").indexOf(f) > -1;
          it.style.display = show ? "" : "none";
        });
      });
    });
  });

  /* accordion */
  document.querySelectorAll(".acc__item").forEach(function (item) {
    var q = item.querySelector(".acc__q");
    var a = item.querySelector(".acc__a");
    if (!q || !a) return;
    q.addEventListener("click", function () {
      var open = item.classList.contains("is-open");
      item.classList.toggle("is-open", !open);
      a.style.maxHeight = open ? "0px" : a.scrollHeight + "px";
    });
  });

  /* newsletter fake submit */
  document.querySelectorAll(".form").forEach(function (form) {
    if (form.id === "plan-form") return; /* handled by its own validated PDF handler */
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      form.classList.add("is-sent");
    });
  });
})();
