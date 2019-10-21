
$(document).ready(function(){

  $("#login").click(()=>{
    let username = $('#id').val();
    let pass = $('#pass').val();

    $.post("/adminLogin", {username: username, password: pass}, function(data, status){
      console.log(data);
      if (status === "success" && data.message === 'in') {
        window.location.href = "/";
      }
      else {
        alert('login failed ');
      }
    });
  });

});
