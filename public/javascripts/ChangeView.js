//获取追踪的模型每时每刻的位置和方向 
function getModelMatrix(entity, time) {
    var result;
    var matrix3Scratch = new Cesium.Matrix3();
    var positionScratch = new Cesium.Cartesian3();
    var orientationScratch = new Cesium.Quaternion();
    var position = Cesium.Property.getValueOrUndefined(entity.position, time, positionScratch);
    if (!Cesium.defined(position)) { return undefined; }
    var orientation = Cesium.Property.getValueOrUndefined(entity.orientation, time, orientationScratch);
    if (!Cesium.defined(orientation)) {
        result = Cesium.Transforms.eastNorthUpToFixedFrame(position, undefined, result);
    }
    else {
        result = Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromQuaternion(orientation, matrix3Scratch), position, result);
    }
    return result;
}
//改变视角
function changeview(entity, viewoption) {
    var scratch = new Cesium.Matrix4();
    var camera = viewer.scene.camera;
    if (viewoption == "fromleft") {
        scratch = getModelMatrix(entity, viewer.clock.currentTime);
        camera.lookAtTransform(scratch, new Cesium.Cartesian3(-40, 90, 3));
        viewer.trakedEntity = entity;
    }
    if (viewoption == "fromright") {
        scratch = getModelMatrix(entity, viewer.clock.currentTime);
        camera.lookAtTransform(scratch, new Cesium.Cartesian3(-40, -90, 3));
        viewer.trakedEntity = entity;
    }
    if (viewoption == "fromBehind") {
        scratch = getModelMatrix(entity, viewer.clock.currentTime);
        camera.lookAtTransform(scratch, new Cesium.Cartesian3(-40, 0, 3));
        
    }
    if (viewoption == "pilotview") {
        scratch = getModelMatrix(entity, viewer.clock.currentTime);
        camera.lookAtTransform(scratch, new Cesium.Cartesian3(-30, 0, 90));
        
    }
    if (viewoption == "lookdown") {
        scratch = getModelMatrix(entity, viewer.clock.currentTime);
        camera.lookAtTransform(scratch, new Cesium.Cartesian3(-50, 0, -90));
    }
 
}