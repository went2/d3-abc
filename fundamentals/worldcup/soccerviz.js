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
  teamG.append("circle").attr("r", 18);
  teamG
    .append("text")
    .attr("y", 30)
    .text((d) => d.team);

  const dataKeys = Object.keys(dataset[0]).filter(
    (key) => typeof dataset[0][key] !== "string"
  );

  d3.select("#controls")
    .selectAll("button.teams")
    .data(dataKeys)
    .enter()
    .append("button")
    .html((d) => d)
    .on("click", buttonClick);
  function buttonClick(event, datum) {
    console.log(datum);
    const minAndMax = d3.extent(dataset, (d) => d[datum]);
    const radiusScale = d3.scaleLinear().domain(minAndMax).range([2, 20]);

    d3.selectAll("g.overallG")
      .select("circle")
      .attr("r", (d) => radiusScale(d[datum]));
  }
}
