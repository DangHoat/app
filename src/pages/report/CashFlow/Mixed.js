import React from "react";
import Chart from "react-apexcharts";
import { connect } from "react-redux";

import { Card, CardBody, CardHeader, CardTitle } from "reactstrap";

const MixedChart = ({ theme }) => {
  const data = [
    {
      name: "Expenses",
      type: "column",
      data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30]
    },
    {
      name: "Revenue",
      type: "area",
      data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43]
    },
    {
      name: "Profit",
      type: "line",
      data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39]
    }
  ];

  const options = {
    chart: {
      stacked: false
    },
    stroke: {
      width: [0, 2, 5],
      curve: "smooth"
    },
    plotOptions: {
      bar: {
        columnWidth: "50%"
      }
    },
    fill: {
      opacity: [0.85, 0.25, 1],
      gradient: {
        inverseColors: false,
        shade: "light",
        type: "vertical",
        opacityFrom: 0.85,
        opacityTo: 0.55,
        stops: [0, 100, 100, 100]
      }
    },
    labels: [
      "01/01/2003",
      "02/01/2003",
      "03/01/2003",
      "04/01/2003",
      "05/01/2003",
      "06/01/2003",
      "07/01/2003",
      "08/01/2003",
      "09/01/2003",
      "10/01/2003",
      "11/01/2003"
    ],
    markers: {
      size: 0
    },
    xaxis: {
      type: "datetime"
    },
    yaxis: {
      title: {
        text: "$"
      },
      min: 0
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: function(y) {
          if (typeof y !== "undefined") {
            return y.toFixed(0) + " points";
          }
          return y;
        }
      }
    },
    colors: [
      theme.primary,
      theme.success,
      theme.warning,
      theme.danger,
      theme.info
    ]
  };

  return (
    <Card>
      <CardHeader className="border-top">
        <CardTitle tag="h3" className="text-center font-weight-bolder text-danger my-4">PHASE BUDGET CHART 01/01/2019 - 31/12/2019</CardTitle>
      </CardHeader>
      <CardBody>
        <div className="chart">
          <Chart options={options} series={data} type="line" height="350" />
        </div>
      </CardBody>
    </Card>
  );
};

export default connect(store => ({
  theme: store.theme.currentTheme
}))(MixedChart);
