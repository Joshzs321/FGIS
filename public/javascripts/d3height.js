/* 函数说明
viewHeight(data)                直接调用，data为读入的轨迹数据
                                整理为heightData方便绘图
*/
/* "AUTHOR"=CHEN MIN */

function viewHeight(data, datatoshow) {
    // Chart dimensions.
    var margin = {
            top: 19.5,
            right: 19.5,
            bottom: 19.5,
            left: 49.5
        },
        width = 960 - margin.right - margin.left,
        height = 500 - margin.top - margin.bottom;
    //保证只有一个svg图像
    //  自己创建包含chart的标签、
    $("#chart1").remove()
    var chart1 = document.createElement('div')
    chart1.setAttribute('id', 'chart1')
    chart1.setAttribute('class', 'chart')
    // d3.select("#chart1").select("svg").remove();
    $("#chartContainer").append(chart1)
    // Create the SVG container and set the origin.
    var svg = d3.select("#chart1").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        

    var heightData = [];

    //后面需要进一步改
    switch (datatoshow) {
        case "attackAngle":
            for (var i = 0; i < data.length; i++) {
                heightData.push({
                    time: data[i].time,
                    paratoshow: data[i].attackAngle
                });
            }
            break;
        case "sideslipAngle":
            for (var i = 0; i < data.length; i++) {
                heightData.push({
                    time: data[i].time,
                    paratoshow: data[i].sideslipAngle
                });
            }
            break;
        case "dipAngle":
            for (var i = 0; i < data.length; i++) {
                heightData.push({
                    time: data[i].time,
                    paratoshow: data[i].dipAngle
                });
            }
            break;
        case "flightPathAngle":
            for (var i = 0; i < data.length; i++) {
                heightData.push({
                    time: data[i].time,
                    paratoshow: data[i].flightPathAngle
                });
            }
            break;
        case "ballistic":
            for (var i = 0; i < data.length; i++) {
                heightData.push({
                    time: data[i].time,
                    paratoshow: data[i].ballistic
                });
            }
            break;
        case "distance":
            for (var i = 0; i < data.length; i++) {
                heightData.push({
                    time: data[i].time,
                    paratoshow: data[i].distance
                });
            }
            break;
        case "speed":
            for (var i = 0; i < data.length; i++) {
                heightData.push({
                    time: data[i].time,
                    paratoshow: data[i].speed
                });
            }
            break;
        case "pressure":
            for (var i = 0; i < data.length; i++) {
                heightData.push({
                    time: data[i].time,
                    paratoshow: data[i].pressure
                });
            }
            break;
        case "heatFlow":
            for (var i = 0; i < data.length; i++) {
                heightData.push({
                    time: data[i].time,
                    paratoshow: data[i].heatFlow
                });
            }
            break;
        case "FXGZ":
            for (var i = 0; i < data.length; i++) {
                heightData.push({
                    time: data[i].time,
                    paratoshow: data[i].FXGZ
                });
            }
            break;
        default:
            for (var i = 0; i < data.length; i++) {
                heightData.push({
                    time: data[i].time,
                    paratoshow: data[i].height
                });
            }

            //显示其他轨迹参数
            var parasLabel = svg.append("text")
                .attr("class", "para label")
                .attr("text-anchor", "start")
                .attr("y", 128)
                .attr("x", 30)
                .text("其他参数");

            var paraString =
                "攻角     ：" + "\t" +
                "侧滑角   ：" + "\t" +
                "倾角     ：" + "\t" +
                "航向偏角 ：" + "\t" +
                "弹道倾角 ：" + "\t" +
                "航程     ：" + "\t" +
                "速度     ：" + "\t" +
                "动压     ：" + "\t" +
                "热流     ：" + "\t" +
                "法向倾角 ：";
            var paraStr = paraString.split("\t");
            parasLabel.selectAll("tspan")
                .data(paraStr)
                .enter()
                .append("tspan")
                // .attr("x", 30)
                .attr("x", parasLabel.attr("x"))
                .attr("dy", "1em")
                .text(function (d) {
                    return d;
                });
    }
    // find the max and min
    var timearray = [],
        heightarray = [];
    for (var i = 0; i < heightData.length; i++) {
        timearray.push(heightData[i].time);
        heightarray.push(heightData[i].paratoshow);
    }
    var mintime = d3.min(timearray),
        maxtime = d3.max(timearray),
        minhgt = d3.min(heightarray),
        maxhgt = d3.max(heightarray);

    // Various scales. These domains make assumptions of data, naturally.
    var xScale = d3.scale.linear().domain([mintime, maxtime]).range([0, width]),
        yScale = d3.scale.linear().domain([minhgt, maxhgt]).range([height, 0]);

    // The x & y axes.
    var xAxis = d3.svg.axis().orient("bottom").scale(xScale).ticks(20),
        yAxis = d3.svg.axis().orient("left").scale(yScale);

    // Add the x-axis.
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // Add the y-axis.
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    // Add an x-axis label.
    svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height - 6)
        .text("time/s");

    // Add a y-axis label.
    svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", 6)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text("height/m");

    // add the line
    var lineFunction = d3.svg.line()
        .x(function (d) {
            return xScale(d.time);
        })
        .y(function (d) {
            return yScale(d.paratoshow);
        })
        .interpolate("cardinal_open");

    svg.append("path")
        .attr("d", lineFunction(heightData))
        .attr("stroke-width", 2)
        .attr("stroke", 'white')
        .attr("fill", "none");


    //确定点的位置
    function position(dot) {
        dot.attr("cx", function (d) {
                return xScale(d.time);
            })
            .attr("cy", function (d) {
                return yScale(d.paratoshow);
            });
        // dot.attr("cx", function (d) { return d.time; })
        // .attr("cy", function (d) { return d.height; });
    }

    // Add a dot to represent the plane
    var dot = svg.append("circle")
        .data([heightData[0]])
        .style("fill", "yellow")
        .attr("r", 8)
        .call(position);

    // Add a title.  
    // dot.append("title")
    //     .attr("dx", 12)
    //     .attr("dy", ".35em")
    //     .text(function (d) { return d.time });

    // Add the height label; the value is set on transition.

    var posLabel = svg.append("text")
        .attr("class", "pos label")
        .attr("text-anchor", "start")
        .attr("y", 28)
        .attr("x", 30)
        .text("位置信息");
    var posString =
        "经度 ：" + "\t" +
        "纬度 ：" + "\t" +
        "高度 ：";
    var posStr = posString.split("\t");

    posLabel.selectAll("tspan")
        .data(posStr)
        .enter()
        .append("tspan")
        .attr("x", posLabel.attr("x"))
        // .attr("x", 30)
        .attr("dy", "1em")
        .text(function (d) {
            return d;
        });


    function displayPos(pos, checkedpara) {
        switch (checkedpara) {
            case "attackAngle":
                dot.data([{
                        "time": pos[10],
                        "paratoshow": pos[0]
                    }])
                    .call(position);
                break;
            case "sideslipAngle":
                dot.data([{
                        "time": pos[10],
                        "paratoshow": pos[1]
                    }])
                    .call(position);
                break;
            case "dipAngle":
                dot.data([{
                        "time": pos[10],
                        "paratoshow": pos[2]
                    }])
                    .call(position);
                break;
            case "flightPathAngle":
                dot.data([{
                        "time": pos[10],
                        "paratoshow": pos[3]
                    }])
                    .call(position);
                break;
            case "ballistic":
                dot.data([{
                        "time": pos[10],
                        "paratoshow": pos[4]
                    }])
                    .call(position);
                break;
            case "distance":
                dot.data([{
                        "time": pos[10],
                        "paratoshow": pos[5]
                    }])
                    .call(position);
                break;
            case "speed":
                dot.data([{
                        "time": pos[10],
                        "paratoshow": pos[6]
                    }])
                    .call(position);
                break;
            case "pressure":
                dot.data([{
                        "time": pos[10],
                        "paratoshow": pos[7]
                    }])
                    .call(position);
                break;
            case "heatFlow":
                dot.data([{
                        "time": pos[10],
                        "paratoshow": pos[8]
                    }])
                    .call(position);
                break;
            case "FXGZ":
                dot.data([{
                        "time": pos[10],
                        "paratoshow": pos[9]
                    }])
                    .call(position);
                break;
            default:
                dot.data([{
                        "time": pos[10],
                        "paratoshow": pos[13]
                    }])
                    .call(position);

                var paraString =
                    "攻角     ：" + pos[0] + "\t" +
                    "侧滑角   ：" + pos[1] + "\t" +
                    "倾角     ：" + pos[2] + "\t" +
                    "航向偏角 ：" + pos[3] + "\t" +
                    "弹道倾角 ：" + pos[4] + "\t" +
                    "航程     ：" + pos[5] + "\t" +
                    "速度     ：" + pos[6] + "\t" +
                    "动压     ：" + pos[7] + "\t" +
                    "热流     ：" + pos[8] + "\t" +
                    "法向倾角 ：" + pos[9];
                var paraStr = paraString.split("\t");
                parasLabel.selectAll("tspan")
                    .data(paraStr)
                    .text(function (d) {
                        return d;
                    });
        }
        var posString =
            "经度 ：" + pos[11] + "\t" +
            "纬度 ：" + pos[12] + "\t" +
            "高度 ：" + pos[13];
        var posStr = posString.split("\t");
        posLabel.selectAll("tspan")
            .data(posStr)
            .text(function (d) {
                return d;
            });
    }
    // make displayPerSec global
    window.displayPos = displayPos;
}