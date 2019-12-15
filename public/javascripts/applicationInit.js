$(function() {
  $('.summernote').summernote();
  $('.note-popover').hide();
});

$(function() {
  AOS.init({
    easing: 'ease-out-back',
    duration: 1500
  });
});

$(function() {
  $('.need-confirm-btn').click(function() {
    if (confirm('Are you sure to delete?')) {
      return true;
    }
    return false;
  });
});
