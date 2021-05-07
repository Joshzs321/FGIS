
 var ip="172.16.103.100";
 //  使用本地地形和影像
var terrainProvider = new Cesium.CesiumTerrainProvider({
    url:'http://localhost:8084/terrain',
    requestVertexNormals : true
});

var imageryProvider= new Cesium.TileMapServiceImageryProvider({
// var imageryProvider= new Cesium.createTileMapServiceImageryProvider({
    url:Cesium.buildModuleUrl('http://localhost:8084/GoogleImage'),
    fileExtension : 'png',
});
    
var viewer = new Cesium.Viewer('cesiumContainer',{
    imageryProvider : imageryProvider,
    // terrainProvider : terrainProvider,
    baseLayerPicker : false,
    CreditDisplay:false
});

//viewer.animation.container.style.visibility = 'hidden';//初始页面时间控件不可见
//viewer.animation.container.style.visibility = 'visible';

//修改初始化画面：由美国——》中国武汉 Method 1 修改默认设置
/*var initialview=Cesium.Rectangle.fromDegrees(114.31, 30.52, 115.31,30.00);
Cesium.Camera.DEFAULT_VIEW_RECTANGLE=initialview;*/

//使用bing数据源
/*var viewer = new Cesium.Viewer('cesiumContainer', {
    infoBox : false,
    selectionIndicator : false
});*/

//修改初始化画面：由美国——》中国武汉 Method 2 定义了viewer后再调整视角
//有转动过程
/*viewer.camera.flyTo({
    destination : Cesium.Cartesian3.fromDegrees(114.31, 30.52, 30000000.0)
});*/
//无转动过程
viewer.camera.setView({
    destination : Cesium.Cartesian3.fromDegrees(114.31, 30.52, 30000000.0)
});


/**
 * 通过两个viewer来实现
 */
// 设置鹰眼
//  var viewer_eye = new Cesium.Viewer('eye',{
//     imageryProvider : imageryProvider,
//     terrainProvider : terrainProvider,
//     baseLayerPicker : false,
//     CreditDisplay:false,
//     geocoder:false,
//     homeButton:false,
//     sceneModePicker:false,
//     baseLayerPicker:false,
//     navigationHelpButton:false,
//     animation:false,
//     timeline:false,
//     fullscreenButton:false,
//     infoBox:false,
// });
// 去除图标
// viewer._cesiumWidget._creditContainer.style.display = "none";
// viewer_eye._cesiumWidget._creditContainer.style.display = "none";
//设置鹰眼图中球属性,不可自己交互,只能响应主视图的变化
// let control = viewer_eye.scene.screenSpaceCameraController;
// control.enableRotate = false;
// control.enableTranslate = false;
// control.enableZoom = false;
// control.enableTilt = false;
// control.enableLook = false;
// let syncViewer = function() {
//     viewer_eye.camera.flyTo({
//         destination: viewer.camera.position,
//         orientation: {
//             heading: viewer.camera.heading,
//             pitch: viewer.camera.pitch,
//             roll: viewer.camera.roll
//         },
//         duration: 0.0
//     });
// };
// 同步鹰眼的方式1,渲染效果更好
// viewer.entities.add({
//     position : Cesium.Cartesian3.fromDegrees(0, 0),
//     label : {
//         text : new Cesium.CallbackProperty(function(){
//             syncViewer();
//             return "";
//         }, true)
//     }
// });

// 同步鹰眼的方式2
// viewer.scene.preRender.addEventListener(syncViewer)


/**
 * 通过leaflet来实现，可以增加范围提示框
 */

function initWork() {
    overMap.init(viewer);
}
var overMap = {
    init: function (viewer) {
        this.viewer = viewer,
        this.mapEle = window.document.createElement("div"),
        this.mapEle.setAttribute("id", "map2d"),
        this.mapEle.style.height = "150px",
        this.mapEle.style.width = "200px",
        this.mapEle.style.position = "absolute",
        this.mapEle.style.bottom = "30px",
        this.mapEle.style.right = "10px",
        document.body.appendChild(this.mapEle),
        this.showStyle = {
            color: "#ff7800", weight: 1, fill: !0, stroke: !0, opacity: 1
        },
        this.hideStyle = { fill: !1, opacity: 0 },
        this.map = L.map('map2d', {
            center: [31.827107, 117.240601],
            zoom: 13,
            zoomControl: false,
            attributionControl: false
        }),
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        }).addTo(this.map),
        this.viewer.scene.postRender.addEventListener(
            this.sceneRenderHandler, this);
    },
    sceneRenderHandler: function (e) {
        var ext = getExtent(this.viewer),
            i = L.latLng(ext.ymin, ext.xmin),
            s = L.latLng(ext.ymax, ext.xmax),
            bounds = L.latLngBounds(i, s);
        if (this.rectangle ? this.rectangle.setBounds(bounds) : this.rectangle = L.rectangle(bounds, this.showStyle).addTo(this.map), -180 == ext.xmin && 180 == ext.xmax && 90 == ext.ymax && -90 == ext.ymin) {
            var center = getCenter(this.viewer);
            this.map.setView([center.y, center.x], 0),
            this.rectangle.setStyle(this.hideStyle)
        }
        else {
            var oBounds = bounds.pad(.5);
            this.map.fitBounds(oBounds),
            this.rectangle.setStyle(this.showStyle)
        }
    },
    hide: function () {
        this.mapEle && (this.mapEle.style.display = "none")
    },
    show: function () {
        this.map && this.mapEle && (this.mapEle.style.display = "block")
    },
    setStyle: function (e) {
        e && (this.showStyle = e)
    },
    destroy: function () {
        this.mapEle && document.getElementsByTagName("body").removeChild(this.mapEle), this.viewer.scene.postRender.removeEventListener(this.sceneRenderHandler, this)
    }
}
function getExtent(viewer) {
    var rectangle = viewer.camera.computeViewRectangle(),
    result = getMinMax(rectangle);
    if (result.xmax < result.xmin) {
        var s = result.xmax;
        result.xmax = result.xmin,
        result.xmin = s
    }
    if (result.ymax < result.ymin) {
        var s = result.ymax;
        result.ymax = result.ymin,
        result.ymin = s
    }
    return result
}
function getMinMax(rectangle) {
    var t = Number(Cesium.Math.toDegrees(rectangle.west)).toFixed(6),
    i = Number(Cesium.Math.toDegrees(rectangle.east)).toFixed(6),
    n = Number(Cesium.Math.toDegrees(rectangle.north)).toFixed(6);
    return {
        xmin: t,
        xmax: i,
        ymin: Number(Cesium.Math.toDegrees(rectangle.south)).toFixed(6),
        ymax: n
    }
}
function getCenter(viewer) {
    var scene = viewer.scene,
    pos = getPos(scene),
    position = pos;
    if (!position) {
        var globe = scene.globe,
        cartographic = scene.camera.positionCartographic.clone(),
        height = globe.getHeight(cartographic);
        cartographic.height = height || 0,
        cartesian = Cesium.Ellipsoid.WGS84.cartographicToCartesian(cartographic)
    }
    var result = toCartographic(position);
    var d = Cesium.Cartesian3.distance(position, viewer.scene.camera.positionWC);
    return result.cameraZ = d,
    result
}
function getPos(scene) {
    var canvas = scene.canvas,
    center = new Cesium.Cartesian2(canvas.clientWidth / 2, canvas.clientHeight / 2),
    ray = scene.camera.getPickRay(center);
    return scene.globe.pick(ray, scene) || scene.camera.pickEllipsoid(center)
}
function toCartographic(cartesian) {
    var cartographic = Cesium.Cartographic.fromCartesian(cartesian),
    result = {};
    return result.y = Number(Cesium.Math.toDegrees(cartographic.latitude)).toFixed(6),
        result.x = Number(Cesium.Math.toDegrees(cartographic.longitude)).toFixed(6),
        result.z = Number(cartographic.height).toFixed(2),
        result
}

