d3.gridLayout = function () {
  let layoutSize = [0, 10];
  const gridXScale = d3.scaleLinear();
  const gridYScale = d3.scaleLinear();

  function processGrid(data) {
    const rows = Math.ceil(Math.sqrt(data.length));
    const columns = rows;
    let cell = 0;
    gridXScale.domain([1, columns]).range([0, layoutSize[0]]);
    gridYScale.domain([1, rows]).range([0, layoutSize[1]]);
    const gridCellWidth = layoutSize[0] / columns;
    const gridCellHeight = layoutSize[1] / rows;

    // 为数据点添加x, y 坐标
    for (let rowNum = 0; rowNum < rows; rowNum++) {
      for (let columnNum = 0; columnNum < columns; columnNum++) {
        if (data[cell]) {
          data[cell].x = gridXScale(columnNum);
          data[cell].y = gridYScale(rowNum);
          data[cell].width = gridCellWidth;
          data[cell].height = gridCellHeight;
          cell++;
        } else {
          break;
        }
      }
    }

    return data;
  }

  processGrid.size = function (...newSize) {
    if (!newSize.length) return layoutSize;
    layoutSize = newSize[0];
    // console.log("newSize", layoutSize);
    return this;
  };

  return processGrid;
};

// custom component
d3.simpleLegend = function () {
  let data = [];
  const size = [300, 20];
  const xScale = d3.scaleLinear();
  let scale;

  // add label
  let title = "Legend";
  let numberFormat = d3.format(".4n");
  let units = "Units";

  function legend(gSelection) {
    createLegendData(scale);
    const xMin = d3.min(data, (d) => d.domain[0]);
    const xMax = d3.max(data, (d) => d.domain[1]);
    xScale.domain([xMin, xMax]).range([0, size[0]]);

    gSelection
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("height", size[1])
      .attr("width", (d) => xScale(d.domain[1]) - xScale(d.domain[0]))
      .attr("x", (d, i) => xScale(d.domain[0]))
      .style("fill", (d) => d.color);

    gSelection
      .selectAll("text")
      .data(data)
      .enter()
      .append("g")
      .attr("transform", (d) => `translate(${xScale(d.domain[0])}, ${size[1]})`)
      .append("text")
      .attr("transform", "rotate(90)")
      .text((d) => d.domain[0]);

    gSelection
      .selectAll("line")
      .data(data)
      .enter()
      .append("line")
      .attr("x1", (d) => xScale(d.domain[0]))
      .attr("x2", (d) => xScale(d.domain[0]))
      .attr("y1", 0)
      .attr("y2", size[1] + 5)
      .style("stroke", "black")
      .style("stroke-width", "2px");

    gSelection
      .selectAll("text")
      .data(data)
      .enter()
      .append("g")
      .attr(
        "transform",
        (d) => `translate(${xScale(d.domain[0])},${size[1] + 20})`
      )
      .append("text")
      .style("text-anchor", "middle")
      .text((d) => numberFormat(d.domain[0]));
    gSelection
      .append("text")
      .attr("transform", (d) => `translate(${xScale(xMin)},${size[1] - 30})`)
      .text(title);
    gSelection
      .append("text")
      .attr("transform", (d) => `translate(${xScale(xMax)},${size[1] + 20})`)
      .text(units);
    // this refers to legend function object
    return this;
  }

  function createLegendData(incScale) {
    const rangeArray = incScale.range();
    data = [];
    for (let x in rangeArray) {
      const colorValue = rangeArray[x];
      const domainValues = incScale.invertExtent(colorValue);
      data.push({
        color: colorValue,
        domain: domainValues,
      });
    }
  }

  legend.scale = function (newScale) {
    if (!newScale) return scale;
    scale = newScale;
    return this;
  };

  legend.title = function (newTitle) {
    if (!arguments.length) return title;
    title = newTitle;
    return this;
  };

  legend.unitLabel = function (newUnits) {
    if (!arguments.length) return units;
    units = newUnits;
    return this;
  };
  legend.formatter = function (newFormatter) {
    if (!arguments.length) return numberFormat;
    numberFormat = newFormatter;
    return this;
  };

  return legend;
};

d3.json("../../../data/world.geojson").then((data) => {
  const grid = d3.gridLayout().size([350, 350]);
  const gridedData = grid(data.features);
  gridedData.forEach((country) => {
    country.size = d3.geoArea(country);
  });

  // const scale = d3.scaleLinear().domain([0, 5]).range([100, 400]);
  const salaryScale = d3
    .scaleLinear()
    .domain([0, 300000])
    .range([1, 30])
    .clamp(true);

  const svg = d3.select("svg");
  const eleG = svg.append("g").attr("transform", `translate(150,50)`);
  eleG
    .selectAll("circle")
    .data(gridedData)
    .join("circle")
    .attr("cx", (d) => d.x)
    .attr("cy", (d) => d.y)
    .attr("r", 10)
    .style("stroke", "#4f442b")
    .style("stroke-width", "1px")
    .style("fill", "#75739f");

  // 从元素选择绑定的数据
  const griddedData = d3.selectAll("circle").data();
  const sizeExtent = d3.extent(griddedData, (d) => d.size);
  const countryColor = d3
    .scaleQuantize()
    .domain(sizeExtent)
    .range(colorbrewer.Reds[7]);

  d3.selectAll("circle").style("fill", (d) => countryColor(d.size));

  function resizeGrid() {
    console.log("reszize grid");
    grid.size([200, 400]);
    grid(doubleArray);
    d3.select("g")
      .selectAll("rect")
      .transition()
      .duration(1000)
      .attr("x", (d) => d.x - d.width / 2)
      .attr("y", (d) => d.y - d.height / 2)
      .attr("width", (d) => d.width)
      .attr("height", (d) => d.height)
      .on("end", resizeGrid2);
  }
  function resizeGrid2() {
    grid.size([400, 200]);
    grid(doubleArray);
    d3.select("g")
      .selectAll("rect")
      .transition()
      .duration(1000)
      .attr("x", (d) => d.x - d.width / 2)
      .attr("y", (d) => d.y - d.height / 2)
      .attr("width", (d) => d.width)
      .attr("height", (d) => d.height);
  }

  // 使用 component
  const newLegend = d3
    .simpleLegend()
    .scale(countryColor)
    .title("Country Size")
    .formatter(d3.format(".2f"))
    .unitLabel("Steradians");
  svg
    .append("g")
    .attr("id", "legend")
    .attr("transform", `translate(50, 400)`)
    .call(newLegend);

  d3.select("#legend")
    .selectAll("rect")
    .on("mouseover", (e, d) => {
      d3.selectAll("circle").style("opacity", (p) => {
        if (p.size >= d.domain[0] && p.size <= d.domain[1]) {
          return 1;
        } else {
          return 0.25;
        }
      });
    });
});
