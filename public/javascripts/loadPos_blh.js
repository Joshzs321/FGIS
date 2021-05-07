/* 
以pos_blh方式加载轨迹显示飞行
已弃置不用
 */
//加载飞行模型
//将时间标记的位置数组pos_blh转换为Cesium的位置属性样本SamplePositionProperty:positions
function loadpos_blh(pos_blh) {
    var posarray = pos_blh;
    var positions = new Cesium.SampledPositionProperty();
    for (var i = 0; i < posarray.length; i++) {

        var time = Cesium.JulianDate.fromIso8601(posarray[i].time);
        var pos = Cesium.Cartesian3.fromDegrees(posarray[i].lon, posarray[i].lat, posarray[i].h);
        positions.addSample(time, pos);

    }
    /*    positions.setInterpolationOptions({
               interpolationDegree: 5,
               interpolationAlgorithm: Cesium.LagrangePolynomialApproximation
            });  */
    return positions;
}
//计算轨迹长度
function caltotalDis(pos_blh) {
    //计算轨迹长度
    var geodesic_dis = 0;
    for (var i = 0; i < pos_blh.length - 1; i++) {
        var startpoint = Cesium.Cartographic.fromDegrees(pos_blh[i].lon, pos_blh[i].lat, pos_blh[i].h);
        var endpoint = Cesium.Cartographic.fromDegrees(pos_blh[i + 1].lon, pos_blh[i + 1].lat, pos_blh[i + 1].h);
        var geodesic = new Cesium.EllipsoidGeodesic(startpoint, endpoint);
        var distance = geodesic.surfaceDistance;
        geodesic_dis += distance;
    }
    return geodesic_dis;
}

//设置当前场景的时间为加载的轨迹的飞行时间
function set_timeline(pos_blh) {
    //Set bounds of the simulation time
    var start = Cesium.JulianDate.fromIso8601(pos_blh[0].time);
    var stop = Cesium.JulianDate.fromIso8601(pos_blh[pos_blh.length - 1].time);
    //Make sure viewer is at the desired time.
    viewer.clock.startTime = start.clone();
    viewer.clock.stopTime = stop.clone();
    viewer.clock.currentTime = start.clone();
    //Set timeline to simulation bounds
    viewer.timeline.zoomTo(start, stop);
}

function createentity(pos_blh) {
    //1. 将pos_blh转换为velocity需要的格式SamplePositionProperty
    //var positions=new Cesium.SampledPositionProperty();        
    var positions = loadpos_blh(pos_blh);
    //2. 设置时间线
    set_timeline(pos_blh);
    viewer.clock.shouldAnimate = false;
    viewer.entities.removeAll();
    //3. 创建实体
    var plane05 = viewer.entities.add({
        //Set the entity availability to the same interval as the simulation time.
        availability: new Cesium.TimeIntervalCollection([new Cesium.TimeInterval({
            start: Cesium.JulianDate.fromIso8601(pos_blh[0].time),
            stop: Cesium.JulianDate.fromIso8601(pos_blh[pos_blh.length - 1].time)
        })]),
        position: positions,
        //Automatically compute orientation based on position movement.
        orientation: new Cesium.VelocityOrientationProperty(positions),
        //Load the Cesium plane model to represent the entity
        model: {
            uri: 'model/Cesium_Air.glb',
            minimumPixelSize: 64
        },
        //Show the path as a yellow line sampled in 1 second increments.
        path: {
            resolution: 1,
            material: new Cesium.PolylineGlowMaterialProperty({
                glowPower: 0.1,
                color: Cesium.Color.YELLOW
            }),
            width: 5.0
        },
        label: {
            text: 'Plane05 Wuhan to Bangkok',
            font: 'bold 10pt Segoe UI Semibold',
            fillColor: Cesium.Color.BLUE,
            outlineColor: Cesium.Color.BLACK,
            horizontalOrigin: 'LEFT',
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
            pixelOffset: new Cesium.Cartesian2(15.0, 20.0),
            pixelOffsetScaleByDistance: new Cesium.NearFarScalar(1.5e2, 3.0, 1.5e7, 0.5)
        }
    });
    viewer.flyTo(plane05).then(function () {
        viewer.trackedEntity = plane05;
        viewer.clock.multiplier = 10;
        viewer.clock.shouldAnimate = true;
    })
    //显示实时坐标
    viewer.clock.onTick.addEventListener(function (clock) {
        var rP = Cesium.Cartographic.fromCartesian(positions.getValue(viewer.clock.currentTime));
        var rPlon = Cesium.Math.toDegrees(rP.longitude).toFixed(8);
        var rPlat = Cesium.Math.toDegrees(rP.latitude).toFixed(8);
        var rPhgt = rP.height.toFixed(8);

        rtLon.innerHTML = rPlon;
        rtLat.innerHTML = rPlat;
        rthgt.innerHTML = rPhgt;
    });
    //显示轨迹长度
    var geodesic_dis = caltotalDis(pos_blh);
    console.log(geodesic_dis);
    //totalDis.innerHTML=geodesic_dis.toFixed(2);
}
