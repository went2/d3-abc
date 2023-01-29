import "./App.css";
import BarChart from "./components/BarChart";
import WorldMap from "./components/WorldMap";
import StreamGraph from "./components/StreamGraph";

import worldData from "./data/world";
import { range, sum } from "d3-array";
import { scaleThreshold } from "d3-scale";
import { geoCentroid } from "d3-geo";
import { useEffect, useState } from "react";

const appData = worldData.features.filter((d) => geoCentroid(d)[0] < -20);

appData.forEach((d, i) => {
  const offset = Math.random();
  d.launchday = i;
  d.data = range(30).map((p, q) => (q < i ? 0 : Math.random() * 2 + offset));
});

function App() {
  const [size, setSize] = useState({ width: 1000, height: 500 });

  function onResize() {
    console.log("onresize");
    setSize({
      width: window.innerWidth,
      height: window.innerHeight - 70,
    });
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

  return (
    <div className="App">
      <header className="App-header">
        <h2>Dashboard demo in d3-in-action chapter 9</h2>
      </header>
      <div>
        <StreamGraph
          colorScale={colorScale}
          data={appData}
          size={[size.width, size.height / 2]}
        />
        <WorldMap
          colorScale={colorScale}
          data={appData}
          size={[size.width * 0.48, size.height / 2]}
        />
        <BarChart
          colorScale={colorScale}
          data={appData}
          size={[size.width * 0.48, size.height / 2]}
        />
      </div>
    </div>
  );
}

export default App;
