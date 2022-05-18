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
  selector: 'app-temperature-chart',
  templateUrl: './temperatureAndHumidity.component.html',
  styleUrls: ['./temperature-chart.component.css'],
})
export class TemperatureAndHumidityComponent implements OnChanges {
  @Input() date: boolean;
  @Input() sensor: Sensor;
  Temperature = [];
  Humidity = [];
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
    this.Temperature = this.sensor.sensorId.Temperature.map(
      (el) => el.temperature
    );

    this.Humidity = this.sensor.sensorId.Humidite.map((el) => el.humidite);
    this.createdAt = this.sensor.sensorId.Temperature.map((el) => el.createdAt);
    console.log(this.createdAt);
    const date = [];
    for (var i in this.createdAt) {
      let unixTimeStampFormated = new Date(this.createdAt[i]);
      date.push(unixTimeStampFormated.toLocaleString());
    }
    console.log(date);
    this.lineChartData = {
      datasets: [
        {
          data: this.Temperature,
          label: 'Temperature(°C)',
          yAxisID: 'y-axis-0',
          backgroundColor: 'rgba(255,0,0,0.3)',
          borderColor: 'red',
          pointBackgroundColor: 'rgba(148,159,177,1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(148,159,177,0.8)',
          fill: 'origin',
        },
        {
          data: this.Humidity,
          label: 'Humidity(%)',
          yAxisID: 'y-axis-1',
          backgroundColor: 'rgba(128,139,244,0.3)',
          borderColor: 'rgba(29,35,104,1)',
          pointBackgroundColor: 'rgba(29,35,104,1)',
          pointBorderColor: 'rgba(128,139,244,0.3)',
          pointHoverBackgroundColor: 'rgba(128,139,244,0.3)',
          pointHoverBorderColor: 'rgba(29,35,104,1)',
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
