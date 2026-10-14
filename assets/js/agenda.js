/* Fútbol Libre — agenda.js: fetches and renders the match agenda. */
(function () {
  "use strict";

  var root = document.getElementById("agenda-app");
  if (!root) return;
  var DATA = { days: [] };

  var state = { day: 0, q: "", cat: "all" };

  var listEl = root.querySelector(".match-list");
  var emptyEl = root.querySelector(".agenda-empty");
  var tabsEl = root.querySelector(".day-tabs");
  var statusEl = root.querySelector(".agenda-status");
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
    if (m.live === true) return true;
    if (m.live === false) return false;
    try {
      var now = new Date();
      var day = DATA.days[state.day];
      if (!day || day.date !== madridToday()) return false;
      var kickoff = new Date(day.date + "T" + m.time + ":00");
      var diffMin = (now - kickoff) / 60000;
      return diffMin >= 0 && diffMin < 115;
    } catch (e) { return false; }
  }

  function madridToday() {
    var parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Europe/Madrid",
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).formatToParts(new Date());
    var values = {};
    parts.forEach(function (part) {
      if (part.type !== "literal") values[part.type] = part.value;
    });
    return values.year + "-" + values.month + "-" + values.day;
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

  function renderCategories() {
    if (!catEl) return;
    var selected = state.cat;
    catEl.innerHTML = '<option value="all">Todas las categorías</option>';
    var categories = {};
    DATA.days.forEach(function (day) {
      day.matches.forEach(function (match) { categories[match.cat] = true; });
    });
    Object.keys(categories).sort().forEach(function (category) {
      var option = document.createElement("option");
      option.value = category;
      option.textContent = CATEGORY_LABELS[category] || category;
      catEl.appendChild(option);
    });
    catEl.value = categories[selected] ? selected : "all";
    state.cat = catEl.value;
  }

  function renderList() {
    var day = DATA.days[state.day];
    listEl.innerHTML = "";
    var items = day ? day.matches.filter(matches) : [];

    if (!items.length) {
      emptyEl.textContent = day && !day.matches.length && !state.q
        ? "No hay partidos programados para este día."
        : "No hay partidos que coincidan con tu búsqueda. Prueba con otro equipo o cambia de día.";
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

  function openModal(day, m) {
    if (!modal) return;
    modal.querySelector("[data-m='title']").textContent = m.home + " vs " + m.away;
    modal.querySelector("[data-m='comp']").textContent = m.comp;
    document.getElementById("modal-home").textContent = m.home;
    document.getElementById("modal-away").textContent = m.away;
    modal.querySelector("[data-m='datetime']").textContent = day.longLabel + " · " + (m.approx ? "≈" : "") + m.time + " (hora peninsular española)" + (m.approx ? " — horario por confirmar" : "");
    modal.querySelector("[data-m='venue']").textContent = m.venue || "Por confirmar";
    modal.querySelector("[data-m='tv']").textContent = "Consulta la programación oficial de la competición";
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

  function showStatus(message, isError) {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.classList.toggle("is-error", Boolean(isError));
  }

  function renderData(data) {
    if (!data || !Array.isArray(data.days)) {
      throw new Error("La respuesta de la agenda no tiene el formato esperado.");
    }
    DATA = data;
    state.day = 0;
    DATA.days.forEach(function (day, index) {
      if (day.date === madridToday()) state.day = index;
    });
    renderCategories();
    renderTabs();
    renderList();
  }

  var loading = false;
  function loadFixtures() {
    if (loading) return;
    loading = true;
    if (!DATA.days.length) showStatus("Cargando partidos…", false);

    fetch("/api/fixtures", {
      headers: { Accept: "application/json" },
      cache: "no-store"
    })
      .then(function (response) {
        return response.json().then(function (payload) {
          if (!response.ok) {
            throw new Error(payload && payload.error ? payload.error : "No se pudo cargar la agenda.");
          }
          return payload;
        });
      })
      .then(function (payload) {
        renderData(payload);
        showStatus("Agenda actualizada automáticamente · Datos de football-data.org.", false);
      })
      .catch(function (error) {
        showStatus(error.message || "No se pudo cargar la agenda.", true);
      })
      .then(function () {
        loading = false;
      });
  }

  loadFixtures();
  window.setInterval(loadFixtures, 15 * 60 * 1000);
})();
