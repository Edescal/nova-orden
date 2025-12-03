import React, { useEffect } from "react";
import { create, useTheme } from "@amcharts/amcharts4/core";
import { CategoryAxis, ColumnSeries, ValueAxis, XYChart } from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

const ProductoChart = () => {
  useEffect(() => {
    // Usar el tema animado sin applyTheme
    useTheme(am4themes_animated);

    // Crear gráfico XY
    const chart = create("chartdiv", XYChart);

    // Definir los datos
    chart.data = [
      { category: "Aadasds", value: 3 },
      { category: "Basdas", value: 5 },
      { category: "Casdasdkkkkk", value: 9 },
    ];

    // Crear los ejes
    const categoryAxis = chart.xAxes.push(new CategoryAxis());
    categoryAxis.dataFields.category = "category";
    categoryAxis.renderer.grid.template.location = 0;

    const valueAxis = chart.yAxes.push(new ValueAxis());

    // Crear la serie de columnas (barras)
    const series = chart.series.push(new ColumnSeries());
    series.dataFields.valueY = "value";
    series.dataFields.categoryX = "category";
    series.name = "Series";

    // Limpiar el gráfico al desmontar el componente
    return () => {
      chart.dispose();
    };
  }, []);

  return <div id="chartdiv" style={{ width: "100%", height: "auto" }}></div>;
};

export default ProductoChart;
