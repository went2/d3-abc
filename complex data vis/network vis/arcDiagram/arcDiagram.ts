import { NodeItem, EdgeItem } from "../types";
// import d3 from "d3";

function createArcDiagram(): void {
  const urlArr = ["../../../data/nodelist.csv", "../../../data/edgelist.csv"];
  loadCsvAndDraw(urlArr, draw);
}

function draw(dataArr: d3.DSVParsedArray<any>[]) {
  const [nodes, edges] = dataArr;
  const nodeHash = {};
  nodes.forEach((node, x) => {
    nodeHash[node.id] = node;
    node.x = x * 30;
  });

  edges.forEach((edge) => {
    // 将 edge source 的值替换为node中的对象
    edge.source = nodeHash[edge.source];
    edge.target = nodeHash[edge.target];
    edge.weight = parseInt(edge.weight);
  });

  const arcG = d3
    .select("svg")
    .append("g")
    .attr("id", "arcG")
    .attr("transform", "translate(50, 250)");

  arcG
    .selectAll("path")
    .data(edges)
    .enter()
    .append("path")
    .attr("class", "arc")
    .style("stroke-width", (d) => d.weight * 2)
    .style("opacity", 0.25)
    .attr("d", arc);

  arcG
    .selectAll("circle")
    .data(nodes)
    .enter()
    .append("circle")
    .attr("class", "node")
    .attr("r", 10)
    .attr("cx", (d) => d.x);

  // add interactivity
  d3.selectAll("circle").on("mouseover", nodeOver);
  d3.selectAll("circle").on("mouseout", recover);
  d3.selectAll("path").on("mouseover", edgeOver);
  d3.selectAll("path").on("mouseout", recover);
}

function nodeOver(_, d) {
  // console.log("node", d);

  d3.selectAll("circle").classed("active", (p) => p === d);
  d3.selectAll("path").classed(
    "active",
    (p) => p.source === d.source || p.target === d
  );
}

function edgeOver(_, d) {
  // console.log("edge", d);
  d3.selectAll("path").classed("active", (p) => p === d);
  d3.selectAll("circle")
    .classed("source", (p) => p === d.source)
    .classed("target", (p) => p === d.target);
}

function recover() {
  d3.selectAll("path").classed("active", false);
  d3.selectAll("circle").classed("active", false);
  d3.selectAll("circle").classed("target", false);
  d3.selectAll("circle").classed("source", false);
}

// 绘制一个 basis-interpolated line
// 经过一个中间点 [midX, midY]
function arc(d, i: number) {
  const draw = d3.line().curve(d3.curveBasis);
  const midX = (d.source.x + d.target.x) / 2;
  const midY = d.source.x - d.target.x;
  const arcD = draw([
    [d.source.x, 0],
    [midX, midY],
    [d.target.x, 0],
  ]);
  // console.log(arcD);

  return arcD;
}

// 导入多个csv文件
function loadCsvAndDraw(
  urlArr: string[],
  drawFunc: (dataArr: d3.DSVRowArray<string>[]) => void
): void {
  const promises = urlArr.map((urlString) => d3.csv(urlString));
  Promise.all(promises).then((data) => {
    drawFunc(data);
  });
}
