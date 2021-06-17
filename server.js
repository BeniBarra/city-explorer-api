const express = require(`express`);
const app = express();

require(`dotenv`).config();

const cors = require(`cors`);
app.use(cors());

const getWeather = require('./routeHandlers/weather');
const getMovies = require('./routeHandlers/movies');

const PORT = process.env.PORT;

//-------------------------------------------------//

// Establishes that our server is live by display 'Hello World'
app.get('/', (req, res) => {
  res.send('Hello World, I\'m Live!');
});

// function to gather weather information based on client request query
app.get('/weather', getWeather);

app.get('/movies', getMovies);

// if a request is made to an unassigned address return error & message
app.get('/*', (req, res) => {
  res.status(404).send(`Sorry, we could find your request`);
});

// lets app to listen for the designated PORT
app.listen(PORT, () => {console.log(`listening on PORT: ${PORT}`);});