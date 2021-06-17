const axios = require('axios');

class Forecast {
  constructor(description, date) {
    this.description = description;
    this.date = date;
  }
}

let getWeather = async (req, res) => {
  // set var to take in query data
  let lat = req.query.lat;
  let lon = req.query.lon;

  // assign a var the value of city_name if searchQuery matches
  let cityWeatherData = await axios.get(`https://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&lat=${lat}&lon=${lon}&units=I`);

  // sets condition if city in not found return an error/code, else create a new Forcast with data from weather.json
  if (cityWeatherData === undefined) {
    res.status(400).send('Unsupported city');
  } else {
    let parseCityData = cityWeatherData.data.data.map(obj => new Forecast(obj.datetime, `low of ${obj.low_temp}, high of ${obj.max_temp} with ${obj.weather.description.toLowerCase()}`));

    console.log(cityWeatherData);
    // sends the data gathered through parseCityData to the front end
    res.send(parseCityData);
  }
};

module.exports = getWeather;
