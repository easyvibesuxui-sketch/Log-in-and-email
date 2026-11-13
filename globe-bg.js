// <globe-bg> — rotating wireframe-sphere background (2D canvas, no deps).
// Attributes: color, opacity, speed, radius, seg-w, seg-h
(function () {
  if (customElements.get('globe-bg')) return;

  class GlobeBg extends HTMLElement {
    connectedCallback() {
      if (this._canvas) return;
      this.style.cssText = 'display:block;position:absolute;inset:0;width:100%;height:100%;pointer-events:none';
      const c = document.createElement('canvas');
      c.style.cssText = 'display:block;position:absolute;inset:0;width:100%;height:100%';
      this.appendChild(c);
      this._canvas = c;
      this._ctx = c.getContext('2d');
      this._rx = 0.5; this._ry = 0; this._rz = 0;
      this._build();
      this._ro = new ResizeObserver(() => this._resize());
      this._ro.observe(this);
      this._resize();
      const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      this._speed = parseFloat(this.getAttribute('speed') || '0.004') * (reduce ? 0 : 1);
      this._loop();
    }

    disconnectedCallback() {
      if (this._ro) this._ro.disconnect();
      cancelAnimationFrame(this._raf);
      this._raf = null;
    }

    _build() {
      const sw = parseInt(this.getAttribute('seg-w') || '44', 10);
      const sh = parseInt(this.getAttribute('seg-h') || '22', 10);
      this._sw = sw; this._sh = sh;
      const pts = [];
      for (let j = 0; j <= sh; j++) {
        const phi = (j / sh) * Math.PI;
        const row = [];
        for (let i = 0; i <= sw; i++) {
          const th = (i / sw) * Math.PI * 2;
          row.push([Math.sin(phi) * Math.cos(th), Math.cos(phi), Math.sin(phi) * Math.sin(th)]);
        }
        pts.push(row);
      }
      this._pts = pts;
    }

    _resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = this.clientWidth || 1, h = this.clientHeight || 1;
      this._w = w; this._h = h;
      this._canvas.width = Math.round(w * dpr);
      this._canvas.height = Math.round(h * dpr);
      this._ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    _loop() {
      this._raf = requestAnimationFrame(() => this._loop());
      const s = this._speed;
      this._ry += s; this._rx += s * 0.3; this._rz += s * 0.1;
      this._draw();
    }

    _draw() {
      const ctx = this._ctx, w = this._w, h = this._h;
      if (!ctx || !w) return;
      ctx.clearRect(0, 0, w, h);

      const r = parseFloat(this.getAttribute('radius') || '1');
      const camZ = 3, fov = 75;
      const f = 1 / Math.tan((fov * Math.PI / 180) / 2);
      const half = h / 2;
      const cx = w / 2, cy = h / 2;

      const sx = Math.sin(this._rx), cxr = Math.cos(this._rx);
      const sy = Math.sin(this._ry), cyr = Math.cos(this._ry);
      const sz = Math.sin(this._rz), czr = Math.cos(this._rz);

      const proj = (p) => {
        let x = p[0] * r, y = p[1] * r, z = p[2] * r;
        // X
        let y1 = y * cxr - z * sx, z1 = y * sx + z * cxr;
        // Y
        let x2 = x * cyr + z1 * sy, z2 = -x * sy + z1 * cyr;
        // Z
        let x3 = x2 * czr - y1 * sz, y3 = x2 * sz + y1 * czr;
        const d = camZ - z2;
        const k = (f * half) / (d <= 0.05 ? 0.05 : d);
        return [cx + x3 * k, cy - y3 * k];
      };

      const pts = this._pts, sw = this._sw, sh = this._sh;
      const grid = [];
      for (let j = 0; j <= sh; j++) {
        const row = new Array(sw + 1);
        for (let i = 0; i <= sw; i++) row[i] = proj(pts[j][i]);
        grid.push(row);
      }

      ctx.beginPath();
      for (let j = 1; j < sh; j++) {
        const row = grid[j];
        ctx.moveTo(row[0][0], row[0][1]);
        for (let i = 1; i <= sw; i++) ctx.lineTo(row[i][0], row[i][1]);
      }
      for (let i = 0; i < sw; i++) {
        ctx.moveTo(grid[0][i][0], grid[0][i][1]);
        for (let j = 1; j <= sh; j++) ctx.lineTo(grid[j][i][0], grid[j][i][1]);
        // diagonal — gives the triangulated wireframe read
        for (let j = 0; j < sh; j++) {
          ctx.moveTo(grid[j][i][0], grid[j][i][1]);
          ctx.lineTo(grid[j + 1][i + 1][0], grid[j + 1][i + 1][1]);
        }
      }
      ctx.strokeStyle = this.getAttribute('color') || '#ffffff';
      ctx.globalAlpha = parseFloat(this.getAttribute('opacity') || '0.15');
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
  }

  customElements.define('globe-bg', GlobeBg);
})();
