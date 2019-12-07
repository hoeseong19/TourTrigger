const cities = require("all-the-cities-mongodb")
 
cities.filter(city => {
  return city.name.match('Albuquerque')
})