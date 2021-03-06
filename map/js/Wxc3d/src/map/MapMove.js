/**
 * mouse event handlers to move the map
 */
(function(){

    var _thisMoveDelta,
        _lastMoveDelta,
        _thisMove,
        _intersected,
        _selected,
        _mouse = new THREE.Vector2(),
        _offset = new THREE.Vector3()
    ;

    $.subscribe(WXC.topics.MOUSE_MOVE, function($e, args){

        var e = args.e;
        var map = args.map

        _mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        _mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

        var vector = new THREE.Vector3( _mouse.x, _mouse.y, 0.5 );
        map.projector.unprojectVector( vector, map.camera );

        var ray = new THREE.Ray( map.camera.position, vector.subSelf( map.camera.position ).normalize() );


        if ( _selected ) {

            var intersects = ray.intersectObject( map.base );
            if (!intersects[0]) { return; }

            _thisMoveDelta = intersects[ 0 ].point.subSelf( _offset );

            if (!_lastMoveDelta){
                _thisMove = _thisMoveDelta;
            }
            else{
                _thisMove.x = _thisMoveDelta.x - _lastMoveDelta.x;
                _thisMove.y = _thisMoveDelta.y - _lastMoveDelta.y;
            }

            $.publish(WXC.topics.MAP_MOVE, {
                "map":map,
                "xy": _thisMove
            });

            _lastMoveDelta = _thisMoveDelta;

            return;

        }

        var intersects = ray.intersectObject( map.base );

        if ( intersects.length > 0 ) {

            if ( _intersected != intersects[ 0 ].object ) {
                _intersected = intersects[ 0 ].object;
                map.base.position.copy( _intersected.position );
            }

            map._options.$container[0].style.cursor = 'pointer';

        } else {

            _intersected = null;
            map._options.$container[0].style.cursor = 'auto';

        }

    });

    $.subscribe(WXC.topics.MOUSE_DOWN, function($e, args){

        var e = args.e;
        var map = args.map

        _thisMoveDelta = null;
        _lastMoveDelta = null;
        _thisMove = null;

        var vector = new THREE.Vector3( _mouse.x, _mouse.y, 0.5 );
        map.projector.unprojectVector( vector, map.camera );

        var ray = new THREE.Ray( map.camera.position, vector.subSelf( map.camera.position ).normalize() );

        var intersects = ray.intersectObject( map.base );

        if ( intersects.length > 0 ) {

            $.publish(WXC.topics.MAP_MOVE_START, {
                "map":map
            });

            _selected = intersects[ 0 ].object;

            var intersects = ray.intersectObject( map.base );
            _offset.copy( intersects[ 0 ].point ).subSelf( map.base.position );

            map._options.$container[0].style.cursor = 'move';

        }

    });

    $.subscribe(WXC.topics.MOUSE_UP, function($e, args){

        var e = args.e;
        var map = args.map

        _thisMoveDelta = null;
        _lastMoveDelta = null;
        _thisMove = null;

        if ( _intersected ) {

            $.publish(WXC.topics.MAP_MOVE_END, {
                "map":map
            });

            _selected = null;
        }

        map._options.$container[0].style.cursor = 'auto';

    });


})();

