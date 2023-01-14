<script setup>
import * as d3 from "d3";
import { onMounted, ref } from "vue";

const dataColumn = ref([]);
const dataset = ref([]);

const xScale = d3.scaleLinear().domain([0, 10]).range([0, 500]);
const yScale = d3.scaleLinear().domain([0, 60]).range([480, 0]);
const heightScale = d3.scaleLinear().domain([0, 60]).range([0, 480]);

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
  .y0((d) => yScale(d[0])) // y0 表示下界
  .y1((d) => yScale(d[1]));

const drawAxis = () => {
  const xAxis = d3.axisBottom().scale(xScale).ticks(10).tickSize(480);
  const yAxis = d3.axisRight().scale(yScale).tickSize(500);

  d3.select("svg")
    .append("g")
    .attr("id", "xAxisG")
    .style("transform", "translate(0,480)")
    .call(xAxis);

  d3.select("svg")
    .append("g")
    .attr("id", "yAxisG")
    // .style("transform", "translate(300,0)")
    .call(yAxis);

  d3.select("#xAxisG > path.domain").style("display", "none");
  d3.select("#yAxisG > path.domain").style("display", "none");
};

onMounted(() => {
  d3.csv("/movies.csv").then((data) => {
    dataColumn.value = data.columns.filter((item) => item !== "day");

    dataset.value = data.map((item) => {
      Object.keys(item).forEach((key) => {
        item[key] = Number(item[key]);
      });
      return item;
    });
    drawAxis();
    console.log(stackLayout(dataset.value));

    // d3.select("svg")
    //   .selectAll("path")
    //   .data(stackLayout(dataset.value))
    //   .enter()
    //   .append("path")
    //   .attr("d", stackArea)
    //   .style("fill", (d, i) => fillScale(i));

    // stackLayout.offset(d3.stackOffsetSilhouette).order(d3.stackOrderInsideOut);
    // stackArea.curve(d3.curveBasis);
    // yScale.domain([-50, 50]);

    // d3.select("svg")
    //   .selectAll("path")
    //   .data(stackLayout(dataset.value))
    //   .enter()
    //   .append("path")
    //   .attr("d", stackArea)
    //   .style("fill", (d, i) => fillScale(i));

    // draw stacked bar chart
    d3.select("svg")
      .selectAll("g.bar")
      .data(stackLayout(dataset.value))
      .enter()
      .append("g")
      .each(function (d) {
        d3.select(this)
          .selectAll("rect")
          .data(d)
          .enter()
          .append("rect")
          .attr("x", (p, q) => xScale(q))
          .attr("y", (p) => yScale(p[1]))
          .attr("width", 40)
          .attr("height", (p) => heightScale(p[1] - p[0]))
          .style("fill", fillScale(d.key));
      });
  });
});
</script>

<template>
  <svg id="svg" width="550px" height="550px"></svg>
</template>

<style scoped></style>
