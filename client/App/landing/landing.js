var app = angular.module('moviedash.landing', []);

app.controller('LandingCtrl', function($scope, $location, MovieClient) {

  //Checks if geolocation is available, shows form if not
  if (!navigator.geolocation) {
    $scope.location = "Geolocation is not supported by your browser";
    $scope.zip = true;
  }

  function success(position) {
    //if location is found, sets lat and long
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;

    $scope.location = latitude + ', ' + longitude;
    //sends location to factory
    MovieClient.getTheaters($scope.location).then(function(response) {
      //redirects to movie route
      MovieClient.setResults(response);
      $location.path('/movies');
    });
  }

  function error() {
    //on error, shows input form
    $scope.location = "Unable to retrieve location";
    $scope.zip = true;
  }

  //calls for geolocation on route load
  navigator.geolocation.getCurrentPosition(success, error);

  //handles submit from form and sends zip to factory
  $scope.zipSubmit = function() {
    MovieClient.getTheaters($scope.zip).then(function(response) {
      MovieClient.setResults(response);
      $location.path('/movies');
    });
  };
});