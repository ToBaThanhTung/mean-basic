const request = require('request');
const apiOptions = {
  server: 'http://localhost:3000'
};

var renderHomepage = (req, res, responseBody) => {
  var message;
  if (!(responseBody instanceof Array)) {
    message = "API lookup error";
    responseBody = [];
  } else {
    if (!responseBody.length) {
      message = "No places found nearby";
    }
  }
  res.render('location-list', {
    title: 'App - Find a place to work with wifi near you!',
    pageHeader: {
      title: 'App',
      strapline: 'Find a place to work with wifi near you'
    },
    sidebar: 'Looking for wifi and a seat? App help you find places to work when out and about.',
    locations: responseBody,
  });
}

module.exports.homelist = (req, res) => {
  var requestOptions;
  var path = '/api/locations/';
  requestOptions = {
    url: apiOptions.server + path,
    method: 'GET',
    json: {},
    qs: {
      lng: -0.9690884,
      lat: 51.455041,
      maxDistance: 20000
    }
  };
  request(requestOptions, (err, response, body) => {
    var i, data;
    data = body;
    console.log("body:  " + body);
    // if(response.statusCode === 200 && data.length){
    //   for(i = 0; i < data.length; i++){
    //     data[i].distance = _formatDistance(data[i].distance);
    //   }
    // }
    renderHomepage(req, res, data);
  });
}

module.exports.locationInfo = (req, res) => {
  res.render('location-info', {
    title: 'App - find a place to work with wifi',
    pageHeader: {
      title: 'App',
      strapline: 'Find a place to work wifi near you'
    }
  });
}

module.exports.addReview = (req, res) => {
  res.render('location-view-form', {
    title: "review ",
    pageHeader: {
      title: 'review'
    }
  });
}
