

function getBlog(){
  console.log('clicked');
  $.get("/getBlog", function(data, status){

    if (status === "success") { //data = 1  object
      $('#setApprove').attr('href', `/approve/${data.id}`);
      $('#setReject').attr('href', `/reject/${data.id}`);
      $('#title').val(data.title);
      $('#author').val(data.author);
      $('#desc').val(data.desc);
      //$("#blogid").text(data.id);
      CKEDITOR.instances['editor1'].setData(data.content);
      $("#editform").removeClass('d-none');
      $("#startApprove").addClass('d-none');
    }
    else {
      $("div.middle").html("<h1>There was an error, please reload!</h1>");
    }
  });

}







$(document).ready(function(){
  $("#startApprove").click(getBlog);
});
