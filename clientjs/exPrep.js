

$(document).ready(function(){
  $("#initExhibition").click(function(){
    let title1 = $("#title1").val();
    let title2 = $("#title2").val();
    let coverImg = $("#coverImg").val();
    let ids = JSON.parse(sessionStorage.exhibit);
    let exData = {
      title1: title1,
      title2: title2,
      coverImg: coverImg,
      ids: ids
    }
    $.post('/initExhibition', exData, function(data, status){
      //console.log(data);
      if (status === "success" ) {
        alert(data.message);
        window.location.href = "/exhibition";
      }
      else {
        alert('Request failed, please retry!');
      }
    });
  });
  $("#previewExhibition").click(function(){
    let title1 = $("#title1").val();
    let title2 = $("#title2").val();
    let coverImg = $("#coverImg").val();
    let ids = JSON.parse(sessionStorage.exhibit);
    let exData = {
      title1: title1,
      title2: title2,
      coverImg: coverImg,
      ids: ids
    }
    $.post('/previewExhibition', exData, function(data, status){
      //console.log(data);
      if (status === "success" ) {
        $('#previewScreen').html(data);
      }
      else {
        alert('Request failed, please retry!');
      }
    });
  });

});
