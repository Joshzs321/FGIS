function getDataToShow(){
    // return $('input[name="para"]:checked').val();
    var datatoshow = new Array();
     $('input[name="para"]:checked').each(function(i){
        // if($(this).attr("checked"))
        datatoshow[i]=$(this).val();
    });
    console.log(datatoshow)
    return datatoshow;
}

function getModelToShow(){
    return $('input[name="optionsRadios"]:checked').val();
}
