// ===== Fitflex — THE REP: SCROLL-DRIVEN LIFT ENGINE =====
// Sections don't fade in here, they get lifted. Every tracked element is
// assigned a movement whose tempo curve is shaped like the strength curve of
// the real exercise: a deadlift grinds off the floor and accelerates past the
// knee, a squat rebounds out of the hole, a row snaps in and settles.
//
// The engine writes exactly two custom properties per element:
//   --p   eased progress of the rep (0 = bar on the floor, 1 = locked out)
//   --ip  its inverse
// All geometry lives in styles.css, expressed with the independent
// translate/rotate/scale properties so it composes with the cursor-tilt
// transforms app.js writes to .transform.

const Lifts = (() => {
  const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v);

  // Tempo curves, one per movement.
  const TEMPO = {
    // Sticky off the floor, fast through the mid-range, slow into lockout.
    deadlift: p => p * p * (2.4 - 1.4 * p),
    // Rebounds out of the hole and overshoots slightly at the top.
    squat: p => 1 + 2.1 * Math.pow(p - 1, 3) + 1.1 * Math.pow(p - 1, 2),
    bench: p => 1 - Math.pow(1 - p, 3),
    press: p => 1 - Math.pow(1 - p, 4),
    curl: p => 1 + 1.9 * Math.pow(p - 1, 3) + 0.9 * Math.pow(p - 1, 2),
    row: p => (p >= 1 ? 1 : 1 - Math.pow(2, -9 * p)),
    snatch: p => (p >= 1 ? 1 : 1 - Math.pow(2, -12 * p)),
    plyo: p => {
      const n = 7.5625, d = 2.75;
      if (p < 1 / d) return n * p * p;
      if (p < 2 / d) return n * (p -= 1.5 / d) * p + 0.75;
      if (p < 2.5 / d) return n * (p -= 2.25 / d) * p + 0.9375;
      return n * (p -= 2.625 / d) * p + 0.984375;
    },
    crossover: p => 1 - Math.pow(1 - p, 2)
  };

  // Where in the viewport each movement starts and finishes its rep,
  // as fractions of viewport height measured against the element's top edge.
  const WINDOW = {
    deadlift: [1.0, 0.3],
    squat: [0.95, 0.35],
    crossover: [1.0, 0.25],
    default: [0.92, 0.45]
  };

  // Movements that every page gets for free.
  const AUTO = [
    ['.section-title', 'squat'],
    ['.section-subtitle', 'press'],
    ['.shop-hero h1, .blog-hero h1, .shop-hero p, .blog-hero p', 'press'],
    ['.section-cta', 'snatch'],
    ['.set-label', 'press']
  ];

  const tracked = [];
  const registered = new WeakSet();
  let reduced = false;
  let queued = false;
  let hud = null;
  let docHeight = 0;

  // ---- registration ----------------------------------------------------

  function add(el, type, opts) {
    if (registered.has(el)) return;
    const win = WINDOW[type] || WINDOW.default;
    registered.add(el);
    // The engine owns this element's reveal now, not the fade-in observer.
    el.classList.remove('fade-in', 'visible');
    el.dataset.lift = type;
    tracked.push({
      el,
      type,
      ease: TEMPO[type] || TEMPO.bench,
      start: opts.start || win[0],
      end: opts.end || win[1],
      delay: opts.delay || 0,
      hook: opts.hook || null,
      locked: false,
      top: null
    });
  }

  // Picks up anything tagged since the last scan: data-lift on an element, or
  // data-lift-group on a container, which racks up its children with a
  // stagger so a grid loads one plate at a time.
  function scan() {
    // Standing assignments first, so static markup stays readable.
    AUTO.forEach(([selector, type]) => {
      document.querySelectorAll(selector).forEach(el => {
        // Never nest a rep inside another rep: the transforms would compound.
        if (el.closest('[data-lift]')) return;
        el.setAttribute('data-lift', type);
      });
    });

    document.querySelectorAll('[data-lift]:not([data-lift-ready])').forEach(el => {
      el.setAttribute('data-lift-ready', '');
      add(el, el.dataset.lift, { delay: parseFloat(el.dataset.liftDelay) || 0 });
    });

    document.querySelectorAll('[data-lift-group]').forEach(group => {
      const type = group.dataset.liftGroup;
      Array.from(group.children).forEach((child, i) => {
        if (registered.has(child)) return;
        child.setAttribute('data-lift-ready', '');
        child.style.setProperty('--row-dir', i % 2 ? 1 : -1);
        child.style.setProperty('--curl-dir', i % 2 ? 1 : -1);
        add(child, type, { delay: Math.min(i * 0.07, 0.45) });
      });
    });

    measure();

    if (reduced) settle();
    else request();
  }

  // Positions are read in layout space via the offset chain, never from
  // getBoundingClientRect: a rep displaces its own element, so measuring the
  // painted box would feed the animation back into its own input.
  function measure() {
    for (const t of tracked) {
      if (t.el.offsetParent === null) {
        t.top = null;
        continue;
      }
      let y = 0;
      for (let node = t.el; node; node = node.offsetParent) y += node.offsetTop;
      t.top = y;
    }
    if (hud) hud.measure();
    docHeight = document.documentElement.scrollHeight;
  }

  // Sends every rep to lockout — used for reduced-motion and as a safety net.
  function settle() {
    tracked.forEach(t => write(t, 1));
  }

  // A page swap re-racks the bar: everything inside starts back on the floor.
  function reset(container) {
    if (reduced || !container) return;
    measure();
    tracked.forEach(t => {
      if (container.contains(t.el)) {
        t.locked = false;
        t.el.classList.remove('locked-out');
        write(t, 0);
      }
    });
    request();
  }

  // ---- per-frame work --------------------------------------------------

  function write(t, p) {
    t.el.style.setProperty('--p', p.toFixed(4));
    t.el.style.setProperty('--ip', (1 - p).toFixed(4));
    if (t.hook) t.hook(p, t.el);
  }

  // One frame is one read pass followed by one write pass. Everything the
  // frame needs from layout is read up front, so the style writes below never
  // force a synchronous reflow.
  function update() {
    queued = false;
    const vh = window.innerHeight;
    const sy = window.scrollY;
    let height = document.documentElement.scrollHeight;

    // Anything that reflows the document (filters, page swaps, fonts) moves
    // the sets, so re-measure before reading positions.
    if (height !== docHeight) {
      measure();
      height = docHeight;
    }

    for (const t of tracked) {
      // Null top means the element sits on an inactive page: leave its rep be.
      if (t.top === null) continue;

      const top = t.top - sy;
      const from = vh * t.start;
      const to = vh * t.end;
      let raw = clamp((from - top) / (from - to), 0, 1);
      if (t.delay) raw = clamp((raw - t.delay) / (1 - t.delay), 0, 1);

      const p = clamp(t.ease(raw), 0, 1.02);
      write(t, p);

      if (raw > 0.995 && !t.locked) {
        t.locked = true;
        t.el.classList.add('locked-out');
        if (t.el.dataset.liftLockout === 'chalk') throwChalk(t.el);
      } else if (raw < 0.9 && t.locked) {
        t.locked = false;
        t.el.classList.remove('locked-out');
      }
    }

    updateSession(sy, vh, height);
  }

  function request() {
    if (queued || reduced) return;
    queued = true;
    requestAnimationFrame(update);
  }

  // ---- session telemetry: load bar, heart rate, set counter ------------

  function updateSession(sy, vh, height) {
    const doc = document.documentElement;
    const sp = clamp(sy / Math.max(1, height - vh), 0, 1);

    doc.style.setProperty('--sp', sp.toFixed(4));
    // Heart rate climbs with the session, 60 bpm at rest to ~150 flat out.
    doc.style.setProperty('--bpm', (1 + sp * 1.5).toFixed(3));

    if (hud) hud.sync(sy, vh);
  }

  function throwChalk(el) {
    const rect = el.getBoundingClientRect();
    for (let i = 0; i < 16; i++) {
      const dust = document.createElement('div');
      dust.className = 'chalk-dust';
      dust.style.left = (rect.left + Math.random() * rect.width) + 'px';
      dust.style.top = (rect.top + rect.height * 0.5) + 'px';
      dust.style.setProperty('--dx', (Math.random() * 120 - 60).toFixed(0) + 'px');
      dust.style.setProperty('--dy', (-40 - Math.random() * 90).toFixed(0) + 'px');
      dust.style.animationDelay = (Math.random() * 0.12).toFixed(2) + 's';
      document.body.appendChild(dust);
      setTimeout(() => dust.remove(), 1400);
    }
  }

  // ---- the set counter rail -------------------------------------------

  function initHud() {
    const rail = document.getElementById('rep-hud');
    const track = document.getElementById('hud-track');
    const repEl = document.getElementById('hud-rep');
    const totalEl = document.getElementById('hud-total');
    const liftEl = document.getElementById('hud-lift');
    if (!rail || !track) return null;

    const sets = Array.from(document.querySelectorAll('#page-home [data-set]'));
    if (!sets.length) return null;

    const ticks = sets.map(() => {
      const tick = document.createElement('span');
      tick.className = 'hud-tick';
      track.appendChild(tick);
      return tick;
    });
    totalEl.textContent = '/' + String(sets.length).padStart(2, '0');

    const home = document.getElementById('page-home');
    let lastCurrent = -1;
    let bounds = [];

    return {
      // Called from the engine's read pass, never mid-write.
      measure() {
        bounds = sets.map(s => {
          let y = 0;
          for (let node = s; node; node = node.offsetParent) y += node.offsetTop;
          return { top: y, bottom: y + s.offsetHeight };
        });
      },

      sync(sy, vh) {
        const onHome = home.classList.contains('active');
        rail.classList.toggle('armed', onHome && sy > 120);
        if (!onHome || !bounds.length) return;

        const mid = sy + vh * 0.55;
        let current = -1;
        let done = 0;
        bounds.forEach((b, i) => {
          if (b.top < mid) current = i;
          if (b.bottom < mid) done = i + 1;
        });

        ticks.forEach((tick, i) => {
          tick.classList.toggle('done', i < done);
          tick.classList.toggle('current', i === current && i >= done);
        });
        repEl.textContent = String(Math.max(0, current + 1)).padStart(2, '0');

        if (current !== lastCurrent) {
          lastCurrent = current;
          liftEl.textContent = current < 0 ? 'RACKED' : sets[current].dataset.set;
          liftEl.classList.remove('swap');
          void liftEl.offsetWidth;
          liftEl.classList.add('swap');
        }
      }
    };
  }

  // ---- the rig: a barbell that deadlifts the next section into view ----

  function initRig() {
    const rig = document.getElementById('deadlift-rig');
    const assembly = document.getElementById('bar-assembly');
    const shaft = document.getElementById('bar-shaft');
    const knurl = document.getElementById('bar-knurl');
    const weight = document.getElementById('rig-weight');
    if (!rig || !assembly || !shaft) return null;

    const LOCK = 80;      // shaft baseline at lockout, in viewBox units
    const TRAVEL = 110;   // how far below that the bar starts, on the floor
    const BREAK = 0.34;   // where the plates finally leave the floor
    const TOP_LOAD = 220; // kg on the bar once it is locked out

    return function updateRig(p) {
      // Before the break the lifter is pulling against a bar that hasn't moved:
      // the shaft bows upward between the sleeves while the plates sit still.
      const pull = clamp(p / BREAK, 0, 1);
      const whip = (p < BREAK ? pull : clamp(1 - (p - BREAK) / 0.4, 0, 1)) * 26;
      const peak = LOCK - whip;
      const mid = LOCK - whip * 0.55;

      // After the break the whole assembly rises as one.
      const rise = clamp((p - BREAK) / (1 - BREAK), 0, 1);
      const drop = ((1 - rise) * TRAVEL).toFixed(1);

      assembly.setAttribute('transform', `translate(0 ${drop})`);
      shaft.setAttribute('d', `M 150 ${LOCK} Q 600 ${peak.toFixed(1)} 1050 ${LOCK}`);
      if (knurl) {
        knurl.setAttribute('d', `M 430 ${mid.toFixed(1)} Q 600 ${peak.toFixed(1)} 770 ${mid.toFixed(1)}`);
      }

      rig.style.setProperty('--p', p.toFixed(4));
      rig.classList.toggle('locked', p > 0.985);
      if (weight) weight.textContent = Math.round(p * TOP_LOAD) + ' KG';
    };
  }

  // ---- boot ------------------------------------------------------------

  function init() {
    reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    hud = initHud();
    const updateRig = initRig();

    // The categories section rides the bar: one rep drives both.
    const categories = document.getElementById('categories-section');
    if (categories && updateRig) {
      const inner = categories.querySelector('.container');
      if (inner) {
        inner.setAttribute('data-lift', 'deadlift');
        inner.setAttribute('data-lift-ready', '');
        inner.dataset.liftLockout = 'chalk';
        add(inner, 'deadlift', { hook: updateRig });
      }
    }

    scan();

    if (reduced) {
      settle();
      return;
    }

    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', () => { measure(); request(); });
    window.addEventListener('load', () => { measure(); request(); });
    update();
  }

  return { init, scan, reset, settle };
})();

// A top-level const stays off the global object, so publish it explicitly:
// app.js hands freshly rendered markup back through window.Lifts.
window.Lifts = Lifts;

document.addEventListener('DOMContentLoaded', Lifts.init);
