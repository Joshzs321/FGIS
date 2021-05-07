/* 函数说明
readPop(posArray)                   供调用的函数
createRect(pop,bufferRange)         根据每一条人口记录绘制线段
setColor(popNum)                    根据人口数量设置线条颜色，由绿到红 
*/
/* "AUTHOR"=CHEN MIN */


//d3异步读取文件并显示
function readInPopJson(iurl,bufferRange) {
    d3.json(iurl, function (d) {
        popArray=d;
        readPop(popArray,bufferRange);
    });
}

//读取数组文件并显示
//popArray是一个List类型
function readPop(popArray,bufferRange){
    var buffersize= Number(bufferRange);
    for(var i=0;i<popArray.length;i++)
    {
        createRect(popArray[i], buffersize*5);
    }
    viewer.zoomTo(viewer.entities);
    showLegend();
}

//用带线宽的线段表示缓冲区
//颜色深浅表示人口数量多少
function createRect(pop,bufferRange){
    
    var start=pop.StartPoint,
    end=pop.EndPoint,
    popNum=pop.popNum;
    var rects = viewer.entities.add({
        name: 'population Rects',
        polyline: {
            positions: Cesium.Cartesian3.fromDegreesArray([
                start.longitude, start.latitude,
                end.longitude, end.latitude
            ]),
            width: bufferRange,
            geodesic:true,
            material: new Cesium.PolylineOutlineMaterialProperty({
                color: setColor(popNum),
                outlineWidth: 1,
                outlineColor: Cesium.Color.BLACK
            })
        }
    });
}
 
/* function setColor(popNum){
    var colorIndex;
    if(popNum<100000){
        //in green
        var green=popNum/150000.0;
        colorIndex = new Cesium.Color(0, green, 0, 0.75);
    }else{
        if(popNum<300000){
            var red=(popNum-150000.0)/150000.0;
            colorIndex = new Cesium.Color(red, 0, 0, 0.75);
        }else{
            colorIndex=Cesium.Color.RED;
        }
    }
    return colorIndex;
} */

function setColor(popNum) {
    var colorIndex;
    if (popNum < 50000) {
        colorIndex = Cesium.Color.fromAlpha(Cesium.Color.PALEGREEN, 0.75);
    } else {
        if (popNum < 100000)
        {
            colorIndex = Cesium.Color.fromAlpha(Cesium.Color.YELLOWGREEN, 0.75) ;
        } 
        else {
            if (popNum < 150000)
            {
                colorIndex = Cesium.Color.fromAlpha(Cesium.Color.SEAGREEN, 0.75);
            }
            else{
                if (popNum < 200000)
                {
                    colorIndex = Cesium.Color.fromAlpha(Cesium.Color.SANDYBROWN, 0.75);
                }
                else{
                    if(popNum<250000)
                    {
                        colorIndex = Cesium.Color.fromAlpha(Cesium.Color.SALMON , 0.75);
                    }
                    else{
                        colorIndex = Cesium.Color.fromAlpha(Cesium.Color.RED, 0.75);
                    }}}}}
    return colorIndex;
}
