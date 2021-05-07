var linePoints;//全局变量，记录轨迹文件中所有的点
function loadTraBuffer(filepath){
    var fakePath = filepath.value;
    //console.log(fakePath);
    var temp = fakePath.split("\\");
    var fileName = temp[temp.length - 1];
    var url = "/data/" + fileName;
    var data = readJson(url);
    console.log(data);
    console.log(data[0].latitude);
    console.log(data[0].longitude);
    for(i=0;i<=data.length-1;i++){
              linePoints.push(
            {
                longitude:data[i].longitude,
                latitude:data[i].latitude,
                height:data[i].height
            }
        )
    }
    console.log(linePoints);
}