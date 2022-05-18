const Zone = require("../models/zoneModel");
const Sensor = require("../models/sensorModel");
const SensorGlobal = require("../models/sensorGlobalModel");
const factory = require("../controllers/handlerFactory");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getSensorGlobalById = catchAsync(async (req, res, next) => {
  const sensor = await SensorGlobal.findOne({ sensorId: req.body.sensorId });
  if (!sensor) {
    return next(new AppError("No sensor found with that ID", 404));
  }
  req.body.sensorId = sensor._id;
  next();
});
exports.setZoneId = (req, res, next) => {
  if (!req.body.zone) req.body.zone = req.params.zoneId;

  next();
};

exports.createSensor = factory.createOne(Sensor);
exports.getSensors = factory.getAll(Sensor);

exports.getSensorsByZoneOrSiteAndDate = catchAsync(async (req, res, next) => {
  const type = req.query.type;
  console.log(type);
  let idZones;
  const ObjectId = require("mongoose").Types.ObjectId;
  if (req.params.zoneId) {
    idZones = req.params.zoneId;
  }

  if (req.params.siteId) {
    const zone = await Zone.aggregate([
      {
        $match: {
          site: { $in: [ObjectId(req.params.siteId)] },
        },
      },
    ]);
    idZones = zone.map((ids) => ids._id);
  }
  console.log({ idZones });
  const dateStart = Number(req.query.dateStart);
  console.log({ dateStart });
  let dateEnd = 0;
  if (req.query.filter === "YEARS")
    dateEnd = Number(Number(req.query.dateEnd) + 31535999999);
  if (req.query.filter === "DAY-BY-DAY")
    dateEnd = Number(Number(req.query.dateEnd) + 86399999);
  if (req.query.filter === "MONTHS")
    dateEnd = Number(Number(req.query.dateEnd) + 2629999999);
  if (typeof idZones === "string") {
    idZones = [ObjectId(idZones)];
  }
  console.log({ dateEnd });
  const filtredSensor = await Sensor.aggregate([
    {
      $match: {
        zone: { $in: idZones },
      },
    },

    {
      $lookup: {
        from: "sensorglobals",
        localField: "sensorId",
        foreignField: "_id",
        as: "sensorId",
      },
    },
    {
      $match: { "sensorId.type": type },
    },
    {
      $unwind: {
        path: "$sensorId",
      },
    },
    {
      $project: {
        "sensorId.ActivePowerTipahse": {
          $filter: {
            input: "$sensorId.ActivePowerTipahse",
            as: "activePowerTipahse",
            cond: {
              $and: [
                { $gte: ["$$activePowerTipahse.createdAt", dateStart] },
                {
                  $lte: ["$$activePowerTipahse.createdAt", dateEnd],
                },
              ],
            },
          },
        },
        "sensorId.ReverserTipahse": {
          $filter: {
            input: "$sensorId.ReverserTipahse",
            as: "reverserTipahse",
            cond: {
              $and: [
                { $gte: ["$$reverserTipahse.createdAt", dateStart] },
                {
                  $lte: ["$$reverserTipahse.createdAt", dateEnd],
                },
              ],
            },
          },
        },
        "sensorId.PositiveTripahse": {
          $filter: {
            input: "$sensorId.PositiveTripahse",
            as: "positiveTripahse",
            cond: {
              $and: [
                { $gte: ["$$positiveTripahse.createdAt", dateStart] },
                {
                  $lte: ["$$positiveTripahse.createdAt", dateEnd],
                },
              ],
            },
          },
        },
        "sensorId.ConsomationTripahse": {
          $filter: {
            input: "$sensorId.ConsomationTripahse",
            as: "consomationTripahse",
            cond: {
              $and: [
                { $gte: ["$$consomationTripahse.createdAt", dateStart] },
                {
                  $lte: ["$$consomationTripahse.createdAt", dateEnd],
                },
              ],
            },
          },
        },
        "sensorId.Voltage_CurrentrTipahse": {
          $filter: {
            input: "$sensorId.Voltage_CurrentrTipahse",
            as: "voltageCurrentrTipahse",
            cond: {
              $and: [
                { $gte: ["$$voltageCurrentrTipahse.createdAt", dateStart] },
                {
                  $lte: ["$$voltageCurrentrTipahse.createdAt", dateEnd],
                },
              ],
            },
          },
        },
        "sensorId.Temperature": {
          $filter: {
            input: "$sensorId.Temperature",
            as: "temperature",
            cond: {
              $and: [
                { $gte: ["$$temperature.createdAt", dateStart] },
                {
                  $lte: ["$$temperature.createdAt", dateEnd],
                },
              ],
            },
          },
        },
        "sensorId.Humidite": {
          $filter: {
            input: "$sensorId.Humidite",
            as: "humidite",
            cond: {
              $and: [
                { $gte: ["$$humidite.createdAt", dateStart] },
                {
                  $lte: ["$$humidite.createdAt", dateEnd],
                },
              ],
            },
          },
        },

        zone: 1,
        "sensorId._id": 1,
        "sensorId.sensorId": 1,
        "sensorId.type": 1,
      },
    },
  ]);
  console.log(filtredSensor);
  if (req.query.filter === "YEARS" || req.query.filter === "MONTHS") {
    let FiltredsensorByMonthOrYear = [];
    const newObj = { ...filtredSensor };
    console.log({ newObj });
    FiltredsensorByMonthOrYear = getSumFromArray(
      filtredSensor,
      req.query.filter
    );

    console.log(FiltredsensorByMonthOrYear.ComActiveTotal);

    FiltredsensorByMonthOrYear.sensorId = {
      sensorId: filtredSensor
        .map((ele) => ele.sensorId.sensorId)
        .toLocaleString(),
    };

    res.status(202).json({
      status: "success",
      data: [FiltredsensorByMonthOrYear],
      results: filtredSensor.length,
    });
  } else {
    res.status(202).json({
      status: "success",
      data: filtredSensor,
      results: filtredSensor.length,
    });
  }
});

exports.deleteSensor = factory.deleteOne(Sensor);
exports.updateSensor = factory.updateOne(Sensor);
exports.getSensor = factory.getOne(Sensor, { path: "zone" });

exports.getSensorsByZone = catchAsync(async (req, res, next) => {
  // 1) Find all zones
  const sites = await Zone.find({ user: req.user._id });
  const sitesIDs = sites.map((el) => el._id);
  req.body.zone = sitesIDs;
  next();
});

function get_date_parts(iso_string) {
  iso_string = new Date(iso_string).toISOString();

  const [year, month, day] = iso_string.split(/\D/g);

  return { year, month, day };
}

function getSumFromArray(arr, filter) {
  return {
    ComActiveTotal: groupByDayMonthYear(
      arr,
      "ConsomationTripahse",
      "ComActiveTotal",
      filter
    ),
    "Consommation(kwh)": groupByDayMonthYear(
      arr,
      "PositiveTripahse",
      "PositiveActiveTotal",
      filter
    ),
    Production: groupByDayMonthYear(
      arr,
      "ReverserTipahse",
      "ReverseActiveTotal",
      filter
    ),
  };
}
function groupByDayMonthYear(arr, Globalkey, value, filter) {
  return arr.map((element) =>
    element.sensorId[Globalkey].reduce((a, obj) => {
      let key;
      if (filter === "YEARS") {
        const { year, month } = get_date_parts(obj["createdAt"]);
        key = `${year}/${month}`;
      } else if (filter === "MONTHS") {
        const { month, day } = get_date_parts(obj["createdAt"]);
        key = `${month}/${day}`;
      }
      if (a[key] === undefined) {
        a[key] = { value: 0, createdAt: key };
      }
      a[key].value += Number(obj[value]);
      return a;
    }, {})
  );
}
