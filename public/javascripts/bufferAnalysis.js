
function endBufferAnalysis() {
    var infoDiv = document.getElementById('getInfo');
    infoDiv.style.display = 'none';
}


//获取向后台传递的参数
// function submit() {
//     var bufferNum = pickBufferRange();
//     var layerName = pickLayer();
//     var trajPoints = pickTraj();
//     console.log(trajPoints);
// }

//获取当前用户勾选的图层名
function pickLayer() {
    var ilayer = document.getElementsByName('layer');
    var picked = new Array();
    for (var i = 0; i < ilayer.length; i++) {
        if (ilayer[i].checked)
            picked.push(ilayer[i].value);
    }
    return (picked);
}
//获取当前用户自定义的缓冲区大小
function pickBufferRange() {
    var bRange = document.getElementById("bufferRange");
    var picked = bRange.value;
    return picked;

}
//定义传给后台的点（属性只有经纬度）
function getPoints(linePoints){
    if(Cesium.defined(linePoints)){
        var points=[];
        for (i = 0; i < linePoints.length; i++) {
            points.push({
                longitude: linePoints[i].longitude,
                latitude: linePoints[i].latitude
            })
        }
        
        return points;
    }
}

//获取当前用户编辑的轨迹
function pickTraj(traj) {
    var waypoints = linePoints;//以object数组形式存储，有经纬度高度属性
    var picked = [];
    var num = 50;//暂时给定两点之间插值点数为50
    for (var i = 0; i < waypoints.length - 1; i++) {
        var pos1 = waypoints[i];
        var pos2 = waypoints[i + 1];
        picked.push(pos1);
        i_interpolate(num, pos1, pos2, picked);
    }
    picked.push(waypoints.length - 1);
    return picked;
}
//给定两点插值
function i_interpolate(num, pos1, pos2, picked) {
    var lon = [];
    var lat = [];
    var result = [];
    for (var i = 0; i < num; i++) {
        lon[i] = Cesium.Math.lerp(pos1.longitude, pos2.longitude, 1.0 / num * (i + 1));
        lat[i] = Cesium.Math.lerp(pos1.latitude, pos2.latitude, 1.0 / num * (i + 1));
        picked.push({
            longitude: lon[i],
            latitude: lat[i],
            height: 15000
        });
    }
}

//给定坐标添加圆形，半径（点的像素值）为人口，超过用红色醒目标注
function createCircle(pos, ppl, starttime, endtime) {
    var pplcolor;//根据人口确定点的颜色
    var pplR = ppl * 30;//圆圈半径
    var showInterval = new Cesium.TimeInterval({
        start: starttime,
        stop: endtime
    });//显示时间段
    pplcolor = new Cesium.Color(ppl / 1000.0, ppl / 1000.0, 0.0, 0.7);
    viewer.entities.add({
        position: pos,
        ellipse: {
            semiMinorAxis: pplR,
            semiMajorAxis: pplR,
            height: 0.0,
            extrudedHeight: ppl * 100,
            material: pplcolor,
            //outline:Cesium.Color.RED,
            availability: showInterval
        }
    })
}

function showPopulation() {
    //暂时模拟后台获得的人口数
    var waypoints = linePoints;
    var ppl = [];
    for (var i = 0; i < waypoints.length - 1; i++) {
        ppl[i] = Cesium.Math.randomBetween(1, 1000);
    }
    var start = "2018-02-01T10:00:00Z";
    var starttime = Cesium.JulianDate.fromIso8601(start);
    var endtime = Cesium.JulianDate.fromIso8601(start);
    //var endtime=Cesium.JulianDate.addSeconds(starttime, 1500, new Cesium.JulianDate());
    var nexttime = 0;
    //求停止时间
    for (var i = 0; i < waypoints.length - 1; i++) {
        var time = Cesium.JulianDate.addSeconds(starttime, nexttime, new Cesium.JulianDate());
        nexttime += 30;
        endtime = time;
    }
    //创建圆圈
    var st = starttime;
    nexttime = 0;
    for (var j = 0; j < waypoints.length - 1; j++) {
        var pos = Cesium.Cartesian3.fromDegrees(waypoints[j].longitude, waypoints[j].latitude, 0.0);
        createCircle(pos, ppl[j], st, endtime);
        nexttime += 30;
        st = Cesium.JulianDate.addSeconds(starttime, nexttime, new Cesium.JulianDate());
    }
}

//不带时间标记
//给定坐标添加圆形，半径（点的像素值）为人口，超过用红色醒目标注
function createCircles(pos, ppl) {
    var pplcolor;//根据人口确定点的颜色
    var pplR = ppl * 30;//圆圈半径
    pplcolor = new Cesium.Color(ppl / 1000.0, ppl / 1000.0, 0.0, 0.7);
    if (ppl > 800)
        pplcolor = Cesium.Color.RED;
    viewer.entities.add({
        position: pos,
        ellipse: {
            semiMinorAxis: pplR,
            semiMajorAxis: pplR,
            height: 0.0,
            extrudedHeight: ppl * 100,
            material: pplcolor
            //outline:Cesium.Color.RED,
        }
    })
}

//不带时间标记的人口信息
function showPops() {
    var waypoints = linePoints;
    var ppl = [];
    for (var i = 0; i < waypoints.length - 1; i++) {
        ppl[i] = Cesium.Math.randomBetween(1, 1000);
    }
    //创建圆圈
    for (var j = 0; j < waypoints.length - 1; j++) {
        var pos = Cesium.Cartesian3.fromDegrees(waypoints[j].longitude, waypoints[j].latitude, 0.0);
        createCircles(pos, ppl[j]);
    }
}
