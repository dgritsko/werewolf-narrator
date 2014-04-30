'use strict';

werewolfApp.controller('RoleController', ['$scope', '$rootScope', 'roles', function($scope, $rootScope, roles) {
   $scope.renderSection = true;

   $scope.hasInstructions = function(actual, expected) {
      return actual.instructions && actual.instructions.length;
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
   
      var instructions = [];
      
      for (var i = 0, len = $scope.roles.length; i < len; i++) {
         var role = $scope.roles[i];
         
         if (role.count <= 0) { continue; } 
         
         instructions = instructions.concat(role.instructions);         
      }
     
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