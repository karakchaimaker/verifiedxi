// Small progressive enhancements; every page works without this file.
(function () {
  "use strict";

  // Dates and kick-off times in the visitor's own time zone (the HTML says UTC).
  var formats = {
    date: { weekday: "short", day: "numeric", month: "short" },
    time: { hour: "2-digit", minute: "2-digit" },
    datetime: { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }
  };
  document.querySelectorAll("time[data-local]").forEach(function (el) {
    var when = new Date(el.getAttribute("datetime"));
    var format = formats[el.getAttribute("data-local")];
    if (!format || isNaN(when.getTime())) return;
    el.title = when.toUTCString();
    el.textContent = new Intl.DateTimeFormat(undefined, format).format(when);
  });

  // Competition filter chips: show one competition's games or stories.
  document.querySelectorAll("[data-filters]").forEach(function (bar) {
    var target = document.querySelector(bar.getAttribute("data-filters"));
    if (!target) return;
    var buttons = bar.querySelectorAll("button[data-filter]");
    bar.hidden = false;

    function apply(choice) {
      buttons.forEach(function (b) {
        b.setAttribute("aria-pressed", String(b.getAttribute("data-filter") === choice));
      });
      target.querySelectorAll("[data-league]").forEach(function (item) {
        item.hidden = choice !== "all" && item.getAttribute("data-league") !== choice;
      });
      target.querySelectorAll("[data-group]").forEach(function (group) {
        group.hidden = !group.querySelector("[data-league]:not([hidden])");
      });
      var scopes = target.querySelectorAll("section");
      if (!scopes.length) scopes = [target];
      Array.prototype.forEach.call(scopes, function (scope) {
        var note = scope.querySelector(".filter-empty");
        var items = scope.querySelectorAll("[data-league]");
        var empty = items.length > 0 && !scope.querySelector("[data-league]:not([hidden])");
        if (empty && !note) {
          note = document.createElement("p");
          note.className = "empty filter-empty";
          note.textContent = "Nothing here for that competition right now.";
          scope.appendChild(note);
        }
        if (note) note.hidden = !empty;
      });
    }

    buttons.forEach(function (b) {
      b.addEventListener("click", function () { apply(b.getAttribute("data-filter")); });
    });
  });

  // Tabs: show one table at a time (without JavaScript they are all shown in turn).
  document.querySelectorAll("[data-tabs]").forEach(function (bar) {
    var target = document.querySelector(bar.getAttribute("data-tabs"));
    if (!target) return;
    var buttons = bar.querySelectorAll("button[data-tab]");
    var panels = target.querySelectorAll("[data-panel]");
    bar.hidden = false;
    target.classList.add("tabbed");

    function show(key) {
      buttons.forEach(function (b) {
        b.setAttribute("aria-pressed", String(b.getAttribute("data-tab") === key));
      });
      panels.forEach(function (p) { p.hidden = p.getAttribute("data-panel") !== key; });
    }

    buttons.forEach(function (b) {
      b.addEventListener("click", function () { show(b.getAttribute("data-tab")); });
    });
    if (buttons.length) show(buttons[0].getAttribute("data-tab"));
  });

  // Chart tooltips: show a mark's value straight away (the numbers table has them all too).
  var tip = null;
  function hideTip() { if (tip) tip.hidden = true; }
  function showTip(el) {
    var text = el.getAttribute("data-tip");
    if (!text) return;
    if (!tip) {
      tip = document.createElement("div");
      tip.className = "chart-tip";
      tip.setAttribute("aria-hidden", "true");
      document.body.appendChild(tip);
    }
    var anchor = el;
    var before = el.previousElementSibling;
    if (el.tagName.toLowerCase() === "rect" && before && before.classList.contains("col")) anchor = before;
    var box = anchor.getBoundingClientRect();
    tip.textContent = text;
    tip.hidden = false;
    tip.style.left = box.left + box.width / 2 + window.scrollX + "px";
    tip.style.top = box.top + window.scrollY + "px";
  }
  document.querySelectorAll(".chart .hit").forEach(function (el) {
    var title = el.querySelector("title");
    if (title) {
      el.setAttribute("data-tip", title.textContent);
      title.parentNode.removeChild(title);
    }
    el.addEventListener("pointerenter", function () { showTip(el); });
    el.addEventListener("pointerleave", function (e) { if (e.pointerType === "mouse") hideTip(); });
    el.addEventListener("click", function () { showTip(el); });
  });
  document.addEventListener("pointerdown", function (e) {
    if (!(e.target instanceof Element) || !e.target.closest(".chart .hit")) hideTip();
  });
  window.addEventListener("scroll", hideTip, { passive: true });
})();
