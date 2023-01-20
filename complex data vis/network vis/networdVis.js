"use strict";
exports.__esModule = true;
function drawAdjancency() {
    Promise.all([
        d3.csv("../../data/nodelist.csv"),
        d3.csv("../../data/edgelist.csv"),
    ]).then(function (data) {
        createAdjacencyMatrix(data[0], data[1]);
    });
}
function createAdjacencyMatrix(nodes, edges) {
    console.log(nodes, edges);
    var edgeHash = {};
    edges.forEach(function (edge) {
        var id = edge.source + "-" + edge.target;
        edgeHash[id] = edge;
    });
    var matrix = [];
    nodes.forEach(function (source, i) {
        nodes.forEach(function (target, j) {
            var grid = {
                id: source.id + "-" + target.id,
                x: j,
                y: i,
                weight: 0
            };
            if (edgeHash[grid.id]) {
                grid.weight = +edgeHash[grid.id].weight;
            }
            matrix.push(grid);
        });
    });
    console.log(matrix);
    // create grid
    var adjacencyG = d3
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
        .attr("x", function (d) { return d.x * 25; })
        .attr("y", function (d) { return d.y * 25; })
        .style("fill-opacity", function (d) { return d.weight * 0.2; });
    // create horizontal labels
    var horiLabelG = d3
        .select("svg")
        .append("g")
        .attr("transform", "translate(50,45)")
        .selectAll("text")
        .data(nodes)
        .enter()
        .append("text")
        .attr("x", function (d, i) { return i * 25 + 12.5; })
        .text(function (d) { return d.id; })
        .style("text-anchor", "middle");
    // create vertical labels
    var verticalLabelG = d3
        .select("svg")
        .append("g")
        .attr("transform", "translate(45,50)")
        .selectAll("text")
        .data(nodes)
        .enter()
        .append("text")
        .attr("y", function (d, i) { return i * 25 + 12.5; })
        .text(function (d) { return d.id; })
        .style("text-anchor", "end");
    // add interactivity
    d3.selectAll("rect.grid").on("mouseover", function (d) {
        d3.selectAll("rect").style("stroke-width", function (p) {
            return p.x === d.x || p.y === d.y ? "4px" : "1px";
        });
    });
}
