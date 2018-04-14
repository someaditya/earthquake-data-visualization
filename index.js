
var map2 = L.map('heatmap-canvas').setView([21.3891,39.8579],2);
mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';

L.tileLayer(
  'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; ' + mapLink + ' Contributors',
    maxZoom: 23,
  }).addTo(map2);



realtimeview()
heatmap()



function heatmap()
{
geoJson2heat = function(geojson) {
return geojson.features.map(function(feature) {
return [parseFloat(feature.geometry.coordinates[1]), parseFloat(feature.geometry.coordinates[0])];
});
}

function addObsToMap(obs, map) {
var geoData = geoJson2heat(obs, 1);
var heatMap = L.heatLayer(geoData,{radius: 50, blur: 25, maxZoom: 17}).addTo(map);
}

$.getJSON("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson", function(obs) { addObsToMap(obs, map2); });
}



function realtimeview()
{
// Setup the svg element size and margins
var margin = {top: 20, right: 20, bottom: 20, left: 20},
    width = 1450 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

// Set the projection methods for the world map
var projection = d3.geoMercator()
                   .translate([width/2, height/1.5])
                   .scale((width - 1) / 2 / Math.PI);

// Set the world map path
var path = d3.geoPath()
    .projection(projection);

// Create a variable to hold the main svg element
var svg = d3.select("svg")
    .attr("width", width)
    .attr("height", height);

// Group to hold the maps and borders
var g = svg.append('g')
           .attr('id', 'world-map');

// Add a clip path element to the world map group
// for the x axis 
g.append('clipPath')
 .attr('id', 'clip-path')
 .append('rect')
 .attr('x', 0)
 .attr('y', 30)
 .attr('width', width)
 .attr('height', height - 30)

// Group to hold all of the earthquake elements
var gQuakes = svg.append('g')
                 .attr('id', 'all-quakes');

// Import the geoJSON file for the world map
d3.json('https://unpkg.com/world-atlas@1/world/110m.json', function(error, world) {
  if(error) throw error;
  
  // Setup 24 hours ago object
  var dateObj = new Date();
  dateObj.setDate(dateObj.getDate() - 1);
  
  // Append the World Map
  var worldMap = g.append('path')
   .attr('clip-path', 'url(#clip-path)') // attaches the clip path to not draw the map underneath the x axis
   .datum(topojson.merge(world, world.objects.countries.geometries)) // draws a single land object for the entire map
   .attr('class', 'land')
   .attr('d', path)
  
  // Append the World Map Country Borders
  g.append('path')
   .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
   .attr('class', 'boundry')
   .attr('d', path);
  
  // Create the x scale based on the domain of the 24 hour ago object and now
  var x = d3.scaleTime()
            .domain([dateObj, new Date()])
            .range([0, width - margin.right - margin.left]);

  // Append the xAxis on top
  var xAxis = svg.append('g')
                 .attr('id', 'xAxis')
                 .attr('transform', 'translate(20, 20)')
                 .call(d3.axisTop(x));
  
  // Import the last 24 hours of earthquake data from USGS
  d3.json('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson', function(error, data) {
    if(error) throw error;
    var quake = data.features.reverse();
    
    // Create a group with the quake id to hold the quake circle and pulse circle
    var earthquakeGroups = gQuakes.selectAll('g')
       .data(quake)
       .enter().append('g')
       .attr('id', function(d) {
           return d.id;
       })
       .attr('class', 'quake-group');
    
    //Create the pulse-circle circles for the earthquake pulse
    gQuakes.selectAll('.quake-group')
       .append('circle')
       .attr('class', 'circle pulse-circle')
       .attr('cx', function(d) {
           return projection([d.geometry.coordinates[0], d.geometry.coordinates[1]])[0];
       })
       .attr('cy', function(d) {
           return projection([d.geometry.coordinates[0], d.geometry.coordinates[1]])[1];
       })
       .attr('r', function(d) {
           return 0;
       })
       .attr('fill', 'orange');
    
    // Create the main quake circle with title
    
    gQuakes.selectAll('.quake-group')
      .append('circle')
      .attr('cx', function(d) {
           return projection([d.geometry.coordinates[0], d.geometry.coordinates[1]])[0];
       })
      .attr('cy', function(d) {
           return projection([d.geometry.coordinates[0], d.geometry.coordinates[1]])[1];
       })
      .attr('r', 0 )
      .attr('class', 'circle quake-circle')
      .style('fill', function(d) {
         if(d.properties.mag >= 5) {
           return 'red';
         } 
         else if (d.properties.mag < 5 && d.properties.mag >=2) {
           return '#F75B0D';         
         }
         else
         {
          return 'orange'; 
         }

       })
      .style('opacity', 0.9)
      .append('title')
      .text(function(d) {
        return 'Magnitude ' + d.properties.mag + ' * ' + d.properties.place+' * '+new Date(d.properties.time);
      });


    
    // Function that calculates the difference between the earthquake and 24 hours ago and
    // creates a delay property.
    var setQuakeDelay = function() {
      for(var i = 0, max = quake.length; i < max; i++){
        var timeDiff = quake[i].properties.time - dateObj;
        var timeDiffObj = new Date(timeDiff);
        quake[i].delay = Date.parse(timeDiffObj) / 5000; // Speed up the animation, otherwise it would take 24 hours ><
      }
    }
    setQuakeDelay();
    
    // Grab the longest delay for the xAxis marker
    var longestDelay = quake[quake.length - 1].delay;
    
    // Changes the radius of the earthquakes to their magnitue using a transition
    // and the delay created from the setQuakeDelay function
    var quakeCircles = svg.selectAll('.quake-circle')
       .data(quake)
       .transition()
       .delay(function(d) {
         return d.delay;
       })
       .duration(1000)
       .attr('r', function(d) {
         if(d.properties.mag < 0) {
           return 0.1;
         } else {
           return d.properties.mag         
         }
       });
    
    // Changes the radius of the pulse circle to eight times the magnitude
    // and fades out as it expands over two seconds
    var pulseCircles = svg.selectAll('.pulse-circle')
       .data(quake)
       .transition()
       .delay(function(d) {
         return d.delay;
       })
       .duration(5000)
       .attr('r', function(d) {
         if(d.properties.mag < 0) {
           return 0.1 * 10;
         } else {
           return d.properties.mag * 10;
         }
       })
       .style('opacity', 0)
       .remove()
    
    // Add the time marker that moves across the xAxis while the animation it playing.
    // It's not perfectly in sync, but it's close enough for this example. The length of 
    // the animation is equal to the longest delay that we calculated earlier.

  
    var timeline = xAxis.append('circle')
         .attr('class', 'transition-circle')
         .attr('cx', 0)
         .attr('cy', 0)
         .attr('r', 3)
         .style('fill', 'green')
         .transition()
         .ease(d3.easeLinear)
         .duration(longestDelay + 1000)
         .attr('cx', 1120)
   
  })
})



}