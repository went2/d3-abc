"use strict";
exports.__esModule = true;
// import d3 from "d3";
function createArcDiagram() {
    var urlArr = ["../../../data/nodelist.csv", "../../../data/edgelist.csv"];
    loadCsvAndDraw(urlArr, draw);
}
function draw(dataArr) {
    var nodes = dataArr[0], edges = dataArr[1];
    var nodeHash = {};
    nodes.forEach(function (node, x) {
        nodeHash[node.id] = node;
        node.x = x * 30;
    });
    edges.forEach(function (edge) {
        // 将 edge source 的值替换为node中的对象
        edge.source = nodeHash[edge.source];
        edge.target = nodeHash[edge.target];
        edge.weight = parseInt(edge.weight);
    });
    var arcG = d3
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
        .style("stroke-width", function (d) { return d.weight * 2; })
        .style("opacity", 0.25)
        .attr("d", arc);
    arcG
        .selectAll("circle")
        .data(nodes)
        .enter()
        .append("circle")
        .attr("class", "node")
        .attr("r", 10)
        .attr("cx", function (d) { return d.x; });
    // add interactivity
    d3.selectAll("circle").on("mouseover", nodeOver);
    d3.selectAll("circle").on("mouseout", recover);
    d3.selectAll("path").on("mouseover", edgeOver);
    d3.selectAll("path").on("mouseout", recover);
}
function nodeOver(_, d) {
    console.log("node", d);
    d3.selectAll("circle").classed("active", function (p) { return p === d; });
    d3.selectAll("path").classed("active", function (p) { return p.source === d.source || p.target === d; });
}
function edgeOver(_, d) {
    console.log("edge", d);
    d3.selectAll("path").classed("active", function (p) { return p === d; });
    d3.selectAll("circle")
        .classed("source", function (p) { return p === d.source; })
        .classed("target", function (p) { return p === d.target; });
}
function recover() {
    d3.selectAll("path").classed("active", false);
    d3.selectAll("circle").classed("active", false);
    d3.selectAll("circle").classed("target", false);
    d3.selectAll("circle").classed("source", false);
}
// 绘制一个 basis-interpolated line
// 经过一个中间点 [midX, midY]
function arc(d, i) {
    var draw = d3.line().curve(d3.curveBasis);
    var midX = (d.source.x + d.target.x) / 2;
    var midY = d.source.x - d.target.x;
    var arcD = draw([
        [d.source.x, 0],
        [midX, midY],
        [d.target.x, 0],
    ]);
    // console.log(arcD);
    return arcD;
}
// 导入多个csv文件
function loadCsvAndDraw(urlArr, drawFunc) {
    var promises = urlArr.map(function (urlString) { return d3.csv(urlString); });
    Promise.all(promises).then(function (data) {
        drawFunc(data);
    });
}
