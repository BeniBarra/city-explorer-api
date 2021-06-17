const axios = require('axios');

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

  let TMDBData = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${movie}`);

  if (TMDBData === undefined) {
    res.status(400).send('Could not find request');
  } else {
    let parseMovieDB = TMDBData.data.results.map( data => new Movie(data.title, data.overview, data.popularity, data.release_date));

    console.log(parseMovieDB);

    res.send(parseMovieDB);
  }
};

module.exports = getMovies;
