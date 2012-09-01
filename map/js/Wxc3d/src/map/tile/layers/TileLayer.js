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
            this.movedBy = new WXC.Point();

            this.initEventSubscribers();

        },

        moveBy: function(xy){

            $.each(this.tiles, function(index, tile) {
                tile.moveBy(xy);
            });

            this.movedBy.x += xy.x;
            this.movedBy.y += xy.y;

        },

        lookAt: function(latLon){
            this.populate(latLon);
        },

        populate: function(latLon){

            if (latLon){

                // add the center tile
                var centerTileCoords = WXC.GeoMath.latLon_to_tileCoords(latLon, this.map.zoom);
                centerTileCoords.tileXY = $.extend({}, centerTileCoords.pixelOffsetXY);

                this.targetTile = this.addTile(centerTileCoords);
                this.addNeighborTiles(this.targetTile, false);

            }
            else{
                this.addNeighborTiles(this.targetTile, false);
            }

        },

        addNeighborTiles: function(tile, recurse){

            //if (!this.counter){ this.counter = 0; }
            //if (++this.counter > 5) { return; }

            var _this = this;
            var added = [];

            // get neighbor tile coordinates
            var neighborTileCoords = [];

            function getNeighborTileCoords(direction){

                var offset = WXC.GeoMath.neighborTileOffset[direction];
                var coords = WXC.GeoMath.getNeighborTileCoords(tile._options.coords, direction);

                // position relative to the parent neighbor position
                coords.tileXY = new WXC.Point();
                coords.tileXY.x = tile._options.coords.tileXY.x - offset.pixelXY.x;
                coords.tileXY.y = tile._options.coords.tileXY.y - offset.pixelXY.y;

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

                var tile = _this.getTile(coords.quadKey);

                if (!tile){

                    tile = _this.addTile(coords);
                }

                added.push(tile);

            });

            // recurse neighbors of newly added tiles
            if (recurse){

                $.each(added, function(index, tile) {
                    if (!tile.isInViewport()) { return true; }
                    _this.addNeighborTiles(tile, true);
                });

            }

        },

        addTile: function(tileCoords){

            // does the tile already exist
            if (this.getTile(tileCoords.quadKey)) { return null; }

            tileCoords.tileXY.x -= this.movedBy.x;
            tileCoords.tileXY.y += this.movedBy.y;

            var tileOptions = {
                "zIndex": this._options.zIndex,
                "rotation": this._options.rotation,
                "coords": tileCoords
            };

            return new WXC.Tile(tileOptions, this);

        },

        getTile: function(quadKey){
            return this.tiles[quadKey];
        },

        removeCulled: function(){

            var _this = this;
            var tiles = $.extend({}, this.tiles);

            $.each(tiles, function(index, tile) {

                if (!tile.isInViewport()) {
                    if (tile == _this.targetTile) { return true; }  // dont ever remove the target tile
                    tile.remove();
                }

            });
        },

        initEventSubscribers: function(){

            var _this = this;

            // MAP_MOVE
            $.subscribe(WXC.topics.MAP_MOVE, function($e, args){
                _this.moveBy(args.xy);
                _this.removeCulled();
                _this.populate()
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
