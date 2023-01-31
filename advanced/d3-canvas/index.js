const sampleData = d3.range(1000).map((d) => {
  const datapoint = {
    id: "Sample Feature" + d,
    type: "Feature",
    properties: {},
    geometry: {
      type: "Polygon",
      coordinates: randomCoords(),
    },
  };

  return datapoint;
});

function randomCoords() {
  const randX = Math.random() * 350 - 175;
  const randY = Math.random() * 170 - 85;
  return [
    [
      [randX - 5, randY],
      [randX, randY - 5],
      [randX - 10, randY - 5],
      [randX - 5, randY],
    ],
  ];
}

d3.json("../../data/world.geojson").then((data) => {
  const projection = d3.geoMercator().scale(100).translate([250, 250]);
  const geoPath = d3.geoPath().projection(projection);
  const svgPath = d3.geoPath().projection(projection);

  d3.select("svg")
    .selectAll("path.sample")
    .data(sampleData)
    .enter()
    .append("path")
    .attr("d", svgPath)
    .attr("class", "sample")
    .on("mouseover", function () {
      d3.select(this).style("fill", "#75739F");
    });

  var mapZoom = d3.zoom().on("zoom", zoomed);
  var zoomSettings = d3.zoomIdentity.translate(250, 250).scale(100);

  d3.select("svg").call(mapZoom).call(mapZoom.transform, zoomSettings);
  function zoomed(e, d) {
    projection.translate([e.transform.x, e.transform.y]).scale(e.transform.k);

    const featureOpacity = 0.5;
    const ctx = d3.select("canvas").node().getContext("2d");
    console.log("清除canvas");
    ctx.clearRect(0, 0, 500, 500);
    geoPath.context(ctx);
    ctx.strokeStyle = `rgba(79,68,43,${featureOpacity})`;
    ctx.fillStyle = `rgba(196,185,172,${featureOpacity})`;
    // ctx.fillOpacity = 0.5;
    ctx.lineWidth = "1px";

    // Draws each country feature to canvas
    data.features.forEach((feature) => {
      ctx.beginPath();
      geoPath(feature);
      ctx.stroke();
      ctx.fill();
    });

    d3.selectAll("path.sample").attr("d", svgPath);

    ctx.strokeStyle = "#41A368";
    ctx.fillStyle = "rgba(0,191,255,.5)";
    ctx.lineWidth = "1px";

    // Draws each triangle to canvas
    for (var x in sampleData) {
      ctx.beginPath();
      geoPath(sampleData[x]);
      ctx.stroke();
      ctx.fill();
    }

    // d3.selectAll("path.country, path.sample").attr("d", geoPath);
  }

  const g = d3.select("svg").append("g");
  g.selectAll("path.country")
    .data(data.features)
    .enter()
    .append("path")
    .attr("d", geoPath)
    .attr("class", "country");

  g.selectAll("path.sample")
    .data(sampleData)
    .enter()
    .append("path")
    .attr("d", geoPath)
    .attr("class", "sample");
});
