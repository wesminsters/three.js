/**
 * establish the client specific environment
 */
(function() {
    var ua = navigator.userAgent.toLowerCase(),
        ie = !!window.ActiveXObject,
        webkit = ua.indexOf("webkit") != -1,
        mobile = ua.indexOf("mobi") != -1,
        android = ua.indexOf("android") != -1,
        opera = window.opera;

    WXC.Browser = {
        userAgent: ua,
        ie: ie,
        ie6: ie && !window.XMLHttpRequest,
        webkit: webkit,
        webkit3d: webkit && ('WebKitCSSMatrix' in window) && ('m11' in new WebKitCSSMatrix()) && (!android),
        mobileWebkit: webkit && (mobile || android),
        mobileOpera: mobile && opera,
        gecko: ua.indexOf("gecko") != -1,
        android: android,
        chrome : webkit && /chrome/.test(navigator.userAgent.toLowerCase())
    };

    //TODO replace ugly ua sniffing with feature detection

    WXC.Browser.touch = WXC.Browser.mobileWebkit || WXC.Browser.mobileOpera;
})();
