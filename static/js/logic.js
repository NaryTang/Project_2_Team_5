// Creating map object
var myMap = L.map("map", {
  center: [38, -97],
  zoom: 4.2
});

// Adding tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(myMap);

L.geoJson(statesData).addTo(myMap);

// Link to data source
var data = statesData;
// console.log(data)

var geojson;

//set up click-bottons to fitler visualization by year
var radios = document.getElementsByName("toggle_option");

var year;
changeMap(2010)
for(var i = 0; i < radios.length; i++) {
  if(radios[i].checked)
      year = radios[i].value;
}

for(radio in radios) {
  radios[radio].onclick = function() {
      year = this.value;
      changeMap(year);
  }
}

// Create a new choropleth layer
function changeMap(year) {
  geojson = L.choropleth(data, {

  // Define what  property in the features to use
    valueProperty: "Homeless_population_"+ year,

  // Set color scale
    scale: ["#ffffb2", "#b10026"],

  // Number of breaks in step range
    steps: 10,

    // q for quartile, e for equidistant, k for k-means
    mode: "q",
    style: {
      // Border color
      color: "#fff",
      weight: 1,
      fillOpacity: 0.8
    },

  // Binding a pop-up to each layer
    onEachFeature: function(feature, layer) {
      layer.bindPopup(feature.properties.name
      + "<br>Homeless Population 2010:<br>" + feature.properties.Homeless_population_2010.toFixed(2) +"%"
      + "<br>Homeless Population 2011:<br>" + feature.properties.Homeless_population_2011.toFixed(2) +"%"
      + "<br>Homeless Population 2012:<br>" + feature.properties.Homeless_population_2012.toFixed(2) +"%"
      + "<br>Homeless Population 2013:<br>" + feature.properties.Homeless_population_2013.toFixed(2) +"%"
      + "<br>Homeless Population 2014:<br>" + feature.properties.Homeless_population_2014.toFixed(2) +"%"
      + "<br>Homeless Population 2015:<br>" + feature.properties.Homeless_population_2015.toFixed(2) +"%"
      + "<br>Homeless Population 2016:<br>" + feature.properties.Homeless_population_2016.toFixed(2) +"%"
      + "<br>Homeless Population 2017:<br>" + feature.properties.Homeless_population_2017.toFixed(2) +"%");
    }
  }).addTo(myMap);

}
// Set up the legend
var legend = L.control({ position: "bottomright" });
legend.onAdd = function() {
  var div = L.DomUtil.create("div", "info legend");
  var limits = geojson.options.limits;
  var colors = geojson.options.colors;
  var labels = [];

  //legend header/title
  div.innerHTML = "Homeless %";

  limits.forEach(function(limit, index) {
    labels.push("<li style=\"background-color: " + colors[index] + "\">" + "     " + parseFloat(limits[index]).toFixed(2) + "%   -   " + parseFloat(limits[index + 1]).toFixed(2)+ "%      " + "</li>");
  });

  div.innerHTML += //"<ul>" + 
  labels.join("")
  //  + "</ul>";
  return div;
};

// Adding legend to the map
legend.addTo(myMap);