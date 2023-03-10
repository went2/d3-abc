import "./App.css";

import worldData from "./data/world";
import { range, sum } from "d3-array";
import { scaleThreshold } from "d3-scale";
import { geoCentroid } from "d3-geo";
import { useEffect, useState } from "react";

import BarChart from "./components/BarChart";
import WorldMap from "./components/WorldMap";
import StreamGraph from "./components/StreamGraph";
import Brush from "./components/Brush";
import StatLine from "./components/StatLine";

const appData = worldData.features.filter((d) => geoCentroid(d)[0] < -20);

appData.forEach((d, i) => {
  const offset = Math.random();
  d.launchday = i;
  d.data = range(30).map((p, q) => (q < i ? 0 : Math.random() * 2 + offset));
});

function App() {
  const [size, setSize] = useState({ width: 1000, height: 500 });
  const [hoveredEle, setHoveredEle] = useState("none");
  const [brushExtent, setBrushExtent] = useState([0, 40]);

  function onResize() {
    // console.log("onresize");
    setSize({
      width: window.innerWidth,
      height: window.innerHeight - 70,
    });
  }

  function onHover(hoveredId) {
    // console.log("sethovered", hoveredId);
    setHoveredEle(hoveredId);
  }

  function onBrush(d) {
    setBrushExtent(d);
  }

  useEffect(() => {
    window.addEventListener("resize", onResize, false);
    // setWidth(window.innerWidth);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, [size]);

  const colorScale = scaleThreshold()
    .domain([5, 10, 20, 30, 50])
    .range(["#75739F", "#5EAFC6", "#41A368", "#93C464", "#FE9922"]);

  const filteredAppData = appData.filter(
    (d, i) => d.launchday >= brushExtent[0] && d.launchday <= brushExtent[1]
  );

  return (
    <div className="App">
      <header className="App-header">
        <h2>Dashboard demo in d3-in-action with interactivity</h2>
      </header>
      <StatLine allData={appData} filteredData={filteredAppData} />
      <div>
        <StreamGraph
          colorScale={colorScale}
          data={filteredAppData}
          size={[size.width, size.height / 2]}
          hoverEle={hoveredEle}
          onHover={onHover}
        />
        <Brush size={[size.width, 60]} changeBrush={onBrush} />

        <WorldMap
          colorScale={colorScale}
          data={filteredAppData}
          size={[size.width * 0.48, size.height / 2]}
          hoverEle={hoveredEle}
          onHover={onHover}
        />
        <BarChart
          colorScale={colorScale}
          data={filteredAppData}
          size={[size.width * 0.48, size.height / 2]}
          hoverEle={hoveredEle}
          onHover={onHover}
        />
      </div>
    </div>
  );
}

export default App;
