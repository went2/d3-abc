async function drawLineChart() {
  let dataset = await d3.csv("./tweetData.csv");
  dataset = dataset.map((item) => {
    Object.keys(item).forEach((key) => {
      item[key] = Number(item[key]);
    });
    return item;
  });

  const blue = "#5eaec5",
    green = "#92c463",
    orange = "#fe9a22";

  // scales
  const xScale = d3.scaleLinear().domain([1, 10.5]).range([20, 480]);
  const yScale = d3.scaleLinear().domain([0, 35]).range([480, 20]);

  drawAxis(xScale, yScale);
  drawCircles(xScale, yScale, dataset);
  drawLines(xScale, yScale, dataset);
}

function drawAxis(xScale, yScale) {
  const xAxis = d3
    .axisBottom()
    .scale(xScale)
    .tickSize(480)
    .tickValues([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

  const yAxis = d3.axisRight().scale(yScale).tickSize(480).ticks(10);

  d3.select("svg").append("g").attr("id", "xAxisG").call(xAxis);
  d3.select("svg").append("g").attr("id", "yAxisG").call(yAxis);
  // remove domain border
  d3.select("#xAxisG > path.domain").style("display", "none");
  d3.select("#yAxisG > path.domain").style("display", "none");
}

function drawCircles(xScale, yScale, dataset) {
  const dayAssessor = (d) => d.day;
  d3.select("svg")
    .append("g")
    .selectAll("circle.tweets")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("r", 5)
    .attr("cx", (d) => xScale(dayAssessor(d)))
    .attr("cy", (d) => yScale(d.tweets))
    .style("fill", "#5eaec5");

  d3.select("svg")
    .append("g")
    .selectAll("circle.retweets")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("r", 5)
    .attr("cx", (d) => xScale(dayAssessor(d)))
    .attr("cy", (d) => yScale(d.retweets))
    .style("fill", "#92c463");

  d3.select("svg")
    .append("g")
    .selectAll("circle.favorites")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("r", 5)
    .attr("cx", (d) => xScale(dayAssessor(d)))
    .attr("cy", (d) => yScale(d.favorites))
    .style("fill", "#fe9a22");
}

function drawLines(xScale, yScale, dataset) {
  const tweetsLine = d3
    .line()
    .x((d) => xScale(d.day))
    .y((d) => yScale(d.tweets));
  tweetsLine.curve(d3.curveCardinal);

  const retweetsLine = d3
    .line()
    .x((d) => xScale(d.day))
    .y((d) => yScale(d.retweets));

  retweetsLine.curve(d3.curveStep);

  const favoritesLine = d3
    .line()
    .x((d) => xScale(d.day))
    .y((d) => yScale(d.favorites));

  favoritesLine.curve(d3.curveCardinal);

  d3.select("svg")
    .append("path")
    .attr("d", tweetsLine(dataset))
    .attr("fill", "none")
    .attr("stroke", "#5eaec5")
    .attr("stroke-width", 2);

  d3.select("svg")
    .append("path")
    .attr("d", retweetsLine(dataset))
    .attr("fill", "none")
    .attr("stroke", "#92c463")
    .attr("stroke-width", 2);

  d3.select("svg")
    .append("path")
    .attr("d", favoritesLine(dataset))
    .attr("fill", "none")
    .attr("stroke", "#fe9a22")
    .attr("stroke-width", 2);
}

drawLineChart();
