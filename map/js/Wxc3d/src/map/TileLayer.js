/**
 * an base interactive map tile layer class
 */
(function(){

    WXC.TileLayer = WXC.Base.extend({

        defaults: {
            "zIndex":1,
            "rotation": Math.PI / 2
        },

        init: function(options, map){

            this._super(options);

            this._map = map;
            this._tiles = [];

            this._tiles.push( new WXC.Tile(this._options, this) );

            this.initEventSubscribers();

        },

        moveBy: function(xy){

            $.each(this._tiles, function(index, tile) {
                tile.moveBy(xy);
            });

        },

        initEventSubscribers: function(){

            var _this = this;

            // MAP_MOVE
            $.subscribe(WXC.topics.MAP_MOVE, function($e, args){
                _this.moveBy(args.xy);
            });

        }

    });

})();
