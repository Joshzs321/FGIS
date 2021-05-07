//暂停动画
function handelModel(isExit) {
    if (isExit) {
        viewer.clock.shouldAnimate=false;
    } else {
        viewer.clock.shouldAnimate=true;
    }
}
