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
        map._projector.unprojectVector( vector, map._camera );

        var ray = new THREE.Ray( map._camera.position, vector.subSelf( map._camera.position ).normalize() );


        if ( _selected ) {

            var intersects = ray.intersectObject( map._plane );
            if (!intersects[0]) { return; }

            _thisMoveDelta = intersects[ 0 ].point.subSelf( _offset );

            if (!_lastMoveDelta){
                _thisMove = _thisMoveDelta;
            }
            else{
                _thisMove.x = _thisMoveDelta.x - _lastMoveDelta.x;
                _thisMove.y = _thisMoveDelta.y - _lastMoveDelta.y;
            }

            $.each(map._tiles, function(index, tile) {
                tile.position.x += _thisMove.x;
                tile.position.y += _thisMove.y;
            });

            _lastMoveDelta = _thisMoveDelta;

            return;

        }

        var intersects = ray.intersectObjects( map._objects );

        if ( intersects.length > 0 ) {

            if ( _intersected != intersects[ 0 ].object ) {
                _intersected = intersects[ 0 ].object;
                map._plane.position.copy( _intersected.position );
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
        map._projector.unprojectVector( vector, map._camera );

        var ray = new THREE.Ray( map._camera.position, vector.subSelf( map._camera.position ).normalize() );

        var intersects = ray.intersectObjects( map._objects );

        if ( intersects.length > 0 ) {

            _selected = intersects[ 0 ].object;

            var intersects = ray.intersectObject( map._plane );
            _offset.copy( intersects[ 0 ].point ).subSelf( map._plane.position );

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
            _selected = null;
        }

        map._options.$container[0].style.cursor = 'auto';

    });


})();

