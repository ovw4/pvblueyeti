"use strict";

(function () {
  var keyMap = {
    KeyW: { key: "ArrowUp", keyCode: 38 },
    KeyA: { key: "ArrowLeft", keyCode: 37 },
    KeyS: { key: "ArrowDown", keyCode: 40 },
    KeyD: { key: "ArrowRight", keyCode: 39 }
  };

  var forwardedEvents = new WeakSet();

  function isTextInput(element) {
    if (!element) return false;
    return element.isContentEditable ||
      element.tagName === "INPUT" ||
      element.tagName === "TEXTAREA" ||
      element.tagName === "SELECT";
  }

  function forwardAsArrow(event) {
    var mapped = keyMap[event.code];
    if (!mapped || forwardedEvents.has(event) || isTextInput(event.target)) {
      return;
    }

    event.preventDefault();

    var arrowEvent = new KeyboardEvent(event.type, {
      key: mapped.key,
      code: mapped.key,
      location: 0,
      ctrlKey: event.ctrlKey,
      shiftKey: event.shiftKey,
      altKey: event.altKey,
      metaKey: event.metaKey,
      repeat: event.repeat,
      bubbles: true,
      cancelable: true
    });

    Object.defineProperties(arrowEvent, {
      keyCode: { get: function () { return mapped.keyCode; } },
      which: { get: function () { return mapped.keyCode; } },
      charCode: { get: function () { return 0; } }
    });

    forwardedEvents.add(arrowEvent);
    document.dispatchEvent(arrowEvent);
  }

  window.addEventListener("keydown", forwardAsArrow, true);
  window.addEventListener("keyup", forwardAsArrow, true);
})();
