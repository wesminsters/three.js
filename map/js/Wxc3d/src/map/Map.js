/**
 * an interactive  map tile plane
 */
(function(){

    WXC.Map = WXC.Base.extend({

        defaults: {
            "$container": null,
            "bgColor": "0x000000",
            "lookAt": null,
            "zoom": 4,
            "debug": false
        },
        
        init: function(options){

            this._super(options);

            this.renderer = null;
            this.camera = null;
            this.scene = null;
            this.projector = null;
            this.base = null;
            this.baseMapLayer = null;
            this.tileLayers = [];

            this.latLon = null;
            this.zoom = this._options.zoom;

            this.initScene();
            this.initEventPublishers();
            this.appLoop();
            this.loadBaseMap();

            if (this._options.debug) {
                this.debugMode();
            }

            if (this._options.lookAt){
                this.lookAt(this._options.lookAt);
            }

        },
        
        draw: function(){
            this.renderer.render(this.scene, this.camera);
        },
        
        update: function(){
            
        },
        
        appLoop: function(){

            window.requestAnimationFrame(this.appLoop.bind(this));
            this.update();
            this.draw();
            
        },

        debugMode: function(){

            // show a red sphere at origin
            var sphere = new THREE.Mesh(new THREE.SphereGeometry(10, 25, 25), new THREE.MeshLambertMaterial({
                color: 0xff0000
            }));
            sphere.overdraw = true;
            this.scene.add(sphere);

        },
        
        initScene: function(){

            // renderer
            this.renderer = new THREE.WebGLRenderer();
            this.renderer.setSize(this._options.$container.width(), this._options.$container.height());
            this._options.$container.append(this.renderer.domElement);

            // camera
            this.camera = new THREE.PerspectiveCamera(45, this._options.$container.width() / this._options.$container.height(), 0.1, 5000);
            this.camera.position.x = 0;
            this.camera.position.y = -600;
            this.camera.position.z = 600;
            this.camera.lookAt(new THREE.Vector3( 0,0,0 ))

            // scene
            this.scene = new THREE.Scene();
            this.scene.add(this.camera);

            // plane
            var planeMaterial = new THREE.MeshBasicMaterial({ color: this._options.bgColor });
            this.base = new THREE.Mesh(new THREE.PlaneGeometry(3600, 2400), planeMaterial);
            this.base.overdraw = true;
            this.base.rotation.x = Math.PI / 2;
            this.scene.add(this.base);

            // projector
            this.projector = new THREE.Projector();

            // light
            this._light = new THREE.PointLight(0xFFFFFF);
            this._light.position.x = 0;
            this._light.position.y = 0;
            this._light.position.z = 1000;
            this.scene.add(this._light);
        
        },

        loadBaseMap: function(){

            this.baseMapLayer = new WXC.BingTileLayer({
                "zIndex":1,
                "rotation": this.base.rotation
            }, this);

            this.tileLayers.push(this.baseMapLayer);

        },

        initEventPublishers: function(){

            var _this = this;

            // MOUSE_MOVE
            this.renderer.domElement.addEventListener( 'mousemove', function(e){
                e.preventDefault();
                $.publish(WXC.topics.MOUSE_MOVE, {"e":e, "map":_this} );
            }, false );

            // MOUSE_DOWN
            this.renderer.domElement.addEventListener( 'mousedown', function(e){
                e.preventDefault();
                $.publish(WXC.topics.MOUSE_DOWN, {"e":e, "map":_this} );
            }, false );

            // MOUSE_UP
            this.renderer.domElement.addEventListener( 'mouseup', function(e){
                e.preventDefault();
                $.publish(WXC.topics.MOUSE_UP, {"e":e, "map":_this} );
            }, false );

        },

        lookAt: function(latLon){

            this.latLon = new WXC.LatLon(latLon.lat, latLon.lon);
            $.publish(WXC.topics.LOOK_AT, this.latLon );

        }
        
    });


})();
