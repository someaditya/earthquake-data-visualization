# Earthquake Data Visualization

This independent project tries to visualize the earthquakes by utilizing the real time APIs provided by the United States Geological Survey. This project is created using Mike Bostock's JavaScript library for producing dynamic, interactive data visualizations in web browsers called D3. The project also makes use of Leaflet.js and Per Liedman's Leaflet Realtime.

## Requirements

- Leaflet (http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.js)
- Leaflet-Realtime (https://github.com/perliedman/leaflet-realtime)
- D3.js V4 (http://d3js.org/d3.v4.min.js)
- World Atlas TopoJSON (https://www.npmjs.com/package/world-atlas)
- TopoJSON (https://unpkg.com/topojson-client@3)
 

## United States Geological Survey Real Time API 
![GTD Logo](/image/usgs.png)

The United States Geological Survey is a scientific agency of the United States government. The scientists of the USGS study the landscape of the United States, its natural resources, and the natural hazards that threaten it.Earthquake Hazards Program. https://earthquake.usgs.gov/earthquakes/. shares nformation on earthquake activity, earthquake science, and earthquake hazard reduction with links to news reports, products and services, educational resources for teachers, glossary, and current U.S. earthquake activity map.

Here are the list of real time APIs used for this project :-

1.Past One Hour - https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson  
2.Past One Day - https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson  
3.Past One Week - https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson  
4.Past One Month - https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson  

## Real Time Animation
This part of the project makes use of several APIs to create an animation of earthquakes.For the maps this makes use of World Atlas TopoJSON (https://github.com/topojson/world-atlas) , which generates TopoJSON files from Natural Earth’s vector data.A TopoJSON topology containing two geometry collections: countries and land, in this project only world.objects.countries is used.Within the callback of the d3.json for the world map,a d3.json call was used to the USGS API for all of the earthquakes in the last 24 hours.The earthquakes are represented using circles which are appended using geometry data and animated using their magnitude.Each quakeis assigned a new property of delay that is a number of seconds from the starting point that the earthquake happened.

This work is inspired from Anthony Skelton's D3.js Earthquake Visualizations (https://anthonyskelton.com/2016/d3-js-earthquake-visualizations/).

![GTD Logo](/image/edv3.png)

## Real Time Marker Updates
This part makes use of Per Liedman's Leaflet Realtime (https://github.com/perliedman/leaflet-realtime) which reads and displays GeoJSON from a provided source.This means Leaflet Realtime will poll for data, pulling it from the source. Here in this project the Leaflet Realtime is utilized to poll the USGS API every 60 seconds for data updates and updates the Open Street Map display accordingly.
![GTD Logo](/image/edv1.png)

## Heat Maps Based on Periodic Data
Heatmaps are an excellent visualization tool. So in this project the Leaflet.js and its corresponding Heatmap Library(https://github.com/Leaflet/Leaflet.heat) were used over Open Street Maps to achieve the desired results.It uses simpleheat under the hood, additionally clustering points into a grid for performance. In this project, based on the user input the heatmaps change. The Heatmaps makes use of the geographical data and magnitude( factored 5 times for impact). 
![GTD Logo](/image/edv2.png)
