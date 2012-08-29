/**
 * base class for all wxc objects
 */
(function(){

    WXC.Base = Class.extend({

        init: function(options){

            this._options = $.extend({}, this.defaults || {}, options || {});

        }

    });

})();
