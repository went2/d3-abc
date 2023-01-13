<script setup>
import * as d3 from "d3";
import { onMounted, ref } from "vue";

const dataset = ref([]);
const binsData = ref([]);
const xScale = d3.scaleLinear().domain([0, 5]).range([0, 500]);
const yScale = d3.scaleLinear().domain([0, 10]).range([400, 0]);

// 配置histogram
const binGenerator = d3.bin();
binGenerator
  .domain([0, 5])
  .thresholds([0, 1, 2, 3, 4, 5])
  .value((d) => d.favorites.length);

d3.json("/tweets.json").then((data) => {
  dataset.value = data.tweets;
  binsData.value = binGenerator(dataset.value);
  console.log("bins", binsData.value);
});

onMounted(() => {
  const xAxis = d3.axisBottom().scale(xScale).ticks(5);
  d3.select("svg")
    .append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0,400)")
    .call(xAxis);
  d3.select("g.axis").selectAll("text").attr("dx", 50);
});
</script>

<template>
  <svg id="svg" width="500px" height="500px">
    <template v-for="(d, i) in binsData" :key="i">
      <rect
        :x="xScale(d.x0)"
        :y="yScale(d.length)"
        :width="xScale(d.x1 - d.x0) - 2 > 0 ? xScale(d.x1 - d.x0) - 2 : 0"
        :height="400 - yScale(d.length)"
        :style="{ fill: '#FCD88B' }"
      />
    </template>
  </svg>
</template>

<style lang="less" scoped></style>
