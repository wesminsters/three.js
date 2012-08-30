/**
 * represents a single lat & lon location on a map
 */
(function(){

    WXC.LatLon = WXC.Base.extend({

        init: function(lat, lon){

            this._super();
            this.lat = lat;
            this.lon = lon;

        }

    });

})();
