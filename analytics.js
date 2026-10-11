/* 공통 분석 스크립트: GA4 + Amplitude. 모든 페이지에서 /analytics.js 로 로드됨
   키 변경 시 이 파일만 수정 */
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
        window.amplitude.init(AMP_KEY, {
          autocapture: true,
          fetchRemoteConfig: true
        });
      }
    } catch (e) {}
  });
})();
