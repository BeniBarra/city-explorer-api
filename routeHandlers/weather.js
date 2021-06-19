'use strict';

const axios = require('axios');

// importing cache.js file
let cache = require('./cache.js');

// ----------------------------------------//

// created a class for Weather
class Weather {
  constructor(day) {
    this.forecast = day.weather.description;
    this.time = day.datetime;
  }
}

// creating new Weather classes with the Data from API
let parseWeather = async (weatherData) => {
  console.log(`weatherdata: ${weatherData}`);
  try {
    const weatherSummaries = weatherData.data.data.map(day => {
      return new Weather(day);
    });
    console.log(Weather);
    return Promise.resolve(weatherSummaries);
  } catch (e) {
    return Promise.reject(e);
  }
};

let getWeather = async (latitude, longitude) => {

  // sets the value of the key to be lat & lon
  const key = `weather- ${latitude},${longitude}`;

  // sets url for request to weatherbit API
  const url = `http://api.weatherbit.io/v2.0/forecast/daily/?key=${process.env.WEATHER_API_KEY}&lang=en&lat=${latitude}&lon=${longitude}&days=5`;

  // if request already cached and cache has no expired then respond from cache, if not store new request to cache
  if (cache[key] && (Date.now() - cache[key].timestamp < 1000 * 60 * 60 * 24 * 5)) {
    console.log('Cache hit');
  } else {
    console.log('Cache miss');
    cache[key] = {};
    cache[key].timestamp = Date.now();
    await axios.get(url).then(response => {
      cache[key].data = parseWeather(response);
    });
  }

  return cache[key].data;
};

// exporting modules
module.exports = getWeather;




// const axios = require('axios');

// class Forecast {
//   constructor(description, date) {
//     this.description = description;
//     this.date = date;
//   }
// }

// let getWeather = async (req, res) => {
//   // set var to take in query data
//   let lat = req.query.lat;
//   let lon = req.query.lon;

//   // assign a var the value of city_name if searchQuery matches
//   let cityWeatherData = await axios.get(`https://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&lat=${lat}&lon=${lon}&units=I`);

//   // sets condition if city in not found return an error/code, else create a new Forcast with data from weather.json
//   if (cityWeatherData === undefined) {
//     res.status(400).send('Unsupported city');
//   } else {
//     let parseCityData = cityWeatherData.data.data.map(obj => new Forecast(obj.datetime, `low of ${obj.low_temp}, high of ${obj.max_temp} with ${obj.weather.description.toLowerCase()}`));

//     console.log(cityWeatherData);
//     // sends the data gathered through parseCityData to the front end
//     res.send(parseCityData);
//   }
// };

// module.exports = getWeather;
