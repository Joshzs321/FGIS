function showStoredvectorRes(layer,vectorresultpath){
    var geojsonUrl = vectorresultpath;
       switch(layer){
           case "车站":geojsonUrl+="/China_gis.osm_transport_free_1.geojson";
                        break;
           case "交通标志":geojsonUrl+="/China_gis.osm_traffic_free_1.geojson";
                        break;
            case "人口": break;           
       }
        var dataSource = Cesium.GeoJsonDataSource.load(geojsonUrl);
        //var dataSourceCollection=new Cesium.DataSourceCollection();
        //dataSourceCollection.add(dataSourceCollection);
        viewer.dataSources.add(dataSource);
        //viewer.dataSources.add(dataSource);
        viewer.zoomTo(dataSource);
}

function showRes(projectUrl, messageJSON) {

    // var res=data.documentElement.innerHTML;
    // var json=$.parseJSON(res);
    var listvectorRes = messageJSON.listvectorRes;
    var listrasterRes = messageJSON.listrasterRes;
    //var rasterRes = messageJSON.RasterRes;
    //var tbody = $("#analRes"); 
    var tbody = document.getElementById("analRes");
    // var projectUrl='/project/'+datatoWeb.userName+'/'+datatoWeb.projectName+'/';
    if (listvectorRes != null) {
        $.each(listvectorRes, function (index, item) {  //循环  data数据  ，index 循环编号 i    item是每一次循环的单个对象
            OutPutVectorData(projectUrl, tbody, item);
        });
    }
    if (listrasterRes != null) {
        $.each(listrasterRes, function (index, item) {
            OutPutRasterData(tbody, item);
        });
    }


}







function appendLi(tbody, item) {
    var name = layersJson[item.layerName];
    var li = document.createElement("li");
    tbody.appendChild(li);

    var input = document.createElement("input");
    input.setAttribute("id", item.layerName);
    input.setAttribute("type", "checkbox");
    input.setAttribute("class", "panel-heading");
    var txt = document.createTextNode(name);
    li.appendChild(input);
    li.appendChild(txt);

    var textarea = document.createElement("textarea");
    textarea.setAttribute("id", item.layerName + "text");
    textarea.setAttribute("class", "form-control");
    textarea.style.display = "none";
    textarea.style.position = "relative";
    textarea.readOnly = "readonly";
    textarea.style.overflow = "visible";
    textarea.style.rows = 5;
    textarea.innerHTML = item.content;
    li.appendChild(textarea);
}

function loadMultiGeojson(projectUrl, item) {

    for (var i = 0; i < item.listgeojson.length; i++) {
        var geojsonUrl = projectUrl + item.listgeojson[i];
        var dataSource = Cesium.GeoJsonDataSource.load(geojsonUrl);
        //var dataSourceCollection=new Cesium.DataSourceCollection();
        //dataSourceCollection.add(dataSourceCollection);
        viewer.dataSources.add(dataSource);
        //viewer.dataSources.add(dataSource);
        viewer.zoomTo(dataSource);
    }

}

// function removeMultiGeojson(projectUrl,item){
// for(var i=0;i<item.listgeojson.length;i++){
//     var geojsonUrl=projectUrl+item.listgeojson[i];
//     var dataSource=Cesium.GeoJsonDataSource.load(geojsonUrl);
//     //var dataSourceCollection=new Cesium.DataSourceCollection();
//     //dataSourceCollection.add(dataSourceCollection);
//     viewer.dataSources.remove(dataSource);
//     //viewer.dataSources.add(dataSource);
//     viewer.zoomTo(dataSource);
// }
// }

function OutPutVectorData(projectUrl, tbody, item) {


    appendLi(tbody, item);
    var input = document.getElementById(item.layerName);
    var textarea = document.getElementById(item.layerName + "text");
    //textarea.innerHTML=item.content;
    input.addEventListener("click", function () {
        if (this.checked) {
            textarea.style.display = "block";
            //viewer.dataSources.add(dataSource);
            loadMultiGeojson(projectUrl, item);

        } else {
            textarea.style.display = "none";
            viewer.dataSources.removeAll();

            //removeMultiGeojson(projectUrl,item);
        }
    })

    //var dataSourceCollection=new Cesium.DataSourceCollection();
    //dataSourceCollection.add(dataSourceCollection);
    //viewer.dataSources.add(dataSource);
    //viewer.dataSources.add(dataSource);
    //viewer.zoomTo(dataSource);
}





function OutPutRasterData(tbody, item) {


    var name = layersJson[item.layerName];
    appendLi(tbody, item);


    var input = document.getElementById(item.layerName);
    var textarea = document.getElementById(item.layerName + "text");
    //textarea.innerHTML=populationContent(item);
    input.addEventListener("click", function () {
        //var bufferRange = document.getElementById("bufferRange").value();
        //console.log(bufferRange);
        var bufferRange =parseInt($("#bufferRange").val());
        if (this.checked) {
            textarea.style.display = "block";
            //PopulationBlock是一个数组，前端利用其数据生成entities进行展示
            console.log(item.PopulationBlock);
            readPop(item.PopulationBlock,bufferRange);
            //alert(item.PopulationBlock);
            


        } else {
            textarea.style.display = "none";
            viewer.dataSources.removeAll();
        }
    })

}
function populationContent(item) {
    var contextTotal = "总" + name + ":" + item.totalNum + "\n";
    var contextProvince = "";
    for (var i = 0; i < item.tagCoords.length; i++) {
        contextProvince += item.tagCoords[i].Province + ":" + item.tagCoords[i].popNum + "\n";
    }
    var context = contextTotal + contextProvince;
    return context;

}


// function loadGeoJson(){
//     //var dataSource = Cesium.GeoJsonDataSource.load('/myCesium/Apps/SampleData/simplestyles.geojson');
//     var dataSource=Cesium.GeoJsonDataSource.load('/project/qh/test2/gis.osm_traffic_free_1.geojson');
//     viewer.dataSources.add(dataSource); 
//     viewer.zoomTo(dataSource);
//     }
