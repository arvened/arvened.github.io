/* EU Price Index — product feed validator (runs fully in the browser; the file never leaves the device).
   One spec object per channel; add a new channel = add a new spec. Currently: Ceneo (PL). */
(function () {
  "use strict";

  // ---------- helpers ----------
  function gtinOk(code) {
    if (!/^\d{8}$|^\d{12,14}$/.test(code)) return false;
    var d = code.split("").map(Number), check = d.pop(), sum = 0;
    for (var i = d.length - 1, w = 3; i >= 0; i--, w = w === 3 ? 1 : 3) sum += d[i] * w;
    return (10 - (sum % 10)) % 10 === check;
  }
  function txt(el) { return el ? (el.textContent || "").trim() : ""; }
  function child(el, name) {
    for (var c = el.firstElementChild; c; c = c.nextElementSibling) if (c.localName === name) return c;
    return null;
  }
  function isAbsUrl(u) { return /^https?:\/\/[^\s/]+\.[^\s]+$/i.test(u); }

  // ---------- Ceneo spec ----------
  var CENEO = {
    id: "ceneo",
    avail: ["1", "3", "7", "14", "90", "99", "110"],
    groups: ["other", "books", "tires", "rims", "perfumes", "music", "games", "movies", "medicines", "grocery", "clothes"],
    check: function (doc, add) {
      var root = doc.documentElement;
      if (!root || root.localName !== "offers") { add("E", "root", null); return 0; }
      if (!root.getAttribute("version")) add("W", "noversion", null);
      var offers = root.getElementsByTagName("o");
      if (!offers.length) { add("E", "nooffers", null); return 0; }
      var ids = {}, urls = {}, self = this;
      var groups = root.getElementsByTagName("group");
      for (var g = 0; g < groups.length; g++) {
        var gn = groups[g].getAttribute("name");
        if (gn && self.groups.indexOf(gn) < 0) add("W", "group", null, gn);
      }
      for (var i = 0; i < offers.length; i++) {
        var o = offers[i], id = (o.getAttribute("id") || "").trim(), ref = id || "#" + (i + 1);
        if (!id) add("E", "noid", ref);
        else if (ids[id]) add("E", "dupid", ref); else ids[id] = 1;
        if (id && id.length > 100) add("W", "longid", ref);

        var url = (o.getAttribute("url") || "").trim();
        if (!url) add("E", "nourl", ref);
        else if (!isAbsUrl(url)) add("E", "badurl", ref, url);
        else if (urls[url]) add("W", "dupurl", ref); else urls[url] = 1;

        var price = o.getAttribute("price");
        if (price === null || price.trim() === "") add("E", "noprice", ref);
        else if (/,/.test(price)) add("E", "pricecomma", ref, price);
        else if (!/^\d+(\.\d{1,2})?$/.test(price.trim())) add("E", "badprice", ref, price);
        else if (parseFloat(price) <= 0) add("E", "zeroprice", ref, price);

        var av = o.getAttribute("avail");
        if (av === null) add("W", "noavail", ref);
        else if (self.avail.indexOf(av.trim()) < 0) add("E", "badavail", ref, av);

        var st = o.getAttribute("stock");
        if (st !== null && !/^\d+$/.test(st.trim())) add("E", "badstock", ref, st);
        ["set", "basket"].forEach(function (a) {
          var v = o.getAttribute(a);
          if (v !== null && v !== "0" && v !== "1") add("E", "bad01", ref, a + "=" + v);
        });
        var w = o.getAttribute("weight");
        if (w !== null && !/^\d+(\.\d+)?$/.test(w.trim())) add("W", "badweight", ref, w);

        var name = txt(child(o, "name"));
        if (!name) add("E", "noname", ref);
        else if (name.length > 150) add("W", "longname", ref, name.length);
        if (!txt(child(o, "cat"))) add("E", "nocat", ref);

        var imgs = child(o, "imgs"), main = imgs && child(imgs, "main");
        var murl = main ? (main.getAttribute("url") || "").trim() : "";
        if (!murl) add("W", "noimg", ref);
        else if (!isAbsUrl(murl)) add("E", "badimg", ref, murl);
        if (!txt(child(o, "desc"))) add("I", "nodesc", ref);

        var attrs = child(o, "attrs"), hasProd = false, hasEan = false;
        if (attrs) {
          for (var a = attrs.firstElementChild; a; a = a.nextElementSibling) {
            var an = (a.getAttribute("name") || "").toLowerCase();
            if (an === "producent") hasProd = !!txt(a);
            if (an === "ean" || an === "gtin") {
              var ev = txt(a).replace(/\s/g, "");
              if (ev) { hasEan = true; if (!gtinOk(ev)) add("E", "badean", ref, ev); }
            }
          }
        }
        if (!hasProd) add("W", "noprod", ref);
        if (!hasEan) add("W", "noean", ref);
      }
      return offers.length;
    }
  };

  // ---------- messages ----------
  var MSG = {
    pl: {
      root: "Główny znacznik musi być <offers>. To nie wygląda na plik Ceneo.",
      noversion: "Brak atrybutu version w <offers> (zwykle version=\"1\").",
      nooffers: "W pliku nie ma żadnej oferty <o>.",
      group: "Nieznana nazwa grupy <group name>",
      noid: "Brak atrybutu id", dupid: "Powtórzone id — każda oferta musi mieć unikalne id",
      longid: "Bardzo długie id", nourl: "Brak atrybutu url", badurl: "url nie jest pełnym adresem http(s)",
      dupurl: "Ten sam url w kilku ofertach", noprice: "Brak ceny (price)",
      pricecomma: "Cena z przecinkiem — wymagana kropka, np. 19.99", badprice: "Niepoprawny format ceny",
      zeroprice: "Cena 0 lub ujemna", noavail: "Brak avail (dostępności) — Ceneo przyjmie, ale klient nie zobaczy terminu",
      badavail: "Niedozwolona wartość avail (dozwolone: 1, 3, 7, 14, 90, 99, 110)",
      badstock: "stock musi być liczbą całkowitą", bad01: "Dozwolone tylko 0 lub 1", badweight: "Niepoprawna waga",
      noname: "Brak nazwy <name>", longname: "Bardzo długa nazwa (znaków)", nocat: "Brak kategorii <cat>",
      noimg: "Brak zdjęcia <imgs><main url>", badimg: "Adres zdjęcia nie jest pełnym adresem http(s)",
      nodesc: "Brak opisu <desc>", badean: "Błędny kod EAN (zła cyfra kontrolna lub długość)",
      noprod: "Brak atrybutu Producent", noean: "Brak kodu EAN — trudniej dopasować produkt",
      parse: "Plik nie jest poprawnym XML", E: "Błędy", W: "Ostrzeżenia", I: "Wskazówki",
      offers: "Ofert w pliku", ok: "Nie znaleziono błędów krytycznych.", bad: "Plik ma błędy, które mogą zablokować oferty.",
      empty: "Wklej treść pliku albo wybierz plik.", times: "razy", examples: "np. oferty",
      cors: "Ten serwer nie pozwala przeglądarce pobrać pliku. Pobierz plik i wybierz go powyżej albo wklej treść."
    },
    en: {
      root: "The root element must be <offers>. This does not look like a Ceneo file.",
      noversion: "Missing version attribute on <offers> (usually version=\"1\").",
      nooffers: "The file contains no <o> offers.",
      group: "Unknown <group name>",
      noid: "Missing id attribute", dupid: "Duplicate id — every offer needs a unique id",
      longid: "Very long id", nourl: "Missing url attribute", badurl: "url is not a full http(s) address",
      dupurl: "Same url used in several offers", noprice: "Missing price",
      pricecomma: "Price uses a comma — a dot is required, e.g. 19.99", badprice: "Invalid price format",
      zeroprice: "Price is 0 or negative", noavail: "Missing avail (availability)",
      badavail: "Invalid avail value (allowed: 1, 3, 7, 14, 90, 99, 110)",
      badstock: "stock must be a whole number", bad01: "Only 0 or 1 allowed", badweight: "Invalid weight",
      noname: "Missing <name>", longname: "Very long name (characters)", nocat: "Missing <cat> category",
      noimg: "Missing image <imgs><main url>", badimg: "Image url is not a full http(s) address",
      nodesc: "Missing <desc> description", badean: "Invalid EAN (wrong check digit or length)",
      noprod: "Missing Producent (manufacturer) attribute", noean: "Missing EAN — harder to match the product",
      parse: "The file is not valid XML", E: "Errors", W: "Warnings", I: "Tips",
      offers: "Offers in file", ok: "No critical errors found.", bad: "The file has errors that can block offers.",
      empty: "Paste the file content or choose a file.", times: "times", examples: "e.g. offers",
      cors: "This server does not let the browser download the file. Download it and choose it above, or paste the content."
    }
  };

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  function validate(xml, lang) {
    var m = MSG[lang] || MSG.en, issues = {};
    function add(level, code, ref, val) {
      var k = level + ":" + code, it = issues[k] || (issues[k] = { level: level, code: code, n: 0, refs: [] });
      it.n++; if (it.refs.length < 5 && ref) it.refs.push(ref + (val !== undefined ? " (" + val + ")" : ""));
    }
    var doc = new DOMParser().parseFromString(xml, "application/xml");
    var err = doc.getElementsByTagName("parsererror");
    if (err.length) {
      var pm = txt(err[0]).replace(/This page contains the following errors:|Below is a rendering of the page up to the first error\.?/g, "").trim();
      return { parse: pm.slice(0, 400), m: m };
    }
    var count = CENEO.check(doc, add);
    var list = Object.keys(issues).map(function (k) { return issues[k]; });
    var order = { E: 0, W: 1, I: 2 };
    list.sort(function (a, b) { return order[a.level] - order[b.level] || b.n - a.n; });
    return { count: count, list: list, m: m };
  }

  function render(res, out) {
    var m = res.m;
    if (res.parse) { out.innerHTML = '<p class="bad"><b>' + m.parse + ':</b></p><pre>' + esc(res.parse) + "</pre>"; return; }
    var nE = 0, nW = 0;
    res.list.forEach(function (i) { if (i.level === "E") nE += i.n; else if (i.level === "W") nW += i.n; });
    var h = '<p><b>' + m.offers + ': ' + res.count + '</b> · ' + m.E + ': ' + nE + ' · ' + m.W + ': ' + nW + '</p>';
    h += nE ? '<p class="bad">' + m.bad + "</p>" : '<p class="good">' + m.ok + "</p>";
    ["E", "W", "I"].forEach(function (lv) {
      var items = res.list.filter(function (i) { return i.level === lv; });
      if (!items.length) return;
      h += "<h3>" + m[lv] + "</h3><ul>";
      items.forEach(function (i) {
        h += "<li><b>" + esc(m[i.code] || i.code) + "</b> — " + i.n + " " + m.times +
          (i.refs.length ? '<br><span class="mut">' + m.examples + ": " + esc(i.refs.join(", ")) + "</span>" : "") + "</li>";
      });
      h += "</ul>";
    });
    out.innerHTML = h;
  }

  // ---------- page wiring ----------
  window.addEventListener("DOMContentLoaded", function () {
    var lang = document.documentElement.lang === "pl" ? "pl" : "en";
    var ta = document.getElementById("xml"), file = document.getElementById("file"),
      url = document.getElementById("url"), btn = document.getElementById("run"), out = document.getElementById("out");
    if (!ta || !btn) return;
    function go(text) { out.hidden = false; render(validate(text, lang), out); out.scrollIntoView({ behavior: "smooth" }); }
    file.addEventListener("change", function () {
      var f = file.files[0]; if (!f) return;
      var r = new FileReader(); r.onload = function () { ta.value = ""; go(r.result); }; r.readAsText(f);
    });
    btn.addEventListener("click", function () {
      var u = url && url.value.trim();
      if (u) {
        fetch(u).then(function (r) { return r.text(); }).then(go).catch(function () {
          out.hidden = false; out.innerHTML = '<p class="bad">' + MSG[lang].cors + "</p>";
        });
        return;
      }
      if (!ta.value.trim()) { out.hidden = false; out.innerHTML = "<p>" + MSG[lang].empty + "</p>"; return; }
      go(ta.value);
    });
  });

  window.FeedValidator = { validate: validate, gtinOk: gtinOk };
})();
