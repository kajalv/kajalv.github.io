(function () {
  "use strict";

  var root = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------------
     Theme toggle
     ------------------------------------------------------------------ */
  var themeBtn = document.querySelector(".theme-toggle");
  var darkQuery = window.matchMedia("(prefers-color-scheme: dark)");

  function currentTheme() {
    return root.dataset.theme || (darkQuery.matches ? "dark" : "light");
  }

  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      root.dataset.theme = next;
      try {
        localStorage.setItem("theme", next);
      } catch (e) {}
    });
  }

  /* ------------------------------------------------------------------
     Mobile nav
     ------------------------------------------------------------------ */
  var navToggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");

  function setNavOpen(open) {
    nav.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
  }

  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      setNavOpen(!nav.classList.contains("is-open"));
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setNavOpen(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        setNavOpen(false);
        navToggle.focus();
      }
    });
  }

  /* ------------------------------------------------------------------
     Header border on scroll + scroll-spy for nav
     ------------------------------------------------------------------ */
  var header = document.querySelector(".site-header");
  var navLinks = nav ? Array.prototype.slice.call(nav.querySelectorAll("a[href^='#']")) : [];

  function onScroll() {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if ("IntersectionObserver" in window && navLinks.length) {
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          navLinks.forEach(function (link) {
            if (link.getAttribute("href") === "#" + entry.target.id) {
              link.setAttribute("aria-current", "true");
            } else {
              link.removeAttribute("aria-current");
            }
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    navLinks.forEach(function (link) {
      var section = document.getElementById(link.getAttribute("href").slice(1));
      if (section) spy.observe(section);
    });
  }

  /* ------------------------------------------------------------------
     Live clock (San Diego time) and footer year
     ------------------------------------------------------------------ */
  var clock = document.querySelector(".clock");
  if (clock && window.Intl) {
    var fmt = new Intl.DateTimeFormat("en-US", {
      timeZone: clock.dataset.tz,
      hour: "numeric",
      minute: "2-digit",
    });
    var tick = function () {
      clock.textContent = fmt.format(new Date());
    };
    tick();
    setInterval(tick, 15000);
  }

  var year = document.querySelector(".year");
  if (year) year.textContent = new Date().getFullYear();

  /* ------------------------------------------------------------------
     Career uptime chart
     Dates are "YYYY-MM"; end: null means ongoing.
     ------------------------------------------------------------------ */
  var CAREER = [
    { lane: "work", kind: "Work", items: [
      { start: "2014-05", end: "2014-07", title: "Intern", org: "RailTel" },
      { start: "2015-05", end: "2015-07", title: "SWE Intern, TurboTax Android", org: "Intuit India" },
      { start: "2016-08", end: "2018-01", title: "Software Engineer 1", org: "Intuit India" },
      { start: "2018-02", end: "2018-08", title: "Software Engineer 2", org: "Intuit India" },
      { start: "2019-05", end: "2019-08", title: "SWE Intern, Core Tax Services", org: "Intuit" },
      { start: "2020-01", end: "2021-07", title: "Software Engineer 2", org: "Intuit" },
      { start: "2021-08", end: "2024-01", title: "Senior Software Engineer", org: "Intuit" },
      { start: "2024-02", end: null, title: "Staff Software Engineer", org: "Intuit" },
    ] },
    { lane: "study", kind: "Study", items: [
      { start: "2012-08", end: "2016-07", title: "B.E. (Hons.) Computer Science", org: "BITS Pilani, Goa" },
      { start: "2018-08", end: "2019-12", title: "M.S. Computer Science", org: "Georgia Tech" },
    ] },
    { lane: "teach", kind: "Teaching", items: [
      { start: "2015-01", end: "2015-05", title: "Professional Assistant, Computer Programming", org: "BITS Pilani, Goa" },
      { start: "2015-08", end: "2015-12", title: "TA, Computer Architecture", org: "BITS Pilani, Goa" },
      { start: "2019-01", end: "2019-05", title: "TA, CS 6262 Network Security", org: "Georgia Tech" },
      { start: "2019-08", end: "2019-12", title: "TA, CS 6262 Network Security", org: "Georgia Tech" },
    ] },
  ];

  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  function toMonths(ym) {
    var p = ym.split("-");
    return Number(p[0]) * 12 + Number(p[1]) - 1;
  }

  function label(m) {
    return MONTHS[m % 12] + " " + Math.floor(m / 12);
  }

  function duration(n) {
    var y = Math.floor(n / 12);
    var mo = n % 12;
    return [y ? y + "y" : "", mo ? mo + "m" : ""].join(" ").trim();
  }

  var chart = document.getElementById("uptime-chart");
  var readout = document.getElementById("uptime-readout");

  if (chart) {
    var now = new Date();
    var nowM = now.getFullYear() * 12 + now.getMonth();
    var startYear = 2012;
    var startM = startYear * 12;
    var endM = nowM + 3; // a little breathing room after "now"
    var span = endM - startM;
    var pct = function (m) {
      return ((m - startM) / span) * 100;
    };

    chart.style.setProperty("--year", (12 / span) * 100 + "%");

    var segs = [];
    var i = 0;
    var frag = document.createDocumentFragment();

    CAREER.forEach(function (group) {
      var lane = document.createElement("div");
      lane.className = "lane";

      group.items.forEach(function (item) {
        var s = toMonths(item.start);
        var e = item.end ? toMonths(item.end) + 1 : nowM + 1;
        var seg = document.createElement("span");
        seg.className = "seg seg-" + group.lane + (item.end ? "" : " seg-now");
        seg.style.left = pct(s) + "%";
        seg.style.width = pct(e) - pct(s) + "%";
        seg.style.setProperty("--i", i++);
        seg.dataset.text =
          item.title + " · " + item.org + "  —  " +
          label(s) + " → " + (item.end ? label(e - 1) : "now") +
          " (" + duration(e - s) + ")";
        lane.appendChild(seg);
        segs.push(seg);
      });

      frag.appendChild(lane);
    });

    var ticks = document.createElement("div");
    ticks.className = "ticks";
    for (var y = startYear; y * 12 < endM - 4; y += 1) {
      var t = document.createElement("span");
      t.style.left = pct(y * 12) + "%";
      t.textContent = "’" + String(y).slice(2);
      if (y === startYear) t.style.transform = "none";
      if ((y - startYear) % 2) t.className = "tick-minor";
      ticks.appendChild(t);
    }
    frag.appendChild(ticks);
    chart.appendChild(frag);

    var defaultText = "Hover or tap a segment for details";
    readout.textContent = defaultText;

    var activate = function (seg) {
      segs.forEach(function (s) {
        s.classList.toggle("is-active", s === seg);
      });
      chart.classList.toggle("is-hovering", !!seg);
      readout.textContent = seg ? seg.dataset.text : defaultText;
    };

    chart.addEventListener("pointerover", function (e) {
      if (e.target.classList.contains("seg")) activate(e.target);
    });
    chart.addEventListener("pointerleave", function () {
      activate(null);
    });
    // Tap support on touch screens
    chart.addEventListener("click", function (e) {
      activate(e.target.classList.contains("seg") ? e.target : null);
    });
  }

  /* ------------------------------------------------------------------
     Project filters
     ------------------------------------------------------------------ */
  var filters = Array.prototype.slice.call(document.querySelectorAll(".filter"));
  var projects = Array.prototype.slice.call(document.querySelectorAll(".project"));
  var count = document.querySelector(".filter-count");
  var COLLAPSED = 6;
  var expanded = false;
  var moreBtn = document.createElement("button");
  moreBtn.type = "button";
  moreBtn.className = "show-more";
  moreBtn.textContent = "Show all " + projects.length + " projects";
  moreBtn.addEventListener("click", function () {
    expanded = true;
    applyFilter("all");
  });
  if (projects.length) projects[0].parentNode.after(moreBtn);

  function applyFilter(tag) {
    var shown = 0;
    var collapse = tag === "all" && !expanded;
    moreBtn.hidden = !collapse;
    projects.forEach(function (p, idx) {
      var match = tag === "all" || p.dataset.tags.split(" ").indexOf(tag) !== -1;
      if (collapse && idx >= COLLAPSED) match = false;
      var wasHidden = p.hidden;
      p.hidden = !match;
      if (match) {
        shown++;
        if (wasHidden && !reduceMotion) {
          p.classList.remove("is-entering");
          void p.offsetWidth;
          p.classList.add("is-entering");
        }
      }
    });
    filters.forEach(function (f) {
      f.setAttribute("aria-pressed", String(f.dataset.filter === tag));
    });
    if (count) count.textContent = shown + " / " + projects.length;
  }

  filters.forEach(function (f) {
    f.addEventListener("click", function () {
      applyFilter(f.dataset.filter);
    });
  });
  if (filters.length) applyFilter("all");
})();
