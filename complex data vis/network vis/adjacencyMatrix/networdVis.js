"use strict";
exports.__esModule = true;
var d3_1 = require("d3");
function drawAdjancency() {
  Promise.all([
    d3_1["default"].csv("../../data/nodelist.csv"),
    d3_1["default"].csv("../../data/edgelist.csv"),
  ]).then(function (data) {
    createAdjacencyMatrix(data[0], data[1]);
  });
}
function createAdjacencyMatrix(nodes, edges) {
  console.log(nodes, edges);
  var matrix = matrixFunc(nodes, edges);
  console.log(matrix);
  // create grid
  var adjacencyG = d3_1["default"]
    .select("svg")
    .append("g")
    .attr("transform", "translate(50,50)")
    .attr("id", "adjacencyG")
    .selectAll("rect")
    .data(matrix)
    .enter()
    .append("rect")
    .attr("class", "grid")
    .attr("width", 25)
    .attr("height", 25)
    .attr("x", function (d) {
      return d.x * 25;
    })
    .attr("y", function (d) {
      return d.y * 25;
    })
    .style("fill-opacity", function (d) {
      return d.weight * 0.2;
    });
  // create horizontal labels
  var horiLabelG = d3_1["default"]
    .select("svg")
    .append("g")
    .attr("transform", "translate(50,45)")
    .selectAll("text")
    .data(nodes)
    .enter()
    .append("text")
    .attr("x", function (d, i) {
      return i * 25 + 12.5;
    })
    .text(function (d) {
      return d.id;
    })
    .style("text-anchor", "middle");
  // create vertical labels
  var verticalLabelG = d3_1["default"]
    .select("svg")
    .append("g")
    .attr("transform", "translate(45,50)")
    .selectAll("text")
    .data(nodes)
    .enter()
    .append("text")
    .attr("y", function (d, i) {
      return i * 25 + 12.5;
    })
    .text(function (d) {
      return d.id;
    })
    .style("text-anchor", "end");
  // add interactivity
  d3_1["default"].selectAll("rect.grid").on("mouseover", function (event, d) {
    d3_1["default"].selectAll("rect").style("stroke-width", function (p) {
      return p.x === d.x || p.y === d.y ? "3px" : "1px";
    });
  });
}
function matrixFunc(nodes, edges) {
  //  保存每一个连线的信息
  var edgeHash = {};
  edges.forEach(function (edge) {
    var id = edge.source + "-" + edge.target;
    edgeHash[id] = edge;
  });
  // 构建 matrix 网格数组
  var matrix = [];
  nodes.forEach(function (source, i) {
    // 遍历外层循环第n次，计算的是网格第n列
    nodes.forEach(function (target, j) {
      // 遍历内层循环第n次，计算的是网格第n行
      var grid = {
        id: source.id + "-" + target.id,
        x: j,
        y: i,
        weight: 0,
      };
      if (edgeHash[grid.id]) {
        grid.weight = +edgeHash[grid.id].weight;
      }
      matrix.push(grid);
    });
  });
  return matrix;
}
