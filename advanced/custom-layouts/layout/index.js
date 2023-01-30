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

    // 为数据点添加x, y 坐标
    for (let rowNum = 0; rowNum < rows; rowNum++) {
      for (let columnNum = 0; columnNum < columns; columnNum++) {
        if (data[cell]) {
          data[cell].x = gridXScale(columnNum);
          data[cell].y = gridYScale(rowNum);
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

d3.csv("../../../data/nodelist.csv").then((data) => {
  const grid = d3.gridLayout().size([400, 400]);
  grid(data);

  // const scale = d3.scaleLinear().domain([0, 5]).range([100, 400]);
  const salaryScale = d3
    .scaleLinear()
    .domain([0, 300000])
    .range([1, 30])
    .clamp(true);

  const svg = d3.select("svg");
  const eleG = svg.append("g").attr("transform", `translate(200,200)`);
  eleG
    .selectAll("circle")
    .data(data)
    .join("circle")
    .attr("cx", (d) => d.x)
    .attr("cy", (d) => d.x)
    .attr("r", (d) => salaryScale(+d.salary))
    .style("fill", "#93c464");

  const newEmployees = [];
  for (let x = 0; x < 14; x++) {
    const newPerson = { id: "New Person " + x, salary: x * 20000 };
    newEmployees.push(newPerson);
  }
  const doubleArray = data.concat(newEmployees);
  const newGridedData = grid(doubleArray);
  eleG
    .selectAll("circle")
    .data(newGridedData)
    .join("circle")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", (d) => salaryScale(+d.salary))
    .style("fill", "#41A368");

  eleG
    .selectAll("circle")
    .transition()
    // .delay((d, i) => i * 100)
    .duration(600)
    .attr("cx", (d) => d.x)
    .attr("cy", (d) => d.y)
    .on("end", resizeGrid);

  function resizeGrid() {
    console.log("reszize grid");
    grid.size([200, 400]);
    grid(doubleArray);
    d3.select("g")
      .selectAll("circle")
      .transition()
      .duration(1000)
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y)
      .on("end", resizeGrid2);
  }
  function resizeGrid2() {
    grid.size([400, 200]);
    grid(doubleArray);
    d3.select("g")
      .selectAll("circle")
      .transition()
      .duration(1000)
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y);
  }
});
