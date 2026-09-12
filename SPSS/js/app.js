/* SPSS-Lite bằng Python — logic giao diện. Toàn bộ tính toán thống kê chạy
 * trong Pyodide (py/analysis.py); file này chỉ lo UI + gọi qua lại. */

"use strict";

const App = {
  pyodide: null,
  records: [],
  columns: [],       // [{name, is_numeric, n_unique, n_missing, suggested_scale, sample_values}]
  varTypes: {},       // name -> 'nominal' | 'ordinal' | 'interval' | 'ratio'
  log: [],
};

// ---------------------------------------------------------------------------
// BOOT PYODIDE (với timeout + thông báo lỗi rõ ràng, không để treo màn hình)
// ---------------------------------------------------------------------------
function setLoadingText(text, detail) {
  document.getElementById("loading-text").textContent = text;
  if (detail) document.getElementById("loading-detail").textContent = detail;
}

function setStatus(state, text) {
  const el = document.getElementById("pyodide-status");
  el.className = state;
  el.textContent = text || (state === "ready" ? "Sẵn sàng" : state === "error" ? "Lỗi" : "Đang khởi động…");
}

function showLoadError(err) {
  console.error(err);
  setLoadingText("❌ Không tải được môi trường Python.");
  document.getElementById("loading-detail").textContent =
    "Lỗi: " + (err && err.message ? err.message : String(err)) +
    ". Có thể do mạng chậm/CDN pyodide bị chặn. Hãy thử tải lại trang.";
  document.getElementById("retry-btn").style.display = "inline-block";
  setStatus("error", "Lỗi tải Pyodide");
}

function withTimeout(promise, ms, label) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error(`Quá thời gian chờ (${label})`)), ms)),
  ]);
}

async function bootPyodide() {
  try {
    setLoadingText("Đang tải lõi Pyodide…");
    App.pyodide = await withTimeout(loadPyodide(), 45000, "tải lõi Pyodide");

    setLoadingText("Đang tải numpy / pandas / scipy / statsmodels…",
      "Đây là bước lâu nhất (khoảng 15-30MB). Vui lòng giữ kết nối mạng ổn định.");
    await withTimeout(
      App.pyodide.loadPackage(["numpy", "pandas", "scipy", "statsmodels"]),
      60000, "tải các gói khoa học dữ liệu"
    );

    setLoadingText("Đang nạp mã phân tích thống kê…");
    const resp = await fetch("py/analysis.py");
    if (!resp.ok) throw new Error("Không tải được py/analysis.py (HTTP " + resp.status + ")");
    const code = await resp.text();
    App.pyodide.runPython(code);

    document.getElementById("loading-overlay").style.display = "none";
    setStatus("ready", "Sẵn sàng");
  } catch (err) {
    showLoadError(err);
  }
}

/** Gọi 1 hàm Python trong analysis.py, trả về object JS đã parse JSON. */
function callPy(fnName, ...args) {
  const fn = App.pyodide.globals.get(fnName);
  try {
    const resultStr = fn(...args);
    return JSON.parse(resultStr);
  } finally {
    fn.destroy();
  }
}

// ---------------------------------------------------------------------------
// ĐIỀU HƯỚNG (sidebar)
// ---------------------------------------------------------------------------
function initNav() {
  const buttons = document.querySelectorAll("nav.sidebar button");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      document.querySelectorAll("section.page").forEach((p) => p.classList.remove("active"));
      document.getElementById("page-" + btn.dataset.page).classList.add("active");
      location.hash = btn.dataset.page;
    });
  });
  if (location.hash) {
    const target = location.hash.replace("#", "");
    const btn = document.querySelector(`nav.sidebar button[data-page="${target}"]`);
    if (btn) btn.click();
  }
}

// ---------------------------------------------------------------------------
// NHẬT KÝ / AUDIT TRAIL
// ---------------------------------------------------------------------------
function addLog(action, summary) {
  const entry = { time: new Date().toLocaleString("vi-VN"), action, summary };
  App.log.push(entry);
  const tbody = document.querySelector("#log-table tbody");
  const tr = document.createElement("tr");
  tr.innerHTML = `<td>${entry.time}</td><td>${entry.action}</td><td>${entry.summary}</td>`;
  tbody.appendChild(tr);
}

document.getElementById("export-log-btn").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(App.log, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `audit_trail_${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
});

document.getElementById("clear-log-btn").addEventListener("click", () => {
  App.log = [];
  document.querySelector("#log-table tbody").innerHTML = "";
});

// ---------------------------------------------------------------------------
// TIỆN ÍCH CHUNG
// ---------------------------------------------------------------------------
function numericColumns() {
  return App.columns.filter((c) => c.is_numeric).map((c) => c.name);
}
function categoricalColumns() {
  return App.columns.filter((c) => !c.is_numeric || c.n_unique <= 10).map((c) => c.name);
}
function allColumns() {
  return App.columns.map((c) => c.name);
}
function fillSelect(sel, options, placeholder) {
  sel.innerHTML = "";
  if (placeholder) {
    const o = document.createElement("option");
    o.value = ""; o.textContent = placeholder;
    sel.appendChild(o);
  }
  options.forEach((name) => {
    const o = document.createElement("option");
    o.value = name; o.textContent = name;
    sel.appendChild(o);
  });
}
function fmt(x, digits = 4) {
  if (x === null || x === undefined) return "—";
  if (typeof x === "number") return Number.isInteger(x) ? x : x.toFixed(digits);
  return String(x);
}
function sigBadge(pValue) {
  if (pValue === null || pValue === undefined) return "";
  return pValue < 0.05
    ? `<span class="badge ok">p = ${fmt(pValue)} → có ý nghĩa (α=0.05)</span>`
    : `<span class="badge warn">p = ${fmt(pValue)} → chưa có ý nghĩa (α=0.05)</span>`;
}
function assumptionBadge(ok, label) {
  return ok
    ? `<span class="badge ok">${label}: OK</span>`
    : `<span class="badge bad">${label}: VI PHẠM</span>`;
}

// ---------------------------------------------------------------------------
// MỤC 1 — DỮ LIỆU (Data View / Variable View)
// ---------------------------------------------------------------------------
function onDataLoaded(parsed, sourceLabel) {
  App.records = parsed.records;
  App.columns = parsed.columns;
  App.varTypes = {};
  parsed.columns.forEach((c) => (App.varTypes[c.name] = c.suggested_scale));

  document.getElementById("data-load-status").innerHTML =
    `<span class="badge ok">Đã nạp ${parsed.n_rows} dòng × ${parsed.columns.length} biến từ ${sourceLabel}</span>`;

  renderDataView();
  renderVariableView();
  refreshAllSelectsAfterDataLoad();
  addLog("Nạp dữ liệu", `${sourceLabel}: ${parsed.n_rows} dòng, ${parsed.columns.length} biến`);
}

function renderDataView() {
  const cols = allColumns();
  const rows = App.records.slice(0, 50);
  let html = "<table class='data-table'><thead><tr>" +
    cols.map((c) => `<th>${c}</th>`).join("") + "</tr></thead><tbody>";
  rows.forEach((r) => {
    html += "<tr>" + cols.map((c) => `<td>${r[c] === null || r[c] === undefined ? "" : r[c]}</td>`).join("") + "</tr>";
  });
  html += "</tbody></table>";
  document.getElementById("data-view-table").innerHTML = html;
}

const SCALE_LABELS = {
  nominal: "Định danh (Nominal)",
  ordinal: "Thứ bậc (Ordinal)",
  interval: "Khoảng (Interval)",
  ratio: "Tỷ lệ (Ratio)",
};

function renderVariableView() {
  let html = `<table class='data-table'><thead><tr>
    <th>Tên biến</th><th>Kiểu dữ liệu</th><th>Số giá trị duy nhất</th>
    <th>Số ô khuyết (missing)</th><th>Giá trị mẫu</th><th>Thang đo</th>
  </tr></thead><tbody>`;
  App.columns.forEach((c) => {
    html += `<tr>
      <td>${c.name}</td>
      <td>${c.is_numeric ? "Số (numeric)" : "Chuỗi (text)"}</td>
      <td>${c.n_unique}</td>
      <td>${c.n_missing}</td>
      <td>${c.sample_values.join(", ")}</td>
      <td>
        <select data-var="${c.name}" class="var-scale-select">
          ${Object.entries(SCALE_LABELS).map(([k, v]) =>
            `<option value="${k}" ${App.varTypes[c.name] === k ? "selected" : ""}>${v}</option>`).join("")}
        </select>
      </td>
    </tr>`;
  });
  html += "</tbody></table>";
  document.getElementById("variable-view-table").innerHTML = html;
  document.querySelectorAll(".var-scale-select").forEach((sel) => {
    sel.addEventListener("change", (e) => {
      App.varTypes[e.target.dataset.var] = e.target.value;
      addLog("Khai báo thang đo", `${e.target.dataset.var} → ${SCALE_LABELS[e.target.value]}`);
    });
  });
}

document.getElementById("csv-file-input").addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const text = await file.text();
  try {
    const parsed = callPy("parse_csv_text", text);
    onDataLoaded(parsed, file.name);
  } catch (err) {
    document.getElementById("data-load-status").innerHTML =
      `<span class="badge bad">Lỗi đọc file: ${err.message}</span>`;
  }
});

document.getElementById("load-sample-btn").addEventListener("click", async () => {
  const sel = document.getElementById("sample-dataset-select");
  const path = sel.value;
  const label = sel.options[sel.selectedIndex].textContent;
  const resp = await fetch(path);
  if (!resp.ok) {
    document.getElementById("data-load-status").innerHTML =
      `<span class="badge bad">Không tải được ${path} (HTTP ${resp.status})</span>`;
    return;
  }
  const text = await resp.text();
  try {
    const parsed = callPy("parse_csv_text", text);
    onDataLoaded(parsed, label);
  } catch (err) {
    document.getElementById("data-load-status").innerHTML =
      `<span class="badge bad">Lỗi đọc dữ liệu: ${err.message}</span>`;
  }
});

// ---------------------------------------------------------------------------
// CẬP NHẬT MỌI SELECT KHI DỮ LIỆU THAY ĐỔI
// ---------------------------------------------------------------------------
function refreshAllSelectsAfterDataLoad() {
  const numCols = numericColumns();
  const catCols = categoricalColumns();
  const allCols = allColumns();

  // Mục 2 — thống kê mô tả
  const descList = document.getElementById("desc-var-checklist");
  descList.innerHTML = numCols.map((c) =>
    `<label><input type="checkbox" value="${c}" class="desc-chk" checked>${c}</label>`).join("");
  document.getElementById("run-desc-btn").disabled = numCols.length === 0;
  document.getElementById("run-corr-btn").disabled = numCols.length < 2;

  // Mục 3 — kiểm định
  document.querySelectorAll(".sel-value-col, .sel-value-col-anova").forEach((s) => fillSelect(s, numCols));
  document.querySelectorAll(".sel-group-col, .sel-group-col-anova").forEach((s) => fillSelect(s, catCols));
  document.querySelectorAll(".sel-before-col, .sel-after-col, .sel-x-col, .sel-y-col").forEach((s) => fillSelect(s, numCols));
  document.getElementById("run-test-btn").disabled = numCols.length === 0 || catCols.length === 0;

  // Mục 4 — Cronbach's alpha
  const alphaList = document.getElementById("alpha-var-checklist");
  alphaList.innerHTML = numCols.map((c) =>
    `<label><input type="checkbox" value="${c}" class="alpha-chk">${c}</label>`).join("");
  document.getElementById("run-alpha-btn").disabled = numCols.length < 2;

  // Mục 5 — hồi quy
  fillSelect(document.getElementById("ols-y"), numCols);
  fillSelect(document.getElementById("ols-x"), numCols);
  fillSelect(document.getElementById("logit-y"), allCols);
  fillSelect(document.getElementById("logit-x"), numCols);
  fillSelect(document.getElementById("med-x"), numCols);
  fillSelect(document.getElementById("med-m"), numCols);
  fillSelect(document.getElementById("med-y"), numCols);
  document.getElementById("run-ols-btn").disabled = numCols.length < 2;
  document.getElementById("run-logit-btn").disabled = numCols.length < 1;
  document.getElementById("run-med-btn").disabled = numCols.length < 3;

  // Mục 6 — biểu đồ
  renderChartFields();
  document.getElementById("draw-chart-btn").disabled = numCols.length === 0;
}

// ---------------------------------------------------------------------------
// MỤC 2 — THỐNG KÊ MÔ TẢ
// ---------------------------------------------------------------------------
function selectedCheckboxValues(className) {
  return Array.from(document.querySelectorAll("." + className + ":checked")).map((el) => el.value);
}

document.getElementById("run-desc-btn").addEventListener("click", () => {
  const cols = selectedCheckboxValues("desc-chk");
  if (cols.length === 0) return alert("Hãy chọn ít nhất 1 biến.");
  const result = callPy("describe_numeric", JSON.stringify(App.records), JSON.stringify(cols));

  let html = `<tr><th>Biến</th><th>N</th><th>Missing %</th><th>Mean</th><th>SD</th>
    <th>Min</th><th>Max</th><th>Skew</th><th>Kurtosis</th><th>Shapiro-Wilk p</th><th>Phân phối chuẩn?</th></tr>`;
  cols.forEach((c) => {
    const d = result[c];
    html += `<tr><td>${c}</td><td>${d.N}</td><td>${fmt(d.missing_pct, 1)}%</td>
      <td>${fmt(d.mean)}</td><td>${fmt(d.std)}</td><td>${fmt(d.min)}</td><td>${fmt(d.max)}</td>
      <td>${fmt(d.skew)}</td><td>${fmt(d.kurtosis)}</td><td>${fmt(d.shapiro_p)}</td>
      <td>${d.normal_ok === null ? "—" : (d.normal_ok ? "<span class='badge ok'>Có</span>" : "<span class='badge bad'>Không</span>")}</td></tr>`;
  });
  document.getElementById("desc-table").innerHTML = html;
  document.getElementById("desc-result").style.display = "block";
  addLog("Thống kê mô tả", `${cols.length} biến: ${cols.join(", ")}`);
});

document.getElementById("run-corr-btn").addEventListener("click", () => {
  const cols = selectedCheckboxValues("desc-chk");
  if (cols.length < 2) return alert("Cần chọn ít nhất 2 biến.");
  const method = document.getElementById("corr-method").value;
  const result = callPy("correlation_matrix", JSON.stringify(App.records), JSON.stringify(cols), method);

  Plotly.newPlot("corr-heatmap", [{
    z: result.matrix, x: result.columns, y: result.columns,
    type: "heatmap", colorscale: "RdBu", zmin: -1, zmax: 1,
    text: result.matrix.map((row) => row.map((v) => v.toFixed(2))),
    texttemplate: "%{text}",
  }], { title: `Ma trận tương quan (${method})`, margin: { t: 40 } }, { responsive: true });
  addLog("Ma trận tương quan", `${method}: ${cols.join(", ")}`);
});

// ---------------------------------------------------------------------------
// MỤC 3 — KIỂM ĐỊNH GIẢ THUYẾT
// ---------------------------------------------------------------------------
const TEST_TYPE_FIELD_MAP = {
  ind_ttest: "test-fields-ind",
  paired_ttest: "test-fields-paired",
  anova: "test-fields-anova",
  correlation: "test-fields-corr",
};

document.getElementById("test-type").addEventListener("change", (e) => {
  Object.values(TEST_TYPE_FIELD_MAP).forEach((id) => (document.getElementById(id).style.display = "none"));
  document.getElementById(TEST_TYPE_FIELD_MAP[e.target.value]).style.display = "grid";
});

document.getElementById("run-test-btn").addEventListener("click", () => {
  const type = document.getElementById("test-type").value;
  const resultBox = document.getElementById("test-result");
  resultBox.style.display = "block";
  let html = "";
  let chartData = null, chartLayout = {};

  if (type === "ind_ttest") {
    const valueCol = document.querySelector(".sel-value-col").value;
    const groupCol = document.querySelector(".sel-group-col").value;
    if (!valueCol || !groupCol) return alert("Chọn đủ 2 biến.");
    const r = callPy("independent_ttest", JSON.stringify(App.records), valueCol, groupCol);
    if (r.error) { resultBox.innerHTML = `<span class="badge bad">${r.error}</span>`; return; }
    html = `<h3>So sánh 2 nhóm độc lập: ${valueCol} theo ${groupCol}</h3>
      <p>Nhóm "${r.group_labels[0]}": N=${r.n[0]}, Mean=${fmt(r.mean[0])}, SD=${fmt(r.std[0])}<br>
         Nhóm "${r.group_labels[1]}": N=${r.n[1]}, Mean=${fmt(r.mean[1])}, SD=${fmt(r.std[1])}</p>
      <p>${assumptionBadge(r.normal_ok, "Phân phối chuẩn (Shapiro-Wilk)")}
         ${assumptionBadge(r.equal_var_ok, "Đồng nhất phương sai (Levene, p=" + fmt(r.levene_p) + ")")}</p>
      <p><strong>→ Phương pháp tự động chọn: ${r.method_used}</strong></p>
      <p>Thống kê kiểm định = ${fmt(r.statistic)}, ${sigBadge(r.p_value)}</p>
      <p>Cohen's d (độ lớn hiệu ứng) = ${fmt(r.cohens_d)}</p>`;
    chartData = [{ y: App.records.filter(row => row[groupCol] == r.group_labels[0]).map(row => row[valueCol]),
        type: "box", name: r.group_labels[0] },
      { y: App.records.filter(row => row[groupCol] == r.group_labels[1]).map(row => row[valueCol]),
        type: "box", name: r.group_labels[1] }];
    chartLayout = { title: `Boxplot: ${valueCol} theo ${groupCol}` };
    addLog("Independent t-test", `${valueCol} ~ ${groupCol} → ${r.method_used}, p=${fmt(r.p_value)}`);

  } else if (type === "paired_ttest") {
    const before = document.querySelector(".sel-before-col").value;
    const after = document.querySelector(".sel-after-col").value;
    if (!before || !after) return alert("Chọn đủ 2 biến.");
    const r = callPy("paired_ttest", JSON.stringify(App.records), before, after);
    html = `<h3>So sánh trước – sau: ${before} vs ${after}</h3>
      <p>N=${r.n}, Mean trước=${fmt(r.mean_before)}, Mean sau=${fmt(r.mean_after)}, Chênh lệch=${fmt(r.mean_diff)}</p>
      <p>${assumptionBadge(r.normal_ok, "Hiệu số phân phối chuẩn (Shapiro-Wilk)")}</p>
      <p><strong>→ Phương pháp tự động chọn: ${r.method_used}</strong></p>
      <p>Thống kê kiểm định = ${fmt(r.statistic)}, ${sigBadge(r.p_value)}</p>`;
    chartData = [{ y: App.records.map(row => row[before]), type: "box", name: before },
      { y: App.records.map(row => row[after]), type: "box", name: after }];
    chartLayout = { title: `Boxplot: ${before} vs ${after}` };
    addLog("Paired t-test", `${before} vs ${after} → ${r.method_used}, p=${fmt(r.p_value)}`);

  } else if (type === "anova") {
    const valueCol = document.querySelector(".sel-value-col-anova").value;
    const groupCol = document.querySelector(".sel-group-col-anova").value;
    if (!valueCol || !groupCol) return alert("Chọn đủ 2 biến.");
    const r = callPy("one_way_anova", JSON.stringify(App.records), valueCol, groupCol);
    if (r.error) { resultBox.innerHTML = `<span class="badge bad">${r.error}</span>`; return; }
    html = `<h3>So sánh nhiều nhóm: ${valueCol} theo ${groupCol}</h3>
      <p>${r.group_labels.map((g, i) => `Nhóm "${g}": N=${r.n[i]}, Mean=${fmt(r.mean[i])}`).join("<br>")}</p>
      <p>${assumptionBadge(r.normal_ok, "Phân phối chuẩn")}
         ${assumptionBadge(r.equal_var_ok, "Đồng nhất phương sai (Levene, p=" + fmt(r.levene_p) + ")")}</p>
      <p><strong>→ Phương pháp tự động chọn: ${r.method_used}</strong></p>
      <p>Thống kê kiểm định = ${fmt(r.statistic)}, ${sigBadge(r.p_value)}</p>`;
    if (r.posthoc_tukey) {
      html += "<h4>Post-hoc Tukey HSD</h4><table class='data-table'><tr><th>Cặp so sánh</th><th>p-value</th></tr>" +
        r.posthoc_tukey.map(p => `<tr><td>${p.pair}</td><td>${sigBadge(p.p_value)}</td></tr>`).join("") + "</table>";
    }
    chartData = r.group_labels.map((g) => ({
      y: App.records.filter(row => row[groupCol] == g).map(row => row[valueCol]), type: "box", name: g,
    }));
    chartLayout = { title: `Boxplot: ${valueCol} theo ${groupCol}` };
    addLog("One-way ANOVA", `${valueCol} ~ ${groupCol} → ${r.method_used}, p=${fmt(r.p_value)}`);

  } else if (type === "correlation") {
    const x = document.querySelector(".sel-x-col").value;
    const y = document.querySelector(".sel-y-col").value;
    if (!x || !y) return alert("Chọn đủ 2 biến.");
    const method = "pearson";
    const r = callPy("correlation_test", JSON.stringify(App.records), x, y, method);
    html = `<h3>Tương quan ${x} và ${y} (${method})</h3>
      <p>N=${r.n}, r=${fmt(r.r)}, ${sigBadge(r.p_value)}</p>`;
    chartData = [{ x: App.records.map(row => row[x]), y: App.records.map(row => row[y]), mode: "markers", type: "scatter" }];
    chartLayout = { title: `Scatter: ${x} vs ${y}`, xaxis: { title: x }, yaxis: { title: y } };
    addLog("Tương quan", `${x} vs ${y} → r=${fmt(r.r)}, p=${fmt(r.p_value)}`);
  }

  resultBox.innerHTML = html;
  if (chartData) Plotly.newPlot("test-chart", chartData, chartLayout, { responsive: true });
});

// ---------------------------------------------------------------------------
// MỤC 4 — CRONBACH'S ALPHA
// ---------------------------------------------------------------------------
document.getElementById("run-alpha-btn").addEventListener("click", () => {
  const cols = selectedCheckboxValues("alpha-chk");
  if (cols.length < 2) return alert("Chọn ít nhất 2 items.");
  const r = callPy("cronbach_alpha", JSON.stringify(App.records), JSON.stringify(cols));
  if (r.error) { document.getElementById("alpha-result").innerHTML = `<span class="badge bad">${r.error}</span>`; return; }

  let html = `<h3>Cronbach's Alpha = ${fmt(r.alpha)} — ${r.interpretation}</h3>
    <p>Số items: ${r.k_items}, N hợp lệ: ${r.n}</p>
    <table class="data-table"><tr><th>Item</th><th>Tương quan biến-tổng</th><th>Alpha nếu loại item này</th></tr>`;
  cols.forEach((c) => {
    html += `<tr><td>${c}</td><td>${fmt(r.item_total_correlation[c])}</td><td>${fmt(r.alpha_if_deleted[c])}</td></tr>`;
  });
  html += "</table>";
  document.getElementById("alpha-result").style.display = "block";
  document.getElementById("alpha-result").innerHTML = html;
  addLog("Cronbach's Alpha", `${cols.length} items → α=${fmt(r.alpha)} (${r.interpretation})`);
});

// ---------------------------------------------------------------------------
// MỤC 5 — HỒI QUY & TRUNG GIAN
// ---------------------------------------------------------------------------
function multiSelectValues(sel) {
  return Array.from(sel.selectedOptions).map((o) => o.value);
}

function renderCoefTable(coefs, extraCol) {
  let html = `<table class="data-table"><tr><th>Biến</th><th>Hệ số</th>${extraCol ? `<th>${extraCol.label}</th>` : ""}<th>p-value</th></tr>`;
  coefs.forEach((c) => {
    html += `<tr><td>${c.term}</td><td>${fmt(c.coef)}</td>${extraCol ? `<td>${fmt(c[extraCol.key])}</td>` : ""}<td>${sigBadge(c.p_value)}</td></tr>`;
  });
  return html + "</table>";
}

document.getElementById("run-ols-btn").addEventListener("click", () => {
  const y = document.getElementById("ols-y").value;
  const xs = multiSelectValues(document.getElementById("ols-x"));
  if (!y || xs.length === 0) return alert("Chọn Y và ít nhất 1 biến X.");
  const r = callPy("ols_regression", JSON.stringify(App.records), y, JSON.stringify(xs));
  const html = `<h3>Hồi quy OLS: ${y} ~ ${xs.join(" + ")}</h3>
    <p>N=${r.n}, R² = ${fmt(r.r_squared)}, R² hiệu chỉnh = ${fmt(r.adj_r_squared)}, p(F) = ${fmt(r.f_p_value)}</p>
    ${renderCoefTable(r.coefficients)}`;
  document.getElementById("ols-result").innerHTML = html;
  addLog("Hồi quy OLS", `${y} ~ ${xs.join(", ")} → R²=${fmt(r.r_squared)}`);
});

document.getElementById("run-logit-btn").addEventListener("click", () => {
  const y = document.getElementById("logit-y").value;
  const xs = multiSelectValues(document.getElementById("logit-x"));
  if (!y || xs.length === 0) return alert("Chọn Y (nhị phân 0/1) và ít nhất 1 biến X.");
  try {
    const r = callPy("logistic_regression", JSON.stringify(App.records), y, JSON.stringify(xs));
    const html = `<h3>Hồi quy Logistic: ${y} ~ ${xs.join(" + ")}</h3>
      <p>N=${r.n}, Pseudo R² = ${fmt(r.pseudo_r2)}</p>
      ${renderCoefTable(r.coefficients, { label: "Odds Ratio", key: "odds_ratio" })}`;
    document.getElementById("logit-result").innerHTML = html;
    addLog("Hồi quy Logistic", `${y} ~ ${xs.join(", ")}`);
  } catch (err) {
    document.getElementById("logit-result").innerHTML =
      `<span class="badge bad">Lỗi: biến Y phải là nhị phân (chỉ gồm 2 giá trị, ví dụ 0/1). ${err.message || ""}</span>`;
  }
});

document.getElementById("run-med-btn").addEventListener("click", () => {
  const x = document.getElementById("med-x").value;
  const m = document.getElementById("med-m").value;
  const y = document.getElementById("med-y").value;
  if (!x || !m || !y || new Set([x, m, y]).size < 3) return alert("Chọn 3 biến khác nhau cho X, M, Y.");
  const r = callPy("mediation_baron_kenny", JSON.stringify(App.records), x, m, y);
  const html = `<h3>Mô hình trung gian: ${x} → ${m} → ${y}</h3>
    <p>Bước 1 (c, tổng tác động ${x}→${y}): b=${fmt(r.path_c_total_effect)}, ${sigBadge(r.path_c_p)}</p>
    <p>Bước 2 (a, ${x}→${m}): b=${fmt(r.path_a_X_to_M)}, ${sigBadge(r.path_a_p)}</p>
    <p>Bước 3 (b, ${m}→${y} kiểm soát ${x}): b=${fmt(r.path_b_M_to_Y)}, ${sigBadge(r.path_b_p)}</p>
    <p>Bước 3 (c', tác động trực tiếp ${x}→${y} sau khi thêm ${m}): b=${fmt(r.path_c_prime_direct_effect)}, ${sigBadge(r.path_c_prime_p)}</p>
    <p>Hiệu ứng gián tiếp (a×b) = ${fmt(r.indirect_effect_ab)}, Sobel z=${fmt(r.sobel_z)}, ${sigBadge(r.sobel_p)}</p>
    <p><strong>→ Kết luận: ${r.conclusion}</strong></p>
    <div class="note info">Đây là proxy nhẹ (3 bước hồi quy OLS) — không thay thế SEM đầy đủ. Nếu cần chỉ số CFI/TLI/RMSEA
    chuẩn học thuật, tải script <code>semopy_sem_day_du.py</code> ở mục 7 để chạy offline.</div>`;
  document.getElementById("med-result").innerHTML = html;
  addLog("Phân tích trung gian", `${x} → ${m} → ${y}: ${r.conclusion}`);
});

// ---------------------------------------------------------------------------
// MỤC 6 — TRỰC QUAN HOÁ
// ---------------------------------------------------------------------------
function renderChartFields() {
  const type = document.getElementById("chart-type").value;
  const container = document.getElementById("chart-fields");
  const numCols = numericColumns();
  const catCols = categoricalColumns();
  if (type === "histogram") {
    container.innerHTML = `<label>Biến số</label><select id="chart-var1"></select>`;
    fillSelect(document.getElementById("chart-var1"), numCols);
  } else if (type === "scatter") {
    container.innerHTML = `<label>Biến X</label><select id="chart-var1"></select>
      <label>Biến Y</label><select id="chart-var2"></select>`;
    fillSelect(document.getElementById("chart-var1"), numCols);
    fillSelect(document.getElementById("chart-var2"), numCols);
  } else if (type === "box" || type === "bar") {
    container.innerHTML = `<label>Biến số</label><select id="chart-var1"></select>
      <label>Biến nhóm</label><select id="chart-var2"></select>`;
    fillSelect(document.getElementById("chart-var1"), numCols);
    fillSelect(document.getElementById("chart-var2"), catCols);
  }
}
document.getElementById("chart-type").addEventListener("change", renderChartFields);

document.getElementById("draw-chart-btn").addEventListener("click", () => {
  const type = document.getElementById("chart-type").value;
  const v1 = document.getElementById("chart-var1")?.value;
  const v2 = document.getElementById("chart-var2")?.value;
  let data = [], layout = { title: "" };

  if (type === "histogram") {
    data = [{ x: App.records.map((r) => r[v1]), type: "histogram" }];
    layout.title = `Phân phối của ${v1}`;
  } else if (type === "scatter") {
    data = [{ x: App.records.map((r) => r[v1]), y: App.records.map((r) => r[v2]), mode: "markers", type: "scatter" }];
    layout.title = `${v1} vs ${v2}`;
    layout.xaxis = { title: v1 }; layout.yaxis = { title: v2 };
  } else if (type === "box") {
    const groups = [...new Set(App.records.map((r) => r[v2]))];
    data = groups.map((g) => ({ y: App.records.filter((r) => r[v2] === g).map((r) => r[v1]), type: "box", name: String(g) }));
    layout.title = `Boxplot ${v1} theo ${v2}`;
  } else if (type === "bar") {
    const groups = [...new Set(App.records.map((r) => r[v2]))];
    const means = groups.map((g) => {
      const vals = App.records.filter((r) => r[v2] === g).map((r) => r[v1]).filter((x) => x !== null && x !== undefined);
      return vals.reduce((a, b) => a + b, 0) / (vals.length || 1);
    });
    data = [{ x: groups.map(String), y: means, type: "bar" }];
    layout.title = `Trung bình ${v1} theo ${v2}`;
  }
  Plotly.newPlot("main-chart", data, layout, { responsive: true });
  addLog("Vẽ biểu đồ", `${type}: ${v1 || ""} ${v2 ? "/ " + v2 : ""}`);
});

// ---------------------------------------------------------------------------
// KHỞI ĐỘNG
// ---------------------------------------------------------------------------
initNav();
bootPyodide();
