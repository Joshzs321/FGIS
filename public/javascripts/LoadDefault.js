function loadCZMLTraj(){
    viewer.entities.removeAll();
    viewer.dataSources.add(Cesium.CzmlDataSource.load('/myCesium/Apps/SampleData/simple.czml'));
    viewer.camera.flyHome(0);
}

function loadKML(){
    var options = {
        camera : viewer.scene.camera,
        canvas : viewer.scene.canvas
    };
        viewer.dataSources.add(Cesium.KmlDataSource.load('/myCesium/Apps/SampleData/kml/bikeRide.kml', options)).then(function(dataSource){
            viewer.clock.shouldAnimate = false;
            var rider = dataSource.entities.getById('tour');
            viewer.flyTo(rider).then(function(){
                viewer.trackedEntity = rider;
                viewer.selectedEntity = viewer.trackedEntity;
                viewer.clock.multiplier = 10;
                viewer.clock.shouldAnimate = true;
            });
        });
}

function loadGeoJson(){
    //以文件形式读取
    var dataSource = Cesium.GeoJsonDataSource.load('/data/hq.geojson');
    viewer.dataSources.add(dataSource); 
    viewer.zoomTo(dataSource);
}

//这个函数实现需要在前台引用新的cesium文件。
function loadGeoJsonArray(){  
    
    //以数组形式读取
    var json={
        "type": "FeatureCollection",
        "name": "China_gis.osm_transport_free_1",
        "features": [
        { "geometry": { "type": "Point", "coordinates": [ 113.8527836, 35.3064896 ] } },
        { "geometry": { "type": "Point", "coordinates": [ 113.8997828, 35.3862612 ] } },
        { "geometry": { "type": "Point", "coordinates": [ 114.0105968, 37.9918236 ] } },
        { "geometry": { "type": "Point", "coordinates": [ 113.9304763, 37.9889717 ] } },
        { "geometry": { "type": "Point", "coordinates": [ 113.8956289, 35.294832 ] } },
        { "geometry": { "type": "Point", "coordinates": [ 113.97153, 39.32573 ] } }
        ]
        };
    var dataSource=Cesium.GeoJsonDataSource.load(json);
    viewer.dataSources.add(dataSource);
    
    viewer.zoomTo(dataSource);
}

