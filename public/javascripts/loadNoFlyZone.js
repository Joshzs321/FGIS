function getZonePath(d){
    var fakePath = d.value;
    var temp = fakePath.split("\\");
    var fileName = temp[temp.length - 1];
    url = "/data/" + fileName;
    if (url) {
        drawNoFlyZome(url,datatoshow);
    }
    else {
        alert('文件路径不对');
    }
}

function drawNoFlyZome(url){
    var datasource=readJson(url);
    
    var zomeCollection=v
}
