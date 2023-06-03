import Home from './scenes/Home.js';
import Homescene from './scenes/Homescene.js';
import Registro from './scenes/Registro.js';
import Resultado from './scenes/Resultado.js';
import Demo from './scenes/Demo.js';
import Game from './scenes/game.js';

const config = {
  title: 'Juego-JGB',
  url: 'http://k2digital.io',
  version: '0.0.1',

  pixelArt: true,

  type: Phaser.AUTO,
  // type: Phaser.CANVAS,
  width: 540,
  height: 780,
  parent: 'container',
  backgroundColor: '#FFFFFF',

  banner: {
    hidePhaser: true,
    text: '#000000',
    background: [
      'red',
      'yellow',
      'red',
      'transparent'
    ]
  },

  physics: {
    default: 'arcade',
    arcade: {
      gravity: {y: 40},
      debug: false
    }
  },
  dom: {
      createContainer: true
  },

  scene: [Home, Registro, Demo, Homescene, Resultado, Game]
};

const game = new Phaser.Game(config);
