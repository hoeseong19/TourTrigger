var Course = require("../models/course");

// add course
$(function() {
  $(".addBtn").click(async function() {
    var course = new Course({
      // author: user._id,
      title: $("#courseTitle").text(),
      description: $("#courseDescription").text()
    });
    
    await tour.save();
    req.flash('success', 'Successfully posted');





    var course = $("input[name=course]").val();

    $(".courselist").append(`<li class='list-group-item'>${course}<button type='button' class='btn btn-dark btn-sm delBtn float-right'><i class='fas fa-times delBtn'></li>`)

    $("input[name=course]").val("");
    
    $(".delBtn").click(function() {
      $(this).closest("li").remove();
    });
  });
});

// delete course
$(function() {
  $(".delBtn").click(function() {
    $(this).closest("li").remove();
  });
});