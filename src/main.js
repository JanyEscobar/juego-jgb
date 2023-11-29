import InputTextPlugin from '../node_modules/phaser3-rex-plugins/plugins/inputtext-plugin.js';
import Home from './scenes/Home.js';
import Homescene from './scenes/Homescene.js';
import Registro from './scenes/Registro.js';
import Resultado from './scenes/Resultado.js';
import Demo from './scenes/Demo.js';
import Game from './scenes/game.js';
import Score from './scenes/Score.js';
import Opcion from './scenes/Opcion.js';
import Login from './scenes/Login.js';

window.esPC = window.matchMedia("(min-width: 768px)").matches;

if (esPC) {
  window.innerWidth = 300;
  window.innerHeight = 600;
}

const config = {
  title: 'Juego-JGB',
  url: 'http://k2digital.io',
  version: '0.0.1',

  antialias: true,
  pixelArt: false,
  roundPixels: true,
  resolution: 2,

  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  scale: {
    mode: Phaser.Scale.FIT,
    // mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  parent: 'container',
  backgroundColor: '#FFFFFF',

  render: {
    pixelArt: false,
    antialias: true,
    roundPixels: true,
},

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

  // scene: [Demo]
  scene: [Home, Registro, Demo, Homescene, Resultado, Game, Score, Opcion, Login]
};

const game = new Phaser.Game(config);