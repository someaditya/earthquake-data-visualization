//Data Visualization of Terrorism in India using D3

map = L.map('heatmap-canvas').setView([21.3891,39.8579],2);
mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';

L.tileLayer(
  'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; ' + mapLink + ' Contributors',
    maxZoom: 23,
  }).addTo(map);

var heat = L.heatLayer(0,{
      radius: 15,
      blur: 15, 
      maxZoom: 10,
    }).addTo(map);


var map1 = L.map('map'),
      realtime = L.realtime({
        url: 'https://wanderdrone.appspot.com/',
        crossOrigin: true,
        type: 'json'
    }, {
        interval: 3 * 1000
    }).addTo(map1);

L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map1);

realtime.on('update', function() {
    map1.fitBounds(realtime.getBounds(), {maxZoom: 3});
});


showHeatmap(1977,2016)
bargraph(1977,2016);
linechart()
chorddiagram()
sankeydiagram()



function showHeatmap(low,high)
{

var array = [];
map.removeLayer(heat);
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson", function(data) {

console.log(data[0])


for(var i = 0; i < data.length; i++) {
  if (data[i].iyear>=low && data[i].iyear<=high) 
   {
  
    array.push([parseFloat(data[i].latitude),parseFloat(data[i].longitude),parseFloat(data[i].nkill)*0.3]);
  
   }
}

  //console.log(array)
  heat = L.heatLayer(array,{
      radius: 15,
      blur: 18, 
      maxZoom: 10,
    }).addTo(map);

});
  



}


function showBars()
{

  if (document.getElementById("myList").value == "yr1") {
      //svg.remove();
      bargraph(1977,1979)
      showHeatmap(1977,1979)
  }
  else if (document.getElementById("myList").value == "yr2") {
      //svg.remove();
     
      bargraph(1980,1989)
      showHeatmap(1980,1989)
  }
  else if (document.getElementById("myList").value == "yr3") {

      bargraph(1990,1998)
      showHeatmap(1990,1998)
  }
  else if (document.getElementById("myList").value == "yr4") {

      bargraph(1999,2003)
      showHeatmap(1999,2003)
  }
  else if (document.getElementById("myList").value == "yr5") {
     
      bargraph(2004,2014)
      showHeatmap(2004,2014)
  }
  else
  {
    bargraph(2014,2016)
    showHeatmap(2014,2016)
  }
}




function bargraph(low,high)
{

var svg1 = d3.select("svg"),
    margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = +svg1.attr("width") - margin.left - margin.right,
    height = +svg1.attr("height") - margin.top - margin.bottom

svg1.selectAll("*").remove();

var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
    y = d3.scaleLinear().rangeRound([height, 0]);

var g = svg1.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("http://localhost/datafinal.csv", function(d) {
 
 if (d.iyear>=low && d.iyear<=high) {
    //d.nkill = +d.nkill;
    return d;
  }
  
}, function(error, data) {
  if (error) throw error;

  x.domain(data.map(function(d) { return d.iyear; }));
  y.domain([0, d3.max(data, function(d) { return d.nkill+d.nwound; })]);

  g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y).ticks())
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Frequency");

  g.selectAll(".bar")
    .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.iyear); })
      .attr("y", function(d) { return y(d.nkill); })
      .attr("width", x.bandwidth())
      .attr("height", function(d) { return height - y(d.nkill); });
});

}


function chorddiagram()
{

  var data = [['Lashkar-E-Toiba','Police',124]
,['Lashkar-E-Toiba','Military',45]
,['Lashkar-E-Toiba','Government',4]
,['Lashkar-E-Toiba','Educational Institute',3]
,['Lashkar-E-Toiba','Unknowns',4]
,['Lashkar-E-Toiba','Non-State',7]
,['Communist Party Of India (Maoists)','Police',310]
,['Communist Party Of India (Maoists)','Private Citizens',42]
,['Communist Party Of India (Maoists)','Transportation',5]
,['Communist Party Of India (Maoists)','Government',20]
,['Communist Party Of India (Maoists)','Business',2]
,['Sikh Extremists','Religious Figures',5]
,['Sikh Extremists','Police',220]
,['Sikh Extremists','Military',124]
,['Sikh Extremists','Transportation',4]
,['Sikh Extremists','Unknowns',35]
,['Sikh Extremists','Business',7]
,['United Liberation Front of Assam (ULFA)','Police',93]
,['United Liberation Front of Assam (ULFA)','Military',11]
,['United Liberation Front of Assam (ULFA)','Government',8]
,['United Liberation Front of Assam (ULFA)','Non-State',22]
,['United Liberation Front of Assam (ULFA)','Business',0]
,['Peoples War Group','Police',29]
,['Peoples War Group','Military',19]
,['Peoples War Group','Private Citizens',3]
,['Peoples War Group','Unknowns',27]
,['Peoples War Group','Non-State',10]
,['National Democratic Front of Bodoland','Police',20]
,['National Democratic Front of Bodoland','Military',4]
,['National Democratic Front of Bodoland','Business',2]
,['National Democratic Front of Bodoland','Government',3]
,['National Democratic Front of Bodoland','Transportation',12]
,['Hizbul Mujahiddin','Police',27]
,['Hizbul Mujahiddin','Military',12]
,['Hizbul Mujahiddin','Government',3]
,['Hizbul Mujahiddin','Private Citizens',4]
,['Hizbul Mujahiddin','Unknowns',16]
,['Maoists','Police',78]
,['Maoists','Military',3]
,['Maoists','Business',2]
,['Maoists','Private Citizens',29]
,['Maoists','Government',8]
,['Garo National Liberation Army','Police',49]
,['Garo National Liberation Army','Military',17]
,['Garo National Liberation Army','Private Citizens',11]
,['Garo National Liberation Army','Educational Institute',1]
,['Garo National Liberation Army','Non-State',31]
,['National Socialist Council of Nagaland','Police',32]
,['National Socialist Council of Nagaland','Military',15]
,['National Socialist Council of Nagaland','Transportation',6]
,['National Socialist Council of Nagaland','Business',2]
,['National Socialist Council of Nagaland','Government',3]
,['Police','Lashkar-E-Toiba',51]
,['Police','Sikh Extremists',211]
,['Police','United Liberation Front of Assam (ULFA)',23]
,['Police','Peoples War Group',2]
,['Police','National Democratic Front of Bodoland',2]
,['Police','Hizbul Mujahiddin',2]
,['Police','Maoists',131]
,['Police','Garo National Liberation Army',43]
,['Police','National Socialist Council of Nagaland',22]
,['Police','Communist Party Of India (Maoists)',320]
,['Military','Lashkar-E-Toiba',471]
,['Military','Sikh Extremists',310]
,['Military','United Liberation Front of Assam (ULFA)',45]
,['Military','Peoples War Group',22]
,['Military','National Democratic Front of Bodoland',32]
,['Military','Hizbul Mujahiddin',51]
,['Military','Maoists',2]
,['Military','Garo National Liberation Army',17]
,['Military','National Socialist Council of Nagaland',3]
,['Military','Communist Party Of India (Maoists)',4]
,['Private Citizens','Communist Party Of India (Maoists)',0]
];

var colors = {
"Lashkar-E-Toiba":         "#da4480"
,"Communist Party Of India (Maoists)":    "#5ab449"
,"Sikh Extremists":    "#7f5acd"
,"United Liberation Front of Assam (ULFA)":        "#aab740"
,"Peoples War Group": "#ce58c0"
,"National Democratic Front of Bodoland":        "#50a26e"
,"Hizbul Mujahiddin": "#d1434b"
,"Maoists":      "#45c0bc"
,"Garo National Liberation Army":"#ce5929"
,"National Socialist Council of Nagaland": "#4e7bda"
,"Police":  "#d49d3c"
,"Private Citizens":   "#6660a3"
,"Transportation":    "#7b853c"
,"Military":     "#b58dde"
,"Government":     "#97622e"
,"Religious Figures":   "#609dd6"
,"Business":      "#e29074"
,"Educational Institute":        "#9c4b88"
,"Non-State":  "#ab505f"
,"Unknowns":   "#dc85b6"
};

var sortOrder =[
"Lashkar-E-Toiba"
,"Communist Party Of India (Maoists)"
,"Sikh Extremists"
,"United Liberation Front of Assam (ULFA)"
,"Peoples War Group"
,"National Democratic Front of Bodoland"
,"Hizbul Mujahiddin"
,"Maoists"
,"Garo National Liberation Army"
,"National Socialist Council of Nagaland"
,"Police"
,"Military"
,"Private Citizens",
,"Transportation"
,"Government"
,"Religious Figures"
,"Business"
,"Educational Institute"
,"Non-State"
,"Unknowns"
];

function sort(a,b){ return d3.ascending(sortOrder.indexOf(a),sortOrder.indexOf(b)); }

var ch = viz.ch().data(data)
      .padding(.01)
      .sort(sort)
    .innerRadius(430)
    .outerRadius(450)
    .duration(1000)
    .chordOpacity(0.3)
    .labelPadding(.03)
      .fill(function(d){ return colors[d];});

var width=1200, height=1100;

var svg3 = d3.select("body").append("svg").attr("height",height).attr("width",width);

svg3.append("g").attr("transform", "translate(600,550)").call(ch);

// adjust height of frame in bl.ocks.org
d3.select(self.frameElement).style("height", height+"px").style("width", width+"px"); 
}


function linechart()
{


var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 1400 - margin.left - margin.right,
    height = 720 - margin.top - margin.bottom;

// parse the date / time
var parseTime = d3.timeParse("%d-%b-%y");

// set the ranges
var x = x = d3.scaleBand().rangeRound([0, width]).padding(0.1);
var y = d3.scaleLinear().range([height, 0]);

// define the line
var valueline = d3.line()
    .x(function(d) { return x(d.iyear); })
    .y(function(d) { return y(d.nkill); });

var valueline2 = d3.line()
    .x(function(d) { return x(d.iyear); })
    .y(function(d) { return y(d.nwound); });

// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg2 = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Get the data
d3.csv("http://localhost/datafinal.csv", function(error, data) {
  if (error) throw error;
  

  // format the data
  data.forEach(function(d) {
      //d.iyear = parseInt(d.iyear);
      d.nkill = +parseInt(d.nkill);
      d.nwound = +parseInt(d.nwound);
      //console.log(d.nkill)
  });
  

  // Scale the range of the data
  x.domain(data.map(function(d) { return d.iyear; }));
  y.domain([0, d3.max(data, function(d) { return d.nkill; })]);

  // Add the valueline path.
  svg2.append("path")
      .data([data])
      .attr("class", "line")
      .attr("d", valueline);

  svg2.append("path")
      .data([data])
      .style("stroke", "red")
      .attr("class", "line")
      .attr("d", valueline2);

  // Add the X Axis
  svg2.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // Add the Y Axis
  svg2.append("g")
      .call(d3.axisLeft(y));

  svg2.append("text")
    .attr("transform", "translate(" + (width+3) + "," + y(data[0].nkill) + ")")
    .attr("dy", ".35em")
    .attr("text-anchor", "start")
    .style("fill", "red")
    .text("Killed");

  svg2.append("text")
    .attr("transform", "translate(" + (width+3) + "," + y(data[0].nwound) + ")")
    .attr("dy", ".35em")
    .attr("text-anchor", "start")
    .style("fill", "steelblue")
    .text("Wounded");

});

}


function sankeydiagram()
{
var units = "Widgets";

// set the dimensions and margins of the graph
var margin = {top: 10, right: 10, bottom: 10, left: 10},
    width = 700 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

// format variables
var formatNumber = d3.format(",.0f"),    // zero decimal places
    format = function(d) { return formatNumber(d) + " " + units; },
    color = d3.scaleOrdinal(d3.schemeCategory20);

// append the svg object to the body of the page
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");

// Set the sankey diagram properties
var sankey = d3.sankey()
    .nodeWidth(36)
    .nodePadding(40)
    .size([width, height]);

var path = sankey.link();

// load the data
d3.csv("http://localhost/datafinal.csv", function(error, data) {
 
  //set up graph in same style as original example but empty
  graph = {"nodes" : [], "links" : []};

  data.forEach(function (d) {
    graph.nodes.push({ "name": d.source });
    graph.nodes.push({ "name": d.target });
    graph.links.push({ "source": d.source,
                       "target": d.target,
                       "value": +d.value });
   });

  // return only the distinct / unique nodes
  graph.nodes = d3.keys(d3.nest()
    .key(function (d) { return d.name; })
    .object(graph.nodes));

  // loop through each link replacing the text with its index from node
  graph.links.forEach(function (d, i) {
    graph.links[i].source = graph.nodes.indexOf(graph.links[i].source);
    graph.links[i].target = graph.nodes.indexOf(graph.links[i].target);
  });

  // now loop through each nodes to make nodes an array of objects
  // rather than an array of strings
  graph.nodes.forEach(function (d, i) {
    graph.nodes[i] = { "name": d };
  });

  sankey
      .nodes(graph.nodes)
      .links(graph.links)
      .layout(32);

  // add in the links
  var link = svg.append("g").selectAll(".link")
      .data(graph.links)
    .enter().append("path")
      .attr("class", "link")
      .attr("d", path)
      .style("stroke-width", function(d) { return Math.max(1, d.dy); })
      .sort(function(a, b) { return b.dy - a.dy; });

  // add the link titles
  link.append("title")
        .text(function(d) {
        return d.source.name + " → " + 
                d.target.name + "\n" + format(d.value); });

  // add in the nodes
  var node = svg.append("g").selectAll(".node")
      .data(graph.nodes)
    .enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { 
      return "translate(" + d.x + "," + d.y + ")"; })
      .call(d3.drag()
        .subject(function(d) {
          return d;
        })
        .on("start", function() {
          this.parentNode.appendChild(this);
        })
        .on("drag", dragmove));

  // add the rectangles for the nodes
  node.append("rect")
      .attr("height", function(d) { return d.dy; })
      .attr("width", sankey.nodeWidth())
      .style("fill", function(d) { 
      return d.color = color(d.name.replace(/ .*/, "")); })
      .style("stroke", function(d) { 
      return d3.rgb(d.color).darker(2); })
    .append("title")
      .text(function(d) { 
      return d.name + "\n" + format(d.value); });

  // add in the title for the nodes
  node.append("text")
      .attr("x", -6)
      .attr("y", function(d) { return d.dy / 2; })
      .attr("dy", ".35em")
      .attr("text-anchor", "end")
      .attr("transform", null)
      .text(function(d) { return d.name; })
    .filter(function(d) { return d.x < width / 2; })
      .attr("x", 6 + sankey.nodeWidth())
      .attr("text-anchor", "start");

  // the function for moving the nodes
  function dragmove(d) {
    d3.select(this)
      .attr("transform", 
            "translate(" 
               + d.x + "," 
               + (d.y = Math.max(
                  0, Math.min(height - d.dy, d3.event.y))
                 ) + ")");
    sankey.relayout();
    link.attr("d", path);
  }
});


}
