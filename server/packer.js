var movieCtrler = require('../server/movieModel/movieController.js');
var request = require('request');

module.exports = function(movies, callback) {
  var index = 0;
  var results = [];
  //Recursive function to handle multiple async movie lookups
  var movieLookupHelper = function() {
    if (index > movies.length - 1) {
      //All movies have been packed. Call callback.
      callback(results);
    } else {
      var movie = movies[index];
      //check the database to see if we already have information for that movie
      checkForMovie(movie, function(found) {
      //if successfully found,
        if (found) {
          console.log("I AM FOUND")
        //pack that information in with the movies list and continue to next movie
          packInfo(found, index);
          index++;
          movieLookupHelper();
        } else {
        //hit IMDB for the required information
        
          getInfoFromIMDB(movie, function (data) {
            if (data) {
              //Add this data to the database
              addMovieToDB(data);
              //Pack that information in with the movies list and continue to next movie
              packInfo(data, index);
              index++;
              movieLookupHelper();
            } else {
              //No data back from imdb
              //TODO: HANDLE ERROR HERE???
              index++;
              movieLookupHelper();
            }
          });
        }
      });
    }
  }
  
  
  
  var packInfo = function(movieData, index) {
    var movie = movies[index];
    movie.poster = movieData.poster;
    movie.synopsis = movieData.synopsis;
    results.push(movie);
  }
  var checkForMovie = function(movie, callback) {
    callback(movieCtrler.addMovie(movie));
    
    //STUB:
    //TODO:
    //Interact with the database here
    //Call callback on movie data if it exists, or null if it doesn't
  }
  var getInfoFromIMDB = function(movie, callback) {
    //TODO: 
    // IMDB API call here
    console.log("-->>>>>>>>>>", movie)
    // var movieObj = "http://www.omdbapi.com/?i=“ + movie.id + "&plot=short&r=json"
    request.get("http://www.omdbapi.com/?i=" + movie.movieName + "&plot=short&r=json")
            .on('response', function(response){
              console.log("IMDB IS WORKING")
              var film = {};
              film.title = response.Title;
              film.poster = response.Poster;
              film.synposis = response.Plot;
              console.log(film)
              callback(film);
            });
    
    //call callback on movie data 
  }
  var addMovieToDB = function(moviedata) {
    //TODO:
    //Handle add to database;
    return movieCtrler.addMovie(moviedata);
  }
  
  movieLookupHelper();
  
}
     