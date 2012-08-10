/**
 * load the Wxc3d javascript library
 */
(function(){
    var basePath = "/map/js/Wxc3d/src/";

    var scripts = [
        "../../../../build/Three.js",
        "core/WXC.js",
        "core/Browser.js",
        "map/Map.js"
    ];

    var writeScript = function(src){
        document.write("<script type=\"text/javascript\" src=\"" + src + "\"></script>");
    };

    // Write script elements to document
    for(var i = 0, n = scripts.length; i<n; i++){
        writeScript(basePath + scripts[i]);
    }
})();
