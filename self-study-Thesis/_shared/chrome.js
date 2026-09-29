// Dựng khung trang (header, banner, modal, chân trang, điều hướng module, đổi ngôn ngữ) từ thuộc tính data- trên <body>.
// Trang module: <body data-page="module" data-slug="01-..." data-root="../../" data-lang="vi|en">. Trang chủ: data-page="home".
// Cây EN nằm ở en/ và dùng chung _shared/ (data-root trỏ về thư mục chứa index.html của chính ngôn ngữ đó, data-shared trỏ tới _shared).
(function(){
  const body = document.body, root = body.dataset.root || '', page = body.dataset.page;
  const lang = body.dataset.lang === 'en' ? 'en' : 'vi';
  const MODS = window.THESIS_MODULES || [];
  const cur = MODS.findIndex(m => m.slug === body.dataset.slug);
  const m = MODS[cur];
  const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');
  const T = {
    vi: {brand:'Tự học Đề tài · AI có trách nhiệm trong dạy lập trình', modules:'Các module', home:'Tự học nền tảng lý luận cho đề tài',
      theme:'🎨 Giao diện', font:'🔤 Phông chữ', light:'Sáng (mặc định)', dark:'Tối', pink:'Hồng', blue:'Lam', green:'Lục', times:'Aa Times New Roman (mặc định)',
      banner:'<b>Lưu ý: nội dung trang này phần lớn do AI soạn từ các bài báo đã đọc.</b> Số liệu trích từ bài gốc đều ghi nguồn; hãy đối chiếu bài gốc trước khi trích dẫn trong luận văn. Phát hiện sai sót xin góp ý qua nút "i" góc trái.',
      infoTitle:'Thông tin trang', why:'Mục đích', whyP:'Bộ 14 module tự học nền tảng lý luận cho đề tài: thiết kế và đánh giá mô hình dùng AI có trách nhiệm trong môn nhập môn lập trình. Mỗi module ứng với một từ khoá và các bài báo kinh điển của từ khoá đó.',
      src:'Nguồn', srcP:'46 bài báo, sách và báo cáo trong thư mục Papers_keywords. Bản OCR/text chỉ lưu cục bộ trên máy soạn (không đăng công khai vì bản quyền); mỗi module dẫn link DOI tới bài gốc.',
      how:'Cách dùng', howL:['Xem slide (phím ← →), đọc phần chi tiết bên dưới, làm bài tập tính toán và quiz ở cuối.','Quiz và máy tính chạy hoàn toàn trong trình duyệt, không lưu dữ liệu lên máy chủ.'],
      fb:'Góp ý', foot:'Tự học Đề tài · Nghiên cứu khoa học giáo dục · ', footBtn:'Thông tin & góp ý', module:'MODULE', soon:' · SẮP CÓ', close:'Đóng', fab:'Thông tin trang & góp ý'},
    en: {brand:'Thesis Self-Study · Responsible AI in Teaching Programming', modules:'Modules', home:'Self-study of the theoretical foundations',
      theme:'🎨 Theme', font:'🔤 Font', light:'Light (default)', dark:'Dark', pink:'Pink', blue:'Blue', green:'Green', times:'Aa Times New Roman (default)',
      banner:'<b>Note: most of this page was drafted by AI from the papers it read.</b> Figures quoted from the source papers carry a citation; check the original before citing it in your thesis. Please report errors via the "i" button on the left.',
      infoTitle:'About this page', why:'Purpose', whyP:'A 14-module self-study course on the theoretical foundations of the thesis: designing and evaluating a responsible-AI model for an introductory programming course. Each module covers one keyword and its classic papers.',
      src:'Sources', srcP:'46 papers, books and reports in the Papers_keywords folder. OCR/text copies are kept locally only (not published, for copyright reasons); each module links to the source DOI.',
      how:'How to use', howL:['Watch the slides (← → keys), read the details below, then do the exercises and the quiz at the end.','The quiz and calculators run entirely in your browser; nothing is stored on a server.'],
      fb:'Feedback', foot:'Thesis Self-Study · Educational Research · ', footBtn:'About & feedback', module:'MODULE', soon:' · COMING SOON', close:'Close', fab:'About this page & feedback'}
  }[lang];
  const mt = x => (lang === 'en' && x.en) ? x.en : x;         // {title,sub} theo ngôn ngữ
  const mtitle = x => (lang === 'en' && x.title_en) ? x.title_en : x.title;
  const msub = x => (lang === 'en' && x.sub_en) ? x.sub_en : x.sub;

  const fab = '<button id="info-fab" type="button" aria-haspopup="dialog" aria-controls="info-modal" title="' + T.fab + '">i</button>';
  const themes = '<details class="themesw"><summary>' + T.theme + '</summary><div class="theme-menu">'
    + '<button type="button" data-theme="light"><span class="swatch" style="background:#2f6fe0"></span>' + T.light + '</button>'
    + '<button type="button" data-theme="dark"><span class="swatch" style="background:#1a2230"></span>' + T.dark + '</button>'
    + '<button type="button" data-theme="pink"><span class="swatch" style="background:#d6417e"></span>' + T.pink + '</button>'
    + '<button type="button" data-theme="blue"><span class="swatch" style="background:#1c6fd0"></span>' + T.blue + '</button>'
    + '<button type="button" data-theme="green"><span class="swatch" style="background:#1f9d55"></span>' + T.green + '</button></div></details>'
    + '<details class="fontsw"><summary>' + T.font + '</summary><div class="theme-menu">'
    + '<button type="button" data-font="times" style="font-family:\'Times New Roman\',serif">' + T.times + '</button>'
    + '<button type="button" data-font="montserrat" style="font-family:\'Montserrat\',sans-serif">Aa Montserrat</button></div></details>';
  // Đổi ngôn ngữ: thay đường dẫn tương đối tới trang tương ứng
  const other = lang === 'vi' ? 'en' : 'vi';
  let switchHref;
  if (page === 'module') switchHref = lang === 'vi' ? root + 'en/modules/' + body.dataset.slug + '/index.html' : root + '../modules/' + body.dataset.slug + '/index.html';
  else switchHref = lang === 'vi' ? root + 'en/index.html' : root + '../index.html';
  const langsw = '<div class="langsw"><a href="' + (lang === 'vi' ? '#' : switchHref) + '" class="' + (lang === 'vi' ? 'active' : '') + '">VI</a><a href="' + (lang === 'en' ? '#' : switchHref) + '" class="' + (lang === 'en' ? 'active' : '') + '">EN</a></div>';
  const crumbs = page === 'module' && m
    ? '<nav class="crumbs"><a href="' + root + 'index.html#modules">' + T.modules + '</a> / ' + m.n + ' · ' + esc(mtitle(m)) + '</nav>'
    : '<nav class="crumbs">' + T.home + '</nav>';
  const header = '<header class="site"><div class="wrap bar"><a class="brand" href="' + root + 'index.html"><span class="dot"></span>' + T.brand + '</a>'
    + crumbs + '<div class="headerctl">' + themes + langsw + '</div></div></header>'
    + '<div class="banner"><div class="wrap"><span>⚠️</span><div>' + T.banner + '</div></div></div>';
  const modal = '<div class="info-modal" id="info-modal" hidden role="dialog" aria-modal="true" aria-label="' + T.infoTitle + '"><div class="info-modal-backdrop"></div><div class="info-modal-panel">'
    + '<button class="info-modal-close" type="button" aria-label="' + T.close + '">✕</button><h3>' + T.infoTitle + '</h3>'
    + '<h4>' + T.why + '</h4><p>' + T.whyP + '</p><h4>' + T.src + '</h4><p>' + T.srcP + '</p>'
    + '<h4>' + T.how + '</h4><ul>' + T.howL.map(x => '<li>' + x + '</li>').join('') + '</ul>'
    + '<h4>' + T.fb + '</h4><p><a href="https://github.com/TatcataiTTN/for-ttn-HNUE/issues" target="_blank" rel="noopener">github.com/TatcataiTTN/for-ttn-HNUE/issues</a></p></div></div>';
  let pager = '';
  if (page === 'module' && m) {
    const p = MODS.slice(0,cur).reverse().find(x => lang === 'en' ? x.readyEn : x.ready), n = MODS.slice(cur+1).find(x => lang === 'en' ? x.readyEn : x.ready);
    pager = '<nav class="pager">' + (p ? '<a href="' + root + 'modules/' + p.slug + '/index.html">← ' + p.n + ' · ' + esc(mtitle(p)) + '</a>' : '<span></span>')
      + (n ? '<a href="' + root + 'modules/' + n.slug + '/index.html">' + n.n + ' · ' + esc(mtitle(n)) + ' →</a>' : '<span></span>') + '</nav>';
  }
  const footer = '<footer class="site"><div class="wrap">' + T.foot + '<button class="info-footer-btn" type="button" data-info-open>' + T.footBtn + '</button></div></footer>';

  body.insertAdjacentHTML('afterbegin', fab + header);
  const main = body.querySelector('main');
  if (main) main.insertAdjacentHTML('beforeend', pager);
  body.insertAdjacentHTML('beforeend', footer + modal);

  const grid = document.getElementById('mod-grid');
  if (grid) grid.innerHTML = MODS.map(x => {
    const ok = lang === 'en' ? x.readyEn : x.ready;
    const inner = '<div class="n">' + T.module + ' ' + x.n + (ok ? '' : T.soon) + '</div><h3>' + x.ico + ' ' + esc(mtitle(x)) + '</h3><p>' + esc(msub(x)) + '</p><p><span class="tag">' + esc(x.src) + '</span></p>';
    return ok ? '<a class="mod-card" href="modules/' + x.slug + '/index.html">' + inner + '</a>' : '<div class="mod-card" style="opacity:.5;cursor:default">' + inner + '</div>';
  }).join('');
})();
