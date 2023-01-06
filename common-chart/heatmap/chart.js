async function drawHeatMap() {
  const locale = d3.timeFormatLocale({
    dateTime: "%a %b %e %X %Y",
    date: "%Y/%-m/%-d",
    time: "%H:%M:%S",
    periods: ["上午", "下午"],
    days: [
      "星期日",
      "星期一",
      "星期二",
      "星期三",
      "星期四",
      "星期五",
      "星期六",
    ],
    shortDays: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
    months: [
      "一月",
      "二月",
      "三月",
      "四月",
      "五月",
      "六月",
      "七月",
      "八月",
      "九月",
      "十月",
      "十一月",
      "十二月",
    ],
    shortMonths: [
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
    ],
  });

  // 1.access data
  let dataset = await d3.json("../../data/my_weather_data.json");

  // convert date string to Date object
  const parseDate = d3.timeParse("%Y-%m-%d");
  const dateAccessor = (d) => parseDate(d.date);
  // 按时间升序排列
  dataset = dataset.sort((a, b) => dateAccessor(a) - dateAccessor(b));
  const firstDate = dateAccessor(dataset[0]);

  const weekFormat = d3.timeFormat("%-e");
  const xAccessor = (d) => d3.timeWeeks(firstDate, dateAccessor(d)).length;
  const dayOfWeekFormat = d3.timeFormat("%-w");
  // 当天是一周中的第几天 [0(sunday),6]
  const yAccessor = (d) => +dayOfWeekFormat(dateAccessor(d));

  // 2.dimensions
  const numberOfWeeks = Math.ceil(dataset.length / 7) + 1;
  const dimensions = {
    width: window.innerWidth * 0.8,
    margin: {
      top: 30,
      right: 0,
      bottom: 0,
      left: 80,
    },
  };
  dimensions.boundedWidth =
    dimensions.width - dimensions.margin.left - dimensions.margin.right;
  // 每个区块是正方性，所以有高与宽的关系：height= (width / numberOfWeeks) * 7,
  dimensions.boundedHeight = (dimensions.boundedWidth / numberOfWeeks) * 7;
  dimensions.height =
    dimensions.boundedHeight + dimensions.margin.top + dimensions.margin.bottom;

  // 3.draw canvas
  const wrapper = d3
    .select("#wrapper")
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height);

  const bounds = wrapper
    .append("g")
    .style(
      "transform",
      `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`
    );

  // 4.scales
  const barPadding = 1;
  // 整体区块的大小（含paddiing）
  const totalBarDimension = d3.min([
    dimensions.boundedWidth / numberOfWeeks,
    dimensions.boundedHeight / 7,
  ]);
  // 单个区块的大小
  const barDimension = totalBarDimension - barPadding;

  // 5.draw data
  const monthFormat = locale.format("%B");
  // 月份文字
  const months = bounds
    .selectAll(".month")
    .data(
      d3.timeMonths(
        dateAccessor(dataset[0]),
        dateAccessor(dataset[dataset.length - 1])
      )
    )
    .enter()
    .append("text")
    .attr("class", "month")
    .attr(
      "transform",
      (d) =>
        `translate(${
          totalBarDimension * d3.timeWeeks(firstDate, d).length
        }, -10)`
    )
    .text((d) => monthFormat(d));

  const dayOfWeekParse = d3.timeParse("%-e");
  const dayOfWeekTickFormat = locale.format("%-a");
  const labels = bounds
    .selectAll(".label")
    .data(new Array(7).fill(null).map((d, i) => i))
    .enter()
    .append("text")
    .attr("class", "label")
    .attr(
      "transform",
      (d) => `translate(-20, ${totalBarDimension * (d + 0.8)})`
    )
    .text((d) => dayOfWeekTickFormat(dayOfWeekParse(d)));

  const drawDays = (metric) => {
    d3.select("#metric").text(metric);
    const colorAccessor = (d) => d[metric];
    const colorRangeDomain = d3.extent(dataset, colorAccessor);
    const colorRange = d3
      .scaleLinear()
      .domain(colorRangeDomain)
      .range([0, 1])
      .clamp(true);
    const colorGradient = d3.interpolateHcl("#ecf0f1", "#5758BB");
    const colorScale = (d) => colorGradient(colorRange(d) || 0);

    d3.select("#legend-min").text(colorRangeDomain[0]);
    d3.select("#legend-max").text(colorRangeDomain[1]);
    d3.select("#legend-gradient").style(
      "background",
      `linear-gradient(to right, ${new Array(10)
        .fill(null)
        .map((d, i) => `${colorGradient(i / 9)} ${(i * 100) / 9}%`)
        .join(", ")})`
    );

    const days = bounds.selectAll(".day").data(dataset, (d) => d.date);
    const newDays = days.enter().append("rect");

    const allDays = newDays
      .merge(days)
      .attr("class", "day")
      .attr("x", (d) => totalBarDimension * xAccessor(d))
      .attr("width", barDimension)
      .attr("y", (d) => totalBarDimension * yAccessor(d))
      .attr("height", barDimension)
      .style("fill", (d) => colorScale(colorAccessor(d)));
    const oldDots = days.exit().remove();
  };

  drawDays("moonPhase");
}

drawHeatMap();
