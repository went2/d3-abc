<script lang="ts" setup>
import * as d3 from "d3";
import { onMounted, ref } from "vue";
// import { sankey, sankeyLinkHorizontal } from "d3-sankey";
import * as d3Sankey from "d3-sankey";

onMounted(() => {
  d3.json("/sankeySample1.json").then((data: any) => {
    console.log(data);

    // margins
    const margin = {
      top: 10,
      right: 10,
      bottom: 10,
      left: 10,
    };
    const boundedWidth = 900 - margin.left - margin.right;
    const boundedHeight = 300 - margin.top - margin.bottom;

    const formatNumber = d3.format(",.0f");
    const fomatter = (d) => formatNumber(d);
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // init sanky
    const sankey = d3Sankey
      .sankey()
      .nodeId((d: any) => d.name)
      .nodeWidth(25)
      .nodePadding(50)
      .size([boundedWidth, boundedHeight]);

    const graphData = sankey(data);

    // draw svg
    const bounds = d3
      .select("#sankey-container")
      .append("svg")
      .attr("width", boundedWidth + margin.left + margin.right)
      .attr("height", boundedHeight + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // draw links of sankey
    const link = bounds
      .append("g")
      .selectAll(".link")
      .data(graphData.links)
      .enter()
      .append("path")
      .attr("class", "link")
      .attr("d", d3Sankey.sankeyLinkHorizontal())
      .style("stroke-width", (d) => d.width)
      .style("stroke", "#000")
      .style("stroke-opcacity", 0.5);
    link.append("title").text((d: any) => {
      return d.source.name + "->" + d.target.name + "\n" + fomatter(d.value);
    });

    // draw nodes of sankey
    const node = bounds
      .append("g")
      .selectAll(".node")
      .data(graphData.nodes)
      .enter()
      .append("g")
      .attr("class", "node");

    // @ts-ignore
    node
      .append("rect")
      .attr("x", (d) => d.x0)
      .attr("y", (d) => d.y0)
      .attr("height", (d) => d.y1 - d.y0)
      .attr("width", (d) => d.x1 - d.x0)
      .style("fill", (d: any) => {
        return (d.color = color(d.name.replace(/ .*/, "")));
      })
      //@ts-ignore
      .style("stroke", (d: any) => d3.rgb(d.color).darker(2));

    node.append("title").text((d: any) => `${d.name} ${fomatter(d.value)}`);

    // append node text
    node
      .append("text")
      .attr("x", (d) => d.x0 - 6)
      .attr("y", (d) => (d.y1 + d.y0) / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", "end")
      .text((d: any) => d.name)
      .filter((d) => d.x0 < boundedWidth / 2)
      .attr("x", (d) => d.x1 + 6)
      .attr("text-anchcor", "start");
  });
});
</script>

<template>
  <div id="sankey-container"></div>
</template>

<style scoped></style>
