// app3.js — Final patch: cập nhật sidebar thêm Slides + Flashcards links
// Tải sau app2.js, override buildSidebar lần cuối

(function patchApp3() {
  const origBuildSidebar = window.buildSidebar;
  window.buildSidebar = function() {
    const sb = document.getElementById('sidebar');
    sb.innerHTML = `
      <div class="nav-section">
        <div class="nav-label">Điều hướng</div>
        <div class="nav-item" data-view="home"       onclick="navigate('home')">🏠 Tổng quan</div>
        <div class="nav-item" data-view="formulas"   onclick="navigate('formulas')">📐 20 Công thức</div>
        <div class="nav-item" data-view="research"   onclick="navigate('research')">🔬 Xu hướng NC</div>
        <div class="nav-item" data-view="principles" onclick="navigate('principles')">📌 20 Nguyên tắc</div>
        <div class="nav-item" data-view="progress"   onclick="navigate('progress')">📊 Tiến độ</div>
      </div>
      <div class="nav-section">
        <div class="nav-label">🎓 Học tập</div>
        <a class="nav-item" href="slides.html" target="_blank" style="text-decoration:none;color:inherit">
          🎞 Slide Bảo vệ (13 slide)
          <span style="font-size:.62rem;background:#e65100;color:#fff;border-radius:10px;padding:1px 6px;margin-left:4px">MỚI</span>
        </a>
        <a class="nav-item" href="flashcards.html" target="_blank" style="text-decoration:none;color:inherit">
          🃏 Flashcards (36 thẻ)
          <span style="font-size:.62rem;background:#2e7d32;color:#fff;border-radius:10px;padding:1px 6px;margin-left:4px">MỚI</span>
        </a>
      </div>
      <div class="nav-section">
        <div class="nav-label">Trắc nghiệm (14 nhóm)</div>
        ${QUIZ_GROUPS.map(g => {
          const shortTitle = g.title.replace(/Nhóm [A-N]: /,'').split('—')[0].split('(')[0].trim();
          return `<div class="nav-item" data-view="quiz" data-group="${g.id}" onclick="navigate('quiz',{group:'${g.id}'})">
            <span style="font-weight:700;color:var(--primary);margin-right:4px">${g.id}.</span>
            <span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${shortTitle.substring(0,30)}</span>
            <span class="dot"></span>
          </div>`;
        }).join('')}
      </div>`;
    updateSidebarDots();
    document.querySelectorAll('.nav-item').forEach(n => {
      n.classList.toggle('active', n.dataset.view === state.view && (!n.dataset.group || n.dataset.group === state.activeGroup));
    });
  };

  // Override renderHome to show 14 groups + quick links to slides/flashcards
  window.renderHome = function() {
    const s = getStats();
    const pct = s.total ? Math.round(s.done / s.total * 100) : 0;
    const el = document.getElementById('view-home');
    el.innerHTML = `
      <div class="home-hero">
        <h1>🎓 Tự học PPNC — AI-TPACK-SE</h1>
        <p>Trương Tuấn Nghĩa · HNUE 2026 · TS. Nguyễn Thị Thanh Huyền</p>
        <p style="font-size:.82rem;opacity:.75;margin-top:6px">20 công thức · 140 MCQ · 36 flashcard · Slide bảo vệ · Top 20 nhóm NC · 20 nguyên tắc</p>
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

      <div class="section-title">🎓 Công cụ học tập mới</div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:12px;margin-bottom:28px">
        <a href="slides.html" target="_blank" style="text-decoration:none">
          <div style="background:linear-gradient(135deg,#0d1b4b,#1a0a3e);color:#fff;border-radius:12px;padding:18px;cursor:pointer;border:2px solid #4f8ef7">
            <div style="font-size:1.8rem;margin-bottom:6px">🎞</div>
            <div style="font-weight:800;font-size:.95rem;margin-bottom:4px">Slide Bảo vệ KLTN</div>
            <div style="font-size:.78rem;opacity:.8">13 slide · Action Title · SVG animations · Keyboard nav</div>
            <div style="font-size:.7rem;background:rgba(247,201,72,.2);color:#f7c948;border-radius:8px;padding:3px 10px;display:inline-block;margin-top:8px;font-weight:700">MỚI 🔥</div>
          </div>
        </a>
        <a href="flashcards.html" target="_blank" style="text-decoration:none">
          <div style="background:linear-gradient(135deg,#0a2810,#1a2e0a);color:#fff;border-radius:12px;padding:18px;cursor:pointer;border:2px solid #4caf82">
            <div style="font-size:1.8rem;margin-bottom:6px">🃏</div>
            <div style="font-weight:800;font-size:.95rem;margin-bottom:4px">Flashcards Lật thẻ</div>
            <div style="font-size:.78rem;opacity:.8">36 thẻ · 8 danh mục · Tự đánh giá · Ôn lại bài quên</div>
            <div style="font-size:.7rem;background:rgba(76,175,130,.2);color:#4caf82;border-radius:8px;padding:3px 10px;display:inline-block;margin-top:8px;font-weight:700">MỚI 🆕</div>
          </div>
        </a>
      </div>

      <div class="section-title">📝 14 Nhóm câu hỏi (140 MCQ)</div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:10px;margin-bottom:28px">
        ${QUIZ_GROUPS.map(g => {
          const gs = getGroupStats(g.id);
          const gp = Math.round(gs.done/gs.total*100);
          const labelShort = g.title.replace(/Nhóm [A-N]: /,'').split('(')[0].trim();
          const isNew = ['M','N'].includes(g.id);
          return `<div class="stat-card" onclick="navigate('quiz',{group:'${g.id}'})" style="padding:14px;position:relative">
            ${isNew ? '<span style="position:absolute;top:8px;right:8px;background:#e65100;color:#fff;font-size:.6rem;border-radius:10px;padding:1px 7px;font-weight:700">MỚI</span>' : ''}
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
              <span style="background:var(--primary);color:#fff;border-radius:6px;padding:2px 8px;font-size:.75rem;font-weight:700">${g.id}</span>
              <span style="font-size:.78rem;font-weight:600;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${labelShort.substring(0,32)}</span>
            </div>
            <div style="font-size:.72rem;color:var(--text-muted);margin-bottom:5px">${gs.done}/${gs.total} đã làm · ✅${gs.correct} đúng</div>
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

  // Re-init with new data
  document.addEventListener('DOMContentLoaded', function() {
    if (typeof QUIZ_GROUPS !== 'undefined' && typeof buildSidebar === 'function') {
      buildSidebar();
      if (typeof updateHeaderChip === 'function') updateHeaderChip();
      navigate('home');
    }
  });
})();
