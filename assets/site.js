// Show dates and kick-off times in the visitor's own time zone (the HTML says UTC).
(function () {
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
})();
