/**
 * an bing map tile layer class
 */
(function(){

    WXC.BingTileLayer = WXC.TileLayer.extend({

        getTileUrl: function(args){
            var server = args.quadKey.charAt(args.quadKey.length-1);
            //return "http://ecn.t" + server + ".tiles.virtualearth.net/tiles/r" + args.quadKey + ".jpeg?g=401";  // road
            //return "http://ecn.t" + server + ".tiles.virtualearth.net/tiles/a" + args.quadKey + ".jpeg?g=401";  // aerial
            return "http://ecn.t" + server + ".tiles.virtualearth.net/tiles/h" + args.quadKey + ".jpeg?g=401";  // hybrid
        }
    });

})();
