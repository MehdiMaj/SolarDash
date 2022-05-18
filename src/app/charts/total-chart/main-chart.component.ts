import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Sensor } from '../../sensors/sensor.model';
import { ChartConfiguration, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import * as annotation from 'chartjs-plugin-annotation';

@Component({
  selector: 'app-main-chart',
  templateUrl: './main-chart.component.html',
  styleUrls: ['./main-chart.component.css'],
})
export class MainChartComponent implements OnChanges {
  @Input() date: boolean;
  @Input() sensor: Sensor;
  ActivePowerTotal = [];
  ReverseActiveTotal = [];
  ComActiveTotal = [];
  PositiveActiveTotal = [];
  createdAt = [];
  public lineChartData: ChartConfiguration['data'] = {
    datasets: [],
  };
  public lineChartOptions: ChartConfiguration['options'] = {};
  public lineChartType: ChartType = 'line';
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.sensor);
    this.chart?.update();
    this.ActivePowerTotal = [this.sensor].map((element) =>
      element.sensorId.ActivePowerTipahse.map((el) => el.ActivePowerTotal)
    );
    this.ReverseActiveTotal = [this.sensor].map((element) =>
      element.sensorId.ReverserTipahse.map((el) => el.ReverseActiveTotal)
    );
    this.ComActiveTotal = [this.sensor].map((element) =>
      element.sensorId.ConsomationTripahse.map((el) => el.ComActiveTotal)
    );
    this.PositiveActiveTotal = [this.sensor].map((element) =>
      element.sensorId.PositiveTripahse.map((el) => el.PositiveActiveTotal)
    );
    this.createdAt = [this.sensor].map((element) =>
      element.sensorId.ActivePowerTipahse.map((el) => el.createdAt)
    );
    const date = [];
    for (var i in this.createdAt[0]) {
      let unixTimeStampFormated = new Date(this.createdAt[0][i]);
      date.push(unixTimeStampFormated.toLocaleString());
    }
    this.lineChartData = {
      datasets: [
        {
          data: this.ActivePowerTotal[0],
          label: 'Active Power Total',
          yAxisID: 'y-axis-1',
          backgroundColor: 'rgba(255,0,0,0.3)',
          borderColor: 'red',
          pointBackgroundColor: 'rgba(148,159,177,1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(148,159,177,0.8)',
          fill: 'origin',
        },
        {
          data: this.PositiveActiveTotal[0],
          label: 'Positive Active Total',
          yAxisID: 'y-axis-0',
          backgroundColor: 'rgb(243, 255, 243,0.5)',
          borderColor: 'green',
          pointBackgroundColor: 'rgba(148,159,177,1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(148,159,177,0.8)',
          fill: 'origin',
        },
        {
          data: this.ReverseActiveTotal[0],
          yAxisID: 'y-axis-1',
          label: 'Reverse Active Total',
          backgroundColor: 'rgba(148,159,177,0.2)',
          borderColor: 'rgba(148,159,177,1)',
          pointBackgroundColor: 'rgba(148,159,177,1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(148,159,177,0.8)',
          fill: 'origin',
        },
        {
          data: this.ComActiveTotal[0],
          label: 'Consomation Active Total',
          yAxisID: 'y-axis-0',
          backgroundColor: 'rgba(77,83,96,0.2)',
          borderColor: 'rgba(77,83,96,1)',
          pointBackgroundColor: 'rgba(77,83,96,1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(77,83,96,1)',
          fill: 'origin',
        },
      ],
      labels: date,
    };

    this.lineChartOptions = {
      elements: {
        line: {
          tension: 0.5,
        },
      },
      scales: {
        // We use this empty structure as a placeholder for dynamic theming.
        x: {},
        'y-axis-0': {
          position: 'left',
        },
        'y-axis-1': {
          position: 'right',
          grid: {
            color: 'rgba(255,0,0,0.3)',
          },
          ticks: {
            color: 'red',
          },
        },
      },

      plugins: {
        legend: { display: true },
        annotation: {
          annotations: [
            {
              type: 'line',
              scaleID: 'x',
              value: date[0],
              borderColor: 'orange',
              borderWidth: 2,
              label: {
                position: 'center',
                enabled: true,
                color: 'orange',
                content: 'LineAnno',
                font: {
                  weight: 'bold',
                },
              },
            },
          ],
        },
      },
    };
  }
}
