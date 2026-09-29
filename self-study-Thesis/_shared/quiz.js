// Quiz client-side, không backend. Nạp ngân hàng câu hỏi từ quiz.json cạnh trang.
// Trắc nghiệm: bấm chọn -> hiện đúng/sai + giải thích. Có lọc theo phần, phân trang, xáo thứ tự, nút làm lại.
// Tự luận: ô tự viết + nút xem gợi ý đáp án (rút từ bài gốc).
(function(){
  const LANG = document.body.dataset.lang === 'en' ? 'en' : 'vi';
  const L = {vi:{load:'Không tải được ngân hàng câu hỏi (quiz.json).',right:'Đúng ',of:' câu đã làm · ngân hàng ',mcq:' câu trắc nghiệm',essayN:' câu tự luận',allSec:'Tất cả các phần',shuf:'⇄ Xáo thứ tự câu',orig:'⇄ Về thứ tự gốc',reset:'↺ Làm lại từ đầu',conf:'Làm lại sẽ xoá toàn bộ lựa chọn đã bấm. Tiếp tục?',expl:'Giải thích:',prev:'◀ Trang trước',next:'Trang sau ▶',page:'Trang ',eh:'Câu tự luận (tự viết trước, rồi xem gợi ý)',ph:'Viết câu trả lời của bạn ở đây (không lưu lên máy chủ)',hint:'Xem gợi ý đáp án',hide:'Ẩn gợi ý',hintL:'Gợi ý đáp án:'},
    en:{load:'Could not load the question bank (quiz.json).',right:'Correct ',of:' answered · bank of ',mcq:' multiple-choice questions',essayN:' essay questions',allSec:'All sections',shuf:'⇄ Shuffle questions',orig:'⇄ Original order',reset:'↺ Restart quiz',conf:'Restarting clears every answer you picked. Continue?',expl:'Explanation:',prev:'◀ Previous page',next:'Next page ▶',page:'Page ',eh:'Essay questions (write first, then check the hint)',ph:'Write your answer here (not stored on any server)',hint:'Show model answer hints',hide:'Hide hints',hintL:'Model answer hints:'}}[LANG];
  const box = document.querySelector('.quiz[data-src]');
  if(!box) return;
  const root = document.getElementById('quiz-root');
  const KEY = 'thesis-quiz:' + location.pathname;
  const PAGE = 10;
  let Q = null, order = [], ans = {}, sec = 'all', page = 0, shuffled = false;

  function load(){ try { return JSON.parse(localStorage.getItem(KEY)||'{}'); } catch(e){ return {}; } }
  function save(){ try { localStorage.setItem(KEY, JSON.stringify({ans:ans, shuffled:shuffled, order:order})); } catch(e){} }
  function rnd(n){ const a=[...Array(n).keys()]; for(let i=n-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }
  function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;'); }

  fetch(box.dataset.src).then(r=>r.json()).then(function(d){
    Q = d;
    const st = load();
    ans = st.ans || {}; shuffled = !!st.shuffled;
    order = (st.order && st.order.length===Q.mcq.length) ? st.order : [...Q.mcq.keys()];
    build();
  }).catch(function(){ root.textContent = L.load; });

  function visible(){ return order.filter(i => sec==='all' || Q.mcq[i].sec===sec); }

  function build(){
    root.innerHTML = '';
    const total = Q.mcq.length, done = Object.keys(ans).length;
    const right = Object.keys(ans).filter(k => ans[k] === Q.mcq[k].c).length;
    const secs = [...new Set(Q.mcq.map(q=>q.sec))];
    const bar = document.createElement('div'); bar.className='quiz-toolbar';
    bar.innerHTML = '<div class="score">' + L.right + right + '/' + done + L.of + total + L.mcq + (Q.essay?(' + '+Q.essay.length+L.essayN):'') + '</div>';
    const ctl = document.createElement('div'); ctl.style.cssText='display:flex;gap:8px;flex-wrap:wrap;align-items:center';
    const sel = document.createElement('select'); sel.className='quiz-sel';
    sel.innerHTML = '<option value="all">' + L.allSec + ' (' + total + ')</option>' + secs.map(s => '<option value="'+esc(s)+'"'+(s===sec?' selected':'')+'>'+esc(s)+' ('+Q.mcq.filter(q=>q.sec===s).length+')</option>').join('');
    sel.addEventListener('change', ()=>{ sec = sel.value; page = 0; build(); });
    const sh = document.createElement('button'); sh.type='button'; sh.className='quiz-reset'; sh.textContent = shuffled ? L.orig : L.shuf;
    sh.addEventListener('click', ()=>{ shuffled=!shuffled; order = shuffled ? rnd(total) : [...Q.mcq.keys()]; page=0; save(); build(); });
    const rs = document.createElement('button'); rs.type='button'; rs.className='quiz-reset'; rs.textContent=L.reset;
    rs.addEventListener('click', ()=>{ if(Object.keys(ans).length && !window.confirm(L.conf)) return; ans={}; page=0; save(); build(); box.scrollIntoView({behavior:'smooth',block:'start'}); });
    ctl.appendChild(sel); ctl.appendChild(sh); ctl.appendChild(rs); bar.appendChild(ctl); root.appendChild(bar);
    const prog = document.createElement('div'); prog.className='quiz-prog'; prog.innerHTML='<i style="width:'+(total?Math.round(100*done/total):0)+'%"></i>'; root.appendChild(prog);

    const vis = visible(), pages = Math.max(1, Math.ceil(vis.length/PAGE));
    if(page>=pages) page = pages-1;
    vis.slice(page*PAGE, (page+1)*PAGE).forEach(function(qi, k){
      const q = Q.mcq[qi], item = document.createElement('div'); item.className='qitem';
      item.innerHTML = '<div><b>' + (page*PAGE+k+1) + '. ' + esc(q.q) + '</b> <span class="qsec">' + esc(q.sec) + '</span></div>';
      const ex = document.createElement('div'); ex.className='explain';
      ex.innerHTML = '<b>' + L.expl + '</b> ' + esc(q.e);
      q.o.forEach(function(opt, oi){
        const b = document.createElement('button'); b.type='button'; b.className='opt'; b.textContent = String.fromCharCode(65+oi)+'. '+opt;
        b.addEventListener('click', function(){
          if(ans[qi]!==undefined) return;
          ans[qi]=oi; save(); paint(item, q, ans[qi], ex); updateScore();
        });
        item.appendChild(b);
      });
      item.appendChild(ex);
      if(ans[qi]!==undefined) paint(item, q, ans[qi], ex);
      root.appendChild(item);
    });
    const nav = document.createElement('div'); nav.className='quiz-nav';
    const pb = document.createElement('button'); pb.type='button'; pb.className='quiz-reset'; pb.textContent=L.prev; pb.disabled = page===0;
    const nb = document.createElement('button'); nb.type='button'; nb.className='quiz-reset'; nb.textContent=L.next; nb.disabled = page>=pages-1;
    const lab = document.createElement('span'); lab.textContent = L.page + (page+1) + '/' + pages;
    pb.addEventListener('click', ()=>{ page--; build(); box.scrollIntoView({behavior:'smooth',block:'start'}); });
    nb.addEventListener('click', ()=>{ page++; build(); box.scrollIntoView({behavior:'smooth',block:'start'}); });
    nav.appendChild(pb); nav.appendChild(lab); nav.appendChild(nb); root.appendChild(nav);

    if(Q.essay && Q.essay.length){
      const h = document.createElement('h3'); h.textContent=L.eh; root.appendChild(h);
      Q.essay.forEach(function(s, i){
        const it = document.createElement('div'); it.className='qitem essay';
        it.innerHTML = '<div><b>T' + (i+1) + '. ' + esc(s.q) + '</b></div><textarea rows="4" placeholder="' + L.ph + '"></textarea>';
        const btn = document.createElement('button'); btn.type='button'; btn.className='quiz-reset'; btn.textContent=L.hint;
        const g = document.createElement('div'); g.className='explain'; g.innerHTML = '<b>' + L.hintL + '</b> ' + esc(s.m);
        btn.addEventListener('click', ()=>{ g.classList.toggle('show'); btn.textContent = g.classList.contains('show') ? L.hide : L.hint; });
        it.appendChild(btn); it.appendChild(g); root.appendChild(it);
      });
    }
  }
  function paint(item, q, choice, ex){
    const opts = item.querySelectorAll('.opt');
    opts.forEach(o => o.dataset.done='1');
    opts[choice].classList.add(choice===q.c ? 'correct':'wrong');
    if(choice!==q.c) opts[q.c].classList.add('correct');
    ex.classList.add('show');
  }
  function updateScore(){
    const total=Q.mcq.length, done=Object.keys(ans).length, right=Object.keys(ans).filter(k=>ans[k]===Q.mcq[k].c).length;
    const s = root.querySelector('.score'); if(s) s.textContent = L.right + right + '/' + done + L.of + total + L.mcq + (Q.essay?(' + '+Q.essay.length+L.essayN):'');
    const p = root.querySelector('.quiz-prog i'); if(p) p.style.width = (total?Math.round(100*done/total):0)+'%';
  }
})();
