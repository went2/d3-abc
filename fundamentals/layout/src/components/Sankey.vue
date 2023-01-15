<script setup>
import * as d3 from "d3";
import { onMounted, ref } from "vue";
import { sankey, sankeyLinkHorizontal } from "d3-sankey";

const dataset = ref([]);
const sankeyG = ref(null);
const sankeyD = ref(null);

const initSankey = (dataset) => {
  sankeyG.value = sankey()
    .nodeWidth(20)
    .nodePadding(200)
    // .nodeId((d) => d.name)
    .size([480, 480])
    .nodes(dataset.nodes)
    .links(dataset.links);

  sankeyD.value = sankeyG.value(dataset);

  // console.log(sankeyG.value);
};

onMounted(() => {
  const bounds = d3
    .select("#sankeyG")
    .style("transform", "translate(40px,40px)");

  d3.json("/sitestate.json").then((data) => {
    dataset.value = data;
    // console.log(data);

    initSankey(data);

    const intensityRamp = d3
      .scaleLinear()
      .domain([0, d3.max(data.links, (d) => d.value)])
      .range(["#fcd89b", "#cf7d1c"]);

    console.log(sankeyD.value.nodes);

    // draw links
    bounds
      .selectAll(".links")
      .data(sankeyD.value.links)
      .enter()
      .append("path")
      .attr("class", "links")
      .attr("d", sankeyLinkHorizontal())
      .style("fill", "none")
      .style("stroke-width", (d) => d.width)
      .style("stroke", (d) => intensityRamp(d.value))
      .style("stroke-opacity", 0.5)
      .on("mouseover", function () {
        d3.select(this).style("stroke-opacity", 0.8);
      })
      .on("mouseout", function () {
        d3.selectAll(".links").style("stroke-opacity", 0.5);
      });

    // d3.selectAll("path.links").style("stroke-opacity", 0.5);

    // draw nodes
    bounds
      .selectAll(".nodes")
      .data(sankeyD.value.nodes)
      .enter()
      .append("g")
      .attr("class", "nodes")
      .style("transform", (d) => `translate(${d.x0}, ${d.y0})`);

    d3.selectAll(".nodes")
      .append("rect")
      .attr("x", (d) => d.x0)
      .attr("y", (d) => d.y0)
      .attr("height", (d) => d.y1 - d.y0)
      .attr("width", (d) => d.x1 - d.x0)
      .style("fill", "#93c464")
      .style("stroke", "gray");

    d3.selectAll(".nodes")
      .append("text")
      .attr("x", (d) => d.x0)
      .attr("y", (d) => d.y0 - 10)
      .attr("text-anchor", "middle")
      .style("fill", "black")
      .text((d) => d.name);
  });
});
</script>
<template>
  <svg id="svg" width="600px" height="600px">
    <g id="sankeyG"></g>
  </svg>
</template>

<style scoped></style>
