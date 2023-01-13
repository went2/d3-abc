<script setup>
import * as d3 from "d3";
import { onMounted, ref } from "vue";

const sampleData1 = [
  { name: "tommy", value: 5 },
  { name: "alex", value: 4 },
  { name: "kobe", value: 7 },
  { name: "cindy", value: 8 },
];

const tweetsData = ref([]);
d3.json("/tweets.json").then((data) => {
  tweetsData.value = data.tweets;
  console.log(tweetsData.value);
});

onMounted(() => {
  const pieGenerator = d3.pie();
  const myPieData = pieGenerator.value((d) => d.value)(sampleData1);
  // console.log(myPieData);

  const arcGenerator = d3.arc();
  arcGenerator.innerRadius(0).outerRadius(100);

  const fillScale = d3
    .scaleOrdinal()
    .range(["#fcd88a", "#cf7c1c", "#93c464", "#75734F"]);

  // draw pie chart
  d3.select("svg")
    .append("g")
    .attr("transform", "translate(250, 250)")
    .selectAll("path")
    .data(myPieData)
    .enter()
    .append("path")
    .style("fill", (d, i) => fillScale(i))
    .attr("d", (d) => arcGenerator(d))
    .attr("stroke", "black")
    .attr("stroke-width", "2px");
});
</script>

<template>
  <svg id="svg" width="500px" height="500px"></svg>
</template>

<style lang="less" scoped></style>
