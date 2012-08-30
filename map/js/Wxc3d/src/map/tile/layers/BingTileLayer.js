/**
 * an bing map tile layer class
 */
(function(){

    WXC.BingTileLayer = WXC.TileLayer.extend({

        getTileUrl: function(args){
            return "http://ecn.t0.tiles.virtualearth.net/tiles/h" + args.quadKey + ".jpeg?g=401";
        }
    });

})();
