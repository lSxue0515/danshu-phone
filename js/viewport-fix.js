(function () {
    'use strict';

    var ua = navigator.userAgent || '';
    var isIOS = /iPhone|iPad|iPod/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    var isAndroid = /Android/i.test(ua);
    var root = document.documentElement;
    var lastH = 0;
    var kbActive = false;

    if (isIOS && !root.classList.contains('is-ios')) root.classList.add('is-ios');
    if (isAndroid && !root.classList.contains('is-android')) root.classList.add('is-android');

    function getViewportHeight() {
        var h = window.innerHeight;
        if (window.visualViewport && window.visualViewport.height) h = window.visualViewport.height;

        if (isAndroid) {
            var ch = document.documentElement.clientHeight;
            if (ch > 0 && ch < h) h = ch;
        }

        return Math.round(h);
    }

    function setHeight() {
        var h = getViewportHeight();
        if (Math.abs(h - lastH) < 1) return;
        lastH = h;
        root.style.setProperty('--app-height', h + 'px');
    }

    function onKbResize() {
        if (kbActive) fixKb();
    }

    function onKbScroll() {
        if (window.visualViewport && window.visualViewport.offsetTop > 0) {
            window.scrollTo(0, 0);
        }
    }

    function fixKb() {
        if (!kbActive || !window.visualViewport) return;

        var h = getViewportHeight();
        root.style.setProperty('--app-height', h + 'px');

        var conv = document.getElementById('chatConversation');
        if (conv) conv.style.height = h + 'px';

        var body = document.getElementById('chatConvBody');
        if (body) body.scrollTop = body.scrollHeight;

        window.scrollTo(0, 0);
        document.body.scrollTop = 0;
    }

    window._chatInputFocus = function () {
        kbActive = true;

        if (isIOS && window.visualViewport) {
            window.visualViewport.addEventListener('resize', onKbResize);
            window.visualViewport.addEventListener('scroll', onKbScroll);
            setTimeout(fixKb, 100);
            setTimeout(fixKb, 300);
            setTimeout(fixKb, 600);
        }

        if (isAndroid) {
            setTimeout(function () {
                var body = document.getElementById('chatConvBody');
                if (body) body.scrollTop = body.scrollHeight;
            }, 400);
        }
    };

    window._chatInputBlur = function () {
        kbActive = false;

        if (window.visualViewport) {
            window.visualViewport.removeEventListener('resize', onKbResize);
            window.visualViewport.removeEventListener('scroll', onKbScroll);
        }

        var conv = document.getElementById('chatConversation');
        if (conv) conv.style.height = '';

        setTimeout(function () {
            window.scrollTo(0, 0);
            setHeight();
        }, 100);
    };

    setHeight();
    window.addEventListener('resize', setHeight);
    window.addEventListener('orientationchange', function () {
        setTimeout(setHeight, 300);
    });

    if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', setHeight);
    }
})();
