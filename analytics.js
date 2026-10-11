/* Google Analytics 4 — 모든 페이지 공통. 측정 ID 변경 시 이 파일만 수정 */
(function () {
  var GA_ID = 'G-4884GXWR2M';

  // 로컬 미리보기에서는 집계하지 않음
  var h = location.hostname;
  if (h === 'localhost' || h === '127.0.0.1' || h === '' ) return;

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', GA_ID);

  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  document.head.appendChild(s);
})();
