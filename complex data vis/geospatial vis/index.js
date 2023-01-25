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
        .attr("class", "countries")
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

      const graticule = d3.geoGraticule();
      svg
        .insert("path", "path.countries")
        .datum(graticule)
        .attr("class", "graticule line")
        .attr("d", geoPath);
      svg
        .insert("path", "path.countries")
        .datum(graticule.outline)
        .attr("class", "graticlue outline")
        .attr("d", geoPath);

      // hover 显示国家的bounds box 和 中心点
      svg
        .selectAll("path.countries")
        .on("mouseover", centerBounds)
        .on("mouseout", clearCenterBounds);
      function centerBounds(event, d) {
        // console.log("mouseover", d);
        const bounds = geoPath.bounds(d);
        const center = geoPath.centroid(d);
        svg
          .append("rect")
          .attr("class", "bbox")
          .attr("x", bounds[0][0])
          .attr("y", bounds[0][1])
          .attr("width", bounds[1][0] - bounds[0][0])
          .attr("height", bounds[1][1] - bounds[0][1]);
        svg
          .append("circle")
          .attr("class", "centroid")
          .attr("r", 5)
          .attr("cx", center[0])
          .attr("cy", center[1]);
      }
      function clearCenterBounds() {
        d3.selectAll("circle.centroid").remove();
        d3.selectAll("rect.bbox").remove();
      }
    }
  });
}

createMap();
