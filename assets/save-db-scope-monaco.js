"use strict";

(function () {
  if (!window.indexedDB || !window.IDBFactory) return;

  var DATABASE_NAME = "/idbfs";
  var mapMatch = window.location.pathname.match(
    /\/maps\/(monaco-full-(?:open|barriers|closed))\//
  );
  var mapName = mapMatch ? mapMatch[1] : "monaco";
  var SCOPED_DATABASE_NAME = "/idbfs-" + mapName + "-v2";
  var originalOpen = window.IDBFactory.prototype.open;

  window.IDBFactory.prototype.open = function (name, version) {
    var scopedName = name === DATABASE_NAME ? SCOPED_DATABASE_NAME : name;
    return arguments.length > 1
      ? originalOpen.call(this, scopedName, version)
      : originalOpen.call(this, scopedName);
  };
})();
