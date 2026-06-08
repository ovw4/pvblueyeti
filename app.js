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
  sanfrancisco: {
    title: "San Francisco",
    region: "SAN FRANCISCO",
    preview: "assets/sanfrancisco-preview.png",
    previewAlt: "Trilhos do mapa San Francisco",
    maps: {
      "full-open": {
        title: "Full Open",
        badge: "FULL OPEN",
        subtitle: "Trilhos abertos com moedas",
        summary: "Mapa San Francisco modificado com trilhos abertos e rotas de moedas.",
        url: "maps/sanfrancisco-full-open/index.html?mode=training"
      },
      "full-barriers": {
        title: "Full Barriers",
        badge: "FULL BARRIERS",
        subtitle: "Barreiras roll em todas as linhas",
        summary: "San Francisco com barreiras roll repetidas nas tres linhas.",
        url: "maps/sanfrancisco-full-barriers/index.html?mode=training"
      },
      "full-closed": {
        title: "Full Closed",
        badge: "FULL CLOSED",
        subtitle: "Barreiras jump fechadas",
        summary: "San Francisco com barreiras jump fechadas nas tres linhas.",
        url: "maps/sanfrancisco-full-closed/index.html?mode=training"
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
const settingsButton = document.getElementById("settingsButton");
const settingsOverlay = document.getElementById("settingsOverlay");
const settingsClose = document.getElementById("settingsClose");
const resolutionToggle = document.getElementById("resolutionToggle");
const resolutionWidth = document.getElementById("resolutionWidth");
const resolutionHeight = document.getElementById("resolutionHeight");
const resolutionReset = document.getElementById("resolutionReset");
const resolutionPresets = Array.from(document.querySelectorAll(".resolution-presets button"));

const resolutionStorageKey = "subway-custom-resolution";
const defaultResolution = {
  enabled: false,
  width: 608,
  height: 1080
};

let selectedCity = "berlin";
let selectedMap = "full-open";
let resolutionSettings = loadResolutionSettings();

function clampResolution(value, fallback) {
  const numeric = Number.parseInt(value, 10);
  if (!Number.isFinite(numeric)) return fallback;
  return Math.min(4096, Math.max(320, numeric));
}

function loadResolutionSettings() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(resolutionStorageKey) || "null");
    if (!parsed) return { ...defaultResolution };
    return {
      enabled: Boolean(parsed.enabled),
      width: clampResolution(parsed.width, defaultResolution.width),
      height: clampResolution(parsed.height, defaultResolution.height)
    };
  } catch {
    return { ...defaultResolution };
  }
}

function saveResolutionSettings() {
  try {
    window.localStorage.setItem(resolutionStorageKey, JSON.stringify(resolutionSettings));
  } catch {
    // Ignore storage failures; the current page state still applies.
  }
}

function renderResolutionSettings() {
  resolutionToggle.classList.toggle("is-enabled", resolutionSettings.enabled);
  resolutionToggle.setAttribute("aria-pressed", String(resolutionSettings.enabled));
  resolutionWidth.value = String(resolutionSettings.width);
  resolutionHeight.value = String(resolutionSettings.height);

  resolutionPresets.forEach((preset) => {
    preset.classList.toggle(
      "is-selected",
      Number(preset.dataset.width) === resolutionSettings.width &&
      Number(preset.dataset.height) === resolutionSettings.height
    );
  });
}

function updateResolution(values) {
  resolutionSettings = {
    enabled: values.enabled ?? resolutionSettings.enabled,
    width: clampResolution(values.width ?? resolutionSettings.width, defaultResolution.width),
    height: clampResolution(values.height ?? resolutionSettings.height, defaultResolution.height)
  };
  saveResolutionSettings();
  renderResolutionSettings();
}

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

function setSettingsOpen(open) {
  settingsOverlay.hidden = !open;
  document.body.classList.toggle("modal-open", open || !betaOverlay.hidden);

  if (open) {
    pageShell.setAttribute("inert", "");
    renderResolutionSettings();
    settingsClose.focus();
    return;
  }

  if (betaOverlay.hidden) {
    pageShell.removeAttribute("inert");
    settingsButton.focus();
  }
}

function selectedMapUrl() {
  const target = new URL(cities[selectedCity].maps[selectedMap].url, window.location.href);
  if (resolutionSettings.enabled) {
    target.searchParams.set("resolution", `${resolutionSettings.width}x${resolutionSettings.height}`);
  } else {
    target.searchParams.delete("resolution");
  }
  return target.href;
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
  window.location.href = selectedMapUrl();
});

betaClose.addEventListener("click", closeBetaNotice);
betaConfirm.addEventListener("click", closeBetaNotice);
settingsButton.addEventListener("click", () => {
  setSettingsOpen(true);
});
settingsClose.addEventListener("click", () => {
  setSettingsOpen(false);
});
settingsOverlay.addEventListener("click", (event) => {
  if (event.target === settingsOverlay) {
    setSettingsOpen(false);
  }
});
resolutionToggle.addEventListener("click", () => {
  updateResolution({ enabled: !resolutionSettings.enabled });
});
resolutionWidth.addEventListener("change", () => {
  updateResolution({ width: resolutionWidth.value, enabled: true });
});
resolutionHeight.addEventListener("change", () => {
  updateResolution({ height: resolutionHeight.value, enabled: true });
});
resolutionReset.addEventListener("click", () => {
  updateResolution({ ...defaultResolution });
});
resolutionPresets.forEach((preset) => {
  preset.addEventListener("click", () => {
    updateResolution({
      enabled: true,
      width: preset.dataset.width,
      height: preset.dataset.height
    });
  });
});

document.addEventListener("click", (event) => {
  if (!selector.contains(event.target)) {
    setOpen(false);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (!settingsOverlay.hidden) {
      setSettingsOpen(false);
      return;
    }
    if (!betaOverlay.hidden) {
      closeBetaNotice();
      return;
    }
    setOpen(false);
    selectorButton.focus();
  }
});

selectCity(selectedCity);
renderResolutionSettings();
document.body.classList.add("modal-open");
betaConfirm.focus();
