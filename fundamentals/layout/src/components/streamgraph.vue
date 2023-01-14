<script setup>
import * as d3 from "d3";
import { onMounted, ref } from "vue";

const dataColumn = ref([]);
const dataset = ref([]);

const xScale = d3.scaleLinear().domain([0, 10]).range([0, 500]);
const yScale = d3.scaleLinear().domain([0, 100]).range([500, 0]);
const movies = [
  "titanic",
  "avatar",
  "akira",
  "frozen",
  "deliverance",
  "avengers",
];

var fillScale = d3
  .scaleOrdinal()
  .domain(movies)
  .range(["#fcd88a", "#cf7c1c", "#93c464", "#75734F", "#5eafc6", "#41a368"]);

const stackLayout = d3.stack().keys(movies);
const stackArea = d3
  .area()
  .x((d, i) => xScale(i))
  .y0((d) => yScale(d[0])) // 这里的d[0]是和 stackLayout 处理过的数据对应的
  .y1((d) => yScale(d[1]));

onMounted(() => {
  d3.csv("/movies.csv").then((data) => {
    dataColumn.value = data.columns.filter((item) => item !== "day");

    dataset.value = data.map((item) => {
      Object.keys(item).forEach((key) => {
        item[key] = Number(item[key]);
      });
      return item;
    });

    console.log(stackLayout(dataset.value));

    // d3.select("svg")
    //   .selectAll("path")
    //   .data(stackLayout(dataset.value))
    //   .enter()
    //   .append("path")
    //   .attr("d", stackArea)
    //   .style("fill", (d, i) => fillScale(i));

    stackLayout.offset(d3.stackOffsetSilhouette).order(d3.stackOrderInsideOut);
    stackArea.curve(d3.curveBasis);
    yScale.domain([-50, 50]);

    d3.select("svg")
      .selectAll("path")
      .data(stackLayout(dataset.value))
      .enter()
      .append("path")
      .attr("d", stackArea)
      .style("fill", (d, i) => fillScale(i));
  });
});
</script>

<template>
  <svg id="svg" width="500px" height="500px"></svg>
</template>

<style scoped></style>
