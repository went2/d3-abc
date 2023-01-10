async function drawBoxplot() {
  let dataset = await d3.csv("./boxplots.csv");
  dataset = dataset.map((item) => {
    Object.keys(item).forEach((key) => {
      item[key] = Number(item[key]);
    });
    return item;
  });

  // 设定坐标轴上每根间隔线的长度
  const tickSize = 470;

  // scale
  const xScale = d3.scaleLinear().domain([1, 8]).range([20, tickSize]);
  const yScale = d3
    .scaleLinear()
    .domain([0, 100])
    .range([tickSize + 10, 20]);

  // axis
  drawAxis(xScale, yScale, tickSize);

  // draw circle
  drawCircle(dataset, xScale, yScale);
}

function drawAxis(xScale, yScale, tickSize = 470) {
  const yAxis = d3.axisRight().scale(yScale).ticks(8).tickSize(-tickSize);
  const xAxis = d3
    .axisBottom()
    .scale(xScale)
    .tickSize(-tickSize + 10)
    .tickValues([1, 2, 3, 4, 5, 6, 7]);
  d3.select("svg")
    .append("g")
    .attr("transform", `translate(${tickSize}, 0)`)
    .attr("id", "yAxisG")
    .call(yAxis);
  d3.select("svg")
    .append("g")
    .attr("transform", `translate(0, ${tickSize + 10})`)
    .attr("id", "xAxisG")
    .call(xAxis);
}

function drawCircle(dataset, xScale, yScale) {
  d3.select("svg")
    .selectAll("circle.median")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("class", "median")
    .attr("r", 5)
    .attr("cx", (d) => xScale(d.day))
    .attr("cy", (d) => yScale(d.median))
    .style("fill", "darkgrey");
}

drawBoxplot();
