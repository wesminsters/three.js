/**
 * load the Wxc3d javascript library
 */
(function(){

    var basePath = "/map/js/Wxc3d/src/";

    var scripts = [
        "../../../../build/Three.js",
        "core/Inheritance.js",
        "core/WXC.js",
        "core/PubSub.js",
        "core/Browser.js",
        "core/Base.js",
        "geometry/Point.js",
        "geo/LatLon.js",
        "geo/GeoMath.js",
        "map/MapMove.js",
        "map/tile/layers/TileLayer.js",
        "map/tile/layers/BingTileLayer.js",
        "map/tile/Tile.js",
        "map/Map.js",
        "util/stats.js"

    ];

    var writeScript = function(src){
        document.write("<script type=\"text/javascript\" src=\"" + src + "\"></script>");
    };

    // Write script elements to document
    for(var i = 0, n = scripts.length; i<n; i++){
        writeScript(basePath + scripts[i]);
    }

})();