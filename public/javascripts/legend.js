window.onload = function() {
   
    var myCanvas1 = document.getElementById("myCanvas1"); //获取canvas对象 
    var myCanvas2 = document.getElementById("myCanvas2"); 
    var myCanvas3 = document.getElementById("myCanvas3"); 
    var myCanvas4 = document.getElementById("myCanvas4"); 
    var myCanvas5 = document.getElementById("myCanvas5"); 
    var myCanvas6 = document.getElementById("myCanvas6"); 
        var context1 = myCanvas1.getContext("2d"); //获取画布context的上下文环境  
        var context2 = myCanvas2.getContext("2d");
        var context3 = myCanvas3.getContext("2d");
        var context4 = myCanvas4.getContext("2d");
        var context5 = myCanvas5.getContext("2d");
        var context6 = myCanvas6.getContext("2d");
        //绘制并填充一个圆角矩形  
        fillRoundRect(context1, 0, 80, 250, 75, 5, '#98FB98');
        fillRoundRect(context2, 0, 80, 250, 75, 5, '#9ACD32');
        fillRoundRect(context3, 0, 80, 250, 75, 5, '#2E8B57');
        fillRoundRect(context4, 0, 80, 250, 75, 5, '#F4A460');
        fillRoundRect(context5, 0, 80, 250, 75, 5, '#FA8072');
        fillRoundRect(context6, 0, 80, 250, 75, 5, '#FF0000');
};


/**该方法用来绘制一个有填充色的圆角矩形 
 *@param cxt:canvas的上下文环境 
 *@param x:左上角x轴坐标 
 *@param y:左上角y轴坐标 
 *@param width:矩形的宽度 
 *@param height:矩形的高度 
 *@param radius:圆的半径 
 *@param fillColor:填充颜色 
 **/
function fillRoundRect(cxt, x, y, width, height, radius, /*optional*/ fillColor) {
    //圆的直径必然要小于矩形的宽高          
    if (2 * radius > width || 2 * radius > height) { return false; }

    cxt.save();
    cxt.translate(x, y);
    //绘制圆角矩形的各个边  
    drawRoundRectPath(cxt, width, height, radius);
    cxt.fillStyle = fillColor || "#000"; //若是给定了值就用给定的值否则给予默认值  
    cxt.fill();
    cxt.restore();
}
function drawRoundRectPath(cxt, width, height, radius) {
    cxt.beginPath(0);
    //从右下角顺时针绘制，弧度从0到1/2PI  
    cxt.arc(width - radius, height - radius, radius, 0, Math.PI / 2);

    //矩形下边线  
    cxt.lineTo(radius, height);

    //左下角圆弧，弧度从1/2PI到PI  
    cxt.arc(radius, height - radius, radius, Math.PI / 2, Math.PI);

    //矩形左边线  
    cxt.lineTo(0, radius);

    //左上角圆弧，弧度从PI到3/2PI  
    cxt.arc(radius, radius, radius, Math.PI, Math.PI * 3 / 2);

    //上边线  
    cxt.lineTo(width - radius, 0);

    //右上角圆弧  
    cxt.arc(width - radius, radius, radius, Math.PI * 3 / 2, Math.PI * 2);

    //右边线  
    cxt.lineTo(width, height - radius);
    cxt.closePath();
}
function showLegend(){
    var legendpanel = document.getElementById("legend");
    legendpanel.style.display="block";
}

function hideLegend(){
    var legendpanel = document.getElementById("legend");
    legendpanel.style.display="none";
}