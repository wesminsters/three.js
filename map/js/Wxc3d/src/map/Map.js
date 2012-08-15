/**
 * an interactive  map tile plane
 */
(function(){

    WXC.Map = function (options) {

        var _options = $.extend({
            "$container": null,
            "bgColor": "0x000000"
        }, options);

        var  _renderer,
            _camera,
            _scene,
            _plane;

        initScene();
        appLoop();

        function draw(){
            _renderer.render(_scene, _camera);
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
            _renderer = new THREE.WebGLRenderer();
            _renderer.setSize(_options.$container.width(), _options.$container.height());
            _options.$container.append(_renderer.domElement);

            // camera
            _camera = new THREE.PerspectiveCamera(45, _options.$container.width() / _options.$container.height(), 0.1, 1000);
            _camera.position.x = 0;
            _camera.position.y = 0;
            _camera.position.z = 1000;

            // scene
            _scene = new THREE.Scene();
            _scene.add(_camera);

            var img = new THREE.MeshBasicMaterial({ //CHANGED to MeshBasicMaterial
                map:THREE.ImageUtils.loadTexture('http://ecn.t0.tiles.virtualearth.net/tiles/h02313010.jpeg?g=401')
            });
            img.map.needsUpdate = true; //ADDED


            // plane
            //var planeMaterial = new THREE.MeshBasicMaterial({ color: _options.bgColor });
            _plane = new THREE.Mesh(new THREE.PlaneGeometry(256, 256), img);
            _plane.overdraw = true;
            _plane.rotation.x = Math.PI / 2;
            _scene.add(_plane);

            // light
            _light = new THREE.PointLight(0xFFFFFF);
            _light.position.x = 0;
            _light.position.y = 0;
            _light.position.z = 400;
            _scene.add(_light);

        }

    };


})();
