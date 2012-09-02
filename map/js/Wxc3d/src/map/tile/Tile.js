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
            this.mesh = null;
            this.texture = null;

        },

        add: function(){

            var plane = new THREE.PlaneGeometry(WIDTH, HEIGHT);
            //plane.dynamic = true;

            this.mesh = new THREE.Mesh(plane);
            //this.mesh.dynamic = true;
            this.mesh.overdraw = true;
            this.mesh.rotation.copy(this._options.rotation);
            this.setMeshPosition();

            this.map.scene.add(this.mesh);
            this.tileLayer.tiles[this._options.coords.quadKey] = this;

            // only add the tile if the plane is within the viewport
            if (this.isInViewport()){
                var material = this.getMaterial();
                this.texture = material.map;
                this.mesh.material = material;
                $.publish(WXC.topics.MESSAGE, {"text": "add tile " + this._options.coords.quadKey} );
                return this;
            }

            this.remove();
            return null;

        },

        setMeshPosition: function(){

            if (this.tileLayer.targetTile){

                this.mesh.position.copy(this.tileLayer.targetTile.mesh.position);

                var xDiffFromTarget = this.tileLayer.targetTile._options.coords.pixelXY.x - this._options.coords.pixelXY.x;
                var yDiffFromTarget = this.tileLayer.targetTile._options.coords.pixelXY.y - this._options.coords.pixelXY.y;

                this.mesh.position.x -= xDiffFromTarget;
                this.mesh.position.y += yDiffFromTarget;


            }
            else{
                this.mesh.position.z = this._options.zIndex;
                this.mesh.position.x = (WIDTH/2) - this._options.coords.pixelOffsetXY.x;
                this.mesh.position.y = (-HEIGHT/2) + this._options.coords.pixelOffsetXY.y;
            }

        },

        getMaterial: function(){

            var url = this.tileLayer.getTileUrl({"quadKey": this._options.coords.quadKey});
            var material = new THREE.MeshBasicMaterial({ map:THREE.ImageUtils.loadTexture(url) });
            //material.map.needsUpdate = true;
            return material;

        },

        moveBy: function(xy){

            this.mesh.position.x += xy.x;
            this.mesh.position.y += xy.y;

        },

        isInViewport: function(){

            // check if the tile is currently within the viewport
            if (!this.isInFrustum()){
                return false;
            }

            // view bounds check guarantees no memory issues when the plane extends into infinity z
            var maxX = this.map.base.boundRadius;
            var maxY = this.map.base.boundRadius;
            if (Math.abs(this.mesh.position.x) > maxX) { return false; }
            if (Math.abs(this.mesh.position.y) > maxY) { return false; }

            return true;

        },


        isInFrustum: function(){

            this.map.camera.updateMatrix(); // make sure camera's local matrix is updated
            this.map.camera.updateMatrixWorld(); // make sure camera's world matrix is updated
            this.map.camera.matrixWorldInverse.getInverse( this.map.camera.matrixWorld );

            var frustum = new THREE.Frustum;
            frustum.setFromMatrix( new THREE.Matrix4().multiply( this.map.camera.projectionMatrix, this.map.camera.matrixWorldInverse ) );

            this.mesh.updateMatrix(); // make sure plane's local matrix is updated
            this.mesh.updateMatrixWorld(); // make sure plane's world matrix is updated

            return frustum.contains( this.mesh );

        },

        remove: function(){

            this.map.scene.remove(this.mesh);
            if(this.tileLayer.tiles[this._options.coords.quadKey]) {
                delete this.tileLayer.tiles[this._options.coords.quadKey];  // remove from parent tile list

                if (this.texture){
                    $.publish(WXC.topics.MESSAGE, {"text": "remove tile " + this._options.coords.quadKey} );
                }

            }
            if (this.mesh) { this.map.renderer.deallocateObject(this.mesh) } // remove the mesh handle from the renderer
            if (this.texture) { this.map.renderer.deallocateTexture(this.texture) } // remove texture handle from the renderer

        }


    });

})();
