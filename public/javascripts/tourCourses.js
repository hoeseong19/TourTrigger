// add course
$(function() {
  $(".addBtn").click(function() {
    var course = $("input[name=course]").val();

    $(".courselist").append(`<li class='list-group-item'>${course}<button type='button' class='btn btn-dark btn-sm delBtn float-right'><i class='fas fa-times'></li>`)
  });
});

// delete course
$(function() {
  $(".delBtn").click(function() {
    $(this).closest("li").remove();
  });
});