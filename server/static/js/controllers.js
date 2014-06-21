'use strict';

werewolfApp.controller('MainController', ['$scope', '$rootScope', '$http', function($scope, $rootScope, $http) {
   $scope.playerName = '';
   $scope.renderSection = true;
   
   if (typeof(Storage !== 'undefined')) {
      var playerName = localStorage.getItem('playerName');
      var playerKey = localStorage.getItem('playerKey');
            
      if (playerName && playerKey) {
         $scope.playerName = playerName;
         $scope.playerKey = playerKey;
      } else {
         $scope.playerName = '';
         $scope.playerKey = Math.floor(Math.random() * 1000000);
      }
   }
   
   $scope.done = function() {
      if ($scope.playerName) {
         localStorage.setItem('playerName', $scope.playerName);
         localStorage.setItem('playerKey', $scope.playerKey);

         $scope.renderSection = false;         
         $rootScope.$broadcast('listGames', {});
      } else {
         console.log('TODO: alert that player name is required');
      }
   }
}]);

werewolfApp.controller('GameController', ['$scope', '$rootScope', '$http', '$interval', function($scope, $rootScope, $http, $interval) {
   $scope.games = []
   
   var stop;
   $scope.startGameRetrieval = function() {
     // Don't start a new interval if we are already retrieving games
     if ( angular.isDefined(stop) ) return;
     stop = $interval(function() {
       if ($scope.renderSection) {
           $scope.getGameList();
       } else {
           $scope.stopGameRetrieval();
       }
     }, 1000);
   };
   
   $scope.stopGameRetrieval = function() {
      if (angular.isDefined(stop)) {
        $interval.cancel(stop);
        stop = undefined;
      }
    };
   
   $scope.getGameList = function() {
      $http.get('/api/games').success(function(data) {
         $scope.games = data.games;
      });
   }

   $scope.joinGame = function(game_id) {
      var playerKey = localStorage.getItem('playerKey');
      var playerName = localStorage.getItem('playerName');
   
      $http.post('/api/games/' + game_id + '/players', {key: playerKey, name: playerName}).success(function(data) {
         $scope.renderSection = false;
         $rootScope.$broadcast('joinLobby', {game_id: game_id});
      });      
   }
   
   $scope.createGame = function() {
      if ($scope.newGameName) {
         var playerKey = localStorage.getItem('playerKey');
      
         $http.post('/api/games', { name: $scope.newGameName, key: playerKey }).success(function() {
            $scope.newGameName = '';
            $scope.getGameList();
         });
      } else {
         console.log('TODO: alert that game name is required');
      }
   };
   
   $rootScope.$on('listGames', function(e, args) {
      $scope.renderSection = true;
      $scope.startGameRetrieval();
   });   
}]);

werewolfApp.controller('LobbyController', ['$scope', '$rootScope', '$http', '$interval', 'roles', function($scope, $rootScope, $http, $interval, roles) {
   $scope.renderSection = false;
   $scope.isAdmin = false;
   $scope.players = [];
   
   var stop;
   $scope.startPlayerRetrieval = function() {
     // Don't start a new interval if we are already retrieving players
     if ( angular.isDefined(stop) ) return;
     stop = $interval(function() {
       if ($scope.renderSection) {
           $scope.getPlayerList();
       } else {
           $scope.stopPlayerRetrieval();
       }
     }, 1000);
   };
   
   $scope.stopPlayerRetrieval = function() {
      if (angular.isDefined(stop)) {
        $interval.cancel(stop);
        stop = undefined;
      }
    };
      
   $scope.getPlayerList = function() {
      $http.get('/api/games/' + $scope.game_id + '/players').success(function(data) {
         $scope.players = data.players;
      });
   }
   
   $scope.getGameDetail = function() {
      $http.get('/api/games/' + $scope.game_id).success(function(data) {
         var playerKey = localStorage.getItem('playerKey');
      
         if (data.owner_key == playerKey) {
            $scope.isAdmin = true;
         }
      });
   }
      
   $rootScope.$on('joinLobby', function(e, args) {
      $scope.renderSection = true;
      $scope.game_id = args.game_id;
      $scope.startPlayerRetrieval();
      $scope.getGameDetail();
   });

   $scope.shouldDisplayRole = function(actual, expected) {
      var hasInstructions = actual.instructions && actual.instructions.length;
      
      var shouldDisplay = actual.shouldDisplay;
      
      return hasInstructions || shouldDisplay;
   }
   
   $scope.roles = roles;
   
   $scope.playerCount = function() {
      return _.reduce($scope.roles, function(memo, role) { return memo + (role.count || 0); }, 0);
   };
   
   $scope.playerBalance = function() {
      var sum = _.reduce($scope.roles, function(memo, role) { return memo + ((role.count || 0) * (role.balance || 0)); }, 0);
      
      if (sum <= 0) {
         return '' + sum;
      }

      return '+' + sum;
   };
   
   $scope.updateInstructions = function() {
      $scope.renderSection = false;
   
      var instruction_lookup = {};
      
      for (var i = 0, len = $scope.roles.length; i < len; i++) {
         var role = $scope.roles[i];
         
         if (role.count <= 0) { continue; } 
         
         for (var j = 0, instructionLen = role.instructions.length; j < instructionLen; j++) {
            var instruction = role.instructions[j];
            if (instruction.id) {
               if (instruction_lookup[instruction.id]) {
                  // Insert at start of array
                  instruction_lookup[instruction.id].unshift(instruction);
               } else {
                  instruction_lookup[instruction.id] = [ instruction ];
               }
            } else if (instruction.parentId) {
               if (instruction_lookup[instruction.parentId]) {
                  instruction_lookup[instruction.parentId].push(instruction);
               } else {
                  instruction_lookup[instruction.parentId] = [ instruction ];
               }
            } else {
               instruction_lookup[i + '_' + j] = [ instruction ];
            }
         }
      }
      
      var instructions = [];
      for (var k in instruction_lookup) {
         instructions = instructions.concat(instruction_lookup[k]);
      }
      
      instructions.unshift({ message: 'Everyone, go to sleep.' });
      instructions.push({ message: 'Everyone, wake up.' });
     
      $rootScope.$broadcast('updateInstructions', {instructions: instructions});
   };   
   
   $rootScope.$on('defineRoles', function(e, args) {
      $scope.renderSection = true;
   });
   
   $scope.increaseCount = function(role) {
      role.count = role.maxCount ? Math.min(role.maxCount, role.count + 1) : role.count + 1;
   };
   
   $scope.decreaseCount = function(role) {
      role.count = Math.max(0, role.count - 1);
   }
}]);

werewolfApp.controller('ScriptController', ['$scope', '$rootScope', function($scope, $rootScope) {
   $scope.renderSection = false;
   $scope.instructions = [];
   $scope.round = 0;
   
   $scope.activeInRound = function(actual, expected) {
      if (!actual.rounds || actual.rounds.length == 0) {
         return true;
      }
      
      if (actual.rounds.indexOf($scope.round) >= 0) { 
         return true;
      }
      
      return false;
   }
   
   $rootScope.$on('updateInstructions', function(e, args) {
      $scope.renderSection = true;
      $scope.instructions = args.instructions;
   });
   
   $scope.defineRoles = function() {
      $scope.renderSection = false;
      $rootScope.$broadcast('defineRoles', {});
   }
}]);