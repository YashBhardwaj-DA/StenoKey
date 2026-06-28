/* ============================================================
   StenoKey — App Logic
   No backend, no analytics. Best WPM/accuracy per module is
   kept in localStorage only, on the user's own device.
   ============================================================ */

(function () {
  "use strict";

  // ---------- Constants ----------
  const STORAGE_KEY = "stenokey_progress_v1";
  const LAST_MODULE_KEY = "stenokey_last_module_v1";
  const THEME_KEY = "stenokey_theme_v1";

  // ---------- State ----------
  let currentModuleIndex = 0;
  let currentLineIndex = 0;
  let typedChars = [];        // array of "correct" | "incorrect" per position
  let startTime = null;
  let timerInterval = null;
  let totalKeystrokes = 0;
  let totalErrors = 0;        // counts every incorrect keystroke ever made (even corrected)
  let isFinished = false;

  // ---------- DOM ----------
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  const moduleSelect = $("#moduleSelect");
  const lineSelect = $("#lineSelect");
  const typeText = $("#typeText");
  const typeField = $("#typeField");
  const typeOverlay = $("#typeOverlay");
  const hiddenInput = $("#hiddenInput");
  const progressFill = $("#progressFill");
  const tipText = $("#tipText");

  const wpmValue = $("#wpmValue");
  const accValue = $("#accValue");
  const errValue = $("#errValue");
  const timeValue = $("#timeValue");
  const bestValue = $("#bestValue");
  const bestModuleLabel = $("#bestModuleLabel");

  const resultBackdrop = $("#resultBackdrop");
  const resultHeadline = $("#resultHeadline");
  const resultWpm = $("#resultWpm");
  const resultAcc = $("#resultAcc");
  const resultErr = $("#resultErr");
  const resultTime = $("#resultTime");
  const resultNote = $("#resultNote");

  // ============================================================
  // PROGRESS (localStorage)
  // ============================================================
  function loadProgress() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch (e) {
      return {};
    }
  }

  function saveProgress(progress) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
      /* localStorage unavailable — fail silently, app still works */
    }
  }

  function recordResult(moduleId, wpm, accuracy) {
    const progress = loadProgress();
    const entry = progress[moduleId] || { bestWpm: 0, bestAccuracy: 0, sessions: 0 };
    entry.bestWpm = Math.max(entry.bestWpm, wpm);
    entry.bestAccuracy = Math.max(entry.bestAccuracy, accuracy);
    entry.sessions += 1;
    progress[moduleId] = entry;
    saveProgress(progress);
    return entry;
  }

  function getModuleBest(moduleId) {
    const progress = loadProgress();
    return progress[moduleId] || null;
  }

  // ============================================================
  // THEME
  // ============================================================
  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    $("#iconSun").style.display = theme === "dark" ? "none" : "block";
    $("#iconMoon").style.display = theme === "dark" ? "block" : "none";
    localStorage.setItem(THEME_KEY, theme);
  }

  function initTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    applyTheme(saved || (prefersDark ? "dark" : "light"));
  }

  $("#themeToggle").addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    applyTheme(current === "dark" ? "light" : "dark");
  });

  // ============================================================
  // NAVIGATION (tabs)
  // ============================================================
  function showView(viewName) {
    $$(".view").forEach((v) => v.classList.remove("is-active"));
    $$(".tab").forEach((t) => {
      t.classList.toggle("is-active", t.dataset.view === viewName);
      t.setAttribute("aria-selected", t.dataset.view === viewName ? "true" : "false");
    });
    $(`#view-${viewName}`).classList.add("is-active");
    if (viewName === "modules") renderModuleGrid();
    if (viewName === "stats") renderStatsTable();
  }

  $$(".tab").forEach((tab) => {
    tab.addEventListener("click", () => showView(tab.dataset.view));
  });

  // ============================================================
  // MODULE / LINE SELECTORS
  // ============================================================
  function populateModuleSelect() {
    moduleSelect.innerHTML = MODULES.map(
      (m, i) => `<option value="${i}">${m.title} — ${m.levelLabel}</option>`
    ).join("");
  }

  function populateLineSelect() {
    const mod = MODULES[currentModuleIndex];
    lineSelect.innerHTML = mod.lines
      .map((line, i) => `<option value="${i}">Drill ${i + 1} of ${mod.lines.length}</option>`)
      .join("");
  }

  moduleSelect.addEventListener("change", () => {
    currentModuleIndex = parseInt(moduleSelect.value, 10);
    currentLineIndex = 0;
    populateLineSelect();
    lineSelect.value = "0";
    localStorage.setItem(LAST_MODULE_KEY, JSON.stringify({ m: currentModuleIndex, l: 0 }));
    loadDrill();
  });

  lineSelect.addEventListener("change", () => {
    currentLineIndex = parseInt(lineSelect.value, 10);
    localStorage.setItem(LAST_MODULE_KEY, JSON.stringify({ m: currentModuleIndex, l: currentLineIndex }));
    loadDrill();
  });

  $("#shuffleBtn").addEventListener("click", () => {
    const mod = MODULES[currentModuleIndex];
    let next = currentLineIndex;
    if (mod.lines.length > 1) {
      while (next === currentLineIndex) next = Math.floor(Math.random() * mod.lines.length);
    }
    currentLineIndex = next;
    lineSelect.value = String(next);
    loadDrill();
  });

  $("#restartBtn").addEventListener("click", () => loadDrill());

  // ============================================================
  // TYPING ENGINE
  // ============================================================
  function currentText() {
    return MODULES[currentModuleIndex].lines[currentLineIndex];
  }

  function loadDrill() {
    clearInterval(timerInterval);
    startTime = null;
    isFinished = false;
    totalKeystrokes = 0;
    totalErrors = 0;
    typedChars = [];

    const text = currentText();
    renderText(text);
    updateMeters(0, 100, 0, 0);
    progressFill.style.width = "0%";
    typeOverlay.classList.remove("is-hidden");
    typeOverlay.querySelector("span").textContent = "Click here and start typing to begin";
    hiddenInput.value = "";
    rotateTip();
    refreshBestMeter();
  }

  function renderText(text) {
    const chars = text.split("");
    typeText.innerHTML = chars
      .map((ch, i) => {
        const display = ch === " " ? "&nbsp;" : escapeHtml(ch);
        const cls = i === 0 ? "char untyped current" : "char untyped";
        return `<span class="${cls}" data-idx="${i}">${display}</span>`;
      })
      .join("");
  }

  function escapeHtml(ch) {
    if (ch === "<") return "&lt;";
    if (ch === ">") return "&gt;";
    if (ch === "&") return "&amp;";
    return ch;
  }

  function updateCharSpans() {
    const text = currentText();
    const spans = typeText.querySelectorAll(".char");
    spans.forEach((span, i) => {
      span.classList.remove("correct", "incorrect", "current", "untyped");
      if (i < typedChars.length) {
        span.classList.add(typedChars[i] === "correct" ? "correct" : "incorrect");
      } else if (i === typedChars.length) {
        span.classList.add("current", "untyped");
      } else {
        span.classList.add("untyped");
      }
    });
    const progress = Math.min(100, Math.round((typedChars.length / text.length) * 100));
    progressFill.style.width = progress + "%";
  }

  function startTimerIfNeeded() {
    if (startTime) return;
    startTime = Date.now();
    timerInterval = setInterval(tickStats, 250);
  }

  function tickStats() {
    if (!startTime || isFinished) return;
    const elapsedSec = (Date.now() - startTime) / 1000;
    const correctCount = typedChars.filter((c) => c === "correct").length;
    const wpm = elapsedSec > 0 ? Math.round((correctCount / 5) / (elapsedSec / 60)) : 0;
    const accuracy = totalKeystrokes > 0
      ? Math.round(((totalKeystrokes - totalErrors) / totalKeystrokes) * 100)
      : 100;
    updateMeters(wpm, Math.max(0, accuracy), totalErrors, Math.round(elapsedSec));
  }

  function updateMeters(wpm, accuracy, errors, seconds) {
    wpmValue.textContent = wpm;
    accValue.innerHTML = accuracy + '<span class="meter-unit">%</span>';
    errValue.textContent = errors;
    timeValue.innerHTML = seconds + '<span class="meter-unit">s</span>';
  }

  function refreshBestMeter() {
    const mod = MODULES[currentModuleIndex];
    const best = getModuleBest(mod.id);
    bestValue.textContent = best ? best.bestWpm : "—";
    bestModuleLabel.textContent = "· " + mod.title;
  }

  function rotateTip() {
    tipText.textContent = TIPS[Math.floor(Math.random() * TIPS.length)];
  }

  // ---- Key handling ----
  typeField.addEventListener("click", () => hiddenInput.focus());

  hiddenInput.addEventListener("focus", () => {
    typeOverlay.classList.add("is-hidden");
  });

  hiddenInput.addEventListener("blur", () => {
    if (!isFinished && typedChars.length === 0) {
      typeOverlay.classList.remove("is-hidden");
    }
  });

  hiddenInput.addEventListener("keydown", (e) => {
    if (isFinished) return;
    const text = currentText();

    if (e.key === "Backspace") {
      e.preventDefault();
      if (typedChars.length > 0) {
        typedChars.pop();
        updateCharSpans();
      }
      return;
    }

    // Ignore modifier-only / navigation keys
    if (e.key.length > 1) return; // covers Shift, Control, Alt, Arrow keys, Tab, etc.

    e.preventDefault();
    if (typedChars.length >= text.length) return;

    startTimerIfNeeded();

    const expected = text[typedChars.length];
    const isCorrect = e.key === expected;
    totalKeystrokes++;
    if (!isCorrect) totalErrors++;
    typedChars.push(isCorrect ? "correct" : "incorrect");
    updateCharSpans();

    if (typedChars.length === text.length) {
      finishDrill();
    }
  });

  function finishDrill() {
    isFinished = true;
    clearInterval(timerInterval);
    const elapsedSec = Math.max(0.5, (Date.now() - startTime) / 1000);
    const correctCount = typedChars.filter((c) => c === "correct").length;
    const wpm = Math.round((correctCount / 5) / (elapsedSec / 60));
    const accuracy = totalKeystrokes > 0
      ? Math.max(0, Math.round(((totalKeystrokes - totalErrors) / totalKeystrokes) * 100))
      : 100;

    updateMeters(wpm, accuracy, totalErrors, Math.round(elapsedSec));

    const mod = MODULES[currentModuleIndex];
    const prevBest = getModuleBest(mod.id);
    const entry = recordResult(mod.id, wpm, accuracy);
    refreshBestMeter();

    showResultModal(wpm, accuracy, totalErrors, Math.round(elapsedSec), prevBest, entry);
  }

  function showResultModal(wpm, accuracy, errors, seconds, prevBest, entry) {
    resultWpm.textContent = wpm;
    resultAcc.textContent = accuracy + "%";
    resultErr.textContent = errors;
    resultTime.textContent = seconds + "s";

    const isNewBest = !prevBest || wpm > prevBest.bestWpm;
    resultHeadline.textContent = isNewBest ? "New personal best!" : "Drill complete.";

    let note = "";
    if (accuracy < 90) {
      note = "Accuracy dipped below 90% — slow down slightly and let correctness lead the next run.";
    } else if (isNewBest) {
      note = "That's your fastest clean run on this module so far. Try the next module, or shuffle for another line at this level.";
    } else {
      note = "Solid run. Shuffle for a new line in this module, or move up a level when this feels easy.";
    }
    resultNote.textContent = note;
    resultBackdrop.classList.add("is-open");
  }

  $("#modalCloseBtn").addEventListener("click", () => {
    resultBackdrop.classList.remove("is-open");
  });

  $("#modalNextBtn").addEventListener("click", () => {
    resultBackdrop.classList.remove("is-open");
    $("#shuffleBtn").click();
    hiddenInput.focus();
  });

  resultBackdrop.addEventListener("click", (e) => {
    if (e.target === resultBackdrop) resultBackdrop.classList.remove("is-open");
  });

  // ============================================================
  // MODULES VIEW (grid)
  // ============================================================
  function renderModuleGrid() {
    const grid = $("#moduleGrid");
    grid.innerHTML = MODULES.map((m, i) => {
      const best = getModuleBest(m.id);
      const bestLine = best ? `Best: ${best.bestWpm} WPM · ${best.bestAccuracy}% accuracy` : "Not attempted yet";
      return `
        <button class="module-card" data-index="${i}">
          <div class="module-card-top">
            <h3>${m.title}</h3>
            <span class="level-chip">${m.levelLabel}</span>
          </div>
          <p>${m.description}</p>
          <span class="module-card-best">${bestLine}</span>
        </button>
      `;
    }).join("");

    $$(".module-card").forEach((card) => {
      card.addEventListener("click", () => {
        currentModuleIndex = parseInt(card.dataset.index, 10);
        currentLineIndex = 0;
        moduleSelect.value = String(currentModuleIndex);
        populateLineSelect();
        lineSelect.value = "0";
        loadDrill();
        showView("practice");
        setTimeout(() => hiddenInput.focus(), 50);
      });
    });
  }

  // ============================================================
  // STATS VIEW
  // ============================================================
  function renderStatsTable() {
    const body = $("#statsBody");
    const progress = loadProgress();
    const rows = MODULES.map((m) => {
      const entry = progress[m.id];
      if (!entry) {
        return `<tr><td>${m.title}</td><td>—</td><td>—</td><td>0</td></tr>`;
      }
      return `<tr><td>${m.title}</td><td>${entry.bestWpm}</td><td>${entry.bestAccuracy}%</td><td>${entry.sessions}</td></tr>`;
    });
    body.innerHTML = rows.join("");
  }

  $("#clearStatsBtn").addEventListener("click", () => {
    if (confirm("Clear all saved best scores from this browser? This cannot be undone.")) {
      localStorage.removeItem(STORAGE_KEY);
      renderStatsTable();
      refreshBestMeter();
    }
  });

  // ============================================================
  // INIT
  // ============================================================
  function init() {
    initTheme();
    populateModuleSelect();

    let restored = { m: 0, l: 0 };
    try {
      const saved = JSON.parse(localStorage.getItem(LAST_MODULE_KEY));
      if (saved && MODULES[saved.m]) restored = saved;
    } catch (e) { /* ignore */ }

    currentModuleIndex = restored.m;
    moduleSelect.value = String(currentModuleIndex);
    populateLineSelect();
    currentLineIndex = Math.min(restored.l, MODULES[currentModuleIndex].lines.length - 1);
    lineSelect.value = String(currentLineIndex);

    loadDrill();
    showView("practice");
  }

  document.addEventListener("DOMContentLoaded", init);
})();
