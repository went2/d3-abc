<script lang="ts" setup>
import * as d3 from "d3";
import { onMounted, ref, computed } from "vue";
// import { sankey, sankeyLinkHorizontal } from "d3-sankey";
// import * as d3Sankey from "d3-sankey";
import * as d3Sankey from "d3-sankey";

const sankeyD = ref(null);
const color = d3.scaleOrdinal(d3.schemeCategory10);
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
    <g>
      <template v-for="node in sankey.nodes" :key="node.name">
        <rect
          :x="node.x0"
          :y="node.y0"
          :height="node.y1 - node.y0"
          :width="node.x1 - node.x0"
        />
        <title>{{ node.name }}</title>
      </template>
    </g>
    <g fill="none" :stroke-opacity="0.5">
      <template v-for="link in sankey.links" :key="link.index">
        <g class="link">
          <path
            :d="d3Sankey.sankeyLinkHorizontal()"
            :stroke-width="link.width"
            stroke="black"
          />
        </g>
      </template>
    </g>
  </svg>
</template>

<style scoped></style>
