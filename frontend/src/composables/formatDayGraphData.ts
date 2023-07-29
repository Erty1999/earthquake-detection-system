export default async function formatDayGraphData(points: any) {
  const graphData = {} as any;
  const graphXvalues = Object.keys(points);
  const graphYvalues = Object.values(points).map((value) => {
    if (value === "pacific") return 0;
    if (value === "low") return 1;
    if (value === "high") return 2;
  });

  graphData["options"] = {
    chart: {
      id: "lastDayData",
      type: "line",
      toolbar: {
        show: true,
        tools: {
          download: true,
          zoom: false,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: false,
        },
        export: {
          csv: {
            filename: "lastDayData",
          },
        },
      },
    },
    stroke: {
      curve: "stepline",
    },
    dataLabels: {
      style: {
        colors: ["#F44336", "#E91E63", "#9C27B0"],
      },
    },
    xaxis: {
      categories: graphXvalues,
      labels: {
        formatter: (value: any) => {
          const date = new Date(+value);
          return date.toLocaleString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            timeZone: "Europe/Rome",
          });
        },
      },
    },
    yaxis: {
      tickAmount: 2,
      labels: {
        formatter: (value: number) => {
          if (value === 0) return "Pacific";
          if (value === 1) return "Low Alert";
          if (value === 2) return "High Alert";
        },
        style: {
          colors: ["#228B22", "#b71111", "#fe9511"],
          fontWeight: "bold",
        },
      },
    },
  };

  graphData["series"] = [
    {
      name: "alert",
      data: graphYvalues,
    },
  ];

  return graphData;
}
