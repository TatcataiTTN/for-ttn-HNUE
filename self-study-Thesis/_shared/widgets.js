// Máy tính/tương tác chạy 100% phía trình duyệt. Mỗi widget gắn bằng thuộc tính data-widget trên một <div>.
(function(){
  const $ = (el, sel) => el.querySelector(sel);
  const fmt = (x, d) => (isFinite(x) ? x.toFixed(d) : '—');

  // ---- Phân vị chuẩn (Acklam), dùng cho tính cỡ mẫu ----
  function qnorm(p){
    const a=[-3.969683028665376e+01,2.209460984245205e+02,-2.759285104469687e+02,1.383577518672690e+02,-3.066479806614716e+01,2.506628277459239e+00];
    const b=[-5.447609879822406e+01,1.615858368580409e+02,-1.556989798598866e+02,6.680131188771972e+01,-1.328068155288572e+01];
    const c=[-7.784894002430293e-03,-3.223964580411365e-01,-2.400758277161838e+00,-2.549732539343734e+00,4.374664141464968e+00,2.938163982698783e+00];
    const d=[7.784695709041462e-03,3.224671290700398e-01,2.445134137142996e+00,3.754408661907416e+00];
    const pl=0.02425, ph=1-pl; let q,r;
    if(p<pl){ q=Math.sqrt(-2*Math.log(p)); return (((((c[0]*q+c[1])*q+c[2])*q+c[3])*q+c[4])*q+c[5])/((((d[0]*q+d[1])*q+d[2])*q+d[3])*q+1); }
    if(p>ph){ q=Math.sqrt(-2*Math.log(1-p)); return -(((((c[0]*q+c[1])*q+c[2])*q+c[3])*q+c[4])*q+c[5])/((((d[0]*q+d[1])*q+d[2])*q+d[3])*q+1); }
    q=p-0.5; r=q*q;
    return (((((a[0]*r+a[1])*r+a[2])*r+a[3])*r+a[4])*r+a[5])*q/(((((b[0]*r+b[1])*r+b[2])*r+b[3])*r+b[4])*r+1);
  }
  // n mỗi nhóm cho so sánh 2 trung bình độc lập (xấp xỉ chuẩn, 2 phía)
  function nPerGroup(d, alpha, power){
    const z = qnorm(1-alpha/2) + qnorm(power);
    return Math.ceil(2*z*z/(d*d));
  }
  window.ThesisMath = { qnorm, nPerGroup };

  // ---- 1) Cohen d / Hedges g từ M, SD, n ----
  document.querySelectorAll('[data-widget="dcalc"]').forEach(function(w){
    w.innerHTML = '<div class="w-title">Máy tính cỡ hiệu ứng (Cohen d, Hedges g) và cỡ mẫu cần thiết</div>'
      + '<div class="w-presets"><button type="button" data-p="k1">Kapur 2014: hiểu khái niệm (PF vs DI)</button> <button type="button" data-p="k2">Kapur 2014: chuyển giao (PF vs DI)</button> <button type="button" data-p="k3">Kapur 2014: kiến thức thủ tục</button></div>'
      + '<div class="w-grid"><label>M₁<input type="number" step="any" id="m1"></label><label>SD₁<input type="number" step="any" id="s1"></label><label>n₁<input type="number" id="n1"></label>'
      + '<label>M₂<input type="number" step="any" id="m2"></label><label>SD₂<input type="number" step="any" id="s2"></label><label>n₂<input type="number" id="n2"></label></div>'
      + '<div class="w-out" id="out"></div>';
    const P = {k1:[6.33,1.25,37,3.84,1.24,38], k2:[5.37,1.46,37,3.11,1.51,38], k3:[9.24,1.38,37,9.47,1.27,38]};
    const ids = ['m1','s1','n1','m2','s2','n2'];
    function calc(){
      const v = ids.map(i => parseFloat($(w,'#'+i).value));
      const [m1,s1,n1,m2,s2,n2] = v;
      if (v.some(isNaN) || n1<2 || n2<2) { $(w,'#out').textContent = 'Nhập đủ 6 số.'; return; }
      const sp = Math.sqrt(((n1-1)*s1*s1+(n2-1)*s2*s2)/(n1+n2-2));
      const d = (m1-m2)/sp, g = d*(1-3/(4*(n1+n2)-9));
      const a = Math.abs(d), lab = a<0.2?'rất nhỏ':a<0.5?'nhỏ':a<0.8?'trung bình':'lớn';
      const need = a>0 ? nPerGroup(a,0.05,0.8) : NaN;
      $(w,'#out').innerHTML = '<b>SD gộp</b> = ' + fmt(sp,3) + ' &nbsp;·&nbsp; <b>d</b> = ' + fmt(d,2) + ' &nbsp;·&nbsp; <b>g</b> = ' + fmt(g,2)
        + ' &nbsp;(mức ' + lab + ' theo ngưỡng Cohen 0,2/0,5/0,8)<br>Cỡ mẫu mỗi nhóm để phát hiện đúng hiệu ứng này (α=0,05 hai phía, power 80%): <b>' + (isFinite(need)?need:'—') + '</b>';
    }
    ids.forEach(i => $(w,'#'+i).addEventListener('input', calc));
    w.querySelectorAll('[data-p]').forEach(b => b.addEventListener('click', () => { P[b.dataset.p].forEach((x,k)=>$(w,'#'+ids[k]).value=x); calc(); }));
    P.k1.forEach((x,k)=>$(w,'#'+ids[k]).value=x); calc();
  });

  // ---- 2) Cỡ mẫu (power) ----
  document.querySelectorAll('[data-widget="power"]').forEach(function(w){
    w.innerHTML = '<div class="w-title">Cỡ mẫu mỗi nhóm cho thiết kế 2 nhóm độc lập (treatment vs control)</div>'
      + '<div class="w-grid"><label>Cỡ hiệu ứng d<input type="number" step="0.01" id="d" value="0.5"></label>'
      + '<label>α (hai phía)<select id="al"><option>0.05</option><option>0.01</option><option>0.10</option></select></label>'
      + '<label>Power<select id="pw"><option>0.80</option><option>0.90</option><option>0.95</option></select></label></div><div class="w-out" id="out"></div>';
    function calc(){
      const d=parseFloat($(w,'#d').value), al=parseFloat($(w,'#al').value), pw=parseFloat($(w,'#pw').value);
      if(!(d>0)){ $(w,'#out').textContent='Nhập d > 0.'; return; }
      const n=nPerGroup(d,al,pw);
      $(w,'#out').innerHTML = 'Cần khoảng <b>' + n + '</b> sinh viên mỗi nhóm (tổng <b>' + 2*n + '</b>). Công thức xấp xỉ chuẩn: n = 2·(z<sub>1−α/2</sub> + z<sub>power</sub>)² / d². Với t-test thật, n lớn hơn 1–2 người; nếu dùng ANCOVA với pretest tương quan r thì có thể nhân n với (1−r²).';
    }
    w.querySelectorAll('input,select').forEach(e=>e.addEventListener('input',calc)); calc();
  });

  // ---- 3) Mô hình đồ chơi Cognitive Load (cộng gộp, Sweller 1998) ----
  document.querySelectorAll('[data-widget="clsim"]').forEach(function(w){
    w.innerHTML = '<div class="w-title">Mô hình minh hoạ: tải nhận thức cộng gộp so với dung lượng trí nhớ làm việc</div>'
      + '<div class="w-presets"><button type="button" data-p="a">Người mới + bài toán trần (không gợi ý)</button> <button type="button" data-p="b">Người mới + ví dụ mẫu có lời giải</button> <button type="button" data-p="c">Người đã có schema + bài toán trần</button></div>'
      + '<div class="w-grid"><label>Nội tại (độ phức tạp nội dung × tri thức nền)<input type="range" id="i" min="0" max="100" value="55"><output></output></label>'
      + '<label>Ngoại lai (do cách trình bày kém)<input type="range" id="e" min="0" max="100" value="40"><output></output></label>'
      + '<label>Hữu ích (xây schema)<input type="range" id="g" min="0" max="100" value="10"><output></output></label></div>'
      + '<div class="w-bar"><span id="bi"></span><span id="be"></span><span id="bg"></span><i class="cap"></i></div><div class="w-out" id="out"></div>'
      + '<p class="w-note">Đơn vị là số tương đối (dung lượng = 100), không phải đo lường thực. Mô hình chỉ minh hoạ ý: nếu tổng vượt dung lượng thì học không diễn ra được, và cách trình bày làm giảm phần ngoại lai giải phóng chỗ cho phần hữu ích.</p>';
    const ids=['i','e','g'];
    function calc(){
      const [i,e,g] = ids.map(k=>+$(w,'#'+k).value);
      ids.forEach(k=>{ $(w,'#'+k).nextElementSibling.textContent = $(w,'#'+k).value; });
      const tot=i+e+g, over=tot>100;
      $(w,'#bi').style.width=Math.min(i,100)/1+'%'; $(w,'#be').style.width=Math.min(e,Math.max(0,100-i))+'%'; $(w,'#bg').style.width=Math.min(g,Math.max(0,100-i-e))+'%';
      $(w,'#out').innerHTML = 'Tổng tải = <b>' + tot + '</b> / 100 → ' + (over ? '<span class="bad">QUÁ TẢI: vượt ' + (tot-100) + ' đơn vị, dễ học được rất ít</span>' : '<span class="good">Còn dư ' + (100-tot) + ' đơn vị</span>');
    }
    ids.forEach(k=>$(w,'#'+k).addEventListener('input',calc));
    const P={a:[65,45,10], b:[65,15,20], c:[25,45,10]};
    w.querySelectorAll('[data-p]').forEach(b=>b.addEventListener('click',()=>{P[b.dataset.p].forEach((x,k)=>$(w,'#'+ids[k]).value=x);calc();}));
    calc();
  });

  // ---- 4) Mô hình đồ chơi lạm dụng / bỏ dùng (Parasuraman & Riley 1997) ----
  document.querySelectorAll('[data-widget="reliance"]').forEach(function(w){
    w.innerHTML = '<div class="w-title">Mô hình minh hoạ: độ chính xác của "người + AI" theo chiến lược phụ thuộc</div>'
      + '<div class="w-presets"><button type="button" data-p="0,0">Không bao giờ dùng AI</button> <button type="button" data-p="1,1">Luôn tin AI</button> <button type="button" data-p="0.9,0.3">Hiệu chỉnh tốt</button> <button type="button" data-p="0.5,0.5">Tin ngẫu nhiên</button></div>'
      + '<div class="w-grid"><label>Độ chính xác của AI (A)<input type="range" id="a" min="0" max="100" value="80"><output></output>%</label>'
      + '<label>Độ chính xác khi tự làm (H)<input type="range" id="h" min="0" max="100" value="60"><output></output>%</label>'
      + '<label>P(chấp nhận | AI đúng) = s<sub>đ</sub><input type="range" id="sc" min="0" max="100" value="90"><output></output>%</label>'
      + '<label>P(chấp nhận | AI sai) = s<sub>s</sub><input type="range" id="sw" min="0" max="100" value="30"><output></output>%</label></div><div class="w-out" id="out"></div>'
      + '<p class="w-note">Quy tắc: nếu chấp nhận câu trả lời AI thì đúng/sai theo AI; nếu bác bỏ thì tự giải với độ chính xác H. Đây là mô hình giản lược để thấy cấu trúc của misuse (chấp nhận AI sai) và disuse (bác bỏ AI đúng), không phải dữ liệu thực nghiệm.</p>';
    const ids=['a','h','sc','sw'];
    function calc(){
      const [A,H,sc,sw]=ids.map(k=>+$(w,'#'+k).value/100);
      ids.forEach(k=>{$(w,'#'+k).nextElementSibling.textContent=$(w,'#'+k).value;});
      const team = A*(sc+(1-sc)*H) + (1-A)*((1-sw)*H);
      const misuse=(1-A)*sw, disuse=A*(1-sc);
      const best=Math.max(A,H);
      $(w,'#out').innerHTML='Độ chính xác nhóm <b>người+AI</b> = <b>'+fmt(team*100,1)+'%</b> (AI một mình '+fmt(A*100,1)+'%, người một mình '+fmt(H*100,1)+'%)<br>'
        +'Misuse (chấp nhận AI sai): <b>'+fmt(misuse*100,1)+'%</b> số câu · Disuse (bác bỏ AI đúng): <b>'+fmt(disuse*100,1)+'%</b> số câu<br>'
        +(team>best+1e-9?'<span class="good">Nhóm tốt hơn cả hai bên: hiệu chỉnh đang tạo giá trị.</span>':team<best-1e-9?'<span class="bad">Nhóm kém hơn bên tốt nhất một mình ('+fmt(best*100,1)+'%): phụ thuộc chưa phù hợp.</span>':'<span>Nhóm bằng bên tốt nhất một mình.</span>');
    }
    ids.forEach(k=>$(w,'#'+k).addEventListener('input',calc));
    w.querySelectorAll('[data-p]').forEach(b=>b.addEventListener('click',()=>{const [x,y]=b.dataset.p.split(',');$(w,'#sc').value=x*100;$(w,'#sw').value=y*100;calc();}));
    calc();
  });

  // ---- 5) Hiệu chỉnh độ tự tin (overconfidence, Brier) ----
  document.querySelectorAll('[data-widget="calibration"]').forEach(function(w){
    const rows=[[90,1],[80,1],[100,0],[70,1],[90,0],[60,1],[95,1],[80,0],[70,0],[100,1]];
    w.innerHTML='<div class="w-title">Tự đo hiệu chỉnh: độ tự tin so với kết quả thật (10 câu mẫu, sửa được)</div><table class="w-tbl"><tr><th>Câu</th><th>Độ tự tin (%) rằng mình đúng</th><th>Thực tế đúng?</th></tr>'
      +rows.map((r,i)=>'<tr><td>'+(i+1)+'</td><td><input type="number" min="50" max="100" step="5" value="'+r[0]+'"></td><td><input type="checkbox"'+(r[1]?' checked':'')+'></td></tr>').join('')+'</table><div class="w-out"></div>'
      +'<p class="w-note">Overconfidence = độ tự tin trung bình − tỉ lệ đúng thật. Brier = trung bình (tự tin − kết quả)², với kết quả 1 nếu đúng, 0 nếu sai; càng gần 0 càng hiệu chỉnh tốt. Dữ liệu mẫu do người soạn đặt để minh hoạ, không lấy từ nghiên cứu nào.</p>';
    function calc(){
      const trs=[...w.querySelectorAll('.w-tbl tr')].slice(1);
      const conf=trs.map(t=>+t.querySelector('input[type=number]').value/100), y=trs.map(t=>t.querySelector('input[type=checkbox]').checked?1:0);
      const mc=conf.reduce((a,b)=>a+b,0)/conf.length, acc=y.reduce((a,b)=>a+b,0)/y.length;
      const br=conf.reduce((s,c,i)=>s+Math.pow(c-y[i],2),0)/conf.length;
      w.querySelector('.w-out').innerHTML='Tự tin TB = <b>'+fmt(mc*100,1)+'%</b> · Đúng thật = <b>'+fmt(acc*100,1)+'%</b> · Overconfidence = <b>'+fmt((mc-acc)*100,1)+' điểm %</b> · Brier = <b>'+fmt(br,3)+'</b>';
    }
    w.addEventListener('input',calc); calc();
  });

  // ---- 6) Bài tập tính toán tự chấm: <div class="ex" data-ans="2.00" data-tol="0.03"> ----
  document.querySelectorAll('.ex').forEach(function(ex){
    const ans=parseFloat(ex.dataset.ans), tol=parseFloat(ex.dataset.tol||'0.01');
    const inp=document.createElement('input'); inp.type='number'; inp.step='any'; inp.placeholder='Đáp số';
    const btn=document.createElement('button'); btn.type='button'; btn.className='btn secondary'; btn.textContent='Kiểm tra';
    const fb=document.createElement('span'); fb.className='ex-fb';
    ex.appendChild(inp); ex.appendChild(btn); ex.appendChild(fb);
    btn.addEventListener('click',()=>{
      const v=parseFloat(inp.value);
      if(isNaN(v)){ fb.textContent='Nhập một số.'; fb.className='ex-fb'; return; }
      const ok=Math.abs(v-ans)<=tol;
      fb.textContent=ok?'✔ Đúng':'✘ Chưa đúng, thử lại (gợi ý: xem lại công thức bên trên)';
      fb.className='ex-fb '+(ok?'ok':'no');
      const sol=ex.querySelector('.sol'); if(sol && ok) sol.style.display='block';
    });
  });
})();
