/* Fútbol Libre — agenda.js: renders the match agenda.
   Depends on window.FUTBOL_LIBRE_FIXTURES (assets/js/fixtures.js). */
(function () {
  "use strict";

  var root = document.getElementById("agenda-app");
  if (!root) return;
  var DATA = window.FUTBOL_LIBRE_FIXTURES || { days: [] };
  var CHANNELS = window.FUTBOL_LIBRE_CHANNELS || [];

  var state = { day: 0, q: "", cat: "all" };

  var listEl = root.querySelector(".match-list");
  var emptyEl = root.querySelector(".agenda-empty");
  var tabsEl = root.querySelector(".day-tabs");
  var searchEl = root.querySelector('[data-agenda="search"]');
  var catEl = root.querySelector('[data-agenda="category"]');
  var modal = document.getElementById("match-modal");

  var CATEGORY_LABELS = {
    futbol: "Fútbol",
    futbol_fem: "Fútbol femenino",
    baloncesto: "Baloncesto",
    hockey: "Hockey sobre hielo",
    motor: "Motor",
    tenis: "Tenis",
    boxeo: "Boxeo / MMA",
    otro: "Otros deportes"
  };

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function isLive(m) {
    // A match is "live" if today is its day and kickoff was < 115 min ago.
    try {
      var now = new Date();
      var day = DATA.days[state.day];
      if (!day || day.date !== toISODate(now)) return false;
      var kickoff = new Date(day.date + "T" + m.time + ":00");
      var diffMin = (now - kickoff) / 60000;
      return diffMin >= 0 && diffMin < 115;
    } catch (e) { return false; }
  }

  function toISODate(d) {
    var p = function (n) { return (n < 10 ? "0" : "") + n; };
    return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate());
  }

  function matches(m) {
    if (state.cat !== "all" && m.cat !== state.cat) return false;
    if (state.q) {
      var hay = (m.home + " " + m.away + " " + m.comp).toLowerCase();
      if (hay.indexOf(state.q) === -1) return false;
    }
    return true;
  }

  function renderTabs() {
    tabsEl.innerHTML = "";
    DATA.days.forEach(function (day, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "day-tab" + (i === state.day ? " active" : "");
      b.textContent = day.label;
      b.setAttribute("aria-pressed", i === state.day ? "true" : "false");
      b.addEventListener("click", function () {
        state.day = i;
        renderTabs();
        renderList();
      });
      tabsEl.appendChild(b);
    });
  }

  function renderList() {
    var day = DATA.days[state.day];
    listEl.innerHTML = "";
    var items = day ? day.matches.filter(matches) : [];

    // Populate category select once (from all days)
    if (catEl && catEl.options.length <= 1) {
      var cats = {};
      DATA.days.forEach(function (d) {
        d.matches.forEach(function (m) { cats[m.cat] = true; });
      });
      Object.keys(cats).sort().forEach(function (c) {
        var o = document.createElement("option");
        o.value = c;
        o.textContent = CATEGORY_LABELS[c] || c;
        catEl.appendChild(o);
      });
    }

    if (!items.length) {
      emptyEl.hidden = false;
      return;
    }
    emptyEl.hidden = true;

    items.forEach(function (m, idx) {
      var li = document.createElement("li");
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "match-row";
      btn.setAttribute("aria-haspopup", "dialog");
      var live = isLive(m) ? '<span class="match-live">EN VIVO</span>' : "";
      var timeLabel = (m.approx ? "≈" : "") + m.time;
      btn.innerHTML =
        '<span class="match-time">' + esc(timeLabel) + '</span>' +
        '<span class="match-flag" aria-hidden="true">' + esc(m.flag || "⚽") + "</span>" +
        '<span class="match-title"><strong>' + esc(m.comp) + ": " + esc(m.home) + " vs " + esc(m.away) + "</strong>" +
        '<span>' + esc(CATEGORY_LABELS[m.cat] || m.cat) + (m.venue ? " · " + esc(m.venue) : "") + "</span></span>" +
        live +
        '<span class="match-chev" aria-hidden="true">›</span>';
      btn.addEventListener("click", function () { openModal(day, m); });
      li.appendChild(btn);
      listEl.appendChild(li);
    });
  }

  function channelInfo(name) {
    for (var i = 0; i < CHANNELS.length; i++) {
      if (CHANNELS[i].name === name) return CHANNELS[i];
    }
    return null;
  }

  function openModal(day, m) {
    if (!modal) return;
    var official = (m.tv || []).map(function (t) {
      var c = channelInfo(t);
      return c ? c.name + " (" + c.how + ")" : t;
    });
    modal.querySelector("[data-m='title']").textContent = m.home + " vs " + m.away;
    modal.querySelector("[data-m='comp']").textContent = m.comp;
    document.getElementById("modal-home").textContent = m.home;
    document.getElementById("modal-away").textContent = m.away;
    modal.querySelector("[data-m='datetime']").textContent = day.longLabel + " · " + (m.approx ? "≈" : "") + m.time + " (hora peninsular española)" + (m.approx ? " — horario por confirmar" : "");
    modal.querySelector("[data-m='venue']").textContent = m.venue || "Por confirmar";
    modal.querySelector("[data-m='tv']").textContent = official.length ? official.join(" · ") : "Consulta la programación oficial de la competición";
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
    var closeBtn = modal.querySelector(".modal-close");
    if (closeBtn) closeBtn.focus();
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove("open");
    document.body.style.overflow = "";
  }

  if (modal) {
    modal.addEventListener("click", function (e) {
      if (e.target === modal || e.target.closest(".modal-close")) closeModal();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeModal();
    });
  }

  if (searchEl) {
    var t;
    searchEl.addEventListener("input", function () {
      clearTimeout(t);
      t = setTimeout(function () {
        state.q = searchEl.value.trim().toLowerCase();
        renderList();
      }, 150);
    });
  }
  if (catEl) {
    catEl.addEventListener("change", function () {
      state.cat = catEl.value;
      renderList();
    });
  }

  // Default to the tab matching the visitor's local date when available.
  (function pickToday() {
    var today = toISODate(new Date());
    DATA.days.forEach(function (d, i) {
      if (d.date === today) state.day = i;
    });
  })();

  renderTabs();
  renderList();
})();
