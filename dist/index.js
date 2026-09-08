import { createRequire as __cr } from 'node:module'; const require = __cr(import.meta.url);
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a2, b) => (typeof require !== "undefined" ? require : a2)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __commonJS = (cb, mod) => function __require2() {
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

// node_modules/.pnpm/ms@2.1.3/node_modules/ms/index.js
var require_ms = __commonJS({
  "node_modules/.pnpm/ms@2.1.3/node_modules/ms/index.js"(exports, module) {
    var s = 1e3;
    var m2 = s * 60;
    var h2 = m2 * 60;
    var d = h2 * 24;
    var w = d * 7;
    var y = d * 365.25;
    module.exports = function(val, options) {
      options = options || {};
      var type = typeof val;
      if (type === "string" && val.length > 0) {
        return parse(val);
      } else if (type === "number" && isFinite(val)) {
        return options.long ? fmtLong(val) : fmtShort(val);
      }
      throw new Error(
        "val is not a non-empty string or a valid number. val=" + JSON.stringify(val)
      );
    };
    function parse(str) {
      str = String(str);
      if (str.length > 100) {
        return;
      }
      var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
        str
      );
      if (!match) {
        return;
      }
      var n3 = parseFloat(match[1]);
      var type = (match[2] || "ms").toLowerCase();
      switch (type) {
        case "years":
        case "year":
        case "yrs":
        case "yr":
        case "y":
          return n3 * y;
        case "weeks":
        case "week":
        case "w":
          return n3 * w;
        case "days":
        case "day":
        case "d":
          return n3 * d;
        case "hours":
        case "hour":
        case "hrs":
        case "hr":
        case "h":
          return n3 * h2;
        case "minutes":
        case "minute":
        case "mins":
        case "min":
        case "m":
          return n3 * m2;
        case "seconds":
        case "second":
        case "secs":
        case "sec":
        case "s":
          return n3 * s;
        case "milliseconds":
        case "millisecond":
        case "msecs":
        case "msec":
        case "ms":
          return n3;
        default:
          return void 0;
      }
    }
    function fmtShort(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d) {
        return Math.round(ms / d) + "d";
      }
      if (msAbs >= h2) {
        return Math.round(ms / h2) + "h";
      }
      if (msAbs >= m2) {
        return Math.round(ms / m2) + "m";
      }
      if (msAbs >= s) {
        return Math.round(ms / s) + "s";
      }
      return ms + "ms";
    }
    function fmtLong(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d) {
        return plural(ms, msAbs, d, "day");
      }
      if (msAbs >= h2) {
        return plural(ms, msAbs, h2, "hour");
      }
      if (msAbs >= m2) {
        return plural(ms, msAbs, m2, "minute");
      }
      if (msAbs >= s) {
        return plural(ms, msAbs, s, "second");
      }
      return ms + " ms";
    }
    function plural(ms, msAbs, n3, name) {
      var isPlural = msAbs >= n3 * 1.5;
      return Math.round(ms / n3) + " " + name + (isPlural ? "s" : "");
    }
  }
});

// node_modules/.pnpm/debug@4.4.3/node_modules/debug/src/common.js
var require_common = __commonJS({
  "node_modules/.pnpm/debug@4.4.3/node_modules/debug/src/common.js"(exports, module) {
    function setup(env) {
      createDebug.debug = createDebug;
      createDebug.default = createDebug;
      createDebug.coerce = coerce;
      createDebug.disable = disable;
      createDebug.enable = enable;
      createDebug.enabled = enabled;
      createDebug.humanize = require_ms();
      createDebug.destroy = destroy;
      Object.keys(env).forEach((key) => {
        createDebug[key] = env[key];
      });
      createDebug.names = [];
      createDebug.skips = [];
      createDebug.formatters = {};
      function selectColor(namespace) {
        let hash = 0;
        for (let i2 = 0; i2 < namespace.length; i2++) {
          hash = (hash << 5) - hash + namespace.charCodeAt(i2);
          hash |= 0;
        }
        return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
      }
      createDebug.selectColor = selectColor;
      function createDebug(namespace) {
        let prevTime;
        let enableOverride = null;
        let namespacesCache;
        let enabledCache;
        function debug2(...args) {
          if (!debug2.enabled) {
            return;
          }
          const self = debug2;
          const curr = Number(/* @__PURE__ */ new Date());
          const ms = curr - (prevTime || curr);
          self.diff = ms;
          self.prev = prevTime;
          self.curr = curr;
          prevTime = curr;
          args[0] = createDebug.coerce(args[0]);
          if (typeof args[0] !== "string") {
            args.unshift("%O");
          }
          let index = 0;
          args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
            if (match === "%%") {
              return "%";
            }
            index++;
            const formatter = createDebug.formatters[format];
            if (typeof formatter === "function") {
              const val = args[index];
              match = formatter.call(self, val);
              args.splice(index, 1);
              index--;
            }
            return match;
          });
          createDebug.formatArgs.call(self, args);
          const logFn = self.log || createDebug.log;
          logFn.apply(self, args);
        }
        debug2.namespace = namespace;
        debug2.useColors = createDebug.useColors();
        debug2.color = createDebug.selectColor(namespace);
        debug2.extend = extend;
        debug2.destroy = createDebug.destroy;
        Object.defineProperty(debug2, "enabled", {
          enumerable: true,
          configurable: false,
          get: () => {
            if (enableOverride !== null) {
              return enableOverride;
            }
            if (namespacesCache !== createDebug.namespaces) {
              namespacesCache = createDebug.namespaces;
              enabledCache = createDebug.enabled(namespace);
            }
            return enabledCache;
          },
          set: (v) => {
            enableOverride = v;
          }
        });
        if (typeof createDebug.init === "function") {
          createDebug.init(debug2);
        }
        return debug2;
      }
      function extend(namespace, delimiter) {
        const newDebug = createDebug(this.namespace + (typeof delimiter === "undefined" ? ":" : delimiter) + namespace);
        newDebug.log = this.log;
        return newDebug;
      }
      function enable(namespaces) {
        createDebug.save(namespaces);
        createDebug.namespaces = namespaces;
        createDebug.names = [];
        createDebug.skips = [];
        const split = (typeof namespaces === "string" ? namespaces : "").trim().replace(/\s+/g, ",").split(",").filter(Boolean);
        for (const ns of split) {
          if (ns[0] === "-") {
            createDebug.skips.push(ns.slice(1));
          } else {
            createDebug.names.push(ns);
          }
        }
      }
      function matchesTemplate(search, template) {
        let searchIndex = 0;
        let templateIndex = 0;
        let starIndex = -1;
        let matchIndex = 0;
        while (searchIndex < search.length) {
          if (templateIndex < template.length && (template[templateIndex] === search[searchIndex] || template[templateIndex] === "*")) {
            if (template[templateIndex] === "*") {
              starIndex = templateIndex;
              matchIndex = searchIndex;
              templateIndex++;
            } else {
              searchIndex++;
              templateIndex++;
            }
          } else if (starIndex !== -1) {
            templateIndex = starIndex + 1;
            matchIndex++;
            searchIndex = matchIndex;
          } else {
            return false;
          }
        }
        while (templateIndex < template.length && template[templateIndex] === "*") {
          templateIndex++;
        }
        return templateIndex === template.length;
      }
      function disable() {
        const namespaces = [
          ...createDebug.names,
          ...createDebug.skips.map((namespace) => "-" + namespace)
        ].join(",");
        createDebug.enable("");
        return namespaces;
      }
      function enabled(name) {
        for (const skip of createDebug.skips) {
          if (matchesTemplate(name, skip)) {
            return false;
          }
        }
        for (const ns of createDebug.names) {
          if (matchesTemplate(name, ns)) {
            return true;
          }
        }
        return false;
      }
      function coerce(val) {
        if (val instanceof Error) {
          return val.stack || val.message;
        }
        return val;
      }
      function destroy() {
        console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
      }
      createDebug.enable(createDebug.load());
      return createDebug;
    }
    module.exports = setup;
  }
});

// node_modules/.pnpm/debug@4.4.3/node_modules/debug/src/browser.js
var require_browser = __commonJS({
  "node_modules/.pnpm/debug@4.4.3/node_modules/debug/src/browser.js"(exports, module) {
    exports.formatArgs = formatArgs;
    exports.save = save2;
    exports.load = load2;
    exports.useColors = useColors;
    exports.storage = localstorage();
    exports.destroy = /* @__PURE__ */ (() => {
      let warned = false;
      return () => {
        if (!warned) {
          warned = true;
          console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
        }
      };
    })();
    exports.colors = [
      "#0000CC",
      "#0000FF",
      "#0033CC",
      "#0033FF",
      "#0066CC",
      "#0066FF",
      "#0099CC",
      "#0099FF",
      "#00CC00",
      "#00CC33",
      "#00CC66",
      "#00CC99",
      "#00CCCC",
      "#00CCFF",
      "#3300CC",
      "#3300FF",
      "#3333CC",
      "#3333FF",
      "#3366CC",
      "#3366FF",
      "#3399CC",
      "#3399FF",
      "#33CC00",
      "#33CC33",
      "#33CC66",
      "#33CC99",
      "#33CCCC",
      "#33CCFF",
      "#6600CC",
      "#6600FF",
      "#6633CC",
      "#6633FF",
      "#66CC00",
      "#66CC33",
      "#9900CC",
      "#9900FF",
      "#9933CC",
      "#9933FF",
      "#99CC00",
      "#99CC33",
      "#CC0000",
      "#CC0033",
      "#CC0066",
      "#CC0099",
      "#CC00CC",
      "#CC00FF",
      "#CC3300",
      "#CC3333",
      "#CC3366",
      "#CC3399",
      "#CC33CC",
      "#CC33FF",
      "#CC6600",
      "#CC6633",
      "#CC9900",
      "#CC9933",
      "#CCCC00",
      "#CCCC33",
      "#FF0000",
      "#FF0033",
      "#FF0066",
      "#FF0099",
      "#FF00CC",
      "#FF00FF",
      "#FF3300",
      "#FF3333",
      "#FF3366",
      "#FF3399",
      "#FF33CC",
      "#FF33FF",
      "#FF6600",
      "#FF6633",
      "#FF9900",
      "#FF9933",
      "#FFCC00",
      "#FFCC33"
    ];
    function useColors() {
      if (typeof window !== "undefined" && window.process && (window.process.type === "renderer" || window.process.__nwjs)) {
        return true;
      }
      if (typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
        return false;
      }
      let m2;
      return typeof document !== "undefined" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
      typeof window !== "undefined" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator !== "undefined" && navigator.userAgent && (m2 = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) && parseInt(m2[1], 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
      typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    function formatArgs(args) {
      args[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + args[0] + (this.useColors ? "%c " : " ") + "+" + module.exports.humanize(this.diff);
      if (!this.useColors) {
        return;
      }
      const c2 = "color: " + this.color;
      args.splice(1, 0, c2, "color: inherit");
      let index = 0;
      let lastC = 0;
      args[0].replace(/%[a-zA-Z%]/g, (match) => {
        if (match === "%%") {
          return;
        }
        index++;
        if (match === "%c") {
          lastC = index;
        }
      });
      args.splice(lastC, 0, c2);
    }
    exports.log = console.debug || console.log || (() => {
    });
    function save2(namespaces) {
      try {
        if (namespaces) {
          exports.storage.setItem("debug", namespaces);
        } else {
          exports.storage.removeItem("debug");
        }
      } catch (error) {
      }
    }
    function load2() {
      let r2;
      try {
        r2 = exports.storage.getItem("debug") || exports.storage.getItem("DEBUG");
      } catch (error) {
      }
      if (!r2 && typeof process !== "undefined" && "env" in process) {
        r2 = process.env.DEBUG;
      }
      return r2;
    }
    function localstorage() {
      try {
        return localStorage;
      } catch (error) {
      }
    }
    module.exports = require_common()(exports);
    var { formatters } = module.exports;
    formatters.j = function(v) {
      try {
        return JSON.stringify(v);
      } catch (error) {
        return "[UnexpectedJSONParseError]: " + error.message;
      }
    };
  }
});

// node_modules/.pnpm/has-flag@4.0.0/node_modules/has-flag/index.js
var require_has_flag = __commonJS({
  "node_modules/.pnpm/has-flag@4.0.0/node_modules/has-flag/index.js"(exports, module) {
    "use strict";
    module.exports = (flag, argv = process.argv) => {
      const prefix = flag.startsWith("-") ? "" : flag.length === 1 ? "-" : "--";
      const position = argv.indexOf(prefix + flag);
      const terminatorPosition = argv.indexOf("--");
      return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
    };
  }
});

// node_modules/.pnpm/supports-color@7.2.0/node_modules/supports-color/index.js
var require_supports_color = __commonJS({
  "node_modules/.pnpm/supports-color@7.2.0/node_modules/supports-color/index.js"(exports, module) {
    "use strict";
    var os8 = __require("os");
    var tty = __require("tty");
    var hasFlag = require_has_flag();
    var { env } = process;
    var forceColor;
    if (hasFlag("no-color") || hasFlag("no-colors") || hasFlag("color=false") || hasFlag("color=never")) {
      forceColor = 0;
    } else if (hasFlag("color") || hasFlag("colors") || hasFlag("color=true") || hasFlag("color=always")) {
      forceColor = 1;
    }
    if ("FORCE_COLOR" in env) {
      if (env.FORCE_COLOR === "true") {
        forceColor = 1;
      } else if (env.FORCE_COLOR === "false") {
        forceColor = 0;
      } else {
        forceColor = env.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(env.FORCE_COLOR, 10), 3);
      }
    }
    function translateLevel(level) {
      if (level === 0) {
        return false;
      }
      return {
        level,
        hasBasic: true,
        has256: level >= 2,
        has16m: level >= 3
      };
    }
    function supportsColor(haveStream, streamIsTTY) {
      if (forceColor === 0) {
        return 0;
      }
      if (hasFlag("color=16m") || hasFlag("color=full") || hasFlag("color=truecolor")) {
        return 3;
      }
      if (hasFlag("color=256")) {
        return 2;
      }
      if (haveStream && !streamIsTTY && forceColor === void 0) {
        return 0;
      }
      const min = forceColor || 0;
      if (env.TERM === "dumb") {
        return min;
      }
      if (process.platform === "win32") {
        const osRelease2 = os8.release().split(".");
        if (Number(osRelease2[0]) >= 10 && Number(osRelease2[2]) >= 10586) {
          return Number(osRelease2[2]) >= 14931 ? 3 : 2;
        }
        return 1;
      }
      if ("CI" in env) {
        if (["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "GITHUB_ACTIONS", "BUILDKITE"].some((sign) => sign in env) || env.CI_NAME === "codeship") {
          return 1;
        }
        return min;
      }
      if ("TEAMCITY_VERSION" in env) {
        return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
      }
      if (env.COLORTERM === "truecolor") {
        return 3;
      }
      if ("TERM_PROGRAM" in env) {
        const version = parseInt((env.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
        switch (env.TERM_PROGRAM) {
          case "iTerm.app":
            return version >= 3 ? 3 : 2;
          case "Apple_Terminal":
            return 2;
        }
      }
      if (/-256(color)?$/i.test(env.TERM)) {
        return 2;
      }
      if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
        return 1;
      }
      if ("COLORTERM" in env) {
        return 1;
      }
      return min;
    }
    function getSupportLevel(stream) {
      const level = supportsColor(stream, stream && stream.isTTY);
      return translateLevel(level);
    }
    module.exports = {
      supportsColor: getSupportLevel,
      stdout: translateLevel(supportsColor(true, tty.isatty(1))),
      stderr: translateLevel(supportsColor(true, tty.isatty(2)))
    };
  }
});

// node_modules/.pnpm/debug@4.4.3/node_modules/debug/src/node.js
var require_node = __commonJS({
  "node_modules/.pnpm/debug@4.4.3/node_modules/debug/src/node.js"(exports, module) {
    var tty = __require("tty");
    var util = __require("util");
    exports.init = init;
    exports.log = log3;
    exports.formatArgs = formatArgs;
    exports.save = save2;
    exports.load = load2;
    exports.useColors = useColors;
    exports.destroy = util.deprecate(
      () => {
      },
      "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."
    );
    exports.colors = [6, 2, 3, 4, 5, 1];
    try {
      const supportsColor = require_supports_color();
      if (supportsColor && (supportsColor.stderr || supportsColor).level >= 2) {
        exports.colors = [
          20,
          21,
          26,
          27,
          32,
          33,
          38,
          39,
          40,
          41,
          42,
          43,
          44,
          45,
          56,
          57,
          62,
          63,
          68,
          69,
          74,
          75,
          76,
          77,
          78,
          79,
          80,
          81,
          92,
          93,
          98,
          99,
          112,
          113,
          128,
          129,
          134,
          135,
          148,
          149,
          160,
          161,
          162,
          163,
          164,
          165,
          166,
          167,
          168,
          169,
          170,
          171,
          172,
          173,
          178,
          179,
          184,
          185,
          196,
          197,
          198,
          199,
          200,
          201,
          202,
          203,
          204,
          205,
          206,
          207,
          208,
          209,
          214,
          215,
          220,
          221
        ];
      }
    } catch (error) {
    }
    exports.inspectOpts = Object.keys(process.env).filter((key) => {
      return /^debug_/i.test(key);
    }).reduce((obj, key) => {
      const prop = key.substring(6).toLowerCase().replace(/_([a-z])/g, (_, k) => {
        return k.toUpperCase();
      });
      let val = process.env[key];
      if (/^(yes|on|true|enabled)$/i.test(val)) {
        val = true;
      } else if (/^(no|off|false|disabled)$/i.test(val)) {
        val = false;
      } else if (val === "null") {
        val = null;
      } else {
        val = Number(val);
      }
      obj[prop] = val;
      return obj;
    }, {});
    function useColors() {
      return "colors" in exports.inspectOpts ? Boolean(exports.inspectOpts.colors) : tty.isatty(process.stderr.fd);
    }
    function formatArgs(args) {
      const { namespace: name, useColors: useColors2 } = this;
      if (useColors2) {
        const c2 = this.color;
        const colorCode = "\x1B[3" + (c2 < 8 ? c2 : "8;5;" + c2);
        const prefix = `  ${colorCode};1m${name} \x1B[0m`;
        args[0] = prefix + args[0].split("\n").join("\n" + prefix);
        args.push(colorCode + "m+" + module.exports.humanize(this.diff) + "\x1B[0m");
      } else {
        args[0] = getDate() + name + " " + args[0];
      }
    }
    function getDate() {
      if (exports.inspectOpts.hideDate) {
        return "";
      }
      return (/* @__PURE__ */ new Date()).toISOString() + " ";
    }
    function log3(...args) {
      return process.stderr.write(util.formatWithOptions(exports.inspectOpts, ...args) + "\n");
    }
    function save2(namespaces) {
      if (namespaces) {
        process.env.DEBUG = namespaces;
      } else {
        delete process.env.DEBUG;
      }
    }
    function load2() {
      return process.env.DEBUG;
    }
    function init(debug2) {
      debug2.inspectOpts = {};
      const keys = Object.keys(exports.inspectOpts);
      for (let i2 = 0; i2 < keys.length; i2++) {
        debug2.inspectOpts[keys[i2]] = exports.inspectOpts[keys[i2]];
      }
    }
    module.exports = require_common()(exports);
    var { formatters } = module.exports;
    formatters.o = function(v) {
      this.inspectOpts.colors = this.useColors;
      return util.inspect(v, this.inspectOpts).split("\n").map((str) => str.trim()).join(" ");
    };
    formatters.O = function(v) {
      this.inspectOpts.colors = this.useColors;
      return util.inspect(v, this.inspectOpts);
    };
  }
});

// node_modules/.pnpm/debug@4.4.3/node_modules/debug/src/index.js
var require_src2 = __commonJS({
  "node_modules/.pnpm/debug@4.4.3/node_modules/debug/src/index.js"(exports, module) {
    if (typeof process === "undefined" || process.type === "renderer" || process.browser === true || process.__nwjs) {
      module.exports = require_browser();
    } else {
      module.exports = require_node();
    }
  }
});

// packages/cli-mirror/src/actions/init.js
import { existsSync as existsSync6, mkdirSync as mkdirSync5, readdirSync as readdirSync2 } from "node:fs";
import os7 from "node:os";
import path8 from "node:path";

// packages/cli-host/src/prompt.js
import { createInterface as createInterface2 } from "node:readline";

// node_modules/.pnpm/@clack+core@1.4.3/node_modules/@clack/core/dist/index.mjs
import { styleText } from "node:util";
import { stdout, stdin } from "node:process";
import * as l from "node:readline";
import l__default from "node:readline";

// node_modules/.pnpm/fast-string-truncated-width@3.0.3/node_modules/fast-string-truncated-width/dist/utils.js
var getCodePointsLength = /* @__PURE__ */ (() => {
  const SURROGATE_PAIR_RE = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
  return (input2) => {
    let surrogatePairsNr = 0;
    SURROGATE_PAIR_RE.lastIndex = 0;
    while (SURROGATE_PAIR_RE.test(input2)) {
      surrogatePairsNr += 1;
    }
    return input2.length - surrogatePairsNr;
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
var getStringTruncatedWidth = (input2, truncationOptions = {}, widthOptions = {}) => {
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
  let length = input2.length;
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
      const unmatched = input2.slice(unmatchedStart, unmatchedEnd) || input2.slice(indexPrev, index);
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
      if (BLOCK_RE.test(input2)) {
        lengthExtra = BLOCK_RE === CJKT_WIDE_RE ? getCodePointsLength(input2.slice(index, BLOCK_RE.lastIndex)) : BLOCK_RE === EMOJI_RE ? 1 : BLOCK_RE.lastIndex - index;
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
var fastStringWidth = (input2, options = {}) => {
  return dist_default(input2, NO_TRUNCATION2, options).width;
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
function findCursor(s, o, l2) {
  if (!l2.some((r2) => !r2.disabled))
    return s;
  const t2 = s + o, n3 = Math.max(l2.length - 1, 0), e = t2 < 0 ? n3 : t2 > n3 ? 0 : t2;
  return l2[e]?.disabled ? findCursor(e, o < 0 ? -1 : 1, l2) : e;
}
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
      invalidDay: (n3, e) => `There are only ${n3} days in ${e}`,
      afterMin: (n3) => `Date must be on or after ${n3.toISOString().slice(0, 10)}`,
      beforeMax: (n3) => `Date must be on or before ${n3.toISOString().slice(0, 10)}`
    }
  }
};
function isActionKey(n3, e) {
  if (typeof n3 == "string")
    return settings.aliases.get(n3) === e;
  for (const s of n3)
    if (s !== void 0 && isActionKey(s, e))
      return true;
  return false;
}
function diffLines(i2, s) {
  if (i2 === s) return;
  const e = i2.split(`
`), t2 = s.split(`
`), r2 = Math.max(e.length, t2.length), f = [];
  for (let n3 = 0; n3 < r2; n3++)
    e[n3] !== t2[n3] && f.push(n3);
  return {
    lines: f,
    numLinesBefore: e.length,
    numLinesAfter: t2.length,
    numLines: r2
  };
}
var R = globalThis.process.platform.startsWith("win");
var CANCEL_SYMBOL = /* @__PURE__ */ Symbol("clack:cancel");
function isCancel(e) {
  return e === CANCEL_SYMBOL;
}
function setRawMode(e, r2) {
  const o = e;
  o.isTTY && o.setRawMode(r2);
}
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
  const n3 = (f, { name: a2, sequence: p }) => {
    const c2 = String(f);
    if (isActionKey([c2, a2, p], "cancel")) {
      t2 && r2.write(import_sisteransi.cursor.show), process.exit(0);
      return;
    }
    if (!o) return;
    const i2 = a2 === "return" ? 0 : -1, m2 = a2 === "return" ? -1 : 0;
    l.moveCursor(r2, i2, m2, () => {
      l.clearLine(r2, 1, () => {
        e.once("keypress", n3);
      });
    });
  };
  return t2 && r2.write(import_sisteransi.cursor.hide), e.once("keypress", n3), () => {
    e.off("keypress", n3), t2 && r2.write(import_sisteransi.cursor.show), e instanceof ReadStream && e.isTTY && !R && e.setRawMode(false), s.terminal = false, s.close();
  };
}
var getColumns = (e) => "columns" in e && typeof e.columns == "number" ? e.columns : 80;
var getRows = (e) => "rows" in e && typeof e.rows == "number" ? e.rows : 20;
function wrapTextWithPrefix(e, r2, o, t2 = o, s = o, n3) {
  const f = getColumns(e ?? stdout);
  return wrapAnsi(r2, f - o.length, {
    hard: true,
    trim: false
  }).split(`
`).map((c2, i2, m2) => {
    const d = n3 ? n3(c2, i2) : c2;
    return i2 === 0 ? `${t2}${d}` : i2 === m2.length - 1 ? `${s}${d}` : `${o}${d}`;
  }).join(`
`);
}
function runValidation(e, n3) {
  if ("~standard" in e) {
    const a2 = e["~standard"].validate(n3);
    if (a2 instanceof Promise)
      throw new TypeError(
        "Schema validation must be synchronous. Update `validate()` and remove any asynchronous logic."
      );
    return a2.issues?.at(0)?.message;
  }
  return e(n3);
}
var V = class {
  input;
  output;
  _abortSignal;
  rl;
  opts;
  _render;
  _track = false;
  _prevFrame = "";
  _subscribers = /* @__PURE__ */ new Map();
  _cursor = 0;
  state = "initial";
  error = "";
  value;
  userInput = "";
  constructor(t2, e = true) {
    const { input: i2 = stdin, output: n3 = stdout, render: s, signal: r2, ...o } = t2;
    this.opts = o, this.onKeypress = this.onKeypress.bind(this), this.close = this.close.bind(this), this.render = this.render.bind(this), this._render = s.bind(this), this._track = e, this._abortSignal = r2, this.input = i2, this.output = n3;
  }
  /**
   * Unsubscribe all listeners
   */
  unsubscribe() {
    this._subscribers.clear();
  }
  /**
   * Set a subscriber with opts
   * @param event - The event name
   */
  setSubscriber(t2, e) {
    const i2 = this._subscribers.get(t2) ?? [];
    i2.push(e), this._subscribers.set(t2, i2);
  }
  /**
   * Subscribe to an event
   * @param event - The event name
   * @param cb - The callback
   */
  on(t2, e) {
    this.setSubscriber(t2, { cb: e });
  }
  /**
   * Subscribe to an event once
   * @param event - The event name
   * @param cb - The callback
   */
  once(t2, e) {
    this.setSubscriber(t2, { cb: e, once: true });
  }
  /**
   * Emit an event with data
   * @param event - The event name
   * @param data - The data to pass to the callback
   */
  emit(t2, ...e) {
    const i2 = this._subscribers.get(t2) ?? [], n3 = [];
    for (const s of i2)
      s.cb(...e), s.once && n3.push(() => i2.splice(i2.indexOf(s), 1));
    for (const s of n3)
      s();
  }
  prompt() {
    return new Promise((t2) => {
      if (this._abortSignal) {
        if (this._abortSignal.aborted)
          return this.state = "cancel", this.close(), t2(CANCEL_SYMBOL);
        this._abortSignal.addEventListener(
          "abort",
          () => {
            this.state = "cancel", this.close();
          },
          { once: true }
        );
      }
      this.rl = l__default.createInterface({
        input: this.input,
        tabSize: 2,
        prompt: "",
        escapeCodeTimeout: 50,
        terminal: true
      }), this.rl.prompt(), this.opts.initialUserInput !== void 0 && this._setUserInput(this.opts.initialUserInput, true), this.input.on("keypress", this.onKeypress), setRawMode(this.input, true), this.output.on("resize", this.render), this.render(), this.once("submit", () => {
        this.output.write(import_sisteransi.cursor.show), this.output.off("resize", this.render), setRawMode(this.input, false), t2(this.value);
      }), this.once("cancel", () => {
        this.output.write(import_sisteransi.cursor.show), this.output.off("resize", this.render), setRawMode(this.input, false), t2(CANCEL_SYMBOL);
      });
    });
  }
  _isActionKey(t2, e) {
    return t2 === "	";
  }
  _shouldSubmit(t2, e) {
    return true;
  }
  _setValue(t2) {
    this.value = t2, this.emit("value", this.value);
  }
  _setUserInput(t2, e) {
    this.userInput = t2 ?? "", this.emit("userInput", this.userInput), e && this._track && this.rl && (this.rl.write(this.userInput), this._cursor = this.rl.cursor);
  }
  _clearUserInput() {
    this.rl?.write(null, { ctrl: true, name: "u" }), this._setUserInput("");
  }
  onKeypress(t2, e) {
    if (this._track && e.name !== "return" && (e.name && this._isActionKey(t2, e) && this.rl?.write(null, { ctrl: true, name: "h" }), this._cursor = this.rl?.cursor ?? 0, this._setUserInput(this.rl?.line)), this.state === "error" && (this.state = "active"), e?.name && (!this._track && settings.aliases.has(e.name) && this.emit("cursor", settings.aliases.get(e.name)), settings.actions.has(e.name) && this.emit("cursor", e.name)), t2 && (t2.toLowerCase() === "y" || t2.toLowerCase() === "n") && this.emit("confirm", t2.toLowerCase() === "y"), this.emit("key", t2, e), e?.name === "return" && this._shouldSubmit(t2, e)) {
      if (this.opts.validate) {
        const i2 = runValidation(this.opts.validate, this.value);
        i2 && (this.error = i2 instanceof Error ? i2.message : i2, this.state = "error", this.rl?.write(this.userInput));
      }
      this.state !== "error" && (this.state = "submit");
    }
    isActionKey([t2, e?.name, e?.sequence], "cancel") && (this.state = "cancel"), (this.state === "submit" || this.state === "cancel") && this.emit("finalize"), this.render(), (this.state === "submit" || this.state === "cancel") && this.close();
  }
  close() {
    this.input.unpipe(), this.input.removeListener("keypress", this.onKeypress), this.output.write(`
`), setRawMode(this.input, false), this.rl?.close(), this.rl = void 0, this.emit(`${this.state}`, this.value), this.unsubscribe();
  }
  restoreCursor() {
    const t2 = wrapAnsi(this._prevFrame, process.stdout.columns, { hard: true, trim: false }).split(`
`).length - 1;
    this.output.write(import_sisteransi.cursor.move(-999, t2 * -1));
  }
  render() {
    const t2 = wrapAnsi(this._render(this) ?? "", process.stdout.columns, {
      hard: true,
      trim: false
    });
    if (t2 !== this._prevFrame) {
      if (this.state === "initial")
        this.output.write(import_sisteransi.cursor.hide);
      else {
        const e = diffLines(this._prevFrame, t2), i2 = getRows(this.output);
        if (this.restoreCursor(), e) {
          const n3 = Math.max(0, e.numLinesAfter - i2), s = Math.max(0, e.numLinesBefore - i2);
          let r2 = e.lines.find((o) => o >= n3);
          if (r2 === void 0) {
            this._prevFrame = t2;
            return;
          }
          if (e.lines.length === 1) {
            this.output.write(import_sisteransi.cursor.move(0, r2 - s)), this.output.write(import_sisteransi.erase.lines(1));
            const o = t2.split(`
`);
            this.output.write(o[r2]), this._prevFrame = t2, this.output.write(import_sisteransi.cursor.move(0, o.length - r2 - 1));
            return;
          } else if (e.lines.length > 1) {
            if (n3 < s)
              r2 = n3;
            else {
              const h2 = r2 - s;
              h2 > 0 && this.output.write(import_sisteransi.cursor.move(0, h2));
            }
            this.output.write(import_sisteransi.erase.down());
            const f = t2.split(`
`).slice(r2);
            this.output.write(f.join(`
`)), this._prevFrame = t2;
            return;
          }
        }
        this.output.write(import_sisteransi.erase.down());
      }
      this.output.write(t2), this.state === "initial" && (this.state = "active"), this._prevFrame = t2;
    }
  }
};
var r = class extends V {
  get cursor() {
    return this.value ? 0 : 1;
  }
  get _value() {
    return this.cursor === 0;
  }
  constructor(t2) {
    super(t2, false), this.value = !!t2.initialValue, this.on("userInput", () => {
      this.value = this._value;
    }), this.on("confirm", (i2) => {
      this.output.write(import_sisteransi.cursor.move(0, -1)), this.value = i2, this.state = "submit", this.close();
    }), this.on("cursor", () => {
      this.value = !this.value;
    });
  }
};
var a = class extends V {
  options;
  cursor = 0;
  get _value() {
    return this.options[this.cursor]?.value;
  }
  get _enabledOptions() {
    return this.options.filter((e) => e.disabled !== true);
  }
  toggleAll() {
    const e = this._enabledOptions, i2 = this.value !== void 0 && this.value.length === e.length;
    this.value = i2 ? [] : e.map((t2) => t2.value);
  }
  toggleInvert() {
    const e = this.value;
    if (!e)
      return;
    const i2 = this._enabledOptions.filter((t2) => !e.includes(t2.value));
    this.value = i2.map((t2) => t2.value);
  }
  toggleValue() {
    this.value === void 0 && (this.value = []);
    const e = this.value.includes(this._value);
    this.value = e ? this.value.filter((i2) => i2 !== this._value) : [...this.value, this._value];
  }
  constructor(e) {
    super(e, false), this.options = e.options, this.value = [...e.initialValues ?? []];
    const i2 = Math.max(
      this.options.findIndex(({ value: t2 }) => t2 === e.cursorAt),
      0
    );
    this.cursor = this.options[i2]?.disabled ? findCursor(i2, 1, this.options) : i2, this.on("key", (t2, l2) => {
      l2.name === "a" && this.toggleAll(), l2.name === "i" && this.toggleInvert();
    }), this.on("cursor", (t2) => {
      switch (t2) {
        case "left":
        case "up":
          this.cursor = findCursor(this.cursor, -1, this.options);
          break;
        case "down":
        case "right":
          this.cursor = findCursor(this.cursor, 1, this.options);
          break;
        case "space":
          this.toggleValue();
          break;
      }
    });
  }
};
var u$1 = class u extends V {
  _mask = "\u2022";
  get cursor() {
    return this._cursor;
  }
  get masked() {
    return this.userInput.replaceAll(/./g, this._mask);
  }
  get userInputWithCursor() {
    if (this.state === "submit" || this.state === "cancel")
      return this.masked;
    const t2 = this.userInput;
    if (this.cursor >= t2.length)
      return `${this.masked}${styleText(["inverse", "hidden"], "_")}`;
    const s = this.masked, r2 = s.slice(0, this.cursor), i2 = s.slice(this.cursor, this.cursor + 1), o = s.slice(this.cursor + 1);
    return `${r2}${styleText("inverse", i2)}${o}`;
  }
  clear() {
    this._clearUserInput();
  }
  constructor({ mask: t2, ...s }) {
    super(s), this._mask = t2 ?? "\u2022", this.on("userInput", (r2) => {
      this._setValue(r2);
    }), this.on("finalize", () => {
      this.value === void 0 && (this.value = "");
    });
  }
};
var n$1 = class n extends V {
  options;
  cursor = 0;
  get _selectedValue() {
    return this.options[this.cursor];
  }
  changeValue() {
    const e = this._selectedValue;
    this.value = e === void 0 ? void 0 : e.value;
  }
  constructor(e) {
    super(e, false), this.options = e.options;
    const o = this.options.findIndex(({ value: s }) => s === e.initialValue), t2 = o === -1 ? 0 : o;
    this.cursor = this.options[t2]?.disabled ? findCursor(t2, 1, this.options) : t2, this.changeValue(), this.on("cursor", (s) => {
      switch (s) {
        case "left":
        case "up":
          this.cursor = findCursor(this.cursor, -1, this.options);
          break;
        case "down":
        case "right":
          this.cursor = findCursor(this.cursor, 1, this.options);
          break;
      }
      this.changeValue();
    });
  }
};
var n2 = class extends V {
  get userInputWithCursor() {
    if (this.state === "submit")
      return this.userInput;
    const t2 = this.userInput;
    if (this.cursor >= t2.length)
      return `${this.userInput}\u2588`;
    const r2 = t2.slice(0, this.cursor), s = t2.slice(this.cursor, this.cursor + 1), e = t2.slice(this.cursor + 1);
    return `${r2}${styleText("inverse", s)}${e}`;
  }
  get cursor() {
    return this._cursor;
  }
  constructor(t2) {
    super({
      ...t2,
      initialUserInput: t2.initialUserInput ?? t2.initialValue
    }), this.on("userInput", (r2) => {
      this._setValue(r2);
    }), this.on("finalize", () => {
      this.value || (this.value = t2.defaultValue), this.value === void 0 && (this.value = "");
    });
  }
};

// node_modules/.pnpm/@clack+prompts@1.7.0/node_modules/@clack/prompts/dist/index.mjs
import { styleText as styleText2, stripVTControlCharacters } from "node:util";
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
var symbol = (o) => {
  switch (o) {
    case "initial":
    case "active":
      return styleText2("cyan", S_STEP_ACTIVE);
    case "cancel":
      return styleText2("red", S_STEP_CANCEL);
    case "error":
      return styleText2("yellow", S_STEP_ERROR);
    case "submit":
      return styleText2("green", S_STEP_SUBMIT);
  }
};
var symbolBar = (o) => {
  switch (o) {
    case "initial":
    case "active":
      return styleText2("cyan", S_BAR);
    case "cancel":
      return styleText2("red", S_BAR);
    case "error":
      return styleText2("yellow", S_BAR);
    case "submit":
      return styleText2("green", S_BAR);
  }
};
function formatInstructionFooter(o, e) {
  const r2 = [`${e ? `${styleText2("cyan", S_BAR)}  ` : ""}${o.join(" \u2022 ")}`];
  return e && r2.push(styleText2("cyan", S_BAR_END)), r2;
}
var I = (l2, e, w, p, b, C2 = false) => {
  let r2 = e, O = 0;
  if (C2)
    for (let i2 = p - 1; i2 >= w; i2--) {
      const m2 = l2[i2];
      if (m2 && (r2 -= m2.length), O++, r2 <= b) break;
    }
  else
    for (let i2 = w; i2 < p; i2++) {
      const m2 = l2[i2];
      if (m2 && (r2 -= m2.length), O++, r2 <= b) break;
    }
  return { lineCount: r2, removals: O };
};
var limitOptions = ({
  cursor: l2,
  options: e,
  style: w,
  output: p = process.stdout,
  maxItems: b = Number.POSITIVE_INFINITY,
  columnPadding: C2 = 0,
  rowPadding: r2 = 4
}) => {
  const i2 = getColumns(p) - C2, m2 = getRows(p), M = styleText2("dim", "..."), v = Math.max(m2 - r2, 0), a2 = Math.max(Math.min(b, v), 5);
  let f = 0;
  l2 >= a2 - 3 && (f = Math.max(
    Math.min(l2 - a2 + 3, e.length - a2),
    0
  ));
  let d = a2 < e.length && f > 0, c2 = a2 < e.length && f + a2 < e.length;
  const W2 = Math.min(
    f + a2,
    e.length
  ), s = [];
  let g = 0;
  d && g++, c2 && g++;
  const T = f + (d ? 1 : 0), y = W2 - (c2 ? 1 : 0);
  for (let t2 = T; t2 < y; t2++) {
    const n3 = e[t2], o = n3 ? w(n3, t2 === l2) : "", h2 = wrapAnsi(o, i2, {
      hard: true,
      trim: false
    }).split(`
`);
    s.push(h2), g += h2.length;
  }
  if (g > v) {
    let t2 = 0, n3 = 0, o = g;
    const h2 = l2 - T;
    let u4 = v;
    const L = () => I(s, o, 0, h2, u4), E = () => I(
      s,
      o,
      h2 + 1,
      s.length,
      u4,
      true
    );
    d ? ({ lineCount: o, removals: t2 } = L(), o > u4 && (c2 || (u4 -= 1), { lineCount: o, removals: n3 } = E())) : (c2 || (u4 -= 1), { lineCount: o, removals: n3 } = E(), o > u4 && (u4 -= 1, { lineCount: o, removals: t2 } = L())), t2 > 0 && (d = true, s.splice(0, t2)), n3 > 0 && (c2 = true, s.splice(s.length - n3, n3));
  }
  const x = [];
  d && x.push(M);
  for (const t2 of s)
    for (const n3 of t2)
      x.push(n3);
  return c2 && x.push(M), x;
};
var confirm = (i2) => {
  const a2 = i2.active ?? "Yes", s = i2.inactive ?? "No";
  return new r({
    active: a2,
    inactive: s,
    signal: i2.signal,
    input: i2.input,
    output: i2.output,
    initialValue: i2.initialValue ?? true,
    render() {
      const e = i2.withGuide ?? settings.withGuide, u4 = `${symbol(this.state)}  `, l2 = e ? `${styleText2("gray", S_BAR)}  ` : "", f = wrapTextWithPrefix(
        i2.output,
        i2.message,
        l2,
        u4
      ), o = `${e ? `${styleText2("gray", S_BAR)}
` : ""}${f}
`, c2 = this.value ? a2 : s;
      switch (this.state) {
        case "submit": {
          const r2 = e ? `${styleText2("gray", S_BAR)}  ` : "";
          return `${o}${r2}${styleText2("dim", c2)}`;
        }
        case "cancel": {
          const r2 = e ? `${styleText2("gray", S_BAR)}  ` : "";
          return `${o}${r2}${styleText2(["strikethrough", "dim"], c2)}${e ? `
${styleText2("gray", S_BAR)}` : ""}`;
        }
        default: {
          const r2 = e ? `${styleText2("cyan", S_BAR)}  ` : "", g = e ? styleText2("cyan", S_BAR_END) : "";
          return `${o}${r2}${this.value ? `${styleText2("green", S_RADIO_ACTIVE)} ${a2}` : `${styleText2("dim", S_RADIO_INACTIVE)} ${styleText2("dim", a2)}`}${i2.vertical ? e ? `
${styleText2("cyan", S_BAR)}  ` : `
` : ` ${styleText2("dim", "/")} `}${this.value ? `${styleText2("dim", S_RADIO_INACTIVE)} ${styleText2("dim", s)}` : `${styleText2("green", S_RADIO_ACTIVE)} ${s}`}
${g}
`;
        }
      }
    }
  }).prompt();
};
var MULTISELECT_INSTRUCTIONS = [
  `${styleText2("dim", "\u2191/\u2193")} to navigate`,
  `${styleText2("dim", "Space:")} select`,
  `${styleText2("dim", "Enter:")} confirm`
];
var m = (i2, u4) => i2.split(`
`).map((d) => u4(d)).join(`
`);
var multiselect = (i2) => {
  const u4 = (t2, a2) => {
    const r2 = t2.label ?? String(t2.value);
    return a2 === "disabled" ? `${styleText2("gray", S_CHECKBOX_INACTIVE)} ${m(r2, (o) => styleText2(["strikethrough", "gray"], o))}${t2.hint ? ` ${styleText2("dim", `(${t2.hint ?? "disabled"})`)}` : ""}` : a2 === "active" ? `${styleText2("cyan", S_CHECKBOX_ACTIVE)} ${r2}${t2.hint ? ` ${styleText2("dim", `(${t2.hint})`)}` : ""}` : a2 === "selected" ? `${styleText2("green", S_CHECKBOX_SELECTED)} ${m(r2, (o) => styleText2("dim", o))}${t2.hint ? ` ${styleText2("dim", `(${t2.hint})`)}` : ""}` : a2 === "cancelled" ? `${m(r2, (o) => styleText2(["strikethrough", "dim"], o))}` : a2 === "active-selected" ? `${styleText2("green", S_CHECKBOX_SELECTED)} ${r2}${t2.hint ? ` ${styleText2("dim", `(${t2.hint})`)}` : ""}` : a2 === "submitted" ? `${m(r2, (o) => styleText2("dim", o))}` : `${styleText2("dim", S_CHECKBOX_INACTIVE)} ${m(r2, (o) => styleText2("dim", o))}`;
  }, d = i2.required ?? true, v = i2.showInstructions ?? true;
  return new a({
    options: i2.options,
    signal: i2.signal,
    input: i2.input,
    output: i2.output,
    initialValues: i2.initialValues,
    required: d,
    cursorAt: i2.cursorAt,
    validate(t2) {
      if (d && (t2 === void 0 || t2.length === 0))
        return `Please select at least one option.
${styleText2(
          "reset",
          styleText2(
            "dim",
            `Press ${styleText2(["gray", "bgWhite", "inverse"], " space ")} to select, ${styleText2(
              "gray",
              styleText2("bgWhite", styleText2("inverse", " enter "))
            )} to submit`
          )
        )}`;
    },
    render() {
      const t2 = i2.withGuide ?? settings.withGuide, a2 = wrapTextWithPrefix(
        i2.output,
        i2.message,
        t2 ? `${symbolBar(this.state)}  ` : "",
        `${symbol(this.state)}  `
      ), r2 = `${t2 ? `${styleText2("gray", S_BAR)}
` : ""}${a2}
`, o = this.value ?? [], p = (n3, l2) => {
        if (n3.disabled)
          return u4(n3, "disabled");
        const s = o.includes(n3.value);
        return l2 && s ? u4(n3, "active-selected") : s ? u4(n3, "selected") : u4(n3, l2 ? "active" : "inactive");
      };
      switch (this.state) {
        case "submit": {
          const n3 = this.options.filter(({ value: s }) => o.includes(s)).map((s) => u4(s, "submitted")).join(styleText2("dim", ", ")) || styleText2("dim", "none"), l2 = wrapTextWithPrefix(
            i2.output,
            n3,
            t2 ? `${styleText2("gray", S_BAR)}  ` : ""
          );
          return `${r2}${l2}`;
        }
        case "cancel": {
          const n3 = this.options.filter(({ value: s }) => o.includes(s)).map((s) => u4(s, "cancelled")).join(styleText2("dim", ", "));
          if (n3.trim() === "")
            return `${r2}${styleText2("gray", S_BAR)}`;
          const l2 = wrapTextWithPrefix(
            i2.output,
            n3,
            t2 ? `${styleText2("gray", S_BAR)}  ` : ""
          );
          return `${r2}${l2}${t2 ? `
${styleText2("gray", S_BAR)}` : ""}`;
        }
        case "error": {
          const n3 = t2 ? `${styleText2("yellow", S_BAR)}  ` : "", l2 = this.error.split(`
`).map(
            ($, C2) => C2 === 0 ? `${t2 ? `${styleText2("yellow", S_BAR_END)}  ` : ""}${styleText2("yellow", $)}` : `   ${$}`
          ).join(`
`), s = r2.split(`
`).length, h2 = l2.split(`
`).length + 1;
          return `${r2}${n3}${limitOptions({
            output: i2.output,
            options: this.options,
            cursor: this.cursor,
            maxItems: i2.maxItems,
            columnPadding: n3.length,
            rowPadding: s + h2,
            style: p
          }).join(`
${n3}`)}
${l2}
`;
        }
        default: {
          const n3 = t2 ? `${styleText2("cyan", S_BAR)}  ` : "", l2 = r2.split(`
`).length, s = v ? formatInstructionFooter(MULTISELECT_INSTRUCTIONS, t2) : t2 ? [styleText2("cyan", S_BAR_END)] : [], h2 = s.join(`
`), $ = s.length + 1;
          return `${r2}${n3}${limitOptions({
            output: i2.output,
            options: this.options,
            cursor: this.cursor,
            maxItems: i2.maxItems,
            columnPadding: n3.length,
            rowPadding: l2 + $,
            style: p
          }).join(`
${n3}`)}
${h2}
`;
        }
      }
    }
  }).prompt();
};
var log = {
  message: (s = [], {
    symbol: e = styleText2("gray", S_BAR),
    secondarySymbol: r2 = styleText2("gray", S_BAR),
    output: m2 = process.stdout,
    spacing: l2 = 1,
    withGuide: c2
  } = {}) => {
    const t2 = [], o = c2 ?? settings.withGuide, f = o ? r2 : "", O = o ? `${e}  ` : "", u4 = o ? `${r2}  ` : "";
    for (let i2 = 0; i2 < l2; i2++)
      t2.push(f);
    const g = Array.isArray(s) ? s : s.split(`
`);
    if (g.length > 0) {
      const [i2, ...y] = g;
      i2.length > 0 ? t2.push(`${O}${i2}`) : t2.push(o ? e : "");
      for (const p of y)
        p.length > 0 ? t2.push(`${u4}${p}`) : t2.push(o ? r2 : "");
    }
    m2.write(`${t2.join(`
`)}
`);
  },
  info: (s, e) => {
    log.message(s, { ...e, symbol: styleText2("blue", S_INFO) });
  },
  success: (s, e) => {
    log.message(s, { ...e, symbol: styleText2("green", S_SUCCESS) });
  },
  step: (s, e) => {
    log.message(s, { ...e, symbol: styleText2("green", S_STEP_SUBMIT) });
  },
  warn: (s, e) => {
    log.message(s, { ...e, symbol: styleText2("yellow", S_WARN) });
  },
  /** alias for `log.warn()`. */
  warning: (s, e) => {
    log.warn(s, e);
  },
  error: (s, e) => {
    log.message(s, { ...e, symbol: styleText2("red", S_ERROR) });
  }
};
var cancel = (o = "", t2) => {
  const i2 = t2?.output ?? process.stdout, e = t2?.withGuide ?? settings.withGuide ? `${styleText2("gray", S_BAR_END)}  ` : "";
  i2.write(`${e}${styleText2("red", o)}

`);
};
var intro = (o = "", t2) => {
  const i2 = t2?.output ?? process.stdout, e = t2?.withGuide ?? settings.withGuide ? `${styleText2("gray", S_BAR_START)}  ` : "";
  i2.write(`${e}${o}
`);
};
var outro = (o = "", t2) => {
  const i2 = t2?.output ?? process.stdout, e = t2?.withGuide ?? settings.withGuide ? `${styleText2("gray", S_BAR)}
${styleText2("gray", S_BAR_END)}  ` : "";
  i2.write(`${e}${o}

`);
};
var W$1 = (o) => o;
var C = (o, e, s) => {
  const a2 = {
    hard: true,
    trim: false
  }, i2 = wrapAnsi(o, e, a2).split(`
`), c2 = i2.reduce((n3, t2) => Math.max(dist_default2(t2), n3), 0), u4 = i2.map(s).reduce((n3, t2) => Math.max(dist_default2(t2), n3), 0), g = e - (u4 - c2);
  return wrapAnsi(o, g, a2);
};
var note = (o = "", e = "", s) => {
  const a2 = s?.output ?? process$1.stdout, i2 = s?.withGuide ?? settings.withGuide, c2 = s?.format ?? W$1, g = ["", ...C(o, getColumns(a2) - 6, c2).split(`
`).map(c2), ""], n3 = dist_default2(e), t2 = Math.max(
    g.reduce((m2, F) => {
      const O = dist_default2(F);
      return O > m2 ? O : m2;
    }, 0),
    n3
  ) + 2, h2 = g.map(
    (m2) => `${styleText2("gray", S_BAR)}  ${m2}${" ".repeat(t2 - dist_default2(m2))}${styleText2("gray", S_BAR)}`
  ).join(`
`), T = i2 ? `${styleText2("gray", S_BAR)}
` : "", l$1 = i2 ? S_CONNECT_LEFT : S_CORNER_BOTTOM_LEFT;
  a2.write(
    `${T}${styleText2("green", S_STEP_SUBMIT)}  ${styleText2("reset", e)} ${styleText2(
      "gray",
      S_BAR_H.repeat(Math.max(t2 - n3 - 1, 1)) + S_CORNER_TOP_RIGHT
    )}
${h2}
${styleText2("gray", l$1 + S_BAR_H.repeat(t2 + 2) + S_CORNER_BOTTOM_RIGHT)}
`
  );
};
var password = (r2) => new u$1({
  validate: r2.validate,
  mask: r2.mask ?? S_PASSWORD_MASK,
  signal: r2.signal,
  input: r2.input,
  output: r2.output,
  render() {
    const e = r2.withGuide ?? settings.withGuide, o = `${e ? `${styleText2("gray", S_BAR)}
` : ""}${symbol(this.state)}  ${r2.message}
`, c2 = this.userInputWithCursor, i2 = this.masked;
    switch (this.state) {
      case "error": {
        const s = e ? `${styleText2("yellow", S_BAR)}  ` : "", n3 = e ? `${styleText2("yellow", S_BAR_END)}  ` : "", l2 = i2 ?? "";
        return r2.clearOnError && this.clear(), `${o.trim()}
${s}${l2}
${n3}${styleText2("yellow", this.error)}
`;
      }
      case "submit": {
        const s = e ? `${styleText2("gray", S_BAR)}  ` : "", n3 = i2 ? styleText2("dim", i2) : "";
        return `${o}${s}${n3}`;
      }
      case "cancel": {
        const s = e ? `${styleText2("gray", S_BAR)}  ` : "", n3 = i2 ? styleText2(["strikethrough", "dim"], i2) : "";
        return `${o}${s}${n3}${i2 && e ? `
${styleText2("gray", S_BAR)}` : ""}`;
      }
      default: {
        const s = e ? `${styleText2("cyan", S_BAR)}  ` : "", n3 = e ? styleText2("cyan", S_BAR_END) : "";
        return `${o}${s}${c2}
${n3}
`;
      }
    }
  }
}).prompt();
var W = (l2) => styleText2("magenta", l2);
var spinner = ({
  indicator: l2 = "dots",
  onCancel: h2,
  output: n3 = process.stdout,
  cancelMessage: G,
  errorMessage: O,
  frames: E = unicode ? ["\u25D2", "\u25D0", "\u25D3", "\u25D1"] : ["\u2022", "o", "O", "0"],
  delay: F = unicode ? 80 : 120,
  signal: m2,
  ...I2
} = {}) => {
  const u4 = isCI();
  let M, T, d = false, S = false, s = "", p, w = performance.now();
  const x = getColumns(n3), k = I2?.styleFrame ?? W, g = (e) => {
    const r2 = e > 1 ? O ?? settings.messages.error : G ?? settings.messages.cancel;
    S = e === 1, d && (a2(r2, e), S && typeof h2 == "function" && h2());
  }, f = () => g(2), i2 = () => g(1), A = () => {
    process.on("uncaughtExceptionMonitor", f), process.on("unhandledRejection", f), process.on("SIGINT", i2), process.on("SIGTERM", i2), process.on("exit", g), m2 && m2.addEventListener("abort", i2);
  }, H = () => {
    process.removeListener("uncaughtExceptionMonitor", f), process.removeListener("unhandledRejection", f), process.removeListener("SIGINT", i2), process.removeListener("SIGTERM", i2), process.removeListener("exit", g), m2 && m2.removeEventListener("abort", i2);
  }, y = () => {
    if (p === void 0) return;
    u4 && n3.write(`
`);
    const r2 = wrapAnsi(p, x, {
      hard: true,
      trim: false
    }).split(`
`);
    r2.length > 1 && n3.write(import_sisteransi2.cursor.up(r2.length - 1)), n3.write(import_sisteransi2.cursor.to(0)), n3.write(import_sisteransi2.erase.down());
  }, C2 = (e) => e.replace(/\.+$/, ""), _ = (e) => {
    const r2 = (performance.now() - e) / 1e3, t2 = Math.floor(r2 / 60), o = Math.floor(r2 % 60);
    return t2 > 0 ? `[${t2}m ${o}s]` : `[${o}s]`;
  }, N = I2.withGuide ?? settings.withGuide, P = (e = "") => {
    d = true, M = block({ output: n3 }), s = C2(e), w = performance.now(), N && n3.write(`${styleText2("gray", S_BAR)}
`);
    let r2 = 0, t2 = 0;
    A(), T = setInterval(() => {
      if (u4 && s === p)
        return;
      y(), p = s;
      const o = k(E[r2]);
      let v;
      if (u4)
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
      n3.write(j), r2 = r2 + 1 < E.length ? r2 + 1 : 0, t2 = t2 < 4 ? t2 + 0.125 : 0;
    }, F);
  }, a2 = (e = "", r2 = 0, t2 = false) => {
    if (!d) return;
    d = false, clearInterval(T), y();
    const o = r2 === 0 ? styleText2("green", S_STEP_SUBMIT) : r2 === 1 ? styleText2("red", S_STEP_CANCEL) : styleText2("red", S_STEP_ERROR);
    s = e ?? s, t2 || (l2 === "timer" ? n3.write(`${o}  ${s} ${_(w)}
`) : n3.write(`${o}  ${s}
`)), H(), M();
  };
  return {
    start: P,
    stop: (e = "") => a2(e, 0),
    message: (e = "") => {
      s = C2(e ?? s);
    },
    cancel: (e = "") => a2(e, 1),
    error: (e = "") => a2(e, 2),
    clear: () => a2("", 0, true),
    get isCancelled() {
      return S;
    }
  };
};
var u3 = {
  light: unicodeOr("\u2500", "-"),
  heavy: unicodeOr("\u2501", "="),
  block: unicodeOr("\u2588", "#")
};
var SELECT_INSTRUCTIONS = [
  `${styleText2("dim", "\u2191/\u2193")} to navigate`,
  `${styleText2("dim", "Enter:")} confirm`
];
var c = (t2, o) => t2.includes(`
`) ? t2.split(`
`).map((d) => o(d)).join(`
`) : o(t2);
var select = (t2) => {
  const o = (n3, m2) => {
    if (n3 === void 0)
      return "";
    const s = n3.label ?? String(n3.value);
    switch (m2) {
      case "disabled":
        return `${styleText2("gray", S_RADIO_INACTIVE)} ${c(s, (i2) => styleText2("gray", i2))}${n3.hint ? ` ${styleText2("dim", `(${n3.hint ?? "disabled"})`)}` : ""}`;
      case "selected":
        return `${c(s, (i2) => styleText2("dim", i2))}`;
      case "active":
        return `${styleText2("green", S_RADIO_ACTIVE)} ${s}${n3.hint ? ` ${styleText2("dim", `(${n3.hint})`)}` : ""}`;
      case "cancelled":
        return `${c(s, (i2) => styleText2(["strikethrough", "dim"], i2))}`;
      default:
        return `${styleText2("dim", S_RADIO_INACTIVE)} ${c(s, (i2) => styleText2("dim", i2))}`;
    }
  }, d = t2.showInstructions ?? true;
  return new n$1({
    options: t2.options,
    signal: t2.signal,
    input: t2.input,
    output: t2.output,
    initialValue: t2.initialValue,
    render() {
      const n3 = t2.withGuide ?? settings.withGuide, m2 = `${symbol(this.state)}  `, s = `${symbolBar(this.state)}  `, i2 = wrapTextWithPrefix(
        t2.output,
        t2.message,
        s,
        m2
      ), u4 = `${n3 ? `${styleText2("gray", S_BAR)}
` : ""}${i2}
`;
      switch (this.state) {
        case "submit": {
          const r2 = n3 ? `${styleText2("gray", S_BAR)}  ` : "", a2 = wrapTextWithPrefix(
            t2.output,
            o(this.options[this.cursor], "selected"),
            r2
          );
          return `${u4}${a2}`;
        }
        case "cancel": {
          const r2 = n3 ? `${styleText2("gray", S_BAR)}  ` : "", a2 = wrapTextWithPrefix(
            t2.output,
            o(this.options[this.cursor], "cancelled"),
            r2
          );
          return `${u4}${a2}${n3 ? `
${styleText2("gray", S_BAR)}` : ""}`;
        }
        default: {
          const r2 = n3 ? `${styleText2("cyan", S_BAR)}  ` : "", a2 = u4.split(`
`).length, p = d ? formatInstructionFooter(SELECT_INSTRUCTIONS, n3) : n3 ? [styleText2("cyan", S_BAR_END)] : [], b = p.join(`
`), f = p.length + 1;
          return `${u4}${r2}${limitOptions({
            output: t2.output,
            cursor: this.cursor,
            options: this.options,
            maxItems: t2.maxItems,
            columnPadding: r2.length,
            rowPadding: a2 + f,
            style: (g, x) => o(g, g.disabled ? "disabled" : x ? "active" : "inactive")
          }).join(`
${r2}`)}
${b}
`;
        }
      }
    }
  }).prompt();
};
var i = `${styleText2("gray", S_BAR)}  `;
var text = (e) => new n2({
  validate: e.validate,
  placeholder: e.placeholder,
  defaultValue: e.defaultValue,
  initialValue: e.initialValue,
  output: e.output,
  signal: e.signal,
  input: e.input,
  render() {
    const i2 = e?.withGuide ?? settings.withGuide, s = `${`${i2 ? `${styleText2("gray", S_BAR)}
` : ""}${symbol(this.state)}  `}${e.message}
`, c2 = e.placeholder && e.placeholder.length > 0 ? (
      // biome-ignore lint/style/noNonNullAssertion: guarded by placeholder.length > 0
      styleText2("inverse", e.placeholder[0]) + styleText2("dim", e.placeholder.slice(1))
    ) : styleText2(["inverse", "hidden"], "_"), o = this.userInput ? this.userInputWithCursor : c2, l2 = this.value ?? "";
    switch (this.state) {
      case "error": {
        const n3 = this.error ? `  ${styleText2("yellow", this.error)}` : "", r2 = i2 ? `${styleText2("yellow", S_BAR)}  ` : "", d = i2 ? styleText2("yellow", S_BAR_END) : "";
        return `${s.trim()}
${r2}${o}
${d}${n3}
`;
      }
      case "submit": {
        const n3 = l2 ? `  ${styleText2("dim", l2)}` : "", r2 = i2 ? styleText2("gray", S_BAR) : "";
        return `${s}${r2}${n3}`;
      }
      case "cancel": {
        const n3 = l2 ? `  ${styleText2(["strikethrough", "dim"], l2)}` : "", r2 = i2 ? styleText2("gray", S_BAR) : "";
        return `${s}${r2}${n3}${l2.trim() ? `
${r2}` : ""}`;
      }
      default: {
        const n3 = i2 ? `${styleText2("cyan", S_BAR)}  ` : "", r2 = i2 ? styleText2("cyan", S_BAR_END) : "";
        return `${s}${n3}${o}
${r2}
`;
      }
    }
  }
}).prompt();

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
function treePathSegment(path10) {
  const p = String(path10 || "/");
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
  treePath: (id, treeName, path10) => `/workspaces/${id}/trees/${encodeURIComponent(treeName)}/path${treePathSegment(path10)}`,
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

// packages/cli-host/src/errors.js
var UsageError = class extends CanvasError {
  constructor(message) {
    super(message, { code: "USAGE" });
    this.name = "UsageError";
  }
};

// packages/cli-host/src/prompt.js
var PromptCancelled = class extends CanvasError {
  constructor() {
    super("Cancelled", { code: "CANCELLED" });
    this.name = "PromptCancelled";
  }
};
var isTTY = () => Boolean(process.stdin.isTTY && process.stdout.isTTY);
function guard(value) {
  if (isCancel(value)) {
    cancel("Cancelled.");
    throw new PromptCancelled();
  }
  return value;
}
function legacy(prompt) {
  let message = String(prompt || "").replace(/[:\s]+$/, "");
  let defaultValue;
  const m2 = message.match(/^(.*?)\s*\[([^\]]*)\]$/);
  if (m2) {
    message = m2[1];
    defaultValue = m2[2];
  }
  return { message, defaultValue };
}
function rlAsk(prompt) {
  const rl = createInterface2({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => rl.question(prompt, (a2) => {
    rl.close();
    resolve(a2);
  }));
}
function rlPassword(prompt) {
  const rl = createInterface2({ input: process.stdin, output: process.stdout });
  rl._writeToOutput = function() {
    rl.output.write("\x1B[2K\x1B[200D" + prompt + "*".repeat(rl.line.length));
  };
  return new Promise((resolve) => rl.question(prompt, (a2) => {
    rl.output.write("\n");
    rl.close();
    resolve(a2);
  }));
}
function intro2(title) {
  if (isTTY()) intro(title);
  else process.stdout.write(`${title}
`);
}
function outro2(message) {
  if (isTTY()) outro(message);
  else process.stdout.write(`${message}
`);
}
function note2(message, title) {
  if (isTTY()) note(message, title);
  else process.stdout.write(`${title ? title + "\n" : ""}${message}
`);
}
var log2 = {
  info: (m2) => isTTY() ? log.info(m2) : process.stdout.write(`${m2}
`),
  success: (m2) => isTTY() ? log.success(m2) : process.stdout.write(`${m2}
`),
  warn: (m2) => isTTY() ? log.warn(m2) : process.stderr.write(`${m2}
`),
  error: (m2) => isTTY() ? log.error(m2) : process.stderr.write(`${m2}
`),
  step: (m2) => isTTY() ? log.step(m2) : process.stdout.write(`${m2}
`),
  message: (m2) => isTTY() ? log.message(m2) : process.stdout.write(`${m2}
`)
};
function spinner2() {
  if (isTTY()) return spinner();
  return {
    start: (m2) => {
      if (m2) process.stdout.write(`${m2}
`);
    },
    stop: (m2) => {
      if (m2) process.stdout.write(`${m2}
`);
    },
    message: () => {
    }
  };
}
async function input(prompt) {
  const opts = typeof prompt === "string" ? legacy(prompt) : { ...prompt };
  if (!isTTY()) {
    const raw = await rlAsk(`${opts.message}${opts.defaultValue != null ? ` [${opts.defaultValue}]` : ""}: `);
    return raw.trim() || opts.defaultValue || "";
  }
  const value = guard(await text({
    message: opts.message,
    placeholder: opts.placeholder ?? opts.defaultValue,
    defaultValue: opts.defaultValue,
    initialValue: opts.initialValue,
    validate: opts.validate
  }));
  return String(value ?? "");
}
async function password2(prompt) {
  const { message } = typeof prompt === "string" ? legacy(prompt) : prompt;
  if (!isTTY()) return rlPassword(`${message}: `);
  return String(guard(await password({ message })) ?? "");
}
async function yesNo(prompt, defaultVal = false) {
  const { message } = typeof prompt === "string" ? legacy(prompt) : prompt;
  if (!isTTY()) {
    const a2 = (await rlAsk(`${message} (${defaultVal ? "Y/n" : "y/N"}): `)).trim().toLowerCase();
    if (a2 === "") return defaultVal;
    return a2 === "y" || a2 === "yes";
  }
  return Boolean(guard(await confirm({ message, initialValue: defaultVal })));
}
async function select2(prompt, options, { initialValue } = {}) {
  if (!isTTY()) {
    process.stdout.write(`
${prompt}
`);
    options.forEach((opt, i2) => process.stdout.write(`  ${i2 + 1}. ${opt.label}${opt.hint ? `  (${opt.hint})` : ""}
`));
    const raw = (await rlAsk(`Choice [1-${options.length}]: `)).trim();
    const idx = parseInt(raw, 10) - 1;
    if (isNaN(idx) || idx < 0 || idx >= options.length) return initialValue ?? options[0].value;
    return options[idx].value;
  }
  return guard(await select({
    message: prompt,
    options: options.map((o) => ({ value: o.value, label: o.label, hint: o.hint })),
    initialValue: initialValue ?? options[0]?.value
  }));
}
async function multiSelect(prompt, options, { defaultAll = false, initialValues, required = false } = {}) {
  if (!isTTY()) {
    process.stdout.write(`
${prompt}
`);
    options.forEach((opt, i2) => process.stdout.write(`  ${i2 + 1}. ${opt.label}${opt.hint ? `  (${opt.hint})` : ""}
`));
    const raw = (await rlAsk(`Choice [1-${options.length}, e.g. 1,3 or 2-4, "all"${defaultAll ? ", empty = all" : ", empty = none"}]: `)).trim();
    return parseSelection(raw, options.length, { defaultAll }).map((i2) => options[i2].value);
  }
  const picked = guard(await multiselect({
    message: prompt,
    options: options.map((o) => ({ value: o.value, label: o.label, hint: o.hint })),
    initialValues: initialValues ?? (defaultAll ? options.map((o) => o.value) : []),
    required
  }));
  const set = new Set(picked);
  return options.filter((o) => set.has(o.value)).map((o) => o.value);
}
function parseSelection(raw, count, { defaultAll = false } = {}) {
  const text2 = String(raw ?? "").trim().toLowerCase();
  const all = Array.from({ length: count }, (_, i2) => i2);
  if (text2 === "") return defaultAll ? all : [];
  if (text2 === "all" || text2 === "*") return all;
  const picked = /* @__PURE__ */ new Set();
  for (const part of text2.split(/[\s,]+/).filter(Boolean)) {
    const m2 = part.match(/^(\d+)(?:-(\d+))?$/);
    if (!m2) continue;
    const from = parseInt(m2[1], 10);
    const to = m2[2] ? parseInt(m2[2], 10) : from;
    for (let n3 = Math.min(from, to); n3 <= Math.max(from, to); n3++) {
      if (n3 >= 1 && n3 <= count) picked.add(n3 - 1);
    }
  }
  return [...picked].sort((a2, b) => a2 - b);
}

// packages/cli-host/src/device.js
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { randomUUID } from "node:crypto";
import os from "node:os";
var HOST_HOME = process.platform === "win32" ? join(os.homedir(), "Canvas") : join(os.homedir(), ".canvas");
var FILE = process.env.CANVAS_DEVICE_FILE || join(HOST_HOME, "device.json");
var cached = null;
function osRelease() {
  if (os.platform() !== "linux") {
    return {};
  }
  try {
    const fields = Object.fromEntries(
      readFileSync("/etc/os-release", "utf8").split("\n").map((line) => line.match(/^([A-Z_]+)=(.*)$/)).filter(Boolean).map(([, key, value]) => [key, value.replace(/^"|"$/g, "").trim()])
    );
    return { osDistro: fields.ID || void 0, osVersion: fields.VERSION_ID || void 0 };
  } catch {
    return {};
  }
}
function liveInfo() {
  return {
    hostname: os.hostname(),
    platform: os.platform(),
    ...osRelease(),
    // os.machine() (x86_64), not os.arch() (x64): the vocabulary flatpak,
    // snap and appimage publish against.
    arch: os.machine ? os.machine() : os.arch(),
    user: os.userInfo().username
  };
}
function persist(deviceId, createdAt = (/* @__PURE__ */ new Date()).toISOString()) {
  cached = { deviceId, createdAt, ...liveInfo() };
  mkdirSync(dirname(FILE), { recursive: true });
  writeFileSync(FILE, JSON.stringify(cached, null, 2), { mode: 384 });
  return cached;
}
function load() {
  if (cached) {
    return cached;
  }
  let saved = null;
  try {
    saved = JSON.parse(readFileSync(FILE, "utf8"));
  } catch {
  }
  const deviceId = process.env.CANVAS_DEVICE_ID?.trim() || saved?.deviceId;
  if (!deviceId) {
    return persist(randomUUID());
  }
  cached = { ...saved, deviceId, ...liveInfo() };
  return cached;
}
var device = {
  get id() {
    return load().deviceId;
  },
  info() {
    return { ...load() };
  },
  // Adopt an identity chosen from the server's registry — a reinstalled
  // machine picking its old record. Has to write through to the host file or
  // the registration prompt returns on every single command.
  bind(deviceId) {
    return persist(deviceId, load().createdAt);
  },
  path: FILE
};
var device_default = device;

// packages/cli-host/src/device-registration.js
async function ensureDeviceRegistered(remoteId, client, io, { force = false } = {}) {
  const remote = client.getRemote(remoteId);
  const local = device_default.info();
  if (!force && remote?.device?.token && remote.device.deviceId === local.deviceId) {
    return remote.device;
  }
  const rc = client.client(remoteId);
  let existing = [];
  try {
    const raw = await rc.auth.devices.list();
    existing = Array.isArray(raw) ? raw : raw?.documents || raw?.payload || [];
  } catch {
  }
  const match = existing.find((d) => d.deviceId === local.deviceId);
  if (existing.length === 0 || match) {
    if (match) io.info(`Device '${local.hostname}' already known. Refreshing token...`);
    else io.info("Registering this device...");
    return _register(remoteId, client, rc, io, local.deviceId, local);
  }
  const choices = [
    ...existing.map((d) => ({
      label: `${d.name || d.deviceId}${d.platform ? ` [${d.platform}]` : ""}`,
      value: d.deviceId
    })),
    { label: `Register this machine as new device (${local.hostname})`, value: "__new__" }
  ];
  const chosen = await select2(
    `This machine is not registered on '${remoteId}'. Select device identity:`,
    choices
  );
  return _register(remoteId, client, rc, io, chosen === "__new__" ? local.deviceId : chosen, local);
}
async function _register(remoteId, client, rc, io, deviceId, localInfo) {
  const result = await rc.auth.devices.register({
    deviceId,
    name: localInfo.hostname,
    hostname: localInfo.hostname,
    platform: localInfo.platform,
    osDistro: localInfo.osDistro,
    osVersion: localInfo.osVersion,
    arch: localInfo.arch,
    type: "cli"
  });
  const devInfo = {
    deviceId: result.deviceId || deviceId,
    token: result.token,
    name: result.name || localInfo.hostname,
    platform: result.platform || localInfo.platform
  };
  if (devInfo.deviceId !== device_default.id) {
    device_default.bind(devInfo.deviceId);
  }
  client.updateRemote(remoteId, { device: devInfo });
  io.success(`Device '${devInfo.name}' registered (${devInfo.deviceId})`);
  return devInfo;
}

// packages/cli-mirror/src/lib/config.js
import os3 from "node:os";
import path2 from "node:path";

// packages/cli-host/src/paths.js
import os2 from "node:os";
import path from "node:path";
function userHome() {
  const mode = process.env.CANVAS_SERVER_MODE || process.env.SERVER_MODE || "user";
  const home = process.env.CANVAS_SERVER_HOME || process.env.SERVER_HOME || process.cwd();
  if (mode !== "user") return path.join(home, "users");
  return process.platform === "win32" ? path.join(os2.homedir(), "Canvas") : path.join(os2.homedir(), ".canvas");
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

// packages/cli-host/src/storage.js
import { readFileSync as readFileSync2, writeFileSync as writeFileSync2, existsSync, mkdirSync as mkdirSync2 } from "node:fs";
import { dirname as dirname2 } from "node:path";
function ensureDirs() {
  for (const d of [DIR_CONFIG, DIR_DB, DIR_DATA, DIR_CACHE, DIR_VAR]) {
    if (!existsSync(d)) mkdirSync2(d, { recursive: true });
  }
}
ensureDirs();
var JsonFile = class {
  constructor(path10, defaults = {}) {
    this.path = path10;
    this.defaults = defaults;
    if (!existsSync(path10)) this.write(defaults);
  }
  read() {
    try {
      return { ...this.defaults, ...JSON.parse(readFileSync2(this.path, "utf8")) };
    } catch {
      return { ...this.defaults };
    }
  }
  write(data) {
    mkdirSync2(dirname2(this.path), { recursive: true });
    writeFileSync2(this.path, JSON.stringify(data, null, 2), { mode: 384 });
  }
  get(key) {
    return this.read()[key];
  }
  set(key, value) {
    const data = this.read();
    data[key] = value;
    this.write(data);
  }
  delete(key) {
    const data = this.read();
    delete data[key];
    this.write(data);
  }
  has(key) {
    return Object.prototype.hasOwnProperty.call(this.read(), key);
  }
  keys() {
    return Object.keys(this.read());
  }
  entries() {
    return Object.entries(this.read());
  }
  clear() {
    this.write({ ...this.defaults });
  }
};
var remotes = new JsonFile(FILE_REMOTES, {});
var session = new JsonFile(FILE_SESSION, {
  boundRemote: null,
  boundRemoteStatus: "disconnected",
  boundContext: null,
  boundContextId: null,
  boundContextUrl: null,
  boundAt: null
});
var aliases = new JsonFile(FILE_ALIASES, {});
var config = new JsonFile(FILE_CONFIG, {
  dotfilesDir: "dotfiles",
  hooksDir: "hooks"
});
var contexts2 = new JsonFile(FILE_CONTEXTS, {});
var workspaces2 = new JsonFile(FILE_WORKSPACES, {});
var agents2 = new JsonFile(FILE_AGENTS, {});
var dotfiles = new JsonFile(FILE_DOTFILES, {});

// packages/cli-mirror/src/lib/config.js
var FILE_MIRRORS = path2.join(DIR_CONFIG, "mirrors.json");
var DEFAULTS = Object.freeze({ version: 1, root: null, edgeBin: null, mirrors: [] });
var CONFLICT_MODES = ["prompt", "rename"];
var DELETE_MODES = ["propagate", "keep"];
var CLIENTS = ["fuse", "daemon"];
var store = new JsonFile(FILE_MIRRORS, { ...DEFAULTS, mirrors: [] });
function defaultRoot() {
  return process.env.CANVAS_MIRROR_ROOT || path2.join(os3.homedir(), "Workspaces");
}
function readConfig() {
  const data = store.read();
  return { ...DEFAULTS, ...data, mirrors: Array.isArray(data.mirrors) ? data.mirrors : [] };
}
function writeConfig(data) {
  store.write({ ...DEFAULTS, ...data, mirrors: Array.isArray(data.mirrors) ? data.mirrors : [] });
}
function mirrorId(remoteId, workspaceName) {
  return `${remoteId}/${workspaceName}`;
}
function mountpointFor(root, folderName) {
  return path2.join(root, folderName);
}
function splitList(value) {
  if (Array.isArray(value)) return value.flatMap(splitList);
  return String(value ?? "").split(",").map((s) => s.trim()).filter(Boolean);
}
function parseWorkspaceSpec(spec) {
  const [name, pinsRaw = ""] = String(spec).split(":");
  const pins = splitList(pinsRaw).map((p) => p.endsWith("/**") || p.includes("*") ? p : `${p.replace(/\/+$/, "")}/**`);
  return { name: name.trim(), pins };
}
function buildMirror({ remoteId, workspaceId, workspaceName, folderName = null, root, folder = null, pins = [], ignore = [], conflicts = "prompt", deletes = "propagate", managed = "manual", client = "fuse" }) {
  if (!remoteId || !workspaceName) throw new Error("remoteId and workspaceName are required");
  if (!CONFLICT_MODES.includes(conflicts)) throw new Error(`conflicts must be one of ${CONFLICT_MODES.join("|")}`);
  if (!DELETE_MODES.includes(deletes)) throw new Error(`deletes must be one of ${DELETE_MODES.join("|")}`);
  if (!CLIENTS.includes(client)) throw new Error(`client must be one of ${CLIENTS.join("|")}`);
  if (folder && client !== "daemon") throw new Error("a custom folder needs the daemon client (a FUSE mount must be an empty mountpoint)");
  const mirrorRoot = root || defaultRoot();
  return {
    id: mirrorId(remoteId, workspaceName),
    remote: remoteId,
    workspaceId: workspaceId || null,
    workspaceName,
    // The hub's case-preserving folder name ("Universe"); `workspaceName`
    // is the lowercase identity used in URLs and ids.
    folderName: folderName || workspaceName,
    root: mirrorRoot,
    mountpoint: folder ? path2.resolve(folder) : mountpointFor(mirrorRoot, folderName || workspaceName),
    pins: [...new Set(pins)],
    ignore: [...new Set(ignore)],
    conflicts,
    deletes,
    client,
    // 'pm2' when `mirror service install` runs it, 'manual' when started detached.
    managed,
    paused: false,
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  };
}
function listMirrors() {
  return readConfig().mirrors;
}
function findMirror(ref) {
  if (!ref) return null;
  const needle = String(ref).trim();
  const mirrors = listMirrors();
  const lower = needle.toLowerCase();
  return mirrors.find((m2) => m2.id === needle) || mirrors.find((m2) => m2.id.toLowerCase() === lower) || mirrors.find((m2) => m2.workspaceName === lower || (m2.folderName || "").toLowerCase() === lower) || mirrors.find((m2) => m2.workspaceId === needle) || mirrors.find((m2) => m2.mountpoint === path2.resolve(needle)) || null;
}
function upsertMirror(entry) {
  const cfg = readConfig();
  const at = cfg.mirrors.findIndex((m2) => m2.id === entry.id);
  if (at >= 0) cfg.mirrors[at] = { ...cfg.mirrors[at], ...entry };
  else cfg.mirrors.push(entry);
  if (!cfg.root) cfg.root = entry.root;
  writeConfig(cfg);
  return at >= 0 ? cfg.mirrors[at] : entry;
}
function removeMirror(id) {
  const cfg = readConfig();
  const before = cfg.mirrors.length;
  cfg.mirrors = cfg.mirrors.filter((m2) => m2.id !== id);
  writeConfig(cfg);
  return cfg.mirrors.length < before;
}
function setEdgeBin(edgeBin) {
  const cfg = readConfig();
  cfg.edgeBin = edgeBin || null;
  writeConfig(cfg);
}
function setRoot(root) {
  const cfg = readConfig();
  cfg.root = root;
  writeConfig(cfg);
}
function noStart(flags) {
  return !!(flags?.["no-start"] || flags?.start === false);
}
function flagOff(name, argv = process.argv) {
  return argv.includes(`--no-${name}`);
}

// packages/cli-mirror/src/lib/pm2.js
import { exec as exec3, execFile as execFile2 } from "node:child_process";
import { promisify as promisify3 } from "node:util";

// packages/cli-host/src/pm2.js
import { exec as exec2 } from "node:child_process";
import { promisify } from "node:util";
import { mkdirSync as mkdirSync3, writeFileSync as writeFileSync3 } from "node:fs";
import path3 from "node:path";
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
  const dir = path3.join(DIR_VAR, "pm2");
  mkdirSync3(dir, { recursive: true });
  const file = path3.join(dir, `${cfg.name}.config.json`);
  writeFileSync3(file, JSON.stringify({ apps: [cfg] }, null, 2));
  await execAsync(`pm2 start "${file}"`);
  return file;
}

// packages/cli-mirror/src/lib/fuse.js
import { execFile, spawn } from "node:child_process";
import { existsSync as existsSync2 } from "node:fs";
import os4 from "node:os";
import path4 from "node:path";
import { promisify as promisify2 } from "node:util";
import { fileURLToPath } from "node:url";
var execFileAsync = promisify2(execFile);
var HERE = path4.dirname(fileURLToPath(import.meta.url));
function fuseBinary() {
  const candidates = [
    process.env.CANVAS_FUSE_BIN,
    path4.join(os4.homedir(), ".cargo", "bin", "canvas-fuse"),
    // Dev checkout: <container>/canvas-fuse next to the monorepo.
    path4.resolve(HERE, "../../../../../../../canvas-fuse/target/release/canvas-fuse"),
    path4.resolve(HERE, "../../../../../../../canvas-fuse/target/debug/canvas-fuse")
  ].filter(Boolean);
  for (const c2 of candidates) if (existsSync2(c2)) return c2;
  return "canvas-fuse";
}
async function fuseAvailable() {
  try {
    await execFileAsync(fuseBinary(), ["--version"]);
    return true;
  } catch {
    return false;
  }
}
function mountArgs(mirror, { detach = false } = {}) {
  const args = ["mount", "-w", mirror.folderName || mirror.workspaceName, mirror.root, "--remote", mirror.remote, "--mirror"];
  for (const pin2 of mirror.pins || []) args.push("--pin", pin2);
  for (const glob of mirror.ignore || []) args.push("--ignore", glob);
  if (mirror.conflicts) args.push("--conflicts", mirror.conflicts);
  if (mirror.deletes) args.push("--deletes", mirror.deletes);
  if (mirror.cacheBudgetMb) args.push("--cache-budget-mb", String(mirror.cacheBudgetMb));
  if (detach) args.push("-d");
  return args;
}
async function run(args, { timeout = 6e4 } = {}) {
  try {
    const { stdout: stdout2, stderr } = await execFileAsync(fuseBinary(), args, { timeout, maxBuffer: 16 * 1024 * 1024 });
    return { ok: true, stdout: String(stdout2 || ""), stderr: String(stderr || "") };
  } catch (err) {
    if (err.code === "ENOENT") throw new CanvasError("canvas-fuse binary not found. Install it (cargo install --path canvas-fuse) or set CANVAS_FUSE_BIN.");
    return { ok: false, stdout: String(err.stdout || ""), stderr: String(err.stderr || err.message || "") };
  }
}
async function mount(mirror) {
  return run(mountArgs(mirror, { detach: true }), { timeout: 12e4 });
}
async function unmount(mountpoint) {
  return run(["unmount", mountpoint]);
}
async function statusAll() {
  const res = await run(["status", "--json"]);
  if (!res.ok) return [];
  try {
    const parsed = JSON.parse(res.stdout || "[]");
    if (Array.isArray(parsed)) return parsed;
    if (Array.isArray(parsed?.mounts)) return parsed.mounts;
    return [];
  } catch {
    return [];
  }
}
async function syncNow(mountpoint) {
  return run(["sync", "now", mountpoint]);
}
async function pin(mountpoint, op, glob) {
  return run(["pin", op, mountpoint, ...glob ? [glob] : []]);
}
function mountForeground(mirror) {
  return new Promise((resolve) => {
    const p = spawn(fuseBinary(), mountArgs(mirror), { stdio: "inherit" });
    process.on("SIGINT", () => p.kill("SIGINT"));
    p.on("close", (code) => resolve(code ?? 0));
  });
}

// packages/cli-mirror/src/lib/pm2.js
var execAsync2 = promisify3(exec3);
var execFileAsync2 = promisify3(execFile2);
var processName = (mirror) => `canvas-fuse-${mirror.workspaceName}`.replace(/[^a-zA-Z0-9._-]+/g, "-");
var PM2_INSTALL = "npm install -g pm2";
async function requirePM2() {
  if (!await hasPM2()) throw new CanvasError(`PM2 not installed. \`${PM2_INSTALL}\``);
}
async function ensurePM2({ interactive = false, io } = {}) {
  if (await hasPM2()) return true;
  if (!interactive) return false;
  const choice = await select2("pm2 is not installed. It keeps mirrors running and restarts them at login.", [
    { label: "Install it now", value: "install", hint: PM2_INSTALL },
    { label: "Skip \u2014 start mirrors unsupervised", value: "skip", hint: "you can run `canvas remote mirror service install` later" }
  ]);
  if (choice !== "install") return false;
  const s = spinner2();
  s.start("Installing pm2\u2026");
  try {
    await execFileAsync2(process.platform === "win32" ? "npm.cmd" : "npm", ["install", "-g", "pm2"], { timeout: 3e5, maxBuffer: 16 * 1024 * 1024, shell: process.platform === "win32" });
  } catch (err) {
    const tail = String(err.stderr || err.message || "").trim().split("\n").slice(-3).join("\n");
    s.stop("pm2 install failed");
    io?.warn?.(`${tail}
Install it by hand (\`${PM2_INSTALL}\`, maybe with sudo) and run \`canvas remote mirror service install\`.`);
    return false;
  }
  if (await hasPM2()) {
    s.stop("pm2 installed");
    return true;
  }
  s.stop("pm2 installed, but not on PATH yet");
  io?.warn?.("Open a new shell (or fix npm's global bin PATH) and run `canvas remote mirror service install`.");
  return false;
}
async function startProcess(mirror) {
  await requirePM2();
  const name = processName(mirror);
  const existing = await getProcessInfo(name);
  if (existing && existing.pm2_env?.status === "online") return { name, started: false };
  if (existing) await execAsync2(`pm2 delete ${name}`).catch(() => {
  });
  const cfg = {
    name,
    script: fuseBinary(),
    args: mountArgs(mirror),
    interpreter: "none",
    env: pm2Env(),
    time: true,
    autorestart: true,
    max_restarts: 10,
    min_uptime: "10s",
    restart_delay: 5e3
  };
  await pm2Start(cfg);
  return { name, started: true };
}
async function stopProcess(mirror) {
  await requirePM2();
  const name = processName(mirror);
  const existing = await getProcessInfo(name);
  if (!existing) return { name, stopped: false };
  await execAsync2(`pm2 stop ${name}`).catch(() => {
  });
  await execAsync2(`pm2 delete ${name}`).catch(() => {
  });
  return { name, stopped: true };
}
async function restartProcess(mirror) {
  await stopProcess(mirror);
  return startProcess(mirror);
}
async function save() {
  await execAsync2("pm2 save").catch(() => {
  });
}
var STARTUP_HINT = "To start mirrors at login run `pm2 startup` once (follow its instructions), then `pm2 save`.";

// packages/cli-host/src/address.js
var import_debug = __toESM(require_src2(), 1);
var debug = (0, import_debug.default)("canvas:cli:address-parser");
function parseRemoteIdentifier(remoteId) {
  if (!remoteId || typeof remoteId !== "string") {
    return null;
  }
  const parts = remoteId.split("@");
  if (parts.length !== 2) {
    return null;
  }
  const [userIdentifier, remote] = parts;
  if (!userIdentifier.trim() || !remote.trim()) {
    return null;
  }
  return {
    userIdentifier: userIdentifier.trim(),
    remote: remote.trim(),
    full: remoteId,
    isLocal: isLocalRemote(remote.trim())
  };
}
function isLocalRemote(remote) {
  const localRemotes = [
    "canvas.local",
    "local",
    "localhost",
    "127.0.0.1",
    "::1"
  ];
  return localRemotes.includes(remote.toLowerCase());
}

// packages/cli-mirror/src/lib/hub.js
function unwrap2(res) {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.payload)) return res.payload;
  if (Array.isArray(res?.documents)) return res.documents;
  return res?.payload ?? res;
}
var NEW_HUB = /* @__PURE__ */ Symbol("new-hub");
async function resolveHub(flags, client, session2, { interactive = true, allowLogin = false, io } = {}) {
  if (flags.hub) {
    if (!client.getRemote(flags.hub)) throw new UsageError(`Unknown remote '${flags.hub}' \u2014 add it with \`canvas remote add\``);
    return flags.hub;
  }
  if (flags["hub-url"]) return loginToHub(client, session2, io, { url: flags["hub-url"], email: flags.email, password: flags.password, name: flags["hub-name"] });
  const ids = Object.keys(client.remotes());
  if (ids.length === 0) {
    if (allowLogin && interactive) return loginToHub(client, session2, io, {});
    throw new CanvasError("No remotes configured. Run `canvas remote add <user@name> <url>` first.");
  }
  const bound = session2.boundRemote();
  if (!allowLogin) {
    if (bound && client.getRemote(bound)) return bound;
    if (ids.length === 1 || !interactive) return ids[0];
  } else if (!interactive) {
    return bound && client.getRemote(bound) ? bound : ids[0];
  }
  const options = ids.map((id) => ({ label: `${id}  (${client.getRemote(id)?.url || "?"})${id === bound ? "  [current]" : ""}`, value: id }));
  if (allowLogin) options.push({ label: "log in to another Canvas server\u2026", value: NEW_HUB });
  options.sort((a2, b) => a2.value === bound ? -1 : b.value === bound ? 1 : 0);
  const picked = await select2("Which Canvas server (hub) should this device sync with?", options);
  return picked === NEW_HUB ? loginToHub(client, session2, io, {}) : picked;
}
async function loginToHub(client, session2, io, { url, email, password: pw, name }) {
  if (!url) url = (await input("Canvas server URL (e.g. https://canvas.example.org): ")).trim();
  if (!url) throw new UsageError("Hub URL required");
  if (!/^https?:\/\//i.test(url)) url = `https://${url}`;
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    throw new UsageError(`Invalid URL: ${url}`);
  }
  url = url.replace(/\/+$/, "");
  if (!email) email = (await input("Email: ")).trim();
  if (!email) throw new UsageError("Email required");
  if (!pw) pw = await password2("Password: ");
  if (!pw) throw new UsageError("Password required");
  if (!name) {
    const suggested = suggestHubName(parsed);
    name = (await input(`Short name for this server [${suggested}]: `)).trim() || suggested;
  }
  const user = email.split("@")[0].replace(/[^a-z0-9._-]/gi, "") || "user";
  const remoteId = `${user}@${name}`;
  if (!parseRemoteIdentifier(remoteId)) throw new UsageError(`Cannot build a remote id from '${email}' and '${name}'`);
  if (client.getRemote(remoteId)) {
    const existing = client.getRemote(remoteId);
    if (existing.url.replace(/\/+$/, "") !== url) throw new CanvasError(`Remote '${remoteId}' already points at ${existing.url}; pick another name`);
    io?.info(`Remote '${remoteId}' exists \u2014 refreshing its login`);
  } else {
    client.saveRemote(remoteId, { url, apiBase: "/rest/v2", version: null, auth: { method: "password", tokenType: "jwt", token: "" } });
  }
  client.clearCache(remoteId);
  let result;
  try {
    result = await client.client(remoteId).auth.login({ email, password: pw });
  } catch (e) {
    throw new CanvasError(`Login to ${url} failed: ${e.message}`);
  }
  const token = result?.token;
  if (!token) throw new CanvasError("Login response missing token");
  client.updateRemote(remoteId, { auth: { method: "token", tokenType: "jwt", token } });
  try {
    const info = await client.client(remoteId).ping();
    if (info?.version) client.updateRemote(remoteId, { version: info.version });
  } catch {
  }
  io?.success(`Logged in to ${url} as ${result?.user?.name || result?.user?.email || email} (remote '${remoteId}')`);
  if (!session2.boundRemote() || !client.getRemote(session2.boundRemote())) {
    session2.bindRemote(remoteId);
    session2.update({ boundRemoteStatus: "connected" });
    io?.info(`'${remoteId}' is now the default remote`);
  }
  try {
    await ensureDeviceRegistered(remoteId, client, io);
  } catch (e) {
    io?.warn(`Device registration skipped: ${e.message}`);
  }
  return remoteId;
}
function suggestHubName(parsed) {
  const host = parsed.hostname.replace(/^www\./, "");
  if (host === "localhost" || host === "127.0.0.1") return "local";
  const label = host.split(".")[0].replace(/[^a-z0-9-]/gi, "");
  return label || "hub";
}
async function listHubWorkspaces(client, remoteId) {
  const rc = client.client(remoteId);
  const list = unwrap2(await rc.workspaces.list());
  return (Array.isArray(list) ? list : []).map((w) => ({
    id: w.id,
    name: w.name,
    label: w.label || w.name,
    // Case-preserving folder name (server ≥ 2.8.2); older hubs: the label
    // when it is just the cased name, else the lowercase name.
    folderName: w.folderName || (w.rootPath ? w.rootPath.split(/[\\/]/).pop() : null) || (hubWorkspaceName(w.label || "").toLowerCase() === w.name ? hubWorkspaceName(w.label) : w.name),
    status: w.status,
    origin: w.origin
  })).filter((w) => w.name);
}
function findHubWorkspace(list, ref) {
  const needle = String(ref || "").trim();
  const lower = needle.toLowerCase();
  return list.find((w) => w.id === needle) || list.find((w) => w.name === lower) || list.find((w) => (w.folderName || "").toLowerCase() === lower) || list.find((w) => (w.label || "").toLowerCase() === lower) || null;
}
async function createHubWorkspace(client, remoteId, { name, label, description }) {
  const rc = client.client(remoteId);
  const res = await rc.workspaces.create({ name, label: label || name, description: description || "", type: "workspace" });
  const ws2 = res?.payload ?? res;
  if (!ws2?.id) throw new CanvasError(`Hub did not return the created workspace '${name}'`);
  return { id: ws2.id, name: ws2.name || name, label: ws2.label || label || name, status: ws2.status };
}
function hubWorkspaceName(name) {
  return String(name || "").trim().replace(/[\s.]+/g, "-").replace(/[^A-Za-z0-9-_]/g, "").replace(/^-+|-+$/g, "");
}

// packages/cli-mirror/src/lib/publish.js
import { existsSync as existsSync3, readdirSync, statSync } from "node:fs";
import os5 from "node:os";
import path5 from "node:path";
function parsePublishSpec(spec) {
  const text2 = String(spec || "").trim();
  if (!text2) throw new UsageError("Folder required");
  const at = text2.lastIndexOf(":");
  const tail = at > 0 ? text2.slice(at + 1) : "";
  const hasName = at > 1 && tail && !tail.includes(path5.sep) && !tail.includes("/");
  const folderRaw = hasName ? text2.slice(0, at) : text2;
  const folder = path5.resolve(folderRaw.replace(/^~(?=$|[\\/])/, os5.homedir()));
  const name = hubWorkspaceName(hasName ? tail : path5.basename(folder));
  if (!name) throw new UsageError(`Cannot derive a workspace name from '${text2}'`);
  return { folder, name };
}
function inspectFolder(folder) {
  if (!existsSync3(folder)) return { exists: false, entries: 0, isWorkspace: false, mirrored: null };
  if (!statSync(folder).isDirectory()) throw new UsageError(`${folder} is not a directory`);
  const entries = readdirSync(folder).filter((e) => e !== ".workspace");
  const isWorkspace = existsSync3(path5.join(folder, "workspace.json")) || existsSync3(path5.join(folder, ".workspace", "workspace.json"));
  const mirrored = listMirrors().find((m2) => m2.mountpoint === folder) || null;
  return { exists: true, entries: entries.length, isWorkspace, mirrored };
}
async function ensureHubWorkspace(client, remoteId, { name, label, description }, { onExisting = "fail", io } = {}) {
  const existing = findHubWorkspace(await listHubWorkspaces(client, remoteId), name);
  if (existing) {
    if (onExisting !== "attach") throw new UsageError(`Workspace '${name}' already exists on ${remoteId} \u2014 pass --attach to sync into it, or pick another name`);
    io?.info(`Using existing workspace '${name}' on ${remoteId}`);
    return { ws: existing, created: false };
  }
  const ws2 = await createHubWorkspace(client, remoteId, { name, label, description });
  io?.success(`Created workspace '${ws2.name}' on ${remoteId}`);
  return { ws: ws2, created: true };
}
function configurePublishedMirror({ remoteId, ws: ws2, folder, root, conflicts, deletes, managed, ignore = [] }) {
  if (findMirror(`${remoteId}/${ws2.name}`)) throw new UsageError(`'${ws2.name}' is already mirrored from ${remoteId}`);
  return upsertMirror(buildMirror({
    remoteId,
    workspaceId: ws2.id,
    workspaceName: ws2.name,
    folderName: ws2.folderName || path5.basename(folder),
    root,
    folder,
    client: "daemon",
    conflicts,
    deletes,
    managed,
    ignore
  }));
}

// packages/cli-mirror/src/lib/edge.js
import http from "node:http";
import os6 from "node:os";
import path7 from "node:path";
import { existsSync as existsSync5, statSync as statSync2 } from "node:fs";
import { fileURLToPath as fileURLToPath2 } from "node:url";
import { exec as exec4, execSync, spawn as spawn2 } from "node:child_process";
import { promisify as promisify5 } from "node:util";

// packages/cli-host/src/prefix-install.js
import { execFile as execFile3 } from "node:child_process";
import { existsSync as existsSync4, mkdirSync as mkdirSync4, readFileSync as readFileSync3, writeFileSync as writeFileSync4 } from "node:fs";
import path6 from "node:path";
import { promisify as promisify4 } from "node:util";
var execFileAsync3 = promisify4(execFile3);
var npmBin = () => process.platform === "win32" ? "npm.cmd" : "npm";
function prefixManifest(prefix, name, spec, label) {
  mkdirSync4(prefix, { recursive: true });
  writeFileSync4(path6.join(prefix, "package.json"), JSON.stringify({
    name: `canvas-prefix-${path6.basename(prefix)}`,
    private: true,
    description: label || `managed by the canvas CLI`,
    dependencies: { [name]: spec }
  }, null, 2) + "\n");
}
async function installIntoPrefix({ prefix, name, spec, update = false, label }) {
  prefixManifest(prefix, name, spec, label);
  const args = [update ? "update" : "install", "--ignore-scripts", "--no-audit", "--no-fund"];
  try {
    await execFileAsync3(npmBin(), args, { cwd: prefix, timeout: 9e5, maxBuffer: 32 * 1024 * 1024, shell: process.platform === "win32" });
  } catch (err) {
    const tail = String(err.stderr || err.message || "").trim().split("\n").filter((l2) => !/TAR_ENTRY_ERROR|deprecated|EBADENGINE|allow-scripts/.test(l2)).slice(-4).join("\n");
    throw new CanvasError(`npm ${args[0]} in ${prefix} failed:
${tail}`);
  }
  const dir = path6.join(prefix, "node_modules", name);
  if (!existsSync4(path6.join(dir, "package.json"))) throw new CanvasError(`${prefix} installed, but ${dir} is missing`);
  return dir;
}
function installedInPrefix(prefix, name) {
  try {
    const dir = path6.join(prefix, "node_modules", name);
    const pkg = JSON.parse(readFileSync3(path6.join(dir, "package.json"), "utf8"));
    return { version: pkg.version, rev: pkg.canvasRev || null, dir };
  } catch {
    return null;
  }
}

// packages/cli-mirror/src/lib/edge.js
var execAsync3 = promisify5(exec4);
var HERE2 = path7.dirname(fileURLToPath2(import.meta.url));
var EDGE_PM2_NAME = "canvas-edge";
var EDGE_SOCKET = process.platform === "win32" ? null : path7.join(CANVAS_HOME, "run", "edge.sock");
var EDGE_PORT = Number(process.env.CANVAS_EDGE_PORT) || 8802;
var EDGE_PACKAGE = process.env.CANVAS_EDGE_PACKAGE || "github:canvas-ui/canvas#edge-dist";
var EDGE_PKG_NAME = "@augmentd-labs/canvas-edge";
var EDGE_PREFIX = path7.join(CANVAS_HOME, "edge");
var EDGE_INSTALL = "canvas remote mirror edge install";
var npmGlobalRoot;
function npmRootGlobal() {
  if (npmGlobalRoot !== void 0) return npmGlobalRoot;
  try {
    npmGlobalRoot = String(execSync("npm root -g", { stdio: ["ignore", "pipe", "ignore"], timeout: 1e4 })).trim() || null;
  } catch {
    npmGlobalRoot = null;
  }
  return npmGlobalRoot;
}
function edgeBinary() {
  const globalRoot = npmRootGlobal();
  const configured = readConfig().edgeBin;
  const candidates = [
    process.env.CANVAS_EDGE_BIN,
    configured ? path7.join(configured, "bin", "canvas-edge") : null,
    configured,
    // `canvas remote mirror edge install` → ~/.canvas/edge/node_modules/…
    path7.join(EDGE_PREFIX, "node_modules", EDGE_PKG_NAME, "bin", "canvas-edge"),
    // a global install someone did by hand
    globalRoot ? path7.join(globalRoot, EDGE_PKG_NAME, "bin", "canvas-edge") : null,
    // Monorepo checkout (a compiled CLI has no such path).
    path7.resolve(HERE2, "../../../../../../runtimes/edge/bin/canvas-edge")
  ].filter(Boolean);
  for (const c2 of candidates) {
    try {
      if (statSync2(c2).isFile()) return c2;
    } catch {
    }
  }
  return "canvas-edge";
}
function request(method, urlPath, body) {
  return new Promise((resolve, reject) => {
    const headers = body !== void 0 ? { "content-type": "application/json" } : {};
    const opts = EDGE_SOCKET ? { socketPath: EDGE_SOCKET, path: urlPath, method, headers } : { host: "127.0.0.1", port: EDGE_PORT, path: urlPath, method, headers };
    const req = http.request(opts, (res) => {
      let data = "";
      res.on("data", (c2) => {
        data += c2;
      });
      res.on("end", () => {
        let json = null;
        try {
          json = JSON.parse(data || "null");
        } catch {
          json = data;
        }
        if (res.statusCode >= 400) reject(new CanvasError(json?.error || `canvas-edge ${res.statusCode}`));
        else resolve(json);
      });
    });
    req.on("error", (err) => reject(new CanvasError(`canvas-edge not running (${err.code || err.message})`)));
    req.setTimeout(3e4, () => {
      req.destroy(new Error("timeout"));
    });
    if (body !== void 0) req.write(JSON.stringify(body));
    req.end();
  });
}
async function edgeStatus() {
  return request("GET", "/status");
}
async function edgeReload() {
  return request("POST", "/reload");
}
async function edgeResync(id) {
  return request("POST", `/mirrors/${encodeURIComponent(id)}/resync`);
}
async function edgeRunning() {
  try {
    await edgeStatus();
    return true;
  } catch {
    return false;
  }
}
var sleep = (ms) => new Promise((r2) => setTimeout(r2, ms));
async function waitFor(pred, { timeout = 8e3, step = 250 } = {}) {
  const until = Date.now() + timeout;
  while (Date.now() < until) {
    if (await pred()) return true;
    await sleep(step);
  }
  return pred();
}
var EDGE_INSTALL_HINT = `canvas-edge not found. Run \`${EDGE_INSTALL}\` (fetches ${EDGE_PACKAGE} into ${EDGE_PREFIX}) or point CANVAS_EDGE_BIN at a checkout (runtimes/edge/bin/canvas-edge).`;
async function installEdge({ update = false } = {}) {
  const dir = await installIntoPrefix({ prefix: EDGE_PREFIX, name: EDGE_PKG_NAME, spec: EDGE_PACKAGE, update, label: "canvas-edge runtime managed by `canvas remote mirror edge`" });
  const bin = path7.join(dir, "bin", "canvas-edge");
  if (!existsSync5(bin)) throw new CanvasError(`${EDGE_PREFIX} installed, but ${bin} is missing`);
  return bin;
}
function installedEdge() {
  const inst = installedInPrefix(EDGE_PREFIX, EDGE_PKG_NAME);
  return inst ? { ...inst, prefix: EDGE_PREFIX } : null;
}
async function ensureEdge({ interactive = false, io } = {}) {
  if (await edgeAvailable()) return true;
  if (!interactive) return false;
  const choice = await select2("canvas-edge (the folder sync daemon) is not installed on this device.", [
    { label: "Install it now", value: "install", hint: `${EDGE_PACKAGE} \u2192 ${EDGE_PREFIX}` },
    { label: "Use a local monorepo checkout", value: "local", hint: "runtimes/edge \u2014 path is remembered in mirrors.json" },
    { label: "Skip", value: "skip", hint: "set CANVAS_EDGE_BIN and run `canvas remote mirror start all` later" }
  ]);
  if (choice === "local") {
    const raw = (await input({ message: "Path to runtimes/edge (or the canvas-edge script)", placeholder: "~/Code/canvas/runtimes/edge" })).trim();
    const p = path7.resolve(raw.replace(/^~(?=$|[\\/])/, os6.homedir()));
    const bin = existsSync5(path7.join(p, "bin", "canvas-edge")) ? path7.join(p, "bin", "canvas-edge") : existsSync5(p) && !statSync2(p).isDirectory() ? p : null;
    if (!bin) {
      io?.warn?.(`${p}: no bin/canvas-edge there`);
      return false;
    }
    setEdgeBin(bin);
    io?.success?.(`canvas-edge: ${bin}`);
    return true;
  }
  if (choice !== "install") return false;
  const s = spinner2();
  s.start(`Installing canvas-edge (${EDGE_PACKAGE}) into ${EDGE_PREFIX}\u2026`);
  try {
    await installEdge();
  } catch (err) {
    s.stop("canvas-edge install failed");
    io?.warn?.(`${err.message}
Retry with \`${EDGE_INSTALL}\` once the cause is fixed, then \`canvas remote mirror start all\`.`);
    return false;
  }
  npmGlobalRoot = void 0;
  if (await edgeAvailable()) {
    s.stop("canvas-edge installed");
    return true;
  }
  s.stop("canvas-edge installed, but not resolvable");
  io?.warn?.("Check `npm root -g` / your PATH, or set CANVAS_EDGE_BIN.");
  return false;
}
async function edgeAvailable() {
  const bin = edgeBinary();
  if (path7.isAbsolute(bin)) return true;
  try {
    await execAsync3(process.platform === "win32" ? `where ${bin}` : `command -v ${bin}`);
    return true;
  } catch {
    return false;
  }
}
function spawnError(err, bin) {
  if (err.code !== "ENOENT") return `canvas-edge failed to start: ${err.message}`;
  return path7.isAbsolute(bin) ? "canvas-edge needs Node.js on PATH (`node` was not found)." : EDGE_INSTALL_HINT;
}
function spawnDetached() {
  const bin = edgeBinary();
  return new Promise((resolve, reject) => {
    let child;
    try {
      const runtime = process.versions?.bun ? "node" : process.execPath;
      child = path7.isAbsolute(bin) ? spawn2(runtime, [bin], { detached: true, stdio: "ignore", env: { ...process.env } }) : spawn2(bin, [], { detached: true, stdio: "ignore", env: { ...process.env }, shell: process.platform === "win32" });
    } catch (err) {
      return reject(new CanvasError(spawnError(err, bin)));
    }
    child.once("error", (err) => reject(new CanvasError(spawnError(err, bin))));
    child.once("spawn", () => {
      child.unref();
      resolve();
    });
  });
}
async function ensureEdgeService(io, { managed = "pm2" } = {}) {
  if (!await edgeAvailable()) throw new CanvasError(EDGE_INSTALL_HINT);
  if (managed === "pm2") {
    if (!await hasPM2()) throw new CanvasError(`PM2 not installed. \`${PM2_INSTALL}\` (or start unsupervised with --no-service)`);
    const existing = await getProcessInfo(EDGE_PM2_NAME);
    if (existing && existing.pm2_env?.status === "online") {
      await edgeReload().catch(() => {
      });
      return { started: false };
    }
    if (existing) await execAsync3(`pm2 delete ${EDGE_PM2_NAME}`).catch(() => {
    });
    const cfg = {
      name: EDGE_PM2_NAME,
      script: edgeBinary(),
      args: ["--foreground"],
      interpreter: "node",
      env: pm2Env(),
      time: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: "10s",
      restart_delay: 5e3
    };
    await pm2Start(cfg);
    await execAsync3("pm2 save").catch(() => {
    });
    io?.info?.("canvas-edge started under pm2 (run `pm2 startup` once for login start).");
    return { started: true };
  }
  if (await edgeRunning()) {
    await edgeReload().catch(() => {
    });
    return { started: false };
  }
  await spawnDetached();
  if (!await waitFor(edgeRunning)) throw new CanvasError("canvas-edge did not come up \u2014 see ~/.canvas/var/log/canvas-edge.log (or run `canvas-edge --foreground`)");
  return { started: true };
}
async function restartEdgeService(io, { managed = "pm2" } = {}) {
  if (managed === "pm2" && await hasPM2()) {
    const existing = await getProcessInfo(EDGE_PM2_NAME);
    if (existing) {
      await execAsync3(`pm2 stop ${EDGE_PM2_NAME}`).catch(() => {
      });
      await execAsync3(`pm2 delete ${EDGE_PM2_NAME}`).catch(() => {
      });
    }
    return { ...await ensureEdgeService(io, { managed }), restarted: Boolean(existing) };
  }
  if (await edgeRunning()) {
    await request("POST", "/shutdown").catch(() => null);
    await waitFor(async () => !await edgeRunning());
  }
  return { ...await ensureEdgeService(io, { managed: "manual" }), restarted: true };
}
async function stopEdgeService() {
  let stopped = false;
  if (await hasPM2()) {
    const existing = await getProcessInfo(EDGE_PM2_NAME);
    if (existing) {
      await execAsync3(`pm2 stop ${EDGE_PM2_NAME}`).catch(() => {
      });
      await execAsync3(`pm2 delete ${EDGE_PM2_NAME}`).catch(() => {
      });
      stopped = true;
    }
  }
  if (await edgeRunning()) {
    await request("POST", "/shutdown").catch(() => null);
    await waitFor(async () => !await edgeRunning());
    stopped = true;
  }
  return stopped;
}

// packages/cli-mirror/src/lib/lifecycle.js
async function startMirrors(mirrors, io, { restart = false } = {}) {
  const daemon = mirrors.filter((m2) => m2.client === "daemon");
  const fuse = mirrors.filter((m2) => m2.client !== "daemon");
  const results = [];
  if (daemon.length) {
    for (const m2 of daemon) if (m2.paused) upsertMirror({ ...m2, paused: false });
    const managed = daemon.some((m2) => m2.managed === "pm2") ? "pm2" : "manual";
    try {
      const res = restart ? await restartEdgeService(io, { managed }) : await ensureEdgeService(io, { managed });
      const verb = res.restarted ? "Restarted" : res.started ? "Started" : "Reloaded";
      io.success(`${verb} canvas-edge for ${daemon.length} folder(s)${managed === "manual" ? " (unsupervised)" : ""}`);
      results.push(...daemon.map((m2) => ({ mirror: m2, ok: true })));
    } catch (e) {
      io.error(`canvas-edge: ${e.message}`);
      results.push(...daemon.map((m2) => ({ mirror: m2, ok: false, error: e.message })));
    }
  }
  if (fuse.length) {
    if (!await fuseAvailable()) {
      io.warn("canvas-fuse binary not found \u2014 FUSE mirrors are configured but not started. Install canvas-fuse (or set CANVAS_FUSE_BIN) and run `canvas remote mirror start all`.");
      results.push(...fuse.map((m2) => ({ mirror: m2, ok: false, error: "canvas-fuse not found" })));
      return results;
    }
    let usedPM2 = false;
    for (const mirror of fuse) {
      try {
        if (mirror.managed === "pm2") {
          usedPM2 = true;
          const { name, started } = restart ? await restartProcess(mirror) : await startProcess(mirror);
          io.success(`${restart ? "Restarted" : started ? "Started" : "Already running"}: ${name} \u2192 ${mirror.mountpoint}`);
        } else {
          if (restart) await unmount(mirror.mountpoint).catch(() => null);
          const res = await mount(mirror);
          if (!res.ok) throw new Error(res.stderr.trim() || res.stdout.trim() || "mount failed");
          io.success(`${restart ? "Remounted" : "Mounted"} ${mirror.mountpoint}`);
        }
        results.push({ mirror, ok: true });
      } catch (e) {
        io.error(`${mirror.workspaceName}: ${e.message}`);
        results.push({ mirror, ok: false, error: e.message });
      }
    }
    if (usedPM2) {
      await save();
      io.info(STARTUP_HINT);
    }
  }
  return results;
}

// packages/cli-mirror/src/actions/init.js
var init_default = {
  name: "init",
  description: "Set up this device: log in, mirror hub workspaces and/or publish local folders",
  flags: {
    hub: "string",
    "hub-url": "string",
    // log in to a new server non-interactively (with --email/--password)
    "hub-name": "string",
    email: "string",
    password: "string",
    root: "string",
    workspace: "string",
    // name[:sub/,sub2/], comma-separated — remote workspaces to mirror here
    publish: "string",
    // folder[:name], comma-separated — local folders to publish
    attach: "boolean",
    // publish into a same-named hub workspace if it already exists
    conflicts: "string",
    // prompt | rename
    deletes: "string",
    // propagate | keep
    client: "string",
    // fuse (default on Linux) | daemon (real folder via canvas-edge)
    service: "boolean",
    // --service: pm2 processes; --no-service: detached starts
    restart: "boolean",
    // also restart mirrors that were configured earlier
    "no-start": "boolean",
    yes: "boolean"
  },
  async run({ flags, client, session: session2, io }) {
    const interactive = !flags.yes;
    intro2("Canvas mirror setup");
    const existing = listMirrors();
    let action = "add";
    if (existing.length) {
      note2(existing.map((m2) => `${m2.workspaceName.padEnd(18)} ${m2.client === "daemon" ? "daemon" : "fuse  "}  ${m2.managed === "pm2" ? "pm2   " : "manual"}  ${m2.mountpoint}`).join("\n"), `${existing.length} mirror(s) already configured on this device`);
      if (flags.restart) action = flags.workspace || flags.publish ? "both" : "restart";
      else if (interactive) {
        action = await select2("What would you like to do?", [
          { label: "Add more", value: "add", hint: "mirror other workspaces or publish folders" },
          { label: "Restart the existing mirrors", value: "restart", hint: "stop + start everything configured" },
          { label: "Both", value: "both" }
        ]);
      }
    }
    const configured = [];
    if (action !== "restart") {
      const remoteId = await resolveHub(flags, client, session2, { interactive, allowLogin: true, io });
      log2.step(`Hub: ${remoteId} (${client.getRemote(remoteId)?.url || "?"})`);
      try {
        await ensureDeviceRegistered(remoteId, client, io);
      } catch (e) {
        log2.warn(`Device registration skipped: ${e.message}`);
      }
      let root = flags.root || readConfig().root || null;
      if (!root && interactive) {
        root = await input({ message: "Where should mirrored workspaces live?", defaultValue: defaultRoot(), placeholder: defaultRoot() });
      }
      root = path8.resolve((root || defaultRoot()).replace(/^~(?=$|[\\/])/, os7.homedir()));
      if (!existsSync6(root)) mkdirSync5(root, { recursive: true });
      setRoot(root);
      let mode;
      if (flags.workspace || flags.publish) mode = flags.workspace && flags.publish ? "both" : flags.workspace ? "mirror" : "publish";
      else if (interactive) {
        mode = await select2("What do you want to set up?", [
          { label: "Mirror workspaces from the hub", value: "mirror", hint: `as folders under ${root}` },
          { label: "Publish local folders as new workspaces", value: "publish", hint: "synced in place" },
          { label: "Both", value: "both" }
        ]);
      } else mode = "mirror";
      const { conflicts, deletes } = await pickModes(flags, interactive);
      const managed = await pickSupervision(flags, interactive, io) ? "pm2" : "manual";
      if (mode === "mirror" || mode === "both") {
        configured.push(...await setupMirrors({ flags, interactive, client, remoteId, root, conflicts, deletes, managed }));
      }
      if (mode === "publish" || mode === "both") {
        configured.push(...await setupPublishes({ flags, interactive, client, remoteId, root, conflicts, deletes, managed, io }));
      }
      if (configured.length === 0 && action === "add") {
        outro2("Nothing configured.");
        return;
      }
      if (configured.length) log2.success(`${configured.length} mirror(s) written to mirrors.json`);
    }
    if (noStart(flags)) {
      outro2("Configured (not started). `canvas remote mirror start all` when ready.");
      return;
    }
    const wio = { success: log2.success, error: log2.error, warn: log2.warn, info: log2.info };
    const results = [];
    if (configured.length) results.push(...await startMirrors(configured, wio));
    if (action !== "add") {
      const ids = new Set(configured.map((m2) => m2.id));
      const older = listMirrors().filter((m2) => !ids.has(m2.id));
      if (older.some((m2) => m2.client === "daemon")) await ensureEdge({ interactive, io: wio });
      if (older.length) results.push(...await startMirrors(older, wio, { restart: true }));
    }
    const failed = results.filter((r2) => !r2.ok);
    if (failed.length) outro2(`${failed.length} of ${results.length} mirror(s) did not start \u2014 fix the cause above, then \`canvas remote mirror start all\`.`);
    else outro2("Check progress with `canvas remote mirror status`; conflicts show up in Workspace \u203A Settings \u203A Sync.");
  }
};
async function pickModes(flags, interactive) {
  let conflicts = flags.conflicts;
  if (!conflicts && interactive) {
    conflicts = await select2("When a file changed here AND on the hub:", [
      { label: "Keep the hub version, park mine in the hub inbox", value: "prompt", hint: "decide later in the web UI (recommended)" },
      { label: "Keep both", value: "rename", hint: 'mine becomes "name (conflict from <device> <date>)"' }
    ]);
  }
  conflicts = conflicts || "prompt";
  if (!CONFLICT_MODES.includes(conflicts)) throw new UsageError(`--conflicts must be ${CONFLICT_MODES.join("|")}`);
  const deletes = flags.deletes || "propagate";
  if (!DELETE_MODES.includes(deletes)) throw new UsageError(`--deletes must be ${DELETE_MODES.join("|")}`);
  return { conflicts, deletes };
}
async function pickSupervision(flags, interactive, io) {
  if (flagOff("service") || noStart(flags)) return false;
  if (flags.service) {
    if (await ensurePM2({ interactive, io })) return true;
    if (!interactive) throw new UsageError("--service needs pm2 (`npm install -g pm2`), or pass --no-service");
    log2.warn("Continuing without pm2 \u2014 mirrors start detached and do not survive a reboot.");
    return false;
  }
  if (!interactive) return false;
  if (!await yesNo("Keep the sync running as a service (start at login, restart on crash)?", true)) return false;
  if (await ensurePM2({ interactive: true, io })) return true;
  log2.warn("Continuing without pm2 \u2014 mirrors start detached and do not survive a reboot.");
  return false;
}
async function setupMirrors({ flags, interactive, client, remoteId, root, conflicts, deletes, managed }) {
  const s = spinner2();
  s.start(`Listing workspaces on ${remoteId}\u2026`);
  let available;
  try {
    available = await listHubWorkspaces(client, remoteId);
  } finally {
    s.stop(`Workspaces on ${remoteId}`);
  }
  if (available.length === 0) {
    log2.warn(`No workspaces on ${remoteId} yet.`);
    return [];
  }
  const already = new Set(listMirrors().filter((m2) => m2.remote === remoteId).map((m2) => m2.workspaceName));
  let mirrorClient = flags.client;
  if (!mirrorClient && interactive) {
    const fuseOpt = { label: "FUSE mount", value: "fuse", hint: "everything visible, chosen folders offline, the rest on demand (Linux)" };
    const daemonOpt = { label: "Real folder", value: "daemon", hint: "canvas-edge keeps a full copy in sync (any OS, no FUSE)" };
    mirrorClient = await select2("How should the folders be provided?", process.platform === "linux" ? [fuseOpt, daemonOpt] : [daemonOpt, fuseOpt]);
  }
  mirrorClient = mirrorClient || (process.platform === "linux" ? "fuse" : "daemon");
  if (!CLIENTS.includes(mirrorClient)) throw new UsageError(`--client must be ${CLIENTS.join("|")}`);
  if (mirrorClient === "daemon" && !await ensureEdge({ interactive, io: log2 })) {
    log2.warn("canvas-edge is missing \u2014 folders are configured but will only sync once it is installed.");
  }
  let chosen = [];
  if (flags.workspace) {
    for (const spec of splitList(flags.workspace)) {
      const { name, pins } = parseWorkspaceSpec(spec);
      const ws2 = findHubWorkspace(available, name);
      if (!ws2) throw new UsageError(`Workspace '${name}' not found on ${remoteId}`);
      chosen.push({ ws: ws2, pins });
    }
  } else if (interactive) {
    const options = available.filter((ws2) => !already.has(ws2.name)).map((ws2) => ({
      label: ws2.folderName,
      value: ws2,
      hint: `${ws2.label && ws2.label !== ws2.folderName ? `${ws2.label} \xB7 ` : ""}${path8.join(root, ws2.folderName)}`
    }));
    if (options.length === 0) {
      log2.info(`Every workspace on ${remoteId} is already mirrored here.`);
      return [];
    }
    const picked = await multiSelect(`Workspaces to mirror on this device (${available.length - options.length} already mirrored)`, options);
    chosen = picked.map((ws2) => ({ ws: ws2, pins: [] }));
    if (chosen.length) await askPins(chosen, mirrorClient);
  } else {
    chosen = available.filter((ws2) => !already.has(ws2.name)).map((ws2) => ({ ws: ws2, pins: [] }));
  }
  if (chosen.length === 0) return [];
  const out = [];
  for (const { ws: ws2, pins } of chosen) {
    if (findMirror(`${remoteId}/${ws2.name}`)) {
      log2.info(`${ws2.name}: already mirrored, skipping`);
      continue;
    }
    const target = path8.join(root, ws2.folderName);
    if (existsSync6(target) && readdirSync2(target).some((e) => e !== ".workspace")) {
      if (mirrorClient === "fuse") {
        log2.warn(`${target} is not empty \u2014 a FUSE mount needs an empty mountpoint. Move its contents away, or use the real-folder client (merges the folder into the workspace).`);
        if (interactive && !await yesNo(`Skip '${ws2.name}' for now?`, true)) throw new UsageError(`Empty ${target} first`);
        continue;
      }
      if (interactive && !await yesNo(`${target} already has files \u2014 merge them into '${ws2.name}' (they are uploaded, nothing is deleted)?`, true)) continue;
    }
    out.push(upsertMirror(buildMirror({
      remoteId,
      workspaceId: ws2.id,
      workspaceName: ws2.name,
      folderName: ws2.folderName,
      root,
      pins,
      conflicts,
      deletes,
      client: mirrorClient,
      managed
    })));
    log2.success(`${ws2.folderName} \u2192 ${target}`);
  }
  return out;
}
async function askPins(chosen, mirrorClient) {
  const question = mirrorClient === "fuse" ? "Keep some folders available offline? (default: everything on demand)" : "Limit the sync to some folders? (default: the whole workspace)";
  if (!await yesNo(question, false)) return;
  for (const item of chosen) {
    const raw = await input({
      message: `${item.ws.folderName}: folders, comma-separated`,
      placeholder: mirrorClient === "fuse" ? "Docs/, Projects/current/  (empty = on demand)" : "Docs/, Projects/  (empty = everything)"
    });
    item.pins = raw.trim() ? parseWorkspaceSpec(`${item.ws.name}:${raw}`).pins : [];
  }
}
async function setupPublishes({ flags, interactive, client, remoteId, root, conflicts, deletes, managed, io }) {
  const specs = [];
  if (flags.publish) {
    for (const raw of splitList(flags.publish)) specs.push(parsePublishSpec(raw));
  } else if (interactive) {
    log2.message("Folders to publish as workspaces \u2014 one per prompt, `folder:name` to pick the name, leave empty to finish.");
    for (; ; ) {
      const raw = (await input({ message: "Folder", placeholder: "~/Code/UI  (empty = done)" })).trim();
      if (!raw) break;
      try {
        specs.push(parsePublishSpec(raw));
      } catch (e) {
        log2.warn(e.message);
      }
    }
  }
  if (specs.length && !await ensureEdge({ interactive, io: log2 })) {
    log2.warn("canvas-edge is missing \u2014 published folders will only sync once it is installed.");
  }
  const out = [];
  for (const spec of specs) {
    const info = inspectFolder(spec.folder);
    if (!info.exists) {
      log2.warn(`${spec.folder}: does not exist, skipping`);
      continue;
    }
    if (info.isWorkspace) {
      log2.warn(`${spec.folder}: already a Canvas workspace (workspace.json), skipping`);
      continue;
    }
    if (info.mirrored) {
      log2.info(`${spec.folder}: already mirrored as ${info.mirrored.id}, skipping`);
      continue;
    }
    let name = spec.name;
    if (interactive) {
      name = await input({ message: `${spec.folder} (${info.entries} entries) \u2192 workspace name`, defaultValue: spec.name, placeholder: spec.name });
    }
    let result;
    try {
      result = await ensureHubWorkspace(client, remoteId, { name, label: name }, { onExisting: flags.attach ? "attach" : "fail", io });
    } catch (e) {
      if (!interactive || !/already exists/.test(e.message)) throw e;
      if (!await yesNo(`Workspace '${name}' already exists on ${remoteId} \u2014 sync this folder into it?`, false)) {
        log2.info(`${spec.folder}: skipped`);
        continue;
      }
      result = await ensureHubWorkspace(client, remoteId, { name, label: name }, { onExisting: "attach", io });
    }
    out.push(configurePublishedMirror({ remoteId, ws: result.ws, folder: spec.folder, root, conflicts, deletes, managed }));
    log2.success(`${spec.folder} \u2194 ${remoteId}/${result.ws.name}`);
  }
  return out;
}

// packages/cli-mirror/src/actions/add.js
import { existsSync as existsSync7, mkdirSync as mkdirSync6 } from "node:fs";
import path9 from "node:path";
var add_default = {
  name: "add",
  description: "Mirror one more workspace on this device",
  positional: [{ name: "workspace", required: true }],
  flags: { hub: "string", root: "string", pin: "string", ignore: "string", conflicts: "string", deletes: "string", client: "string", "cache-budget-mb": "string", service: "boolean", "no-start": "boolean" },
  async run({ args, flags, client, session: session2, io }) {
    const { name, pins: specPins } = parseWorkspaceSpec(args.workspace);
    const remoteId = await resolveHub(flags, client, session2, { interactive: !flags.yes });
    const ws2 = findHubWorkspace(await listHubWorkspaces(client, remoteId), name);
    if (!ws2) throw new UsageError(`Workspace '${name}' not found on ${remoteId}`);
    if (findMirror(`${remoteId}/${ws2.name}`)) throw new UsageError(`'${ws2.name}' is already mirrored from ${remoteId}`);
    const root = path9.resolve(flags.root || readConfig().root || "");
    if (!root || root === path9.resolve("")) throw new UsageError("No mirror root yet \u2014 run `canvas remote mirror init` or pass --root");
    if (!existsSync7(root)) mkdirSync6(root, { recursive: true });
    if (!readConfig().root) setRoot(root);
    const mirror = upsertMirror(buildMirror({
      remoteId,
      workspaceId: ws2.id,
      workspaceName: ws2.name,
      folderName: ws2.folderName,
      root,
      pins: [...specPins, ...splitList(flags.pin).map((p) => parseWorkspaceSpec(`x:${p}`).pins[0])],
      ignore: splitList(flags.ignore),
      conflicts: flags.conflicts || "prompt",
      deletes: flags.deletes || "propagate",
      managed: flags.service ? "pm2" : "manual",
      client: flags.client || (process.platform === "linux" ? "fuse" : "daemon"),
      ...flags["cache-budget-mb"] ? { cacheBudgetMb: Number(flags["cache-budget-mb"]) } : {}
    }));
    io.success(`Configured ${mirror.id} \u2192 ${mirror.mountpoint}`);
    if (noStart(flags)) return;
    await startMirrors([mirror], io);
  }
};

// packages/cli-mirror/src/actions/publish.js
var publish_default = {
  name: "publish",
  description: "Publish a local folder as a new workspace on the hub and keep it in sync",
  positional: [{ name: "folder", required: true }],
  flags: { hub: "string", name: "string", label: "string", attach: "boolean", conflicts: "string", deletes: "string", ignore: "string", service: "boolean", "no-start": "boolean", yes: "boolean" },
  async run({ args, flags, client, session: session2, io }) {
    const interactive = !flags.yes;
    const spec = parsePublishSpec(flags.name ? `${args.folder}:${flags.name}` : args.folder);
    const info = inspectFolder(spec.folder);
    if (!info.exists) throw new UsageError(`${spec.folder} does not exist`);
    if (info.isWorkspace) throw new UsageError(`${spec.folder} already is a Canvas workspace (workspace.json) \u2014 a runtime, not a mirror. Move the files into a plain folder first.`);
    if (info.mirrored) throw new UsageError(`${spec.folder} is already mirrored as ${info.mirrored.id}`);
    const remoteId = await resolveHub(flags, client, session2, { interactive, io });
    const conflicts = flags.conflicts || "prompt";
    if (!CONFLICT_MODES.includes(conflicts)) throw new UsageError(`--conflicts must be ${CONFLICT_MODES.join("|")}`);
    const deletes = flags.deletes || "propagate";
    if (!DELETE_MODES.includes(deletes)) throw new UsageError(`--deletes must be ${DELETE_MODES.join("|")}`);
    let managed = "manual";
    if (flags.service) {
      if (await ensurePM2({ interactive, io })) managed = "pm2";
      else if (!interactive) throw new UsageError("--service needs pm2 (`npm install -g pm2`)");
      else io.warn("Continuing without pm2 \u2014 canvas-edge starts detached.");
    }
    if (interactive && !await yesNo(`Publish ${spec.folder} (${info.entries} entries) as workspace '${spec.name}' on ${remoteId}?`, true)) return;
    const { ws: ws2, created } = await ensureHubWorkspace(client, remoteId, { name: spec.name, label: flags.label || spec.name }, { onExisting: flags.attach ? "attach" : "fail", io });
    const mirror = configurePublishedMirror({
      remoteId,
      ws: ws2,
      folder: spec.folder,
      root: readConfig().root || void 0,
      conflicts,
      deletes,
      ignore: splitList(flags.ignore),
      managed
    });
    io.success(`${created ? "Publishing" : "Syncing"} ${mirror.mountpoint} \u2194 ${remoteId}/${ws2.name}`);
    if (noStart(flags)) return;
    const { started } = await ensureEdgeService(io, { managed });
    io.success(`${started ? "Started" : "Reloaded"} canvas-edge \u2014 first upload runs in the background (\`canvas remote mirror status\`)`);
  }
};

// packages/cli-mirror/src/actions/remove.js
var remove_default = {
  name: "remove",
  aliases: ["rm"],
  description: "Stop mirroring a workspace on this device (files in the cache are kept until the data dir is cleaned)",
  positional: [{ name: "workspace", required: true }],
  async run({ args, io }) {
    const mirror = findMirror(args.workspace);
    if (!mirror) throw new UsageError(`No mirror for '${args.workspace}'`);
    if (mirror.client === "daemon") {
      removeMirror(mirror.id);
      await edgeReload().catch(() => null);
      io.success(`Removed ${mirror.id} (folder left in place)`);
      return;
    }
    if (mirror.managed === "pm2") {
      await stopProcess(mirror).catch((e) => io.warn(e.message));
    }
    const res = await unmount(mirror.mountpoint).catch(() => ({ ok: false, stderr: "canvas-fuse not available" }));
    if (!res.ok) io.warn(`Unmount: ${String(res.stderr || "").trim() || "not mounted"}`);
    removeMirror(mirror.id);
    io.success(`Removed ${mirror.id}`);
  }
};

// packages/cli-mirror/src/actions/list.js
var list_default = {
  name: "list",
  aliases: ["ls"],
  description: "Mirrors configured on this device",
  async run({ io }) {
    const mirrors = listMirrors();
    if (mirrors.length === 0) {
      io.info("No mirrors. Run `canvas remote mirror init`.");
      return;
    }
    const running = await statusAll().catch(() => []);
    const byMount = new Map(running.map((m2) => [m2.mountpoint, m2]));
    io.output(mirrors.map((m2) => {
      const st = byMount.get(m2.mountpoint);
      return {
        id: m2.id,
        workspace: m2.workspaceName,
        hub: m2.remote,
        client: m2.client || "fuse",
        mountpoint: m2.mountpoint,
        pins: (m2.pins || []).join(", ") || "(on demand)",
        conflicts: m2.conflicts,
        managed: m2.managed,
        mount: st ? st.status || "ok" : "not running",
        state: st?.mirror?.state || "-"
      };
    }), { columns: ["id", "workspace", "hub", "client", "mountpoint", "pins", "conflicts", "managed", "mount", "state"] });
  }
};

// packages/cli-mirror/src/actions/status.js
var status_default = {
  name: "status",
  description: "Sync state of each mirror (local daemon + hub view)",
  positional: [{ name: "workspace", required: false }],
  async run({ args, client, io }) {
    const mirrors = args.workspace ? [findMirror(args.workspace)].filter(Boolean) : listMirrors();
    if (mirrors.length === 0) {
      io.info("No mirrors. Run `canvas remote mirror init`.");
      return;
    }
    const running = await statusAll().catch(() => []);
    const byMount = new Map(running.map((m2) => [m2.mountpoint, m2]));
    const edge = mirrors.some((m2) => m2.client === "daemon") ? await edgeStatus().catch(() => null) : null;
    const edgeById = new Map((edge?.mirrors || []).map((m2) => [m2.id, m2]));
    const rows = [];
    for (const m2 of mirrors) {
      const isDaemon = m2.client === "daemon";
      const st = isDaemon ? edgeById.get(m2.id) ? { status: "ok" } : null : byMount.get(m2.mountpoint);
      const mi = isDaemon ? edgeById.get(m2.id) || {} : st?.mirror || {};
      let hubLag = "-";
      try {
        const rc = client.client(m2.remote);
        const remoteMirrors = unwrap2(await rc.workspaces.sync.mirrors(m2.workspaceName));
        const mine = Array.isArray(remoteMirrors) ? remoteMirrors.find((r2) => r2.mirror?.path === m2.mountpoint) || remoteMirrors[0] : null;
        if (mine && mine.lag != null) hubLag = String(mine.lag);
      } catch {
      }
      rows.push({
        workspace: m2.workspaceName,
        client: m2.client || "fuse",
        mount: st ? st.status || "ok" : "down",
        state: mi.state || "-",
        cursor: mi.cursor != null ? `${mi.cursor}/${mi.head ?? "?"}` : "-",
        pending: mi.pending ?? "-",
        failed: mi.failed ?? "-",
        conflicts: mi.conflicts ?? "-",
        lag: hubLag,
        cache: mi.cacheUsed != null ? `${Math.round(mi.cacheUsed / 1048576)}/${Math.round((mi.cacheBudget || 0) / 1048576)} MB` : "-",
        lastSync: mi.lastSync || "-",
        error: mi.lastError || ""
      });
    }
    io.output(rows, { columns: ["workspace", "client", "mount", "state", "cursor", "pending", "failed", "conflicts", "lag", "cache", "lastSync", "error"] });
  }
};

// packages/cli-mirror/src/actions/start.js
var start_default = {
  name: "start",
  description: "Start a mirror (or `all`)",
  positional: [{ name: "workspace", required: true }],
  flags: { foreground: "boolean" },
  async run({ args, flags, io }) {
    const targets = args.workspace === "all" ? listMirrors() : [findMirror(args.workspace)].filter(Boolean);
    if (targets.length === 0) throw new UsageError(`No mirror for '${args.workspace}'`);
    if (flags.foreground) {
      if (targets.length !== 1) throw new UsageError("--foreground runs exactly one mirror");
      const code = await mountForeground(targets[0]);
      process.exitCode = code;
      return;
    }
    await startMirrors(targets, io);
  }
};

// packages/cli-mirror/src/actions/stop.js
var stop_default = {
  name: "stop",
  description: "Unmount a mirror (or `all`); the cache and queue stay for the next start",
  positional: [{ name: "workspace", required: true }],
  async run({ args, io }) {
    const targets = args.workspace === "all" ? listMirrors() : [findMirror(args.workspace)].filter(Boolean);
    if (targets.length === 0) throw new UsageError(`No mirror for '${args.workspace}'`);
    const daemonTargets = targets.filter((m2) => m2.client === "daemon");
    if (daemonTargets.length) {
      for (const m2 of daemonTargets) upsertMirror({ ...m2, paused: true });
      if (args.workspace === "all") {
        await stopEdgeService().catch(() => false);
        io.success("canvas-edge stopped");
      } else {
        await edgeReload().catch(() => null);
        io.success(`${daemonTargets.map((m2) => m2.workspaceName).join(", ")}: paused`);
      }
    }
    for (const mirror of targets.filter((m2) => m2.client !== "daemon")) {
      if (mirror.managed === "pm2") {
        const { name, stopped } = await stopProcess(mirror).catch((e) => {
          io.warn(e.message);
          return { name: mirror.id, stopped: false };
        });
        io.success(`${stopped ? "Stopped" : "Not running"}: ${name}`);
      }
      const res = await unmount(mirror.mountpoint);
      if (res.ok) io.success(`Unmounted ${mirror.mountpoint}`);
      else io.info(`${mirror.mountpoint}: ${res.stderr.trim() || "not mounted"}`);
    }
  }
};

// packages/cli-mirror/src/actions/restart.js
var restart_default = {
  name: "restart",
  description: "Stop and start a mirror (or `all`) \u2014 picks up config changes and revives dead mounts",
  positional: [{ name: "workspace", required: true }],
  async run({ args, io }) {
    const targets = args.workspace === "all" ? listMirrors() : [findMirror(args.workspace)].filter(Boolean);
    if (targets.length === 0) throw new UsageError(`No mirror for '${args.workspace}'`);
    await startMirrors(targets, io, { restart: true });
  }
};

// packages/cli-mirror/src/actions/sync.js
var sync_default = {
  name: "sync",
  description: "Reconcile now instead of waiting for the next poll",
  positional: [{ name: "workspace", required: false }],
  async run({ args, io }) {
    const targets = args.workspace ? [findMirror(args.workspace)].filter(Boolean) : listMirrors();
    if (targets.length === 0) {
      io.warn("No such mirror");
      return;
    }
    for (const mirror of targets) {
      if (mirror.client === "daemon") {
        try {
          await edgeResync(mirror.id);
          io.success(`${mirror.workspaceName}: reconciled`);
        } catch (e) {
          io.warn(`${mirror.workspaceName}: ${e.message}`);
        }
        continue;
      }
      const res = await syncNow(mirror.mountpoint);
      if (res.ok) io.success(`${mirror.workspaceName}: sync requested`);
      else io.warn(`${mirror.workspaceName}: ${res.stderr.trim() || "daemon not running"}`);
    }
  }
};

// packages/cli-mirror/src/actions/pin.js
var pin_default = {
  name: "pin",
  description: "Keep a folder offline: `pin add|rm|list <workspace> [<folder|glob>]`",
  positional: [{ name: "op", required: true }, { name: "workspace", required: true }, { name: "glob", required: false }],
  async run({ args, io }) {
    const mirror = findMirror(args.workspace);
    if (!mirror) throw new UsageError(`No mirror for '${args.workspace}'`);
    const op = String(args.op);
    if (op === "list") {
      io.output((mirror.pins || []).map((p) => ({ pin: p })), { columns: ["pin"] });
      return;
    }
    if (!["add", "rm", "remove"].includes(op)) throw new UsageError("op must be add | rm | list");
    if (!args.glob) throw new UsageError("A folder or glob is required");
    const glob = parseWorkspaceSpec(`x:${args.glob}`).pins[0];
    const pins = new Set(mirror.pins || []);
    if (op === "add") pins.add(glob);
    else pins.delete(glob);
    upsertMirror({ ...mirror, pins: [...pins] });
    const res = await pin(mirror.mountpoint, op === "add" ? "add" : "rm", glob);
    if (res.ok) io.success(`${op === "add" ? "Pinned" : "Unpinned"} ${glob} (${mirror.workspaceName})`);
    else io.warn(`Saved to config; daemon not updated (${res.stderr.trim() || "not running"}) \u2014 takes effect on next start`);
  }
};

// packages/cli-mirror/src/actions/conflicts.js
var conflicts_default = {
  name: "conflicts",
  description: "Open sync conflicts on the hub; resolve with --resolve <docId> --keep hub|incoming|both",
  positional: [{ name: "workspace", required: false }],
  flags: { resolve: "string", keep: "string" },
  async run({ args, flags, client, io }) {
    const targets = args.workspace ? [findMirror(args.workspace)].filter(Boolean) : listMirrors();
    if (targets.length === 0) throw new UsageError("No mirrors configured");
    if (flags.resolve) {
      if (targets.length !== 1) throw new UsageError("Name the workspace when resolving");
      if (!["hub", "incoming", "both"].includes(flags.keep)) throw new UsageError("--keep must be hub | incoming | both");
      const m2 = targets[0];
      const res = await client.client(m2.remote).workspaces.sync.resolveConflict(m2.workspaceName, Number(flags.resolve), flags.keep);
      const out = unwrap2(res);
      io.success(`Resolved ${flags.resolve}: keep ${flags.keep}${out?.resultKey ? ` \u2192 ${out.resultKey}` : ""}`);
      return;
    }
    const rows = [];
    for (const m2 of targets) {
      let list = [];
      try {
        list = unwrap2(await client.client(m2.remote).workspaces.sync.conflicts(m2.workspaceName)) || [];
      } catch (e) {
        io.warn(`${m2.workspaceName}: ${e.message}`);
        continue;
      }
      for (const c2 of list) {
        rows.push({
          workspace: m2.workspaceName,
          docId: c2.docId,
          key: c2.key,
          device: c2.deviceName || c2.device || "",
          when: c2.ts || "",
          hub: c2.hub ? `${String(c2.hub.sha256 || "").slice(0, 10)} ${c2.hub.size ?? ""}B` : "(gone)",
          incoming: `${String(c2.incoming?.sha256 || "").slice(0, 10)} ${c2.incoming?.size ?? ""}B`,
          resolvable: c2.resolvable ? "yes" : "copy on disk"
        });
      }
    }
    if (rows.length === 0) {
      io.success("No conflicts");
      return;
    }
    io.output(rows, { columns: ["workspace", "docId", "key", "device", "when", "hub", "incoming", "resolvable"] });
    io.info("Resolve: canvas mirror conflicts <workspace> --resolve <docId> --keep hub|incoming|both");
  }
};

// packages/cli-mirror/src/actions/service.js
var service_default = {
  name: "service",
  description: "pm2 supervision for all mirrors: `service install|uninstall`",
  positional: [{ name: "op", required: true }],
  async run({ args, io }) {
    const op = String(args.op);
    if (!["install", "uninstall"].includes(op)) throw new UsageError("op must be install | uninstall");
    if (op === "install" && !await ensurePM2({ interactive: process.stdin.isTTY, io })) await requirePM2();
    const mirrors = listMirrors();
    if (mirrors.length === 0) throw new UsageError("No mirrors configured");
    const daemon = mirrors.filter((m2) => m2.client === "daemon");
    if (daemon.length) {
      if (op === "install") {
        await stopEdgeService().catch(() => false);
        await ensureEdgeService(io, { managed: "pm2" });
      } else {
        await stopEdgeService().catch(() => false);
        await ensureEdgeService(io, { managed: "manual" }).catch((e) => io.warn(e.message));
      }
      for (const mirror of daemon) upsertMirror({ ...mirror, managed: op === "install" ? "pm2" : "manual" });
      io.success(`canvas-edge ${op === "install" ? "now runs under pm2" : "runs detached"} (${daemon.length} folder(s))`);
    }
    for (const mirror of mirrors.filter((m2) => m2.client !== "daemon")) {
      if (op === "install") {
        const { name, started } = await startProcess(mirror);
        upsertMirror({ ...mirror, managed: "pm2" });
        io.success(`${started ? "Started" : "Running"}: ${name}`);
      } else {
        const { name } = await stopProcess(mirror);
        upsertMirror({ ...mirror, managed: "manual" });
        io.success(`Removed from pm2: ${name}`);
      }
    }
    await save();
    if (op === "install") io.info(STARTUP_HINT);
  }
};

// packages/cli-mirror/src/actions/logs.js
import { spawn as spawn3 } from "node:child_process";
var logs_default = {
  name: "logs",
  description: "Stream a pm2-managed mirror's logs",
  positional: [{ name: "workspace", required: true }],
  flags: { lines: "string" },
  async run({ args, flags }) {
    const mirror = findMirror(args.workspace);
    if (!mirror) throw new UsageError(`No mirror for '${args.workspace}'`);
    if (mirror.managed !== "pm2") throw new UsageError("This mirror is not pm2-managed; see ~/.local/state/canvas-fuse/mounts/*.log");
    await requirePM2();
    return new Promise((resolve) => {
      const p = spawn3("pm2", ["logs", processName(mirror), "--lines", flags.lines || "50"], { stdio: "inherit" });
      process.on("SIGINT", () => p.kill("SIGINT"));
      p.on("close", () => resolve());
    });
  }
};

// packages/cli-mirror/src/actions/edge.js
var edge_default = {
  name: "edge",
  description: "canvas-edge runtime: `edge install | update | status`",
  positional: [{ name: "op", required: false }],
  flags: { restart: "boolean" },
  async run({ args, flags, io }) {
    const op = String(args.op || "status");
    if (op === "status") {
      const inst2 = installedEdge();
      io.output({
        binary: await edgeAvailable() ? edgeBinary() : "(not found)",
        prefix: EDGE_PREFIX,
        installed: inst2 ? `${inst2.version}${inst2.rev ? ` (main@${inst2.rev})` : ""}` : "-",
        package: EDGE_PACKAGE
      });
      return;
    }
    if (!["install", "update"].includes(op)) throw new UsageError("op must be install | update | status");
    io.info(`${op === "update" ? "Updating" : "Installing"} ${EDGE_PACKAGE} in ${EDGE_PREFIX}\u2026`);
    const bin = await installEdge({ update: op === "update" });
    const inst = installedEdge();
    io.success(`canvas-edge ${inst?.version || ""}${inst?.rev ? ` (main@${inst.rev})` : ""} \u2192 ${bin}`);
    if (flags.restart || op === "update") {
      const daemon = listMirrors().filter((m2) => m2.client === "daemon");
      if (daemon.length) {
        const managed = daemon.some((m2) => m2.managed === "pm2") ? "pm2" : "manual";
        await restartEdgeService(io, { managed });
        io.success(`Restarted canvas-edge for ${daemon.length} folder(s)`);
      }
    }
  }
};

// packages/cli-mirror/src/lib/dist.js
var CLI_VERSION_HEADER = "canvas-cli";
async function distManifest(repo, branch) {
  const abort = new AbortController();
  const timer = setTimeout(() => abort.abort(), 2e4);
  try {
    const res = await fetch(`https://raw.githubusercontent.com/${repo}/${branch}/package.json`, { headers: { "user-agent": CLI_VERSION_HEADER }, signal: abort.signal });
    if (res.status === 404) return null;
    if (!res.ok) throw new CanvasError(`${repo}#${branch}: HTTP ${res.status}`);
    const json = await res.json();
    return { version: json.version || null, rev: json.canvasRev || null };
  } catch (err) {
    if (err instanceof CanvasError) throw err;
    throw new CanvasError(`${repo}#${branch}: ${abort.signal.aborted ? "timed out" : err?.cause?.message || err.message}`);
  } finally {
    clearTimeout(timer);
  }
}

// packages/cli-mirror/src/lib/service.js
var edgeService = {
  id: "edge",
  label: "canvas-edge",
  description: `folder-sync daemon (${EDGE_PACKAGE} \u2192 ${EDGE_PREFIX})`,
  async installed() {
    const inst = installedEdge();
    return inst ? { version: inst.version, rev: inst.rev, dir: inst.dir } : null;
  },
  async latest() {
    const m2 = /#([\w./-]+)$/.exec(EDGE_PACKAGE);
    if (!m2 || !EDGE_PACKAGE.startsWith("github:")) return null;
    return distManifest(EDGE_PACKAGE.slice("github:".length, m2.index), m2[1]);
  },
  async update({ onStep } = {}) {
    onStep?.(`npm update in ${EDGE_PREFIX}\u2026`);
    const before = installedEdge();
    await installEdge({ update: true });
    const after = installedEdge();
    return { before: before ? `${before.version}${before.rev ? ` (${before.rev})` : ""}` : null, after: after ? `${after.version}${after.rev ? ` (${after.rev})` : ""}` : null };
  },
  async restart({ io } = {}) {
    const daemon = listMirrors().filter((m2) => m2.client === "daemon");
    if (!daemon.length) return { skipped: "no daemon mirrors, nothing to restart" };
    const managed = daemon.some((m2) => m2.managed === "pm2") ? "pm2" : "manual";
    await restartEdgeService(io, { managed });
    return { restarted: true };
  }
};

// packages/cli-mirror/src/index.js
var index_default = {
  name: "mirror",
  description: "Mirror workspaces to ~/Workspaces on this device (remote mirror \u2026)",
  aliases: ["mirrors"],
  pluralAlias: "mirrors",
  defaultAction: "status",
  defaultPluralAction: "list",
  needsConnection: false,
  actions: [init_default, add_default, publish_default, remove_default, list_default, status_default, start_default, stop_default, restart_default, sync_default, pin_default, conflicts_default, service_default, logs_default, edge_default],
  submodules: [],
  // Local services `canvas update` checks and refreshes (see apps/cli/src/modules/update/lib.js).
  services: [edgeService]
};
export {
  index_default as default
};
