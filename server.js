const express = require(`express`);
const app = express();

require(`dotenv`).config();

const cors = require(`cors`);
app.use(cors());

const axios = require('axios');

const PORT = process.env.PORT;

//-------------------------------------------------//

class Forecast {
  constructor(description, date) {
    this.description = description;
    this.date = date;
  }
}

class Movie {
  constructor(title, overview, popularity, release_date){
    this.title = title;
    this.overview = overview;
    this.popularity = popularity;
    this.release_date = release_date;
  }
}

// Establishes that our server is live by display 'Hello World'
app.get('/', (req, res) => {
  res.send('Hello World');
});

// function to gather weather information based on client request query
app.get('/weather', async (req, res) => {
  // set var to take in query data
  let lat = req.query.lat;
  let lon = req.query.lon;

  // assign a var the value of city_name if searchQuery matches
  let cityWeatherData = await axios.get(`https://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&lat=${lat}&lon=${lon}&units=I`);

  // sets condition if city in not found return an error/code, else create a new Forcast with data from weather.json
  if (cityWeatherData === undefined) {
    res.status(400).send('Unsupported city');
  } else {
    let parseCityData = cityWeatherData.data.data.map( obj => new Forecast(obj.datetime, `low of ${obj.low_temp}, high of ${obj.max_temp} with ${obj.weather.description.toLowerCase()}`));

    console.log(cityWeatherData);
    // sends the data gathered through parseCityData to the front end
    res.send(parseCityData);
  }
});

app.get('/movies', async (req, res) => {
  let movie = req.query.movie;

  let TMDBData = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${movie}`);

  if (TMDBData === undefined) {
    res.status(400).send('Could not find request');
  } else {
    let parseMovieDB = TMDBData.data.results.map( data => new Movie(data.title, data.overview, data.popularity, data.release_date));

    console.log(parseMovieDB);

    res.send(parseMovieDB);
  }
})

// if a request is made to an unassigned address return error & message
app.get('/*', (req, res) => {
  res.status(404).send(`Sorry, we could find your request`);
});

// lets app to listen for the designated PORT
app.listen(PORT, () => {console.log(`listening on PORT: ${PORT}`);});