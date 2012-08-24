/**
 * initialize WXC namespace
 */
(function() {

    var WXC = {

        VERSION: '0.2',

        topics: {
            "MOUSE_DOWN": "MOUSE_DOWN",
            "MOUSE_MOVE": "MOUSE_MOVE",
            "MOUSE_UP": "MOUSE_UP"
        }

    };

    window.WXC = WXC;

}());