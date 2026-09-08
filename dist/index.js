import { createRequire as __cr } from 'node:module'; const require = __cr(import.meta.url);
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/.pnpm/sisteransi@1.0.5/node_modules/sisteransi/src/index.js
var require_src = __commonJS({
  "node_modules/.pnpm/sisteransi@1.0.5/node_modules/sisteransi/src/index.js"(exports, module) {
    "use strict";
    var ESC2 = "\x1B";
    var CSI2 = `${ESC2}[`;
    var beep = "\x07";
    var cursor3 = {
      to(x, y) {
        if (!y) return `${CSI2}${x + 1}G`;
        return `${CSI2}${y + 1};${x + 1}H`;
      },
      move(x, y) {
        let ret = "";
        if (x < 0) ret += `${CSI2}${-x}D`;
        else if (x > 0) ret += `${CSI2}${x}C`;
        if (y < 0) ret += `${CSI2}${-y}A`;
        else if (y > 0) ret += `${CSI2}${y}B`;
        return ret;
      },
      up: (count = 1) => `${CSI2}${count}A`,
      down: (count = 1) => `${CSI2}${count}B`,
      forward: (count = 1) => `${CSI2}${count}C`,
      backward: (count = 1) => `${CSI2}${count}D`,
      nextLine: (count = 1) => `${CSI2}E`.repeat(count),
      prevLine: (count = 1) => `${CSI2}F`.repeat(count),
      left: `${CSI2}G`,
      hide: `${CSI2}?25l`,
      show: `${CSI2}?25h`,
      save: `${ESC2}7`,
      restore: `${ESC2}8`
    };
    var scroll = {
      up: (count = 1) => `${CSI2}S`.repeat(count),
      down: (count = 1) => `${CSI2}T`.repeat(count)
    };
    var erase3 = {
      screen: `${CSI2}2J`,
      up: (count = 1) => `${CSI2}1J`.repeat(count),
      down: (count = 1) => `${CSI2}J`.repeat(count),
      line: `${CSI2}2K`,
      lineEnd: `${CSI2}K`,
      lineStart: `${CSI2}1K`,
      lines(count) {
        let clear = "";
        for (let i2 = 0; i2 < count; i2++)
          clear += this.line + (i2 < count - 1 ? cursor3.up() : "");
        if (count)
          clear += cursor3.left;
        return clear;
      }
    };
    module.exports = { cursor: cursor3, scroll, erase: erase3, beep };
  }
});

// packages/cli-server/src/actions/install.js
import { execFile } from "node:child_process";
import { existsSync as existsSync2 } from "node:fs";
import path4 from "node:path";
import { promisify as promisify2 } from "node:util";

// packages/protocol/src/sync.js
var WORKSPACE_INTERNAL_DIRNAME = ".workspace";
var DEFAULT_SYNC_EXCLUSIONS = Object.freeze([
  "**/.*",
  // dotfiles (also covers .git, .cache, browser profiles…)
  "**/.*/**",
  // …and everything below dotdirs
  "**/node_modules/**",
  "**/__pycache__/**",
  "**/bower_components/**",
  "**/vendor/bundle/**",
  // ruby gems
  "**/target/debug/**",
  // cargo
  "**/target/release/**",
  "**/*.swp",
  "**/*.tmp",
  "**/Cache/**",
  "**/Caches/**",
  "**/CachedData/**"
]);
var WORKSPACE_INTERNAL_EXCLUSIONS = Object.freeze([
  WORKSPACE_INTERNAL_DIRNAME,
  `${WORKSPACE_INTERNAL_DIRNAME}/**`
]);

// packages/protocol/src/routes.js
var routes_exports = {};
__export(routes_exports, {
  agents: () => agents,
  auth: () => auth,
  contexts: () => contexts,
  ping: () => ping,
  roles: () => roles,
  schemas: () => schemas,
  workspaces: () => workspaces
});
function objectKeySegment(key) {
  return String(key || "").replace(/^\/+/, "").split("/").map(encodeURIComponent).join("/");
}
function treePathSegment(path7) {
  const p = String(path7 || "/");
  return p.startsWith("/") ? p : `/${p}`;
}
var auth = {
  login: () => "/auth/login",
  logout: () => "/auth/logout",
  me: () => "/auth/me",
  status: () => "/auth/status",
  tokens: () => "/auth/tokens",
  token: (id) => `/auth/tokens/${id}`,
  tokenRefresh: () => "/auth/token/refresh",
  devices: () => "/auth/devices",
  device: (id) => `/auth/devices/${id}`,
  deviceRegister: () => "/auth/devices/register"
};
var workspaces = {
  collection: () => "/workspaces",
  byId: (id) => `/workspaces/${id}`,
  start: (id) => `/workspaces/${id}/start`,
  stop: (id) => `/workspaces/${id}/stop`,
  status: (id) => `/workspaces/${id}/status`,
  stats: (id) => `/workspaces/${id}/stats`,
  tree: (id) => `/workspaces/${id}/tree`,
  trees: (id) => `/workspaces/${id}/trees`,
  treePath: (id, treeName, path7) => `/workspaces/${id}/trees/${encodeURIComponent(treeName)}/path${treePathSegment(path7)}`,
  /** Per-workspace pinned tree paths (task containers). */
  pins: (id) => `/workspaces/${id}/pins`,
  pin: (id, pinId) => `/workspaces/${id}/pins/${encodeURIComponent(pinId)}`,
  pinsOrder: (id) => `/workspaces/${id}/pins/order`,
  documents: (id) => `/workspaces/${id}/documents`,
  /** Soft-remove (documents stay in the DB, drop from the context). */
  documentsRemove: (id) => `/workspaces/${id}/documents/remove`,
  /** GET one tree by name/id. Ids interpolate raw — pre-encode if needed. */
  treeByName: (id, treeNameOrId) => `/workspaces/${id}/trees/${treeNameOrId}`,
  blobs: (id) => `/workspaces/${id}/blobs`,
  dotfiles: (id) => `/workspaces/${id}/dotfiles`,
  dotfilesStatus: (id) => `/workspaces/${id}/dotfiles/status`,
  dotfilesInit: (id) => `/workspaces/${id}/dotfiles/init`,
  backends: (id, driver = null) => `/workspaces/${id}/backends${driver ? `/${encodeURIComponent(driver)}` : ""}`,
  backend: (id, driver, address) => `/workspaces/${id}/backends/${encodeURIComponent(driver)}/${encodeURIComponent(address)}`,
  backendSync: (id, driver, address) => `${workspaces.backend(id, driver, address)}/sync`,
  backendUsage: (id, driver, address) => `${workspaces.backend(id, driver, address)}/usage`,
  backendDocuments: (id, driver, address) => `${workspaces.backend(id, driver, address)}/documents`,
  // Keyed objects + change feed on a path-addressed storage backend — the
  // device-mirror protocol (canvas-server docs/sync-protocol.md).
  backendObjects: (id, driver, address) => `${workspaces.backend(id, driver, address)}/objects`,
  backendObject: (id, driver, address, key) => `${workspaces.backend(id, driver, address)}/objects/${objectKeySegment(key)}`,
  backendObjectRename: (id, driver, address) => `${workspaces.backend(id, driver, address)}/objects/rename`,
  backendChanges: (id, driver, address) => `${workspaces.backend(id, driver, address)}/changes`,
  mirrors: (id) => `/workspaces/${id}/mirrors`,
  mirror: (id, deviceId) => `/workspaces/${id}/mirrors/${encodeURIComponent(deviceId)}`,
  mirrorStatus: (id, deviceId) => `${workspaces.mirror(id, deviceId)}/status`,
  syncConflicts: (id) => `/workspaces/${id}/sync/conflicts`,
  syncConflictResolve: (id, docId) => `/workspaces/${id}/sync/conflicts/${docId}/resolve`,
  hooks: (id) => `/workspaces/${id}/hooks`,
  hook: (id, hookPath) => `/workspaces/${id}/hooks/${hookPath}`,
  hookRuns: (id) => `/workspaces/${id}/hooks/runs`,
  hookReplay: (id, runId) => `/workspaces/${id}/hooks/runs/${runId}/replay`,
  hooksExplain: (id) => `/workspaces/${id}/hooks/explain`,
  hooksBackfill: (id) => `/workspaces/${id}/hooks/backfill`
};
var contexts = {
  collection: () => "/contexts",
  byId: (id) => `/contexts/${id}`,
  tree: (id) => `/contexts/${id}/tree`,
  treePaths: (id) => `/contexts/${id}/tree/paths`,
  documents: (id) => `/contexts/${id}/documents`,
  document: (id, docId) => `/contexts/${id}/documents/${docId}`,
  /** Soft-remove (documents stay in the DB, drop from the context). */
  documentsRemove: (id) => `/contexts/${id}/documents/remove`,
  blobs: (id) => `/contexts/${id}/blobs`,
  dotfiles: (id) => `/contexts/${id}/dotfiles`,
  url: (id) => `/contexts/${id}/url`
};
var agents = {
  collection: () => "/agents",
  byId: (id) => `/agents/${id}`,
  status: (id) => `/agents/${id}/status`,
  prompt: (id) => `/agents/${id}/prompt`
};
var roles = {
  collection: () => "/roles",
  byId: (id) => `/roles/${id}`
};
var schemas = {
  collection: () => "/schemas",
  /** @param {string} id hierarchical schema id, e.g. 'data/schema/note' — raw */
  descriptor: (id) => `/schemas/${id}`,
  /** Derived JSON Schema variant of the same id. */
  json: (id) => `/schemas/${id}.json`
};
var ping = () => "/ping";

// packages/api-client/src/errors.js
var CanvasError = class extends Error {
  constructor(message, { code, statusCode, status, cause } = {}) {
    super(message);
    this.name = "CanvasError";
    this.code = code || "CANVAS_ERROR";
    this.statusCode = statusCode ?? status;
    this.status = status ?? statusCode;
    if (cause) this.cause = cause;
  }
};

// packages/api-client/src/api/workspaces.js
var ws = routes_exports.workspaces;

// packages/api-client/src/api/contexts.js
var ctx = routes_exports.contexts;

// node_modules/.pnpm/@clack+core@1.4.3/node_modules/@clack/core/dist/index.mjs
import { stdout, stdin } from "node:process";
import * as l from "node:readline";

// node_modules/.pnpm/fast-string-truncated-width@3.0.3/node_modules/fast-string-truncated-width/dist/utils.js
var getCodePointsLength = /* @__PURE__ */ (() => {
  const SURROGATE_PAIR_RE = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
  return (input) => {
    let surrogatePairsNr = 0;
    SURROGATE_PAIR_RE.lastIndex = 0;
    while (SURROGATE_PAIR_RE.test(input)) {
      surrogatePairsNr += 1;
    }
    return input.length - surrogatePairsNr;
  };
})();
var isFullWidth = (x) => {
  return x === 12288 || x >= 65281 && x <= 65376 || x >= 65504 && x <= 65510;
};
var isWideNotCJKTNotEmoji = (x) => {
  return x === 8987 || x === 9001 || x >= 12272 && x <= 12287 || x >= 12289 && x <= 12350 || x >= 12441 && x <= 12543 || x >= 12549 && x <= 12591 || x >= 12593 && x <= 12686 || x >= 12688 && x <= 12771 || x >= 12783 && x <= 12830 || x >= 12832 && x <= 12871 || x >= 12880 && x <= 19903 || x >= 65040 && x <= 65049 || x >= 65072 && x <= 65106 || x >= 65108 && x <= 65126 || x >= 65128 && x <= 65131 || x >= 127488 && x <= 127490 || x >= 127504 && x <= 127547 || x >= 127552 && x <= 127560 || x >= 131072 && x <= 196605 || x >= 196608 && x <= 262141;
};

// node_modules/.pnpm/fast-string-truncated-width@3.0.3/node_modules/fast-string-truncated-width/dist/index.js
var ANSI_RE = /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]|\u001b\]8;[^;]*;.*?(?:\u0007|\u001b\u005c)/y;
var CONTROL_RE = /[\x00-\x08\x0A-\x1F\x7F-\x9F]{1,1000}/y;
var CJKT_WIDE_RE = /(?:(?![\uFF61-\uFF9F\uFF00-\uFFEF])[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}\p{Script=Tangut}]){1,1000}/yu;
var TAB_RE = /\t{1,1000}/y;
var EMOJI_RE = new RegExp("[\\u{1F1E6}-\\u{1F1FF}]{2}|\\u{1F3F4}[\\u{E0061}-\\u{E007A}]{2}[\\u{E0030}-\\u{E0039}\\u{E0061}-\\u{E007A}]{1,3}\\u{E007F}|(?:\\p{Emoji}\\uFE0F\\u20E3?|\\p{Emoji_Modifier_Base}\\p{Emoji_Modifier}?|\\p{Emoji_Presentation})(?:\\u200D(?:\\p{Emoji_Modifier_Base}\\p{Emoji_Modifier}?|\\p{Emoji_Presentation}|\\p{Emoji}\\uFE0F\\u20E3?))*", "yu");
var LATIN_RE = /(?:[\x20-\x7E\xA0-\xFF](?!\uFE0F)){1,1000}/y;
var MODIFIER_RE = new RegExp("\\p{M}+", "gu");
var NO_TRUNCATION = { limit: Infinity, ellipsis: "" };
var getStringTruncatedWidth = (input, truncationOptions = {}, widthOptions = {}) => {
  const LIMIT = truncationOptions.limit ?? Infinity;
  const ELLIPSIS = truncationOptions.ellipsis ?? "";
  const ELLIPSIS_WIDTH = truncationOptions?.ellipsisWidth ?? (ELLIPSIS ? getStringTruncatedWidth(ELLIPSIS, NO_TRUNCATION, widthOptions).width : 0);
  const ANSI_WIDTH = 0;
  const CONTROL_WIDTH = widthOptions.controlWidth ?? 0;
  const TAB_WIDTH = widthOptions.tabWidth ?? 8;
  const EMOJI_WIDTH = widthOptions.emojiWidth ?? 2;
  const FULL_WIDTH_WIDTH = 2;
  const REGULAR_WIDTH = widthOptions.regularWidth ?? 1;
  const WIDE_WIDTH = widthOptions.wideWidth ?? FULL_WIDTH_WIDTH;
  const PARSE_BLOCKS = [
    [LATIN_RE, REGULAR_WIDTH],
    [ANSI_RE, ANSI_WIDTH],
    [CONTROL_RE, CONTROL_WIDTH],
    [TAB_RE, TAB_WIDTH],
    [EMOJI_RE, EMOJI_WIDTH],
    [CJKT_WIDE_RE, WIDE_WIDTH]
  ];
  let indexPrev = 0;
  let index = 0;
  let length = input.length;
  let lengthExtra = 0;
  let truncationEnabled = false;
  let truncationIndex = length;
  let truncationLimit = Math.max(0, LIMIT - ELLIPSIS_WIDTH);
  let unmatchedStart = 0;
  let unmatchedEnd = 0;
  let width = 0;
  let widthExtra = 0;
  outer: while (true) {
    if (unmatchedEnd > unmatchedStart || index >= length && index > indexPrev) {
      const unmatched = input.slice(unmatchedStart, unmatchedEnd) || input.slice(indexPrev, index);
      lengthExtra = 0;
      for (const char of unmatched.replaceAll(MODIFIER_RE, "")) {
        const codePoint = char.codePointAt(0) || 0;
        if (isFullWidth(codePoint)) {
          widthExtra = FULL_WIDTH_WIDTH;
        } else if (isWideNotCJKTNotEmoji(codePoint)) {
          widthExtra = WIDE_WIDTH;
        } else {
          widthExtra = REGULAR_WIDTH;
        }
        if (width + widthExtra > truncationLimit) {
          truncationIndex = Math.min(truncationIndex, Math.max(unmatchedStart, indexPrev) + lengthExtra);
        }
        if (width + widthExtra > LIMIT) {
          truncationEnabled = true;
          break outer;
        }
        lengthExtra += char.length;
        width += widthExtra;
      }
      unmatchedStart = unmatchedEnd = 0;
    }
    if (index >= length) {
      break outer;
    }
    for (let i2 = 0, l2 = PARSE_BLOCKS.length; i2 < l2; i2++) {
      const [BLOCK_RE, BLOCK_WIDTH] = PARSE_BLOCKS[i2];
      BLOCK_RE.lastIndex = index;
      if (BLOCK_RE.test(input)) {
        lengthExtra = BLOCK_RE === CJKT_WIDE_RE ? getCodePointsLength(input.slice(index, BLOCK_RE.lastIndex)) : BLOCK_RE === EMOJI_RE ? 1 : BLOCK_RE.lastIndex - index;
        widthExtra = lengthExtra * BLOCK_WIDTH;
        if (width + widthExtra > truncationLimit) {
          truncationIndex = Math.min(truncationIndex, index + Math.floor((truncationLimit - width) / BLOCK_WIDTH));
        }
        if (width + widthExtra > LIMIT) {
          truncationEnabled = true;
          break outer;
        }
        width += widthExtra;
        unmatchedStart = indexPrev;
        unmatchedEnd = index;
        index = indexPrev = BLOCK_RE.lastIndex;
        continue outer;
      }
    }
    index += 1;
  }
  return {
    width: truncationEnabled ? truncationLimit : width,
    index: truncationEnabled ? truncationIndex : length,
    truncated: truncationEnabled,
    ellipsed: truncationEnabled && LIMIT >= ELLIPSIS_WIDTH
  };
};
var dist_default = getStringTruncatedWidth;

// node_modules/.pnpm/fast-string-width@3.0.2/node_modules/fast-string-width/dist/index.js
var NO_TRUNCATION2 = {
  limit: Infinity,
  ellipsis: "",
  ellipsisWidth: 0
};
var fastStringWidth = (input, options = {}) => {
  return dist_default(input, NO_TRUNCATION2, options).width;
};
var dist_default2 = fastStringWidth;

// node_modules/.pnpm/fast-wrap-ansi@0.2.2/node_modules/fast-wrap-ansi/lib/main.js
var ESC = "\x1B";
var CSI = "\x9B";
var END_CODE = 39;
var ANSI_ESCAPE_BELL = "\x07";
var ANSI_CSI = "[";
var ANSI_OSC = "]";
var ANSI_SGR_TERMINATOR = "m";
var ANSI_ESCAPE_LINK = `${ANSI_OSC}8;;`;
var GROUP_REGEX = new RegExp(`(?:\\${ANSI_CSI}(?<code>\\d+)m|\\${ANSI_ESCAPE_LINK}(?<uri>.*)${ANSI_ESCAPE_BELL})`, "y");
var getClosingCode = (openingCode) => {
  if (openingCode >= 30 && openingCode <= 37)
    return 39;
  if (openingCode >= 90 && openingCode <= 97)
    return 39;
  if (openingCode >= 40 && openingCode <= 47)
    return 49;
  if (openingCode >= 100 && openingCode <= 107)
    return 49;
  if (openingCode === 1 || openingCode === 2)
    return 22;
  if (openingCode === 3)
    return 23;
  if (openingCode === 4)
    return 24;
  if (openingCode === 7)
    return 27;
  if (openingCode === 8)
    return 28;
  if (openingCode === 9)
    return 29;
  if (openingCode === 0)
    return 0;
  return void 0;
};
var wrapAnsiCode = (code) => `${ESC}${ANSI_CSI}${code}${ANSI_SGR_TERMINATOR}`;
var wrapAnsiHyperlink = (url) => `${ESC}${ANSI_ESCAPE_LINK}${url}${ANSI_ESCAPE_BELL}`;
var wrapWord = (rows, word, columns) => {
  const characters = word[Symbol.iterator]();
  let isInsideEscape = false;
  let isInsideLinkEscape = false;
  let lastRow = rows.at(-1);
  let visible = lastRow === void 0 ? 0 : dist_default2(lastRow);
  let currentCharacter = characters.next();
  let nextCharacter = characters.next();
  let rawCharacterIndex = 0;
  while (!currentCharacter.done) {
    const character = currentCharacter.value;
    const characterLength = dist_default2(character);
    if (visible + characterLength <= columns) {
      rows[rows.length - 1] += character;
    } else {
      rows.push(character);
      visible = 0;
    }
    if (character === ESC || character === CSI) {
      isInsideEscape = true;
      isInsideLinkEscape = word.startsWith(ANSI_ESCAPE_LINK, rawCharacterIndex + 1);
    }
    if (isInsideEscape) {
      if (isInsideLinkEscape) {
        if (character === ANSI_ESCAPE_BELL) {
          isInsideEscape = false;
          isInsideLinkEscape = false;
        }
      } else if (character === ANSI_SGR_TERMINATOR) {
        isInsideEscape = false;
      }
    } else {
      visible += characterLength;
      if (visible === columns && !nextCharacter.done) {
        rows.push("");
        visible = 0;
      }
    }
    currentCharacter = nextCharacter;
    nextCharacter = characters.next();
    rawCharacterIndex += character.length;
  }
  lastRow = rows.at(-1);
  if (!visible && lastRow !== void 0 && lastRow.length && rows.length > 1) {
    rows[rows.length - 2] += rows.pop();
  }
};
var stringVisibleTrimSpacesRight = (string) => {
  const words = string.split(" ");
  let last = words.length;
  while (last) {
    if (dist_default2(words[last - 1])) {
      break;
    }
    last--;
  }
  if (last === words.length) {
    return string;
  }
  return words.slice(0, last).join(" ") + words.slice(last).join("");
};
var exec = (string, columns, options = {}) => {
  if (options.trim !== false && string.trim() === "") {
    return "";
  }
  let returnValue = "";
  let escapeCode;
  let escapeUrl;
  const words = string.split(" ");
  let rows = [""];
  let rowLength = 0;
  for (let index = 0; index < words.length; index++) {
    const word = words[index];
    if (options.trim !== false) {
      const row = rows.at(-1) ?? "";
      const trimmed = row.trimStart();
      if (row.length !== trimmed.length) {
        rows[rows.length - 1] = trimmed;
        rowLength = dist_default2(trimmed);
      }
    }
    if (index !== 0) {
      if (rowLength >= columns && (options.wordWrap === false || options.trim === false)) {
        rows.push("");
        rowLength = 0;
      }
      if (rowLength || options.trim === false) {
        rows[rows.length - 1] += " ";
        rowLength++;
      }
    }
    const wordLength = dist_default2(word);
    if (options.hard && wordLength > columns) {
      const remainingColumns = columns - rowLength;
      const breaksStartingThisLine = 1 + Math.floor((wordLength - remainingColumns - 1) / columns);
      const breaksStartingNextLine = Math.floor((wordLength - 1) / columns);
      if (breaksStartingNextLine < breaksStartingThisLine) {
        rows.push("");
      }
      wrapWord(rows, word, columns);
      rowLength = dist_default2(rows.at(-1) ?? "");
      continue;
    }
    if (rowLength + wordLength > columns && rowLength && wordLength) {
      if (options.wordWrap === false && rowLength < columns) {
        wrapWord(rows, word, columns);
        rowLength = dist_default2(rows.at(-1) ?? "");
        continue;
      }
      rows.push("");
      rowLength = 0;
    }
    if (rowLength + wordLength > columns && options.wordWrap === false) {
      wrapWord(rows, word, columns);
      rowLength = dist_default2(rows.at(-1) ?? "");
      continue;
    }
    rows[rows.length - 1] += word;
    rowLength += wordLength;
  }
  if (options.trim !== false) {
    rows = rows.map((row) => stringVisibleTrimSpacesRight(row));
  }
  const preString = rows.join("\n");
  let inSurrogate = false;
  for (let i2 = 0; i2 < preString.length; i2++) {
    const character = preString[i2];
    returnValue += character;
    if (!inSurrogate) {
      inSurrogate = character >= "\uD800" && character <= "\uDBFF";
      if (inSurrogate) {
        continue;
      }
    } else {
      inSurrogate = false;
    }
    if (character === ESC || character === CSI) {
      GROUP_REGEX.lastIndex = i2 + 1;
      const groupsResult = GROUP_REGEX.exec(preString);
      const groups = groupsResult?.groups;
      if (groups?.code !== void 0) {
        const code = Number.parseFloat(groups.code);
        escapeCode = code === END_CODE ? void 0 : code;
      } else if (groups?.uri !== void 0) {
        escapeUrl = groups.uri.length === 0 ? void 0 : groups.uri;
      }
    }
    if (preString[i2 + 1] === "\n") {
      if (escapeUrl) {
        returnValue += wrapAnsiHyperlink("");
      }
      const closingCode = escapeCode ? getClosingCode(escapeCode) : void 0;
      if (escapeCode && closingCode) {
        returnValue += wrapAnsiCode(closingCode);
      }
    } else if (character === "\n") {
      if (escapeCode && getClosingCode(escapeCode)) {
        returnValue += wrapAnsiCode(escapeCode);
      }
      if (escapeUrl) {
        returnValue += wrapAnsiHyperlink(escapeUrl);
      }
    }
  }
  return returnValue;
};
var CRLF_OR_LF = /\r?\n/;
function wrapAnsi(string, columns, options) {
  return String(string).normalize().split(CRLF_OR_LF).map((line) => exec(line, columns, options)).join("\n");
}

// node_modules/.pnpm/@clack+core@1.4.3/node_modules/@clack/core/dist/index.mjs
var import_sisteransi = __toESM(require_src(), 1);
import { ReadStream } from "node:tty";
var a$1 = ["up", "down", "left", "right", "space", "enter", "cancel"];
var t = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];
var settings = {
  actions: new Set(a$1),
  aliases: /* @__PURE__ */ new Map([
    // vim support
    ["k", "up"],
    ["j", "down"],
    ["h", "left"],
    ["l", "right"],
    ["", "cancel"],
    // opinionated defaults!
    ["escape", "cancel"]
  ]),
  messages: {
    cancel: "Canceled",
    error: "Something went wrong"
  },
  withGuide: true,
  date: {
    monthNames: [...t],
    messages: {
      required: "Please enter a valid date",
      invalidMonth: "There are only 12 months in a year",
      invalidDay: (n2, e) => `There are only ${n2} days in ${e}`,
      afterMin: (n2) => `Date must be on or after ${n2.toISOString().slice(0, 10)}`,
      beforeMax: (n2) => `Date must be on or before ${n2.toISOString().slice(0, 10)}`
    }
  }
};
function isActionKey(n2, e) {
  if (typeof n2 == "string")
    return settings.aliases.get(n2) === e;
  for (const s of n2)
    if (s !== void 0 && isActionKey(s, e))
      return true;
  return false;
}
var R = globalThis.process.platform.startsWith("win");
function block({
  input: e = stdin,
  output: r2 = stdout,
  overwrite: o = true,
  hideCursor: t2 = true
} = {}) {
  const s = l.createInterface({
    input: e,
    output: r2,
    prompt: "",
    tabSize: 1
  });
  l.emitKeypressEvents(e, s), e instanceof ReadStream && e.isTTY && e.setRawMode(true);
  const n2 = (f, { name: a2, sequence: p }) => {
    const c = String(f);
    if (isActionKey([c, a2, p], "cancel")) {
      t2 && r2.write(import_sisteransi.cursor.show), process.exit(0);
      return;
    }
    if (!o) return;
    const i2 = a2 === "return" ? 0 : -1, m = a2 === "return" ? -1 : 0;
    l.moveCursor(r2, i2, m, () => {
      l.clearLine(r2, 1, () => {
        e.once("keypress", n2);
      });
    });
  };
  return t2 && r2.write(import_sisteransi.cursor.hide), e.once("keypress", n2), () => {
    e.off("keypress", n2), t2 && r2.write(import_sisteransi.cursor.show), e instanceof ReadStream && e.isTTY && !R && e.setRawMode(false), s.terminal = false, s.close();
  };
}
var getColumns = (e) => "columns" in e && typeof e.columns == "number" ? e.columns : 80;

// node_modules/.pnpm/@clack+prompts@1.7.0/node_modules/@clack/prompts/dist/index.mjs
import { styleText, stripVTControlCharacters } from "node:util";
import process$1 from "node:process";
var import_sisteransi2 = __toESM(require_src(), 1);
function isUnicodeSupported() {
  if (process$1.platform !== "win32") {
    return process$1.env.TERM !== "linux";
  }
  return Boolean(process$1.env.CI) || Boolean(process$1.env.WT_SESSION) || Boolean(process$1.env.TERMINUS_SUBLIME) || process$1.env.ConEmuTask === "{cmd::Cmder}" || process$1.env.TERM_PROGRAM === "Terminus-Sublime" || process$1.env.TERM_PROGRAM === "vscode" || process$1.env.TERM === "xterm-256color" || process$1.env.TERM === "alacritty" || process$1.env.TERMINAL_EMULATOR === "JetBrains-JediTerm";
}
var unicode = isUnicodeSupported();
var isCI = () => process.env.CI === "true";
var unicodeOr = (o, e) => unicode ? o : e;
var S_STEP_ACTIVE = unicodeOr("\u25C6", "*");
var S_STEP_CANCEL = unicodeOr("\u25A0", "x");
var S_STEP_ERROR = unicodeOr("\u25B2", "x");
var S_STEP_SUBMIT = unicodeOr("\u25C7", "o");
var S_BAR_START = unicodeOr("\u250C", "T");
var S_BAR = unicodeOr("\u2502", "|");
var S_BAR_END = unicodeOr("\u2514", "\u2014");
var S_BAR_START_RIGHT = unicodeOr("\u2510", "T");
var S_BAR_END_RIGHT = unicodeOr("\u2518", "\u2014");
var S_RADIO_ACTIVE = unicodeOr("\u25CF", ">");
var S_RADIO_INACTIVE = unicodeOr("\u25CB", " ");
var S_CHECKBOX_ACTIVE = unicodeOr("\u25FB", "[\u2022]");
var S_CHECKBOX_SELECTED = unicodeOr("\u25FC", "[+]");
var S_CHECKBOX_INACTIVE = unicodeOr("\u25FB", "[ ]");
var S_PASSWORD_MASK = unicodeOr("\u25AA", "\u2022");
var S_BAR_H = unicodeOr("\u2500", "-");
var S_CORNER_TOP_RIGHT = unicodeOr("\u256E", "+");
var S_CONNECT_LEFT = unicodeOr("\u251C", "+");
var S_CORNER_BOTTOM_RIGHT = unicodeOr("\u256F", "+");
var S_CORNER_BOTTOM_LEFT = unicodeOr("\u2570", "+");
var S_CORNER_TOP_LEFT = unicodeOr("\u256D", "+");
var S_INFO = unicodeOr("\u25CF", "\u2022");
var S_SUCCESS = unicodeOr("\u25C6", "*");
var S_WARN = unicodeOr("\u25B2", "!");
var S_ERROR = unicodeOr("\u25A0", "x");
var MULTISELECT_INSTRUCTIONS = [
  `${styleText("dim", "\u2191/\u2193")} to navigate`,
  `${styleText("dim", "Space:")} select`,
  `${styleText("dim", "Enter:")} confirm`
];
var W = (l2) => styleText("magenta", l2);
var spinner = ({
  indicator: l2 = "dots",
  onCancel: h2,
  output: n2 = process.stdout,
  cancelMessage: G,
  errorMessage: O,
  frames: E = unicode ? ["\u25D2", "\u25D0", "\u25D3", "\u25D1"] : ["\u2022", "o", "O", "0"],
  delay: F = unicode ? 80 : 120,
  signal: m,
  ...I
} = {}) => {
  const u3 = isCI();
  let M, T, d = false, S = false, s = "", p, w = performance.now();
  const x = getColumns(n2), k = I?.styleFrame ?? W, g = (e) => {
    const r2 = e > 1 ? O ?? settings.messages.error : G ?? settings.messages.cancel;
    S = e === 1, d && (a2(r2, e), S && typeof h2 == "function" && h2());
  }, f = () => g(2), i2 = () => g(1), A = () => {
    process.on("uncaughtExceptionMonitor", f), process.on("unhandledRejection", f), process.on("SIGINT", i2), process.on("SIGTERM", i2), process.on("exit", g), m && m.addEventListener("abort", i2);
  }, H = () => {
    process.removeListener("uncaughtExceptionMonitor", f), process.removeListener("unhandledRejection", f), process.removeListener("SIGINT", i2), process.removeListener("SIGTERM", i2), process.removeListener("exit", g), m && m.removeEventListener("abort", i2);
  }, y = () => {
    if (p === void 0) return;
    u3 && n2.write(`
`);
    const r2 = wrapAnsi(p, x, {
      hard: true,
      trim: false
    }).split(`
`);
    r2.length > 1 && n2.write(import_sisteransi2.cursor.up(r2.length - 1)), n2.write(import_sisteransi2.cursor.to(0)), n2.write(import_sisteransi2.erase.down());
  }, C = (e) => e.replace(/\.+$/, ""), _ = (e) => {
    const r2 = (performance.now() - e) / 1e3, t2 = Math.floor(r2 / 60), o = Math.floor(r2 % 60);
    return t2 > 0 ? `[${t2}m ${o}s]` : `[${o}s]`;
  }, N = I.withGuide ?? settings.withGuide, P = (e = "") => {
    d = true, M = block({ output: n2 }), s = C(e), w = performance.now(), N && n2.write(`${styleText("gray", S_BAR)}
`);
    let r2 = 0, t2 = 0;
    A(), T = setInterval(() => {
      if (u3 && s === p)
        return;
      y(), p = s;
      const o = k(E[r2]);
      let v;
      if (u3)
        v = `${o}  ${s}...`;
      else if (l2 === "timer")
        v = `${o}  ${s} ${_(w)}`;
      else {
        const B = ".".repeat(Math.floor(t2)).slice(0, 3);
        v = `${o}  ${s}${B}`;
      }
      const j = wrapAnsi(v, x, {
        hard: true,
        trim: false
      });
      n2.write(j), r2 = r2 + 1 < E.length ? r2 + 1 : 0, t2 = t2 < 4 ? t2 + 0.125 : 0;
    }, F);
  }, a2 = (e = "", r2 = 0, t2 = false) => {
    if (!d) return;
    d = false, clearInterval(T), y();
    const o = r2 === 0 ? styleText("green", S_STEP_SUBMIT) : r2 === 1 ? styleText("red", S_STEP_CANCEL) : styleText("red", S_STEP_ERROR);
    s = e ?? s, t2 || (l2 === "timer" ? n2.write(`${o}  ${s} ${_(w)}
`) : n2.write(`${o}  ${s}
`)), H(), M();
  };
  return {
    start: P,
    stop: (e = "") => a2(e, 0),
    message: (e = "") => {
      s = C(e ?? s);
    },
    cancel: (e = "") => a2(e, 1),
    error: (e = "") => a2(e, 2),
    clear: () => a2("", 0, true),
    get isCancelled() {
      return S;
    }
  };
};
var u2 = {
  light: unicodeOr("\u2500", "-"),
  heavy: unicodeOr("\u2501", "="),
  block: unicodeOr("\u2588", "#")
};
var SELECT_INSTRUCTIONS = [
  `${styleText("dim", "\u2191/\u2193")} to navigate`,
  `${styleText("dim", "Enter:")} confirm`
];
var i = `${styleText("gray", S_BAR)}  `;

// packages/cli-host/src/prompt.js
var isTTY = () => Boolean(process.stdin.isTTY && process.stdout.isTTY);
function spinner2() {
  if (isTTY()) return spinner();
  return {
    start: (m) => {
      if (m) process.stdout.write(`${m}
`);
    },
    stop: (m) => {
      if (m) process.stdout.write(`${m}
`);
    },
    message: () => {
    }
  };
}

// packages/cli-server/src/lib/pm2.js
import { existsSync, readFileSync } from "node:fs";
import path3 from "node:path";

// packages/cli-host/src/paths.js
import os from "node:os";
import path from "node:path";
function userHome() {
  const mode = process.env.CANVAS_SERVER_MODE || process.env.SERVER_MODE || "user";
  const home = process.env.CANVAS_SERVER_HOME || process.env.SERVER_HOME || process.cwd();
  if (mode !== "user") return path.join(home, "users");
  return process.platform === "win32" ? path.join(os.homedir(), "Canvas") : path.join(os.homedir(), ".canvas");
}
var CANVAS_HOME = process.env.CANVAS_USER_HOME || userHome();
var DIR_CONFIG = path.join(CANVAS_HOME, "config");
var DIR_DB = path.join(CANVAS_HOME, "db");
var DIR_DATA = path.join(CANVAS_HOME, "data");
var DIR_CACHE = path.join(CANVAS_HOME, "cache");
var DIR_VAR = path.join(CANVAS_HOME, "var");
var FILE_REMOTES = path.join(DIR_CONFIG, "remotes.json");
var FILE_SESSION = path.join(DIR_CONFIG, "cli-session.json");
var FILE_ALIASES = path.join(DIR_CONFIG, "cli-aliases.json");
var FILE_CONFIG = path.join(DIR_CONFIG, "cli.json");
var FILE_CONTEXTS = path.join(DIR_DB, "contexts.json");
var FILE_WORKSPACES = path.join(DIR_DB, "workspaces.json");
var FILE_AGENTS = path.join(DIR_DB, "agents.json");
var FILE_DOTFILES = path.join(DIR_DB, "dotfiles.json");

// packages/cli-host/src/pm2.js
import { exec as exec2 } from "node:child_process";
import { promisify } from "node:util";
import { mkdirSync, writeFileSync } from "node:fs";
import path2 from "node:path";
var execAsync = promisify(exec2);
async function hasPM2() {
  try {
    await execAsync("pm2 --version");
    return true;
  } catch {
    return false;
  }
}
async function getProcessInfo(name) {
  try {
    const { stdout: stdout2 } = await execAsync("pm2 jlist");
    const procs = JSON.parse(stdout2);
    return procs.find((p) => p.name === name) || null;
  } catch {
    return null;
  }
}
function pm2Env(extra = {}) {
  const keep = /^(CANVAS_|PATH$|HOME$|USER$|LANG$|LC_|XDG_|TMPDIR$|NODE_|LOG_LEVEL$|DEBUG$)/;
  const env = {};
  for (const [k, v] of Object.entries(process.env)) if (keep.test(k) && v != null) env[k] = v;
  return { ...env, ...extra };
}
async function pm2Start(cfg) {
  const dir = path2.join(DIR_VAR, "pm2");
  mkdirSync(dir, { recursive: true });
  const file = path2.join(dir, `${cfg.name}.config.json`);
  writeFileSync(file, JSON.stringify({ apps: [cfg] }, null, 2));
  await execAsync(`pm2 start "${file}"`);
  return file;
}
function formatUptime(ts) {
  if (!ts) return "N/A";
  const u3 = Date.now() - ts;
  const s = Math.floor(u3 / 1e3), m = Math.floor(s / 60), h2 = Math.floor(m / 60), d = Math.floor(h2 / 24);
  if (d > 0) return `${d}d ${h2 % 24}h ${m % 60}m`;
  if (h2 > 0) return `${h2}h ${m % 60}m`;
  if (m > 0) return `${m}m ${s % 60}s`;
  return `${s}s`;
}
function formatMemory(b) {
  if (!b) return "N/A";
  const sizes = ["B", "KB", "MB", "GB"];
  const i2 = Math.floor(Math.log(b) / Math.log(1024));
  return `${Math.round(b / Math.pow(1024, i2) * 100) / 100} ${sizes[i2]}`;
}

// packages/cli-server/src/lib/pm2.js
var PM2_APP = "canvas-server";
var SERVER_HOME = path3.join(CANVAS_HOME, "server");
var SERVER_REPO = process.env.CANVAS_SERVER_GIT || "https://github.com/canvas-ui/canvas-server.git";
function findServerRoot() {
  const candidates = [
    process.env.CANVAS_SERVER_ROOT,
    SERVER_HOME,
    // <container>/canvas-server next to the monorepo (dev)
    path3.resolve(path3.dirname(new URL(import.meta.url).pathname), "../../../../../canvas-server")
  ].filter(Boolean);
  for (const c of candidates) if (isValidRoot(path3.resolve(c))) return path3.resolve(c);
  return null;
}
function isValidRoot(dir) {
  try {
    const pkg = path3.join(dir, "package.json");
    if (!existsSync(pkg) || !existsSync(path3.join(dir, "src/init.js"))) return false;
    const j = JSON.parse(readFileSync(pkg, "utf8"));
    return j.name === "canvas-server" || j.name === "@canvas/server" || j.name === "@augmentd-labs/canvas-server";
  } catch {
    return false;
  }
}

// packages/cli-server/src/actions/install.js
var execFileAsync = promisify2(execFile);
var install_default = {
  name: "install",
  description: `Clone (or update) canvas-server into ${SERVER_HOME} and install its dependencies`,
  flags: { branch: "string" },
  async run({ flags, io }) {
    const existing = findServerRoot();
    if (existing && existing !== SERVER_HOME) io.info(`A checkout already exists at ${existing} (CANVAS_SERVER_ROOT / dev); installing the managed one anyway`);
    const s = spinner2();
    const fresh = !existsSync2(path4.join(SERVER_HOME, ".git"));
    s.start(fresh ? `Cloning ${SERVER_REPO} into ${SERVER_HOME}\u2026` : `Updating ${SERVER_HOME}\u2026`);
    try {
      if (fresh) await execFileAsync("git", ["clone", "--depth", "1", ...flags.branch ? ["--branch", flags.branch] : [], SERVER_REPO, SERVER_HOME], { timeout: 3e5, maxBuffer: 16 * 1024 * 1024 });
      else await execFileAsync("git", ["pull", "--ff-only"], { cwd: SERVER_HOME, timeout: 3e5, maxBuffer: 16 * 1024 * 1024 });
      s.message("Installing dependencies (npm install, a few minutes)\u2026");
      await execFileAsync(process.platform === "win32" ? "npm.cmd" : "npm", ["install", "--no-audit", "--no-fund"], { cwd: SERVER_HOME, timeout: 12e5, maxBuffer: 64 * 1024 * 1024, shell: process.platform === "win32" });
    } catch (err) {
      s.stop("canvas-server install failed");
      const tail = String(err.stderr || err.message || "").trim().split("\n").filter((l2) => !/TAR_ENTRY_ERROR|deprecated|EBADENGINE/.test(l2)).slice(-4).join("\n");
      throw new CanvasError(`${tail}
Finish by hand: git clone ${SERVER_REPO} ${SERVER_HOME} && cd ${SERVER_HOME} && npm install`);
    }
    s.stop(`canvas-server ready at ${SERVER_HOME}`);
    io.success("Start it with `canvas server start`");
  }
};

// packages/cli-server/src/actions/logs.js
import { spawn } from "node:child_process";
var logs_default = {
  name: "logs",
  description: "Stream server logs",
  flags: { lines: "string" },
  async run({ flags, io }) {
    if (!await hasPM2()) throw new CanvasError("PM2 not installed");
    const info = await getProcessInfo();
    if (!info) {
      io.warn("Server not running");
      return;
    }
    const lines = flags.lines || "50";
    return new Promise((resolve) => {
      const p = spawn("pm2", ["logs", PM2_APP, "--lines", lines], { stdio: "inherit" });
      process.on("SIGINT", () => p.kill("SIGINT"));
      p.on("close", () => resolve());
    });
  }
};

// packages/cli-server/src/actions/restart.js
import { exec as exec3 } from "node:child_process";
import { promisify as promisify3 } from "node:util";

// packages/cli-server/src/actions/start.js
import path5 from "node:path";
var start_default = {
  name: "start",
  description: "Start Canvas server via PM2",
  async run({ io }) {
    const root = findServerRoot();
    if (!root) throw new CanvasError("Canvas server root not found. Set CANVAS_SERVER_ROOT.");
    if (!await hasPM2()) throw new CanvasError("PM2 not installed. `npm install -g pm2`");
    const existing = await getProcessInfo();
    if (existing && existing.pm2_env.status === "online") {
      io.warn("Canvas server already running");
      return;
    }
    const script = path5.join(root, "src/init.js");
    const cfg = {
      name: PM2_APP,
      script,
      cwd: root,
      env: pm2Env({ NODE_ENV: "development" }),
      time: true,
      autorestart: true,
      max_restarts: 5,
      min_uptime: "10s"
    };
    await pm2Start(cfg);
    io.success("Canvas server started");
  }
};

// packages/cli-server/src/actions/restart.js
var execAsync2 = promisify3(exec3);
var restart_default = {
  name: "restart",
  description: "Restart Canvas server",
  async run(ctx2) {
    if (!await hasPM2()) throw new CanvasError("PM2 not installed");
    const info = await getProcessInfo();
    if (!info) {
      ctx2.io.warn("Server not running, starting...");
      return start_default.run(ctx2);
    }
    await execAsync2(`pm2 restart ${PM2_APP}`);
    ctx2.io.success("Canvas server restarted");
  }
};

// packages/cli-server/src/actions/status.js
var status_default = {
  name: "status",
  description: "Show local server status",
  async run({ client, session, io }) {
    const root = findServerRoot();
    io.print(`Server root: ${root || "not found"}`);
    const info = await getProcessInfo();
    if (info) {
      io.output({
        pm2Status: info.pm2_env.status,
        pid: info.pid,
        uptime: formatUptime(info.pm2_env.pm_uptime),
        restarts: info.pm2_env.restart_time,
        memory: formatMemory(info.monit?.memory),
        cpu: `${info.monit?.cpu || 0}%`
      });
    } else {
      io.warn("PM2 process: stopped");
    }
    const remoteId = session.boundRemote();
    if (remoteId) {
      try {
        const api = await client.client(remoteId).ping();
        io.success(`API reachable (v${api?.version || "?"})`);
      } catch (e) {
        io.warn(`API unreachable: ${e.message}`);
      }
    }
  }
};

// packages/cli-server/src/actions/stop.js
import { exec as exec4 } from "node:child_process";
import { promisify as promisify4 } from "node:util";
var execAsync3 = promisify4(exec4);
var stop_default = {
  name: "stop",
  description: "Stop Canvas server",
  async run({ io }) {
    if (!await hasPM2()) throw new CanvasError("PM2 not installed");
    const info = await getProcessInfo();
    if (!info) {
      io.warn("Server not running");
      return;
    }
    await execAsync3(`pm2 stop ${PM2_APP}`);
    await execAsync3(`pm2 delete ${PM2_APP}`);
    io.success("Canvas server stopped");
  }
};

// packages/cli-server/src/lib/service.js
import { execFile as execFile2 } from "node:child_process";
import { existsSync as existsSync3, readFileSync as readFileSync2 } from "node:fs";
import path6 from "node:path";
import { promisify as promisify5 } from "node:util";
var execFileAsync2 = promisify5(execFile2);
async function git(args, cwd = SERVER_HOME) {
  const { stdout: stdout2 } = await execFileAsync2("git", args, { cwd, timeout: 6e4, maxBuffer: 4 * 1024 * 1024 });
  return String(stdout2).trim();
}
var serverService = {
  id: "server",
  label: "canvas-server",
  description: `local canvas-server checkout (${SERVER_REPO} \u2192 ${SERVER_HOME})`,
  async installed() {
    if (!existsSync3(path6.join(SERVER_HOME, ".git"))) return null;
    let version = null;
    try {
      version = JSON.parse(readFileSync2(path6.join(SERVER_HOME, "package.json"), "utf8")).version || null;
    } catch {
    }
    const rev = await git(["rev-parse", "--short", "HEAD"]).catch(() => null);
    return { version, rev, dir: SERVER_HOME };
  },
  async latest() {
    const branch = await git(["rev-parse", "--abbrev-ref", "HEAD"]).catch(() => "main");
    const out = await git(["ls-remote", SERVER_REPO, `refs/heads/${branch}`]).catch((err) => {
      throw new CanvasError(`git ls-remote ${SERVER_REPO}: ${err.message.split("\n")[0]}`);
    });
    const sha = out.split(/\s+/)[0];
    return sha ? { rev: sha.slice(0, 7) } : null;
  },
  async update({ io, onStep } = {}) {
    onStep?.(`git pull + npm install in ${SERVER_HOME}\u2026`);
    const before = await this.installed();
    await install_default.run({ flags: {}, args: {}, io: io || { info() {
    }, success() {
    }, warn() {
    } } });
    const after = await this.installed();
    return { before: before?.rev || null, after: after ? `${after.version || ""} (${after.rev})`.trim() : null };
  },
  async restart({ io } = {}) {
    if (!await hasPM2() || !await getProcessInfo(PM2_APP)) return { skipped: "not running under pm2" };
    await restart_default.run({ io: io || { info() {
    }, success() {
    }, warn() {
    } } });
    return { restarted: true };
  }
};

// packages/cli-server/src/index.js
var index_default = {
  name: "server",
  description: "Manage local Canvas server (PM2)",
  defaultAction: "status",
  needsConnection: false,
  actions: [install_default, logs_default, restart_default, start_default, status_default, stop_default],
  submodules: [],
  // Local services `canvas update` checks and refreshes (see apps/cli/src/modules/update/lib.js).
  services: [serverService]
};
export {
  index_default as default
};
