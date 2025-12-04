import React, { useEffect } from "react";
import { color, create, ease, Label, useTheme } from "@amcharts/amcharts4/core";
import { CategoryAxis, ColumnSeries, ValueAxis, XYChart } from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import AxiosInstance from "../../context/AuthContext";

const ProductoChart = () => {
  const [productos, setProductos] = React.useState([]);
  useEffect(() => {
    (async () => {
      const response = await AxiosInstance.get('/api/utils/top-productos/');
      if (response) {
        const data = response.data.results.map(({ nombre, total_vendido }) => ({ 'category': nombre, 'value': total_vendido }));
        console.log(response.data.results);
        console.log(data)
        setProductos(data);
      }
    })()
  }, [])

  useEffect(() => {
    if (productos.length === 0) return;

    useTheme(am4themes_animated);
    const chart = create("chartdiv", XYChart);
    chart.data = productos;

    const categoryAxis = chart.xAxes.push(new CategoryAxis());
    categoryAxis.dataFields.category = "category";
    categoryAxis.renderer.grid.template.location = 0;

    const labelTemplate = categoryAxis.renderer.labels.template;
    labelTemplate.fontSize = 12; // Reducir tamaño de las etiquetas
    labelTemplate.wrap = true;   // Permitir que las etiquetas se ajusten
    labelTemplate.maxWidth = 200; // Ancho máximo para el texto antes de que se ajuste
    labelTemplate.fullWords = true


    const valueAxis = chart.yAxes.push(new ValueAxis());
    valueAxis.title.text = "Total Vendido";  // Título del eje Y

    const series = chart.series.push(new ColumnSeries());
    series.dataFields.valueY = "value";
    series.dataFields.categoryX = "category";
    series.name = "Ventas"

    const label = series.bullets.push(new Label());
    label.text = "{valueY}";
    label.fontSize = 14;
    label.fill = color("#000000");  // Color de la etiqueta de los valores
    label.stroke = 'none';  // Color de la etiqueta de los valores en negro
    label.strokeWidth = 0

    label.horizontalCenter = "middle";
    label.verticalCenter = "bottom";
    series.columns.template.fill = color("#c53232ff");  // Color inicial de las barras
    series.columns.template.stroke = color("#000000");  // Color del borde de las barras
    series.columns.template.strokeWidth = 0;
    series.columns.template.events.on("over", function (event) {
      const column = event.target;
      column.fill = color("#ff4141ff");  // Cambio de color al pasar el ratón
    });

    series.columns.template.events.on("out", function (event) {
      const column = event.target;
      column.fill = color("#c53232ff");  // Restaurar el color original
    });

    return () => {
      chart.dispose();
    };
  }, [productos]);

  return <div id="chartdiv" style={{ width: "100%", height: '65%' }}></div>;
};

export default ProductoChart;
