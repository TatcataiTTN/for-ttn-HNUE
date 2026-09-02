// ─── Patch buildSidebar to include new nav items ────────────────────────────
// Override buildSidebar from app.js after data2.js is loaded
(function patchApp() {
  const orig = window.buildSidebar;
  window.buildSidebar = function() {
    const sb = document.getElementById('sidebar');
    sb.innerHTML = `
      <div class="nav-section">
        <div class="nav-label">Điều hướng</div>
        <div class="nav-item" data-view="home"       onclick="navigate('home')">🏠 Tổng quan</div>
        <div class="nav-item" data-view="formulas"   onclick="navigate('formulas')">📐 20 Công thức</div>
        <div class="nav-item" data-view="research"   onclick="navigate('research')">🔬 Xu hướng Nghiên cứu</div>
        <div class="nav-item" data-view="principles" onclick="navigate('principles')">📌 20 Nguyên tắc</div>
        <div class="nav-item" data-view="progress"   onclick="navigate('progress')">📊 Tiến độ</div>
      </div>
      <div class="nav-section">
        <div class="nav-label">Trắc nghiệm (12 nhóm)</div>
        ${QUIZ_GROUPS.map(g => {
          return `<div class="nav-item" data-view="quiz" data-group="${g.id}" onclick="navigate('quiz',{group:'${g.id}'})">
            <span>${g.id}. ${g.title.replace(/Nhóm [A-L]: /,'').split('—')[0].substring(0,28)}…</span>
            <span class="dot"></span>
          </div>`;
        }).join('')}
      </div>`;
    updateSidebarDots();
    // mark active
    document.querySelectorAll('.nav-item').forEach(n => {
      n.classList.toggle('active', n.dataset.view === state.view && (!n.dataset.group || n.dataset.group === state.activeGroup));
    });
  };

  // patch navigate to support new views
  const origNav = window.navigate;
  window.navigate = function(view, opts = {}) {
    state.view = view;
    if (opts.group) state.activeGroup = opts.group;
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    const el = document.getElementById('view-' + view);
    if (el) el.classList.add('active');
    document.querySelectorAll('.nav-item').forEach(n => {
      n.classList.toggle('active', n.dataset.view === view && (!n.dataset.group || n.dataset.group === state.activeGroup));
    });
    if (view === 'home')       renderHome();
    else if (view === 'formulas')   renderFormulas();
    else if (view === 'quiz')       renderQuiz();
    else if (view === 'research')   renderResearch();
    else if (view === 'principles') renderPrinciples();
    else if (view === 'progress')   renderProgress();
    document.getElementById('sidebar').classList.remove('open');
    window.scrollTo(0, 0);
  };

  // patch renderHome to show 12 groups and 120 questions
  window.renderHome = function() {
    const s = getStats();
    const pct = s.total ? Math.round(s.done / s.total * 100) : 0;
    const el = document.getElementById('view-home');
    el.innerHTML = `
      <div class="home-hero">
        <h1>🎓 Tự học PPNC — AI-TPACK-SE</h1>
        <p>Trương Tuấn Nghĩa · HNUE 2026 · TS. Nguyễn Thị Thanh Huyền</p>
        <p style="font-size:.82rem;opacity:.75;margin-top:6px">Phương pháp nghiên cứu định lượng · 20 công thức · 120 MCQ · Top 20 nhóm NC · 20 nguyên tắc</p>
      </div>
      <div class="cards-grid">
        <div class="stat-card" onclick="navigate('formulas')">
          <div class="big">20</div><div class="label">📐 Công thức PPNC</div>
          <div class="progress-bar-outer"><div class="progress-bar-inner" style="width:100%;background:var(--success)"></div></div>
        </div>
        <div class="stat-card" onclick="navigate('quiz')">
          <div class="big">${s.done}/${s.total}</div><div class="label">📝 MCQ đã làm</div>
          <div class="progress-bar-outer"><div class="progress-bar-inner" style="width:${pct}%"></div></div>
        </div>
        <div class="stat-card" onclick="navigate('research')">
          <div class="big">20</div><div class="label">🔬 Nhóm NC hàng đầu</div>
          <div class="progress-bar-outer"><div class="progress-bar-inner" style="width:100%;background:var(--accent)"></div></div>
        </div>
        <div class="stat-card" onclick="navigate('principles')">
          <div class="big">20</div><div class="label">📌 Nguyên tắc làm việc</div>
          <div class="progress-bar-outer"><div class="progress-bar-inner" style="width:100%;background:#6a1b9a"></div></div>
        </div>
      </div>
      <div class="section-title">📝 12 Nhóm câu hỏi (120 MCQ)</div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:12px;margin-bottom:24px">
        ${QUIZ_GROUPS.map(g => {
          const gs = getGroupStats(g.id);
          const gp = Math.round(gs.done/gs.total*100);
          const labelShort = g.title.replace(/Nhóm [A-L]: /,'');
          return `<div class="stat-card" onclick="navigate('quiz',{group:'${g.id}'})" style="padding:14px">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
              <span style="background:var(--primary);color:#fff;border-radius:6px;padding:2px 8px;font-size:.75rem;font-weight:700">${g.id}</span>
              <span style="font-size:.8rem;font-weight:600;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${labelShort.substring(0,35)}</span>
            </div>
            <div style="font-size:.73rem;color:var(--text-muted);margin-bottom:5px">${g.range} · ${gs.done}/${gs.total} · ✅${gs.correct}</div>
            <div class="progress-bar-outer"><div class="progress-bar-inner" style="width:${gp}%"></div></div>
          </div>`;
        }).join('')}
      </div>
      <div class="section-title">🔬 8 Xu hướng nghiên cứu nóng</div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:10px;margin-bottom:24px">
        ${TRENDING_TOPICS.map(t => `
          <div class="stat-card" onclick="navigate('research')" style="padding:14px;cursor:pointer">
            <div style="font-size:.78rem;color:var(--accent);font-weight:700;margin-bottom:3px">${t.trend_level}</div>
            <div style="font-size:.85rem;font-weight:600">${t.topic}</div>
          </div>`).join('')}
      </div>`;
  };

  // patch updateHeaderChip
  window.updateHeaderChip = function() {
    const s = getStats();
    const pct = s.total ? Math.round(s.done/s.total*100) : 0;
    const chip = document.getElementById('header-chip');
    if (chip) chip.textContent = `${s.done}/${s.total} câu · ${pct}%`;
  };
})();

// ─── RESEARCH VIEW ────────────────────────────────────────────────────────────
function renderResearch() {
  const el = document.getElementById('view-research');
  const groupColors = ['#1565c0','#2e7d32','#6a1b9a','#e65100','#00838f','#ad1457','#558b2f','#283593','#bf360c','#1b5e20'];

  el.innerHTML = `
    <h2 style="font-size:1.2rem;font-weight:700;margin-bottom:6px">🔬 Xu hướng Nghiên cứu & Top 20 Nhóm NC Hàng đầu</h2>
    <p style="font-size:.83rem;color:var(--text-muted);margin-bottom:22px">Literature review tổng hợp 2022–2026 · Trực tiếp liên quan đến AI-TPACK-SE tại HNUE</p>

    <div class="section-title">📈 8 Xu hướng Nghiên cứu Nóng nhất (2023–2026)</div>
    <div style="display:flex;flex-direction:column;gap:14px;margin-bottom:32px">
      ${TRENDING_TOPICS.map((t, i) => `
        <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;box-shadow:var(--shadow)">
          <div style="background:${groupColors[i % groupColors.length]};color:#fff;padding:12px 16px;display:flex;align-items:center;gap:12px">
            <span style="background:rgba(255,255,255,.2);border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:.8rem;flex-shrink:0">${t.id}</span>
            <div>
              <div style="font-weight:700;font-size:.95rem">${t.topic}</div>
              <div style="font-size:.78rem;opacity:.85">${t.trend_level}</div>
            </div>
          </div>
          <div style="padding:14px 16px">
            <p style="font-size:.85rem;margin-bottom:10px;color:var(--text)">${t.description}</p>
            <div style="margin-bottom:10px">
              <div style="font-size:.75rem;font-weight:700;color:var(--primary);margin-bottom:4px">🔑 Key Findings:</div>
              <ul style="list-style:none;padding:0;margin:0">
                ${t.key_findings.map(f => `<li style="font-size:.78rem;padding:2px 0 2px 12px;position:relative;color:var(--text-muted)"><span style="position:absolute;left:0;color:var(--primary)">▸</span>${f}</li>`).join('')}
              </ul>
            </div>
            <div style="background:#fff3e0;border-left:3px solid var(--warning);padding:7px 10px;border-radius:0 6px 6px 0;font-size:.78rem;color:#5a4000;margin-bottom:8px">
              🇻🇳 <b>Gap cho VN:</b> ${t.gap_for_vn}
            </div>
            <div style="display:flex;flex-wrap:wrap;gap:5px;margin-bottom:8px">
              ${t.journals.map(j => `<span style="background:var(--primary-light);color:var(--primary);border-radius:12px;padding:2px 9px;font-size:.72rem;font-weight:600">${j}</span>`).join('')}
            </div>
            <div style="background:#f5f5f5;border-radius:6px;padding:7px 10px;font-size:.72rem;font-family:monospace;color:#333;word-break:break-all">${t.search_string}</div>
          </div>
        </div>`).join('')}
    </div>

    <div class="section-title">🏛 Top 20 Nhóm Nghiên cứu Hàng đầu</div>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:14px">
      ${RESEARCH_GROUPS.map(g => `
        <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;box-shadow:var(--shadow)">
          <div style="background:${groupColors[(g.rank-1) % groupColors.length]};color:#fff;padding:10px 14px;display:flex;align-items:flex-start;gap:10px">
            <span style="background:rgba(255,255,255,.25);border-radius:6px;padding:2px 8px;font-weight:800;font-size:.85rem;flex-shrink:0">#${g.rank}</span>
            <div>
              <div style="font-weight:700;font-size:.85rem;line-height:1.3">${g.name}</div>
              <div style="font-size:.75rem;opacity:.85;margin-top:2px">${g.country}</div>
            </div>
          </div>
          <div style="padding:12px 14px;font-size:.8rem">
            <div style="margin-bottom:6px;color:var(--text-muted)"><b style="color:var(--text)">👤 Nhà NC:</b> ${g.key_people}</div>
            <div style="margin-bottom:6px;color:var(--text-muted)"><b style="color:var(--text)">🎯 Focus:</b> ${g.focus}</div>
            <div style="margin-bottom:8px">
              <div style="font-weight:700;color:var(--primary);margin-bottom:3px;font-size:.73rem">📄 Bài báo tiêu biểu:</div>
              ${g.key_papers.map(p => `<div style="color:var(--text-muted);padding:1px 0 1px 10px;position:relative"><span style="position:absolute;left:0;color:var(--accent)">▸</span>${p}</div>`).join('')}
            </div>
            <div style="background:#e8f5e9;border-left:3px solid var(--success);padding:6px 8px;border-radius:0 5px 5px 0;color:#1b5e20;font-size:.75rem">
              💡 ${g.impact}
            </div>
          </div>
        </div>`).join('')}
    </div>`;
}

// ─── PRINCIPLES VIEW ──────────────────────────────────────────────────────────
function renderPrinciples() {
  const el = document.getElementById('view-principles');
  const cats = [...new Set(WORKING_PRINCIPLES.map(p => p.cat))];
  const catColors = {'📐 Thống kê':'#1565c0','🔬 Thiết kế NC':'#2e7d32','📝 Viết luận văn':'#6a1b9a','🤖 AI Tools':'#e65100','📚 Literature Review':'#00838f','🎯 KLTN Cụ thể':'#ad1457'};

  el.innerHTML = `
    <h2 style="font-size:1.2rem;font-weight:700;margin-bottom:6px">📌 20 Nguyên tắc Làm việc Nghiên cứu</h2>
    <p style="font-size:.83rem;color:var(--text-muted);margin-bottom:22px">Được đúc kết từ các bài báo chuẩn · Áp dụng trực tiếp cho KLTN AI-TPACK-SE</p>
    ${cats.map(cat => {
      const ps = WORKING_PRINCIPLES.filter(p => p.cat === cat);
      const col = catColors[cat] || '#1565c0';
      return `
        <div class="section-title" style="color:${col}">${cat}</div>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:12px;margin-bottom:22px">
          ${ps.map(p => `
            <div style="background:var(--surface);border:1px solid var(--border);border-left:4px solid ${col};border-radius:var(--radius);padding:14px;box-shadow:var(--shadow)">
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:7px">
                <span style="background:${col};color:#fff;border-radius:50%;width:24px;height:24px;display:flex;align-items:center;justify-content:center;font-size:.72rem;font-weight:700;flex-shrink:0">${p.id}</span>
                <span style="font-weight:700;font-size:.88rem">${p.title}</span>
              </div>
              <p style="font-size:.8rem;color:var(--text-muted);line-height:1.6;margin:0">${p.body}</p>
            </div>`).join('')}
        </div>`;
    }).join('')}`;
}

// ─── Extend CSS for new content (inject style) ────────────────────────────────
(function() {
  const s = document.createElement('style');
  s.textContent = `
    .home-hero h1 { font-size: 1.5rem; }
    @media (max-width: 500px) { .home-hero h1 { font-size: 1.2rem; } }
  `;
  document.head.appendChild(s);
})();

// ─── Re-init after data2 ready ────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function() {
  // Re-build sidebar now that QUIZ_GROUPS includes ext groups
  buildSidebar();
  updateHeaderChip();
  navigate('home');
});
