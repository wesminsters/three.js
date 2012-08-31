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
            "coords": null
        },

        init: function(options, tileLayer){

            this._super(options);

            this.tileLayer = tileLayer;
            this.map = this.tileLayer.map;
            this.mesh;

            var url = this.tileLayer.getTileUrl({"quadKey": this._options.coords.quadKey});

            var img = new THREE.MeshBasicMaterial({
                map:THREE.ImageUtils.loadTexture(url)
            });
            img.map.needsUpdate = true; //ADDED

            this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(WIDTH, HEIGHT), img);
            this.mesh.overdraw = true;
            this.mesh.rotation.copy(this._options.rotation);
            this.mesh.position.z = this._options.zIndex;

            //this.mesh.position.x = (WIDTH/2) - this._options.coords.pixelOffsetXY.x;
            //this.mesh.position.x = this._options.coords.pixelOffsetXY.x;
            //this.mesh.position.y = (-HEIGHT/2) + this._options.coords.pixelOffsetXY.y;
            //this.mesh.position.y = this._options.coords.pixelOffsetXY.y;

            this.mesh.position.x = (WIDTH/2) - this._options.coords.tileXY.x;
            this.mesh.position.y = (-HEIGHT/2) + this._options.coords.tileXY.y;

            this.map.scene.add(this.mesh);
            this.tileLayer.tiles[this._options.coords.quadKey] = this;

        },

        moveBy: function(xy){

            this.mesh.position.x += xy.x;
            this.mesh.position.y += xy.y;

        },

        isInView: function(){

            // TODO: stage 1 bounds check guarantee that the tile is viewable in the viewport


            // stage 2 view bounds check guarantees no memory issues when the plane extends into infinity z
            var maxX = this.map.base.boundRadius;
            var maxY = this.map.base.boundRadius;
            if (Math.abs(this.mesh.position.x) > maxX) { return false; }
            if (Math.abs(this.mesh.position.y) > maxY) { return false; }
            return true;

        }

        /*
        isInFrustum: function(){

            var frustum = new THREE.Frustum;
            frustum.setFromMatrix( new THREE.Matrix4().multiply( this.map.camera.projectionMatrix, this.map.camera.matrixWorldInverse ) );
            return frustum.contains( this.mesh );

        }
        */

    });

})();
