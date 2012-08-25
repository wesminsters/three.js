/**
 * an interactive map tile
 */
(function(){

    WXC.Tile = function (tileLayer, options) {

        var _context = this;
        var _tileLayer = tileLayer;
        var _map = _tileLayer._map;
        var _mesh;
        var _options = $.extend({
            "zIndex":1,
            "rotation": Math.PI / 2
        }, options);

        init();

        function init(){


            var img = new THREE.MeshBasicMaterial({
                map:THREE.ImageUtils.loadTexture('http://ecn.t0.tiles.virtualearth.net/tiles/h02313010.jpeg?g=401')
            });
            img.map.needsUpdate = true; //ADDED

            _mesh = new THREE.Mesh(new THREE.PlaneGeometry(256, 256), img);
            _mesh.overdraw = true;
            _mesh.rotation.copy(_options.rotation);
            _mesh.position.z = _options.zIndex;
            _map._scene.add(_mesh);

        }

        _context.moveBy = function(xy){

            _mesh.position.x += xy.x;
            _mesh.position.y += xy.y;

        }





    };


})();
