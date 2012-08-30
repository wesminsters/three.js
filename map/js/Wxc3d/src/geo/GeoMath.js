/**
 * public static math helpers relating to geography
 */
(function(){

    var EARTH_RADIUS = 6378137;
    var MIN_LATITUDE = -85.05112878;
    var MAX_LATITUDE = 85.05112878;
    var MIN_LONGITUDE = -180;
    var MAX_LONGITUDE = 180;
    var TILE_HEIGHT = 256;
    var TILE_WIDTH = 256;

    WXC.GeoMath = {};

    WXC.GeoMath.direction = {
        "NORTH":"NORTH",
        "EAST":"EAST",
        "SOUTH":"SOUTH",
        "WEST":"WEST"
    }

    WXC.GeoMath.neighborTileOffset = {
        "NORTH":{ "pixelXY": new WXC.Point(0, -TILE_HEIGHT) },
        "EAST":{ "pixelXY": new WXC.Point(-TILE_WIDTH, 0) },
        "SOUTH":{ "pixelXY": new WXC.Point(0, TILE_HEIGHT) },
        "WEST":{ "pixelXY": new WXC.Point(TILE_WIDTH, 0) }
    }

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
        var latitude = Clip(latLon.lat, MIN_LATITUDE, MAX_LATITUDE);
        var longitude = Clip(latLon.lon, MIN_LONGITUDE, MAX_LONGITUDE);

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

    WXC.GeoMath.latLon_to_quadKey = function(latLon, zoom){

        var pixelXY = WXC.GeoMath.latLon_to_PixelXY(latLon, zoom);
        var tileXY = WXC.GeoMath.pixelXY_to_tileXY(pixelXY);
        var quadKey = WXC.GeoMath.tileXY_to_quadKey(tileXY, zoom)

        if (pixelOffsetXY){
            pixelOffsetXY.x = pixelXY.x % 256;
            pixelOffsetXY.y = pixelXY.y % 256;
        }

        return quadKey;

    }

    WXC.GeoMath.latLon_to_tileCoords = function(latLon, zoom){

        var pixelXY = WXC.GeoMath.latLon_to_PixelXY(latLon, zoom);
        var tileCoords = WXC.GeoMath.pixelXY_to_tileCoords(pixelXY, zoom);

        return tileCoords;

    }

    WXC.GeoMath.pixelXY_to_tileCoords = function(pixelXY, zoom){

        var tileXY = WXC.GeoMath.pixelXY_to_tileXY(pixelXY);
        var quadKey = WXC.GeoMath.tileXY_to_quadKey(tileXY, zoom);
        var pixelOffsetXY = new WXC.Point(pixelXY.x % 256, pixelXY.y % 256);

        var tileCoords = {
            //"latLon" : latLon,
            "zoom": zoom,
            "pixelXY": pixelXY,
            "tileXY": tileXY,
            "pixelOffsetXY": pixelOffsetXY,
            "quadKey": quadKey
        }

        return tileCoords;

    }

    WXC.GeoMath.getNeighborTileCoords = function(tileCoords, direction){

        var directionOffset = WXC.GeoMath.neighborTileOffset[direction];

        var pixelXY = new WXC.Point(tileCoords.pixelXY.x + directionOffset.pixelXY.x, tileCoords.pixelXY.y + directionOffset.pixelXY.y);
        var tileCoords = WXC.GeoMath.pixelXY_to_tileCoords(pixelXY, tileCoords.zoom);
        tileCoords.pixelOffsetXY.x -= directionOffset.pixelXY.x;
        tileCoords.pixelOffsetXY.y -= directionOffset.pixelXY.y;
        return tileCoords;

    }

})();





