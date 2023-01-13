<script setup>
import * as d3 from "d3";
import { onMounted, ref } from "vue";

const normal = d3.randomNormal();
const sampleData1 = d3.range(100).map((d) => normal());
const sampleData2 = d3.range(100).map((d) => normal());
const sampleData3 = d3.range(100).map((d) => normal());
const dataset = [sampleData1, sampleData2, sampleData3];

// bin genertor
const binGenerator = d3.bin();
binGenerator
  .domain([-3, 3])
  .thresholds([-3, -2.5, -2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2, 2.5, 3])
  .value((d) => d);

const yScale = d3.scaleLinear().domain([-3, 3]).range([400, 0]);
const yAxis = d3.axisRight().scale(yScale).tickSize(300);
const fillScale = d3.scaleOrdinal().range(["#fcd88a", "#cf7c1c", "#93c464"]);

// area generator
const areaGenerator = d3
  .area()
  .x0((d) => -d.length)
  .x1((d) => d.length)
  .y((d) => yScale(d.x0))
  .curve(d3.curveCatmullRom);

onMounted(() => {
  d3.select("svg").append("g").call(yAxis);
});
</script>

<template>
  <svg id="svg" width="500px" height="450px">
    <template v-for="(sampleD, i) in dataset" :key="i">
      <g class="violin" :transform="`translate(${50 + i * 100},0)`">
        <path
          :style="{ fill: fillScale(i) }"
          stroke="black"
          :d="areaGenerator(binGenerator(sampleD))"
        />
      </g>
    </template>
  </svg>
</template>

<style lang="less" scoped></style>
