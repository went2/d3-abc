import { NodeItem, EdgeItem, MatrixGrid } from "../types";
import d3 from "d3";

function drawAdjancency(): void {
  Promise.all([
    d3.csv("../../../data/nodelist.csv"),
    d3.csv("../../../data/edgelist.csv"),
  ]).then((data) => {
    createAdjacencyMatrix(
      data[0] as d3.DSVParsedArray<NodeItem>,
      data[1] as d3.DSVParsedArray<EdgeItem>
    );
  });
}

function createAdjacencyMatrix(
  nodes: d3.DSVParsedArray<NodeItem>,
  edges: d3.DSVParsedArray<EdgeItem>
) {
  console.log(nodes, edges);

  const matrix = matrixFunc(nodes, edges);

  console.log(matrix);

  // create grid
  const adjacencyG = d3
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
    .attr("x", (d) => d.x * 25)
    .attr("y", (d) => d.y * 25)
    .style("fill-opacity", (d) => d.weight * 0.2);

  // create horizontal labels
  const horiLabelG = d3
    .select("svg")
    .append("g")
    .attr("transform", "translate(50,45)")
    .selectAll("text")
    .data(nodes)
    .enter()
    .append("text")
    .attr("x", (d, i) => i * 25 + 12.5)
    .text((d) => d.id)
    .style("text-anchor", "middle");

  // create vertical labels
  const verticalLabelG = d3
    .select("svg")
    .append("g")
    .attr("transform", "translate(45,50)")
    .selectAll("text")
    .data(nodes)
    .enter()
    .append("text")
    .attr("y", (d, i) => i * 25 + 12.5)
    .text((d) => d.id)
    .style("text-anchor", "end");

  // add interactivity
  d3.selectAll("rect.grid").on(
    "mouseover",
    function (event: MouseEvent, d: any) {
      d3.selectAll("rect").style("stroke-width", (p: any) =>
        p.x === d.x || p.y === d.y ? "3px" : "1px"
      );
    }
  );
}

function matrixFunc(nodes: NodeItem[], edges: EdgeItem[]): MatrixGrid[] {
  //  保存每一个连线的信息
  const edgeHash = {};
  edges.forEach((edge) => {
    const id = edge.source + "-" + edge.target;
    edgeHash[id] = edge;
  });

  // 构建 matrix 网格数组
  const matrix: MatrixGrid[] = [];
  nodes.forEach((source, i) => {
    // 遍历外层循环第n次，计算的是网格第n列
    nodes.forEach((target, j) => {
      // 遍历内层循环第n次，计算的是网格第n行
      const grid: MatrixGrid = {
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
