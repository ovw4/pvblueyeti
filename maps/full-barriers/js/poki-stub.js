"use strict";

window.PokiSDK = {
  init: function () { return Promise.resolve(); },
  initWithVideoHB: function () { return Promise.resolve(); },
  commercialBreak: function () { return Promise.resolve(); },
  rewardedBreak: function () { return Promise.resolve(false); },
  displayAd: function () {},
  shareableURL: function () { return Promise.resolve(""); },
  getURLParam: function () { return Promise.resolve(""); },
  getLanguage: function () { return Promise.resolve("en"); },
  gameLoadingStart: function () {},
  gameLoadingFinished: function () {},
  gameLoadingProgress: function () {},
  gameInteractive: function () {},
  gameplayStart: function () {},
  gameplayStop: function () {},
  roundStart: function () {},
  roundEnd: function () {},
  happyTime: function () {},
  customEvent: function () {},
  destroyAd: function () {},
  setDebug: function () {},
  logError: function () {},
  muteAd: function () {},
  disableProgrammatic: function () {},
  getLeaderboard: function () { return Promise.resolve({}); },
  setPlayerAge: function () {},
  togglePlayerAdvertisingConsent: function () {},
  toggleNonPersonalized: function () {},
  setConsentString: function () {},
  sendHighscore: function () {}
};

window.PokiBridge = window.PokiBridge || {};

window.initPokiBridge = function (gameObjectName) {
  window.PokiBridge.gameObjectName = gameObjectName || "";
  window.unityGame.SendMessage(gameObjectName, "ready");
  window.commercialBreak = function () {
    window.PokiSDK.commercialBreak().then(function () {
      window.unityGame.SendMessage(gameObjectName, "commercialBreakCompleted");
    });
  };
  window.rewardedBreak = function () {
    window.PokiSDK.rewardedBreak().then(function (withReward) {
      window.unityGame.SendMessage(
        gameObjectName,
        "rewardedBreakCompleted",
        String(withReward)
      );
    });
  };
};

window.commercialBreak = function () {};
window.rewardedBreak = function () {};
