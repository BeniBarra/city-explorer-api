const express = require(`express`);
const app = express();

require(`dotenv`).config();

const cors = require(`cors`);
app.use(cors());

const PORT = process.env.PORT;
const weatherData = require(`./data/weather.json`);



//-------------------------------------------------//

class Forecast {
  constructor(description, date) {
    this.description = description;
    this.date = date;
  }
}

const getForecast = () => {
  return weatherData.map( i => {
    new Forecast (i.description, i.date);
  });
};


app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get(`/weather`, (req, res) => {
  let lat = req.query.lat;
  let lon = req.query.lon;
  let name = req.query.name;
  let err = `Could not find requested`;

  getForecast();

  weatherData.find( i => {
    if ( name !== i.city_name) {
      res.send(`${err}`);
    } else res.send(`it's working!`);
  });
});

app.get('/*', (req, res) => {
  res.status(404).send(`Sorry, it seems there was an error`);
});

app.listen(PORT, () => {console.log(`listening on PORT: ${PORT}`);});