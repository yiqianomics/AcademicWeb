'use strict';

(() => {
  const COLORS = ['#1975ba', '#2f6f5e', '#fd9eb2', '#f0a780', '#8b6fcb'];
  const DEFAULT_EPS = 1e-3;
  const EPS_MIN = 1e-6;
  const EPS_MAX = 1e-1;
  const ZERO_TOL = 1e-12;
  const NEAR_ZERO_TOL = 0.005;

  const DEFAULT_COUNTS = [
    [0, 12, 88],
    [12, 78, 10],
    [72, 18, 10],
    [28, 30, 42],
    [55, 0, 45],
  ];

  const PRESETS = {
    reset: DEFAULT_COUNTS,
    interior: [
      [50, 30, 20],
      [20, 50, 30],
      [30, 20, 50],
    ],
    boundary: [
      [100, 0, 0],
      [0, 100, 0],
      [0, 0, 100],
      [50, 50, 0],
    ],
    nearZero: [
      [999, 1, 0],
      [990, 9, 1],
      [900, 99, 1],
    ],
  };

  const state = {
    counts: DEFAULT_COUNTS.map((row) => [...row]),
    eps: DEFAULT_EPS,
    lockClrScale: true,
  };

  function normalize(row) {
    const total = row.reduce((sum, value) => sum + value, 0);
    if (total <= 0) return null;
    return row.map((value) => value / total);
  }

  function validCompositions() {
    return state.counts
      .map((row, index) => ({ index, row: normalize(row) }))
      .filter((item) => item.row !== null);
  }

  function hricTransform(compositions) {
    const p = 3;
    const q0 = [1 / Math.sqrt(p), 1 / Math.sqrt(p), 1 / Math.sqrt(p)];
    const Q = compositions.map((row) => row.map((value) => Math.sqrt(Math.max(0, value))));
    const results = Q.map((q) => {
      let c = q.reduce((sum, value, index) => sum + value * q0[index], 0);
      c = Math.max(-1, Math.min(1, c));
      const sin2 = Math.max(0, 1 - c * c);
      const sinValue = Math.sqrt(sin2);
      const scale = sinValue < 1e-10 ? 1 : Math.asin(sinValue) / sinValue;
      const centered = q.map((value, index) => value - c * q0[index]);
      return { q, z: centered.map((value) => value * scale) };
    });

    return {
      Q: results.map((item) => item.q),
      Z: results.map((item) => item.z),
    };
  }

  function clrTransform(compositions, eps) {
    const replaced = compositions.map((row) => {
      const r = row.map((value) => (value <= ZERO_TOL ? eps : value));
      const total = r.reduce((sum, value) => sum + value, 0);
      return r.map((value) => value / total);
    });

    const CLR = replaced.map((row) => {
      const logs = row.map((value) => Math.log(value));
      const mean = logs.reduce((sum, value) => sum + value, 0) / logs.length;
      return logs.map((value) => value - mean);
    });

    return { replaced, CLR };
  }

  function compositionClass(row) {
    if (row.some((value) => value <= ZERO_TOL)) return 'boundary';
    if (row.some((value) => value <= NEAR_ZERO_TOL)) return 'near-zero';
    return 'interior';
  }

  function statusLabel(row) {
    const klass = compositionClass(row);
    if (klass === 'boundary') return { text: 'exact zero', className: 'boundary' };
    if (klass === 'near-zero') return { text: 'near zero', className: 'near' };
    return { text: 'interior', className: '' };
  }

  function norm(values) {
    return Math.sqrt(values.reduce((sum, value) => sum + value * value, 0));
  }

  function formatNumber(value, digits = 3) {
    return Number.isFinite(value) ? value.toFixed(digits) : 'n/a';
  }

  function formatInput(value) {
    return Number.isInteger(value) ? String(value) : String(Number(value.toPrecision(6)));
  }

  function formatEps(eps) {
    if (eps < 1e-3) return eps.toExponential(1);
    return Number(eps.toPrecision(3)).toString();
  }

  function formatComposition(row) {
    if (!row) return 'invalid';
    return `(${row.map((value) => value.toFixed(3)).join(', ')})`;
  }

  function pointLabel(index) {
    return `<span class="point-label"><span class="point-dot p${(index % COLORS.length) + 1}"></span>Point ${index + 1}</span>`;
  }

  function renderInputTable() {
    const tbody = document.getElementById('points-tbody');
    if (!tbody) return;

    tbody.innerHTML = state.counts.map((row, index) => {
      const total = row.reduce((sum, value) => sum + value, 0);
      const composition = normalize(row);
      const status = composition ? statusLabel(composition) : { text: 'invalid', className: 'invalid' };
      return `
        <tr>
          <td>${pointLabel(index)}</td>
          <td>
            <div class="count-triplet">
              ${row.map((value, dim) => `
                <label class="count-field">
                  <span>x${dim + 1}</span>
                  <input class="count-input" type="number" min="0" step="any" value="${formatInput(value)}"
                    data-point="${index}" data-dim="${dim}" aria-label="Point ${index + 1} taxon ${dim + 1} count">
                </label>
              `).join('')}
            </div>
            <div class="point-total" data-total="${index}">total ${formatNumber(total, 2)}</div>
          </td>
          <td class="normalized-cell" data-normalized="${index}">${formatComposition(composition)}</td>
          <td data-status="${index}"><span class="status-pill ${status.className}">${status.text}</span></td>
        </tr>
      `;
    }).join('');
  }

  function renderInputRowMeta(index) {
    const row = state.counts[index];
    if (!row) return;
    const total = row.reduce((sum, value) => sum + value, 0);
    const composition = normalize(row);
    const status = composition ? statusLabel(composition) : { text: 'invalid', className: 'invalid' };

    const totalCell = document.querySelector(`[data-total="${index}"]`);
    const normalizedCell = document.querySelector(`[data-normalized="${index}"]`);
    const statusCell = document.querySelector(`[data-status="${index}"]`);
    if (totalCell) totalCell.textContent = `total ${formatNumber(total, 2)}`;
    if (normalizedCell) normalizedCell.textContent = formatComposition(composition);
    if (statusCell) statusCell.innerHTML = `<span class="status-pill ${status.className}">${status.text}</span>`;
  }

  function buildSimplex() {
    const vertices = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
    return [
      {
        type: 'mesh3d',
        x: vertices.map((point) => point[0]),
        y: vertices.map((point) => point[1]),
        z: vertices.map((point) => point[2]),
        i: [0],
        j: [1],
        k: [2],
        color: '#dff1e2',
        opacity: 0.22,
        hoverinfo: 'skip',
        showlegend: false,
      },
      {
        type: 'scatter3d',
        x: [1, 0, 0, 1],
        y: [0, 1, 0, 0],
        z: [0, 0, 1, 0],
        mode: 'lines',
        line: { color: '#aebdca', width: 6 },
        hoverinfo: 'skip',
        showlegend: false,
      },
    ];
  }

  function buildSphere() {
    const nu = 44;
    const nv = 24;
    const u = Array.from({ length: nu }, (_, index) => 2 * Math.PI * index / (nu - 1));
    const v = Array.from({ length: nv }, (_, index) => Math.PI * index / (nv - 1));
    return {
      type: 'surface',
      x: u.map((ui) => v.map((vi) => Math.cos(ui) * Math.sin(vi))),
      y: u.map((ui) => v.map((vi) => Math.sin(ui) * Math.sin(vi))),
      z: u.map(() => v.map((vi) => Math.cos(vi))),
      opacity: 0.07,
      showscale: false,
      colorscale: [[0, '#cbd5e1'], [1, '#cbd5e1']],
      hoverinfo: 'skip',
      showlegend: false,
    };
  }

  function buildOctantArcs() {
    const n = 110;
    const t = Array.from({ length: n }, (_, index) => Math.PI / 2 * index / (n - 1));
    const makeArc = (x, y, z) => ({
      type: 'scatter3d',
      x: t.map(x),
      y: t.map(y),
      z: t.map(z),
      mode: 'lines',
      line: { color: '#1975ba', width: 4 },
      hoverinfo: 'skip',
      showlegend: false,
    });
    return [
      makeArc((value) => Math.cos(value), (value) => Math.sin(value), () => 0),
      makeArc((value) => Math.cos(value), () => 0, (value) => Math.sin(value)),
      makeArc(() => 0, (value) => Math.cos(value), (value) => Math.sin(value)),
    ];
  }

  function buildPlane(radius, fill, stroke) {
    const b1 = [1 / Math.sqrt(2), -1 / Math.sqrt(2), 0];
    const b2 = [1 / Math.sqrt(6), 1 / Math.sqrt(6), -2 / Math.sqrt(6)];
    const corners = [[-radius, -radius], [radius, -radius], [radius, radius], [-radius, radius]]
      .map(([a, b]) => [
        a * b1[0] + b * b2[0],
        a * b1[1] + b * b2[1],
        a * b1[2] + b * b2[2],
      ]);
    const edge = [...corners, corners[0]];
    return [
      {
        type: 'mesh3d',
        x: corners.map((point) => point[0]),
        y: corners.map((point) => point[1]),
        z: corners.map((point) => point[2]),
        i: [0, 0],
        j: [1, 2],
        k: [2, 3],
        color: fill,
        opacity: 0.26,
        hoverinfo: 'skip',
        showlegend: false,
      },
      {
        type: 'scatter3d',
        x: edge.map((point) => point[0]),
        y: edge.map((point) => point[1]),
        z: edge.map((point) => point[2]),
        mode: 'lines',
        line: { color: stroke, width: 5 },
        hoverinfo: 'skip',
        showlegend: false,
      },
    ];
  }

  function buildAxes(limit) {
    const makeAxis = (x, y, z) => ({
      type: 'scatter3d',
      x,
      y,
      z,
      mode: 'lines',
      line: { color: 'rgba(86,102,119,0.68)', width: 5 },
      hoverinfo: 'skip',
      showlegend: false,
    });
    return [
      makeAxis([0, limit], [0, 0], [0, 0]),
      makeAxis([0, 0], [0, limit], [0, 0]),
      makeAxis([0, 0], [0, 0], [0, limit]),
    ];
  }

  function pointTraces(points, label, symbol, size, opacity, compositionClasses, pointLabels) {
    const groups = [
      { key: 'interior', symbol, lineColor: '#ffffff', lineWidth: 0.8, size },
      { key: 'near-zero', symbol, lineColor: '#334155', lineWidth: 1.4, size },
      { key: 'boundary', symbol: `${symbol}-open`, lineColor: '#14202b', lineWidth: 2.2, size: size + 1 },
    ];

    let legendShown = false;
    return groups.flatMap((group) => {
      const indices = compositionClasses
        .map((klass, index) => (klass === group.key ? index : -1))
        .filter((index) => index >= 0);
      if (indices.length === 0) return [];
      const showlegend = !legendShown;
      legendShown = true;
      return [{
        type: 'scatter3d',
        x: indices.map((index) => points[index][0]),
        y: indices.map((index) => points[index][1]),
        z: indices.map((index) => points[index][2]),
        mode: 'markers',
        marker: {
          size: group.size,
          color: indices.map((index) => COLORS[pointLabels[index].sourceIndex % COLORS.length]),
          symbol: group.symbol,
          opacity,
          line: { color: group.lineColor, width: group.lineWidth },
        },
        hovertext: indices.map((index) => {
          const point = points[index];
          return `${label}<br>${pointLabels[index].label}<br>${compositionClasses[index]} composition<br>(${point.map((value) => value.toFixed(4)).join(', ')})`;
        }),
        hoverinfo: 'text',
        name: label,
        legendgroup: label,
        showlegend,
      }];
    });
  }

  function arrowTraces(from, to, pointLabels, dashed = false) {
    const traces = [];
    for (let index = 0; index < from.length; index += 1) {
      const color = COLORS[pointLabels[index].sourceIndex % COLORS.length];
      const start = from[index];
      const end = to[index];
      traces.push({
        type: 'scatter3d',
        x: [start[0], end[0]],
        y: [start[1], end[1]],
        z: [start[2], end[2]],
        mode: 'lines',
        line: { color, width: 4, dash: dashed ? 'dash' : 'solid' },
        opacity: 0.52,
        hoverinfo: 'skip',
        showlegend: false,
      });
    }
    return traces;
  }

  function makeLayout(axisRange, view) {
    const axis = {
      title: '',
      range: axisRange,
      showticklabels: false,
      showgrid: true,
      gridcolor: 'rgba(148,163,184,0.35)',
      zeroline: false,
      showbackground: true,
      backgroundcolor: '#fbfcfe',
    };

    return {
      autosize: true,
      height: 560,
      paper_bgcolor: '#ffffff',
      margin: { l: 0, r: 0, t: 8, b: 0 },
      showlegend: false,
      scene: {
        uirevision: 'keep-camera',
        domain: { x: [0, 1], y: [0, 1] },
        xaxis: { ...axis },
        yaxis: { ...axis },
        zaxis: { ...axis },
        aspectmode: 'cube',
        camera: { eye: view, center: { x: 0, y: 0, z: 0 } },
      },
    };
  }

  function renderFallback() {
    ['hric-plot', 'clr-plot'].forEach((id) => {
      const target = document.getElementById(id);
      if (target) {
        target.innerHTML = '<div class="plot-fallback">Plotly did not load, so the interactive transformation figure cannot render.</div>';
      }
    });
  }

  function renderPlots() {
    if (!window.Plotly) {
      renderFallback();
      return;
    }

    const valid = validCompositions();
    const compositions = valid.map((item) => item.row);
    const pointLabels = valid.map((item) => ({ label: `Point ${item.index + 1}`, sourceIndex: item.index }));
    const compositionClasses = compositions.map(compositionClass);

    if (compositions.length === 0) {
      window.Plotly.react('hric-plot', [], makeLayout([-1.25, 1.25], { x: 1.14, y: 0.37, z: 0.9 }), { responsive: true });
      window.Plotly.react('clr-plot', [], makeLayout([-1.6, 1.6], { x: 0.26, y: 0.08, z: 0.2 }), { responsive: true });
      return;
    }

    const hric = hricTransform(compositions);
    const maxHricNorm = Math.max(...hric.Z.map(norm), 0.5);
    const hricTraces = [
      buildSphere(),
      ...buildOctantArcs(),
      ...buildSimplex(),
      ...buildPlane(maxHricNorm * 2.5, '#dff1e2', '#1975ba'),
      ...buildAxes(1.5),
      ...arrowTraces(compositions, hric.Q, pointLabels),
      ...arrowTraces(hric.Q, hric.Z, pointLabels, true),
      ...pointTraces(compositions, 'Original composition pi', 'circle', 5, 0.95, compositionClasses, pointLabels),
      ...pointTraces(hric.Q, 'Square-root point q', 'diamond', 6, 0.92, compositionClasses, pointLabels),
      ...pointTraces(hric.Z, 'HRIC coordinate Z', 'square', 6, 0.95, compositionClasses, pointLabels),
    ];

    window.Plotly.react(
      'hric-plot',
      hricTraces,
      makeLayout([-1.25, 1.25], { x: 1.14, y: 0.37, z: 0.9 }),
      { displayModeBar: true, modeBarButtonsToRemove: ['toImage'], responsive: true },
    );

    const clr = clrTransform(compositions, state.eps);
    const rangeClr = state.lockClrScale ? clrTransform(compositions, EPS_MIN).CLR : clr.CLR;
    const maxClrNorm = Math.max(...clr.CLR.map(norm), ...rangeClr.map(norm), 1);
    const axisLimit = Math.max(1.6, Math.ceil(maxClrNorm * 1.15 * 10) / 10);
    const clrTraces = [
      ...buildSimplex(),
      ...buildPlane(Math.max(maxClrNorm, 1) * 1.35, '#fff0f3', '#fd9eb2'),
      ...buildAxes(axisLimit * 0.8),
      ...arrowTraces(compositions, clr.replaced, pointLabels),
      ...arrowTraces(clr.replaced, clr.CLR, pointLabels, true),
      ...pointTraces(compositions, 'Original composition pi', 'circle', 5, 0.95, compositionClasses, pointLabels),
      ...pointTraces(clr.replaced, `Zero-replaced composition r(pi; epsilon=${formatEps(state.eps)})`, 'diamond', 5, 0.72, compositionClasses, pointLabels),
      ...pointTraces(clr.CLR, 'CLR coordinate', 'square', 6, 0.95, compositionClasses, pointLabels),
    ];

    window.Plotly.react(
      'clr-plot',
      clrTraces,
      makeLayout([-axisLimit, axisLimit], { x: 0.26, y: 0.08, z: 0.2 }),
      { displayModeBar: true, modeBarButtonsToRemove: ['toImage'], responsive: true },
    );

  }

  function renderReadout() {
    const tbody = document.getElementById('readout-tbody');
    if (!tbody) return;

    const valid = validCompositions();
    if (valid.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5">Enter at least one row with a positive total.</td></tr>';
      return;
    }

    const compositions = valid.map((item) => item.row);
    const hric = hricTransform(compositions);
    const clr = clrTransform(compositions, state.eps);
    const clrDefault = clrTransform(compositions, DEFAULT_EPS);

    tbody.innerHTML = compositions.map((row, localIndex) => {
      const sourceIndex = valid[localIndex].index;
      const status = statusLabel(row);
      const drift = norm(clr.CLR[localIndex].map((value, dim) => value - clrDefault.CLR[localIndex][dim]));
      return `
        <tr>
          <td>${pointLabel(sourceIndex)}</td>
          <td><span class="status-pill ${status.className}">${status.text}</span></td>
          <td class="numeric-cell">${formatNumber(norm(hric.Z[localIndex]))}</td>
          <td class="numeric-cell">${formatNumber(norm(clr.CLR[localIndex]))}</td>
          <td class="numeric-cell">${formatNumber(drift)}</td>
        </tr>
      `;
    }).join('');
  }

  function updateAll() {
    renderInputTable();
    renderPlots();
    renderReadout();
  }

  function setEps(nextEps) {
    const eps = Math.max(EPS_MIN, Math.min(EPS_MAX, nextEps));
    state.eps = eps;
    const number = document.getElementById('eps-number');
    const slider = document.getElementById('eps-slider');
    if (number) number.value = formatEps(eps);
    if (slider) slider.value = Math.log10(eps).toFixed(3);
    updateAll();
  }

  function init() {
    const table = document.getElementById('points-tbody');
    if (table) {
      table.addEventListener('input', (event) => {
        const input = event.target.closest('.count-input');
        if (!input) return;
        const point = Number(input.dataset.point);
        const dim = Number(input.dataset.dim);
        const value = Number(input.value);
        if (!Number.isFinite(value) || value < 0) return;
        state.counts[point][dim] = value;
        renderInputRowMeta(point);
        renderPlots();
        renderReadout();
      });
    }

    document.querySelectorAll('[data-preset]').forEach((button) => {
      button.addEventListener('click', () => {
        const preset = PRESETS[button.dataset.preset];
        if (!preset) return;
        state.counts = preset.map((row) => [...row]);
        updateAll();
      });
    });

    const epsNumber = document.getElementById('eps-number');
    if (epsNumber) {
      epsNumber.addEventListener('input', () => {
        if (epsNumber.value === '') return;
        const value = Number(epsNumber.value);
        if (Number.isFinite(value)) setEps(value);
      });
    }

    const epsSlider = document.getElementById('eps-slider');
    if (epsSlider) {
      epsSlider.addEventListener('input', () => {
        setEps(Math.pow(10, Number(epsSlider.value)));
      });
    }

    const lockScale = document.getElementById('lock-clr-scale');
    if (lockScale) {
      lockScale.addEventListener('change', () => {
        state.lockClrScale = lockScale.checked;
        updateAll();
      });
    }

    updateAll();
  }

  window.addEventListener('resize', () => {
    if (!window.Plotly) return;
    ['hric-plot', 'clr-plot'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) window.Plotly.Plots.resize(el);
    });
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
