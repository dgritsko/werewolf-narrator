'use strict';

var werewolfApp = angular.module('werewolfApp', []);

werewolfApp.controller('RoleController', ['$scope', '$rootScope', function($scope, $rootScope) {
   $scope.renderSection = true;

   $scope.hasInstructions = function(actual, expected) {
      return actual.instructions && actual.instructions.length;
   }
   
   $scope.roles = [{
      name: 'Werewolf',
      count: 0,
      instructions: [ 
         { message: 'Werewolves, wake up.' },
         { message: 'Werewolves, identify each other.', rounds: [0] },
         { message: 'Werewolves, choose your victim.' },
         { message: 'Werewolves, go to sleep.' }
      ]
   }, {
      name: 'Villager',
      count: 0
   }, {
      name: 'Seer',
      count: 0,
      instructions: [
         { message: 'Seer, wake up.' },
         { message: 'Seer, choose your suspect.' },
         { message: 'Seer, go to sleep.' }
      ]
   }, {
      name: 'Mason',
      count: 0,
      instructions: [
         { message: 'Masons, wake up.', rounds: [0] },
         { message: 'Masons, identify each other.', rounds: [0] },
         { message: 'Masons, go to sleep.', rounds: [0] }
      ]
   }, {
      name: 'Bodyguard',
      count: 0,
      instructions: [
         { message: 'Bodyguard, wake up.' },
         { message: 'Bodyguard, choose who you would like to protect.' },
         { message: 'Bodyguard, go to sleep.' }
      ]
   }];
   
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
}]);

werewolfApp.controller('ScriptController', ['$scope', '$rootScope', function($scope, $rootScope) {
   $scope.renderSection = false;
   $scope.instructions = [];
   $scope.round = 0;
   
   $scope.activeInRound = function(actual, expected) {
      if (!actual.rounds) {
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