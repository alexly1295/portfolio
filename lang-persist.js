/* 언어 설정 유지: KR/EN 선택을 저장해 모든 페이지에 동일하게 적용 */
(function () {
  var KEY = 'siteLang';
  function get() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function set(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  function init() {
    var toggle = document.getElementById('langToggle');
    if (!toggle) return;
    var saved = get();
    if (saved) {
      var active = toggle.querySelector('.lang-btn.active');
      var target = toggle.querySelector('.lang-btn[data-lang="' + saved + '"]');
      if (target && (!active || active.dataset.lang !== saved)) target.click();
    }
    toggle.addEventListener('click', function (e) {
      var btn = e.target.closest('.lang-btn');
      if (btn && btn.dataset.lang) set(btn.dataset.lang);
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
