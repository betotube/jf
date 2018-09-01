'use strict';

;(function () {
    var video = document.querySelector('.jogwheel__video');
    var overlay = document.querySelector('.jogwheel__anchors-overlay');

    if (!video) throw "Video element ot found";
    if (!overlay) throw "Overlay element ot found";

    var needsResize = true;

    window.addEventListener('resize', function (e) {
        needsResize = true;
    });
    video.addEventListener('timeupdate', function (e) {
        needsResize = true;
    });

    function resizeOverlay() {
        if (needsResize) {
            overlay.style.height = video.offsetHeight + 'px';
            overlay.style.width = video.offsetWidth + 'px';
            overlay.style.top = video.offsetTop + 'px';
            overlay.style.left = video.offsetLeft + 'px';

            needsResize = false;
        }
        typeof requestAnimationFrame === 'function' ? requestAnimationFrame(resizeOverlay) : setTimeout(resizeOverlay, 1000 / 30);
    }
    resizeOverlay();
})();