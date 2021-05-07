var move = document.getElementById('chart');
var x = 0;
var y = 0;
var l = 0;
var t = 0;
var isDown = false;//声明一个全局变量 用来标识当前鼠标是否按下
///绑定事件
move.onmousedown = function(e){
    //获取尺寸
    x = e.clientX;
    y = e.clientY;

    l = move.offsetLeft;
    t = move.offsetTop;
    //修改检测变量isDown
    isDown = true;
    //修改样式
    move.style.cursor = 'move';
}
//鼠标移动
window.onmousemove = function(e){
    //进行判断
    if(!isDown){
        return;
    }

    //获取鼠标移动之后的位置
    var _x = e.clientX;
    var _y = e.clientY;

    //计算新的left和top
    var newLeft = _x - (x-l);
    var newTop = _y - (y-t);

    //设置新的样式(left和top)
    move.style.left = newLeft + 'px';//建议大家在最后设置样式的时候再加px单位
    move.style.top = newTop + 'px';

}

 //鼠标抬起
 move.onmouseup = function(){
    //修改检测变量的值
    isDown = false;
    move.style.cursor = 'default';
}