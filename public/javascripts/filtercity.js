const Geonames = require('geonames.js');

const geonames = new Geonames({
  username: 'hoeseong19',
  lan: 'en',
  encoding: 'JSON'
});



$(function() {
  $("#country").change(function() {
    var selected_country = $(this).find(':selected').text();

    cities.filter(city => {
      return city.country.match()
    })
  });

  
});