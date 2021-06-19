const axios = require('axios');

let cache = require('./cache.js');

class Movie {
  constructor(title, overview, popularity, release_date){
    this.title = title;
    this.overview = overview;
    this.popularity = popularity;
    this.release_date = release_date;
  }
}

let getMovies = async (req, res) => {
  let movie = req.query.movie;
  const key = `${movie}`;

  let TMDBData = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${movie}`);

  if (TMDBData === undefined) {
    res.status(400).send('Could not find request');
  } else if (cache[key] && (Date.now() - cache[key].timestamp < 1000 * 60 * 60 * 24 * 5)) {
    console.log('Cache Hit!');
  } else {
    console.log('Cache Miss!');
    let parseMovieDB = TMDBData.data.results.map( data => new Movie(data.title, data.overview, data.popularity, data.release_date));
    cache[key] = {};
    cache[key].timestamp = Date.now();
    cache[key].data = res.send(parseMovieDB);
  }
  return cache[key].data;
};

module.exports = getMovies;
