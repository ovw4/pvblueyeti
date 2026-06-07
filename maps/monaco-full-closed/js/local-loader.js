"use strict";

(function () {
  var loading = document.getElementById("loading");
  var status = document.getElementById("status");
  var progress = document.getElementById("progress-fill");
  var error = document.getElementById("error");

  function showGame() {
    loading.classList.add("hidden");
  }

  function showError(message) {
    status.textContent = "Falha ao carregar";
    error.style.display = "block";
    error.textContent = String(message);
  }

  window.addEventListener("error", function (event) {
    showError(event.error && event.error.stack ? event.error.stack : event.message);
  });

  window.addEventListener("unhandledrejection", function (event) {
    showError(event.reason && event.reason.stack ? event.reason.stack : event.reason);
  });

  function startUnity() {
    try {
      var moduleOptions = {
        onRuntimeInitialized: function () {
          if (window.infiniteSaveReadyAtStartup) {
            showGame();
          } else {
            status.textContent = "Finalizando save e configuracoes...";
          }
          if (window.scheduleInfiniteSaveRefresh) {
            window.scheduleInfiniteSaveRefresh();
          }
        },
        print: function (message) {
          console.log(message);
        },
        printErr: function (message) {
          console.error(message);
        }
      };
      window.unityModule = moduleOptions;

      status.textContent = "Carregando dados do mapa...";
      window.unityGame = window.UnityLoader.instantiate(
        "game",
        "Build/12/12.json?mod=monaco-full-closed-v1",
        {
          onProgress: function (gameInstance, value) {
            window.unityModule = gameInstance.Module || window.unityModule;
            var percent = Math.round(value * 100);
            progress.style.width = percent + "%";
            status.textContent = percent < 100
              ? "Carregando " + percent + "%"
              : "Iniciando jogo...";
          },
          Module: moduleOptions,
          onerror: showError
        }
      );
    } catch (err) {
      showError(err && err.stack ? err.stack : err);
    }
  }

  window.addEventListener("infinite-save-ready", showGame);

  status.textContent = "Aplicando save infinito...";
  Promise.resolve(window.applyInfiniteSave ? window.applyInfiniteSave() : null)
    .then(function (result) {
      window.infiniteSaveReadyAtStartup = Boolean(result && result.ready);
      startUnity();
    })
    .catch(function (err) {
      console.warn("[infinite-save] initial apply failed", err);
      startUnity();
    });
})();
