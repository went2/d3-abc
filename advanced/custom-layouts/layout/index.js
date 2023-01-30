d3.gridLayout = () => {
  return function processGrid(data) {
    const rows = Math.ceil(Math.sqrt(data.length));
    const columns = rows;
    let cell = 0;

    // 为数据点添加x, y 坐标
    for (let rowNumber = 0; rowNumber < rows; rowNumber++) {
      for (let columnNumber = 0; columnNumber < columns; columnNumber++) {
        if (data[cell]) {
          data[cell].x = columnNumber;
          data[cell].y = rowNumber;
          cell++;
        } else {
          break;
        }
      }
    }

    return data;
  };
};

d3.csv("../../../data/nodelist.csv").then((data) => {
  const newEmployees = d3.range(14).map((d) => {
    const newEmp = {
      id: "new Emp" + d,
      salary: d * 20000,
    };
    return newEmp;
  });
  const newData = [...data].concat(newEmployees);

  const grid = d3.gridLayout();
  grid(newData);
  console.log(newData);

  const scale = d3.scaleLinear().domain([0, 5]).range([100, 400]);
  const salaryScale = d3
    .scaleLinear()
    .domain([0, 300000])
    .range([1, 30])
    .clamp(true);
  d3.select("svg")
    .selectAll("circle")
    .data(newData)
    .join("circle")
    .attr("cx", (d) => scale(d.x))
    .attr("cy", 0)
    .attr("r", (d) => salaryScale(+d.salary))
    .style("fill", "#93c464");
  d3.select("svg")
    .selectAll("circle")
    .transition()
    .delay((d, i) => i * 100)
    .duration(600)
    .attr("cx", (d) => scale(d.x))
    .attr("cy", (d) => scale(d.y));
});
