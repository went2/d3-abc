async function drawScatterPlot() {
  const dataset = await d3.json("./data/my_weather_data.json");

  const width = d3.min([window.innerWidth * 0.8, window.innerHeight * 0.8]);
  const dimensions = {
    width: width,
    height: width,
    margin: {
      top: 15,
      right: 15,
      bottom: 40,
      left: 60,
    },
  };
  dimensions.boundedWidth =
    dimensions.width - dimensions.margin.left - dimensions.margin.right;
  dimensions.boundedHeight =
    dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

  const xAccessor = (d) => (5 / 9) * (d.dewPoint - 32);
  const yAccessor = (d) => d.humidity;
  const colorAccessor = (d) => d.cloudCover;

  // draw canvas
  const wrapper = d3
    .select("#scatter")
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height);
  const bounds = wrapper
    .append("g")
    .style(
      "transform",
      `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`
    );

  // scales
  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(dataset, xAccessor))
    .range([0, dimensions.boundedWidth])
    .nice();
  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(dataset, yAccessor))
    .range([dimensions.boundedHeight, 0])
    .nice();
  const colorScale = d3
    .scaleLinear()
    .domain(d3.extent(dataset, colorAccessor))
    .range(["skyblue", "darkslategrey"]);

  // draw data
  bounds
    .selectAll("circle")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("cx", (d) => xScale(xAccessor(d)))
    .attr("cy", (d) => yScale(yAccessor(d)))
    .attr("r", 5)
    .attr("fill", (d) => colorScale(colorAccessor(d)));

  // axis
  const xAxisGenerator = d3.axisBottom().scale(xScale);
  const xAxis = bounds
    .append("g")
    .call(xAxisGenerator)
    .style("transform", `translateY(${dimensions.boundedHeight}px)`);
  xAxis
    .append("text")
    .attr("x", dimensions.boundedWidth / 2)
    .attr("y", dimensions.margin.bottom - 5)
    .attr("fill", "black")
    .style("font-size", "1.2rem")
    .html("露点温度（&deg;C）");

  const yAxisGenerator = d3.axisLeft().scale(yScale).ticks(4);
  const yAxis = bounds.append("g").call(yAxisGenerator);

  yAxis
    .append("text")
    .attr("x", -dimensions.boundedHeight / 2)
    .attr("y", -dimensions.margin.left + 20)
    .attr("fill", "black")
    .style("font-size", "1.2rem")
    .style("text-anchor", "middle")
    .style("transform", "rotate(-90deg)")
    .text("湿度");
}

drawScatterPlot();
