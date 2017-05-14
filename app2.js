var myApp = angular.module('ListTracksApp', ['ngResource', 'ngRoute']);
// myApp.service('MusicService', MusicService);
myApp.factory('tracklister', ['$resource', function ($resource){
  return {
  musicTracks: $resource('http://104.197.128.152:8000/v1/tracks/', {"page": 1}),
  musicGenres: $resource('http://104.197.128.152:8000/v1/genres/84'),
  musicSearch: $resource('http://104.197.128.152:8000/v1/tracks'),
  musicCreate: $resource('http://104.197.128.152:8000/v1/tracks/:userId',{userId: '@id'}, {method: 'POST'}),
  genreList: $resource('http://104.197.128.152:8000/v1/genres', {'page' : 1})
  };
}]);

myApp.config(['$routeProvider', function($routeProvider) {                        
  $routeProvider                                                                
       .when('/', {                                            
         templateUrl: "views/listMusic.html",                                               
         controller:'MusicController',
         resolve: {
          data: function ($resource) {
            // $scope.pgno = 1;
            // vm.pgno = 1;
          return $resource('http://104.197.128.152:8000/v1/tracks/').get();
           }
          }                                
        })
        .when('/genres', {                                            
         templateUrl: "views/genres.html",                                               
         controller:'MusicGenreController',
         resolve: {
          data: function ($resource) {
            return $resource('http://104.197.128.152:8000/v1/genres').get();
          }
         }                               
        });                                                                       
}]);


myApp.controller('MusicController', ['$scope',  '$resource', 'tracklister', 'data', function($scope, $resource, tracklister, data){
  var vm = $scope;
  vm.tracks = data;
  vm.incrementPage = function(url){
    music = $resource(url).get();
    vm.tracks = music;
    console.log(vm.pgno);
  };
  console.log(vm.pgno);
  console.log(vm.tracks);

  vm.listGenres = function(genre){
    console.log(genre);
    var url = "http://104.197.128.152:8000/v1/genres/" + genre; 
    console.log(url);
    var tempMusic = $resource(url);
    music = tempMusic.get();
    // music = tracklister.musicGenres.get();
    vm.tracks = music;
    music.$promise.then(function(data){
    console.log("Genre Data: ")
    console.log(data);
    });
   };


  vm.search_tracks = function(){
    // console.log(query);
    query = document.getElementById("search-title").value;
    query = encodeURI(query);
    console.log(query);
    music = tracklister.musicSearch.get({title: query});
    vm.tracks = music;
    music.$promise.then(function(data){
    console.log(data);
    });
  };


  vm.create_track = function(){
    // var inp_fields = document.getElementById("create-edit-track");
    // inp_fields.style.display = 'block';
    ttl = document.getElementById("title").value;
    gre = document.getElementById("genres").value;
    rats = document.getElementById("ratings").value;
    music = tracklister.musicCreate.save({"title": ttl, "ratings": rats, "genres": [gre]})
  };
}]);

myApp.controller('MusicGenreController', ['$scope', 'tracklister' ,'data', function($scope, tracklister, data) {
  console.log("inside the new controller");
  var vm = $scope;
  vm.genres = data;
  // var gpgno = 1;
  var incrementGPage = function(){
    gpgno += 1;
    gen = tracklister.genreList.get({'page': gpgno});
    vm.genres = gen;
  }
  // (function(){
  //   gen = tracklister.genreList.get({'page': gpgno});
  //   vm.genres = gen;
  // })();
}]);
