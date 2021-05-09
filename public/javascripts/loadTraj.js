/* 函数说明
readJson(url)               读取JSON格式的轨迹参数                         
sampleProperty(data)        将读取的数据整理打包为每个参数设置时间标记      
createentity(url)           定义实体，并调用上面两函数赋属性
paraDisplay(entity, time)   onTick 显示经纬度，高度，角度参数和其他参数 
*/
/* "AUTHOR"=CHEN MIN */

var startTime;
var stopTime;
var intervalTime1;
var intervalTime2;
var model_path = "/model/Cesium_Air.glb";
var magnification_h = 1;
var magnification_t = 5;
var datasource;

//var url = 'data/TrajData.json';
var url;
$('#model-elector input:radio[name="optionsRadios"]').change(function () {
    model_path = $('#model-elector input:radio:checked').attr('value');
});
var datatoshow;

function getFilePath(d) {
    hideLegend();

    // var fakePath = d.value;
    console.log(d.files);
    var urlArr = []
    for (var i = 0; i < d.files.length; i++) {
        urlArr.push("/data/" + d.files[i].name)
    }

    // var temp = fakePath.split("\\");
    // var fileName = temp[temp.length - 1];
    // url = "/data/" + fileName;
    if (urlArr.length) {
        loadTra(urlArr);
    } else {
        alert('文件路径不对');
    }
}

function readJson(url) {
    var temp;
    //通过ajax读取本地的数据
    $.ajax({
        type: 'get',
        url: url,
        async: false, //取消异步操作
        dataType: 'json',//因为数据类型格式是json,那么数据一定要为正确的json格式，否者就会进入到error中
        success: function (data) {
            temp = data;
        },

        error: function (result) {
            console.log(result)
        }
    });
    return temp;
}

function sampleProperty(data) {
    if ($('#magnification_h').val()) {
        magnification_h = $('#magnification_h').val();
    }
    if ($('#magnification_t').val()) {
        magnification_t = $('#magnification_t').val();
    }
    //magnification_t=$('#magnification_t').val();
    //console.log(magnification_t);
    var now = Cesium.JulianDate.now();
    startTime = Cesium.JulianDate.addSeconds(now, data[0].time, new Cesium.JulianDate());
    intervalTime = Cesium.JulianDate.addSeconds(now, data[35].time, new Cesium.JulianDate());

    stopTime = Cesium.JulianDate.addSeconds(now, data[data.length - 1].time, new Cesium.JulianDate());
    // sample each property for a trajectory
    var positions = new Cesium.SampledPositionProperty(); //lat lon height
    var height = new Cesium.SampledProperty(Number);
    var quaternions = new Cesium.SampledProperty(Number);
    //角度参数
    var attackAngle = new Cesium.SampledProperty(Number);
    var sideslipAngle = new Cesium.SampledProperty(Number);
    var dipAngle = new Cesium.SampledProperty(Number);
    var flightPathAngle = new Cesium.SampledProperty(Number); //航向角
    var ballistic = new Cesium.SampledProperty(Number);
    //其他参数
    var distance = new Cesium.SampledProperty(Number);
    var speed = new Cesium.SampledProperty(Number);
    var pressure = new Cesium.SampledProperty(Number);
    var heatFlow = new Cesium.SampledProperty(Number);
    var FXGZ = new Cesium.SampledProperty(Number);
    //将四元量要素集合转换为一个一维数组
    var Qarray = [];

    function sortQuaternion(quaternion) {
        var q = quaternion;
        Qarray.push(q.x);
        Qarray.push(q.y);
        Qarray.push(q.z);
        Qarray.push(q.w);
    }
    for (var i = 0; i < data.length; i++) {
        var r = data[i]; //轨迹的一条记录
        //console.log(r.time);
        var rtime = Cesium.JulianDate.addSeconds(now, r.time, new Cesium.JulianDate());
        //console.log(rtime);
        //得到该条记录的时间
        var rpos = Cesium.Cartesian3.fromDegrees(r.longitude, r.latitude, r.height * magnification_h);
        var hpr_temp = Cesium.HeadingPitchRoll.fromDegrees(r.heading, r.pitch, r.roll);
        var quaternion = Cesium.Quaternion.fromHeadingPitchRoll(hpr_temp);
        //该条记录的笛卡尔坐标
        positions.addSample(rtime, rpos);
        height.addSample(rtime, r.height);
        quaternions.addSample(rtime, quaternion);
        sortQuaternion(quaternion);

        distance.addSample(rtime, r.distance);
        speed.addSample(rtime, r.speed);
        pressure.addSample(rtime, r.pressure);
        attackAngle.addSample(rtime, r.attackAngle);
        sideslipAngle.addSample(rtime, r.sideslipAngle);
        dipAngle.addSample(rtime, r.dipAngle);
        flightPathAngle.addSample(rtime, r.flightPathAngle);
        ballistic.addSample(rtime, r.ballistic);
        heatFlow.addSample(rtime, r.heatFlow);
        FXGZ.addSample(rtime, r.FXGZ);
    }
    var allParas = [positions, height, Qarray, distance, speed, pressure, attackAngle, sideslipAngle, dipAngle, flightPathAngle, ballistic, heatFlow, FXGZ];
    return allParas;
}




function loadTra(urlArr) {


    viewer.entities.removeAll();
    for (let i = 0; i < urlArr.length; i++) {
        const url = urlArr[i];
        datasource = readJson(url);
        createentity(datasource)
    }




}


function getModelPath(f) {
    var fakePath = f.value;
    var temp = fakePath.split("\\");
    var fileName = temp[temp.length - 1];
    var url = "/model/" + fileName;
    $("input").filter(":radio").removeAttr("checked")
    // model_path = null
    $('input[type=text][name=path]')[0].value = fileName
    $('input[type=text][name=path]')[0].style.display = 'block'
    console.log(url);
    if (url) {
        model_path = url;
        console.log('$ ', $('input[name="optionsRadios"]:checked'));
    }
    else {
        alert('文件路径不对');
    }
}

function createentity(datasource) {
    //1. 将数据转换为velocity需要的格式SamplePositionProperty
    var paras = sampleProperty(datasource); //14个参数

    var positions = paras[0];
    var quaternions = paras[2];
    var height = paras[1];
    console.log(positions.getValue(startTime));
    //2. 设置时间线
    viewer.clock.shouldAnimate = false;
    viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;
    //viewer.clock.clockRange = Cesium.ClockRange.CLAMPED;
    viewer.clock.startTime = startTime;
    viewer.clock.stopTime = stopTime;
    viewer.clock.multiplier = Number(magnification_t);
    viewer.timeline.zoomTo(startTime, stopTime);

    // var heading = Cesium.Math.toRadians(170);
    // var hpr = new Cesium.HeadingPitchRoll(heading, 0, 0);
    // var orientation = Cesium.Transforms.headingPitchRollQuaternion(positions.getValue(startTime), hpr);
    //3. 创建实体
    var plane = viewer.entities.add({
        //Set the entity availability to the same interval as the simulation time.
        availability: new Cesium.TimeIntervalCollection([new Cesium.TimeInterval({
            start: startTime,
            stop: stopTime
        })]),
        position: positions,
        //Automatically compute orientation based on position movement.
        orientation: new Cesium.VelocityOrientationProperty(positions),
        //用四元量一维数据来定义姿态渲染会出错，暂时只能用上面的自动计算
        // orientation:orientation,
        model: {
            uri: model_path,
            minimumPixelSize: 64
        },
        path: {
            resolution: 1,
            material: new Cesium.PolylineGlowMaterialProperty({
                glowPower: 0.1,
                color: Cesium.Color.YELLOW
            }),
            width: 5.0
        }
    });
    // var origin = Cesium.Cartesian3.fromDegrees(position);
    // plane.modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(origin);
    //添加其他属性

    plane.addProperty('distance');
    plane.distance = paras[3];
    plane.addProperty('speed');
    plane.speed = paras[4];
    plane.addProperty('pressure');
    plane.pressure = paras[5];
    plane.addProperty('attackAngle');
    plane.attackAngle = paras[6];
    plane.addProperty('sideslipAngle');
    plane.sideslipAngle = paras[7];
    plane.addProperty('dipAngle');
    plane.dipAngle = paras[8];
    plane.addProperty('flightPathAngle');
    plane.flightPathAngle = paras[9];
    plane.addProperty('ballistic');
    plane.ballistic = paras[10];
    plane.addProperty('heatFlow');
    plane.heatFlow = paras[11];
    plane.addProperty('FXGZ');
    plane.FXGZ = paras[12];


    viewer.flyTo(plane).then(function () {
        viewer.trackedEntity = plane;
        //显示实时坐标
        viewer.clock.onTick.addEventListener(function (clock) {
            //显示高度曲线图表
            var datatoshow = getDataToShow();
            viewHeight(datasource, datatoshow[0]);
            console.log(model_path);
            var now = viewer.clock.currentTime;
            if (model_path)
                plane.model.uri = model_path
            else
                plane.model.uri = getModelToShow()
            paraDisplay(plane, now, datatoshow[0]);

        });
        viewer.clock.shouldAnimate = true;
    });
}
//动态显示参数-通过d3
function paraDisplay(entity, time, datatoshow) {

    var flag = Cesium.Property.getValueOrUndefined(entity.position, time);
    if (Cesium.defined(flag)) {
        var rP = Cesium.Cartographic.fromCartesian(entity.position.getValue(time));
        var rPlon = Cesium.Math.toDegrees(rP.longitude).toFixed(5);
        var rPlat = Cesium.Math.toDegrees(rP.latitude).toFixed(5);
        var rPhgt = rP.height.toFixed(5) / magnification_h;
        //获取位置数组
        var seconds = Cesium.JulianDate.secondsDifference(time, startTime);
        //获取其他参数
        var paras = [];
        paras[0] = checkdefine(entity.attackAngle);
        paras[1] = checkdefine(entity.sideslipAngle);
        paras[2] = checkdefine(entity.dipAngle);
        paras[3] = checkdefine(entity.flightPathAngle);
        paras[4] = checkdefine(entity.ballistic);
        //更新其他参数
        paras[5] = checkdefine(entity.distance);
        paras[6] = checkdefine(entity.speed);
        paras[7] = checkdefine(entity.pressure);
        paras[8] = checkdefine(entity.heatFlow);
        paras[9] = checkdefine(entity.FXGZ);
        //
        paras[10] = seconds;
        paras[11] = rPlon;
        paras[12] = rPlat;
        paras[13] = rPhgt;
        // var checkedpara=getDataToShow();
        window.displayPos(paras, datatoshow);
    }
    //用d3 label 更新参数
    function checkdefine(propname) {
        var temp = Cesium.Property.getValueOrUndefined(propname, time);
        if (Cesium.defined(temp)) {
            temp = temp.toFixed(5);
        } else {
            temp = "";
        }
        return temp;
    }

}

// 扩展ajax,同时发送多个请求：实验性尝试。