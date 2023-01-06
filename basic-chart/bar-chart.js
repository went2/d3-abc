async function drawBarChart() {
  const dataset = await d3.json("../data/my_weather_data.json");

  const width = 400;
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

  const drawHistogram = (metric) => {
    const metricAccessor = (d) => d[metric];
    const yAccessor = (d) => d.length;

    const wrapper = d3
      .select("#bar-chart")
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

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(bins, yAccessor)])
      .range([dimensions.boundedHeight, 0])
      .nice();

    // draw data
    const binsGroup = bounds.append("g");
    const binGroups = binsGroup.selectAll("g").data(bins).enter().append("g");
    const barPadding = 1;
    const barRects = binGroups
      .append("rect")
      .attr("x", (d) => xScale(d.x0) + barPadding / 2)
      .attr("y", (d) => yScale(yAccessor(d)))
      .attr("width", (d) =>
        d3.max([0, xScale(d.x1) - xScale(d.x0) - barPadding])
      )
      .attr("height", (d) => dimensions.boundedHeight - yScale(yAccessor(d)))
      .attr("fill", "cornflowerblue");

    // add labels
    const barText = binGroups
      .filter(yAccessor)
      .append("text")
      .attr("x", (d) => xScale(d.x0) + (xScale(d.x1) - xScale(d.x0)) / 2)
      .attr("y", (d) => yScale(yAccessor(d)) - 5)
      .text(yAccessor)
      .style("text-anchor", "middle")
      .attr("fill", "darkgrey")
      .style("font-size", "12px")
      .style("font-family", "sans-serif");

    // 增加平均数线
    const mean = d3.mean(dataset, metricAccessor);
    const meanLine = bounds
      .append("line")
      .attr("x1", xScale(mean))
      .attr("y1", -15)
      .attr("x2", xScale(mean))
      .attr("y2", dimensions.boundedHeight)
      .attr("stroke", "maroon")
      .attr("stroke-dasharray", "2px 4px");
    const meanLabel = bounds
      .append("text")
      .attr("x", xScale(mean))
      .attr("y", -20)
      .text("平均线")
      .attr("fill", "maroon")
      .style("font-size", "12px")
      .style("text-anchor", "middle");

    // 轴线
    const xAxisGenerator = d3.axisBottom().scale(xScale);
    const xAxis = bounds
      .append("g")
      .call(xAxisGenerator)
      .style("transform", `translateY(${dimensions.boundedHeight}px)`);
    const xAxisLabel = xAxis
      .append("text")
      .attr("x", dimensions.boundedWidth / 2)
      .attr("y", dimensions.margin.bottom - 10)
      .attr("fill", "black")
      .style("font-size", "1.2rem")
      .text(metric)
      .style("text-transform", "capitalize");
  };

  const metrics = [
    "windSpeed",
    "moonPhase",
    "dewPoint",
    "humidity",
    "uvIndex",
    "windBearing",
    "temperatureMin",
    "temperatureMax",
  ];
  metrics.forEach(drawHistogram);
}

drawBarChart();
