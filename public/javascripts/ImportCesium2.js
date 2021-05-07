
 var ip="192.168.1.100";
 //  使用本地地形和影像
var terrainProvider = new Cesium.CesiumTerrainProvider({
    url:'http://localhost:8084/terrain',
    requestVertexNormals : true
});

var imageryProvider= new Cesium.createTileMapServiceImageryProvider({
    url:Cesium.buildModuleUrl('http://localhost:8084/GoogleImage'),
    fileExtension : 'png',      
});
    
var viewer = new Cesium.Viewer('cesiumContainer',{
    imageryProvider : imageryProvider,
    terrainProvider : terrainProvider,
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

  
