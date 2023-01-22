import { forceSimulation } from "d3-force";
import * as d3 from "d3";
import type { SimulationNodeDatum } from "d3";

function createForceDirected() {
  const roleScale = d3
    .scaleOrdinal()
    .range(["red", "yellow", "green", "blue", "violet", "lime"]);
  const sampleData = d3.range(50).map((d, i) => ({ r: 25 - i * 0.5 }));

  const manyBody = d3.forceManyBody().strength(20);
  const center = d3.forceCenter(250, 250);
  const collide = d3.forceCollide().radius((d: any) => d.r);

  const simulation = d3
    .forceSimulation()
    .force("charge", manyBody)
    .nodes(sampleData as SimulationNodeDatum[])
    .force("center", center)
    .force("collide", collide)
    .on("tick", update);

  d3.select("svg")
    .selectAll("circle")
    .data(sampleData)
    .enter()
    .append("circle")
    .attr("class", "node")
    .style("fill", (d, i) => roleScale(i) as string)
    .attr("r", (d) => d.r);

  function update() {
    d3.selectAll("circle")
      .attr("cx", (d: any) => d.x)
      .attr("cy", (d: any) => d.y);
  }
}

createForceDirected();
