/**
 * an interactive  map tile plane
 */
(function(){

    WXC.Map = WXC.Base.extend({

        defaults: {
            "$container": null,
            "bgColor": "0x000000"
        },
        
        init: function(options){

            this._super(options);

            this._renderer = null;
            this._camera = null;
            this._scene = null;
            this._projector = null;
            this._base = null;
            this._tileLayers = [];

            this.initScene();
            this.initEventPublishers();
            this.appLoop();
            this.loadBaseMap();

        },
        
        draw: function(){
            this._renderer.render(this._scene, this._camera);
        },
        
        update: function(){
            
        },
        
        appLoop: function(){

            window.requestAnimationFrame(this.appLoop.bind(this));
            this.update();
            this.draw();
            
        },
        
        initScene: function(){

            // renderer
            this._renderer = new THREE.WebGLRenderer();
            this._renderer.setSize(this._options.$container.width(), this._options.$container.height());
            this._options.$container.append(this._renderer.domElement);

            // camera
            this._camera = new THREE.PerspectiveCamera(45, this._options.$container.width() / this._options.$container.height(), 0.1, 5000);
            this._camera.position.x = 0;
            this._camera.position.y = -600;
            this._camera.position.z = 600;
            this._camera.lookAt(new THREE.Vector3( 0,0,0 ))

            // scene
            this._scene = new THREE.Scene();
            this._scene.add(this._camera);

            // plane
            var planeMaterial = new THREE.MeshBasicMaterial({ color: this._options.bgColor });
            this._base = new THREE.Mesh(new THREE.PlaneGeometry(1000, 1000), planeMaterial);
            this._base.overdraw = true;
            this._base.rotation.x = Math.PI / 2;
            this._scene.add(this._base);

            // projector
            this._projector = new THREE.Projector();

            // light
            this._light = new THREE.PointLight(0xFFFFFF);
            this._light.position.x = 0;
            this._light.position.y = 0;
            this._light.position.z = 1000;
            this._scene.add(this._light);
        
        },

        loadBaseMap: function(){

            this._tileLayers.push(new WXC.TileLayer({
                "zIndex":1,
                "rotation": this._base.rotation
            }, this));

        },

        initEventPublishers: function(){

            var _this = this;

            // MOUSE_MOVE
            this._renderer.domElement.addEventListener( 'mousemove', function(e){
                e.preventDefault();
                $.publish(WXC.topics.MOUSE_MOVE, {"e":e, "map":_this} );
            }, false );

            // MOUSE_DOWN
            this._renderer.domElement.addEventListener( 'mousedown', function(e){
                e.preventDefault();
                $.publish(WXC.topics.MOUSE_DOWN, {"e":e, "map":_this} );
            }, false );

            // MOUSE_UP
            this._renderer.domElement.addEventListener( 'mouseup', function(e){
                e.preventDefault();
                $.publish(WXC.topics.MOUSE_UP, {"e":e, "map":_this} );
            }, false );

        }
        
    });


})();
