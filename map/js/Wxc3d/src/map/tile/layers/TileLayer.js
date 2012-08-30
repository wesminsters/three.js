/**
 * an abstract tile layer class
 */
(function(){

    WXC.TileLayer = WXC.Base.extend({

        defaults: {
            "zIndex":1,
            "rotation": Math.PI / 2
        },

        init: function(options, map){

            this._super(options);

            this.map = map;
            this.tiles = [];

            this.initEventSubscribers();

        },

        moveBy: function(xy){

            $.each(this.tiles, function(index, tile) {
                tile.moveBy(xy);
            });

        },

        lookAt: function(latLon){

            var tile = this.getCenterTile(latLon);
            this.tiles.push(tile);
        },

        getCenterTile: function(latLon){

            var pixelOffset = new WXC.Point();
            var quadKey = WXC.GeoMath.latLon_to_quadKey(latLon, this.map.zoom, pixelOffset);

            var tileOptions = $.extend({}, this._options, {
                "quadKey": quadKey,
                "pixelOffset": pixelOffset
            });

            var tile = new WXC.Tile(tileOptions, this);

            return tile;

        },

        initEventSubscribers: function(){

            var _this = this;

            // MAP_MOVE
            $.subscribe(WXC.topics.MAP_MOVE, function($e, args){
                _this.moveBy(args.xy);
            });

            // LOOK_AT
            $.subscribe(WXC.topics.LOOK_AT, function($e, latLon){
                _this.lookAt(latLon);
            });

        },

        /**
         * abstract
         * @param args - {"quadKey":"####"}
         * @return {String} - the url to a tile image
         */

        getTileUrl: function(args){
            return "";
        }



    });

})();
