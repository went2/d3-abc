<script setup>
import { ref, watch, onMounted } from "vue";
import * as d3 from "d3";
import { legendColor } from "d3-svg-legend";

const movieData = ref([]);
const dataColumn = ref([]);
const movieAreaArray = ref([]); // area generator 函数组成的数组

const xScale = d3.scaleLinear().domain([1, 10]).range([20, 470]);
const yScale = d3.scaleLinear().domain([0, 55]).range([480, 20]);
const fillScale = d3
  .scaleOrdinal()
  .domain(["titanic", "avatar", "akira", "frozen", "deliverance", "avengers"])
  .range(["#fcd88a", "#cf7c1c", "#93c464", "#75734F", "#5eafc6", "#41a368"]);

// area generator
watch(dataColumn, (newValue) => {
  const arr = newValue.map((item) => item);
  // console.log(arr);
  movieAreaArray.value = arr.map((key) => {
    return d3
      .area()
      .x((d) => xScale(d.day))
      .y0((d) => yScale(stackingFunc(d, key) - d[key]))
      .y1((d) => yScale(stackingFunc(d, key)))
      .curve(d3.curveCardinal);
  });
});

onMounted(() => {
  // draw asix
  (function (xScale, yScale) {
    const xAxis = d3
      .axisBottom()
      .scale(xScale)
      .tickSize(480)
      .tickValues([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    const yAxis = d3.axisRight().scale(yScale).tickSize(480).ticks(10);

    d3.select("svg").append("g").attr("id", "xAxisG").call(xAxis);
    d3.select("svg").append("g").attr("id", "yAxisG").call(yAxis);
    // remove domain border
    d3.select("#xAxisG > path.domain").style("display", "none");
    d3.select("#yAxisG > path.domain").style("display", "none");
  })(xScale, yScale);

  // add legend
  d3.select("svg")
    .append("g")
    .attr("transform", "translate(500, 0)")
    .call(legendA);
});

function stackingFunc(lineData, lineKey) {
  let newHeight = 0;
  Object.keys(lineData).every((key) => {
    newHeight += lineData[key];
    if (key === lineKey) {
      // console.log(key, "newHeight", newHeight);
      return false;
    }
    return true;
  });
  return newHeight;
}

// legend setting
const legendA = legendColor().scale(fillScale);
// legendA.orient("horizontal").shapePadding(60).shapeWidth(12).shapeHeight(30);

d3.csv("/movies.csv").then((data) => {
  dataColumn.value = data.columns.filter((item) => item !== "day");

  movieData.value = data.map((item) => {
    Object.keys(item).forEach((key) => {
      item[key] = Number(item[key]);
    });
    return item;
  });
});
</script>

<template>
  <svg id="svg" width="1000px" height="600px">
    <template v-for="(fn, i) in movieAreaArray" :key="dataColumn[i]">
      <path
        :id="dataColumn[i]"
        :d="fn(movieData)"
        :fill="fillScale(dataColumn[i])"
        stroke="#75739F"
        stroke-width="2px"
        opacity="{{ .75 }}"
      />
    </template>
  </svg>
</template>

<style scoped></style>
