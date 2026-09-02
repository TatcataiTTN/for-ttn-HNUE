// ─── State & Storage ─────────────────────────────────────────────────────────
const STORAGE_KEY = 'ai_tpack_progress_v2';
let state = { answers: {}, view: 'home', activeGroup: 'A', activeFormula: null };

function loadState() {
  try {
    const s = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    state.answers = s.answers || {};
  } catch(e) {}
}
function saveState() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ answers: state.answers })); } catch(e) {}
}

// answers[key] = { chosen: idx, correct: bool }
function getKey(groupId, qIdx) { return `${groupId}_${qIdx}`; }

// ─── Stats ───────────────────────────────────────────────────────────────────
function getStats() {
  let total = 0, done = 0, correct = 0;
  QUIZ_GROUPS.forEach(g => g.questions.forEach((q, i) => {
    total++;
    const k = getKey(g.id, i);
    if (state.answers[k]) { done++; if (state.answers[k].correct) correct++; }
  }));
  return { total, done, correct, wrong: done - correct };
}

function getGroupStats(groupId) {
  const g = QUIZ_GROUPS.find(x => x.id === groupId);
  if (!g) return { total: 0, done: 0, correct: 0 };
  let done = 0, correct = 0;
  g.questions.forEach((q, i) => {
    const k = getKey(groupId, i);
    if (state.answers[k]) { done++; if (state.answers[k].correct) correct++; }
  });
  return { total: g.questions.length, done, correct };
}

// ─── Router ──────────────────────────────────────────────────────────────────
function navigate(view, opts = {}) {
  state.view = view;
  if (opts.group) state.activeGroup = opts.group;
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  const el = document.getElementById('view-' + view);
  if (el) el.classList.add('active');
  document.querySelectorAll('.nav-item').forEach(n => {
    n.classList.toggle('active', n.dataset.view === view && (!n.dataset.group || n.dataset.group === state.activeGroup));
  });
  // re-render active view
  if (view === 'home') renderHome();
  else if (view === 'formulas') renderFormulas();
  else if (view === 'quiz') renderQuiz();
  else if (view === 'progress') renderProgress();
  // close sidebar on mobile
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('main').scrollTop = 0;
  window.scrollTo(0, 0);
}

// ─── Header chip ─────────────────────────────────────────────────────────────
function updateHeaderChip() {
  const s = getStats();
  const pct = s.total ? Math.round(s.done / s.total * 100) : 0;
  const chip = document.getElementById('header-chip');
  if (chip) chip.textContent = `${s.done}/${s.total} câu • ${pct}%`;
}

// ─── HOME View ───────────────────────────────────────────────────────────────
function renderHome() {
  const s = getStats();
  const pct = s.total ? Math.round(s.done / s.total * 100) : 0;
  const formPct = 100; // formulas always "done" to read
  const el = document.getElementById('view-home');
  el.innerHTML = `
    <div class="home-hero">
      <h1>🎓 Tự học PPNC cho KLTN AI-TPACK-SE</h1>
      <p>Trương Tuấn Nghĩa · HNUE · TS. Nguyễn Thị Thanh Huyền · 2026</p>
      <p style="margin-top:6px;font-size:.85rem;opacity:.75">Học phương pháp nghiên cứu định lượng qua công thức & trắc nghiệm tương tác</p>
    </div>
    <div class="cards-grid">
      <div class="stat-card" onclick="navigate('formulas')">
        <div class="big">20</div>
        <div class="label">📐 Công thức PPNC</div>
        <div class="progress-bar-outer"><div class="progress-bar-inner" style="width:100%;background:var(--success)"></div></div>
      </div>
      <div class="stat-card" onclick="navigate('quiz')">
        <div class="big">${s.done}/${s.total}</div>
        <div class="label">📝 Câu trắc nghiệm đã làm</div>
        <div class="progress-bar-outer"><div class="progress-bar-inner" style="width:${pct}%"></div></div>
      </div>
      <div class="stat-card" onclick="navigate('quiz')">
        <div class="big" style="color:var(--success)">${s.correct}</div>
        <div class="label">✅ Câu trả lời đúng</div>
        <div class="progress-bar-outer"><div class="progress-bar-inner" style="width:${s.done?Math.round(s.correct/s.done*100):0}%;background:var(--success)"></div></div>
      </div>
      <div class="stat-card" onclick="navigate('progress')">
        <div class="big" style="color:var(--accent)">${pct}%</div>
        <div class="label">📊 Hoàn thành tổng thể</div>
        <div class="progress-bar-outer"><div class="progress-bar-inner" style="width:${pct}%;background:var(--accent)"></div></div>
      </div>
    </div>
    <div class="section-title">📚 8 Nhóm câu hỏi</div>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:12px;margin-bottom:28px">
      ${QUIZ_GROUPS.map(g => {
        const gs = getGroupStats(g.id);
        const gp = Math.round(gs.done / gs.total * 100);
        return `<div class="stat-card" onclick="navigate('quiz',{group:'${g.id}'})" style="padding:14px">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
            <span style="background:var(--primary);color:#fff;border-radius:6px;padding:2px 8px;font-size:.75rem;font-weight:700">${g.id}</span>
            <span style="font-size:.82rem;font-weight:600;flex:1">${g.title.replace(/Nhóm [A-H]: /,'')}</span>
          </div>
          <div style="font-size:.75rem;color:var(--text-muted);margin-bottom:6px">${g.range} · ${gs.done}/${gs.total} · ${gs.correct} đúng</div>
          <div class="progress-bar-outer"><div class="progress-bar-inner" style="width:${gp}%"></div></div>
        </div>`;
      }).join('')}
    </div>
    <div class="section-title">🗂 Nội dung tài liệu gốc</div>
    <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:16px;font-size:.85rem;line-height:1.9">
      <b>Nguồn:</b> KLTN_Formula_Guide.tex + KLTN_80MCQ.tex (Trương Tuấn Nghĩa, HNUE 2026)<br>
      <b>Phương pháp:</b> Cronbach α · KMO/Bartlett · EFA · CFA · SEM β · Pearson r · t-tests · ANCOVA · Cohen's d · Mixed ANOVA · CVR/CVI/ICC · Normalized Gain · Hierarchical Regression ΔR² · Likert · Mann-Whitney U · Power Analysis · PRISMA 2020<br>
      <b>Bài báo nền:</b> Celik (2023) · Ning (2024) · Hava (2025) · Tan (2025) · Eyal (2025) · Mimoudi (2025)
    </div>`;
}

// ─── FORMULAS View ────────────────────────────────────────────────────────────
function renderFormulas() {
  const el = document.getElementById('view-formulas');
  el.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;margin-bottom:20px">
      <h2 style="font-size:1.2rem;font-weight:700">📐 20 Công thức Phương pháp Nghiên cứu</h2>
      <div style="font-size:.82rem;color:var(--text-muted)">Nhóm: ${[...new Set(FORMULAS.map(f=>f.group))].join(', ')}</div>
    </div>
    <div class="formula-grid" id="formula-grid"></div>`;
  const grid = document.getElementById('formula-grid');
  FORMULAS.forEach(f => {
    const card = document.createElement('div');
    card.className = 'formula-card';
    const groupColor = { A:'#1565c0', B:'#2e7d32', C:'#6a1b9a', D:'#e65100', E:'#00838f', F:'#ad1457', G:'#558b2f', H:'#283593' };
    const col = groupColor[f.group] || '#1565c0';
    card.innerHTML = `
      <div class="fc-header" style="background:${col}">
        <div class="fc-num">${f.id}</div>
        <div><div class="fc-title">${f.title}</div><div class="fc-subtitle">${f.subtitle}</div></div>
      </div>
      <div class="fc-body">
        <div class="fc-formula" id="formula-math-${f.id}">\\(${f.formula}\\)</div>
        <div class="fc-vars"><ul>${f.vars.map(v=>`<li>${v}</li>`).join('')}</ul></div>
        ${f.thresholds.length ? `<div class="fc-thresholds"><table>${f.thresholds.map(([k,v])=>`<tr><td>${k}</td><td>${v}</td></tr>`).join('')}</table></div>` : ''}
        <div class="fc-paper">📄 <b>Bài báo:</b> ${f.paper}</div>
        <div class="fc-tip">💡 <b>Mẹo:</b> ${f.tip}</div>
      </div>`;
    grid.appendChild(card);
  });
  // re-typeset MathJax
  if (window.MathJax && MathJax.typesetPromise) {
    MathJax.typesetPromise([grid]).catch(e => console.warn('MathJax error', e));
  }
}

// ─── QUIZ View ────────────────────────────────────────────────────────────────
function renderQuiz() {
  const el = document.getElementById('view-quiz');
  const group = QUIZ_GROUPS.find(g => g.id === state.activeGroup) || QUIZ_GROUPS[0];

  // Build group tabs
  const tabsHtml = QUIZ_GROUPS.map(g => {
    const gs = getGroupStats(g.id);
    const allDone = gs.done === gs.total;
    return `<div class="group-tab ${g.id === state.activeGroup ? 'active' : ''}" data-g="${g.id}" onclick="selectGroup('${g.id}')">
      ${g.id} ${allDone ? '<span class="g-done">✅</span>' : gs.done > 0 ? `<span class="g-done" style="color:#f57c00">⬤</span>` : ''}
    </div>`;
  }).join('');

  el.innerHTML = `
    <div class="quiz-top">
      <div class="group-tabs">${tabsHtml}</div>
      <div class="quiz-actions">
        <button class="btn btn-ghost btn-sm" onclick="resetGroup('${group.id}')">↺ Reset nhóm</button>
        <button class="btn btn-ghost btn-sm" onclick="resetAll()">Reset tất cả</button>
      </div>
    </div>
    <div style="margin-bottom:16px">
      <b>${group.title}</b>
      <span style="color:var(--text-muted);font-size:.83rem;margin-left:8px">${group.range}</span>
    </div>
    <div id="q-list"></div>`;

  const list = document.getElementById('q-list');
  const globalOffset = QUIZ_GROUPS.slice(0, QUIZ_GROUPS.indexOf(group)).reduce((acc, g) => acc + g.questions.length, 0);
  group.questions.forEach((q, i) => {
    const key = getKey(group.id, i);
    const ans = state.answers[key];
    const globalNum = globalOffset + i + 1;
    const card = document.createElement('div');
    card.id = `qcard-${group.id}-${i}`;
    card.className = `q-card${ans ? (ans.correct ? ' answered-correct' : ' answered-wrong') : ''}`;

    const optsHtml = q.opts.map((o, oi) => {
      let cls = 'opt';
      if (ans) {
        cls += ' disabled';
        if (oi === q.answer) cls += ' correct';
        else if (oi === ans.chosen) cls += ' wrong';
      }
      const letters = ['A','B','C','D'];
      return `<li class="${cls}" onclick="answerQuestion('${group.id}',${i},${oi})">
        <span class="opt-letter">${letters[oi]}.</span>
        <span>${o}</span>
      </li>`;
    }).join('');

    const statusIcon = ans ? (ans.correct ? '✅' : '❌') : '○';
    card.innerHTML = `
      <div class="q-header">
        <div class="q-num">${globalNum}</div>
        <div class="q-text">${q.q}</div>
        <div class="q-status">${statusIcon}</div>
      </div>
      <ul class="opts">${optsHtml}</ul>
      <div class="explain-box${ans ? ' show' : ''}" id="exp-${group.id}-${i}">
        💡 <b>Giải thích:</b> ${q.explain}
      </div>`;
    list.appendChild(card);
  });

  if (window.MathJax && MathJax.typesetPromise) {
    MathJax.typesetPromise([list]).catch(e => {});
  }
}

function selectGroup(gid) {
  state.activeGroup = gid;
  renderQuiz();
  // update sidebar dots
  updateSidebarDots();
}

function answerQuestion(groupId, qIdx, chosen) {
  const key = getKey(groupId, qIdx);
  if (state.answers[key]) return; // already answered
  const group = QUIZ_GROUPS.find(g => g.id === groupId);
  if (!group) return;
  const q = group.questions[qIdx];
  const correct = chosen === q.answer;
  state.answers[key] = { chosen, correct };
  saveState();
  updateHeaderChip();
  updateSidebarDots();
  // Update card in-place
  const card = document.getElementById(`qcard-${groupId}-${qIdx}`);
  if (!card) return;
  card.className = `q-card ${correct ? 'answered-correct' : 'answered-wrong'}`;
  const opts = card.querySelectorAll('.opt');
  opts.forEach((opt, oi) => {
    opt.classList.add('disabled');
    if (oi === q.answer) opt.classList.add('correct');
    else if (oi === chosen) opt.classList.add('wrong');
  });
  const exp = document.getElementById(`exp-${groupId}-${qIdx}`);
  if (exp) exp.classList.add('show');
  const statusEl = card.querySelector('.q-status');
  if (statusEl) statusEl.textContent = correct ? '✅' : '❌';
}

function resetGroup(gid) {
  if (!confirm(`Reset tất cả câu nhóm ${gid}? Không thể hoàn tác.`)) return;
  Object.keys(state.answers).forEach(k => { if (k.startsWith(gid + '_')) delete state.answers[k]; });
  saveState();
  updateHeaderChip();
  updateSidebarDots();
  renderQuiz();
}

function resetAll() {
  if (!confirm('Reset TẤT CẢ tiến độ? Không thể hoàn tác.')) return;
  state.answers = {};
  saveState();
  updateHeaderChip();
  updateSidebarDots();
  renderQuiz();
}

function updateSidebarDots() {
  QUIZ_GROUPS.forEach(g => {
    const gs = getGroupStats(g.id);
    const dot = document.querySelector(`.nav-item[data-group="${g.id}"] .dot`);
    if (!dot) return;
    dot.className = 'dot';
    if (gs.done === 0) return;
    if (gs.done === gs.total && gs.correct === gs.total) dot.classList.add('done');
    else if (gs.done === gs.total) dot.classList.add('wrong');
    else dot.classList.add('skip');
  });
}

// ─── PROGRESS View ─────────────────────────────────────────────────────────
function renderProgress() {
  const s = getStats();
  const el = document.getElementById('view-progress');
  const pct = s.total ? Math.round(s.done / s.total * 100) : 0;
  const accPct = s.done ? Math.round(s.correct / s.done * 100) : 0;
  el.innerHTML = `
    <h2 style="font-size:1.2rem;font-weight:700;margin-bottom:20px">📊 Tiến độ học tập</h2>
    <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:20px;margin-bottom:20px;box-shadow:var(--shadow)">
      <div style="display:flex;gap:30px;flex-wrap:wrap;margin-bottom:14px">
        <div><div style="font-size:2.5rem;font-weight:800;color:var(--primary)">${pct}%</div><div style="font-size:.85rem;color:var(--text-muted)">Hoàn thành</div></div>
        <div><div style="font-size:2.5rem;font-weight:800;color:var(--success)">${accPct}%</div><div style="font-size:.85rem;color:var(--text-muted)">Độ chính xác</div></div>
        <div><div style="font-size:2.5rem;font-weight:800;color:var(--accent)">${s.correct}</div><div style="font-size:.85rem;color:var(--text-muted)">Câu đúng / ${s.total}</div></div>
        <div><div style="font-size:2.5rem;font-weight:800;color:var(--error)">${s.wrong}</div><div style="font-size:.85rem;color:var(--text-muted)">Câu sai</div></div>
      </div>
      <div class="progress-bar-outer" style="height:10px"><div class="progress-bar-inner" style="width:${pct}%"></div></div>
    </div>
    <div class="progress-grid">
      ${QUIZ_GROUPS.map(g => {
        const gs = getGroupStats(g.id);
        const gp = gs.total ? Math.round(gs.done / gs.total * 100) : 0;
        const ga = gs.done ? Math.round(gs.correct / gs.done * 100) : 0;
        return `<div class="pg-card">
          <h3>${g.title}</h3>
          <div class="pg-sub">${g.range}</div>
          <div class="pg-row"><span>Đã làm:</span><span class="val b">${gs.done}/${gs.total}</span></div>
          <div class="pg-row"><span>Đúng:</span><span class="val g">${gs.correct}</span></div>
          <div class="pg-row"><span>Sai:</span><span class="val r">${gs.done - gs.correct}</span></div>
          <div class="pg-row"><span>Độ chính xác:</span><span class="val ${ga >= 80 ? 'g' : ga >= 60 ? 'b' : 'r'}">${ga}%</span></div>
          <div class="progress-bar-outer" style="margin-top:6px"><div class="progress-bar-inner" style="width:${gp}%;background:${ga >= 80 ? 'var(--success)' : ga >= 60 ? 'var(--primary)' : 'var(--error)'}"></div></div>
          <button class="btn btn-ghost btn-sm" style="margin-top:10px;width:100%" onclick="navigate('quiz',{group:'${g.id}'})">Ôn lại nhóm ${g.id}</button>
        </div>`;
      }).join('')}
    </div>
    <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:16px;font-size:.8rem;color:var(--text-muted)">
      ℹ️ Tiến độ được lưu trong trình duyệt này (localStorage). Sẽ mất nếu xóa dữ liệu trình duyệt hoặc dùng chế độ ẩn danh.
    </div>`;
}

// ─── Sidebar builder ──────────────────────────────────────────────────────────
function buildSidebar() {
  const sb = document.getElementById('sidebar');
  sb.innerHTML = `
    <div class="nav-section">
      <div class="nav-label">Điều hướng</div>
      <div class="nav-item active" data-view="home" onclick="navigate('home')">🏠 Tổng quan</div>
      <div class="nav-item" data-view="formulas" onclick="navigate('formulas')">📐 20 Công thức</div>
      <div class="nav-item" data-view="progress" onclick="navigate('progress')">📊 Tiến độ</div>
    </div>
    <div class="nav-section">
      <div class="nav-label">Trắc nghiệm (8 nhóm)</div>
      ${QUIZ_GROUPS.map(g => {
        const gs = getGroupStats(g.id);
        return `<div class="nav-item" data-view="quiz" data-group="${g.id}" onclick="navigate('quiz',{group:'${g.id}'})">
          <span>${g.id}. ${g.title.replace(/Nhóm [A-H]: /,'').split('—')[0].trim()}</span>
          <span class="dot"></span>
        </div>`;
      }).join('')}
    </div>`;
  updateSidebarDots();
}

// ─── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  loadState();
  buildSidebar();
  updateHeaderChip();
  navigate('home');

  // Mobile menu
  const menuBtn = document.getElementById('menu-btn');
  const sidebar = document.getElementById('sidebar');
  if (menuBtn) {
    menuBtn.addEventListener('click', () => sidebar.classList.toggle('open'));
    // Close on outside click
    document.addEventListener('click', e => {
      if (sidebar.classList.contains('open') && !sidebar.contains(e.target) && e.target !== menuBtn) {
        sidebar.classList.remove('open');
      }
    });
  }
});
