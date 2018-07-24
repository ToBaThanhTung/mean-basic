const mongoose = require('mongoose');
const App = require('../models/locations');

var sendJsonRes = (res, status, content) => {
  res.status(status).json(content);
}

var theEarth = (() => {
  var earthRadius = 6371;
  var getDistanceFromRads = (rads) => {
    return parseFloat(rads * earthRadius);
  };
  var getRadsFromDistance = (distance) => {
    return parseFloat(distance / earthRadius);
  }
  return {
    getDistanceFromRads: getDistanceFromRads,
    getRadsFromDistance: getRadsFromDistance
  };
})();

var buildLocationList = (req, res, results, stats) => {
  var locations = [];
  console.log('results in location list:' , results);
  results.forEach((doc) => {
    console.log('doc: ', doc);
    locations.push({
      distance: theEarth.getDistanceFromRads(doc.dis),
      name: doc.obj.address,
      rating: doc.obj,
      facilities: doc.obj.facilities,
      _id: doc.obj._id
    });

  });
  return locations;
}

module.exports.locationCreate = (req, res, next) => {
  console.log(req.body);
  App.create({
    name: req.body.name,
    address: req.body.address,
    facilities: req.body.facilities.split(","),
    coord: [parseFloat(req.body.lng), parseFloat(req.body.lat)],
    openingTimes: [{
      days: req.body.days1,
      opening: req.body.opening1,
      closing: req.body.closing1,
      closed: req.body.closed1,
    }, {
      days: req.body.days2,
      opening: req.body.opening2,
      closing: req.body.closing2,
      closed: req.body.closed2,
    }]
  }, function(err, location) {
    if (err) {
      console.log(err);
      sendJSONresponse(res, 400, err);
    } else {
      console.log(location);
      sendJSONresponse(res, 201, location);
    }
  })
  // .catch(err => {
  //   console.log(err);
  //   sendJsonRes(res, 404, {
  //     err: err
  //   })
  // });
};


module.exports.locationsListByDistance = (req, res) => {
  var lng = parseFloat(req.query.lng);
  var lat = parseFloat(req.query.lat);
  var maxDistance = parseFloat(req.query.maxDistance);
  var point = {
    type: "Point",
    coordinates: [lng, lat]
  };
  if (!lng || !lat || !maxDistance) {
    console.log('locationsListByDistance missing params');
    sendJsonRes(res, 404, {
      message: 'lng, lat and maxDistance query parameter are all required'
    });
    return;
  } else {
    console.log('locationsListByDistance running...');
    App.aggregate(
      [{
        '$geoNear': {
          'near': {type: 'Point', coordinates:[lng, lat]},
          'query': {type: "public"},
          'spherical': true,
          'distanceField': 'dist',
          'minDistance': 0,
          'maxDistance': theEarth.getRadsFromDistance(maxDistance),
          'num': 10
        }
      }],
      (err, results) => {
        if (err) {
          sendJsonRes(res, 404, err);
        } else {
          locations = buildLocationList(req, res, results);
          sendJsonRes(res, 200, locations);
          console.log("locations:", results);
        }
      }
    )
  }
  // App.geoNear(point, geoOptions, (err, results, stats) => {
  //   var locations;
  //   console.log('Geo results', results);
  //   console.log('Geo stat', stats);
  //   if (err) {
  //     console.log('geoNear error', err);
  //     sendJsonRes(res, 404, err)
  //   } else {
  //     locations = buildLocationList(req, res, results, stats);
  //     sendJsonRes(res, 200, locations);
  //   }
  // })
  // .catch(err => {
  //   console.log(err);
  //   sendJsonRes(res, 404, {
  //     err: err
  //   })
  // });
};

module.exports.locationReadOne = (req, res) => {
  const id = req.params.locationId;
  App
    .findById(id)
    .exec((err, location) => {
      if (!location) {
        sendJsonRes(res, 404, {
          message: 'locationId not found'
        });
        return;
      } else if (err) {
        sendJsonRes(res, 200, err);
        return;
      }
      sendJsonRes(res, 200, location);
    })
  // .catch(err => {
  //   console.log(err);
  //   sendJsonRes(res, 500, {
  //     err: err
  //   })
  // });

};

module.exports.locationUpdateOne = (req, res) => {
  if (req, params.locationId) {
    sendJsonRes(res, 404, {
      message: "not found, locationid is required "
    });
    return;
  }
  App
    .findById(req.params.locationid)
    .exec((err, location) => {
      if (!location) {
        sendJsonRes(res, 404, {
          message: 'location id not found'
        });
        return;
      } else if (err) {
        sendJsonRes(res, 400, err);
        return;
      }
      location.name = req.body.name;
      location.address = req.body.address;
      location.facilities = req.body.facilities.split(",");
      location.coords = [parseFloat(req.body.lng), parseFloat(req.body.lat)];
      location.openingTimes = [{
        days: req.body.days1,
        opening: req.body.opening1,
        closing: req.body.closing1,
        closed: req.body.closed1,
      }, {
        days: req.body.days2,
        opening: req.body.opening2,
        closing: req.body.closing2,
        closed: req.body.closed2,
      }];
      location.save(function(err, location) {
        if (err) {
          sendJSONresponse(res, 404, err);
        } else {
          sendJSONresponse(res, 200, location);
        }
      });
    })
  // .catch(err => {
  //   console.log(err);
  //   sendJsonRes(res, 404, {
  //     err: err
  //   })
  // });
}

module.exports.locationDeleteOne = (req, res) => {
  var locationid = req.params.locationid;

  App
    .findByIdAndRemove(locationid)
    .exec(
      function(err, location) {
        if (err) {
          console.log(err);
          sendJSONresponse(res, 404, err);
          return;
        }
        console.log("Location id " + locationid + " deleted");
        sendJSONresponse(res, 204, null);
      }
    )
  // .catch(err => {
  //   console.log(err);
  //   sendJsonRes(res, 404, {
  //     err: err
  //   })
  // });

}
