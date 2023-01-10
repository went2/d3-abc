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

  // 绘制箱须图
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
  d3.select("#xAxisG > path.domain").style("display", "none");
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
      // 开始绘制箱须图
      // this 指向 <g> element，此时<g>已经在目标位置
      d3.select(this)
        .append("line")
        .attr("class", "range")
        .attr("x1", 0)
        .attr("x2", 0)
        .attr("y1", (d) => yScale(d.max) - yScale(d.median))
        .attr("y2", (d) => yScale(d.min) - yScale(d.median))
        .style("stroke", "black")
        .style("stroke-width", "4px");

      // 最大端点
      d3.select(this)
        .append("line")
        .attr("class", "max")
        .attr("x1", -10)
        .attr("x2", 10)
        .attr("y1", (d) => yScale(d.max) - yScale(d.median))
        .attr("y2", (d) => yScale(d.max) - yScale(d.median))
        .style("stroke", "black")
        .style("stroke-width", "4px");

      // 最小端点
      d3.select(this)
        .append("line")
        .attr("class", "min")
        .attr("x1", -10)
        .attr("x2", 10)
        .attr("y1", (d) => yScale(d.min) - yScale(d.median))
        .attr("y2", (d) => yScale(d.min) - yScale(d.median))
        .style("stroke", "black")
        .style("stroke-width", "4px");

      d3.select(this)
        .append("rect")
        .attr("class", "range")
        .attr("width", 20)
        .attr("height", yScale(d.q1) - yScale(d.q3))
        .attr("x", -10)
        .attr("y", (d) => yScale(d.q3) - yScale(d.median))
        .attr("fill", "white")
        .style("stroke", "black")
        .style("stroke-width", "2px");

      // 中位线
      d3.select(this)
        .append("line")
        .attr("x1", -10)
        .attr("x2", 10)
        .attr("y1", 0)
        .attr("y2", 0)
        .style("stroke", "darkgrey")
        .style("stroke-width", "4px");
    });
}

drawBoxplotChart();
