/**
 * a base interactive map tile class
 */
(function(){

    var WIDTH = 256;
    var HEIGHT = 256;

    WXC.Tile = WXC.Base.extend({

        defaults: {
            "zIndex":1,
            "rotation": Math.PI / 2,
            "quadKey": "0",
            "pixelOffset": new WXC.Point()
        },

        init: function(options, tileLayer){

            this._super(options);

            this.tileLayer = tileLayer;
            this.map = this.tileLayer.map;
            this.mesh;

            var url = this.tileLayer.getTileUrl({"quadKey": this._options.quadKey});

            var img = new THREE.MeshBasicMaterial({
                map:THREE.ImageUtils.loadTexture(url)
            });
            img.map.needsUpdate = true; //ADDED

            this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(WIDTH, HEIGHT), img);
            this.mesh.overdraw = true;
            this.mesh.rotation.copy(this._options.rotation);
            this.mesh.position.z = this._options.zIndex;
            this.mesh.position.x = (WIDTH/2) - this._options.pixelOffset.x;
            this.mesh.position.y = (-HEIGHT/2) + this._options.pixelOffset.y;
            this.map.scene.add(this.mesh);

        },

        moveBy: function(xy){

            this.mesh.position.x += xy.x;
            this.mesh.position.y += xy.y;

        }
    });

})();
