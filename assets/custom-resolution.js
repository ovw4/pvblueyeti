"use strict";

(function () {
  var storageKey = "subway-custom-resolution";
  var fallback = {
    enabled: false,
    width: 608,
    height: 1080
  };

  function clamp(value, fallbackValue) {
    var numeric = Number.parseInt(value, 10);
    if (!Number.isFinite(numeric)) return fallbackValue;
    return Math.min(4096, Math.max(320, numeric));
  }

  function readStoredSettings() {
    try {
      var parsed = JSON.parse(window.localStorage.getItem(storageKey) || "null");
      if (!parsed) return Object.assign({}, fallback);
      return {
        enabled: Boolean(parsed.enabled),
        width: clamp(parsed.width, fallback.width),
        height: clamp(parsed.height, fallback.height)
      };
    } catch {
      return Object.assign({}, fallback);
    }
  }

  function writeStoredSettings(settings) {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(settings));
    } catch {
      // Storage may be unavailable in some browser modes.
    }
  }

  function readQueryResolution(settings) {
    var match = /(?:^|[?&])resolution=(\d{3,4})x(\d{3,4})(?:&|$)/i.exec(window.location.search);
    if (!match) return settings;
    var next = {
      enabled: true,
      width: clamp(match[1], settings.width),
      height: clamp(match[2], settings.height)
    };
    writeStoredSettings(next);
    return next;
  }

  var settings = readQueryResolution(readStoredSettings());
  if (!settings.enabled) return;

  document.documentElement.style.setProperty("--custom-resolution-width", settings.width + "px");
  document.documentElement.style.setProperty("--custom-resolution-height", settings.height + "px");
  document.documentElement.classList.add("custom-resolution-enabled");
  window.customResolution = {
    width: settings.width,
    height: settings.height
  };

  var style = document.createElement("style");
  style.textContent = [
    "html.custom-resolution-enabled,",
    "html.custom-resolution-enabled body {",
    "  width: 100% !important;",
    "  min-width: var(--custom-resolution-width) !important;",
    "  min-height: var(--custom-resolution-height) !important;",
    "  height: auto !important;",
    "  overflow: auto !important;",
    "  background: #000 !important;",
    "}",
    "html.custom-resolution-enabled body {",
    "  display: grid !important;",
    "  place-items: center !important;",
    "}",
    "html.custom-resolution-enabled #game-shell {",
    "  position: relative !important;",
    "  inset: auto !important;",
    "  width: var(--custom-resolution-width) !important;",
    "  height: var(--custom-resolution-height) !important;",
    "  max-width: none !important;",
    "  max-height: none !important;",
    "  overflow: hidden !important;",
    "  background: #000 !important;",
    "}",
    "html.custom-resolution-enabled #game,",
    "html.custom-resolution-enabled #game canvas {",
    "  width: 100% !important;",
    "  height: 100% !important;",
    "}"
  ].join("\n");
  document.head.appendChild(style);
})();
