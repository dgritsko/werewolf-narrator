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
makeRole('Apprentice Seer'),
makeRole('Aura Seer'),
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
   ], { maxCount : 1 } ),
makeRole('Diseased'),
makeRole('Ghost', [], { maxCount: 1 }),
makeRole('Hunter'),
makeRole('Idiot', [], { maxCount: 1, shouldDisplay: true }),
makeRole('Lycan'),
makeRole('Magician'),
makeRole('Martyr'),
makeRole('Mason',
   [
      makeInstruction('Masons, wake up.', [0]),
      makeInstruction('Masons, identify each other.', [0]),
      makeInstruction('Masons, go to sleep.', [0]),      
   ], { maxCount: 3 }),
makeRole('Mayor'),
makeRole('Old Hag'),
makeRole('Old Man'),
makeRole('P.I.'),
makeRole('Pacifist', [], { maxCount: 1, shouldDisplay: true }),
makeRole('Priest'),
makeRole('Prince'),
makeRole('Seer', 
   [
      makeInstruction('Seer, wake up.'),
      makeInstruction('Seer, choose your suspect.'),
      makeInstruction('Seer, go to sleep.')      
   ], { maxCount : 1, balance: 7 } ),
makeRole('Spellcaster'),
makeRole('Tough Guy'),
makeRole('Troublemaker'),
makeRole('Villager', [], { balance: 1, shouldDisplay: true }),
makeRole('Witch'),
makeRole('Sorcerer'),
makeRole('Minion'),
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
   ], { maxCount: 1, balance: -6 }),
makeRole('Cursed'),
makeRole('Doppelganger'),
makeRole('Drunk'),
makeRole('Lovers'),
makeRole('Cult Leader'),
makeRole('Hoodlum'),
makeRole('Tanner'),
makeRole('Lone Wolf'),
makeRole('Vampire'),
makeRole('Amulet of Protection')
];
});