/**
 * a base interactive map tile class
 */
(function(){

    WXC.Tile = WXC.Base.extend({

        defaults: {
            "zIndex":1,
            "rotation": Math.PI / 2
        },

        init: function(options, tileLayer){

            this._super(options);

            this._tileLayer = tileLayer;
            this._map = this._tileLayer._map;
            this._mesh;

            var img = new THREE.MeshBasicMaterial({
                map:THREE.ImageUtils.loadTexture('http://ecn.t0.tiles.virtualearth.net/tiles/h02313010.jpeg?g=401')
            });
            img.map.needsUpdate = true; //ADDED

            this._mesh = new THREE.Mesh(new THREE.PlaneGeometry(256, 256), img);
            this._mesh.overdraw = true;
            this._mesh.rotation.copy(this._options.rotation);
            this._mesh.position.z = this._options.zIndex;
            this._map._scene.add(this._mesh);

        },

        moveBy: function(xy){

            this._mesh.position.x += xy.x;
            this._mesh.position.y += xy.y;

        }
    });

})();
