"use strict";

(function () {
  if (!window.indexedDB || !window.IDBFactory) return;

  var DATABASE_NAME = "/idbfs";
  var pathParts = window.location.pathname.split("/").filter(Boolean);
  var mapsIndex = pathParts.lastIndexOf("maps");
  var mapName = mapsIndex >= 0 && pathParts[mapsIndex + 1]
    ? pathParts[mapsIndex + 1]
    : "training-map";
  var scopedDatabaseName = "/idbfs-training-" + mapName + "-v1";
  var originalOpen = window.IDBFactory.prototype.open;

  window.IDBFactory.prototype.open = function (name, version) {
    var scopedName = name === DATABASE_NAME ? scopedDatabaseName : name;
    return arguments.length > 1
      ? originalOpen.call(this, scopedName, version)
      : originalOpen.call(this, scopedName);
  };
})();
