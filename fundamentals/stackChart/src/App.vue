<script setup>
import { ref, computed, watch } from "vue";
import * as d3 from "d3";

const movieData = ref([]);
const dataColumn = ref([]);
const movieAreaArray = ref([]); // line generator 函数组成的数组

const xScale = d3.scaleLinear().domain([1, 8]).range([20, 470]);
const yScale = d3.scaleLinear().domain([0, 40]).range([480, 20]);

watch(dataColumn, (newValue) => {
  const arr = newValue.map((item) => item);
  movieAreaArray.value = arr.map((key) => {
    return d3
      .line()
      .x((d) => xScale(d.day))
      .y((d) => yScale(d[key]))
      .curve(d3.curveCardinal);
  });
  console.log(movieAreaArray.value);
});

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
  <svg id="svg" width="500px" height="500px">
    <template v-for="(fn, i) in movieAreaArray" :key="i">
      <path
        :d="fn(movieData)"
        fill="none"
        stroke="#75739F"
        stroke-width="2px"
        opacity="{{ .75 }}"
      />
    </template>
  </svg>
</template>

<style scoped></style>
