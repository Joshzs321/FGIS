var shapeData

function loadShapes(d) {
    var fakePath = d.value;
    console.log(d.files);
    console.log(fakePath);
    var temp = fakePath.split("\\");
    var fileName = temp[temp.length - 1];
    url = "/data/" + fileName;
    if (url) {
        shapeData = readJson(url);
        console.log(shapeData);

        drawShapes(shapeData[0])
    } else {
        alert('文件路径不对');
    }
}


function drawShapes(data) {
    var scene = viewer.scene;
    var entities = data.data
    var length = entities.length
    switch (data.shape) {
        case 'points':
            var b = new Cesium.BillboardCollection();
            scene.primitives.add(b);
            for (var i = 0; i < length; i++) {
                var point = entities[i]
                var position = Cesium.Cartesian3.fromDegrees(point.lon, point.lat, 0)
                var billboard = b.add({
                    show: true,
                    position: position,
                    pixelOffset: new Cesium.Cartesian2(0, 0),
                    eyeOffset: new Cesium.Cartesian3(0.0, 0.0, 0.0),
                    horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                    verticalOrigin: Cesium.VerticalOrigin.CENTER,
                    scale: 1.0,
                    image: './img/glyphicons_242_google_maps.png',
                    color: new Cesium.Color(1.0, 1.0, 1.0, 1.0)
                });
                // 这些方法是绑定在Cesium.Billboard原型上的方法，但是是动态绑定的：即在实例化Drawhelper方法时实现的
                billboard.setEditable()
            }
            break;
        case 'polylines':
            for (var i = 0; i < length; i++) {
                var positions = entities[i].map((item) => {
                    return Cesium.Cartesian3.fromDegrees(item.lon, item.lat, 0)
                })
                console.log('positions: ', positions);
                var polyline = new DrawHelper.PolylinePrimitive({
                    positions: positions,
                    width: 5,
                    geodesic: true
                });
                scene.primitives.add(polyline);
                polyline.setEditable();
            }
            break;
        case 'polygons':
            for (var i = 0; i < length; i++) {
                var positions = entities[i].map((item) => {
                    return Cesium.Cartesian3.fromDegrees(item.lon, item.lat, 0)
                })
                var polygon = new DrawHelper.PolygonPrimitive({
                    positions: positions,
                    material: Cesium.Material.fromType('Checkerboard')
                });
                scene.primitives.add(polygon);
                polygon.setEditable();
            }
            break;
        case 'circles':
            for (var i = 0; i < length; i++) {
                var circle = new DrawHelper.CirclePrimitive({
                    center: Cesium.Cartesian3.fromDegrees(entities[i].center.lon, entities[i].center.lat, 0),
                    radius: entities[i].radius,
                    material: Cesium.Material.fromType('Color', {
                        color: new Cesium.Color(0.0, 1.0, 0.0, 0.6)
                    })
                });
        
                scene.primitives.add(circle);
                circle.setEditable();
            }
            break;
        case 'noFlyZoos':
            for (var i = 0; i < length; i++) {
                var entity =entities[i]
                if (entity.extrudedHeight) {
                    var zone = new DrawHelper.ZonePrimitive({
                        center: Cesium.Cartesian3.fromDegrees(entity.center.lon, entity.center.lat, 0),
                        radius: entity.radius,
                        material: Cesium.Material.fromType(Cesium.Material.RimLightingType),
                        extrudedHeight: entity.extrudedHeight,
                    });
                } else {
                    var zone = new DrawHelper.ZonePrimitive({
                        center:Cesium.Cartesian3.fromDegrees(entity.center.lon, entity.center.lat, 0),
                        radius: entity.radius,
                    });
                    
                    viewer.entities.add({
                        name: "半球禁飞区",
                        position: Cesium.Cartesian3.fromDegrees(entity.center.lon, entity.center.lat,0),
                        ellipsoid: {
                            radii: new Cesium.Cartesian3(entity.radius, entity.radius, entity.radius),
                            maximumCone: Cesium.Math.PI_OVER_TWO,
                            material: Cesium.Color.BLUE.withAlpha(0.3),
                            outline: true,
                        },
                    });
                }
                scene.primitives.add(zone);
            }
    }
}
