/**
 * represents a single xy point location
 */
(function(){

    WXC.Point = WXC.Base.extend({

        init: function(x, y){

            this._super();
            this.x = x == null ? 0 : x;
            this.y = y == null ? 0 : y;

        }

    });

})();