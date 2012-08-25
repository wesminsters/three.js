/**
 * an interactive map tile layer
 */
(function(){

    WXC.TileLayer = function (map, options) {

        var _context = this;
        _context._map = map;
        var _tiles = [];
        var _options = $.extend({
            "zIndex":1,
            "rotation": Math.PI / 2
        }, options);

        init();
        initEventSubscribers();

        function init(){

            _tiles.push( new WXC.Tile(_context, _options) );

        }

        function moveBy(xy){

            $.each(_tiles, function(index, tile) {
                tile.moveBy(xy);
            });

        }

        function initEventSubscribers(){

            // MAP_MOVE
            $.subscribe(WXC.topics.MAP_MOVE, function($e, args){
                moveBy(args.xy);
            });


        }



    };


})();
