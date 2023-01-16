<script setup>
import StackChart from "./components/StackChart.vue";
import HistoChart from "./components/HistoChart.vue";
import ViolinChart from "./components/ViolinChart.vue";
import PieChart from "./components/PieChart.vue";
import Streamgraph from "./components/Streamgraph.vue";
import Sankey from "./components/Sankey2.vue";
import Controls from "./components/Controls.vue";

// import * as energyData from "./assets/energyData.json";
</script>

<template>
  <div class="app-wrapper">
    <Controls />
    <Sankey />
  </div>
</template>

<style scoped></style>
