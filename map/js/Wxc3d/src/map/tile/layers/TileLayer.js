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

            // add the center tile
            var centerTileCoords = WXC.GeoMath.latLon_to_tileCoords(latLon, this.map.zoom);
            centerTileCoords.tileXY = $.extend({}, centerTileCoords.pixelOffsetXY);


            this.addTile(centerTileCoords);
            this.addNeighborTiles(centerTileCoords, true);

        },

        addNeighborTiles: function(tileCoords, recurse){

            //if (!this.counter){ this.counter = 0; }
            //if (++this.counter > 5) { return; }

            var _this = this;
            var added = [];

            // get neighbor tile coordinates
            var neighborTileCoords = [];

            function getNeighborTileCoords(direction){

                var offset = WXC.GeoMath.neighborTileOffset[direction];
                var coords = WXC.GeoMath.getNeighborTileCoords(tileCoords, direction);

                // position relative to the parent neighbor position
                coords.tileXY = new WXC.Point();
                coords.tileXY.x = tileCoords.tileXY.x - offset.pixelXY.x;
                coords.tileXY.y = tileCoords.tileXY.y - offset.pixelXY.y;

                return coords;
            }

            var northCoords = getNeighborTileCoords(WXC.GeoMath.direction.NORTH);
            var eastCoords = getNeighborTileCoords(WXC.GeoMath.direction.EAST);
            var southCoords = getNeighborTileCoords(WXC.GeoMath.direction.SOUTH);
            var westCoords = getNeighborTileCoords(WXC.GeoMath.direction.WEST);

            neighborTileCoords.push(northCoords);
            neighborTileCoords.push(eastCoords);
            neighborTileCoords.push(southCoords);
            neighborTileCoords.push(westCoords);

            // add the tiles to the scene
            $.each(neighborTileCoords, function(index, coords) {
                var tile =  _this.addTile(coords);
                if (!tile) { return true; }
                added.push(tile);
            });

            // recurse neighbors of newly added tiles
            if (recurse){

                $.each(added, function(index, tile) {
                    if (!tile.isInView()) { return true; }
                    _this.addNeighborTiles(tile._options.coords, true);
                });

            }

        },

        addTile: function(tileCoords){

            if (this.tileExists(tileCoords)) { return null; }

            var tileOptions = {
                "zIndex": this._options.zIndex,
                "rotation": this._options.rotation,
                "coords": tileCoords
            };

            return new WXC.Tile(tileOptions, this);

        },

        tileExists: function(tileCoords){
            var found = this.tiles[tileCoords.quadKey];
            return found;
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
