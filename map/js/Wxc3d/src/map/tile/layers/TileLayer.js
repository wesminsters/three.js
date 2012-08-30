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
            this.tiles = {};

            this.initEventSubscribers();

        },

        moveBy: function(xy){

            $.each(this.tiles, function(index, tile) {
                tile.moveBy(xy);
            });

        },

        lookAt: function(latLon){
            this.populate(latLon);
        },

        populate: function(latLon){

            var _this = this;

            // add the center tile
            var centerTileCoords = WXC.GeoMath.latLon_to_tileCoords(latLon, this.map.zoom);
            this.addTile(centerTileCoords);

            // add neighbor tiles
            var neighborTileCoords = [];
            neighborTileCoords.push( WXC.GeoMath.getNeighborTileCoords(centerTileCoords, WXC.GeoMath.direction.NORTH) );
            neighborTileCoords.push( WXC.GeoMath.getNeighborTileCoords(centerTileCoords, WXC.GeoMath.direction.EAST) );
            neighborTileCoords.push( WXC.GeoMath.getNeighborTileCoords(centerTileCoords, WXC.GeoMath.direction.SOUTH) );
            neighborTileCoords.push( WXC.GeoMath.getNeighborTileCoords(centerTileCoords, WXC.GeoMath.direction.WEST) );

            $.each(neighborTileCoords, function(index, tileCoords) {
                _this.addTile(tileCoords);
            });

        },

        tileExists: function(tileCoords){
            var found = this.tiles[tileCoords.quadKey];
            return found;
        },

        addTile: function(tileCoords){

            if (this.tileExists(tileCoords)) { return; }

            var tileOptions = {
                "zIndex": this._options.zIndex,
                "rotation": this._options.rotation,
                "coords": tileCoords
            };

            new WXC.Tile(tileOptions, this);

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
