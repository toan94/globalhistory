function submitBlog(){
  let content = CKEDITOR.instances.editor1.getData();
  let title = $("#title").val();
  let author = $("#author").val();
  let desc = $("#desc").val();
  if (content == "" || title == "" || author == "" || desc == "") {
    $("#alert").removeClass("d-none");
    return;
  }
  let blogPost = {
    content: content,
    title: title,
    author: author,
    desc: desc
  }
  $.post("/submitBlog", blogPost, function(data, status){
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
  $("#submitBlog").click(submitBlog);
});
