async function drawBoxplotChart() {
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

  drawBoxplot(dataset, xScale, yScale);
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

function drawBoxplot(dataset, xScale, yScale) {
  d3.select("svg")
    .selectAll("g.box")
    .data(dataset)
    .enter()
    .append("g")
    .attr(
      "transform",
      (d) => `translate(${xScale(d.day)}, ${yScale(d.median)})`
    )
    .each(function (d, i) {
      // 使用 each 用于处理复杂的绘图
      // this 指向 <g> element
      d3.select(this)
        .append("rect")
        .attr("width", 20)
        .attr("height", yScale(d.q1) - yScale(d.q3))
        .style("fill", "white")
        .style("stroke", "black")

        .transition()
        .duration(1500)
        .attr("x", -10)
        .attr("y", yScale(d.q3) - yScale(d.median));
      // .attr("y", yScale(d.median) - yScale(d.q1));
    });
}

drawBoxplotChart();
