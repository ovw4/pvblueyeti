"use strict";

(function () {
  var DATABASE_NAME = "/idbfs";
  var STORE_NAME = "FILE_DATA";
  var RESOURCE_VALUE = 1000000000;
  var MAX_UPGRADE_LEVEL = 6;
  var COMPLETE_SAVE_VERSION = "cae94b2070ca3fa8-v3";
  var SAVE_SLOT_NAMES = ["local", "cloud", "local_old", "cloud_old"];
  var completeSavePromise = window.fetch(
    "../../assets/build/complete-save.bin?v=" + COMPLETE_SAVE_VERSION
  ).then(function (response) {
    if (!response.ok) throw new Error("Complete save download failed");
    return response.arrayBuffer();
  }).then(function (buffer) {
    return new Uint8Array(buffer);
  }).catch(function (error) {
    console.warn("[complete-save] unavailable", error);
    return null;
  });

  var resources = {
    obfuscatedCoins: RESOURCE_VALUE,
    obfuscatedKeys: RESOURCE_VALUE,
    obfuscatedUnrewardedCoins: RESOURCE_VALUE,
    hoverboard: RESOURCE_VALUE,
    headstart2000: RESOURCE_VALUE,
    scorebooster: RESOURCE_VALUE
  };

  var upgrades = {
    jetpack: MAX_UPGRADE_LEVEL,
    supersneakers: MAX_UPGRADE_LEVEL,
    coinmagnet: MAX_UPGRADE_LEVEL,
    doubleMultiplier: MAX_UPGRADE_LEVEL
  };

  var onboarding = {
    runsCompletedInCurrentMissionSet: 367,
    currentMissionSet: 1,
    currentSkipForVideoMissionIndex: 0,
    completedRunCount: 455,
    ageRestrictionInputVersion: 0,
    ageRestrictionInputMonth: 12,
    ageRestrictionInputYear: 1999
  };

  function openDatabase() {
    return new Promise(function (resolve, reject) {
      var request = window.indexedDB.open(DATABASE_NAME);
      request.onerror = function () { reject(request.error); };
      request.onsuccess = function () { resolve(request.result); };
    });
  }

  function readRecords(database) {
    return new Promise(function (resolve, reject) {
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        resolve([]);
        return;
      }

      var records = [];
      var transaction = database.transaction([STORE_NAME], "readonly");
      var request = transaction.objectStore(STORE_NAME).openCursor();
      request.onerror = function () { reject(request.error); };
      request.onsuccess = function () {
        var cursor = request.result;
        if (!cursor) return;
        records.push({ key: cursor.key, value: cursor.value });
        cursor.continue();
      };
      transaction.oncomplete = function () { resolve(records); };
      transaction.onerror = function () { reject(transaction.error); };
    });
  }

  function writeRecords(database, records) {
    return new Promise(function (resolve, reject) {
      if (!records.length) {
        resolve();
        return;
      }

      var transaction = database.transaction([STORE_NAME], "readwrite");
      var store = transaction.objectStore(STORE_NAME);
      records.forEach(function (record) {
        store.put(record.value, record.key);
      });
      transaction.oncomplete = function () { resolve(); };
      transaction.onerror = function () { reject(transaction.error); };
    });
  }

  function completeSaveMarker() {
    return [
      "monaco-complete-save",
      COMPLETE_SAVE_VERSION,
      window.location.pathname
    ].join(":");
  }

  function collectSaveRecords(records, template) {
    var saveRecords = records.filter(function (record) {
      return /\/Save\/(?:cloud|cloud_old|local|local_old)$/.test(String(record.key));
    });
    if (!template || !saveRecords.length) return saveRecords;

    var keyMatch = String(saveRecords[0].key).match(
      /^(.*\/Save\/)(?:cloud|cloud_old|local|local_old)$/
    );
    if (!keyMatch) return saveRecords;

    var prefix = keyMatch[1];
    var existingKeys = {};
    saveRecords.forEach(function (record) {
      existingKeys[String(record.key)] = true;
    });

    SAVE_SLOT_NAMES.forEach(function (slotName) {
      var key = prefix + slotName;
      if (existingKeys[key]) return;
      saveRecords.push({
        key: key,
        value: {
          timestamp: Date.now(),
          mode: 33206,
          contents: new Uint8Array(template)
        }
      });
    });
    return saveRecords;
  }

  function shouldApplyCompleteSave(template, saveRecords) {
    if (!template || template.length < 32 || !saveRecords.length) return false;
    try {
      return window.localStorage.getItem(completeSaveMarker()) !== "1" ||
        !saveRecords.every(saveRecordIsReady);
    } catch (error) {
      return true;
    }
  }

  function markCompleteSaveApplied() {
    try {
      window.localStorage.setItem(completeSaveMarker(), "1");
    } catch (error) {
      console.warn("[complete-save] marker unavailable", error);
    }
  }

  function fieldNeedle(name) {
    var bytes = new Uint8Array(name.length + 2);
    bytes[0] = 0x10;
    for (var i = 0; i < name.length; i += 1) {
      bytes[i + 1] = name.charCodeAt(i);
    }
    return bytes;
  }

  function findBytes(haystack, needle) {
    outer:
    for (var i = 0; i <= haystack.length - needle.length; i += 1) {
      for (var j = 0; j < needle.length; j += 1) {
        if (haystack[i + j] !== needle[j]) continue outer;
      }
      return i;
    }
    return -1;
  }

  function patchInt32Field(bytes, view, name, value) {
    var needle = fieldNeedle(name);
    var fieldOffset = findBytes(bytes, needle);
    if (fieldOffset < 0) return false;

    var valueOffset = fieldOffset + needle.length;
    if (view.getInt32(valueOffset, true) === value) return false;
    view.setInt32(valueOffset, value, true);
    return true;
  }

  function readInt32Field(bytes, view, name) {
    var needle = fieldNeedle(name);
    var fieldOffset = findBytes(bytes, needle);
    return fieldOffset < 0
      ? null
      : view.getInt32(fieldOffset + needle.length, true);
  }

  function summarizeSaveRecord(record) {
    var contents = record.value.contents;
    var bytes = contents instanceof Uint8Array
      ? contents
      : new Uint8Array(contents || []);
    if (bytes.length < 32) return null;

    var view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    return {
      record: String(record.key).split("/").pop(),
      coins: readInt32Field(bytes, view, "obfuscatedCoins"),
      keys: readInt32Field(bytes, view, "obfuscatedKeys"),
      hoverboards: readInt32Field(bytes, view, "hoverboard"),
      headstarts: readInt32Field(bytes, view, "headstart2000"),
      scoreboosters: readInt32Field(bytes, view, "scorebooster"),
      jetpack: readInt32Field(bytes, view, "jetpack"),
      supersneakers: readInt32Field(bytes, view, "supersneakers"),
      coinmagnet: readInt32Field(bytes, view, "coinmagnet"),
      doubleMultiplier: readInt32Field(bytes, view, "doubleMultiplier")
    };
  }

  function saveRecordIsReady(record) {
    var contents = record.value.contents;
    var bytes = contents instanceof Uint8Array
      ? contents
      : new Uint8Array(contents || []);
    if (bytes.length < 32) return false;

    var view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    return [
      [resources, Object.keys(resources)],
      [upgrades, Object.keys(upgrades)],
      [onboarding, Object.keys(onboarding)]
    ].every(function (group) {
      return group[1].every(function (name) {
        return readInt32Field(bytes, view, name) === group[0][name];
      });
    });
  }

  async function patchSaveRecord(record) {
    var original = record.value.contents;
    var bytes = original instanceof Uint8Array
      ? new Uint8Array(original)
      : new Uint8Array(original || []);

    var view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    if (bytes.length < 32 || view.getInt32(0, true) !== 20) {
      return false;
    }

    var changed = false;

    Object.keys(resources).forEach(function (name) {
      changed = patchInt32Field(bytes, view, name, resources[name]) || changed;
    });
    Object.keys(upgrades).forEach(function (name) {
      changed = patchInt32Field(bytes, view, name, upgrades[name]) || changed;
    });
    Object.keys(onboarding).forEach(function (name) {
      changed = patchInt32Field(bytes, view, name, onboarding[name]) || changed;
    });

    if (!changed) return false;

    var checksum = new Uint8Array(
      await window.crypto.subtle.digest("SHA-1", bytes.slice(28))
    );
    bytes.set(checksum, 4);
    record.value.contents = bytes;
    return true;
  }

  window.applyInfiniteSave = async function () {
    if (!window.indexedDB || !window.crypto || !window.crypto.subtle) {
      return { changed: 0, available: false };
    }

    var database = await openDatabase();
    try {
      var completeSave = await completeSavePromise;
      var records = await readRecords(database);
      var saveRecords = collectSaveRecords(records, completeSave);
      var templateApplied = false;

      if (shouldApplyCompleteSave(completeSave, saveRecords)) {
        saveRecords.forEach(function (record) {
          record.value.contents = new Uint8Array(completeSave);
          record.value.timestamp = Date.now();
        });
        templateApplied = true;
      }

      var results = await Promise.all(saveRecords.map(patchSaveRecord));
      var changedRecords = saveRecords.filter(function (_, index) {
        return templateApplied || results[index];
      });
      await writeRecords(database, changedRecords);
      if (templateApplied) {
        markCompleteSaveApplied();
        console.log("[complete-save] applied", changedRecords.length);
      }
      var verified = saveRecords.map(summarizeSaveRecord).find(function (record) {
        return record && record.coins !== null;
      });
      if (verified) {
        console.log("[infinite-save] verified " + JSON.stringify(verified));
      }
      if (changedRecords.length) {
        console.log("[infinite-save] applied", changedRecords.length);
      }
      return {
        changed: changedRecords.length,
        available: saveRecords.length > 0,
        ready: saveRecords.length > 0 && saveRecords.every(saveRecordIsReady)
      };
    } finally {
      database.close();
    }
  };

  window.scheduleInfiniteSaveRefresh = function () {
    var attempts = 0;

    function refresh() {
      attempts += 1;
      window.applyInfiniteSave().then(function (result) {
        if (result.ready) {
          if (result.changed > 0 || !window.infiniteSaveReadyAtStartup) {
            window.location.reload();
            return;
          }

          window.dispatchEvent(new Event("infinite-save-ready"));
          return;
        }
        if (attempts < 240) {
          window.setTimeout(refresh, 500);
        }
      }).catch(function (error) {
        console.warn("[infinite-save] delayed apply failed", error);
        if (attempts < 240) {
          window.setTimeout(refresh, 500);
        }
      });
    }

    window.setTimeout(refresh, 500);
  };
})();
