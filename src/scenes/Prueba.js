class Prueba extends Phaser.Scene {
    constructor(){
      super("Prueba");
    }
  
    preload(){
        this.load.image('bgPrueba', 'assets/jgb/home.png');
        this.load.video('videoPublicidad1', ['assets/tarrito_rojo.mp4']);
    }
  
    async create(){
        this.background = this.add.image(270, 380, 'bgPrueba');
        this.video = this.add.video(270, 400, 'videoPublicidad1').setScale(0.8);
        this.video.play();
    }

  }
  
  export default Prueba;