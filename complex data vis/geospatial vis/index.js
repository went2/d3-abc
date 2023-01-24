// import { geoMollweide } from "https://cdn.skypack.dev/d3-geo-projection@4";

function createMap() {
  Promise.all([
    d3.json("../../data/world.geojson"),
    d3.csv("../../data/cityies.csv"),
  ]).then(([countries, cities]) => {
    const svg = d3.select("svg");

    // drawMercator();
    drawMollweide();
    function drawMercator() {
      const mercatorProj = d3.geoMercator().scale(90).translate([300, 300]);
      const geoPath = d3.geoPath().projection(mercatorProj);

      svg
        .selectAll("path")
        .data(countries.features)
        .join("path")
        .attr("d", geoPath)
        .attr("class", "countries");
      svg
        .selectAll("circle")
        .data(cities)
        .join("circle")
        .attr("class", "cities")
        .attr("r", 3)
        .attr("cx", (d) => mercatorProj([d.x, d.y])[0])
        .attr("cy", (d) => mercatorProj([d.x, d.y])[1]);
    }
    function drawMollweide() {
      const projection = d3.geoMollweide().scale(110).translate([300, 300]);
      const geoPath = d3.geoPath().projection(projection);
      const featureSize = d3.extent(countries.features, (d) => geoPath.area(d));
      const countryColor = d3
        .scaleQuantize()
        .domain(featureSize)
        .range(colorbrewer.Reds[7]);
      svg
        .selectAll("path")
        .data(countries.features)
        .join("path")
        .attr("class", countries)
        .attr("d", geoPath)
        .style("fill", (d) => countryColor(geoPath.area(d)))
        .style("stroke", (d) => d3.rgb(countryColor(geoPath.area(d))).darker());
      svg
        .selectAll("circle")
        .data(cities)
        .join("circle")
        .attr("class", "cities")
        .attr("r", 3)
        .attr("cx", (d) => projection([d.x, d.y])[0])
        .attr("cy", (d) => projection([d.x, d.y])[1]);
    }
  });
}

createMap();
