/* 공통 분석 스크립트: GA4 + Amplitude. 모든 페이지에서 /analytics.js 로 로드됨
   키 변경 시 맨 위 두 줄만 수정. HTML 수정 없이 클릭/스크롤을 자동 감지함 */
(function () {
  var GA_ID = 'G-4884GXWR2M';
  var AMP_KEY = '180d0be21ed6f7df657f5fbcf2c584f3';

  // 로컬 미리보기에서는 집계하지 않음
  var h = location.hostname;
  if (h === 'localhost' || h === '127.0.0.1' || h === '') return;

  function load(src, onload) {
    var s = document.createElement('script');
    s.async = true;
    s.src = src;
    if (onload) s.onload = onload;
    document.head.appendChild(s);
  }

  /* ---------- Google Analytics 4 ---------- */
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', GA_ID);
  load('https://www.googletagmanager.com/gtag/js?id=' + GA_ID);

  /* ---------- Amplitude (Browser SDK, 자동 수집) ---------- */
  load('https://cdn.amplitude.com/script/' + AMP_KEY + '.js', function () {
    try {
      if (window.amplitude && window.amplitude.init) {
        window.amplitude.init(AMP_KEY, { autocapture: true, fetchRemoteConfig: true });
      }
    } catch (e) {}
  });

  /* ---------- 커스텀 이벤트 (GA4 + Amplitude 동시 전송) ---------- */
  function track(name, props) {
    props = props || {};
    try {
      gtag('event', name, Object.assign({ transport_type: 'beacon' }, props));
    } catch (e) {}
    try {
      if (window.amplitude && window.amplitude.track) window.amplitude.track(name, props);
    } catch (e) {}
  }

  var SLUG_RE = /case-study-([a-z0-9]+)/i;
  function slugOf(str) { var m = SLUG_RE.exec(str || ''); return m ? m[1].toLowerCase() : null; }
  var currentSlug = slugOf(location.pathname);
  var page = location.pathname.replace(/\.html$/, '').replace(/\/index$/, '') || '/';

  var SECTION_NAMES = {
    s1: 'background', s2: 'goal', s3: 'research', s4: 'problem',
    s5: 'approach', s6: 'execution', s7: 'results', s8: 'lessons'
  };

  /* 1) 클릭: 프로젝트 카드 / 외부 링크 / 언어 전환 */
  document.addEventListener('click', function (e) {
    var t = e.target;
    if (!t || !t.closest) return;

    var lang = t.closest('.lang-btn');
    if (lang && lang.dataset.lang) {
      track('language_toggle', { language: lang.dataset.lang, page: page });
      return;
    }

    var a = t.closest('a[href]');
    if (!a) return;
    var href = a.getAttribute('href') || '';

    var slug = slugOf(href);
    if (slug) {
      var ui = a.classList.contains('project-card') ? 'home_card'
             : a.classList.contains('project-row') ? 'work_row'
             : a.classList.contains('design-tile') ? 'design_tile' : 'link';
      track('project_click', { project: slug, from_page: page, ui: ui });
      return;
    }

    if (/^mailto:/i.test(href)) {
      track('contact_click', { method: 'email', from_page: page });
    } else if (/^https?:\/\//i.test(href) && a.hostname && a.hostname !== location.hostname) {
      var host = a.hostname.replace(/^www\./, '');
      var kind = /linkedin/.test(host) ? 'linkedin'
               : /upwork/.test(host) ? 'upwork'
               : /scholar\.google/.test(host) ? 'scholar'
               : /dropbox/.test(host) ? 'resume_dropbox'
               : /dbpia/.test(host) ? 'publication' : 'other';
      track('outbound_click', { destination: kind, domain: host, from_page: page });
    }
  }, true);

  /* 2) 케이스 스터디: 스크롤 깊이 + 섹션 도달 */
  if (currentSlug) {
    var fired = {};
    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        ticking = false;
        var doc = document.documentElement;
        var total = Math.max(doc.scrollHeight - window.innerHeight, 1);
        var pct = (window.scrollY / total) * 100;
        [25, 50, 75, 90].forEach(function (d) {
          if (pct >= d && !fired[d]) {
            fired[d] = true;
            track('scroll_depth', { project: currentSlug, percent: d });
          }
        });
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });

    function observeSections() {
      if (!('IntersectionObserver' in window)) return;
      var seen = {};
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          var id = en.target.id;
          if (!id || seen[id]) return;
          seen[id] = true;
          track('section_view', {
            project: currentSlug,
            section_id: id,
            section: SECTION_NAMES[id] || id
          });
          io.unobserve(en.target);
        });
      }, { threshold: 0.3 });
      document.querySelectorAll('.cs-section[id]').forEach(function (s) { io.observe(s); });
    }
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', observeSections);
    } else {
      observeSections();
    }
  }
})();
