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

                this.clear();

                // add the center tile
                var centerTileCoords = WXC.GeoMath.latLon_to_tileCoords(latLon, this.map.zoom);
                centerTileCoords.tileXY = $.extend({}, centerTileCoords.pixelOffsetXY);

                this.targetTile = this.addTile(centerTileCoords);

                this.fillFromTargetOut();

            }
            else{
                this.fillMissingSpaces();
            }

        },

        fillFromTargetOut: function(){
            this.addNeighborTiles(this.targetTile, true);
        },

        fillMissingSpaces: function(){



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

            var tile = new WXC.Tile(tileOptions, this);
            var added = tile.add();

            return added;
        },

        getNeighborTileCoords: function(targetTile){

            // get neighbor tile coordinates
            var neighborTileCoords = [];

            function getCoords(direction){

                var offset = WXC.GeoMath.neighborTileOffset[direction];
                var coords = WXC.GeoMath.getNeighborTileCoords(targetTile._options.coords, direction);

                // position relative to the parent neighbor position
                coords.tileXY = new WXC.Point();
                coords.tileXY.x = targetTile._options.coords.tileXY.x - offset.pixelXY.x;
                coords.tileXY.y = targetTile._options.coords.tileXY.y - offset.pixelXY.y;

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

            // MAP_MOVE
            $.subscribe(WXC.topics.MAP_MOVE, function($e, args){
                _this.moveBy(args.xy);
                _this.removeCulled();
                _this.populate();
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
