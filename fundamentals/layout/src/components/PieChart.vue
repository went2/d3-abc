<script setup>
import * as d3 from "d3";
import { onMounted, ref } from "vue";

const tweetsData = ref([]);
const metrics = {
  Tweets: "numTweets",
  Favortites: "numFavorites",
  Retweets: "numRetweets",
};

const pieGenerator = d3.pie();
pieGenerator.sort(null);

const arcGenerator = d3.arc();
arcGenerator.innerRadius(20).outerRadius(100);

const fillScale = d3
  .scaleOrdinal()
  .range(["#fcd88a", "#cf7c1c", "#93c464", "#75734F"]);

onMounted(() => {
  d3.json("/tweets.json").then((data) => {
    const nestedData = d3.group(data.tweets, (d) => d.user);
    // 转成[{key: string, value: Array(n)}] 的格式
    tweetsData.value = Array.from(nestedData, ([key, value]) => ({
      key,
      value,
    }));
    tweetsData.value.forEach((d) => {
      d.numTweets = d.value.length;
      d.numFavorites = d3.sum(d.value, (p) => p.favorites.length);
      d.numRetweets = d3.sum(d.value, (p) => p.retweets.length);
    });

    const pieData = pieGenerator.value((d) => d.numTweets)(tweetsData.value);
    // console.log(tweetsData.value);

    // draw pie chart
    d3.select("svg")
      .append("g")
      .attr("transform", "translate(250, 250)")
      .selectAll("path")
      .data(pieData)
      .enter()
      .append("path")
      .style("fill", (d, i) => fillScale(i))
      .attr("d", arcGenerator)
      .attr("stroke", "black")
      .attr("stroke-width", "2px");

    // 改变pie generator 的 data accessor
    // 触发transition
    pieGenerator;
  });
});

const changeMetric = (data) => {
  console.log("click", data);
  const pieData = pieGenerator.value((d) => d[data])(tweetsData.value);

  // re-draw pie
  d3.selectAll("path")
    .data(pieData)
    .transition()
    .duration(500)
    .attr("d", arcGenerator);
};
</script>

<template>
  <div class="controls">
    <template v-for="(value, key) in metrics">
      <button @click="changeMetric(value)">{{ key }}</button>
    </template>
  </div>

  <svg id="svg" width="500px" height="500px"></svg>
</template>

<style lang="less" scoped></style>
