var TerrainTool = (
    function () {
        var terrainProvider = new Cesium.CesiumTerrainProvider({
            url: './sampledata/terrain/ctb-merger/'
        });
        var terrainLevel = 14;//数据等级

        function _() {
        }

        _.LonlatPointsTerrainData = function (lonlats, callback) {
            //请求高程
            var pointArrInput = [];
            for (var i = 0; i < lonlats.length; i++) {
                pointArrInput.push(Cesium.Cartographic.fromDegrees(lonlats[i].lon, lonlats[i].lat));
            }
            var promise = Cesium.sampleTerrain(terrainProvider, terrainLevel, pointArrInput);//pointArrInput
            Cesium.when(promise, function (updatedPositions) {
                callback(updatedPositions);
            });
        };

        return _;
    }
)();

//在鼠标点击事件中调用：
var CesiumEventHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
//得到当前三维场景的椭球体
var ellipsoid = viewer.scene.globe.ellipsoid;
CesiumEventHandler.setInputAction(function (movement) {
    cartesian = viewer.camera.pickEllipsoid(movement.position, ellipsoid);//movement.endPosition
    if (cartesian) {
        //将笛卡尔坐标转换为地理坐标
        var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
        var longitudeDegree = Cesium.Math.toDegrees(cartographic.longitude);
        var latitudeDegree = Cesium.Math.toDegrees(cartographic.latitude);
        TerrainTool.LonlatPointsTerrainData([{ 'lon': longitudeDegree, 'lat': latitudeDegree }],
            function (terrainData) {
                if (terrainData.length > 0) {
                    +'\nlat:' + Cesium.Math.toDegrees(terrainData[0].latitude) + '\nheight:' + (terrainData[0].height ? terrainData[0].height : 0)

                } else {
                    ;
                }

            });
    }
}, Cesium.ScreenSpaceEventType.LEFT_UP);