
//included in adminNav.ejs

$(document).ready(function(){

  if (!sessionStorage.del)
    sessionStorage.del = JSON.stringify([]);
  if (!sessionStorage.exhibit)
    sessionStorage.exhibit = JSON.stringify([]);

  $("input.delete").each(function(_){
    let id = $(this).attr('id').split("|")[1];
    let set = new Set(JSON.parse(sessionStorage.del));
    if (set.has(id)) {
      //console.log('go')
      $(this).prop('checked', true);
    }
    //assign click event
    $(this).click(function(){
      let set = new Set(JSON.parse(sessionStorage.del));
      let id =  $(this).attr('id').split("|")[1];
      let checked = $(this).prop('checked');
      //console.log(checked);
      if (checked) {
        set.add(id);
      }
      else {
        set.delete(id);
      }
      sessionStorage.del =JSON.stringify(Array.from(set));
    });
  });
  $("input.exhibit").each(function(_){
    let id = $(this).attr('id').split("|")[1];
    let set = new Set(JSON.parse(sessionStorage.exhibit));
    if (set.has(id)) {
      console.log('go');
      $(this).prop('checked', true);
    }
    //assign click event
    $(this).click(function(){
      let set = new Set(JSON.parse(sessionStorage.exhibit));
      let id =  $(this).attr('id').split("|")[1];
      let checked = $(this).prop('checked');
      console.log(checked);
      if (checked) {
        set.add(id);
      }
      else {
        set.delete(id);
      }
      sessionStorage.exhibit = JSON.stringify(Array.from(set));
    });
  });
  $("#initDelete").click(function(e){
    e.preventDefault();
    let ids = JSON.parse(sessionStorage.del);
    sessionStorage.removeItem("del");
    console.log('click');
    $.post('/delete/items', {ids: ids}, function(data, status){
      //console.log(data);
      console.log(status);
      console.log(data);
      if (status === "success" ) {
        alert(data.message);
        //window.location.href = "/category/facts";
        location.reload();
      }
      else {
        alert('request failed');
      }
    });
  });

});
