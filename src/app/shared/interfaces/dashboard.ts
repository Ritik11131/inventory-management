type ChartType = 'pie' | 'bar' | 'line' | 'scatter' | 'bubble' | 'doughnut' | 'polarArea' | 'radar';

export interface ChartPanel {
  header: string;
  type: ChartType;
  data: any;
  options: any;
}