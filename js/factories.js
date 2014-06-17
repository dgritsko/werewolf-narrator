'use strict';

werewolfApp.factory('roles', function() {
var makeRole = function(name, instructions, extraArgs) {
   var role = {
      name: name,
      count: 0,
      instructions: instructions || []
   };
   
   if (extraArgs) {
      var recognizedArgs = ['shouldDisplay', 'maxCount', 'balance'];
   
      for(var k in extraArgs) {
         if (recognizedArgs.indexOf(k) >= 0) {
            role[k] = extraArgs[k];
         } else {
            console.log('unrecognized role argument: ' + k);
         }
      }
   }
   
   return role;
};

var makeInstruction = function(message, rounds, extraArgs) {
   var instruction = {
      message: message,
      rounds: rounds || []
   };

   if (extraArgs) {
      var recognizedArgs = ['id', 'parentId'];
   
      for(var k in extraArgs) {
         if (recognizedArgs.indexOf(k) >= 0) {
            instruction[k] = extraArgs[k];
         } else {
            console.log('unrecognized instruction argument: ' + k);
         }
      }
   }
   
   return instruction;
};

return [
makeRole('Apprentice Seer', [], { balance: 4 }),
makeRole('Aura Seer', [], { balance: 3 }),
makeRole('Bodyguard',
   [
      makeInstruction('Bodyguard, wake up.'),
      makeInstruction('Bodyguard, choose who you would like to protect.'),
      makeInstruction('Bodyguard, go to sleep.')
   ], { maxCount: 1, balance: 3 }),
makeRole('Cupid',
   [
      makeInstruction('Cupid, wake up.', [0]),
      makeInstruction('Cupid, choose the two lovers.', [0]),
      makeInstruction('Cupid, go to sleep.', [0])      
   ], { maxCount : 1, balance: -3 } ),
makeRole('Diseased', [], { balance: 3 }),
makeRole('Ghost', [], { maxCount: 1, balance: 2 }),
makeRole('Hunter', [], { balance: 3 }),
makeRole('Idiot', [], { maxCount: 1, shouldDisplay: true, balance: 2 }),
makeRole('Lycan', [], { balance: -1 }),
makeRole('Magician', [], { balance: 4 }),
makeRole('Martyr', [], { balance: 3 }),
makeRole('Mason',
   [
      makeInstruction('Masons, wake up.', [0]),
      makeInstruction('Masons, identify each other.', [0]),
      makeInstruction('Masons, go to sleep.', [0]),      
   ], { maxCount: 3, balance: 2 }),
makeRole('Mayor', [], { balance: 2 }),
makeRole('Old Hag', [], { balance: 1 }),
makeRole('Old Man', [], { balance: 0 }),
makeRole('P.I.', [], { balance: 3 }),
makeRole('Pacifist', [], { maxCount: 1, shouldDisplay: true, balance: -2 }),
makeRole('Priest', [], { balance: 3 }),
makeRole('Prince', [], { balance: 3 }),
makeRole('Seer', 
   [
      makeInstruction('Seer, wake up.'),
      makeInstruction('Seer, choose your suspect.'),
      makeInstruction('Seer, go to sleep.')      
   ], { maxCount : 1, balance: 7 } ),
makeRole('Spellcaster', [], { balance: 1 }),
makeRole('Tough Guy', [], { balance: 3 }),
makeRole('Troublemaker', [], { balance: 2 }),
makeRole('Villager', [], { balance: 1, shouldDisplay: true }),
makeRole('Witch', [], { balance: 4 }),
makeRole('Sorcerer', [], { balance: -3 }),
makeRole('Minion', [], { balance: -6 }),
makeRole('Werewolf',
   [  
      makeInstruction('Werewolves, wake up.'),
      makeInstruction('Werewolves, identify each other.', [0], { id : 'werewolf_wakeup' }),
      makeInstruction('Werewolves, choose your victim.'),
      makeInstruction('Werewolves, go to sleep.')
   ], { balance: -6 }),
makeRole('Wolf Cub', 
   [
      makeInstruction('Wolf Cub, identify yourself.', [0], { parentId: 'werewolf_wakeup' })
   ], { maxCount: 1, balance: -8 }),
makeRole('Cursed', [], { balance: -3 }),
makeRole('Doppelganger', [], { balance: -2 }),
makeRole('Drunk', [], { balance: -3 }),
makeRole('Lovers'),
makeRole('Cult Leader', [], { balance: 1 }),
makeRole('Hoodlum', [], { balance: 0 }),
makeRole('Tanner', [], { balance: 1 }),
makeRole('Lone Wolf', [], { balance: -5 }),
makeRole('Vampire', [], { balance: -7 }),
makeRole('Amulet of Protection')
];
});