
function startBufferAnalysis(){
	var infoDiv=document.getElementById('getInfo');
	infoDiv.style.display='';
	var btn1=document.getElementById('btnSubmit');
	var btn2=document.getElementById('btnShow');
	var btn3=document.getElementById('btnPop');
	btn1.onclick=function(){
		submit();
		btn2.style.display="";
	}
	btn2.onclick=function(){
		loadGeoJson();//加载geojson本地文件显示缓冲区分析结果
	}
	btn3.onclick=function(){
		showPops();//显示人口信息
	}
}

function endBufferAnalysis(){
	var infoDiv=document.getElementById('getInfo');
	infoDiv.style.display='none';
}


//获取向后台传递的参数
function submit(){
	var bufferNum=pickBufferRange();
	var layerName=pickLayer();
	var trajPoints=pickTraj();
	console.log(trajPoints);
}
//获取当前用户勾选的图层名
function pickLayer(){
	var ilayer=document.getElementsByName('layer');
	var picked=new Array();
	for(var i=0;i<ilayer.length;i++)
	{
		if(ilayer[i].checked)
			picked.push(ilayer[i].value);
	}
	return(picked);
}
//获取当前用户自定义的缓冲区大小
function pickBufferRange(){
	var bRange=document.getElementById("bufferRange");
	var picked=bRange.value;
	return picked;

}
//获取当前用户编辑的轨迹
function pickTraj(traj){
    var waypoints=getSortedPoints();//以object数组形式存储，有经纬度高度属性
    var picked=[];
    var num=50;//暂时给定两点之间插值点数为50
    for(var i=0;i<waypoints.length-1;i++){
    	var pos1=waypoints[i];
    	var pos2=waypoints[i+1];
    	picked.push(pos1);
    	i_interpolate(num,pos1,pos2,picked);
    }
    picked.push(waypoints.length-1);
	return picked;
}
//给定两点插值
function i_interpolate(num,pos1,pos2,picked){
	var lon=[];
	var lat=[];
	var result=[];
	for(var i=0;i<num;i++){
		lon[i]=Cesium.Math.lerp(pos1.longitude,pos2.longitude,1.0/num*(i+1));
		lat[i]=Cesium.Math.lerp(pos1.latitude,pos2.latitude,1.0/num*(i+1));
		picked.push({
            longitude: lon[i],
            latitude: lat[i],
            height:15000          
	});
	}
}