"use strict";

const maps = {
  "full-open": {
    title: "Full Open",
    badge: "FULL OPEN",
    subtitle: "Trilhos abertos com moedas",
    summary: "Mapa modificado com trilhos abertos e rotas de moedas.",
    url: "maps/full-open/index.html?mode=training"
  },
  "full-barriers": {
    title: "Full Barriers",
    badge: "FULL BARRIERS",
    subtitle: "Barreiras roll em todas as linhas",
    summary: "Treino com barreiras roll repetidas nas tres linhas.",
    url: "maps/full-barriers/index.html?mode=training"
  },
  "full-closed": {
    title: "Full Closed",
    badge: "FULL CLOSED",
    subtitle: "Barreiras jump fechadas",
    summary: "Treino com barreiras jump fechadas nas tres linhas.",
    url: "maps/full-closed/index.html?mode=training"
  }
};

const selector = document.querySelector(".selector");
const selectorButton = document.getElementById("selectorButton");
const selectedBadge = document.getElementById("selectedBadge");
const selectedTitle = document.getElementById("selectedTitle");
const selectedSubtitle = document.getElementById("selectedSubtitle");
const mapSummary = document.getElementById("mapSummary");
const playButton = document.getElementById("playButton");
const options = Array.from(document.querySelectorAll(".option"));
const betaOverlay = document.getElementById("betaOverlay");
const betaClose = document.getElementById("betaClose");
const betaConfirm = document.getElementById("betaConfirm");
const pageShell = document.getElementById("pageShell");

let selectedMap = "full-open";

function setOpen(open) {
  selector.dataset.open = String(open);
  selectorButton.setAttribute("aria-expanded", String(open));
}

function selectMap(mapKey) {
  const map = maps[mapKey];
  if (!map) return;

  selectedMap = mapKey;
  selectedBadge.textContent = map.badge;
  selectedTitle.textContent = map.title;
  selectedSubtitle.textContent = map.subtitle;
  mapSummary.textContent = map.summary;

  options.forEach((option) => {
    const isSelected = option.dataset.map === mapKey;
    option.classList.toggle("is-selected", isSelected);
    option.setAttribute("aria-checked", String(isSelected));
  });
}

function closeBetaNotice() {
  betaOverlay.hidden = true;
  document.body.classList.remove("modal-open");
  pageShell.removeAttribute("inert");
  selectorButton.focus();
}

selectorButton.addEventListener("click", () => {
  setOpen(selector.dataset.open !== "true");
});

options.forEach((option) => {
  option.addEventListener("click", () => {
    selectMap(option.dataset.map);
    setOpen(false);
    selectorButton.focus();
  });
});

playButton.addEventListener("click", () => {
  window.location.href = maps[selectedMap].url;
});

betaClose.addEventListener("click", closeBetaNotice);
betaConfirm.addEventListener("click", closeBetaNotice);

document.addEventListener("click", (event) => {
  if (!selector.contains(event.target)) {
    setOpen(false);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (!betaOverlay.hidden) {
      closeBetaNotice();
      return;
    }
    setOpen(false);
    selectorButton.focus();
  }
});

selectMap(selectedMap);
document.body.classList.add("modal-open");
betaConfirm.focus();
