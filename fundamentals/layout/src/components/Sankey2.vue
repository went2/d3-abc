<script setup>
import * as d3 from "d3";
import { onMounted, ref } from "vue";
import { sankey, sankeyLinkHorizontal } from "d3-sankey";

const data = ref([]);

/**
 *
 * @param data {nodes, links}
 * @param options
 */
const drawSankey = (
  { nodes, links },
  {
    align = "justify",
    nodeGroup,
    nodeGroups,
    nodeAlign = align, // Sankey node alignment strategy: left, right, justify, center
    nodeWidth = 15, // width of node rects
    nodePadding = 10, // vertical separation between adjacent nodes,
    nodeStroke = "currentColor",
    nodeStrokeOpacity = 0.5,
    nodeId = (d) => d.id,
    linkSource = ({ source }) => source, // mapper function, given d in links, returns a node identifier string
    linkTarget = ({ target }) => target, // given d in links, returns a node identifier string
    linkValue = ({ value }) => value, // given d in links, returns the quantitative value,
    colors = d3.schemeTableau10, // array of colors
    width = 640, // outer width, in pixels
    height = 400, // outer height, in pixels
    marginTop = 5, // top margin, in pixels
    marginRight = 1, // right margin, in pixels
    marginBottom = 5, // bottom margin, in pixels
    marginLeft = 1, // left margin, in pixels
  } = {}
) => {
  const LS = d3.map(links, linkSource);
  const LT = d3.map(links, linkTarget);
  const LV = d3.map(links, linkValue);

  // 如果没有nodes的话，从links数组中拿到所有的source 和 target 的值
  // 去重，然后组成[{id: string}]的nodes数组
  if (nodes === undefined) {
    nodes = Array.from(d3.union(LS, LT), (id) => ({ id }));
    console.log("nodes1", nodes);
  }
  const N = d3.map(nodes, nodeId);

  // Replace the input nodes and links with mutable objects for the simulation
  // 重新组合数据，用于被 sankey() 处理
  // nodes = d3.map(nodes, (_, i) => ({ id: N[i] }));

  // console.log("nodes2", nodes);
  links = d3.map(links, (_, i) => ({
    source: LS[i],
    target: LT[i],
    value: LV[i],
  }));

  const G = nodeGroup == null ? null : d3.map(nodes, nodeGroup);

  // Compute default domains.
  if (G && nodeGroups === undefined) nodeGroups = G;

  // Construct the scales.
  const color = nodeGroup == null ? null : d3.scaleOrdinal(nodeGroups, colors);

  const sankeyGenerator = sankey()
    .nodeId(({ index: i }) => N[i])
    .nodeAlign(nodeAlign)
    .nodeWidth(nodeWidth)
    .nodePadding(nodePadding)
    .extent([
      [marginLeft, marginTop],
      [width - marginRight, height - marginBottom],
    ])({ nodes, links });
  // sankeyGenerator({ nodes, links });

  const svg = d3
    .create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

  const node = svg
    .append("g")
    .attr("stroke", nodeStroke)
    .attr("stroke-width", nodeStrokeWidth)
    .attr("stroke-opacity", nodeStrokeOpacity)
    // .attr("stroke-linejoin", nodeStrokeLinejoin);
    .selectAll("rect")
    .data(nodes)
    .join("rect")
    .attr("x", (d) => d.x0)
    .attr("y", (d) => d.y0)
    .attr("width", (d) => d.x1 - d.x0)
    .attr("height", (d) => d.y1 - d.y0);

  if (G) node.attr("fill", ({ index: i }) => color(G[i]));
};

onMounted(() => {
  // data
  d3.json("/energy.json").then((data) => {
    // data: Array<{ source: string, target: string, value: number }>
    const links = data;
    drawSankey(
      { links },
      {
        nodeGroup: (d) => d.id.split(/\W/)[0], // take first word for color
      }
    );
  });
});
</script>

<template>
  <div id="sankey"></div>
</template>

<style scoped></style>
