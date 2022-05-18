export interface Sensor {
  sensorId: {
    ActivePowerTipahse: [
      {
        ActivePowerTotal: string;
        createdAt: Date;
        ActivePowerPhaseA: string;
        ActivePowerPhaseB: string;
        ActivePowerPhaseC: string;
        PowerFactorPhaseA: string;
        PowerFactorPhaseB: string;
        PowerFactorPhaseC: string;
      }
    ];
    Temperature: [
      {
        temperature: string;
        createdAt: Date;
      }
    ];
    Humidite: [
      {
        humidite: string;
        createdAt: Date;
      }
    ];
    ConsomationTripahse: [{ ComActiveTotal: string; createdAt: Date }];
    ReverserTipahse: [{ ReverseActiveTotal: string; createdAt: Date }];
    PositiveTripahse: [{ PositiveActiveTotal: string; createdAt: Date }];
    Voltage_CurrentrTipahse: [
      {
        CurrentPhaseA: string;
        VoltagePhaseA: string;
        CurrentPhaseB: string;
        VoltagePhaseB: string;
        createdAt: Date;
      }
    ];
    sensorId: string;
  };
  id: string;
  zone: string;
}
