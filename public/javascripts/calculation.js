//计算轨迹长度
function totalDis(linePoints) {
    var geodesic_dis = 0;
    for (var i = 0; i < linePoints.length - 2; i++) {
        var startpoint = Cesium.Cartographic.fromDegrees(linePoints[i].longitude, linePoints[i].latitude, linePoints[i].height);
        var endpoint = Cesium.Cartographic.fromDegrees(linePoints[i + 1].longitude, linePoints[i + 1].latitude, linePoints[i + 1].height);
        var geodesic = new Cesium.EllipsoidGeodesic(startpoint, endpoint);
        var distance = geodesic.surfaceDistance;
        geodesic_dis += distance;
    }
    return geodesic_dis;
}
