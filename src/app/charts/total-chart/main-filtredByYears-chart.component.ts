import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Sensor } from '../../sensors/sensor.model';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import * as annotation from 'chartjs-plugin-annotation';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-main-chart-by-year',
  templateUrl: './main-filtredByYears-chart.component.html',
  styleUrls: ['./main-chart.component.css'],
})
export class MainChartByYearComponent implements OnChanges {
  @Input() date: boolean;
  @Input() sensor: any;
  ActivePowerTotal = [];
  ReverseActiveTotal = [];
  ComActiveTotal = [];
  PositiveActiveTotal = [];
  createdAt = [];
  public barChartData: ChartData<'bar'> = {
    datasets: [],
  };
  public barChartOptions: ChartConfiguration['options'] = {};
  public barChartType: ChartType = 'bar';
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  public barChartPlugins = [DataLabelsPlugin];
  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    this.ReverseActiveTotal = Object.values(this.sensor.Production[0]).map(
      (element) => element['value']
    );

    this.ComActiveTotal = Object.values(this.sensor.ComActiveTotal[0]).map(
      (element) => element['value']
    );

    this.PositiveActiveTotal = Object.values(
      this.sensor['Consommation(kwh)'][0]
    ).map((element) => element['value']);

    this.createdAt = Object.values(this.sensor.Production[0]).map(
      (element) => element['createdAt']
    );

    this.barChartData = {
      labels: this.createdAt,
      datasets: [
        {
          data: this.ReverseActiveTotal,
          label: 'Production',
        },
        {
          data: this.ComActiveTotal,
          label: 'Com Active Total',
        },
        {
          data: this.PositiveActiveTotal,
          label: 'Consommation(Kwh)',
        },
      ],
    };

    this.barChartOptions = {
      responsive: true,
      // We use these empty structures as placeholders for dynamic theming.
      scales: {
        x: {},
        y: {},
      },
      plugins: {
        legend: {
          display: true,
        },
        datalabels: {
          anchor: 'end',
          align: 'end',
        },
      },
    };
  }
}
