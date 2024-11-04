import { ApexChart, ApexDataLabels, ApexFill, ApexLegend, ApexNonAxisChartSeries, ApexResponsive } from "ng-apexcharts";

type ChartType = 'pie' | 'bar' | 'line' | 'scatter' | 'bubble' | 'doughnut' | 'polarArea' | 'radar';

export type ChartOptions = {
    series: ApexNonAxisChartSeries;
    chart: ApexChart;
    responsive: ApexResponsive[];
    labels: any;
    fill: ApexFill;
    legend: ApexLegend;
    dataLabels: ApexDataLabels;
  };