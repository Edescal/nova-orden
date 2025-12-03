import React, { useEffect } from "react";
import { create, useTheme } from "@amcharts/amcharts4/core";
import { CategoryAxis, ColumnSeries, ValueAxis, XYChart } from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

const ProductoChart = () => {
  useEffect(() => {
    useTheme(am4themes_animated);
    const chart = create("chartdiv", XYChart);
    chart.data = [
      { category: "Aadasds", value: 3 },
      { category: "Basdas", value: 5 },
      { category: "Casdasdkkkkk", value: 9 },
    ];

    const categoryAxis = chart.xAxes.push(new CategoryAxis());
    categoryAxis.dataFields.category = "category";
    categoryAxis.renderer.grid.template.location = 0;

    const labelTemplate = categoryAxis.renderer.labels.template;
    labelTemplate.fontSize = 12; // Reducir tamaño de las etiquetas
    labelTemplate.wrap = true;   // Permitir que las etiquetas se ajusten
    labelTemplate.maxWidth = 100; // Ancho máximo para el texto antes de que se ajuste

    const valueAxis = chart.yAxes.push(new ValueAxis());

    const series = chart.series.push(new ColumnSeries());
    series.dataFields.valueY = "value";
    series.dataFields.categoryX = "category";
    series.name = "Series";

    return () => {
      chart.dispose();
    };
  }, []);

  return <div id="chartdiv" style={{ width: "100%", height: '65%' }}></div>;
};

export default ProductoChart;
