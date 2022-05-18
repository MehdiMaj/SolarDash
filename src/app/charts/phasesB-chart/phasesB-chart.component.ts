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
  selector: 'app-chart-phasesB',
  templateUrl: './phasesB-chart.component.html',
  styleUrls: ['./phaseB-chart.component.css'],
})
export class PhasesBChartComponent implements OnChanges {
  @Input() date: boolean;
  @Input() sensor: Sensor;

  PowerFactorPhaseB = [];
  ActivePowerPhaseB = [];
  CurrentPhaseB = [];
  VoltagePhaseB = [];
  createdAt = [];
  public lineChartData: ChartConfiguration['data'] = {
    datasets: [],
  };
  public lineChartOptions: ChartConfiguration['options'] = {};
  public lineChartType: ChartType = 'line';
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  constructor() {}
  ngOnChanges(changes: SimpleChanges): void {
    this.chart?.update();
    this.PowerFactorPhaseB = [this.sensor].map((element) =>
      element.sensorId.ActivePowerTipahse.map((el) => el.PowerFactorPhaseB)
    );
    this.ActivePowerPhaseB = [this.sensor].map((element) =>
      element.sensorId.ActivePowerTipahse.map((el) => el.ActivePowerPhaseB)
    );
    this.CurrentPhaseB = [this.sensor].map((element) =>
      element.sensorId.Voltage_CurrentrTipahse.map((el) => el.CurrentPhaseB)
    );
    this.VoltagePhaseB = [this.sensor].map((element) =>
      element.sensorId.Voltage_CurrentrTipahse.map((el) => el.VoltagePhaseB)
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
          data: this.ActivePowerPhaseB[0],
          label: 'Active Power PhaseB',
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
          data: this.PowerFactorPhaseB[0],
          label: 'Power Factor PhaseB',
          yAxisID: 'y-axis-1',
          backgroundColor: 'rgba(148,159,177,0.2)',
          borderColor: 'rgba(148,159,177,1)',
          pointBackgroundColor: 'rgba(148,159,177,1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(148,159,177,0.8)',
          fill: 'origin',
        },
        {
          data: this.CurrentPhaseB[0],
          label: 'Current PhaseB',
          yAxisID: 'y-axis-1',
          backgroundColor: 'rgb(217,255,241,0.3)',
          borderColor: 'rgb(57,116, 94)',
          pointBackgroundColor: 'rgb(57, 116, 94)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(57, 116, 94)',
          fill: 'origin',
        },
        {
          data: this.VoltagePhaseB[0],
          label: 'Voltage PhaseB',
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
              value: 'March',
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
