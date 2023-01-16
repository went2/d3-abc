<script lang="ts" setup>
import * as d3 from "d3";
import { onMounted, ref, computed } from "vue";
// import { sankey, sankeyLinkHorizontal } from "d3-sankey";
// import * as d3Sankey from "d3-sankey";
import * as d3Sankey from "d3-sankey";

const sankeyD = ref(null);

const props = defineProps({
  data: Object,
});

const dataset = computed(() => {
  return JSON.parse(JSON.stringify(props.data));
});

const sankey = ref(null);
sankey.value = d3Sankey
  .sankey()
  .nodeId((d: any) => d.name)
  .nodeWidth(15)
  .nodePadding(10)
  .iterations(1)
  .size([500, 500])(dataset.value);

onMounted(() => {
  console.log("onMounted", sankey.value);
});

onMounted(() => {
  const bounds = d3
    .select("#sankeyG")
    .style("transform", "translate(40px,40px)");

  d3.json("/energy.json").then((data) => {
    const links = data;

    // generate nodes
    const linkSourceArr = links.map((d) => d.source);
    const linkTargetArr = links.map((d) => d.target);
    const nodes = Array.from(d3.union(linkSourceArr, linkTargetArr), (id) => ({
      id,
    }));

    // console.log("nodes", nodes);
    return;

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // console.log(sankeyD.value.nodes);

    // draw links
    bounds
      .selectAll(".links")
      .data(sankeyD.value.links)
      .enter()
      .append("path")
      .attr("class", "links")
      .attr("d", sankeyLinkHorizontal())
      // .style("fill", "none")
      .style("stroke-width", (d) => d.width)
      .style("stroke", (d) => intensityRamp(d.value))
      .style("stroke-opacity", 0.5)
      .on("mouseover", function () {
        d3.select(this).style("stroke-opacity", 0.8);
      })
      .on("mouseout", function () {
        d3.selectAll(".links").style("stroke-opacity", 0.5);
      });

    // draw nodes
    const node = bounds
      .selectAll(".node")
      .data(sankeyD.value.nodes)
      .enter()
      .append("g")
      .attr("class", "node")
      .style("transform", (d) => `translate(${d.x0}, ${d.y0})`);

    node
      .append("rect")
      .attr("x", (d) => d.x0)
      .attr("y", (d) => d.y0)
      .attr("height", (d) => d.y1 - d.y0)
      .attr("width", 30)
      .style("fill", "#93c464")
      .style("stroke", "gray");

    node
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
    <g id="sankeyG">
      <template v-for="item in sankey.nodes" :key="item.name">
        <rect
          :x="item.x0"
          :y="item.y0"
          :height="item.y1 - item.y0"
          :width="item.x1 - item.x0"
        />
        <title>{{ item.name }}</title>
      </template>
    </g>
  </svg>
</template>

<style scoped></style>
