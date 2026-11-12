// <excavator-scene> — cursor-driven frame playback of the chopped excavator footage.
// Attributes: src, sensitivity, easing, idle-loop ("false" disables), zoom, parallax, focus-y (0..1)
(function () {
  if (customElements.get('excavator-scene')) return;

class ExcavatorScene extends HTMLElement {
  connectedCallback() {
    if (this._init) return;
    this._init = true;
    this.style.display = "block";
    this.style.position = "absolute";
    this.style.inset = "0";
    this.style.overflow = "hidden";
    this.style.cursor = "crosshair";

    this.FW = 480; this.FH = 608; this.COLS = 8; this.N = 48; this.REACH_END = 15;
    this.PIV = { x: 112, y: 330 };
    this.f = 0; this.target = 0; this.mode = "follow"; this.digT = 0; this.idleT = 0;
    this.lastMove = 0; this.px = 0.5; this.py = 0.5; this.pxs = 0.5; this.pys = 0.5;

    this.canvas = document.createElement("canvas");
    Object.assign(this.canvas.style, { position: "absolute", inset: "0", width: "100%", height: "100%", display: "block" });
    this.appendChild(this.canvas);

    this.img = new Image();
    this.img.onload = () => { this.ready = true; };
    this.img.src = this.getAttribute("src") || "./frames/excavator-sheet.jpg";

    this._onMove = (e) => {
      const r = this.canvas.getBoundingClientRect();
      // clamp to the scene box: cursor over the form side keeps tracking along the edge
      const sx = Math.max(0, Math.min(r.width, e.clientX - r.left));
      const sy = Math.max(0, Math.min(r.height, e.clientY - r.top));
      this.px = sx / Math.max(1, r.width); this.py = sy / Math.max(1, r.height);
      const { s, ox, oy } = this.fit();
      const dx = (sx - ox) / s - this.PIV.x, dy = (sy - oy) / s - this.PIV.y;
      const d = Math.sqrt(dx * dx + dy * dy);
      const forward = Math.max(0, dx) / Math.max(1, d);
      let t = (d - 70) / (340 - 70);
      t = Math.max(0, Math.min(1, t)) * (0.25 + 0.75 * forward);
      this.target = Math.max(0, Math.min(1, t * this.num("sensitivity", 1))) * this.REACH_END;
      this.lastMove = performance.now();
      this.mode = this.mode === "dig" ? "dig" : "follow";
    };
    this._onDown = () => { if (this.mode !== "dig") { this.mode = "dig"; this.digT = this.REACH_END; } };

    // listen on the window so overlaid UI (form, copy) still drives the scene
    window.addEventListener("pointermove", this._onMove, { passive: true });
    this.addEventListener("pointerdown", this._onDown);

    this.resize();
    this._ro = new ResizeObserver(() => this.resize());
    this._ro.observe(this);

    this.prev = performance.now();
    const loop = (now) => {
      const dt = Math.min(0.05, (now - this.prev) / 1000); this.prev = now;
      this.tick(dt); this.draw();
      this._raf = requestAnimationFrame(loop);
    };
    this._raf = requestAnimationFrame(loop);
  }

  disconnectedCallback() {
    cancelAnimationFrame(this._raf);
    if (this._ro) this._ro.disconnect();
    window.removeEventListener("pointermove", this._onMove);
  }

  num(name, dflt) {
    const v = parseFloat(this.getAttribute(name));
    return isNaN(v) ? dflt : v;
  }

  resize() {
    const r = this.getBoundingClientRect();
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    this.cw = r.width; this.ch = r.height;
    this.canvas.width = Math.max(1, Math.round(r.width * dpr));
    this.canvas.height = Math.max(1, Math.round(r.height * dpr));
  }

  fit() {
    const s = Math.max((this.cw || 1) / this.FW, (this.ch || 1) / this.FH) * this.num("zoom", 1.06);
    const fy = this.num("focus-y", 0.5);
    return { s, ox: (this.cw - this.FW * s) / 2, oy: (this.ch - this.FH * s) * fy };
  }

  tick(dt) {
    const idleAllowed = this.getAttribute("idle-loop") === "true";
    if (this.mode === "follow" && idleAllowed && performance.now() - this.lastMove > 4000) {
      this.mode = "idle"; this.idleT = this.f;
    }
    if (this.mode === "dig") {
      this.digT += dt * 22;
      if (this.digT >= this.N - 1) { this.mode = "follow"; this.lastMove = performance.now(); }
      else { this.f += (this.digT - this.f) * 0.4; return; }
    }
    if (this.mode === "idle") {
      this.idleT = (this.idleT + dt * 7) % (this.N - 1);
      this.f += (this.idleT - this.f) * 0.25;
    } else {
      const k = 1 - Math.pow(0.001, dt * this.num("easing", 1));
      this.f += (this.target - this.f) * k;
    }
    this.pxs += (this.px - this.pxs) * 0.06;
    this.pys += (this.py - this.pys) * 0.06;
  }

  draw() {
    if (!this.ready || !this.cw) return;
    const ctx = this.canvas.getContext("2d");
    const dpr = this.canvas.width / Math.max(1, this.cw);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, this.cw, this.ch);
    const i = Math.max(0, Math.min(this.N - 1, Math.round(this.f)));
    const { s, ox, oy } = this.fit();
    const par = this.num("parallax", 16);
    ctx.drawImage(this.img,
      (i % this.COLS) * this.FW, Math.floor(i / this.COLS) * this.FH, this.FW, this.FH,
      ox + (0.5 - this.pxs) * par, oy + (0.5 - this.pys) * par * 0.6, this.FW * s, this.FH * s);
  }
}
customElements.define("excavator-scene", ExcavatorScene);
})();
