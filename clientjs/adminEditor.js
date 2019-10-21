function submitItem(){
  let content = CKEDITOR.instances.editor1.getData();
  let title = $("#title").val();
  let imageSrc = $("#imageSrc").val();
  let desc = $("#desc").val();
  let category = document.forms.itemPost.category.value;
  if (content == "" || title == "" || imageSrc == "" || desc == "" || category == "") {
    $("#alert").removeClass("d-none");
    return;
  }
  let itemPost = {
    content: content,
    title: title,
    imageSrc: imageSrc,
    desc: desc,
    category: category
  }
  $.post("/submitItem", itemPost, function(data, status){
    console.log(data);
    if (status === "success") {

      $("div.middle").html(data.content);
    }
    else {
      $("div.middle").html("<h1>There was an error submitting your blog.</h1>");
    }
  });
}




$(document).ready(function(){
  $("#submitItem").click(submitItem);
});
