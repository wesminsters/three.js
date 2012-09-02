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
            "debug": false,
            "fps": null
        },
        
        init: function(options){

            this._super(options);

            this.renderer = null;
            this.camera = null;
            this.scene = null;
            this.projector = null;
            this.base = null;
            this.tileLayers = [];
            this.loopStarted = false;

            this.latLon = null;
            this.zoom = this._options.zoom;

            this.initScene();
            this.initEventPublishers();
            this.initEventSubscribers();
            this.appLoop();

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
            $.publish(WXC.topics.APP_LOOP_UPDATE, {"map":this} );
        },
        
        appLoop: function(){

            if (this._options.fps){
                // custom fps
                if (!this.loopStarted){
                    var _this = this;
                    window.setInterval(function() {
                        window.requestAnimationFrame(_this.appLoop.bind(_this));
                    }, (1000/this._options.fps));
                    this.loopStarted = true;
                    return;
                }
            }
            else{
                // wide open fps
                window.requestAnimationFrame(this.appLoop.bind(this));
            }

            this.update();
            this.draw();

            if (this.stats){
                this.stats.update();
            }
            
        },

        debugMode: function(){

            // show a red sphere at origin
            var sphere = new THREE.Mesh(new THREE.SphereGeometry(7, 20, 20), new THREE.MeshLambertMaterial({
                color: 0xff0000
            }));
            sphere.overdraw = true;
            this.scene.add(sphere);

            // show stats
            this.stats = new Stats();
            this.stats.domElement.style.position = 'absolute';
            this.stats.domElement.style.top = '0px';
            this._options.$container.append( this.stats.domElement );

        },
        
        initScene: function(){

            // renderer
            this.renderer = new THREE.WebGLRenderer();
            this.renderer.setSize(this._options.$container.width(), this._options.$container.height());
            this._options.$container.append(this.renderer.domElement);

            // camera

            var frustum = {
                "angle": 30,
                "aspect": this._options.$container.width() / this._options.$container.height(),
                "near": 400,
                "far": 2400
            }

            this.camera = new THREE.PerspectiveCamera(frustum.angle, frustum.aspect, frustum.near, frustum.far);
            this.camera.position = new THREE.Vector3(0, -650, 1200);
            this.camera.lookAt(new THREE.Vector3( 0,0,0 ));

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

        addLayer: function(layer){

            layer._options.rotation = this.base.rotation;
            this.tileLayers.push(layer);

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

        initEventSubscribers: function(){

            var _this = this;

            // MESSAGE
            $.subscribe(WXC.topics.MESSAGE, function($e, args){
                if (_this._options.debug){
                    console.log(args.text);
                    //console.log(Object.keys(_this.tileLayers[0].tiles).length);   // show tile count
                }
            });


        },

        lookAt: function(latLon){

            this.latLon = new WXC.LatLon(latLon.lat, latLon.lon);
            $.publish(WXC.topics.LOOK_AT, this.latLon );

        }
        
    });


})();
