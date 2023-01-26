function createMap() {
  Promise.all([
    d3.json("../../data/world.topojson"),
    d3.csv("../../data/cityies.csv"),
  ]).then(([countries, cities]) => {
    const svg = d3.select("svg");
    // draw with topojson data
    drawMap3(countries);
    function drawMap3(topoCountries) {
      const countries = topojson.feature(
        topoCountries,
        topoCountries.objects.countries
      );
      // console.log(topoCountries);
      const projection = d3
        .geoMollweide()
        .scale(120)
        .translate([300, 300])
        .center([20, 0]);
      const geoPath = d3.geoPath().projection(projection);
      const featureSize = d3.extent(countries.features, (d) => geoPath.area(d));
      const countryColor = d3
        .scaleQuantize()
        .domain(featureSize)
        .range(colorbrewer.Reds[7]);
      const graticule = d3.geoGraticule();
      svg
        .append("path")
        .datum(graticule)
        .attr("class", "graticule line")
        .attr("d", geoPath);
      svg
        .append("path")
        .datum(graticule.outline)
        .attr("class", "graticule outline")
        .attr("d", geoPath);
      svg
        .selectAll("path.countries")
        .data(countries.features)
        .enter()
        .append("path")
        .attr("d", geoPath)
        .attr("class", "countries")
        .style("fill", (d) => countryColor(geoPath.area(d)))
        .style("stroke", "none");
      mergeAt(0);
      function mergeAt(mergePoint) {
        const filteredCountries =
          topoCountries.objects.countries.geometries.filter((d) => {
            const thisCenter = d3.geoCentroid(
              topojson.feature(topoCountries, d)
            );
            return thisCenter[1] > mergePoint ? true : null;
          });
        d3.select("svg")
          .append("g")
          .datum(topojson.merge(topoCountries, filteredCountries))
          .insert("path")
          .attr("class", "merged")
          .attr("d", geoPath);
      }

      const neighbors = topojson.neighbors(
        topoCountries.objects.countries.geometries
      );
      d3.selectAll("path.countries")
        .on("mouseover", findNeighbors)
        .on("mouseout", clearNeighbors);
      function findNeighbors(event, d) {
        const index = countries.features.findIndex(
          (feature) => feature.id === d.id
        );
        console.log(d, countries, neighbors, index);
        d3.select(this).style("fill", "#FE9922");
        d3.selectAll("path.countries")
          .filter((p, q) => neighbors[index].includes(q))
          .style("fill", "#41A368");
      }
      function clearNeighbors() {
        d3.selectAll("path.countries").style("fill", "#C4B9AC");
      }
    }

    // drawMercator();

    function drawMercator() {
      const mercatorProj = d3.geoMercator().scale(90).translate([300, 300]);
      const geoPath = d3.geoPath().projection(mercatorProj);

      svg
        .selectAll("path")
        .data(countries.features)
        .join("path")
        .attr("d", geoPath)
        .attr("class", "countries");
      svg
        .selectAll("circle")
        .data(cities)
        .join("circle")
        .attr("class", "cities")
        .attr("r", 3)
        .attr("cx", (d) => mercatorProj([d.x, d.y])[0])
        .attr("cy", (d) => mercatorProj([d.x, d.y])[1]);
    }
    const projections = {
      mollweide: d3.geoMollweide().scale(110).translate([300, 300]),
      orthographic: d3
        .geoOrthographic()
        .scale(200)
        .translate([300, 300])
        .center([0, 0]),
    };
    // drawMap("orthographic");
    function drawMap(projectionType = "mollweide") {
      drawCommonMap(projections[projectionType]);
    }

    function drawCommonMap(projection) {
      const geoPath = d3.geoPath().projection(projection);
      const featureSize = d3.extent(countries.features, (d) => geoPath.area(d));
      const countryColor = d3
        .scaleQuantize()
        .domain(featureSize)
        .range(colorbrewer.Reds[7]);
      svg
        .selectAll("path")
        .data(countries.features)
        .join("path")
        .attr("class", "countries")
        .attr("d", geoPath)
        .style("fill", (d) => countryColor(geoPath.area(d)))
        .style("stroke", (d) => d3.rgb(countryColor(geoPath.area(d))).darker());
      svg
        .selectAll("circle")
        .data(cities)
        .join("circle")
        .attr("class", "cities")
        .attr("r", 3)
        .attr("cx", (d) => projection([d.x, d.y])[0])
        .attr("cy", (d) => projection([d.x, d.y])[1]);

      // 添加标线
      const graticule = d3.geoGraticule();
      svg
        .insert("path", "path.countries")
        .datum(graticule)
        .attr("class", "graticule line")
        .attr("d", geoPath);
      svg
        .insert("path", "path.countries")
        .datum(graticule.outline)
        .attr("class", "graticule outline")
        .attr("d", geoPath);

      // hover 显示国家的bounds box 和 中心点
      svg
        .selectAll("path.countries")
        .on("mouseover", centerBounds)
        .on("mouseout", clearCenterBounds);
      function centerBounds(event, d) {
        // console.log("mouseover", d);
        const bounds = geoPath.bounds(d);
        const center = geoPath.centroid(d);
        svg
          .append("rect")
          .attr("class", "bbox")
          .attr("x", bounds[0][0])
          .attr("y", bounds[0][1])
          .attr("width", bounds[1][0] - bounds[0][0])
          .attr("height", bounds[1][1] - bounds[0][1]);
        svg
          .append("circle")
          .attr("class", "centroid")
          .attr("r", 5)
          .attr("cx", center[0])
          .attr("cy", center[1]);
      }
      function clearCenterBounds() {
        d3.selectAll("circle.centroid").remove();
        d3.selectAll("rect.bbox").remove();
      }

      // 根据地区的地理面积设置颜色范围
      const featureData = d3.selectAll("path.countries").data();
      const realFearureSize = d3.extent(featureData, (d) => d3.geoArea(d));
      const newFeatureColor = d3
        .scaleQuantile()
        .domain(realFearureSize)
        .range(colorbrewer.Reds[7]);

      // 添加zoom
      const mapZoom = d3.zoom().on("zoom", zoomRotate);
      const zoomSettings = d3.zoomIdentity.translate(300, 300).scale(200);
      // 将 transform 的 x 值转为degrees
      const rotateScale = d3
        .scaleLinear()
        .domain([-600, 0, 600])
        .range([-180, 0, 180]);
      svg.call(mapZoom).call(mapZoom.transform, zoomSettings);
      function zoomed(evt) {
        // console.log("d3.event", evt);
        projection
          .translate([evt.transform.x, evt.transform.y])
          .scale(evt.transform.k);
        d3.selectAll("path.graticule").attr("d", geoPath);
        d3.selectAll("path.countries").attr("d", geoPath);
        d3.selectAll("circle.cities")
          .attr("cx", (d) => projection([d.x, d.y])[0])
          .attr("cy", (d) => projection([d.x, d.y])[1]);
      }
      function zoomRotate(evt) {
        const { x, k } = evt.transform;
        rotateGlobes(x, k);
      }

      let transformX = 0;

      let t = setInterval(() => {
        rotateGlobes(transformX, 200);
        transformX += 2;
      }, 50);

      function rotateGlobes(transformX, transformK) {
        // 将 x 轴平移的值转为旋转的角度
        const currentRotate = rotateScale(transformX) % 360;
        projection.rotate([currentRotate, 0]).scale(transformK);

        // 更新地图的path
        d3.selectAll("path.graticule").attr("d", geoPath);
        d3.selectAll("path.countries")
          .attr("d", geoPath)
          .style("fill", (d) => newFeatureColor(d3.geoArea(d)))
          .style("stroke", (d) =>
            d3.rgb(countryColor(geoPath.area(d))).darker()
          );
        // return;
        d3.selectAll("circle.cities").each(function (d, i) {
          var projectedPoint = projection([+d.x, +d.y]);
          var x = parseInt(d.x);
          // 隐藏不在当前view中的点
          var display =
            (x + currentRotate < 90 && x + currentRotate > -90) ||
            (x + currentRotate < -270 && x + currentRotate > -450) ||
            (x + currentRotate > 270 && x + currentRotate < 450)
              ? "block"
              : "none";
          d3.select(this)
            .attr("cx", projectedPoint[0])
            .attr("cy", projectedPoint[1])
            .style("display", display);
        });
      }

      // 使用 button 控制 zoom
      function zoomButton(zoomDirection) {
        const width = 600;
        const height = 600;
        const newScale = zoomDirection === "in" ? 1.5 : 0.75;

        const newZoom = projection.scale() * newScale;
        // 需要重新计算 center
        const newX =
          (projection.translate()[0] - width / 2) * newScale + width / 2;
        const newY =
          (projection.translate()[1] - height / 2) * newScale + height / 2;

        const newZoomSettings = d3.zoomIdentity
          .translate(newX, newY)
          .scale(newZoom);
        svg.transition().duration(500).call(mapZoom.transform, newZoomSettings);
      }
      // draw buttons
      d3.select("#controls")
        .append("button")
        .on("click", () => {
          zoomButton("in");
        })
        .html("Zoom in");
      d3.select("#controls")
        .append("button")
        .on("click", () => {
          zoomButton("out");
        })
        .html("Zoom out");
    }
  });
}

createMap();
