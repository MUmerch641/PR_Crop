!(function (e, n, t) {
  function o(e, n) {
    return typeof e === n;
  }
  function s() {
    return "function" != typeof n.createElement
      ? n.createElement(arguments[0])
      : u
      ? n.createElementNS.call(n, "http://www.w3.org/2000/svg", arguments[0])
      : n.createElement.apply(n, arguments);
  }
  function i() {
    var e = n.body;
    return e || ((e = s(u ? "svg" : "body")), (e.fake = !0)), e;
  }
  function a(e, t, o, a) {
    var r,
      f,
      l,
      d,
      u = "modernizr",
      p = s("div"),
      h = i();
    if (parseInt(o, 10))
      for (; o--; )
        (l = s("div")), (l.id = a ? a[o] : u + (o + 1)), p.appendChild(l);
    return (
      (r = s("style")),
      (r.type = "text/css"),
      (r.id = "s" + u),
      (h.fake ? h : p).appendChild(r),
      h.appendChild(p),
      r.styleSheet
        ? (r.styleSheet.cssText = e)
        : r.appendChild(n.createTextNode(e)),
      (p.id = u),
      h.fake &&
        ((h.style.background = ""),
        (h.style.overflow = "hidden"),
        (d = c.style.overflow),
        (c.style.overflow = "hidden"),
        c.appendChild(h)),
      (f = t(p, e)),
      h.fake
        ? (h.parentNode.removeChild(h), (c.style.overflow = d), c.offsetHeight)
        : p.parentNode.removeChild(p),
      !!f
    );
  }
  var r = [],
    f = {
      _version: "3.6.0",
      _config: {
        classPrefix: "",
        enableClasses: !0,
        enableJSClass: !0,
        usePrefixes: !0,
      },
      _q: [],
      on: function (e, n) {
        var t = this;
        setTimeout(function () {
          n(t[e]);
        }, 0);
      },
      addTest: function (e, n, t) {
        r.push({ name: e, fn: n, options: t });
      },
      addAsyncTest: function (e) {
        r.push({ name: null, fn: e });
      },
    },
    l = function () {};
  (l.prototype = f), (l = new l());
  var d = [],
    c = n.documentElement,
    u = "svg" === c.nodeName.toLowerCase();
  l.addTest("history", function () {
    var n = navigator.userAgent;
    return (
      ((-1 === n.indexOf("Android 2.") && -1 === n.indexOf("Android 4.0")) ||
        -1 === n.indexOf("Mobile Safari") ||
        -1 !== n.indexOf("Chrome") ||
        -1 !== n.indexOf("Windows Phone") ||
        "file:" === location.protocol) &&
      e.history &&
      "pushState" in e.history
    );
  });
  var p = (function () {
    function e(e, n) {
      var i;
      return (
        !!e &&
        ((n && "string" != typeof n) || (n = s(n || "div")),
        (e = "on" + e),
        (i = e in n),
        !i &&
          o &&
          (n.setAttribute || (n = s("div")),
          n.setAttribute(e, ""),
          (i = "function" == typeof n[e]),
          n[e] !== t && (n[e] = t),
          n.removeAttribute(e)),
        i)
      );
    }
    var o = !("onblur" in n.documentElement);
    return e;
  })();
  (f.hasEvent = p), l.addTest("inputsearchevent", p("search"));
  var h = f._config.usePrefixes
    ? " -webkit- -moz- -o- -ms- ".split(" ")
    : ["", ""];
  f._prefixes = h;
  var v = (f.testStyles = a);
  l.addTest("touchevents", function () {
    var t;
    if ("ontouchstart" in e || (e.DocumentTouch && n instanceof DocumentTouch))
      t = !0;
    else {
      var o = [
        "@media (",
        h.join("touch-enabled),("),
        "heartz",
        ")",
        "{#modernizr{top:9px;position:absolute}}",
      ].join("");
      v(o, function (e) {
        t = 9 === e.offsetTop;
      });
    }
    return t;
  }),
    (function () {
      var e, n, t, s, i, a, f;
      for (var c in r)
        if (r.hasOwnProperty(c)) {
          if (
            ((e = []),
            (n = r[c]),
            n.name &&
              (e.push(n.name.toLowerCase()),
              n.options && n.options.aliases && n.options.aliases.length))
          )
            for (t = 0; t < n.options.aliases.length; t++)
              e.push(n.options.aliases[t].toLowerCase());
          for (
            s = o(n.fn, "function") ? n.fn() : n.fn, i = 0;
            i < e.length;
            i++
          )
            (a = e[i]),
              (f = a.split(".")),
              1 === f.length
                ? (l[f[0]] = s)
                : (!l[f[0]] ||
                    l[f[0]] instanceof Boolean ||
                    (l[f[0]] = new Boolean(l[f[0]])),
                  (l[f[0]][f[1]] = s)),
              d.push((s ? "" : "no-") + f.join("-"));
        }
    })(),
    (function (e) {
      var n = c.className,
        t = l._config.classPrefix || "";
      if ((u && (n = n.baseVal), l._config.enableJSClass)) {
        var o = new RegExp("(^|\\s)" + t + "no-js(\\s|$)");
        n = n.replace(o, "$1" + t + "js$2");
      }
      l._config.enableClasses &&
        ((n += " " + t + e.join(" " + t)),
        u ? (c.className.baseVal = n) : (c.className = n));
    })(d),
    delete f.addTest,
    delete f.addAsyncTest;
  for (var m = 0; m < l._q.length; m++) l._q[m]();
  e.Modernizr = l;
})(window, document);
