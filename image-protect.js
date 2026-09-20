/* image-protect.js
 * Casual image-saving deterrent for alexly12.com.
 * Blocks right-click "Save image as…", drag-to-desktop, and the iOS/Android long-press save menu.
 * This is NOT real protection: DevTools, "view source", screenshots and direct image URLs still work.
 * Loaded on every page via <script src="image-protect.js" defer></script> (pages use <base href="/">).
 */
(function () {
  'use strict';

  var IMG = 'img, picture, video, canvas';

  // CSS: no native image dragging, no iOS long-press callout, no selection highlight on images.
  var style = document.createElement('style');
  style.setAttribute('data-image-protect', '');
  style.textContent =
    'img, picture, video {' +
    '-webkit-user-drag: none; user-drag: none;' +
    '-webkit-touch-callout: none;' +
    '-webkit-user-select: none; user-select: none;' +
    '}';
  (document.head || document.documentElement).appendChild(style);

  function isImage(e) {
    var t = e.target;
    return !!(t && t.closest && t.closest(IMG));
  }

  // Event delegation on document, so images added later (lazy-loaded, i18n re-render) are covered too.
  document.addEventListener('contextmenu', function (e) { if (isImage(e)) e.preventDefault(); });
  document.addEventListener('dragstart',   function (e) { if (isImage(e)) e.preventDefault(); });
})();
