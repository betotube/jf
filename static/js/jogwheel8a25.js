'use strict';

/*
     Utilities
  */
var last = function last(xs) {
    return xs[xs.length - 1];
};
var head = function head(xs) {
    return xs[0];
};
var map = function map(n, start1, stop1, start2, stop2) {
    return (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
};
// @see https://gist.github.com/gre/1650294
var easing = function easing(t) {
    return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
};

// remover
var isMobileDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream || /(android)/i.test(navigator.userAgent);

var goToTime = void 0;

!function (rootElement) {

    /*
        Setup vars
     */
    var anchorsOverlay = rootElement.querySelector('.jogwheel__anchors-overlay');
    var video = rootElement.querySelector('.jogwheel__video');
    var features = jogWaypoints; // jogwheel.waypoints.js

    // create anchor elements
    var featuresWithAnchors = features.map(function (f) {
        var anchor = document.createElement('a');

        anchor.classList.add('jogwheel__anchor');
        anchor.title = f.title;
        anchor.setAttribute('data-description', f.description);
        anchor.setAttribute('data-ga', f.ga);
        anchor.href = '#' + f.targetPosition;
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            goToTime(f.targetPosition);

            if (typeof jogwheelAnchorClick == 'function') {
                jogwheelAnchorClick.call(undefined);
            }
        });

        anchorsOverlay.appendChild(anchor);
        return Object.assign({}, f, { anchor: anchor });
    });

    /*
          Show/hide anchors overlay
       */

    var anchorsOverlayHideInterval = anchorsOverlay.getAttribute('data-hidden-time') || 500; //ms
    var anchosrOverlayShowTimeout = void 0;

    function showAnchorsOverlay() {
        anchorsOverlay.classList.remove('jogwheel__anchors-overlay--hidden');
    }
    function hideAnchorsOverlay() {
        anchorsOverlay.classList.add('jogwheel__anchors-overlay--hidden');
        if (anchosrOverlayShowTimeout) clearTimeout(anchosrOverlayShowTimeout);
        anchosrOverlayShowTimeout = setTimeout(showAnchorsOverlay, anchorsOverlayHideInterval);
    }

    /*
          Animate anchors
       */

    function animateAnchors() {
        var t = video.currentTime;

        featuresWithAnchors.forEach(function (f) {
            var w_before = last(f.waypoints.filter(function (w) {
                return w[0] <= t;
            }));
            var w_after = head(f.waypoints.filter(function (w) {
                return w[0] > t;
            }));

            f.anchor.style.opacity = w_before && w_after && w_before[3] ? 1 : 0;

            if (w_before && w_after) {
                var amplitude = map(t, w_before[0], w_after[0], 0, 1);
                f.anchor.style.position = 'absolute';
                f.anchor.style.left = map(amplitude, 0, 1, w_before[1], w_after[1]) * 100 + "%";
                f.anchor.style.top = map(amplitude, 0, 1, w_before[2], w_after[2]) * 100 + "%";
            }
        });

        // remover
        if (isMobileDevice) setTimeout(animateAnchors, 160);else requestAnimationFrame(animateAnchors);
    }
    animateAnchors();

    /*
          Drag to spin
       */

    var dragStep = -1 / 100; // s / px
    var magicFrame = 2.5; // frame
    var dragStartPos = void 0,
        dragStartTime = void 0;

    if (isMobileDevice) {
        var timer;
        var scrollableTime = 0; // = video.duration - magicFrame;
        var diff = 0; // = (x - dragStartPos) * dragStep;
        var time = 0; // = (dragStartTime + diff) % scrollableTime;
    }

    function startDrag(x) {
        if (isAnimating) return;

        video.pause();
        dragStartPos = x;
        dragStartTime = video.currentTime - magicFrame;

        if (isMobileDevice) {
            timer = setInterval(function () {
                video.currentTime = magicFrame + (time > 0 ? time : time + scrollableTime);
            }, 62.5);
        }
    }
    function drag(x) {
        if (dragStartPos === undefined || isAnimating) return;

        hideAnchorsOverlay();

        if (isMobileDevice) {
            scrollableTime = video.duration - magicFrame;
            diff = (x - dragStartPos) * dragStep;
            time = (dragStartTime + diff) % scrollableTime;
        } else {
            var _scrollableTime = video.duration - magicFrame;
            var _diff = (x - dragStartPos) * dragStep;
            var _time = (dragStartTime + _diff) % _scrollableTime;

            video.currentTime = magicFrame + (_time > 0 ? _time : _time + _scrollableTime);
        }
    }
    function stopDrag() {
        dragStartPos = undefined;
        dragStartTime = undefined;

        if (isMobileDevice) {
            clearInterval(timer);
        }
    }

    rootElement.addEventListener('mousedown', function (e) {
        startDrag(e.pageX);
    });
    window.addEventListener('mousemove', function (e) {
        drag(e.pageX);
    });
    window.addEventListener('mouseup', function (e) {
        stopDrag();
    });
    rootElement.addEventListener('touchstart', function (e) {
        startDrag(e.touches[0].pageX);
    });
    rootElement.addEventListener('touchmove', function (e) {
        drag(e.touches[0].pageX);
    });
    rootElement.addEventListener('touchend', function (e) {
        stopDrag();
    });

    /*
          Animate
       */

    var animationTolerance = 0.05; // s
    var animateFrom = void 0,
        animateTo = void 0,
        animateStart = void 0,
        animateEnd = void 0,
        animateCallback = void 0;
    var isAnimating = false;

    goToTime = function goToTime(time) {
        var speed = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 5;
        var callback = arguments[2];

        if (Math.abs(time - video.currentTime) < animationTolerance) return;

        animateFrom = video.currentTime;
        animateTo = time;
        animateStart = Date.now();
        animateEnd = animateStart + Math.abs(animateFrom - animateTo) * 1000 / speed;
        isAnimating = true;
        animateCallback = callback;
    };

    function animateIfNeeded() {
        if (isAnimating) {
            hideAnchorsOverlay();
            var t = map(Date.now(), animateStart, animateEnd, 0, 1);
            if (t > 1) {
                isAnimating = false;

                if (typeof animateCallback === 'function') {
                    animateCallback.call(this);
                }
            } else {
                video.currentTime = map(easing(t), 0, 1, animateFrom, animateTo);
            }
        }

        // remover
        if (isMobileDevice) setTimeout(animateIfNeeded, 62.5);else requestAnimationFrame(animateIfNeeded);
    }
    animateIfNeeded();

    /*
        Go!
     */
    /* setTimeout(()=>{
        goToTime(6.31, 2);
    },.5); */
}(document.querySelector('#jogwheel'));