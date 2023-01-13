<script setup>
import * as d3 from "d3";
import { onMounted, ref } from "vue";

const tweetsData = ref([]);

const pieGenerator = d3.pie();

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

    pieGenerator.value((d) => d.numTweets).sort(null);
    const tweetsPie = pieGenerator(tweetsData.value);

    pieGenerator.value((d) => d.numRetweets).sort(null);
    const retweetsPie = pieGenerator(tweetsData.value);

    tweetsData.value.forEach((d, i) => {
      d.tweetsSlice = tweetsPie[i];
      d.retweetsSlice = retweetsPie[i];
    });

    // draw pie chart
    d3.select("svg")
      .append("g")
      .attr("transform", "translate(250, 250)")
      .selectAll("path")
      .data(tweetsData.value, (d) => d.key)
      .enter()
      .append("path")
      .style("fill", (d, i) => fillScale(i))
      .attr("d", (d) => arcGenerator(d.tweetsSlice))
      .attr("stroke", "black")
      .attr("stroke-width", "2px");

    // 改变pie generator 的 data accessor
    // 触发transition
    pieGenerator;
  });
});

const change = () => {
  // re-draw pie
  d3.selectAll("path").transition().duration(500).attrTween("d", arcTween1);
};

const back = () => {
  d3.selectAll("path").transition().duration(500).attrTween("d", arcTween2);
};

const arcTween1 = (d) => {
  return (t) => {
    const interpolateStartAngle = d3.interpolate(
      d.tweetsSlice.startAngle,
      d.retweetsSlice.startAngle
    );
    const interpolateEndAngle = d3.interpolate(
      d.tweetsSlice.endAngle,
      d.retweetsSlice.endAngle
    );
    d.startAngle = interpolateStartAngle(t);
    d.endAngle = interpolateEndAngle(t);
    return arcGenerator(d);
  };
};

const arcTween2 = (d) => {
  return (t) => {
    const interpolateStartAngle = d3.interpolate(
      d.retweetsSlice.startAngle,
      d.tweetsSlice.startAngle
    );
    const interpolateEndAngle = d3.interpolate(
      d.retweetsSlice.endAngle,
      d.tweetsSlice.endAngle
    );
    d.startAngle = interpolateStartAngle(t);
    d.endAngle = interpolateEndAngle(t);
    return arcGenerator(d);
  };
};
</script>

<template>
  <div class="controls">
    <button @click="change">change</button>
    <button @click="back">back</button>
  </div>

  <svg id="svg" width="500px" height="500px"></svg>
</template>

<style scoped>
.controls {
  display: flex;
  justify-content: center;
}
</style>
