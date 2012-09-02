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
            this.targetTile = null;

            this.initEventSubscribers();

        },

        moveBy: function(xy){

            $.each(this.tiles, function(index, tile) {
                tile.moveBy(xy);
            });

        },

        lookAt: function(latLon){

            if (latLon){

                this.clear();

                // add the center tile
                var centerTileCoords = WXC.GeoMath.latLon_to_tileCoords(latLon, this.map.zoom);
                this.targetTile = this.addTile(centerTileCoords);

                this.addNeighborTiles(this.targetTile, true);

            }

        },

        fillMissingSpaces: function(recurse){

            var _this = this;
            var tiles = $.extend({}, this.tiles);
            var checked = {};
            var added = [];

            $.each(tiles, function(key, tile){

                var neighborTileCoords = _this.getNeighborTileCoords(tile);

                $.each(neighborTileCoords, function(index, coords){

                    if (checked[coords.quadKey]) { return true; };  // already checked this one?
                    if (tiles[coords.quadKey]) { return true; }; // already exists in the tileset?

                    var tile = _this.addTile(coords);

                    if (tile){
                        added.push(tile);
                    }

                })


            })

            if (recurse && added.length > 0){
                _this.fillMissingSpaces(true);
            }

        },

        addNeighborTiles: function(targetTile, recurse){

            var _this = this;
            var added = [];

            var neighborTileCoords = this.getNeighborTileCoords(targetTile);

            // add the tiles to the scene
            $.each(neighborTileCoords, function(index, coords) {

                if (!_this.tileExists(coords.quadKey)){

                    var newTile = _this.addTile(coords);
                    if (!newTile) { return true; }
                    added.push(newTile);
                }

            });

            if (!recurse) { return; }

            // recurse neighbors of newly added tiles
            $.each(added, function(index, tile) {
                if (!tile.isInViewport()) { return true; }
                _this.addNeighborTiles(tile, true);
            });

        },

        getNeighborTileCoords: function(targetTile){

            // get neighbor tile coordinates
            var neighborTileCoords = [];

            function getCoords(direction){

                var offset = WXC.GeoMath.neighborTileOffset[direction];
                var coords = WXC.GeoMath.getNeighborTileCoords(targetTile._options.coords, direction);
                return coords;
            }

            var northCoords = getCoords(WXC.GeoMath.direction.NORTH);
            var eastCoords = getCoords(WXC.GeoMath.direction.EAST);
            var southCoords = getCoords(WXC.GeoMath.direction.SOUTH);
            var westCoords = getCoords(WXC.GeoMath.direction.WEST);

            neighborTileCoords.push(northCoords);
            neighborTileCoords.push(eastCoords);
            neighborTileCoords.push(southCoords);
            neighborTileCoords.push(westCoords);

            return neighborTileCoords;

        },

        addTile: function(tileCoords){

            // does the tile already exist
            if (this.getTile(tileCoords.quadKey)) { return null; }

            var tileOptions = {
                "zIndex": this._options.zIndex,
                "rotation": this._options.rotation,
                "coords": tileCoords
            };

            var tile = new WXC.Tile(tileOptions, this);
            var added = tile.add();

            return added;
        },

        tileExists: function(quadKey){
            return !!this.getTile(quadKey);
        },

        getTile: function(quadKey){
            return this.tiles[quadKey];
        },

        clear: function(){

            $.each(this.tiles, function(key, tile) {
                tile.remove();
            });

        },

        removeCulled: function(){

            var _this = this;
            var tiles = $.extend({}, this.tiles);

            $.each(tiles, function(key, tile) {

                if (!tile.isInViewport()) {
                    if (tile == _this.targetTile) { return true; }  // dont ever remove the target tile
                    tile.remove();
                }

            });
        },

        initEventSubscribers: function(){

            var _this = this;

            // MAP_MOVE_START
            //$.subscribe(WXC.topics.MAP_MOVE_START, function($e, args){
            //
            //});

            // MAP_MOVE
            $.subscribe(WXC.topics.MAP_MOVE, function($e, args){
                _this.moveBy(args.xy);
                _this.removeCulled();
                _this.fillMissingSpaces(false);
            });

            // MAP_MOVE_END
            $.subscribe(WXC.topics.MAP_MOVE_END, function($e, args){
                _this.removeCulled();
                _this.fillMissingSpaces(true);
            });

            // LOOK_AT
            $.subscribe(WXC.topics.LOOK_AT, function($e, latLon){
                _this.lookAt(latLon);
            });

            // APP_LOOP_UPDATE
            //$.subscribe(WXC.topics.APP_LOOP_UPDATE, function($e, map){
            //    _this.populate();
            //});

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
