// Dựng khung trang (header, banner, modal thông tin, chân trang, điều hướng module) từ thuộc tính data- trên <body>.
// Trang module: <body data-page="module" data-slug="01-..." data-root="../../">. Trang chủ: <body data-page="home" data-root="">.
(function(){
  const body = document.body, root = body.dataset.root || '', page = body.dataset.page;
  const MODS = window.THESIS_MODULES || [];
  const cur = MODS.findIndex(m => m.slug === body.dataset.slug);
  const m = MODS[cur];
  const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');

  const fab = '<button id="info-fab" type="button" aria-haspopup="dialog" aria-controls="info-modal" title="Thông tin trang & góp ý">i</button>';
  const themes = '<details class="themesw"><summary>🎨 Giao diện</summary><div class="theme-menu">'
    + '<button type="button" data-theme="light"><span class="swatch" style="background:#2f6fe0"></span>Sáng (mặc định)</button>'
    + '<button type="button" data-theme="dark"><span class="swatch" style="background:#1a2230"></span>Tối</button>'
    + '<button type="button" data-theme="pink"><span class="swatch" style="background:#d6417e"></span>Hồng</button>'
    + '<button type="button" data-theme="blue"><span class="swatch" style="background:#1c6fd0"></span>Lam</button>'
    + '<button type="button" data-theme="green"><span class="swatch" style="background:#1f9d55"></span>Lục</button></div></details>'
    + '<details class="fontsw"><summary>🔤 Phông chữ</summary><div class="theme-menu">'
    + '<button type="button" data-font="times" style="font-family:\'Times New Roman\',serif">Aa Times New Roman (mặc định)</button>'
    + '<button type="button" data-font="montserrat" style="font-family:\'Montserrat\',sans-serif">Aa Montserrat</button></div></details>';
  const crumbs = page === 'module' && m
    ? '<nav class="crumbs"><a href="' + root + 'index.html#modules">Các module</a> / ' + m.n + ' · ' + esc(m.title) + '</nav>'
    : '<nav class="crumbs">Tự học nền tảng lý luận cho đề tài</nav>';
  const header = '<header class="site"><div class="wrap bar"><a class="brand" href="' + root + 'index.html"><span class="dot"></span>Tự học Đề tài · AI có trách nhiệm trong dạy lập trình</a>'
    + crumbs + '<div class="headerctl">' + themes + '</div></div></header>'
    + '<div class="banner"><div class="wrap"><span>⚠️</span><div><b>Lưu ý: nội dung trang này phần lớn do AI soạn từ các bài báo đã đọc.</b> Số liệu trích từ bài gốc đều ghi nguồn; hãy đối chiếu bài gốc trước khi trích dẫn trong luận văn. Phát hiện sai sót xin góp ý qua nút "i" góc trái.</div></div></div>';
  const modal = '<div class="info-modal" id="info-modal" hidden role="dialog" aria-modal="true" aria-label="Thông tin trang"><div class="info-modal-backdrop"></div><div class="info-modal-panel">'
    + '<button class="info-modal-close" type="button" aria-label="Đóng">✕</button><h3>Thông tin trang</h3>'
    + '<h4>Mục đích</h4><p>Bộ 14 module tự học nền tảng lý luận cho đề tài: thiết kế và đánh giá mô hình dùng AI có trách nhiệm trong môn nhập môn lập trình. Mỗi module ứng với một từ khoá và các bài báo kinh điển của từ khoá đó.</p>'
    + '<h4>Nguồn</h4><p>46 bài báo, sách và báo cáo trong thư mục <code>Papers_keywords</code>. Bản OCR/text chỉ lưu cục bộ trên máy soạn (không đăng công khai vì bản quyền); mỗi module dẫn link DOI tới bài gốc.</p>'
    + '<h4>Cách dùng</h4><ul><li>Xem slide (phím ← →), đọc phần chi tiết bên dưới, làm bài tập tính toán và quiz ở cuối.</li><li>Quiz và máy tính chạy hoàn toàn trong trình duyệt, không lưu dữ liệu lên máy chủ.</li></ul>'
    + '<h4>Góp ý</h4><p><a href="https://github.com/TatcataiTTN/for-ttn-HNUE/issues" target="_blank" rel="noopener">github.com/TatcataiTTN/for-ttn-HNUE/issues</a></p></div></div>';
  let pager = '';
  if (page === 'module' && m) {
    const p = MODS.slice(0,cur).reverse().find(x=>x.ready), n = MODS.slice(cur+1).find(x=>x.ready);
    pager = '<nav class="pager">' + (p ? '<a href="' + root + 'modules/' + p.slug + '/index.html">← ' + p.n + ' · ' + esc(p.title) + '</a>' : '<span></span>')
      + (n ? '<a href="' + root + 'modules/' + n.slug + '/index.html">' + n.n + ' · ' + esc(n.title) + ' →</a>' : '<span></span>') + '</nav>';
  }
  const footer = '<footer class="site"><div class="wrap">Tự học Đề tài · Nghiên cứu khoa học giáo dục · <button class="info-footer-btn" type="button" data-info-open>Thông tin & góp ý</button></div></footer>';

  body.insertAdjacentHTML('afterbegin', fab + header);
  const main = body.querySelector('main');
  if (main) main.insertAdjacentHTML('beforeend', pager);
  body.insertAdjacentHTML('beforeend', footer + modal);

  // Trang chủ: dựng thẻ module
  const grid = document.getElementById('mod-grid');
  if (grid) grid.innerHTML = MODS.map(x => {
    const inner = '<div class="n">MODULE ' + x.n + (x.ready ? '' : ' · SẮP CÓ') + '</div><h3>' + x.ico + ' ' + esc(x.title) + '</h3><p>' + esc(x.sub) + '</p><p><span class="tag">' + esc(x.src) + '</span></p>';
    return x.ready ? '<a class="mod-card" href="modules/' + x.slug + '/index.html">' + inner + '</a>' : '<div class="mod-card" style="opacity:.5;cursor:default">' + inner + '</div>';
  }).join('');
})();
