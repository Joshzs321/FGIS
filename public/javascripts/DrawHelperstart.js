/* 函数说明
startDrawHelper(viewer)             创建绘制工具，开始绘制
getSortedPoints(event.positions)    将系统绘制的点打包为json数组
flyCustom()                         以linePoints为轨迹 添加实体 飞行演示
*/
/* "AUTHOR"=CHEN MIN */

/**
 *
 *
 * @param {*} viewer
 */

var isDrawing = false
var drawHelper


function startDrawHelper(viewer) {
    if (!drawHelper) {
        drawHelper = new DrawHelper(viewer);
        var scene = viewer.scene;

        //自定义飞行路径
        var pointsChart = d3.select("#pointsChart");
        pointsChart.style.display = "";


        var toolbar = drawHelper.addToolbar(document.getElementById("toolbar1"), {
            buttons: ['marker', 'polyline', 'polygon', 'circle', 'extent', 'zone']
        });
        toolbar.addListener('markerCreated', function (event) {
            loggingMessage('Marker created at ' + event.position.toString());
            var b = new Cesium.BillboardCollection();
            scene.primitives.add(b);
            var billboard = b.add({
                show: true,
                position: event.position,
                pixelOffset: new Cesium.Cartesian2(0, 0),
                eyeOffset: new Cesium.Cartesian3(0.0, 0.0, 0.0),
                horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                verticalOrigin: Cesium.VerticalOrigin.CENTER,
                scale: 1.0,
                image: './img/glyphicons_242_google_maps.png',
                color: new Cesium.Color(1.0, 1.0, 1.0, 1.0)
            });
            console.log(billboard);
            billboard.setEditable()
            //console.log(billboard.position);
        });
        toolbar.addListener('polylineCreated', function (event) {
            loggingMessage('Polyline created with ' + event.positions.length + ' points');
            var polyline = new DrawHelper.PolylinePrimitive({
                positions: event.positions,
                width: 5,
                geodesic: true
            });
            scene.primitives.add(polyline);
            polyline.setEditable();
            // 不太清楚这些是干嘛的
            // polyline.addListener('onEdited', function (event) {
            //     loggingMessage('Polyline edited, ' + event.positions.length + ' points');
            //     linePoints = getSortedPoints(event.positions);
            //     //updatePointsChart(linePoints);
            //     //console.log(linePoints);
            // })
            // linePoints = getSortedPoints(event.positions);
            //console.log(linePoints);

        });
        toolbar.addListener('polygonCreated', function (event) {
            loggingMessage('Polygon created with ' + event.positions.length + ' points');
            console.log('positions: event.positions,: ', event.positions,);
            var polygon = new DrawHelper.PolygonPrimitive({
                positions: event.positions,
                material: Cesium.Material.fromType('Checkerboard')
            });
            scene.primitives.add(polygon);
            polygon.setEditable();
            polygon.addListener('onEdited', function (event) {
                loggingMessage('Polygon edited, ' + event.positions.length + ' points')
            })
        });
        toolbar.addListener('circleCreated', function (event) {
            loggingMessage('Circle created: center is ' + event.center.toString() + ' and radius is ' + event.radius.toFixed(1) + ' meters');

            var circle = new DrawHelper.CirclePrimitive({
                center: event.center,
                radius: event.radius,
                material: Cesium.Material.fromType('Color', {
                    color: new Cesium.Color(0.0, 1.0, 0.0, 0.6)
                })
            });

            scene.primitives.add(circle);
            circle.setEditable();
            circle.addListener('onEdited', function (event) {
                loggingMessage('Circle edited: radius is ' + event.radius.toFixed(1) + ' meters')
            })
        });
        toolbar.addListener('zoneCreated', function (event) {
            var cartographic = Cesium.Cartographic.fromCartesian(event.center)
            var lat = Cesium.Math.toDegrees(cartographic.latitude)
            var lon = Cesium.Math.toDegrees(cartographic.longitude)
            var radius = event.radius
            loggingMessage('禁飞区已建立: 中心点为' + [lat, lon].toString() + ' && 半径为 ' + radius.toFixed(1) + ' 米');

            // 判断是那种禁飞区
            var extrudedHeight = parseFloat(document.getElementById('zoneHeight').value);
            if (extrudedHeight) {
                var zone = new DrawHelper.ZonePrimitive({
                    center: event.center,
                    radius: radius,
                    material: Cesium.Material.fromType(Cesium.Material.RimLightingType),
                    extrudedHeight: extrudedHeight,
                });
            } else {
                var zone = new DrawHelper.ZonePrimitive({
                    center: event.center,
                    radius: radius,
                });

                viewer.entities.add({
                    name: "半球禁飞区",
                    position: Cesium.Cartesian3.fromDegrees(lon, lat, 0),
                    ellipsoid: {
                        radii: new Cesium.Cartesian3(radius, radius, radius),
                        maximumCone: Cesium.Math.PI_OVER_TWO,
                        material: Cesium.Color.BLUE.withAlpha(0.3),
                        outline: true,
                    },
                });
            }
            scene.primitives.add(zone);
            // circle.setEditable();
            // circle.addListener('onEdited', function (event) {
            //     loggingMessage('Circle edited: radius is ' + event.radius.toFixed(1) + ' meters')
            // })
        });


        /*toolbar.addListener('extentCreated', function (event) {
            var extent = event.extent;
            loggingMessage('Extent created (N: ' + extent.north.toFixed(3) + ', E: ' + extent.east.toFixed(3) + ', S: ' + extent.south.toFixed(3) + ', W: ' + extent.west.toFixed(3) + ')');
            var extentPrimitive = new DrawHelper.ExtentPrimitive({
                extent: extent,
                material: Cesium.Material.fromType(Cesium.Material.StripeType)
            });
            scene.primitives.add(extentPrimitive);
            extentPrimitive.setEditable();
            extentPrimitive.addListener('onEdited', function (event) {
                loggingMessage('Extent edited: extent is (N: ' + event.extent.north.toFixed(3) + ', E: ' + event.extent.east.toFixed(3) + ', S: ' + event.extent.south.toFixed(3) + ', W: ' + event.extent.west.toFixed(3) + ')')
            })
        });*/

        var logging = document.getElementById('logging');
        function loggingMessage(message) {
            logging.innerHTML = message
        }
        isDrawing=true
    } else {
        document.getElementById("toolbar1").style.display =isDrawing?"none":"block"
        isDrawing=!isDrawing
    }


}

function getSortedPoints(positions) {
    var points = [];
    for (var i = 0; i < positions.length - 2; i++) {
        var temp = Cesium.Cartographic.fromCartesian(positions[i]);
        var rPlon = Cesium.Math.toDegrees(temp.longitude);
        var rPlat = Cesium.Math.toDegrees(temp.latitude);
        var rPhgt = temp.height;
        points.push({
            longitude: rPlon,
            latitude: rPlat,
            height: rPhgt
        });
    }
    return points;
}

function updatePointsChart(dataset) {
    var pointsChart = d3.select("#pointsChart");

    pointsChart.innerHTML = dataset;
    pointsChart.innerHTML = "hey";
    /* var update=pointsChart.data(dataset);
    var enter=update.enter();
    update.text(function(d){
        return d;
    });
    enter.append("p")
    .text(function(d){
        return d;
    }); */
}

function flyCustom() {
    if (Cesium.defined(linePoints)) {
        //修改轨迹-使用插值点
        var waypoints = linePoints;
        var starttime = Cesium.JulianDate.now();
        var endtime = starttime.clone();
        var nexttime = 0;
        var positions = new Cesium.SampledPositionProperty();
        for (var i = 0; i < waypoints.length - 1; i++) {
            var time = Cesium.JulianDate.addSeconds(starttime, nexttime, new Cesium.JulianDate());
            var pos = Cesium.Cartesian3.fromDegrees(waypoints[i].longitude, waypoints[i].latitude, 15000);//默认高度为15000m
            positions.addSample(time, pos);
            nexttime += 30;
            endtime = time;
        }
        //修改轨迹-使用插值点end
        viewer.entities.removeAll();
        viewer.clock.shouldAnimate = false;
        viewer.clock.startTime = starttime.clone();
        viewer.clock.stopTime = endtime.clone();
        viewer.clock.currentTime = starttime.clone();
        viewer.timeline.zoomTo(starttime, endtime);
        viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;//停止时间推进
        viewer.clock.multiplier = 1;

        var flight = viewer.entities.add({
            name: "customized flight",
            position: positions,
            orientation: new Cesium.VelocityOrientationProperty(positions),
            model: {
                uri: 'model/Cesium_Air.glb',
                minimumPixelSize: 64
            }
        });
        viewer.zoomTo(viewer.entities).then(function () {
            viewer.trakedEntity = flight;
            viewer.clock.shouldAnimate = true;
            viewer.clock.onTick.addEventListener(function (clock) {
                var time = viewer.clock.currentTime;
                paraDisplay(flight, time);
            });
        })
    }
}
