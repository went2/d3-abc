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

      // 添加标线
      const graticule = d3.geoGraticule();
      svg
        .insert("path", "path.countries")
        .datum(graticule)
        .attr("class", "graticule line")
        .attr("d", geoPath);
      svg
        .insert("path", "path.countries")
        .datum(graticule.outline)
        .attr("class", "graticule outline")
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

      // 添加zoom
      const mapZoom = d3.zoom().on("zoom", zoomed);
      const zoomSettings = d3.zoomIdentity.translate(300, 300).scale(120);
      svg.call(mapZoom).call(mapZoom.transform, zoomSettings);
      function zoomed(evt) {
        // console.log("d3.event", evt);
        projection
          .translate([evt.transform.x, evt.transform.y])
          .scale(evt.transform.k);
        d3.selectAll("path.graticule").attr("d", geoPath);
        d3.selectAll("path.countries").attr("d", geoPath);
        d3.selectAll("circle.cities")
          .attr("cx", (d) => projection([d.x, d.y])[0])
          .attr("cy", (d) => projection([d.x, d.y])[1]);
      }

      // button event handler
      function zoomButton(zoomDirection) {
        const width = 600;
        const height = 600;
        const newScale = zoomDirection === "in" ? 1.5 : 0.75;

        const newZoom = projection.scale() * newScale;
        // 需要重新计算 center
        const newX =
          (projection.translate()[0] - width / 2) * newScale + width / 2;
        const newY =
          (projection.translate()[1] - height / 2) * newScale + height / 2;

        const newZoomSettings = d3.zoomIdentity
          .translate(newX, newY)
          .scale(newZoom);
        svg.transition().duration(500).call(mapZoom.transform, newZoomSettings);
      }
      // draw buttons
      d3.select("#controls")
        .append("button")
        .on("click", () => {
          zoomButton("in");
        })
        .html("Zoom in");
      d3.select("#controls")
        .append("button")
        .on("click", () => {
          zoomButton("out");
        })
        .html("Zoom out");
    }
  });
}

createMap();
