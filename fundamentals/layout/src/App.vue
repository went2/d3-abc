<script setup>
import StackChart from "./components/StackChart.vue";
import HistoChart from "./components/HistoChart.vue";
import ViolinChart from "./components/ViolinChart.vue";
import PieChart from "./components/PieChart.vue";
import Streamgraph from "./components/Streamgraph.vue";
import Sankey from "./components/Sankey.vue";
import Controls from "./components/Controls.vue";

import * as energyData from "./assets/energyData.json";
// console.log(eneryData);
</script>

<template>
  <div class="app-wrapper">
    <Controls />
    <Sankey :data="energyData" />
  </div>
</template>

<style scoped></style>
