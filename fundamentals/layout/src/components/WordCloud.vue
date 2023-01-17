<script lang="ts" setup>
import { isTemplateNode } from "@vue/compiler-core";
import * as d3 from "d3";
import * as d3Cloud from "d3-cloud";
import { onMounted } from "vue";

// margins
const margin = {
  top: 20,
  right: 10,
  bottom: 10,
  left: 10,
};
const boundedWidth = 800 - margin.left - margin.right;
const boundedHeight = 600 - margin.top - margin.bottom;
const width = boundedWidth + margin.left + margin.right;
const height = boundedHeight + margin.top + margin.bottom;

const color = d3.scaleSequential(d3.interpolateRainbow);

onMounted(() => {
  d3.csv("/words.csv").then((data: any) => {
    data = data.map((item) => ({
      ...item,
      frequency: Number(item.frequency),
      fill: color(Math.random()),
    }));
    console.log(data);

    // scales
    const wordScale = d3.scaleLinear().domain([0, 75]).range([10, 100]);

    // init word-cloud

    const randomRotate = d3.scaleLinear().domain([0, 1]).range([-20, 20]);
    d3Cloud()
      .size([boundedWidth, boundedHeight])
      .words(data)
      .padding(5)
      .rotate(10)
      .fontSize((d) => wordScale(d.frequency))
      .on("end", draw)
      .start();

    function draw(words) {
      const wordCloudG = d3
        .select("#word-cloud")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("id", "wordCloudG")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

      wordCloudG
        .selectAll("text")
        .data(words)
        .enter()
        .append("text")
        .style("font-size", (d: any) => `${d.size}px`)
        .attr("transform", (d: any) => `translate(${[d.x, d.y]})`)
        .attr("fill", (d: any) => d.fill)
        .text((d: any) => d.text);
    }
  });
});
</script>

<template>
  <div id="word-cloud" :width="width" :height="height"></div>
</template>

<style scoped></style>
