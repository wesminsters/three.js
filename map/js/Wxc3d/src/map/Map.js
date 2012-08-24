/**
 * an interactive  map tile plane
 */
(function(){

    WXC.Map = function (options) {

        var _context = this;

        _context._options = $.extend({
            "$container": null,
            "bgColor": "0x000000"
        }, options);

        _context._renderer = null,
        _context._camera = null;
        _context._scene = null;
        _context._projector = null;
        _context._plane = null;
        _context._objects = [];
        _context._tiles = [];

        initScene();
        initEventPublishers();
        appLoop();
        loadBaseMap();

        function draw(){
            _context._renderer.render(_context._scene, _context._camera);
        }

        function update(){

        }

        function appLoop(){
            requestAnimationFrame(appLoop);
            update();
            draw();
        }

        function initScene(){

            // renderer
            _context._renderer = new THREE.WebGLRenderer();
            _context._renderer.setSize(_context._options.$container.width(), _context._options.$container.height());
            _context._options.$container.append(_context._renderer.domElement);

            // camera
            _context._camera = new THREE.PerspectiveCamera(45, _context._options.$container.width() / _context._options.$container.height(), 0.1, 5000);
            _context._camera.position.x = 0;
            _context._camera.position.y = -600;
            _context._camera.position.z = 600;
            _context._camera.lookAt(new THREE.Vector3( 0,0,0 ))

            // scene
            _context._scene = new THREE.Scene();
            _context._scene.add(_context._camera);

            var img = new THREE.MeshBasicMaterial({ //CHANGED to MeshBasicMaterial
                map:THREE.ImageUtils.loadTexture('http://ecn.t0.tiles.virtualearth.net/tiles/h02313010.jpeg?g=401')
            });
            img.map.needsUpdate = true; //ADDED


            // plane
            var planeMaterial = new THREE.MeshBasicMaterial({ color: _context._options.bgColor });
            _context._plane = new THREE.Mesh(new THREE.PlaneGeometry(1000, 1000), planeMaterial);
            _context._plane.overdraw = true;
            _context._plane.rotation.x = Math.PI / 2;
            _context._scene.add(_context._plane);
            _context._objects.push( _context._plane );

            // projector
            _context._projector = new THREE.Projector();

            // light
            _context._light = new THREE.PointLight(0xFFFFFF);
            _context._light.position.x = 0;
            _context._light.position.y = 0;
            _context._light.position.z = 1000;
            _context._scene.add(_context._light);

        }

        function loadBaseMap(){

            var img = new THREE.MeshBasicMaterial({ //CHANGED to MeshBasicMaterial
                map:THREE.ImageUtils.loadTexture('http://ecn.t0.tiles.virtualearth.net/tiles/h02313010.jpeg?g=401')
            });
            img.map.needsUpdate = true; //ADDED

            var tile1 = new THREE.Mesh(new THREE.PlaneGeometry(256, 256), img);
            tile1.overdraw = true;
            tile1.rotation.copy(_context._plane.rotation);
            tile1.position.z = 1;
            _context._scene.add(tile1);

            _context._tiles.push( tile1 );
        }

        function initEventPublishers(){

            // MOUSE_MOVE
            _context._renderer.domElement.addEventListener( 'mousemove', function(e){
                e.preventDefault();
                $.publish(WXC.topics.MOUSE_MOVE, {"e":e, "map":_context} );
            }, false );

            // MOUSE_DOWN
            _context._renderer.domElement.addEventListener( 'mousedown', function(e){
                e.preventDefault();
                $.publish(WXC.topics.MOUSE_DOWN, {"e":e, "map":_context} );
            }, false );

            // MOUSE_UP
            _context._renderer.domElement.addEventListener( 'mouseup', function(e){
                e.preventDefault();
                $.publish(WXC.topics.MOUSE_UP, {"e":e, "map":_context} );
            }, false );

        }


    };


})();
