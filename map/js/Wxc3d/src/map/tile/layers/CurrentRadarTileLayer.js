
/**
 * a current radar tile layer class
 */
(function(){

    WXC.CurrentRadarTileLayer = WXC.TileLayer.extend({

        defaults: {
            "zIndex":10
        },

        init: function(options, map){
            this._super(options, map);
        },

        getTileUrl: function(args){
            return "http://imagery.wxc.com/?vs=1.0&passkey=33842a5617dde9ec0963597739385ba8&type=tile&datatype=radar&exceptions=shaded&var=reflectivity_w_wintermask&timesteps=now,0&bing=" + args.quadKey;
        }
    });

})();



