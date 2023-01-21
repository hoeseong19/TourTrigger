// summernote init
$(function() {
  $('.summernote').summernote();
  $('.note-popover').hide();
});

// aos init
$(function() {
  AOS.init({
    easing: 'ease-out-back',
    duration: 1500
  });
});

//confirm message
$(function() {
  $('.need-confirm-btn').click(function() {
    if (confirm('Are you sure to delete?')) {
      return true;
    }
    return false;
  });
});