"use strict";

const cities = {
  berlin: {
    title: "Berlin",
    region: "BERLIN",
    preview: "assets/berlin-preview.png",
    previewAlt: "Trilhos do mapa Berlin",
    maps: {
      "full-open": {
        title: "Full Open",
        badge: "FULL OPEN",
        subtitle: "Trilhos abertos com moedas",
        summary: "Mapa Berlin modificado com trilhos abertos e rotas de moedas.",
        url: "maps/full-open/index.html?mode=training"
      },
      "full-barriers": {
        title: "Full Barriers",
        badge: "FULL BARRIERS",
        subtitle: "Barreiras roll em todas as linhas",
        summary: "Berlin com barreiras roll repetidas nas tres linhas.",
        url: "maps/full-barriers/index.html?mode=training"
      },
      "full-closed": {
        title: "Full Closed",
        badge: "FULL CLOSED",
        subtitle: "Barreiras jump fechadas",
        summary: "Berlin com barreiras jump fechadas nas tres linhas.",
        url: "maps/full-closed/index.html?mode=training"
      }
    }
  },
  monaco: {
    title: "Monaco",
    region: "MONACO",
    preview: "assets/monaco-preview.png",
    previewAlt: "Trilhos do mapa Monaco",
    maps: {
      "full-open": {
        title: "Full Open",
        badge: "FULL OPEN",
        subtitle: "Trilhos abertos com moedas",
        summary: "Mapa Monaco modificado com trilhos abertos e rotas de moedas.",
        url: "maps/monaco-full-open/index.html?mode=training"
      },
      "full-barriers": {
        title: "Full Barriers",
        badge: "FULL BARRIERS",
        subtitle: "Barreiras roll em todas as linhas",
        summary: "Monaco com barreiras roll repetidas nas tres linhas.",
        url: "maps/monaco-full-barriers/index.html?mode=training"
      },
      "full-closed": {
        title: "Full Closed",
        badge: "FULL CLOSED",
        subtitle: "Barreiras jump fechadas",
        summary: "Monaco com barreiras jump fechadas nas tres linhas.",
        url: "maps/monaco-full-closed/index.html?mode=training"
      }
    }
  },
  havana: {
    title: "Havana",
    region: "HAVANA",
    preview: "assets/havana-preview.png",
    previewAlt: "Trilhos do mapa Havana",
    maps: {
      "full-open": {
        title: "Full Open",
        badge: "FULL OPEN",
        subtitle: "Trilhos abertos com moedas",
        summary: "Mapa Havana modificado com trilhos abertos e rotas de moedas.",
        url: "maps/havana-full-open/index.html?mode=training"
      },
      "full-barriers": {
        title: "Full Barriers",
        badge: "FULL BARRIERS",
        subtitle: "Barreiras roll em todas as linhas",
        summary: "Havana com barreiras roll repetidas nas tres linhas.",
        url: "maps/havana-full-barriers/index.html?mode=training"
      },
      "full-closed": {
        title: "Full Closed",
        badge: "FULL CLOSED",
        subtitle: "Barreiras jump fechadas",
        summary: "Havana com barreiras jump fechadas nas tres linhas.",
        url: "maps/havana-full-closed/index.html?mode=training"
      }
    }
  }
};

const selector = document.querySelector(".selector");
const selectorButton = document.getElementById("selectorButton");
const selectedBadge = document.getElementById("selectedBadge");
const selectedTitle = document.getElementById("selectedTitle");
const selectedSubtitle = document.getElementById("selectedSubtitle");
const mapSummary = document.getElementById("mapSummary");
const mapPreview = document.getElementById("mapPreview");
const regionName = document.getElementById("regionName");
const cityTitle = document.getElementById("cityTitle");
const playButton = document.getElementById("playButton");
const options = Array.from(document.querySelectorAll(".option"));
const cityTabs = Array.from(document.querySelectorAll(".city-tab"));
const betaOverlay = document.getElementById("betaOverlay");
const betaClose = document.getElementById("betaClose");
const betaConfirm = document.getElementById("betaConfirm");
const pageShell = document.getElementById("pageShell");

let selectedCity = "berlin";
let selectedMap = "full-open";

function setOpen(open) {
  selector.dataset.open = String(open);
  selectorButton.setAttribute("aria-expanded", String(open));
}

function selectMap(mapKey) {
  const map = cities[selectedCity].maps[mapKey];
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

function selectCity(cityKey) {
  const city = cities[cityKey];
  if (!city) return;

  selectedCity = cityKey;
  cityTitle.textContent = city.title;
  regionName.textContent = city.region;
  mapPreview.src = city.preview;
  mapPreview.alt = city.previewAlt;

  cityTabs.forEach((tab) => {
    const isSelected = tab.dataset.city === cityKey;
    tab.classList.toggle("is-selected", isSelected);
    tab.setAttribute("aria-pressed", String(isSelected));
  });

  selectMap(selectedMap);
  setOpen(false);
}

function closeBetaNotice() {
  betaOverlay.hidden = true;
  document.body.classList.remove("modal-open");
  pageShell.removeAttribute("inert");
  cityTabs[0].focus();
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

cityTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    selectCity(tab.dataset.city);
  });
});

playButton.addEventListener("click", () => {
  window.location.href = cities[selectedCity].maps[selectedMap].url;
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

selectCity(selectedCity);
document.body.classList.add("modal-open");
betaConfirm.focus();
