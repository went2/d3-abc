async function drawBarChart() {
  const dataset = await d3.json("./data/my_weather_data.json");

  const width = 600;
  const dimensions = {
    width,
    height: width * 0.6,
    margin: {
      top: 30,
      left: 50,
      right: 10,
      bottom: 50,
    },
  };
  dimensions.boundedWidth =
    dimensions.width - dimensions.margin.left - dimensions.margin.right;
  dimensions.boundedHeight =
    dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

  const metricAccessor = (d) => d.humidity;

  const wrapper = d3
    .select("bar-chart")
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
    .domain(d3.extent(dataset, metricAccessor))
    .range([0, dimensions.boundedWidth])
    .nice();

  // 直方图要先创建 bins
  const binsGenerator = d3
    .histogram()
    .domain(xScale.domain())
    .value(metricAccessor)
    .thresholds(12);
  const bins = binsGenerator(dataset);

  const yAccessor = (d) => d.length;
  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(bins, yAccessor)])
    .range([dimensions.boundedHeight, 0])
    .nice();

  // draw data
  const bindsGroup = bounds.append("g").data(bins).enter().append("g");
  const barPadding = 1;
  const barRects = bindsGroup
    .append("rect")
    .attr("x", (d) => xScale(d.x0) + barPadding / 2)
    .attr("y", (d) => yScale(yAccessor(d)))
    .attr("width", d3.max([0, xScale(d.x1) - xScale(d.x0) - barPadding]))
    .attr("height", (d) => dimensions.boundedHeight - yScale(yAccessor(d)));
}

drawBarChart();
