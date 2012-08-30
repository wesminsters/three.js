/**
 * public static math helpers relating to geography
 */
(function(){

    var EarthRadius = 6378137;
    var MinLatitude = -85.05112878;
    var MaxLatitude = 85.05112878;
    var MinLongitude = -180;
    var MaxLongitude = 180;

    WXC.GeoMath = {};

    function Clip(n, minValue, maxValue)
    {
        return Math.min(Math.max(n, minValue), maxValue);
    }

    function MapSize(levelOfDetail)
    {
        return parseInt(256 << levelOfDetail);
    }

    WXC.GeoMath.latLon_to_PixelXY = function(latLon, zoom)
    {
        var latitude = Clip(latLon.lat, MinLatitude, MaxLatitude);
        var longitude = Clip(latLon.lon, MinLongitude, MaxLongitude);

        var x = (longitude + 180) / 360;
        var sinLatitude = Math.sin(latitude * Math.PI / 180);
        var y = 0.5 - Math.log((1 + sinLatitude) / (1 - sinLatitude)) / (4 * Math.PI);

        var mapSize = MapSize(zoom);
        var pixelX =  parseInt(Clip(x * mapSize + 0.5, 0, mapSize - 1));
        var pixelY =  parseInt(Clip(y * mapSize + 0.5, 0, mapSize - 1));

        return new WXC.Point(pixelX, pixelY);

    }

    WXC.GeoMath.pixelXY_to_tileXY = function(pixelXY)
    {
        var tileX = pixelXY.x / 256;
        var tileY = pixelXY.y / 256;
        var tileXY = new WXC.Point(tileX, tileY);
        return tileXY;
    }

    WXC.GeoMath.tileXY_to_quadKey = function(tileXY, zoom)
    {
        var quadKey = "";
        for (i = zoom; i > 0; i--)
        {
            var digit = '0';
            var mask = 1 << (i - 1);
            if ((tileXY.x & mask) != 0)
            {
                digit++;
            }
            if ((tileXY.y & mask) != 0)
            {
                digit++;
                digit++;
            }
            quadKey += digit;
        }
        return quadKey;
    }

    WXC.GeoMath.latLon_to_quadKey = function(latLon, zoom, pixelOffsetXY){

        var pixelXY = WXC.GeoMath.latLon_to_PixelXY(latLon, zoom);
        var tileXY = WXC.GeoMath.pixelXY_to_tileXY(pixelXY);
        var quadKey = WXC.GeoMath.tileXY_to_quadKey(tileXY, zoom)

        if (pixelOffsetXY){
            pixelOffsetXY.x = pixelXY.x % 256;
            pixelOffsetXY.y = pixelXY.y % 256;
        }

        return quadKey;

    }

})();





