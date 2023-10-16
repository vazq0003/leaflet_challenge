let quakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"

//GET request
d3.json(quakeURL).then(function(data){
    console.log(data);
    features(data.features);
});

function features(quakeData) {
    //Function to create place and time popup
    function onEachFeature(features, layer) {
      layer.bindPopup(`<h3>${features.properties.place}</h3><hr><p>${new Date(features.properties.time)}</p>`);
    }
  
    //Create earthquake markers
    let earthquakes = L.geoJSON(quakeData, {
      onEachFeature: onEachFeature,
      pointToLayer: function (features, coordinates) {
        let depth = features.geometry.coordinates[2];
        let quakeMarkers = {
          radius: features.properties.mag * 5,
          fillColor: colors(depth),
          fillOpacity: 0.8,
          weight: 0.5,
        };
        return L.circleMarker(coordinates, quakeMarkers);
      }
    });
  
    createMap(earthquakes);
  }
  
  //Function to determine marker color
  function colors(depth) {
    if (depth <= 10) return "green";
    else if (depth <= 30) return "blue";
    else if (depth <= 50) return "yellow";
    else if (depth <= 100) return "orange";
    else if (depth <= 200) return "red";
    else return "purple";
  }
  
  //Function to create map 
  function createMap(earthquakes) {
    let tile = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
  
    let myMap = L.map("map", {
      center: [46.73, -94.69], 
      zoom: 3,
      layers: [tile, earthquakes]
    });
  
    //Add the earthquake layer
    earthquakes.addTo(myMap);
  }