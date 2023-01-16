<script lang="ts" setup>
import * as d3 from "d3";
import { onMounted, ref, computed } from "vue";
import * as d3Sankey from "d3-sankey";

/**
 * common setting for a chart
 */

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

// init sankey generator
const sannkey = d3Sankey
  .sankey()
  .nodeWidth(30)
  .nodePadding(40)
  .nodeId((d: any) => d.name);

onMounted(() => {
  d3.json("/sankeySample2.json").then(
    (data: { nodes: Array<any>; links: Array<any> }) => {
      data.links.forEach((item) => {
        item.value = Number(item.value);
      });
      // draw svg
      const bounds = d3
        .select("#sankey-wrapper")
        .append("svg")
        .attr("width", boundedWidth + margin.left + margin.right)
        .attr("height", boundedHeight + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

      const graphData = sannkey(data);
      console.log(graphData);

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
      link
        .append("title")
        .text(
          (d: any) => `${d.source.name}->${d.target.name} ${fomatter(d.value)}`
        );
    }
  );
});
</script>
<template>
  <div id="sankey-wrapper"></div>
</template>

<style scoped></style>
