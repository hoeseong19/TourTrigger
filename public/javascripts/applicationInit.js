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

var map;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -34.397, lng: 150.644},
    zoom: 8
  });
}