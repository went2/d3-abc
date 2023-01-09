async function createSoccerViz() {
  const originData = await d3.csv("worldcup.csv");
  // cast string to number type
  const dataset = originData.map((item) => {
    Object.keys(item).forEach((key) => {
      if (key !== "region" && key !== "team") {
        item[key] = +item[key];
      }
    });
    return item;
  });
  console.log(dataset);

  const bounds = d3
    .select("svg")
    .append("g")
    .attr("id", "teamsG")
    .attr("transform", `translate(50, 300)`);

  const teamG = bounds
    .selectAll("g")
    .data(dataset)
    .enter()
    .append("g")
    .attr("class", "overallG")
    .attr("transform", (d, i) => `translate(${i * 50}, 0)`);
  teamG
    .append("circle")
    .attr("r", 0)
    .transition()
    .delay((d, i) => i * 100)
    .duration(500)
    .attr("r", 35)
    .transition()
    .duration(500)
    .attr("r", 18);
  teamG
    .append("text")
    .attr("y", 30)
    .text((d) => d.team);

  const dataKeys = Object.keys(dataset[0]).filter(
    (key) => typeof dataset[0][key] !== "string"
  );

  // interactive
  const circles = d3.selectAll("g.overallG").select("circle");
  d3.select("#controls")
    .selectAll("button.teams")
    .data(dataKeys)
    .enter()
    .append("button")
    .html((d) => d)
    .on("click", buttonClick);
  function buttonClick(event, datum) {
    const minAndMax = d3.extent(dataset, (d) => d[datum]);
    const radiusScale = d3.scaleLinear().domain(minAndMax).range([2, 20]);

    const colorQuantize = d3
      .scaleQuantize()
      .domain(minAndMax)
      .range(colorbrewer.Reds[3]);

    d3.selectAll("g.overallG")
      .select("circle")
      .transition()
      .delay(250)
      .duration(600)
      .attr("r", (d) => radiusScale(d[datum]))
      .style("fill", (d) => colorQuantize(d[datum]));
  }

  teamG.on("mouseover", function (event, datum) {
    d3.select(this).select("text").classed("active", true).attr("y", 10);

    circles.each(function (d) {
      d.region === datum.region
        ? d3.select(this).classed("active", true)
        : d3.select(this).classed("inactive", true);
    });
    this.parentElement.appendChild(this);
  });
  teamG.on("mouseout", function (event, datum) {
    d3.selectAll("g.overallG").select("circle").attr("class", "");
    d3.selectAll("g.overallG")
      .select("text")
      .classed("active", false)
      .attr("y", 30);
  });
  teamG.select("text").style("pointer-events", "none");

  // external resources: html
  d3.text("./infobox.html").then((html) => {
    d3.select("body").append("div").attr("id", "infobox").html(html);
  });

  teamG.on("click", function (e, d) {
    const values = Object.values(d);
    d3.selectAll("td.data")
      .data(values)
      .html((p) => p);
  });

  // external resources: svg
  d3.html("./icon.svg").then((svgData) => {
    d3.selectAll("g").each(function () {
      const gParent = this;
      d3.select(svgData)
        .selectAll("path")
        .each(function () {
          gParent.appendChild(this.cloneNode(true));
        });
    });

    // binding data
    d3.selectAll("g.overallG").each(function (d) {
      d3.select(this).selectAll("path").datum(d);
    });
    const fourColorScale = d3
      .scaleOrdinal()
      .domain(["UEFA", "CONMEBOL", "CONCACAF", "AFC"])
      .range(["#5eafc6", "#FE9922", "#93C464", "#fcbc34"]);

    d3.selectAll("path")
      .style("fill", (d) => {
        if (d) {
          return fourColorScale(d.region);
        }
      })
      .style("stroke", "black")
      .style("stroke-width", "1px");
  });
}
