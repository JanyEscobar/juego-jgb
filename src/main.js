import InputTextPlugin from '../node_modules/phaser3-rex-plugins/plugins/inputtext-plugin.js';
import Home from './scenes/Home.js';
import Homescene from './scenes/Homescene.js';
import Registro from './scenes/Registro.js';
import Resultado from './scenes/Resultado.js';
import Demo from './scenes/Demo.js';
import Game from './scenes/game.js';
import Score from './scenes/Score.js';
import Prueba from './scenes/Prueba.js';

const config = {
  title: 'Juego-JGB',
  url: 'http://k2digital.io',
  version: '0.0.1',

  pixelArt: true,

  // type: Phaser.AUTO,
  type: Phaser.CANVAS,
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
  plugins: {
    global: [{
        key: 'rexInputTextPlugin',
        plugin: InputTextPlugin,
        start: true
    },]
  },
  input: {
    touch: true,
  },

  // scene: [Prueba]
  scene: [Home, Registro, Demo, Homescene, Resultado, Game, Score]
};

const game = new Phaser.Game(config);

function resize() {
  var scaleX = window.innerWidth / game.config.width;
  var scaleY = window.innerHeight / game.config.height;
  var scale = Math.min(scaleX, scaleY);
  game.canvas.setAttribute('style', 'transform: scale(' + scale + ');');
}

window.addEventListener('resize', resize);