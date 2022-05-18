// import the `Kafka` instance from the kafkajs library
const { Kafka } = require("kafkajs");
const dotenv = require("dotenv");
const catchAsync = require("../utils/catchAsync");
const SensorGlobal = require("../models/sensorGlobalModel");

const { spawn } = require("child_process");
const { delay } = require("rxjs");
dotenv.config({ path: "./config.env" });

// create a new consumer from the kafka client, and set its group ID
// the group ID helps Kafka keep track of the messages that this client
// is yet to receive
// initialize a new kafka client
clientId = process.env.kafkaClientId;
brokers = [process.env.kafkaBroker];
topic = process.env.kafkaTopic;
const kafka = new Kafka({ clientId, brokers });

const consumer = kafka.consumer({ groupId: clientId });

const consume = catchAsync(async () => {
  // first, we wait for the client to connect and subscribe to the given topic
  await consumer.connect();
  await consumer.subscribe({ topic });
  await consumer.run({
    // this function is called every time the consumer gets a new message
    eachMessage: ({ message }) => {
      const obj = JSON.parse(message.value);
      exists(obj);
      delay(10000);
    },
  });
});

const exists = catchAsync(async (value) => {
  const sensor = await SensorGlobal.findOne({
    sensorId: value.DevEUI_uplink.DevEUI,
  });
  console.log(
    value.DevEUI_uplink.DevEUI,
    ": ",
    value.DevEUI_uplink.payload_hex
  );
  if (sensor) {
    const type = sensor.checkType();
    getAndSaveData(type, sensor, value);
  } else {
    console.log("unknown");
  }
});

function getAndSaveData(type, sensor, value) {
  if (type === "compteur") {
    decryptCompteur(value.DevEUI_uplink.payload_hex, sensor);
  } else if (type === "temperature") {
    decryptTemperature(value.DevEUI_uplink.payload_hex, sensor, value);
  }
}

const decryptTemperature = catchAsync(async function (data, sensor, value) {
  temp = parseInt(data.substring(8, 12), 16) / 10;
  console.log("temp", temp);
  hum = parseInt(data.substring(14, 18), 16) / 10;
  console.log("hum", hum);

  let object = {
    temperature: temp,
    humidite: hum,
    time: Date.parse(value.DevEUI_uplink.Time),
  };

  sensor.Temperature.push({
    temperature: object.temperature,
    createdAt: object.time,
  });
  sensor.Humidite.push({ humidite: object.humidite, createdAt: object.time });
  await sensor.save();
  //return objct
});

function decryptCompteur(payload, sensor) {
  let dataToSend = null;
  console.log(payload);
  const python = spawn("python3", [
    "backend/decrypt/decrypt.py",
    payload,
    "python",
  ]);

  python.stderr.on("data", function (data) {
    console.log(data.toString());
  });
  python.stdout.on("data", function (data) {
    dataToSend = data.toString();
    console.log(`dataTosendFromOnStart: ${dataToSend}`);
  });

  python.on("close", (code) => {
    console.log("dataTosendFromOnClose: " + dataToSend);
    if (!dataToSend) return;
    else {
      const frame = JSON.parse(dataToSend);

      UpdateValues(frame, sensor);
    }
  });
}

const UpdateValues = catchAsync(async function (frame, sensor) {
  frame.createdAt = Date.now();
  if (frame.DataIdentification === "0000FF00") {
    console.log("consomation");
    sensor.ConsomationTripahse.push(frame);
    //console.log("heloo",Sens.ConsomationTripahse)
  } else if (frame.DataIdentification === "0001FF00") {
    console.log("positive");
    sensor.PositiveTripahse.push(frame);
  } else if (frame.DataIdentification === "0002FF00") {
    console.log("reverse");
    sensor.ReverserTipahse.push(frame);
  } else if (frame.DataIdentification === "04601201") {
    //   console.log('resverse');
    sensor.Voltage_CurrentrTipahse.push(frame);
  } else {
    //  console.log('actif power');
    sensor.ActivePowerTipahse.push(frame);
  }

  await sensor.save();
});

module.exports = consume;
